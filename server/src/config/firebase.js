const admin = require('firebase-admin');
const config = require('./env');

// Firebase service account credentials
const serviceAccount = {
  type: config.FIREBASE_TYPE,
  project_id: config.FIREBASE_PROJECT_ID,
  private_key_id: config.FIREBASE_PRIVATE_KEY_ID,
  private_key: config.FIREBASE_PRIVATE_KEY,
  client_email: config.FIREBASE_CLIENT_EMAIL,
  client_id: config.FIREBASE_CLIENT_ID,
  auth_uri: config.FIREBASE_AUTH_URI,
  token_uri: config.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: config.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: config.FIREBASE_CLIENT_X509_CERT_URL
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${config.FIREBASE_PROJECT_ID}.appspot.com`
  });
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
  admin,
  db,
  auth,
  storage
};