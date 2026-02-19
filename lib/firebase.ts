import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy initialization for client-side only
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

function getApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

function getAuthInstance(): Auth {
  if (!auth) {
    auth = getAuth(getApp());
  }
  return auth;
}

function getDbInstance(): Firestore {
  if (!db) {
    db = getFirestore(getApp());
  }
  return db;
}

export const googleProvider = new GoogleAuthProvider();

// Export getter functions for lazy initialization
export { getAuthInstance as getAuth, getDbInstance as getDb };

// For backwards compatibility, also export as auth and db
// These will be initialized on first client-side access
export { getAuthInstance, getDbInstance };
