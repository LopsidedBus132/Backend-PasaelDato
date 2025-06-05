const cron = require('node-cron');
const db = require('../config/db');
const SubscriptionModel = require('../models/suscripcion.model');
const { enviarCorreoBajadaPlan } = require('../utils/email');

async function verificarSuscripcionesVencidas() {
    console.log('[CRON] Verificando suscripciones vencidas...');

    try {
        const hoy = new Date();

        const resultado = await db.query(`
  SELECT st.id_trabajador, u.email, u.nombre, st.id_suscripcion
  FROM suscripcion_trabajador st
  JOIN trabajador t ON st.id_trabajador = t.id_trabajador
  JOIN usuario u ON t.firebase_uid = u.firebase_uid
  WHERE st.fecha_vencimiento < $1
`, [hoy]);


        const vencidas = resultado.rows;

        for (const sub of vencidas) {
            console.log(`[CRON] Trabajador ${sub.id_trabajador} tiene una suscripción vencida.`);

            const fecha_inicio = new Date();
            const fecha_vencimiento = new Date();
            fecha_vencimiento.setMonth(fecha_vencimiento.getMonth() + 1);

            await SubscriptionModel.actualizarSuscripcionTrabajador({
                id_trabajador: sub.id_trabajador,
                id_suscripcion: 1,
                fecha_inicio,
                fecha_vencimiento
            });

            try {
                await enviarCorreoBajadaPlan(sub.correo, {
                    nombre: sub.nombre,
                    fecha_bajada: fecha_inicio
                });
            } catch (err) {
                console.error(`[CRON] Error al enviar correo a ${sub.correo}:`, err);
            }
        }

        console.log(`[CRON] Verificación finalizada. Total vencidas: ${vencidas.length}`);
    } catch (error) {
        console.error('[CRON] Error al verificar suscripciones:', error);
    }
}

// Programación real diaria
cron.schedule('0 0 * * *', verificarSuscripcionesVencidas);

// 👇 Llamada inmediata al levantar el servidor (modo prueba)
verificarSuscripcionesVencidas(); // <--- esta línea se ejecuta inmediatamente

module.exports = verificarSuscripcionesVencidas;
