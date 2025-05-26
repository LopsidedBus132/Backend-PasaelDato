
const TrabajadorModel = require('../models/trabajador.model');


/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getTrabajadores = async (req, res) => {
  try {
    const usuarios = await TrabajadorModel.obtenerTrabajadores();
    res.json({success: true, message: 'Trabajadores obtenidos correctamente.', objeto: usuarios});
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

      res.json({success: true, message: 'Trabajadores obtenidos correctamente.', objeto: trabajador});
    } catch (error) {
      console.error('Error al buscar trabajador:', error);

      return res.status(500).json({
        success: false,
        message: 'Ha ocurrido un error interno'
      });
    }  
  };
  


module.exports = {
    getTrabajadores,
    getTrabajadorByUid
}