import admin from "firebase-admin";
const { FIREBASE_CONNECTION } = process.env;

var serviceAccount: string = JSON.parse(FIREBASE_CONNECTION as string);

if (admin.apps.length === 0) {
   admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const firestore = admin.firestore();

export { firestore };
