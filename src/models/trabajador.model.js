const db = require('../config/db');

async function obtenerTrabajadores() {
  const { rows } = await db.query('SELECT * FROM trabajadores');
  return rows;
}

module.exports = { obtenerTrabajadores };