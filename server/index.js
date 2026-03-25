const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const upload = require('./upload');
const { sendEmail } = require('./email');
const { scrapeQuotes, getDropdownData } = require('./scraper');
const db = require('./database');
const { db: firebaseDb } = require('./firebase');
require('./manager');

dotenv.config();

const app = express();
app.set('trust proxy', 1); // Crucial for Render reverse proxy to pass real IPs to rate limiters
const port = process.env.PORT || 3000;

// Security: Flexible CORS
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); // Allow curl/postman/backend requests

        const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
        const normalizedOrigin = origin.replace(/\/$/, ""); // Strip trailing slashes
        
        // Auto-allow vercel.app domains and exact frontend url matches
        if (normalizedOrigin.endsWith('.vercel.app') || allowedOrigins.some(o => o && o.replace(/\/$/, "") === normalizedOrigin)) {
            return callback(null, true);
        }

        callback(new Error(`Not allowed by CORS. Origin blocked: ${origin}`));
    }
}));
app.use(express.json());

// Security: Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: { success: false, error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
const scrapeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 scrape requests
    message: { success: false, error: "Too many quote requests, please try again later." }
});

// Explicit limiters for Auth Endpoints
const otpRequestLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes cooldown
    max: 1, 
    message: { success: false, error: "Please wait 2 minutes before requesting another code." },
});
const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Max 5 guesses per 15 minutes per IP
    max: 5, 
    message: { success: false, error: "Too many verification attempts. Please try again later." },
});

app.get('/', (req, res) => {
    res.send('Car Insurance API Running');
});

// Render Free Tier Keep-Alive Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Admin Auth Middleware
const verifyAdmin = (req, res, next) => {
    const apiKey = req.headers['x-admin-api-key'];
    if (!process.env.ADMIN_API_KEY) {
        // If not set in .env, default to insecure for backwards compatibility locally until set
        console.warn("WARNING: ADMIN_API_KEY is not set in .env");
    } else if (apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Unauthorized. Invalid Admin API Key." });
    }
    next();
};

// Global Store for OTPs
const otpStore = new Map();

// Authentication API (OTP SYSTEM)
app.post('/api/auth/request-otp', otpRequestLimiter, async (req, res) => {
    const { email } = req.body;
    
    // Strict Owner Lockout
    if (email !== 'nattakittivaofficial.forwork@gmail.com') {
        return res.status(403).json({ success: false, error: "Access Denied." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    otpStore.set(email, {
        code: otp,
        attempts: 0,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 Mins expiration
    });

    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: 'chonburiinsure.report@gmail.com', pass: 'jtmo xzab cdit cewx' }
        });
        
        await transporter.sendMail({
            from: '"CBI Secure Auth" <chonburiinsure.report@gmail.com>',
            to: email,
            subject: "Your Admin Access Code - CBIINSURE",
            html: `<div style="font-family: sans-serif; padding: 30px; background-color: #09090b; color: #f4f4f5; border-radius: 12px; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #10b981; margin-top: 0;">Admin Login Request</h2>
                <p style="font-size: 16px;">Hello. An administrative login attempt has been initiated. Your 6-digit access code is:</p>
                <div style="font-size: 38px; font-weight: bold; padding: 20px; background: #18181b; display: inline-block; border-radius: 8px; letter-spacing: 6px; color: #10b981; border: 1px solid #27272a; margin: 10px 0;">${otp}</div>
                <p style="color: #a1a1aa; font-size: 13px; margin-top: 20px; line-height: 1.5;">This code expires strictly in 5 minutes. If you did not request this OTP, you may safely ignore this email.</p>
            </div>`
        });
        res.json({ success: true, message: "Secure code dispatched." });
    } catch (e) {
        console.error("OTP Mailer Error:", e);
        res.status(500).json({ success: false, error: "Failed to dispatch email." });
    }
});

app.post('/api/auth/verify-otp', otpVerifyLimiter, (req, res) => {
    const { email, otp } = req.body;
    
    if (email !== 'nattakittivaofficial.forwork@gmail.com') {
        return res.status(403).json({ success: false, error: "Access Denied." });
    }

    const record = otpStore.get(email);
    if (!record) {
        return res.status(400).json({ success: false, error: "Code expired or none requested." });
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, error: "Validation code has expired." });
    }

    if (record.code !== otp) {
        record.attempts += 1;
        if (record.attempts >= 3) {
            otpStore.delete(email); // Max 3 guesses!
            return res.status(400).json({ success: false, error: "Max attempts reached. Code obliterated. Please request a new one." });
        }
        return res.status(400).json({ success: false, error: "Incorrect validation code." });
    }

    // Success! Wipe code and grant Key
    otpStore.delete(email);
    res.json({ success: true, apiKey: process.env.ADMIN_API_KEY });
});

// Settings API
app.get('/api/settings', verifyAdmin, async (req, res) => {
    try {
        const configDoc = await firebaseDb.collection('config').doc('email').get();
        res.json(configDoc.exists ? configDoc.data() : {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', verifyAdmin, async (req, res) => {
    try {
        const { sender_email, receiver_email, email_subject, email_body_template } = req.body;
        await firebaseDb.collection('config').doc('email').set({
            sender_email, 
            receiver_email, 
            email_subject, 
            email_body_template
        }, { merge: true });
        res.json({ message: "Settings updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit Form API
app.post('/api/submit', apiLimiter, upload.array('files'), async (req, res) => {
    try {
        console.log("Data received:", req.body);
        console.log("Files received:", req.files);

        // Send email
        const info = await sendEmail(req.body, req.files);

        res.json({ success: true, message: "Request submitted and email sent", debug_info: info });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Live Scraper API
app.post('/api/quotes', scrapeLimiter, async (req, res) => {
    try {
        const { year, brand, model, submodel } = req.body;
        console.log(`Searching live quotes for: ${brand} ${model} (${year})`);
        
        // Call the proxy scraper
        const result = await scrapeQuotes(req.body);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error("Quotes API Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch quotes via proxy." });
    }
});

// Dropdown API for 100% accurate cascading form
app.post('/api/cars/dropdown', apiLimiter, async (req, res) => {
    try {
        const { step, year, brand, model } = req.body;
        const params = { year, brand, model };
        
        const data = await getDropdownData(step, params);
        res.json({ success: true, data });
    } catch (error) {
        console.error("Dropdown API Error:", error.message);
        res.status(500).json({ success: false, error: "Failed to fetch dropdown data." });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
