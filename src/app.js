const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');          // Seguridad HTTP básica



const trabajadorRoutes = require('./routes/trabajador.routes');
const userRoutes = require('./routes/user.routes');


const app = express();

// Middlewares básicos
app.use(cors());            // Permite peticiones CORS (ajustable según necesidades)
app.use(express.json());    // Parseo de JSON en request bodies
app.use(helmet());          // Seguridad HTTP (cabeceras para proteger tu app)

// Middleware global para capturar errores no manejados
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta principal que sirve archivo estático HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Requerimientos.html'));
});


// RUTAS
app.use('/api/usuario', userRoutes)
app.use('/api/trabajadores', trabajadorRoutes)




module.exports = app;