const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let db = null;

try {
    const keyPath = path.join(__dirname, "serviceAccountKey.json");
    if (fs.existsSync(keyPath)) {
        const serviceAccount = require(keyPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        console.log("Firebase Admin SDK successfully initialized.");
    } else {
        console.warn("\n[WARNING] serviceAccountKey.json is completely missing! Firebase features will be disabled until you upload it to Render as a Secret File.\n");
    }
} catch (error) {
    console.error("Firebase SDK crashed on boot:", error.message);
}

module.exports = { db, admin };
