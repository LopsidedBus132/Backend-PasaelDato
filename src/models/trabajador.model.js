const db = require('../config/db');

const obtenerTrabajadores = async () => {
  // Corregí el nombre de la tabla y agregué JOIN con USUARIO
  const { rows } = await db.query(`
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
    FROM 
      TRABAJADOR t
    JOIN 
      USUARIO u ON t.firebase_uid = u.firebase_uid
    WHERE 
      t.activo = true
    ORDER BY 
      t.fecha_alta DESC
  `);
  return rows;
};

const obtenerTrabajadorByUid = async (firebase_uid) => {
  const result = await db.query(`
    SELECT 
      t.id_trabajador,
      t.firebase_uid,
      u.nombre,
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
      t.email
    FROM 
      TRABAJADOR t
    JOIN 
      USUARIO u ON t.firebase_uid = u.firebase_uid
    WHERE 
      t.firebase_uid = $1
  `, [firebase_uid]);
  
  return result.rows[0];
};

const obtenerTrabajadorById = async (id) => {
  const result = await db.query(`
    SELECT 
      t.id_trabajador,
      t.firebase_uid,
      u.nombre,
      u.email,
      u.telefono,
      u.foto_perfil,
      u.direccion,
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
      t.whatsapp,
      t.facebook,
      t.instagram,
      t.email AS email_contacto,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id_categoria', c.id_categoria,
            'nombre', c.nombre,
            'descripcion_categoria', c.descripcion,
            'icono_categoria', c.icono,
            'categoria_principal', tc.categoria_principal
          )
        ) FILTER (WHERE c.id_categoria IS NOT NULL), 
        '[]'
      ) AS categorias
    FROM 
      TRABAJADOR t
    JOIN 
      USUARIO u ON t.firebase_uid = u.firebase_uid
    LEFT JOIN 
      TRABAJADOR_CATEGORIA tc ON t.id_trabajador = tc.id_trabajador
    LEFT JOIN 
      CATEGORIA c ON tc.id_categoria = c.id_categoria AND c.activa = true
    WHERE 
      t.id_trabajador = $1
    GROUP BY 
      t.id_trabajador, t.firebase_uid, u.nombre, u.email, u.telefono, 
      u.foto_perfil, u.direccion, t.descripcion, t.precio_hora, 
      t.disponibilidad, t.ubicacion, t.latitud, t.longitud, 
      t.radio_atencion_km, t.fecha_alta, t.verificado, t.activo, 
      t.whatsapp, t.facebook, t.instagram, t.email
  `, [id]);
  
  return result.rows[0];
};

const obtenerTrabajadorByIdCategoria = async (id_categoria) => {
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
      tc.categoria_principal
    FROM 
      TRABAJADOR t
    JOIN 
      USUARIO u ON t.firebase_uid = u.firebase_uid
    JOIN 
      TRABAJADOR_CATEGORIA tc ON t.id_trabajador = tc.id_trabajador
    JOIN 
      CATEGORIA c ON tc.id_categoria = c.id_categoria
    WHERE 
      c.id_categoria = $1 
      AND t.activo = true
    ORDER BY 
      tc.categoria_principal DESC, t.verificado DESC, t.fecha_alta DESC
  `, [id_categoria]);
  
  return result.rows;
};

const obtenerCategorias = async () => {
  const result = await db.query(`
    SELECT 
      id_categoria,
      nombre,
      descripcion,
      icono,
      activa
    FROM 
      CATEGORIA 
    WHERE 
      activa = true
    ORDER BY 
      nombre ASC
  `);
  return result.rows;
};

// Función adicional útil: obtener trabajador con sus categorías
const obtenerTrabajadorConCategorias = async (firebase_uid) => {
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
      t.email AS email_contacto,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id_categoria', c.id_categoria,
            'nombre_categoria', c.nombre,
            'descripcion_categoria', c.descripcion,
            'icono_categoria', c.icono,
            'categoria_principal', tc.categoria_principal
          )
        ) FILTER (WHERE c.id_categoria IS NOT NULL), 
        '[]'
      ) AS categorias
    FROM 
      TRABAJADOR t
    JOIN 
      USUARIO u ON t.firebase_uid = u.firebase_uid
    LEFT JOIN 
      TRABAJADOR_CATEGORIA tc ON t.id_trabajador = tc.id_trabajador
    LEFT JOIN 
      CATEGORIA c ON tc.id_categoria = c.id_categoria AND c.activa = true
    WHERE 
      t.firebase_uid = $1
    GROUP BY 
      t.id_trabajador, u.nombre, u.email, u.telefono, u.foto_perfil, 
      u.direccion, t.descripcion, t.precio_hora, t.disponibilidad,
      t.ubicacion, t.latitud, t.longitud, t.radio_atencion_km,
      t.fecha_alta, t.verificado, t.activo, t.whatsapp, t.facebook,
      t.instagram, t.email
  `, [firebase_uid]);
  
  return result.rows[0];
};

/**
 * Crea un nuevo trabajador y lo asocia a una categoría.
 * 
 * @param {string} firebase_uid - UID del usuario autenticado.
 * @param {number} id_categoria - ID de la categoría seleccionada.
 * @param {object} datos - Objeto con todos los campos del trabajador.
 * @returns {Promise<object>} - Trabajador creado con su categoría.
 */
const crearTrabajador = async (firebase_uid, id_categoria, datos) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Insertar en TRABAJADOR
    const trabajadorResult = await client.query(`
      INSERT INTO TRABAJADOR (
        firebase_uid, descripcion, precio_hora, disponibilidad,
        ubicacion, latitud, longitud, radio_atencion_km, fecha_alta,
        verificado, activo, Whatsapp, Facebook, Instagram, Email
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, NOW(),
        $9, $10, $11, $12, $13, $14
      ) RETURNING id_trabajador;
    `, [
      firebase_uid,
      datos.descripcion,
      Number(datos.precio_hora),
      datos.disponibilidad,
      datos.ubicacion,
      datos.latitud ?? null,
      datos.longitud ?? null,
      datos.radio_atencion_km,
      datos.verificado ?? false,
      datos.activo ?? true,
      datos.whatsapp,
      datos.facebook ?? null,
      datos.instagram ?? null,
      datos.email
    ]);

    const id_trabajador = trabajadorResult.rows[0].id_trabajador;

    // Insertar en TRABAJADOR_CATEGORIA
    await client.query(`
      INSERT INTO TRABAJADOR_CATEGORIA (id_trabajador, id_categoria)
      VALUES ($1, $2);
    `, [id_trabajador, id_categoria]);

    await client.query('COMMIT');
    return { id_trabajador, firebase_uid, id_categoria };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};


/**
 * Verifica si un trabajador ya es favorito de un usuario específico.
 * 
 * @param {string} firebase_uid_usuario - UID del usuario.
 * @param {number} id_trabajador - ID del trabajador.
 * @returns {Promise<boolean>} - true si es favorito, false si no lo es.
 */
const esFavorito = async (firebase_uid_usuario, id_trabajador) => {
  const result = await db.query(`
    SELECT 1 FROM FAVORITO 
    WHERE firebase_uid_usuario = $1 AND id_trabajador = $2
    LIMIT 1`,
    [firebase_uid_usuario, id_trabajador]
  );
  
  return result.rows.length > 0;
};

module.exports = { 
  obtenerTrabajadores,
  obtenerTrabajadorByUid,
  obtenerTrabajadorByIdCategoria,
  obtenerCategorias,
  obtenerTrabajadorById,
  obtenerTrabajadorConCategorias,
  crearTrabajador,
  esFavorito
};