
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

const esTrabajadorPorUid = async (firebase_uid) => {
  const result = await db.query(
    'SELECT * FROM TRABAJADOR WHERE firebase_uid = $1',
    [firebase_uid]
  );
  return result.rows;
}

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

const quitarFavorito = async (firebase_uid, idTrabajador) => {
  const result = await db.query(`
    DELETE FROM FAVORITO 
    WHERE firebase_uid_usuario = $1 AND id_trabajador = $2
    RETURNING *`,
    [firebase_uid, idTrabajador]
  );
  return result;
};

/**
 * Obtiene todos los trabajadores favoritos de un usuario, con datos completos.
 * 
 * @param {string} firebase_uid_usuario - UID del usuario autenticado.
 * @returns {Promise<Array>} - Lista de trabajadores favoritos con info detallada.
 */
const obtenerFavoritosPorUid = async (firebase_uid_usuario) => {
  const result = await db.query(`
    SELECT 
      t.id_trabajador,
      t.firebase_uid,
      u.nombre,
      u.email,
      u.telefono,
      u.foto_perfil,
      u.direccion AS direccion_usuario,
      t.descripcion,
      t.precio_hora,
      t.disponibilidad,
      t.ubicacion,
      t.latitud,
      t.longitud,
      t.radio_atencion_km,
      t.fecha_alta,
      t.verificado,
      t.activo,
      c.nombre AS nombre_categoria,
      c.descripcion AS descripcion_categoria,
      c.icono AS icono_categoria,
      tc.categoria_principal,
      f.fecha_agregado
    FROM 
      FAVORITO f
    JOIN 
      TRABAJADOR t ON f.id_trabajador = t.id_trabajador
    JOIN 
      USUARIO u ON t.firebase_uid = u.firebase_uid
    JOIN 
      TRABAJADOR_CATEGORIA tc ON t.id_trabajador = tc.id_trabajador
    JOIN 
      CATEGORIA c ON tc.id_categoria = c.id_categoria
    WHERE 
      f.firebase_uid_usuario = $1 
      AND t.activo = true
    ORDER BY 
      f.fecha_agregado DESC, tc.categoria_principal DESC, t.verificado DESC;
  `, [firebase_uid_usuario]);

  return result.rows;
};


module.exports = {
    crearUsuario,
    obtenerPorUid,
    editarPerfil,
    agregarFavorito,
    quitarFavorito,
    obtenerFavoritosPorUid,
    esTrabajadorPorUid
};
