
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

const editarPerfil = async (firebase_uid,datosActualizado) => {
  const campos = Object.keys(datosActualizado).filter(
  (clave) => datosActualizado[clave] !== undefined
  );
  if (campos.length === 0){
    throw new Error('No se proporcionaron datos para actualizar.')
  }
  //Creacion dinamica de la consulta
  const setClause = campos.map((campo,i)=> `${campo} = $${i+1}`).join(', ');
  const values = campos.map((campo) => datosActualizado[campo]);
  //agregar el where final
  values.push(firebase_uid);

  //query completa
  const query = `
  UPDATE USUARIO
  SET ${setClause}
  WHERE firebase_uid = $${values.length}
  RETURNING *
  `
  const result = await db.query(query,values);
  return result;
};

const agregarFavorito = async (firebase_uid,idTrabajador) =>{
  const result = db.query(`
    INSERT INTO FAVORITO (firebase_uid_usuario, id_trabajador, fecha_agregado)
    VALUES ($1,$2, CURRENT_TIMESTAMP) RETURNING *`,
    [firebase_uid,idTrabajador]
  )
  return result;
};

module.exports = {
    crearUsuario,
    obtenerPorUid,
    editarPerfil,
    agregarFavorito
};
