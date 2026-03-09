const { db } = require('./firebase');
const { sendEmail } = require('./email');

console.log("\n==============================================");
console.log("   CHONBURI INSURANCE - MANAGER BOT V2.2 (ADMIN)");
console.log("   Status: ONLINE | Listening for submissions...");
console.log("==============================================\n");

// Listen for PENDING submissions using Admin SDK
const submissionsRef = db.collection("submissions");
const query = submissionsRef.where("status", "==", "PENDING");

const observer = query.onSnapshot(async (querySnapshot) => {
    querySnapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
            const data = change.doc.data();
            const docId = change.doc.id;

            console.log(`[${new Date().toLocaleTimeString()}] 🔔 NEW SUBMISSION DETECTED`);
            console.log(`   ID: ${docId} | Name: ${data.name}`);
            console.log(`   Action: Processing email...`);

            try {
                // Fetch dynamic configuration using Admin SDK
                const configDoc = await db.collection("config").doc("email").get();
                const config = configDoc.exists ? configDoc.data() : {};

                // Merge data with config for the emailer
                const emailData = {
                    ...data,
                    _config: config // Pass config to email sender
                };

                // Send Email via Nodemailer 
                await sendEmail(emailData, []); // Passing empty files array for now

                // Update Status to SENT using Admin SDK
                await submissionsRef.doc(docId).update({
                    status: "SENT",
                    processedAt: new Date()
                });

                console.log(`   ✅ SUCCESS: Email sent to ${config.receiver_email || 'Default Receiver'}`);
                console.log(`   ---`);
            } catch (error) {
                console.error(`   ❌ FAIL: Error sending email`, error.message);
                await submissionsRef.doc(docId).update({
                    status: "FAILED",
                    error: error.message
                });
            }
        }
    });
}, err => {
    console.log(`Encountered error: ${err}`);
});

// Prevent script from exiting
process.stdin.resume();
