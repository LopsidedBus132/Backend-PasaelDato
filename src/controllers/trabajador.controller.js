
const TrabajadorModel = require('../models/trabajador.model');


/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getTrabajadores = async (req, res) => {
  try {
    const usuarios = await TrabajadorModel.obtenerTrabajadores();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }  };



module.exports = {
    getTrabajadores
}