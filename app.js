const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');          // Seguridad HTTP básica
const admin = require('firebase-admin');   // Firebase Admin SDK
const { Pool } = require('pg');             // PostgreSQL client
require('dotenv').config();                  // Carga variables de entorno desde .env

const app = express();

// Middlewares básicos
app.use(cors());            // Permite peticiones CORS (ajustable según necesidades)
app.use(express.json());    // Parseo de JSON en request bodies
app.use(helmet());          // Seguridad HTTP (cabeceras para proteger tu app)

// Inicializar Firebase Admin con credenciales del archivo JSON
const serviceAccount = require('./Firebase/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Configuración del pool de conexiones PostgreSQL con la cadena en .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Captura errores inesperados en el pool de PostgreSQL (evita crashes silenciosos)
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL', err);
  process.exit(-1);  // Sale para que un gestor reinicie el proceso si hay error fatal
});

// Middleware para validar token Firebase en la cabecera Authorization
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado: falta token' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;  // Guardamos info del usuario autenticado para usar luego
    console.log(`Usuario autenticado con uid: ${decodedToken.uid}`);
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Ruta principal que sirve archivo estático HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Requerimientos.html'));
});

// Ruta protegida, requiere token Firebase válido, consulta datos en PostgreSQL
app.get('/api/datos', verifyFirebaseToken, async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tabla_ejemplo');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error en consulta a base de datos:', error);
    res.status(500).json({ error: 'Error interno en la base de datos' });
  }
});

// Endpoint para monitoreo / healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Middleware global para capturar errores no manejados
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Configuración y levantamiento del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
