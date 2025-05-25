const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Captura errores inesperados en el pool de PostgreSQL (evita crashes silenciosos)
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL', err);
    process.exit(-1);  // Sale para que un gestor reinicie el proceso si hay error fatal
  });

module.exports = pool;
