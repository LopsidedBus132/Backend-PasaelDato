

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getHistories = (req, res) => {
    res.json({ message: 'Obtener todos los ítems' });
  };



module.exports = {
    getHistories
}