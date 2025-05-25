const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')

const trabajadorController = require('../controllers/trabajador.controller');


router.get('/', [verifyToken], trabajadorController.getTrabajadores());




module.exports = router;
