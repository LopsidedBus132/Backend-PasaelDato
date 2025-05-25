
const db = require('../config/db');


const crearUsuario = async ({
    firebase_uid,
    nombre,
    email,
    telefono,
    foto_perfil,
    latitud,
    longitud,
    direccion
  }) => {
    const query = `
      INSERT INTO USUARIO (
        firebase_uid, nombre, email, telefono, fecha_registro,
        foto_perfil, latitud, longitud, direccion
      ) VALUES (
        $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7, $8
      ) RETURNING *`;
  
    const values = [firebase_uid, nombre, email, telefono, foto_perfil, latitud, longitud, direccion];
    const result = await db.query(query, values);
    return result.rows[0];
};


const obtenerPorUid = async (firebase_uid) => {
  const result = await db.query(
    'SELECT * FROM USUARIO WHERE firebase_uid = $1',
    [firebase_uid]
  );
  return result.rows[0];
};



module.exports = {
    crearUsuario,
    obtenerPorUid
};
