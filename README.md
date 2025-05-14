# Backend-PasaelDato

# 📋 Lista de Requerimientos Backend (API RESTful)

## 🟨 Gestión de Usuarios

| Funcionalidad | Método | Endpoint |
|---------------|--------|----------|
| Registro de usuarios | POST | /api/usuarios/register |
| Registro con Google | POST | /api/usuarios/register/google |
| Recuperación de contraseña | POST | /api/usuarios/recuperar |
| Validación de identidad | POST | /api/usuarios/validar-identidad |
| Ver perfil de usuario | GET | /api/usuarios/{id} |
| Añadir campos personalizables | PUT | /api/usuarios/{id}/personalizacion |
| Edición de perfil | PUT | /api/usuarios/{id} |
| Actualizar datos personales | PUT | /api/usuarios/{id}/datos |
| Guardar profesional como favorito | POST | /api/usuarios/{id}/favoritos |

## 🟩 Sistema de Comunicación

| Funcionalidad | Método | Endpoint |
|---------------|--------|----------|
| Mensajería entre usuarios | POST | /api/mensajes |
| Comunicación vía WhatsApp o correo | POST | /api/comunicacion/externa |
| Notificaciones al usuario | GET | /api/notificaciones/{usuario_id} |
| Solicitud de servicios | POST | /api/servicios/solicitud |

## 🟥 Sistema de Búsqueda

| Funcionalidad | Método | Endpoint |
|---------------|--------|----------|
| Buscador de profesionales | GET | /api/profesionales/buscar |
| Búsqueda optimizada (<3s) | GET | /api/profesionales/buscar |
| Filtro avanzado | GET | /api/profesionales/filtrar?... |
| Ver perfil profesional | GET | /api/profesionales/{id} |
| Redirección a perfil desde búsqueda | GET | /api/profesionales/{id} |

## 🟪 Sistema de Calificación

| Funcionalidad | Método | Endpoint |
|---------------|--------|----------|
| Puntuar profesional | POST | /api/profesionales/{id}/calificacion |
| Comentar calificación | POST | /api/profesionales/{id}/comentarios |
| Ver reseñas | GET | /api/profesionales/{id}/calificaciones |

## 🟦 Sistema de Pago y Suscripción

| Funcionalidad | Método | Endpoint |
|---------------|--------|----------|
| Seleccionar plan | POST | /api/suscripciones/seleccionar |
| Cambiar plan | PUT | /api/suscripciones/cambiar |
| Ver suscripciones | GET | /api/suscripciones |
| Enviar factura al correo | POST | /api/facturacion/enviar |
| Notificación de renovación | GET | /api/suscripciones/notificacion-renovacion |

## 🟥 Seguridad y Soporte

| Funcionalidad | Método | Endpoint |
|---------------|--------|----------|
| Protección de datos personales | Middleware | N/A |
| Bloqueo tras intentos fallidos | POST | /api/auth/login |
| Encriptación de contraseñas | Middleware | /register, /usuarios/{id} |
| Error por credenciales inválidas | POST | /api/auth/login |
| Autenticación 2FA (admin) | POST | /api/auth/2fa/verify |
| Preguntas frecuentes (FAQ) | GET | /api/soporte/faq |
| Formulario de contacto | POST | /api/soporte/contacto |

## 🟦 Rendimiento y Disponibilidad

| Requerimiento | Descripción |
|---------------|-------------|
| Alta disponibilidad | El sistema debe estar disponible el 99.9% del tiempo laboral |
| Usuarios concurrentes | Soporte para al menos 500 usuarios concurrentes |
| Recuperación ante fallos | Tiempo máximo de recuperación: 4 horas |
