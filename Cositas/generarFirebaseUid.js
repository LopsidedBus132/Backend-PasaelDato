require("dotenv").config();
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const fs = require("fs");
const csv = require("csv-parser");

// Configuración de Firebase
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

// Archivo de salida
const outputFile = fs.createWriteStream("usuarios_con_uid.txt", { flags: "a" });

// Función principal
const procesarUsuario = async ({ email, password }) => {
  try {
    let user;

    try {
      user = await admin.auth().getUserByEmail(email);
      console.log(`🔄 Usuario ya existe: ${email}`);
    } catch {
      user = await admin.auth().createUser({ email, password });
      console.log(`✅ Usuario creado: ${email}`);
    }

    // Crear token personalizado e iniciar sesión para obtener token de acceso
    const customToken = await admin.auth().createCustomToken(user.uid);
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

    // Extraer UID desde el token
    const tokenParts = data.idToken.split(".");
    const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString("utf8"));
    const firebaseUid = payload.sub;

    // Escribir en archivo
    outputFile.write(`${email},${firebaseUid}\n`);
    console.log(`📄 Guardado UID de ${email}: ${firebaseUid}`);
  } catch (err) {
    console.error(`❌ Error con ${email}:`, err.message || err);
  }
};

// Leer el archivo CSV con solo email y password
fs.createReadStream("Cositas/usuarios.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (row.email && row.password) {
      procesarUsuario(row);
    } else {
      console.warn("⚠️ Fila inválida:", row);
    }
  })
  .on("end", () => {
    console.log("✅ Procesamiento de usuarios completado.");
  });
