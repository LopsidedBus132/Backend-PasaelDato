const express = require('express');
const router = express.Router();

const {
  puntuarProfesional,
  obtenerCalificaciones
} = require('../controllers/calificacion.controller');

const verifyToken = require('../middlewares/verifyToken'); // Asegúrate de que esta ruta exista

// Obtener calificaciones y promedio (público)
router.get('/:id/calificaciones', obtenerCalificaciones);

// Registrar una calificación (requiere autenticación)
router.post('/:id/calificacion', verifyToken, puntuarProfesional);

module.exports = router;
