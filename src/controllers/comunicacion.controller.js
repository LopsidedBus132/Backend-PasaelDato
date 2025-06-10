const comunicacionModel = require('../models/comunicacion.model');
const { admin } = require('../firebase');

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */

const getLinkWsp = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado o inválido'
        });
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebase_uid = decodedToken.uid;
        let link = await comunicacionModel.obtenerTrabajadorPorUid(firebase_uid)
        if (link == true) {
            link = await comunicacionModel.obtenerNumeroPorUid(firebase_uid)
            const mensaje = 'Hola, estas disponible?'
            const wsp = 'https://wa.me/' + link.rows[0].whatsapp + '?text=' + encodeURIComponent(mensaje);
            return res.status(200).json({
                success: true,
                message: 'Enlace generado',
                data: wsp
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: 'Trabajador No encontrado'
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error interno'
        });
    }
}
const getMail = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado o inválido'
        });
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebase_uid = decodedToken.uid;
        let link = await comunicacionModel.obtenerTrabajadorPorUid(firebase_uid)
        if (link == true) {
            link = await comunicacionModel.obtenerCorreoPorUid(firebase_uid)
            const cuerpo = 'Estimado me pongo en contacto con usted para solicitar información respecto a la contratación de sus servicios. Estoy interesado/a en conocer más detalles sobre Descripción de los servicios que ofrece.'
            const asunto = 'Contratación para servicios'
            const correo = `mailto:${link.rows[0].email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
            return res.status(200).json({
                success: true,
                message: 'Enlace generado',
                data: correo
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: 'Trabajador No encontrado'
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error interno'
        });
    }
}

module.exports = {
    getLinkWsp,
    getMail
}