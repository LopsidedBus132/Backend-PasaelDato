const {admin} = require('../firebase');
const TrabajadorModel = require('../models/trabajador.model');
const CalificacionModel = require('../models/calificacion.model');


/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getTrabajadores = async (req, res) => {
  try {
    const usuarios = await TrabajadorModel.obtenerTrabajadores();
    res.json({success: true, message: 'Trabajadores obtenidos correctamente.', data: usuarios});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Ha ocurrido un error interno'});
  }  };


  /**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
  const getTrabajadorByUid = async (req, res) => {
    try {
      const uid = req.params.uid;
      const trabajador = await TrabajadorModel.obtenerTrabajadorByUid(uid);

      if (!trabajador) {
        return res.status(404).json({
          success: false,
          message: 'Trabajador no encontrado'
        });
      }


      const { promedio } = await CalificacionModel.obtenerPromedioCalificaciones(trabajador.id_trabajador);
      const trabajadorConCalificacion = {
        ...trabajador,
        calificacion: Number(promedio)
      };

      res.json({success: true, message: 'Trabajadores obtenidos correctamente.', data: trabajadorConCalificacion});
    } catch (error) {
      console.error('Error al buscar trabajador:', error);

      return res.status(500).json({
        success: false,
        message: 'Ha ocurrido un error interno'
      });
    }  
  };




    /**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
    const getTrabajadorById = async (req, res) => {
      try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            message: 'Token no proporcionado o inválido.'
          });
        }

        const id = req.params.id;
        const trabajador = await TrabajadorModel.obtenerTrabajadorById(id);
  
        if (!trabajador) {
          return res.status(404).json({
            success: false,
            message: 'Trabajador no encontrado'
          });
        }
  


      const idToken = authHeader.split('Bearer ')[1];

      // Verificar el token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const firebase_uid = decodedToken.uid;


      const esFavorito = await TrabajadorModel.esFavorito(firebase_uid, id);
  
        const { promedio } = await CalificacionModel.obtenerPromedioCalificaciones(trabajador.id_trabajador);
        const trabajadorConCalificacion = {
          ...trabajador,
          calificacion: Number(promedio),
          esFavorito
        };
  
        res.json({success: true, message: 'Trabajadores obtenidos correctamente.', data: trabajadorConCalificacion});
      } catch (error) {
        console.error('Error al buscar trabajador:', error);
  
        return res.status(500).json({
          success: false,
          message: 'Ha ocurrido un error interno'
        });
      }  
    };





  /**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getTrabajadoresByIdCategoria = async (req, res) => {
  try {
    const idCategoria = req.params.id_categoria;
    const trabajadores = await TrabajadorModel.obtenerTrabajadorByIdCategoria(idCategoria);

    if (!trabajadores || trabajadores.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron trabajadores para esta categoría'
      });
    }


    const trabajadoresConCalificacion = await Promise.all(
      trabajadores.map(async (trabajador) => {
        const { promedio } = await CalificacionModel.obtenerPromedioCalificaciones(trabajador.id_trabajador);
        return {
          ...trabajador,
          calificacion: Number(promedio)
        };
      })
    );

    res.json({
      success: true,
      message: 'Trabajadores obtenidos correctamente.',
      data: trabajadoresConCalificacion
    });

  } catch (error) {
    console.error('Error al buscar trabajadores por categoría:', error);
    return res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error interno'
    });
  }
};
  
/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getCategorias = async (req, res) => {
  try {
    const categorias = await TrabajadorModel.obtenerCategorias();
    res.json({
      success: true,
      message: 'Categorías obtenidas correctamente.',
      data: categorias
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error interno al obtener categorías.'
    });
  }
};

/**
 * Controlador para crear un nuevo trabajador y asociarlo a una categoría.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const registrarTrabajador = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado o inválido.'
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verificar el token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebase_uid = decodedToken.uid;

    // Obtener datos del body
    const { idCategoria, ...datos } = req.body;

    if (!idCategoria) {
      return res.status(400).json({
        success: false,
        message: 'El campo id_categoria es obligatorio.'
      });
    }

    // Crear trabajador
    const trabajador = await TrabajadorModel.crearTrabajador(firebase_uid, idCategoria, datos);

    return res.status(201).json({
      success: true,
      message: 'Trabajador registrado exitosamente.',
      data: trabajador
    });

  } catch (error) {
    console.error('Error al registrar trabajador:', error);
    return res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error interno.'
    });
  }
};

module.exports = {
    getTrabajadores,
    getTrabajadorByUid,
    getTrabajadoresByIdCategoria,
    getCategorias,
    getTrabajadorById,
    registrarTrabajador,
}