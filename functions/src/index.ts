
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

/**
 * Triggered when the list of admin UIDs in the 'about/singleton' document changes.
 * It iterates through all users and updates their custom claims to reflect
 * whether they are an admin or not.
 */
export const updateUserClaims = functions.firestore
  .document("about/singleton")
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    if (!beforeData || !afterData) {
      console.log("Missing data in document change.");
      return null;
    }

    const beforeAdmins: string[] = beforeData.adminUids || [];
    const afterAdmins: string[] = afterData.adminUids || [];

    // Determine which UIDs were added or removed
    const uidsToUpdate = new Set([...beforeAdmins, ...afterAdmins]);

    if (uidsToUpdate.size === 0) {
      console.log("No admin UIDs changed.");
      return null;
    }

    try {
      const listUsersResult = await admin.auth().listUsers(1000);
      const allUsers = listUsersResult.users;
      const batch = db.batch();

      for (const userRecord of allUsers) {
        // Only update users whose admin status might have changed
        if (uidsToUpdate.has(userRecord.uid)) {
            const isAdmin = afterAdmins.includes(userRecord.uid);
            const currentClaims = (userRecord.customClaims || {}) as { admin?: boolean };

            if (currentClaims.admin !== isAdmin) {
                 console.log(
                    `Updating claims for ${userRecord.uid}. Setting admin to: ${isAdmin}`
                 );
                await admin.auth().setCustomUserClaims(userRecord.uid, { admin: isAdmin });
            }
        }
      }
      
      console.log("Successfully updated custom claims for relevant users.");
      return await batch.commit();

    } catch (error) {
      console.error("Error updating user claims:", error);
      return null;
    }
  });
