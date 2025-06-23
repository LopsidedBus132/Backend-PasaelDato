const CalificacionModel = require('../models/calificacion.model');
const { admin } = require('../firebase');

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const puntuarProfesional = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    const idToken = authHeader.split('Bearer ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebase_uid = decodedToken.uid;

    const profesionalId = parseInt(req.params.id, 10);
    const { calificacion, comentario } = req.body;

    if (!calificacion) {
      return res.status(400).json({
        success: false,
        message: 'El campo calificacion son obligatorios.'
      });
    }

    const resultado = await CalificacionModel.insertarCalificacion(
      profesionalId,
      firebase_uid,
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
 * @param {import('express').Request} req - La solicitud HTTP entrante.
 * @param {import('express').Response} res - La respuesta HTTP saliente.
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
