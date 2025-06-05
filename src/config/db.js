const { Pool } = require('pg');
require('dotenv').config();

/* Para conexion a base de datos externa
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
*/
//conexion a base de datos LOCAL
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Pasaeldato',
  user: 'postgres',
  password: 'admin', // cambia esto si tu contraseña es distinta
});

// Captura errores inesperados en el pool de PostgreSQL (evita crashes silenciosos)
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL', err);
    process.exit(-1);  // Sale para que un gestor reinicie el proceso si hay error fatal
  });

module.exports = pool;
