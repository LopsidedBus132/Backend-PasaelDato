const UsuarioModel = require('../models/user.model');
const { admin } = require('../firebase');


/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await UsuarioModel.crearUsuario(req.body);
    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      usuario: nuevoUsuario
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
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebase_uid = decodedToken.uid;

    const usuario = await UsuarioModel.obtenerPorUid(firebase_uid);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

  



module.exports = {
    getUsuario,
    crearUsuario
}