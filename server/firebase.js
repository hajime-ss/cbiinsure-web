// Using the Web SDK for the Manager Bot (Node.js environment)
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDJgnbMS00krwM196WAsDt2oV5hTkpWkuw",
    authDomain: "carinsuranceapp-77b89.firebaseapp.com",
    projectId: "carinsuranceapp-77b89",
    storageBucket: "carinsuranceapp-77b89.firebasestorage.app",
    messagingSenderId: "623005664357",
    appId: "1:623005664357:web:ff58b01af118efa9a5b28c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
