const nodemailer = require('nodemailer');

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
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; }
                        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
                        .content { padding: 40px 30px; color: #3f3f46; line-height: 1.6; }
                        .greeting { font-size: 18px; font-weight: 600; color: #18181b; margin-bottom: 20px; }
                        .details-box { background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
                        .details-title { font-size: 14px; color: #047857; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
                        .vehicle { font-size: 16px; font-weight: 600; color: #18181b; margin: 0; }
                        .divider { height: 1px; background-color: #e4e4e7; margin: 30px 0; }
                        .contact-section { background-color: #fafafa; padding: 25px 30px; border-top: 1px solid #f4f4f5; }
                        .contact-title { font-size: 16px; font-weight: 600; color: #18181b; margin-top: 0; margin-bottom: 15px; }
                        .contact-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
                        .contact-item { font-size: 14px; color: #52525b; display: flex; align-items: center; }
                        .contact-item strong { color: #18181b; min-width: 70px; display: inline-block; }
                        .footer { background-color: #18181b; padding: 20px; text-align: center; color: #a1a1aa; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>CHONBURI INSURANCE</h1>
                        </div>
                        
                        <div class="content">
                            <div class="greeting">เรียน คุณ ${data.name || 'ลูกค้า'},</div>
                            <p>ทางเราได้รับข้อมูลคำขอทำประกันภัยของท่านเรียบร้อยแล้ว ขณะนี้เจ้าหน้าที่และระบบ AI Manager กำลังตรวจสอบรายละเอียดเพื่อจัดทำข้อเสนอที่ดีที่สุดให้แก่ท่าน โดยจะติดต่อกลับโดยเร็วที่สุด</p>
                            
                            <div class="divider"></div>
                            
                            <div class="greeting">Dear ${data.name || 'Customer'},</div>
                            <p>We have successfully received your insurance application. Our AI Manager and staff are currently reviewing your details to prepare the best possible quote for you. We will get back to you shortly.</p>
                            
                            <div class="details-box">
                                <div class="details-title">Vehicle Details / ข้อมูลรถยนต์</div>
                                <p class="vehicle">${data.carYear || ''} ${data.carMake || ''} ${data.carModel || ''}</p>
                            </div>
                        </div>

                        <div class="contact-section">
                            <h3 class="contact-title">ติดต่อสอบถามข้อมูลเพิ่มเติม (Contact Us)</h3>
                            <div class="contact-grid">
                                <div class="contact-item"><strong>Office:</strong> 081-002-2001</div>
                                <div class="contact-item"><strong>Fay:</strong> 089-983-9994</div>
                                <div class="contact-item"><strong>Chairoj:</strong> 089-949-2227</div>
                            </div>
                        </div>

                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Chonburi Insurance. All rights reserved.</p>
                            <p>This is an automated message. Please do not reply directly to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;

                customerInfo = await transporter.sendMail({
                    from: `"Chonburi Insurance" <${sender}>`,
                    to: data.email,
                    subject: "ได้รับข้อมูลการขอใบเสนอราคา / Application Received - Chonburi Insurance",
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
