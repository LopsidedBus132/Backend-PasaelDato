const express = require('express');
const router = express.Router();
const {
  puntuarProfesional,
  obtenerCalificaciones
} = require('../controllers/calificacion.controller');

// Registrar una calificación
router.post('/:id/calificacion', puntuarProfesional);

// Obtener calificaciones y promedio
router.get('/:id/calificaciones', obtenerCalificaciones);

module.exports = router;
