CREATE TABLE USUARIO (
    firebase_uid TEXT PRIMARY KEY,
    nombre TEXT,
    email TEXT,
    telefono TEXT,
    fecha_registro TIMESTAMPTZ,
    foto_perfil TEXT,
    latitud DECIMAL,
    longitud DECIMAL,
    direccion TEXT
);

CREATE TABLE CATEGORIA (
    id_categoria SERIAL PRIMARY KEY,
    nombre TEXT,
    descripcion TEXT,
    icono TEXT,
    activa BOOLEAN
);

CREATE TABLE PLAN_SUSCRIPCION (
    id_plan SERIAL PRIMARY KEY,
    nombre_plan TEXT,
    descripcion TEXT,
    precio_mensual DECIMAL,
    prioridad_busqueda INT,
    destacado_visual BOOLEAN,
    insignia_premium BOOLEAN,
    analytics_avanzados BOOLEAN,
    max_categorias INT,
    activo BOOLEAN
);

CREATE TABLE TRABAJADOR (
    id_trabajador SERIAL PRIMARY KEY,
    firebase_uid TEXT REFERENCES USUARIO(firebase_uid),
    descripcion TEXT,
    precio_hora DECIMAL,
    disponibilidad TEXT,
    ubicacion TEXT,
    latitud DECIMAL,
    longitud DECIMAL,
    radio_atencion_km INT,
    fecha_alta TIMESTAMPTZ,
    verificado BOOLEAN,
    activo BOOLEAN,
    Whatsapp TEXT,
    Facebook TEXT,
    Instagram TEXT,
    Email TEXT
);

CREATE TABLE SUSCRIPCION_TRABAJADOR (
    id_suscripcion SERIAL PRIMARY KEY,
    id_trabajador INT REFERENCES TRABAJADOR(id_trabajador),
    id_plan INT REFERENCES PLAN_SUSCRIPCION(id_plan),
    fecha_inicio TIMESTAMPTZ,
    fecha_vencimiento TIMESTAMPTZ,
    estado_suscripcion TEXT,
    metodo_pago TEXT,
    monto_pagado DECIMAL,
    fecha_pago TIMESTAMPTZ,
    auto_renovacion BOOLEAN
);

CREATE TABLE TRABAJADOR_CATEGORIA (
    id_trabajador INT REFERENCES TRABAJADOR(id_trabajador),
    id_categoria INT REFERENCES CATEGORIA(id_categoria),
    categoria_principal BOOLEAN,
    PRIMARY KEY (id_trabajador, id_categoria)
);

CREATE TABLE RESENA (
    id_resena SERIAL PRIMARY KEY,
    id_trabajador INT REFERENCES TRABAJADOR(id_trabajador),
    firebase_uid_usuario TEXT REFERENCES USUARIO(firebase_uid),
    calificacion INT,
    comentario TEXT,
    fecha_resena TIMESTAMPTZ,
    verificada BOOLEAN
);

CREATE TABLE FAVORITO (
    id_favorito SERIAL PRIMARY KEY,
    firebase_uid_usuario TEXT REFERENCES USUARIO(firebase_uid),
    id_trabajador INT REFERENCES TRABAJADOR(id_trabajador),
    fecha_agregado TIMESTAMPTZ
);

CREATE TABLE BUSQUEDA (
    id_busqueda SERIAL PRIMARY KEY,
    firebase_uid_usuario TEXT REFERENCES USUARIO(firebase_uid),
    termino_busqueda TEXT,
    id_categoria INT REFERENCES CATEGORIA(id_categoria),
    filtros_aplicados TEXT,
    latitud_busqueda DECIMAL,
    longitud_busqueda DECIMAL,
    fecha_busqueda TIMESTAMPTZ
);

CREATE TABLE CONTACTO (
    id_contacto SERIAL PRIMARY KEY,
    firebase_uid_usuario TEXT REFERENCES USUARIO(firebase_uid),
    id_trabajador INT REFERENCES TRABAJADOR(id_trabajador),
    tipo_contacto TEXT,
    fecha_contacto TIMESTAMPTZ,
    mensaje_opcional TEXT
);
