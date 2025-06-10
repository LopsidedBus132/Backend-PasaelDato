const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envía un correo de confirmación de suscripción
 * @param {string} destino - Correo del trabajador
 * @param {Object} datos - Datos del trabajador y suscripción
 * @param {string} datos.nombre - Nombre del trabajador
 * @param {Date} datos.fecha_inicio - Fecha de inicio de suscripción
 * @param {Date} datos.fecha_vencimiento - Fecha de vencimiento
 * @param {string} datos.nombre_plan - Nombre del plan
 */
const enviarCorreoConfirmacion = async (destino, datos) => {
    const { nombre, fecha_inicio, fecha_vencimiento, nombre_plan } = datos;
    const mensaje = {
        from: process.env.EMAIL_FROM,
        to: destino,
        subject: 'Confirmación de suscripción',
        html: `
      <h2>¡Hola, ${nombre}!</h2>
      <p>Tu suscripción al plan <strong>${nombre_plan}</strong> se ha activado correctamente.</p>
      <ul>
        <li><strong>Inicio:</strong> ${new Date(fecha_inicio).toLocaleString()}</li>
        <li><strong>Vencimiento:</strong> ${new Date(fecha_vencimiento).toLocaleString()}</li>
      </ul>
      <p>Gracias por confiar en nosotros.</p>
    `
    };
    try {
        await transporter.sendMail(mensaje);
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
};
const enviarCorreoBajadaPlan = async (destino, datos) => {
  const { nombre, fecha_bajada } = datos;

  const mensaje = {
    from: process.env.EMAIL_FROM,
    to: destino,
    subject: 'Se ha cambiado tu plan a la versión gratuita',
    html: `
      <h2>Hola, ${nombre}</h2>
      <p>Tu suscripción de pago ha vencido y tu cuenta ha sido migrada automáticamente al plan gratuito el <strong>${new Date(fecha_bajada).toLocaleString()}</strong>.</p>
      <p>Para seguir disfrutando de los beneficios premium, puedes renovar tu suscripción desde tu panel de usuario.</p>
      <p>Gracias por usar nuestra plataforma.</p>
    `
  };

  await transporter.sendMail(mensaje);
};
const enviarCorreoRenovacionAutomatica = async (destino, datos) => {
  const { nombre, nombre_plan, fecha_inicio, fecha_vencimiento } = datos;

  const mensaje = {
    from: process.env.EMAIL_FROM,
    to: destino,
    subject: 'Tu suscripción se ha renovado automáticamente',
    html: `
      <h2>Hola, ${nombre}</h2>
      <p>Te informamos que tu suscripción al plan <strong>${nombre_plan}</strong> ha sido renovada automáticamente.</p>
      <ul>
        <li><strong>Inicio:</strong> ${new Date(fecha_inicio).toLocaleString()}</li>
        <li><strong>Vencimiento:</strong> ${new Date(fecha_vencimiento).toLocaleString()}</li>
      </ul>
      <p>¡Gracias por seguir con nosotros!</p>
    `
  };

  await transporter.sendMail(mensaje);
};

module.exports = {
    enviarCorreoConfirmacion,
    enviarCorreoBajadaPlan,
    enviarCorreoRenovacionAutomatica
};