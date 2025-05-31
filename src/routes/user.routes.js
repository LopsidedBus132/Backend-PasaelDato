const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')

const userController = require('../controllers/user.controller');


router.post('/', userController.crearUsuario);
router.get('/perfil', [verifyToken], userController.getUsuario);
router.patch('/perfil',[verifyToken], userController.updateUsuario)
router.post('/favoritos',[verifyToken],userController.agregarFavorito)
router.get('/favoritos', [verifyToken], userController.obtenerFavoritosUsuario);


module.exports = router;
