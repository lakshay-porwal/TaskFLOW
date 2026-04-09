const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

try {
  // Option 1: Initialize using a downloaded serviceAccountKey.json
  // const serviceAccount = require('./serviceAccountKey.json');
  // admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  // Option 2: Initialize using environment variables (better for production)
  // Format private key correctly due to newline characters in ENV
  const privateKey = process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  });

  console.log('Firebase Admin Initialized Successfully');
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error);
}

const db = admin.firestore();

module.exports = { db, admin };
