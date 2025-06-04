const { admin } = require('../firebase');
const UsuarioModel = require('../models/user.model');
const CalificacionModel = require('../models/calificacion.model');


/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const crearUsuario = async (req, res) => {
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
    const firebase_uid = decodedToken.uid;
    const nuevoUsuario = await UsuarioModel.crearUsuario({firebase_uid,...req.body}); 
    return res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: nuevoUsuario
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno al crear el usuario' });
  }
};

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getUsuario = async (req, res) => {
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
    const firebase_uid = decodedToken.uid;

    const usuario = await UsuarioModel.obtenerPorUid(firebase_uid);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    let esTrabajador;
    if ((await UsuarioModel.esTrabajadorPorUid(firebase_uid)).length > 0)
      esTrabajador = true;
    else
      esTrabajador = false;


    return res.status(200).json({
      success: true,
      message: 'Usuario obtenido correctamente',
      data: {...usuario, esTrabajador}
    });

  } catch (error) {
    console.error('Error al verificar token o buscar usuario:', error);

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
const updateUsuario = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado o inválido'
    });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const firebase_uid = decodedToken.uid
    const datos = req.body
    if (!firebase_uid) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    const result = await UsuarioModel.editarPerfil(firebase_uid, datos)
    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo actualizar los datos'
      })
    }
    else {
      return res.status(200).json({
        success: true,
        message: 'Datos actualizados',
        data: result.rows[0]
      })
    }

  } catch (error) {
    console.error('Error al verificar token o actualizar usuario:', error);

    res.status(500).json({
      succes: false,
      message: 'Ha ocurrido un error interno'
    });
  }
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const agregarFavorito = async (req, res) => {
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
    const firebase_uid = decodedToken.uid;
    const trabajador = req.body.idTrabajador;
    if (!trabajador) {
      return res.status(404).json({
        success: false,
        message: 'Trabajdor no encontrado'
      });
    }
    else{
      const result = await UsuarioModel.agregarFavorito(firebase_uid,trabajador)
      if(!result){
        return res.status(400).json({
          success : false,
          message : 'No se pudo agregar favoritos'
        })
      }
      else{
        return res.status(200).json({
          success: true,
          message: 'Favorito agregado correctamente',
          data: result.rows[0]
        })
      }
    }
  } catch (error) {
    console.error('Error al verificar token o al insertar favorito:', error);

    return res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error interno'
    });
  }
}


/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const quitarFavorito = async (req, res) => {
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
    const firebase_uid = decodedToken.uid;
    const trabajador = req.body.idTrabajador;
    
    if (!trabajador) {
      return res.status(400).json({
        success: false,
        message: 'ID del trabajador es requerido'
      });
    }

    const result = await UsuarioModel.quitarFavorito(firebase_uid, trabajador);
    
    if (!result || result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Favorito no encontrado o ya fue eliminado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Favorito eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al verificar token o al eliminar favorito:', error);

    return res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error interno'
    });
  }
};


/**
 * Devuelve los trabajadores favoritos de un usuario autenticado, con su calificación promedio.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const obtenerFavoritosUsuario = async (req, res) => {
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
    const firebase_uid = decodedToken.uid;

    const favoritos = await UsuarioModel.obtenerFavoritosPorUid(firebase_uid);

    if (!favoritos || favoritos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron trabajadores favoritos'
      });
    }

    const favoritosConCalificacion = await Promise.all(
      favoritos.map(async (trabajador) => {
        const { promedio } = await CalificacionModel.obtenerPromedioCalificaciones(trabajador.id_trabajador);
        return {
          ...trabajador,
          calificacion: Number(promedio)
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Favoritos obtenidos correctamente',
      data: favoritosConCalificacion
    });

  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al obtener favoritos'
    });
  }
};

module.exports = {
  getUsuario,
  crearUsuario,
  updateUsuario,
  agregarFavorito,
  quitarFavorito,
  obtenerFavoritosUsuario,
}