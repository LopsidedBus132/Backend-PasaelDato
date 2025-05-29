const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')

const trabajadorController = require('../controllers/trabajador.controller');


router.get('/categoria/:id_categoria', trabajadorController.getTrabajadoresByIdCategoria);
router.get('/categorias', trabajadorController.getCategorias);
router.get('/', [verifyToken], trabajadorController.getTrabajadores);
router.get('/uid/:uid', [verifyToken], trabajadorController.getTrabajadorByUid);
router.get('/:id', [verifyToken], trabajadorController.getTrabajadorById);



module.exports = router;
