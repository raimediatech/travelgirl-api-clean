import admin from "firebase-admin";
import serviceAccount from "../capri-302ac-firebase-adminsdk-wrh5u-4523c6bf3b.json" assert { type: "json" };

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});

// Export the `admin` instance to be used in other files
export default admin;
