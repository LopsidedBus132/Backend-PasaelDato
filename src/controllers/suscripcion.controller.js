const SubscriptionModel = require('../models/suscripcion.model');
const TrabajadorModel = require('../models/trabajador.model');
const UsuarioModel = require('../models/user.model')
const { enviarCorreoConfirmacion } = require('../utils/email'); // asumimos que esto ya existe

/**
 * Crea una nueva suscripción para un trabajador
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const crearSuscripcion = async (req, res) => {
    try {
        const worker_id = req.body.firebase_uid
        const plan_id = req.body.id_plan
        const auto_renewal = false
        // 1. Validar existencia de trabajador
        const trabajador = await TrabajadorModel.obtenerTrabajadorByUid(worker_id);
        const datosTrabajador = await UsuarioModel.obtenerPorUid(worker_id)
        if (!trabajador) {
            return res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
        }
        const precio = 10000
        // 2. Obtener duración y precio del plan
        const planInfo = await SubscriptionModel.obtenerDuracionYPrecioPlan(plan_id);
        const { duracion_dias } = planInfo;

        // 3. Calcular fechas
        const fecha_inicio = new Date();
        const fecha_vencimiento = new Date();
        fecha_vencimiento.setDate(fecha_inicio.getDate() + duracion_dias);

        // 4. Insertar suscripción
        await SubscriptionModel.insertarSuscripcion({
            id_trabajador: trabajador.id_trabajador,
            id_plan: plan_id,
            fecha_inicio,
            fecha_vencimiento,
            estado_suscripcion: 'ACTIVA',
            metodo_pago: 'GRATIS',
            monto_pagado: precio,
            fecha_pago: fecha_inicio,
            auto_renovacion: auto_renewal ?? false
        });

        // 5. Enviar email
        await enviarCorreoConfirmacion(datosTrabajador.email, {
            nombre: datosTrabajador.nombre,
            fecha_inicio,
            fecha_vencimiento,
            nombre_plan: planInfo.nombre_plan || 'Suscripción'
        });

        return res.status(201).json({ success: true, message: 'Suscripción creada exitosamente' });

    } catch (error) {
        console.error('Error al crear suscripción:', error);
        return res.status(500).json({ success: false, message: 'Error interno al crear la suscripción' });
    }
};
/**
 * Crea una nueva suscripción para un trabajador
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const actualizarSuscripcion = async (req, res) => {
    try {
        const worker_id = req.body.firebase_uid
        const plan_id = req.body.id_plan
        // 1. Validar existencia de trabajador
        const trabajador = await TrabajadorModel.obtenerTrabajadorByUid(worker_id);
        const datosTrabajador = await UsuarioModel.obtenerPorUid(worker_id)
        if (!trabajador) {
            return res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
        }
        // 2. Obtener duración y precio del plan
        const planInfo = await SubscriptionModel.obtenerDuracionYPrecioPlan(plan_id);
        const { duracion_dias } = planInfo;

        // 3. Calcular fechas
        const fecha_inicio = new Date();
        const fecha_vencimiento = new Date();
        fecha_vencimiento.setDate(fecha_inicio.getDate() + duracion_dias);
        // 4. Actualizar suscripción
        await SubscriptionModel.actualizarSuscripcionTrabajador(
            trabajador.id_trabajador,
            plan_id,
            fecha_inicio,
            fecha_vencimiento
        );

        // 5. Enviar email
        await enviarCorreoConfirmacion(datosTrabajador.email, {
            nombre: datosTrabajador.nombre,
            fecha_inicio,
            fecha_vencimiento,
            nombre_plan: planInfo.nombre_plan || 'Suscripción'
        });

        return res.status(201).json({ success: true, message: 'Suscripción actualizada exitosamente' });

    } catch (error) {
        console.error('Error al crear suscripción:', error);
        return res.status(500).json({ success: false, message: 'Error interno al actualizar la suscripción' });
    }
}

module.exports = {
    crearSuscripcion,
    actualizarSuscripcion
};
