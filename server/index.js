const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const upload = require('./upload');
const { sendEmail } = require('./email');
const db = require('./database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Car Insurance API Running');
});

// Settings API
app.get('/api/settings', (req, res) => {
    db.get("SELECT * FROM settings LIMIT 1", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.post('/api/settings', (req, res) => {
    const { sender_email, receiver_email, email_subject, email_body_template } = req.body;
    db.run(
        `UPDATE settings SET sender_email = ?, receiver_email = ?, email_subject = ?, email_body_template = ? WHERE id = 1`,
        [sender_email, receiver_email, email_subject, email_body_template],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Settings updated" });
        }
    );
});

// Submit Form API
app.post('/api/submit', upload.array('files'), async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
