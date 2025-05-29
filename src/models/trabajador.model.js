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
      t.email AS email_contacto
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

module.exports = { 
  obtenerTrabajadores,
  obtenerTrabajadorByUid,
  obtenerTrabajadorByIdCategoria,
  obtenerCategorias,
  obtenerTrabajadorById,
  obtenerTrabajadorConCategorias,
};