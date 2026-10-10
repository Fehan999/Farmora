const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAAx-MZps145zYRuHFCJeunTsZdvMkANNw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "farmora-ccee4.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "farmora-ccee4",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "farmora-ccee4.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1005167142716",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1005167142716:web:eed4939477765eb8116039",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-RRLCECXGVH",
};

let appPromise;
let authPromise;
let dbPromise;

export function getFirebaseApp() {
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp, getApps, getApp }) =>
      getApps().length ? getApp() : initializeApp(firebaseConfig)
    );
  }
  return appPromise;
}

export function getAuthClient() {
  if (!authPromise) {
    authPromise = Promise.all([getFirebaseApp(), import("firebase/auth")]).then(([app, sdk]) => ({
      auth: sdk.getAuth(app),
      sdk,
    }));
  }
  return authPromise;
}

export function getDb() {
  if (!dbPromise) {
    dbPromise = Promise.all([getFirebaseApp(), import("firebase/firestore")]).then(([app, sdk]) => ({
      db: sdk.getFirestore(app),
      sdk,
    }));
  }
  return dbPromise;
}

export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  const [app, { getAnalytics, isSupported }] = await Promise.all([getFirebaseApp(), import("firebase/analytics")]);
  return (await isSupported()) ? getAnalytics(app) : null;
}
