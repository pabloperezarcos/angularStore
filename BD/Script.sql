-- Crear secuencia para ID automático
CREATE SEQUENCE usuarios_seq START WITH 1 INCREMENT BY 1;

-- Crear tabla usuarios
CREATE TABLE usuarios (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100),
    username VARCHAR2(50) UNIQUE,
    email VARCHAR2(100) UNIQUE,
    password VARCHAR2(50),
    birthdate DATE,
    address VARCHAR2(255),
    rol VARCHAR2(20),
    imagen VARCHAR2(255)
);

-- Crear trigger para insertar ID automáticamente
CREATE OR REPLACE TRIGGER trg_usuarios_id
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT usuarios_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/

-- Insertar los datos
INSERT INTO usuarios (nombre, username, email, password, birthdate, address, rol, imagen) VALUES 
('Emanuel Silva', 'emanuel_silva', 'emanuel@gmail.com', '$Ema123$', TO_DATE('1990-05-15', 'YYYY-MM-DD'), 'Av. Siempre Viva 123, Santiago', 'cliente', '/assets/fotoperfil/emanuel.png');

INSERT INTO usuarios (nombre, username, email, password, birthdate, address, rol, imagen) VALUES 
('Pablo Perez', 'pablo_perez', 'pablo.perez@carnescdp.cl', '#Adm456#', TO_DATE('1985-08-10', 'YYYY-MM-DD'), 'Calle Falsa 456, Valparaíso', 'admin', '/assets/fotoperfil/pablo.png');

INSERT INTO usuarios (nombre, username, email, password, birthdate, address, rol, imagen) VALUES 
('Martina López', 'martina_lopez', 'martina.lopez@gmail.com', 'M4rt!na8', TO_DATE('1992-12-01', 'YYYY-MM-DD'), 'Calle Real 789, Concepción', 'cliente', '/assets/fotoperfil/martina.png');

INSERT INTO usuarios (nombre, username, email, password, birthdate, address, rol, imagen) VALUES 
('Sebastián Rojas', 'sebastian_rojas', 'sebastian.rojas@gmail.com', 'Seb4$123', TO_DATE('1993-11-21', 'YYYY-MM-DD'), 'Avenida Principal 101, Temuco', 'cliente', '/assets/fotoperfil/sebastian.png');

INSERT INTO usuarios (nombre, username, email, password, birthdate, address, rol, imagen) VALUES 
('Isidora Gómez', 'isidora_gomez', 'isidora.gomez@gmail.com', 'I$!dora9', TO_DATE('1995-04-12', 'YYYY-MM-DD'), 'Calle Secundaria 202, Antofagasta', 'cliente', '/assets/fotoperfil/isidora.png');

INSERT INTO usuarios (nombre, username, email, password, birthdate, address, rol, imagen) VALUES 
('Matías Torres', 'matias_torres', 'matias.torres@gmail.com', 'Mati4s#7', TO_DATE('1991-07-30', 'YYYY-MM-DD'), 'Calle Tercera 303, La Serena', 'cliente', '/assets/fotoperfil/matias.png');

INSERT INTO usuarios (nombre, username, email, password, birthdate, address, rol, imagen) VALUES 
('Catalina Fernández', 'catalina_fernandez', 'catalina.fernandez@gmail.com', 'C4tal!na', TO_DATE('1994-03-25', 'YYYY-MM-DD'), 'Avenida Cuarta 404, Iquique', 'cliente', '/assets/fotoperfil/catalina.png');

INSERT INTO usuarios (nombre, username, email, password, birthdate, address, rol, imagen) VALUES 
('Joaquín Castillo', 'joaquin_castillo', 'joaquin.castillo@gmail.com', 'Joaq#123', TO_DATE('1996-09-15', 'YYYY-MM-DD'), 'Calle Quinta 505, Punta Arenas', 'cliente', '/assets/fotoperfil/joaquin.png');

INSERT INTO usuarios (nombre, username, email, password, birthdate, address, rol, imagen) VALUES 
('Vicente Martínez', 'vicente_martinez', 'vicente.martinez@carnescdp.cl', 'V1cent#8', TO_DATE('1989-02-18', 'YYYY-MM-DD'), 'Avenida Séptima 707, Rancagua', 'admin', '/assets/fotoperfil/vicente.png');

-- Crear secuencia para ID automático
CREATE SEQUENCE productos_seq START WITH 1 INCREMENT BY 1;

-- Crear tabla productos
CREATE TABLE productos (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(150),
    descripcion VARCHAR2(500),
    precio NUMBER(10, 2),
    stock NUMBER,
    imagen VARCHAR2(255),
    sku VARCHAR2(50) UNIQUE
);

-- Crear trigger para insertar ID automáticamente
CREATE OR REPLACE TRIGGER trg_productos_id
BEFORE INSERT ON productos
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT productos_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/

-- Insertar los datos
INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Libro de Java Avanzado', 'Libro completo de Java para desarrollo FullStack III', 75990, 50, 'assets/images/libro-java-avanzado.png', 'JAVA-001');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Libro de Spring Boot', 'Libro esencial para desarrollar aplicaciones con Spring Boot en FullStack III', 49990, 100, 'assets/images/libro-springboot.png', 'SPRING-001');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Suscripción Mensual a Plataforma Online', 'Acceso ilimitado a recursos y tutoriales de FullStack III', 13990, 99999, 'assets/images/suscripcion-plataforma.png', 'SUB-001');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Libro de Angular', 'Aprende Angular desde cero hasta nivel avanzado con este libro.', 45990, 75, 'assets/images/libro-angular.png', 'ANG-001');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Curso en Línea de TypeScript', 'Curso completo para dominar TypeScript y sus aplicaciones.', 19990, 200, 'assets/images/curso-typescript.png', 'TS-001');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Taller Práctico de Node.js', 'Taller intensivo para aprender Node.js con ejercicios prácticos.', 29990, 50, 'assets/images/taller-nodejs.png', 'NODE-001');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Libro de React.js', 'Guía completa para aprender y dominar React.js.', 39990, 80, 'assets/images/libro-react.png', 'REACT-001');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Libro de Bases de Datos', 'Todo lo que necesitas saber sobre bases de datos SQL y NoSQL.', 55990, 60, 'assets/images/libro-bases-datos.png', 'DB-001');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Curso Avanzado de Docker', 'Curso en línea para aprender Docker y contenedores desde cero.', 34990, 150, 'assets/images/curso-docker.png', 'DOCKER-001');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, sku) VALUES 
('Kit de Desarrollo FullStack', 'Incluye recursos y herramientas esenciales para desarrolladores FullStack.', 89990, 30, 'assets/images/kit-fullstack.png', 'FULLSTACK-001');

-- Confirma los cambios
COMMIT;





