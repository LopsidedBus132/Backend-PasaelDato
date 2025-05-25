const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')

const userController = require('../controllers/user.controller');


router.post('/', [verifyToken], userController.crearUsuario);
router.get('/perfil', [verifyToken], userController.getUsuario);




module.exports = router;
