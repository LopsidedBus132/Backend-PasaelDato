const UsuarioModel = require('../models/user.model');
const { admin } = require('../firebase');


/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await UsuarioModel.crearUsuario(req.body);
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
    });  }

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

    return res.status(200).json({
      success: true,
      message: 'Usuario obtenido correctamente',
      data: usuario
    });

  } catch (error) {
    console.error('Error al verificar token o buscar usuario:', error);

    return res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error interno'
    });
  }
};

  



module.exports = {
    getUsuario,
    crearUsuario
}