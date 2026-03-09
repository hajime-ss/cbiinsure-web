const nodemailer = require('nodemailer');

// Configure your transport here. 
const createTransporter = async () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chonburiinsure.report@gmail.com',
            pass: 'jtmo xzab cdit cewx'
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
            const receiver = config.receiver_email || "chonburiinsure.report@gmail.com";
            const sender = config.sender_email || "chonburiinsure.report@gmail.com";

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

            // 1. Send Alert to Admin
            const adminInfo = await transporter.sendMail({
                from: `"${sender}" <${sender}>`,
                to: receiver,
                subject: subject,
                html: htmlBody,
                attachments: attachments
            });
            console.log("Admin Alert sent: %s", adminInfo.messageId);

            // 2. Send Confirmation to Customer
            let customerInfo = null;
            if (data.email) {
                const customerHTML = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #10b981;">Hi ${data.name || 'there'},</h2>
                        <p>We've successfully received your insurance application for your <strong>${data.carYear || ''} ${data.carMake || ''} ${data.carModel || ''}</strong>!</p>
                        <p>Our AI Manager and human staff are currently reviewing your details. We will get back to you with the best quote shortly.</p>
                        <br/>
                        <p style="color: #666; font-size: 12px;">This is an automated message from Chonburi Insurance. Please do not reply.</p>
                    </div>
                `;

                customerInfo = await transporter.sendMail({
                    from: `"Chonburi Insurance" <${sender}>`,
                    to: data.email,
                    subject: "We've received your application!",
                    html: customerHTML
                });
                console.log("Customer Confirmation sent: %s", customerInfo.messageId);
            }

            resolve({ adminInfo, customerInfo });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = { sendEmail };
