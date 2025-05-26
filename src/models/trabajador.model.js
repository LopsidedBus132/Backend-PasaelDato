const db = require('../config/db');

const obtenerTrabajadores = async () => {
  const { rows } = await db.query('SELECT * FROM trabajadores');
  return rows;
}

const obtenerTrabajadorByUid = async (firebase_uid) => {
  const result = await db.query(
    'SELECT * FROM trabajador WHERE firebase_uid = $1',
    [firebase_uid]
  );
  return result.rows[0];
};

module.exports = { 
  obtenerTrabajadores,
  obtenerTrabajadorByUid
};