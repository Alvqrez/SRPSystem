-- ============================================================
-- VinculaTec — Schema MySQL (versión mejorada 2026)
-- Ejecutar en MySQL Workbench como usuario root
-- ============================================================

DROP DATABASE IF EXISTS vinculatec;
CREATE DATABASE vinculatec CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vinculatec;

-- ── Usuarios ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  apellidos     VARCHAR(100) NOT NULL,
  correo        VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           ENUM('residente','asesor','jefe') NOT NULL,
  activo        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rol (rol),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Empresas ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS empresas (
  id                   INT          PRIMARY KEY AUTO_INCREMENT,
  nombre               VARCHAR(150) NOT NULL,
  sector               VARCHAR(100),
  ciudad               VARCHAR(100),
  estado               ENUM('Activa','Por Vencer','Nueva','Inactiva') DEFAULT 'Nueva',
  convenio_vencimiento DATE,
  contacto_nombre      VARCHAR(100),
  contacto_email       VARCHAR(150),
  contacto_telefono    VARCHAR(30),
  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_estado (estado),
  INDEX idx_convenio (convenio_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Asesores ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asesores (
  id              INT          PRIMARY KEY AUTO_INCREMENT,
  usuario_id      INT          NOT NULL UNIQUE,
  departamento    VARCHAR(100),
  num_empleado    VARCHAR(30),
  max_residentes  INT DEFAULT 10,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Jefes de Vinculación ────────────────────────────────────
CREATE TABLE IF NOT EXISTS jefes_vinculacion (
  id           INT          PRIMARY KEY AUTO_INCREMENT,
  usuario_id   INT          NOT NULL UNIQUE,
  departamento VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Residentes ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS residentes (
  id                INT          PRIMARY KEY AUTO_INCREMENT,
  usuario_id        INT          NOT NULL UNIQUE,
  num_control       VARCHAR(20)  UNIQUE,
  carrera           VARCHAR(100),
  semestre          INT,
  empresa_id        INT,
  asesor_id         INT,
  horas_completadas INT          DEFAULT 0,
  horas_requeridas  INT          DEFAULT 480,
  fecha_inicio      DATE,
  fecha_fin         DATE,
  estado            ENUM('activo','completado','baja') DEFAULT 'activo',
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)   ON DELETE CASCADE,
  FOREIGN KEY (empresa_id)  REFERENCES empresas(id)   ON DELETE SET NULL,
  FOREIGN KEY (asesor_id)   REFERENCES asesores(id)   ON DELETE SET NULL,
  INDEX idx_estado (estado),
  INDEX idx_asesor (asesor_id),
  INDEX idx_empresa (empresa_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Trigger ─────────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_residente_estado;

DELIMITER //
CREATE TRIGGER trg_residente_estado
BEFORE UPDATE ON residentes
FOR EACH ROW
BEGIN
  IF NEW.horas_completadas >= NEW.horas_requeridas AND NEW.estado = 'activo' THEN
    SET NEW.estado = 'completado';
  END IF;
END;
//
DELIMITER ;

-- ── Proyectos ───────────────────────────────────────────────
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
  progreso      DECIMAL(5,2) DEFAULT 0,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id)   REFERENCES empresas(id)   ON DELETE SET NULL,
  FOREIGN KEY (residente_id) REFERENCES residentes(id) ON DELETE SET NULL,
  FOREIGN KEY (asesor_id)    REFERENCES asesores(id)   ON DELETE SET NULL,
  INDEX idx_estado_prioridad (estado, prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Reportes ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reportes (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  residente_id  INT          NOT NULL,
  tipo          ENUM('preliminar','parcial1','parcial2','parcial3','final') NOT NULL,
  fecha_limite  DATE,
  fecha_entrega DATE,
  estado        ENUM('Pendiente','Entregado','En Revisión','Aprobado','Rechazado') DEFAULT 'Pendiente',
  calificacion  DECIMAL(5,2),
  feedback      TEXT,
  archivo_url   VARCHAR(500),
  revisado_por  INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (residente_id) REFERENCES residentes(id) ON DELETE CASCADE,
  FOREIGN KEY (revisado_por) REFERENCES usuarios(id)   ON DELETE SET NULL,
  INDEX idx_tipo (tipo),
  INDEX idx_estado (estado),
  INDEX idx_residente (residente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Notificaciones ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notificaciones (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  usuario_id  INT          NOT NULL,
  tipo        ENUM('Reporte','Aprobación','Cita','Alerta','Mensaje','Logro') NOT NULL,
  titulo      VARCHAR(200) NOT NULL,
  cuerpo      TEXT,
  leida       BOOLEAN      DEFAULT FALSE,
  icono       VARCHAR(50)  DEFAULT 'bell',
  url_accion  VARCHAR(300),
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario_leida (usuario_id, leida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Citas / Calendario ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS citas (
  id              INT          PRIMARY KEY AUTO_INCREMENT,
  solicitante_id  INT          NOT NULL,
  participante_id INT          NOT NULL,
  tipo            ENUM('Asesoría','Revisión','Evaluación','Entrega','Otro') DEFAULT 'Asesoría',
  motivo          VARCHAR(200),
  notas           TEXT,
  fecha_hora      DATETIME     NOT NULL,
  lugar           VARCHAR(150),
  estado          ENUM('Pendiente','Confirmada','Cancelada') DEFAULT 'Pendiente',
  external_id     VARCHAR(100),
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitante_id)  REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (participante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_fecha (fecha_hora),
  INDEX idx_estado (estado),
  INDEX idx_solicitante (solicitante_id),
  INDEX idx_participante (participante_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Fuentes de Información ──────────────────────────────────
CREATE TABLE IF NOT EXISTS fuentes_informacion (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  residente_id  INT          NOT NULL,
  tipo          ENUM('propia','banco','empresa') NOT NULL,
  descripcion   VARCHAR(300),
  estado        ENUM('Pendiente','Validada','Rechazada') DEFAULT 'Pendiente',
  revisado_por  INT,
  fecha_revision DATE,
  observaciones  TEXT,
  FOREIGN KEY (residente_id) REFERENCES residentes(id) ON DELETE CASCADE,
  FOREIGN KEY (revisado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_tipo (tipo),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
