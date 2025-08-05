
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAZVAziYTWOKYHQg-s3gBzn1YxOLUS0HPk",
  authDomain: "jivanindiaco.firebaseapp.com",
  projectId: "jivanindiaco",
  storageBucket: "jivanindiaco.firebasestorage.app",
  messagingSenderId: "1028353740894",
  appId: "1:1028353740894:web:4b184058760c81d8a6a4cf",
  measurementId: "G-X25J03DP77"
};

function initializeServices() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(firestore, 'localhost', 8080);
    // connectStorageEmulator(storage, 'localhost', 9199);
  }

  isAnalyticsSupported().then(supported => {
      if (supported && firebaseConfig.measurementId) {
          try {
              getAnalytics(app);
          } catch(e) {
              console.warn("Failed to initialize Firebase Analytics", e);
          }
      }
  });
  
  try {
    getPerformance(app);
  } catch(e) {
    console.warn("Failed to initialize Firebase Performance", e);
  }

  try {
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== 'YOUR_RECAPTCHA_V3_SITE_KEY') {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
          isTokenAutoRefreshEnabled: true,
        });
      }
  } catch(e) {
    console.warn("Failed to initialize Firebase App Check", e);
  }


  return { app, auth, firestore, storage };
}


export const { app, auth, firestore, storage } = initializeServices();
