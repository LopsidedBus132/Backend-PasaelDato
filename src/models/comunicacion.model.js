const db = require('../config/db')

const obtenerTrabajadorPorUid = async (firebase_uid) => {
    const result = await db.query(
        'SELECT * FROM TRABAJADOR WHERE firebase_uid = $1',
        [firebase_uid]
    );
    if(!result){
        return false
    }
    else{
        return true
    }
};

const obtenerNumeroPorUid = async (firebase_uid) => {
    const result = await db.query(
        'SELECT whatsapp FROM TRABAJADOR WHERE firebase_uid = $1',
        [firebase_uid]
    );
    return result
};
const obtenerCorreoPorUid = async (firebase_uid) => {
    const result = await db.query(
        'SELECT email FROM TRABAJADOR WHERE firebase_uid = $1',
        [firebase_uid]
    );
    return result
};


module.exports = {
    obtenerNumeroPorUid,
    obtenerTrabajadorPorUid,
    obtenerCorreoPorUid
};