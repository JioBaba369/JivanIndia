
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAZVAziYTWOKYHQg-s3gBzn1YxOLUS0HPk",
  authDomain: "jivanindiaco.firebaseapp.com",
  projectId: "jivanindiaco",
  storageBucket: "jivanindiaco.appspot.com",
  messagingSenderId: "1028353740894",
  appId: "1:1028353740894:web:4b184058760c81d8a6a4cf",
  measurementId: "G-X25J03DP77"
};

let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let firestore: ReturnType<typeof getFirestore>;
let storage: ReturnType<typeof getStorage>;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);

    isAnalyticsSupported().then(supported => {
      if (supported && firebaseConfig.measurementId) {
        try {
          getAnalytics(app);
        } catch (e) {
          console.warn("Failed to initialize Firebase Analytics", e);
        }
      }
    });

    try {
      getPerformance(app);
    } catch (e) {
      console.warn("Failed to initialize Firebase Performance", e);
    }

    try {
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== 'YOUR_RECAPTCHA_V3_SITE_KEY') {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
          isTokenAutoRefreshEnabled: true,
        });
      }
    } catch (e) {
      console.warn("Failed to initialize Firebase App Check", e);
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Fallback for environments where Firebase can't initialize
    app = {} as FirebaseApp;
    auth = {} as any;
    firestore = {} as any;
    storage = {} as any;
  }
} else {
  // Server-side or non-browser environment
  app = {} as FirebaseApp;
  auth = {} as any;
  firestore = {} as any;
  storage = {} as any;
}

export { app, auth, firestore, storage };
