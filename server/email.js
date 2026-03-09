const nodemailer = require('nodemailer');

// Configure your transport here. 
const createTransporter = async () => {
    // Ethereal for testing
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

const sendEmail = async (data, files) => {
    // Config is passed inside data._config
    const config = data._config || {};

    return new Promise(async (resolve, reject) => {
        try {
            const transporter = await createTransporter();

            // Use config or defaults
            let subject = config.email_subject || "New Insurance Request";
            let htmlBody = config.email_body_template || "Data received: <pre>{data}</pre>";
            const receiver = config.receiver_email || "admin@example.com";
            const sender = config.sender_email || "noreply@example.com";

            // Replacements
            htmlBody = htmlBody.replace(/{name}/g, data.name || 'Customer');
            htmlBody = htmlBody.replace(/{email}/g, data.email || '');
            htmlBody = htmlBody.replace(/{carMake}/g, data.carMake || '');
            htmlBody = htmlBody.replace(/{data}/g, JSON.stringify(data, null, 2));

            /* 
               Note: `files` coming from Firestore trigger logic are distinct from 
               Express array. For V2 we effectively skipped file attachment logic 
               temporarily as we moved logic to "manager.js" which just has 
               metadata. We pass empty array for now or need to download from URL.
            */
            const attachments = Array.isArray(files) ? files.map(f => ({
                filename: f.originalname,
                path: f.path
            })) : [];

            const info = await transporter.sendMail({
                from: `"${sender}" <${sender}>`,
                to: receiver,
                subject: subject,
                html: htmlBody,
                attachments: attachments
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            resolve(info);
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = { sendEmail };
