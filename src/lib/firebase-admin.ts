
import admin from 'firebase-admin';
import { getApps, cert, type App } from 'firebase-admin/app';

// Function to safely initialize Firebase Admin SDK
function initializeFirebaseAdmin(): App {
    if (getApps().length) {
        return getApps()[0];
    }

    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
        return admin.initializeApp({
            credential: cert(serviceAccount)
        });
    } catch (error) {
        console.error('Firebase Admin SDK initialization failed:', error);
        // This will prevent the app from starting without proper config
        // which is safer than running in a misconfigured state.
        throw new Error('Could not initialize Firebase Admin SDK. Service account key might be missing or invalid.');
    }
}

const adminApp = initializeFirebaseAdmin();
const adminDb = admin.firestore();

export { adminApp, adminDb };
