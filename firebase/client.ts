// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Fallback config in case env vars are not available
const fallbackConfig = {
  apiKey: "AIzaSyATF6lw7G1VjeB2IiaanXmWRtWMzqonOa4",
  authDomain: "wapi-40b90.firebaseapp.com",
  projectId: "wapi-40b90",
  storageBucket: "wapi-40b90.firebasestorage.app",
  messagingSenderId: "631485184532",
  appId: "1:631485184532:web:48f77dcb1703f00ddd8501",
  measurementId: "G-57LT9MF0P1",
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    fallbackConfig.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    fallbackConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: fallbackConfig.measurementId,
};

// Log Firebase config for debugging (without sensitive info)
console.log("Firebase config:", {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "***" : "missing",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { auth, db };
