/**
 * VinculaTec — seed.js
 * Pobla la base de datos con datos de prueba realistas para 2026.
 *
 * Uso:
 *   cd backend
 *   node seed.js
 *
 * Requiere que el schema ya esté aplicado (node schema.sql).
 * Borra y re-inserta datos en cada ejecución para un estado limpio.
 */

require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

// ── Conexión ─────────────────────────────────────────────────
async function getConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "vinculatec",
    multipleStatements: true,
  });
}

// ── Datos ────────────────────────────────────────────────────
const PASSWORD_PLAIN = "vinculatec123";

const USUARIOS = [
  {
    nombre: "Ana",
    apellidos: "García Mendoza",
    correo: "ana.garcia@itm.edu.mx",
    rol: "residente",
  },
  {
    nombre: "Luis",
    apellidos: "Hernández Ruiz",
    correo: "luis.hernandez@itm.edu.mx",
    rol: "residente",
  },
  {
    nombre: "Sofía",
    apellidos: "Martínez López",
    correo: "sofia.martinez@itm.edu.mx",
    rol: "residente",
  },
  {
    nombre: "Pedro",
    apellidos: "Ramírez Castillo",
    correo: "pedro.ramirez@itm.edu.mx",
    rol: "residente",
  },
  {
    nombre: "Marco",
    apellidos: "Reyes Torres",
    correo: "marco.reyes@itm.edu.mx",
    rol: "asesor",
  },
  {
    nombre: "Laura",
    apellidos: "Vega Salinas",
    correo: "laura.vega@itm.edu.mx",
    rol: "asesor",
  },
  {
    nombre: "Carlos",
    apellidos: "Mendoza Ibarra",
    correo: "director@itm.edu.mx",
    rol: "jefe",
  },
];

const EMPRESAS = [
  {
    nombre: "SoftSolutions SA",
    sector: "Tecnología",
    ciudad: "Monterrey",
    estado: "Activa",
    convenio_vencimiento: "2026-08-31",
    contacto_nombre: "Ing. Flores",
    contacto_email: "flores@softsolutions.mx",
    contacto_telefono: "8112345678",
  },
  {
    nombre: "DataCore MX",
    sector: "Datos & IA",
    ciudad: "Ciudad de México",
    estado: "Activa",
    convenio_vencimiento: "2026-12-15",
    contacto_nombre: "Lic. Torres",
    contacto_email: "torres@datacore.mx",
    contacto_telefono: "5512345678",
  },
  {
    nombre: "InnovaLogística",
    sector: "Logística",
    ciudad: "Guadalajara",
    estado: "Por Vencer",
    convenio_vencimiento: "2026-01-20",
    contacto_nombre: "Ing. Ramírez",
    contacto_email: "iramirez@innova.mx",
    contacto_telefono: "3312345678",
  },
  {
    nombre: "TecnoAgro del Norte",
    sector: "Agroindustria",
    ciudad: "Hermosillo",
    estado: "Nueva",
    convenio_vencimiento: "2026-06-30",
    contacto_nombre: "Dr. Estrada",
    contacto_email: "estrada@tecnoagro.mx",
    contacto_telefono: "6621234567",
  },
];

