
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// This function can be called multiple times, but it will only initialize
// the app and services once, making it safe to use in layouts and components.
export function initializeFirebase() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }

  const apps = getApps();
  const app = !apps.length ? initializeApp(firebaseConfig) : getApp();

  // Initialize Analytics and Performance Monitoring
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


  // Initialize App Check
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

  return app;
}
