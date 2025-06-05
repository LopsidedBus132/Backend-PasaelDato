const CalificacionModel = require('../models/calificacion.model');
const { admin } = require('../firebase');

/**
 * Controlador para registrar una calificación.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const puntuarProfesional = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado o inválido'
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebase_uid_usuario = decodedToken.uid;
    const profesionalId = parseInt(req.params.id, 10);
    const { calificacion, comentario } = req.body;

    if (!calificacion) {
      return res.status(400).json({
        success: false,
        message: 'El campo calificación es obligatorio.'
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
      objeto: resultado
    });

  } catch (error) {
    console.error('Error al verificar token o registrar calificación:', error);
    res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error interno'
    });
  }
};

/**
 * Obtener todas las calificaciones de un profesional.
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
        objeto: {
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
      objeto: {
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
