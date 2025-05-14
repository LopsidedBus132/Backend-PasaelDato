# Backend-PasaelDato

# 🗂️ Backlog de Endpoints - Proyecto

## 📌 Epic: Gestión del Usuario

- [ ] `POST /registro`: Registrar nuevo usuario  
- [ ] `POST /login`: Iniciar sesión  
- [ ] `GET /perfil/{id_usuario}`: Ver perfil de usuario  
- [ ] `PUT /perfil/{id_usuario}`: Editar perfil  
- [ ] `POST /cambiar-password`: Cambiar contraseña  
- [ ] `POST /verificar-codigo`: Verificación código de recuperación  

---

## 📌 Epic: Gestión del Profesional

- [ ] `GET /profesionales`: Listar todos los profesionales  
- [ ] `GET /profesionales/{id_profesional}`: Ver perfil profesional  
- [ ] `PUT /profesionales/{id_profesional}`: Editar perfil profesional  
- [ ] `GET /profesionales/favoritos/{id_cliente}`: Listar favoritos del cliente  
- [ ] `POST /profesionales/favoritos`: Agregar a favoritos  
- [ ] `DELETE /profesionales/favoritos/{id}`: Quitar de favoritos  

---

## 📌 Epic: Gestión de Calificaciones

- [ ] `POST /calificaciones`: Crear calificación  
- [ ] `GET /calificaciones/{id}`: Obtener calificación  
- [ ] `GET /calificaciones/profesional/{id}`: Obtener calificaciones del profesional  

---

## 📌 Epic: Reportes y Moderación

- [ ] `POST /reportes`: Enviar reporte  
- [ ] `GET /reportes/{id}`: Ver reporte específico  
- [ ] `GET /reportes/pendientes`: Ver reportes pendientes  
- [ ] `PUT /reportes/{id}/resolver`: Resolver reporte  

---

## 📌 Epic: Comunicaciones

- [ ] `POST /mensajes`: Enviar mensaje  
- [ ] `GET /mensajes/{usuario1}/{usuario2}`: Ver conversación entre usuarios  
- [ ] `GET /notificaciones/{id_usuario}`: Obtener notificaciones  
- [ ] `PUT /notificaciones/leida/{id}`: Marcar notificación como leída  

---

## 📌 Epic: Suscripciones y Pagos

- [ ] `GET /suscripciones/{id_usuario}`: Ver suscripciones activas  
- [ ] `POST /suscripciones`: Crear nueva suscripción  
- [ ] `GET /pagos/{id_usuario}`: Historial de pagos  
- [ ] `POST /pagos`: Registrar pago  

---

## 📌 Epic: Búsqueda y Filtros

- [ ] `GET /buscar`: Buscar profesionales (por filtros)  
- [ ] `GET /categorias`: Listar categorías  
- [ ] `GET /categorias/{id}`: Detalle de categoría  

---

## 📌 Epic: Administración del Sistema

- [ ] `GET /admin/usuarios`: Ver todos los usuarios  
- [ ] `GET /admin/profesionales`: Ver todos los profesionales  
- [ ] `GET /admin/reportes`: Ver todos los reportes  
- [ ] `POST /admin/categorias`: Crear nueva categoría  
- [ ] `DELETE /admin/categorias/{id}`: Eliminar categoría  
