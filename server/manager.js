const { db } = require('./firebase');
const { collection, onSnapshot, query, where, updateDoc, doc, getDoc } = require('firebase/firestore');
const { sendEmail } = require('./email');

console.log("\n==============================================");
console.log("   CHONBURI INSURANCE - MANAGER BOT V2.2");
console.log("   Status: ONLINE | Listening for submissions...");
console.log("==============================================\n");

// Listen for PENDING submissions
const q = query(collection(db, "submissions"), where("status", "==", "PENDING"));

const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            const docId = change.doc.id;

            console.log(`[${new Date().toLocaleTimeString()}] 🔔 NEW SUBMISSION DETECTED`);
            console.log(`   ID: ${docId} | Name: ${data.name}`);
            console.log(`   Action: Processing email...`);

            try {
                // Fetch dynamic configuration
                const configSnap = await getDoc(doc(db, "config", "email"));
                const config = configSnap.exists() ? configSnap.data() : {};

                // Merge data with config for the emailer
                const emailData = {
                    ...data,
                    _config: config // Pass config to email sender
                };

                // Send Email via Nodemailer 
                await sendEmail(emailData, []); // Passing empty files array for now

                // Update Status to SENT
                await updateDoc(doc(db, "submissions", docId), {
                    status: "SENT",
                    processedAt: new Date()
                });

                console.log(`   ✅ SUCCESS: Email sent to ${config.receiver_email || 'Default Receiver'}`);
                console.log(`   ---`);
            } catch (error) {
                console.error(`   ❌ FAIL: Error sending email`, error.message);
                await updateDoc(doc(db, "submissions", docId), {
                    status: "FAILED",
                    error: error.message
                });
            }
        }
    });
}, (error) => {
    console.error("Error connecting to Firebase:", error);
});

// Prevent script from exiting
process.stdin.resume();
