const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')

const comunicacionController = require('../controllers/comunicacion.controller');

router.get('/whatsapp',[verifyToken], comunicacionController.getLinkWsp);
router.get('/email',[verifyToken], comunicacionController.getMail);


module.exports = router;