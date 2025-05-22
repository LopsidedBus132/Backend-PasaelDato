const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de ejemplo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Requerimientos.html'))
  //res.send('Servidor funcionando correctamente');
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
