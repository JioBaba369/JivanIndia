import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAZVAziYTWOKYHQg-s3gBzn1YxOLUS0HPk",
  authDomain: "jivanindiaco.firebaseapp.com",
  projectId: "jivanindiaco",
  storageBucket: "jivanindiaco.appspot.com",
  messagingSenderId: "1028353740894",
  appId: "1:1028353740894:web:4b184058760c81d8a6a4cf",
  measurementId: "G-X25J03DP77"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics if supported
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      getAnalytics(app);
    }
  });
}


export { app, auth, firestore, storage };
