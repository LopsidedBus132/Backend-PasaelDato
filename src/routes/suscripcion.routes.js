const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')

const suscripcionController = require('../controllers/suscripcion.controller.js');

router.post('/agregar',[verifyToken],suscripcionController.crearSuscripcion);
router.put('',[verifyToken],suscripcionController.actualizarSuscripcion);
module.exports = router;