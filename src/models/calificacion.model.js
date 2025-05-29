const db = require('../config/db');

/**
 * Inserta una nueva calificación (reseña) para un profesional.
 * 
 * @param {number} profesionalId - ID del trabajador (id_trabajador).
 * @param {string} usuarioUid - UID del usuario autenticado (firebase_uid_usuario).
 * @param {number} calificacion - Calificación del 1 al 5.
 * @param {string} comentario - Comentario opcional.
 * @returns {Promise<Object>} - Reseña insertada.
 */
const insertarCalificacion = async (profesionalId, usuarioUid, calificacion, comentario) => {
  const result = await db.query(
    `INSERT INTO RESENA (id_trabajador, firebase_uid_usuario, calificacion, comentario, fecha_resena, verificada)
     VALUES ($1, $2, $3, $4, NOW(), false)
     RETURNING *`,
    [profesionalId, usuarioUid, calificacion, comentario]
  );
  return result.rows[0];
};

/**
 * Obtiene todas las calificaciones (reseñas) de un profesional específico.
 * 
 * @param {number} profesionalId - ID del trabajador.
 * @returns {Promise<Array>} - Lista de reseñas.
 */
const obtenerCalificaciones = async (profesionalId) => {
  const result = await db.query(
    `SELECT firebase_uid_usuario, calificacion, comentario, fecha_resena, verificada
     FROM RESENA
     WHERE id_trabajador = $1
     ORDER BY fecha_resena DESC`,
    [profesionalId]
  );
  return result.rows;
};

/**
 * Calcula el promedio de calificaciones de un profesional.
 * 
 * @param {number} profesionalId - ID del trabajador.
 * @returns {Promise<{ promedio: string }>} - Promedio de calificaciones.
 */
const obtenerPromedioCalificaciones = async (profesionalId) => {
  const result = await db.query(
    `SELECT AVG(calificacion)::numeric(10,2) AS promedio
     FROM RESENA
     WHERE id_trabajador = $1`,
    [profesionalId]
  );
  return result.rows[0];
};

module.exports = {
  insertarCalificacion,
  obtenerCalificaciones,
  obtenerPromedioCalificaciones
};
