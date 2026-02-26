// import * as admin from "firebase-admin";

// if (!admin.apps.length) {
//     admin.initializeApp();
// }

// export const firestoreInstance = admin.firestore();
// export const FieldValue = admin.firestore.FieldValue;
import * as admin from "firebase-admin";
import { Auth, getAuth } from "firebase-admin/auth";

import * as client from "firebase/app"


//const serviceAccount = require("D:/Projects/CuryKing/Resources/Gcloud keys/fooddelivery-7eac6-fcb23b44d0bb.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     serviceAccountId: 'firebase-adminsdk-pi5vi@fooddelivery-7eac6.iam.gserviceaccount.com',
// });

const firebaseConfig = {
    apiKey: "AIzaSyAyJLUpzkPTkEhWQ_J05-5-bzN-WcucbiI",
    authDomain: "child-health-system-6ba6d.firebaseapp.com",
    projectId: "child-health-system-6ba6d",
    storageBucket: "child-health-system-6ba6d.firebasestorage.app",
    messagingSenderId: "1030939299208",
    appId: "1:1030939299208:web:a0237c00b6b80d26663e3d"
};

admin.initializeApp();
client.initializeApp(firebaseConfig);

export const firestoreInstance = admin.firestore();

// Enable ignoreUndefinedProperties option
firestoreInstance.settings({ ignoreUndefinedProperties: true });

export const getNewFirestoreDocumentID = (collectionName: string) => {
    // Generate a new document reference with an auto-generated ID
    const newDocRef = firestoreInstance.collection(collectionName).doc();

    // Return the auto-generated ID
    return newDocRef.id;
};

let authInstance: Auth | null = null;

const auth = (): Auth => {
    if (authInstance === null) {
        authInstance = getAuth();
    }

    return authInstance;
};

//getAuth

export { auth };
