const db = require('../config/db')

/**
 * Obtiene la duración (en días) y el precio de un plan de suscripción.
 * @param {number} id_plan
 * @returns {Promise<{ duracion_dias: number, precio: number }>}
 */
const obtenerDuracionYPrecioPlan = async (id_plan) => {
    const query = `
    SELECT duracion_dias, nombre_plan
    FROM PLAN_SUSCRIPCION
    WHERE id_plan = $1
  `;

    const result = await db.query(query, [id_plan]);

    if (result.rows.length === 0) {
        throw new Error('Plan no encontrado');
    }

    return result.rows[0];
};
/**
 * Inserta una suscripción en la tabla SUSCRIPCION_TRABAJADOR.
 * Asume que todos los valores ya han sido calculados antes de llamar a esta función.
 * 
 * @param {Object} data
 * @param {number} data.id_trabajador
 * @param {number} data.id_plan
 * @param {string} data.fecha_inicio - formato 'YYYY-MM-DD HH:mm:ss'
 * @param {string} data.fecha_vencimiento - formato 'YYYY-MM-DD HH:mm:ss'
 * @param {string} data.estado_suscripcion
 * @param {string} data.metodo_pago
 * @param {number} data.monto_pagado
 * @param {string} data.fecha_pago - formato 'YYYY-MM-DD HH:mm:ss'
 * @param {boolean} data.auto_renovacion
 * 
 * @returns {Promise<Object>} suscripción insertada
 */
const insertarSuscripcion = async (data) => {
    const insertQuery = `
    INSERT INTO SUSCRIPCION_TRABAJADOR (
      id_trabajador,
      id_plan,
      fecha_inicio,
      fecha_vencimiento,
      estado_suscripcion,
      metodo_pago,
      monto_pagado,
      fecha_pago,
      auto_renovacion
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
    const values = [
        data.id_trabajador,
        data.id_plan,
        data.fecha_inicio,
        data.fecha_vencimiento,
        data.estado_suscripcion,
        data.metodo_pago,
        data.monto_pagado,
        data.fecha_pago,
        data.auto_renovacion
    ];

    const result = await db.query(insertQuery, values);
    return result.rows[0];
};

const actualizarSuscripcionTrabajador = async (id_trabajador, id_suscripcion, fecha_inicio, fecha_vencimiento) => {
    const query = `
    UPDATE suscripcion_trabajador
    SET id_plan = $1,
        fecha_inicio = $2,
        fecha_vencimiento = $3
    WHERE id_trabajador = $4
  `;

    const valores = [id_suscripcion, fecha_inicio, fecha_vencimiento, id_trabajador];
    await db.query(query, valores);
};
module.exports = {
    insertarSuscripcion,
    obtenerDuracionYPrecioPlan,
    actualizarSuscripcionTrabajador
};