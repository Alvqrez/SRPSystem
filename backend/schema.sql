-- ============================================================
--  VinculaTec — Schema MySQL
--  Ejecutar en MySQL Workbench como usuario root
-- ============================================================

CREATE DATABASE IF NOT EXISTS vinculatec
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vinculatec;

-- ── Usuarios (tabla central de autenticación) ────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  apellidos     VARCHAR(100) NOT NULL,
  correo        VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           ENUM('residente','asesor','jefe') NOT NULL,
  activo        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Empresas ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS empresas (
  id                  INT          PRIMARY KEY AUTO_INCREMENT,
  nombre              VARCHAR(150) NOT NULL,
  sector              VARCHAR(100),
  ciudad              VARCHAR(100),
  estado              ENUM('Activa','Por Vencer','Nueva','Inactiva') DEFAULT 'Nueva',
  convenio_vencimiento DATE,
  contacto_nombre     VARCHAR(100),
  contacto_email      VARCHAR(150),
  contacto_telefono   VARCHAR(30),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Asesores (extiende usuarios) ─────────────────────────────
CREATE TABLE IF NOT EXISTS asesores (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id      INT NOT NULL UNIQUE,
  departamento    VARCHAR(100),
  num_empleado    VARCHAR(30),
  max_residentes  INT DEFAULT 10,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ── Jefes de Vinculación (extiende usuarios) ─────────────────
CREATE TABLE IF NOT EXISTS jefes_vinculacion (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id      INT NOT NULL UNIQUE,
  departamento    VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ── Residentes (extiende usuarios) ───────────────────────────
CREATE TABLE IF NOT EXISTS residentes (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id        INT NOT NULL UNIQUE,
  num_control       VARCHAR(20) UNIQUE,
  carrera           VARCHAR(100),
  semestre          INT,
  empresa_id        INT,
  asesor_id         INT,
  horas_completadas INT          DEFAULT 0,
  horas_requeridas  INT          DEFAULT 480,
  fecha_inicio      DATE,
  fecha_fin         DATE,
  estado            ENUM('activo','completado','baja') DEFAULT 'activo',
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE,
  FOREIGN KEY (empresa_id)  REFERENCES empresas(id)  ON DELETE SET NULL,
  FOREIGN KEY (asesor_id)   REFERENCES asesores(id)  ON DELETE SET NULL
);

-- ── Proyectos ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS proyectos (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  titulo        VARCHAR(200) NOT NULL,
  descripcion   TEXT,
  empresa_id    INT,
  residente_id  INT,
  asesor_id     INT,
  estado        ENUM('propuesto','desarrollo','revision','concluido') DEFAULT 'propuesto',
  prioridad     ENUM('Alta','Media','Baja') DEFAULT 'Media',
  tecnologias   VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id)   REFERENCES empresas(id)   ON DELETE SET NULL,
  FOREIGN KEY (residente_id) REFERENCES residentes(id) ON DELETE SET NULL,
  FOREIGN KEY (asesor_id)    REFERENCES asesores(id)   ON DELETE SET NULL
);

-- ── Reportes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reportes (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  residente_id  INT NOT NULL,
  tipo          ENUM('preliminar','parcial1','parcial2','parcial3','final') NOT NULL,
  fecha_limite  DATE,
  fecha_entrega DATE,
  estado        ENUM('Pendiente','Entregado','En Revisión','Aprobado','Rechazado') DEFAULT 'Pendiente',
  calificacion  DECIMAL(5,2),
  feedback      TEXT,
  archivo_url   VARCHAR(500),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (residente_id) REFERENCES residentes(id) ON DELETE CASCADE
);

-- ── Notificaciones ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notificaciones (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  usuario_id  INT          NOT NULL,
  tipo        ENUM('Reporte','Aprobación','Cita','Alerta','Mensaje','Logro') NOT NULL,
  titulo      VARCHAR(200) NOT NULL,
  cuerpo      TEXT,
  leida       BOOLEAN      DEFAULT FALSE,
  icono       VARCHAR(50)  DEFAULT 'bell',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ── Citas / Calendario ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS citas (
  id              INT          PRIMARY KEY AUTO_INCREMENT,
  solicitante_id  INT          NOT NULL,
  participante_id INT          NOT NULL,
  motivo          VARCHAR(200),
  fecha_hora      DATETIME     NOT NULL,
  lugar           VARCHAR(150),
  estado          ENUM('Pendiente','Confirmada','Cancelada') DEFAULT 'Pendiente',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitante_id)  REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (participante_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
--  Datos de prueba (contraseña de todos: "vinculatec123")
--  Hash generado con bcrypt rounds=10
-- ============================================================
INSERT IGNORE INTO usuarios (nombre, apellidos, correo, password_hash, rol) VALUES
('Ana',     'García Mendoza',   'ana.garcia@itm.edu.mx',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuu', 'residente'),
('Luis',    'Hernández Ruiz',   'luis.hernandez@itm.edu.mx', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuu', 'residente'),
('Sofía',   'Martínez López',   'sofia.martinez@itm.edu.mx', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuu', 'residente'),
('Marco',   'Reyes Torres',     'marco.reyes@itm.edu.mx',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuu', 'asesor'),
('Laura',   'Vega Salinas',     'laura.vega@itm.edu.mx',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuu', 'asesor'),
('Carlos',  'Mendoza Ibarra',   'director@itm.edu.mx',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuu', 'jefe');
