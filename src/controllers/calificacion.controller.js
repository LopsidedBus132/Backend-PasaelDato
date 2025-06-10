const admin = require('../firebase');
const CalificacionModel = require('../models/calificacion.model');

/**
 * Controlador para puntuar a un profesional.
 * Requiere autenticación mediante Firebase (middleware verifyFirebaseToken).
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const puntuarProfesional = async (req, res) => {
  try {
    const profesionalId = parseInt(req.params.id, 10);
    const uidAutenticado = req.user.uid; // UID extraído del token verificado

    const { firebase_uid_usuario, calificacion, comentario } = req.body;

    // Validación de campos obligatorios
    if (!firebase_uid_usuario || !calificacion) {
      return res.status(400).json({
        success: false,
        message: 'Los campos firebase_uid_usuario y calificacion son obligatorios.'
      });
    }

    // Protección contra suplantación
    if (firebase_uid_usuario !== uidAutenticado) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción.'
      });
    }

    // (Opcional) Validar que el usuario exista en Firebase
    const usuario = await admin.auth().getUser(firebase_uid_usuario);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario de Firebase no encontrado.'
      });
    }

    const resultado = await CalificacionModel.insertarCalificacion(
      profesionalId,
      firebase_uid_usuario,
      calificacion,
      comentario
    );

    res.status(201).json({
      success: true,
      message: 'Calificación registrada correctamente.',
      data: resultado
    });

  } catch (error) {
    console.error('Error al registrar calificación:', error);
    res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error interno'
    });
  }
};

/**
 * Controlador para obtener las calificaciones de un trabajador.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const obtenerCalificaciones = async (req, res) => {
  try {
    const profesionalId = parseInt(req.params.id, 10);

    const reseñas = await CalificacionModel.obtenerCalificaciones(profesionalId);
    const promedio = await CalificacionModel.obtenerPromedioCalificaciones(profesionalId);

    if (!reseñas || reseñas.length === 0) {
      return res.json({
        success: true,
        message: 'Este trabajador aún no tiene calificaciones registradas.',
        data: {
          promedio: 0.0,
          reseñas: []
        }
      });
    }

    const promedioBruto = promedio?.promedio ?? 0;
    const promedioNumerico = parseFloat(promedioBruto) || 0;
    const promedioRedondeado = Math.round(promedioNumerico * 100) / 100;

    res.json({
      success: true,
      message: 'Calificaciones obtenidas correctamente.',
      data: {
        promedio: promedioRedondeado,
        reseñas
      }
    });

  } catch (error) {
    console.error('Error al obtener calificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error interno.'
    });
  }
};

module.exports = {
  puntuarProfesional,
  obtenerCalificaciones
};