// ── Main ──────────────────────────────────────────────────────
async function seed() {
  const conn = await getConnection();
  console.log("✅  Conectado a MySQL.");

  try {
    // Deshabilitar FK checks para limpieza
    await conn.execute("SET FOREIGN_KEY_CHECKS = 0");
    for (const t of [
      "fuentes_informacion",
      "notificaciones",
      "citas",
      "reportes",
      "proyectos",
      "residentes",
      "asesores",
      "jefes_vinculacion",
      "empresas",
      "usuarios",
    ]) {
      await conn.execute(`TRUNCATE TABLE ${t}`);
    }
    await conn.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log("🗑️   Tablas limpiadas.");

    // Hash de contraseña compartida
    const hash = await bcrypt.hash(PASSWORD_PLAIN, 10);

    // ── Usuarios ─────────────────────────────────────────
    const usuarioIds = {};
    for (const u of USUARIOS) {
      const [r] = await conn.execute(
        "INSERT INTO usuarios (nombre, apellidos, correo, password_hash, rol) VALUES (?,?,?,?,?)",
        [u.nombre, u.apellidos, u.correo, hash, u.rol],
      );
      usuarioIds[u.correo] = r.insertId;
    }
    console.log(`👤  ${USUARIOS.length} usuarios insertados.`);

    // ── Empresas ─────────────────────────────────────────
    const empresaIds = [];
    for (const e of EMPRESAS) {
      const [r] = await conn.execute(
        "INSERT INTO empresas (nombre, sector, ciudad, estado, convenio_vencimiento, contacto_nombre, contacto_email, contacto_telefono) VALUES (?,?,?,?,?,?,?,?)",
        [
          e.nombre,
          e.sector,
          e.ciudad,
          e.estado,
          e.convenio_vencimiento,
          e.contacto_nombre,
          e.contacto_email,
          e.contacto_telefono,
        ],
      );
      empresaIds.push(r.insertId);
    }
    console.log(`🏢  ${EMPRESAS.length} empresas insertadas.`);

    // ── Asesores ─────────────────────────────────────────
    const asesorIds = {};
    const asesorUsers = USUARIOS.filter((u) => u.rol === "asesor");
    const deptos = ["Ing. en Sistemas", "Ing. Industrial"];
    for (let i = 0; i < asesorUsers.length; i++) {
      const uid = usuarioIds[asesorUsers[i].correo];
      const [r] = await conn.execute(
        "INSERT INTO asesores (usuario_id, departamento, num_empleado, max_residentes) VALUES (?,?,?,?)",
        [
          uid,
          deptos[i] || "Ciencias Básicas",
          `EMP-${String(uid).padStart(4, "0")}`,
          12,
        ],
      );
      asesorIds[asesorUsers[i].correo] = r.insertId;
    }
    console.log(`👨‍🏫  ${asesorUsers.length} asesores insertados.`);

    // ── Jefe de Vinculación ───────────────────────────────
    const jefeUser = USUARIOS.find((u) => u.rol === "jefe");
    const jefeUid = usuarioIds[jefeUser.correo];
    const [jefeR] = await conn.execute(
      "INSERT INTO jefes_vinculacion (usuario_id, departamento) VALUES (?,?)",
      [jefeUid, "Vinculación y Residencia Profesional"],
    );
    const jefeId = jefeR.insertId;
    console.log("🎓  Jefe de vinculación insertado.");

    // ── Residentes ────────────────────────────────────────
    const residenteUsers = USUARIOS.filter((u) => u.rol === "residente");
    const carreras = [
      "Ing. en Sistemas de Información",
      "Ing. Industrial",
      "Ing. en Sistemas de Información",
      "Ing. Electrónica",
    ];
    const residenteIds = [];
    const asesorList = Object.values(asesorIds);
    for (let i = 0; i < residenteUsers.length; i++) {
      const uid = usuarioIds[residenteUsers[i].correo];
      const [r] = await conn.execute(
        `INSERT INTO residentes
          (usuario_id, num_control, carrera, semestre, empresa_id, asesor_id,
           horas_completadas, horas_requeridas, fecha_inicio, fecha_fin, estado)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
          uid,
          `21${String(uid).padStart(6, "0")}`,
          carreras[i] || "Ing. Industrial",
          9,
          empresaIds[i % empresaIds.length],
          asesorList[i % asesorList.length],
          i * 120,
          480,
          "2026-01-13",
          "2026-07-13",
          "activo",
        ],
      );
      residenteIds.push(r.insertId);
    }
    console.log(`🎒  ${residenteUsers.length} residentes insertados.`);

    // ── Proyectos ─────────────────────────────────────────
    const proyectos = [
      {
        titulo: "Sistema de Gestión de Inventarios",
        descripcion: "Desarrollo de módulo web para control de almacén.",
        estado: "desarrollo",
        prioridad: "Alta",
        tecnologias: "React, Node.js, MySQL",
        progreso: 65,
      },
      {
        titulo: "Dashboard de Analítica Industrial",
        descripcion: "Panel de métricas en tiempo real con IoT.",
        estado: "revision",
        prioridad: "Media",
        tecnologias: "Python, Power BI, MQTT",
        progreso: 90,
      },
      {
        titulo: "App de Rastreo Logístico",
        descripcion: "Aplicación móvil para seguimiento de rutas.",
        estado: "propuesto",
        prioridad: "Baja",
        tecnologias: "React Native, Firebase",
        progreso: 10,
      },
      {
        titulo: "Automatización de Reportes",
        descripcion: "Scripts de generación automática de informes.",
        estado: "concluido",
        prioridad: "Media",
        tecnologias: "Python, pandas, Excel",
        progreso: 100,
      },
    ];
    for (let i = 0; i < proyectos.length; i++) {
      const p = proyectos[i];
      await conn.execute(
        `INSERT INTO proyectos (titulo, descripcion, empresa_id, residente_id, asesor_id, estado, prioridad, tecnologias, progreso)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          p.titulo,
          p.descripcion,
          empresaIds[i % empresaIds.length],
          residenteIds[i % residenteIds.length],
          asesorList[i % asesorList.length],
          p.estado,
          p.prioridad,
          p.tecnologias,
          p.progreso,
        ],
      );
    }
    console.log(`🗂️   ${proyectos.length} proyectos insertados.`);

    // ── Reportes ──────────────────────────────────────────
    const tiposReporte = [
      "preliminar",
      "parcial1",
      "parcial2",
      "parcial3",
      "final",
    ];
    const estadosReporte = [
      "Aprobado",
      "En Revisión",
      "Pendiente",
      "Pendiente",
      "Pendiente",
    ];
    for (const rid of residenteIds) {
      for (let t = 0; t < tiposReporte.length; t++) {
        await conn.execute(
          `INSERT INTO reportes (residente_id, tipo, fecha_limite, fecha_entrega, estado)
           VALUES (?,?,?,?,?)`,
          [
            rid,
            tiposReporte[t],
            `2026-0${t + 2}-15`,
            t < 2 ? `2026-0${t + 2}-14` : null,
            estadosReporte[t],
          ],
        );
      }
    }
    console.log(`📄  Reportes insertados.`);

    // ── Citas ─────────────────────────────────────────────
    const citas = [
      {
        sol: usuarioIds["ana.garcia@itm.edu.mx"],
        par: usuarioIds["marco.reyes@itm.edu.mx"],
        tipo: "Asesoría",
        motivo: "Revisión de avance",
        fecha: "2026-01-15 10:00:00",
        lugar: "Sala 204",
        estado: "Confirmada",
      },
      {
        sol: usuarioIds["luis.hernandez@itm.edu.mx"],
        par: usuarioIds["laura.vega@itm.edu.mx"],
        tipo: "Revisión",
        motivo: "Entrega Reporte Parcial 1",
        fecha: "2026-01-20 09:00:00",
        lugar: "Oficina A3",
        estado: "Confirmada",
      },
      {
        sol: usuarioIds["sofia.martinez@itm.edu.mx"],
        par: usuarioIds["marco.reyes@itm.edu.mx"],
        tipo: "Evaluación",
        motivo: "Evaluación intermedia",
        fecha: "2026-02-10 11:00:00",
        lugar: "Virtual",
        estado: "Pendiente",
      },
      {
        sol: usuarioIds["ana.garcia@itm.edu.mx"],
        par: usuarioIds["director@itm.edu.mx"],
        tipo: "Asesoría",
        motivo: "Validación de fuente",
        fecha: "2026-02-03 14:00:00",
        lugar: "Rectoría",
        estado: "Pendiente",
      },
    ];
    for (const c of citas) {
      await conn.execute(
        `INSERT INTO citas (solicitante_id, participante_id, tipo, motivo, fecha_hora, lugar, estado)
         VALUES (?,?,?,?,?,?,?)`,
        [c.sol, c.par, c.tipo, c.motivo, c.fecha, c.lugar, c.estado],
      );
    }
    console.log(`📅  ${citas.length} citas insertadas.`);

    // ── Notificaciones ────────────────────────────────────
    const notifs = [
      {
        uid: usuarioIds["ana.garcia@itm.edu.mx"],
        tipo: "Cita",
        titulo: "Cita confirmada con Asesor Marco",
        cuerpo: "Tu cita del 15 de enero fue confirmada.",
        icono: "calendar",
        leida: false,
      },
      {
        uid: usuarioIds["luis.hernandez@itm.edu.mx"],
        tipo: "Reporte",
        titulo: "Reporte Preliminar Aprobado",
        cuerpo: "Tu reporte preliminar fue aprobado.",
        icono: "file-text",
        leida: true,
      },
      {
        uid: usuarioIds["marco.reyes@itm.edu.mx"],
        tipo: "Mensaje",
        titulo: "Nueva solicitud de cita",
        cuerpo: "Ana García solicitó una asesoría.",
        icono: "message-circle",
        leida: false,
      },
      {
        uid: usuarioIds["director@itm.edu.mx"],
        tipo: "Alerta",
        titulo: "Convenio próximo a vencer",
        cuerpo: "InnovaLogística vence el 20 de enero.",
        icono: "alert-triangle",
        leida: false,
      },
      {
        uid: usuarioIds["sofia.martinez@itm.edu.mx"],
        tipo: "Logro",
        titulo: "¡240 horas completadas!",
        cuerpo: "Alcanzaste el 50% de tus horas requeridas.",
        icono: "award",
        leida: false,
      },
    ];
    for (const n of notifs) {
      await conn.execute(
        "INSERT INTO notificaciones (usuario_id, tipo, titulo, cuerpo, icono, leida) VALUES (?,?,?,?,?,?)",
        [n.uid, n.tipo, n.titulo, n.cuerpo, n.icono, n.leida],
      );
    }
    console.log(`🔔  ${notifs.length} notificaciones insertadas.`);

    // ── Fuentes de información ────────────────────────────
    const fuentes = [
      {
        res: residenteIds[0],
        tipo: "propia",
        desc: "Propuesta desarrollada por el residente",
        estado: "Validada",
        obs: "Bien fundamentada.",
      },
      {
        res: residenteIds[1],
        tipo: "banco",
        desc: "Proyecto del banco institucional",
        estado: "Validada",
        obs: "Aprobada sin observaciones.",
      },
      {
        res: residenteIds[2],
        tipo: "empresa",
        desc: "Propuesta de la empresa receptora",
        estado: "Pendiente",
        obs: null,
      },
      {
        res: residenteIds[3],
        tipo: "propia",
        desc: "Iniciativa de automatización",
        estado: "Pendiente",
        obs: null,
      },
    ];
    for (const f of fuentes) {
      await conn.execute(
        `INSERT INTO fuentes_informacion (residente_id, tipo, descripcion, estado, revisado_por, fecha_revision, observaciones)
         VALUES (?,?,?,?,?,?,?)`,
        [
          f.res,
          f.tipo,
          f.desc,
          f.estado,
          f.estado === "Validada" ? jefeId : null,
          f.estado === "Validada" ? "2026-01-10" : null,
          f.obs,
        ],
      );
    }
    console.log(`📚  ${fuentes.length} fuentes insertadas.`);

    console.log("\n🎉  Seed completado exitosamente.");
    console.log("🔑  Contraseña de todos los usuarios: vinculatec123");
    console.log("────────────────────────────────────────────────");
    console.log(
      "  Residentes:  ana.garcia | luis.hernandez | sofia.martinez | pedro.ramirez",
    );
    console.log(
      "  Asesores:    marco.reyes | laura.vega   (dominio: @itm.edu.mx)",
    );
    console.log("  Jefe:        director@itm.edu.mx");
  } catch (err) {
    console.error("❌  Error en seed:", err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

seed();
