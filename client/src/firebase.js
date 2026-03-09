import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJgnbMS00krwM196WAsDt2oV5hTkpWkuw",
    authDomain: "carinsuranceapp-77b89.firebaseapp.com",
    projectId: "carinsuranceapp-77b89",
    storageBucket: "carinsuranceapp-77b89.firebasestorage.app",
    messagingSenderId: "623005664357",
    appId: "1:623005664357:web:ff58b01af118efa9a5b28c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
