// generateIdToken.js
require("dotenv").config();
const admin = require("firebase-admin");
const fetch = require("node-fetch");

// Configura el service account manualmente con variables del .env
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const generateIdToken = async () => {
  try {
    const uid = "9jODGnKtGFTqlEFbUYTVi9ruegq1";

    // 1. Crear custom token
    const customToken = await admin.auth().createCustomToken(uid);

    // 2. Intercambiarlo por un ID token real
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: customToken,
          returnSecureToken: true,
        }),
      }
    );

    const data = await res.json();
    if (data.error) throw new Error(JSON.stringify(data.error));

    console.log("✅ ID Token:", data.idToken);
    console.log("👤 UID:", data.localId);
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

generateIdToken();
