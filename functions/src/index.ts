/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp, getApps, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { AboutContent } from "./types";

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp();
}

/**
 * Cloud Function to update user custom claims when the admin list changes.
 * This function triggers whenever the 'about/singleton' document is updated.
 */
exports.updateUserClaims = onDocumentUpdated("about/{docId}", async (event) => {
  if (event.params.docId !== "singleton") {
    logger.info("Document other than singleton was updated. Exiting.");
    return;
  }

  const dataBefore = event.data?.before.data() as AboutContent | undefined;
  const dataAfter = event.data?.after.data() as AboutContent | undefined;

  if (!dataAfter) {
    logger.error("No data found after update.");
    return;
  }
  
  const beforeAdmins = new Set(dataBefore?.adminUids || []);
  const afterAdmins = new Set(dataAfter.adminUids);

  const uidsToUpdate: string[] = [];

  // Find admins who were added
  afterAdmins.forEach(uid => {
    if (!beforeAdmins.has(uid)) {
      uidsToUpdate.push(uid);
    }
  });

  // Find admins who were removed
  beforeAdmins.forEach(uid => {
    if (!afterAdmins.has(uid)) {
      uidsToUpdate.push(uid);
    }
  });

  if (uidsToUpdate.length === 0) {
    logger.info("No change in admin list. No claims to update.");
    return;
  }

  logger.info(`Admin list changed. Updating claims for UIDs: ${uidsToUpdate.join(', ')}`);

  const auth = getAuth();
  
  const updatePromises = uidsToUpdate.map(async (uid) => {
    try {
      const userRecord = await auth.getUser(uid);
      const currentClaims = userRecord.customClaims || {};
      const isAdmin = afterAdmins.has(uid);

      if (currentClaims.admin === isAdmin) {
        logger.info(`User ${uid} already has the correct admin claim (${isAdmin}). Skipping.`);
        return;
      }

      logger.info(`Setting admin claim for user ${uid} to ${isAdmin}`);
      await auth.setCustomUserClaims(uid, { ...currentClaims, admin: isAdmin });
    } catch (error) {
      logger.error(`Failed to update claims for user ${uid}`, error);
    }
  });

  await Promise.all(updatePromises);
  logger.info("Finished updating all user claims.");
});


/**
 * Helper type definition for the AboutContent structure.
 * This should mirror the definition in the main application.
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

export interface AboutContent {
  story: string;
  teamMembers: TeamMember[];
  adminUids: string[];
  logoUrl?: string;
  faviconUrl?: string;
}
