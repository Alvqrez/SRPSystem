/**
 * VinculaTec — seed.js
 * Pobla la base de datos con datos de prueba realistas para 2026.
 *
 * Uso:
 *   cd backend
 *   node seed.js
 *
 * Relaciones:
 *   - 1 Jefe de Vinculación (Carlos Mendoza) supervisa todo
 *   - Asesor Marco Reyes  → Ana, Sofía, Carmen, Diana  (4 residentes)
 *   - Asesor Laura Vega   → Luis, Pedro, Miguel, Roberto (4 residentes)
 *   - Cada residente tiene su proyecto asignado al mismo asesor
 */

require("dotenv").config();
const mysql  = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function getConnection() {
  return mysql.createConnection({
    host:               process.env.DB_HOST     || "localhost",
    port:               process.env.DB_PORT     || 3306,
    user:               process.env.DB_USER     || "root",
    password:           process.env.DB_PASSWORD || "",
    database:           process.env.DB_NAME     || "vinculatec",
    multipleStatements: true,
  });
}

const PASSWORD_PLAIN = "vinculatec123";

// ── Usuarios ──────────────────────────────────────────────────────────────────
const USUARIOS = [
  // Residentes — asesor Marco (ids 1,3,8,10)
  { id: "1",  nombre: "Ana",     apellidos: "García Mendoza",    correo: "ana.garcia@itm.edu.mx",      rol: "residente" },
  { id: "3",  nombre: "Sofía",   apellidos: "Martínez López",    correo: "sofia.martinez@itm.edu.mx",  rol: "residente" },
  { id: "8",  nombre: "Carmen",  apellidos: "López Herrera",     correo: "carmen.lopez@itm.edu.mx",    rol: "residente" },
  { id: "10", nombre: "Diana",   apellidos: "Flores Gutiérrez",  correo: "diana.flores@itm.edu.mx",    rol: "residente" },
  // Residentes — asesor Laura (ids 2,4,9,11)
  { id: "2",  nombre: "Luis",    apellidos: "Hernández Ruiz",    correo: "luis.hernandez@itm.edu.mx",  rol: "residente" },
  { id: "4",  nombre: "Pedro",   apellidos: "Ramírez Gómez",     correo: "pedro.ramirez@itm.edu.mx",   rol: "residente" },
  { id: "9",  nombre: "Miguel",  apellidos: "Torres Castillo",   correo: "miguel.torres@itm.edu.mx",   rol: "residente" },
  { id: "11", nombre: "Roberto", apellidos: "Sánchez Vidal",     correo: "roberto.sanchez@itm.edu.mx", rol: "residente" },
  // Asesores
  { id: "5",  nombre: "Marco",   apellidos: "Reyes Hernández",   correo: "marco.reyes@itm.edu.mx",     rol: "asesor"    },
  { id: "6",  nombre: "Laura",   apellidos: "Vega Jiménez",      correo: "laura.vega@itm.edu.mx",      rol: "asesor"    },
  // Jefe de Vinculación
  { id: "7",  nombre: "Carlos",  apellidos: "Mendoza Pérez",     correo: "director@itm.edu.mx",        rol: "jefe"      },
];

const EMPRESAS = [
  { id: "EMP-1", nombre: "SoftSolutions SA",    sector: "Tecnología",   ciudad: "Monterrey",    estado: "Activa",     convenio_vencimiento: "2026-08-31", contacto_nombre: "Ing. Flores",   contacto_email: "flores@softsolutions.mx",  contacto_telefono: "8112345678" },
  { id: "EMP-2", nombre: "DataCore MX",         sector: "Datos & IA",   ciudad: "CDMX",         estado: "Activa",     convenio_vencimiento: "2026-12-15", contacto_nombre: "Lic. Torres",   contacto_email: "torres@datacore.mx",       contacto_telefono: "5512345678" },
  { id: "EMP-3", nombre: "InnovaLogística",     sector: "Logística",    ciudad: "Guadalajara",  estado: "Por Vencer", convenio_vencimiento: "2026-01-20", contacto_nombre: "Ing. Ramírez",  contacto_email: "iramirez@innova.mx",       contacto_telefono: "3312345678" },
  { id: "EMP-4", nombre: "TecnoAgro del Norte", sector: "Agroindustria",ciudad: "Hermosillo",   estado: "Nueva",      convenio_vencimiento: "2026-06-30", contacto_nombre: "Dr. Estrada",   contacto_email: "estrada@tecnoagro.mx",     contacto_telefono: "6621234567" },
  { id: "EMP-5", nombre: "RedMovil MX",         sector: "Telecom",      ciudad: "Monterrey",    estado: "Activa",     convenio_vencimiento: "2026-09-10", contacto_nombre: "Ing. Salinas",  contacto_email: "salinas@redmovil.mx",      contacto_telefono: "8129876543" },
  { id: "EMP-6", nombre: "EcoEnergía Verde",    sector: "Energía",      ciudad: "Veracruz",     estado: "Nueva",      convenio_vencimiento: "2026-11-30", contacto_nombre: "Dra. Moreno",   contacto_email: "moreno@ecoenergia.mx",     contacto_telefono: "2291234567" },
];

// ── Residentes con su asesor asignado ─────────────────────────────────────────
// [usuarioId, asesorId, empresaId, carrera, horasCompletadas]
const RESIDENTES_CONFIG = [
  // Marco's group (ASE-5)
  ["1",  "ASE-5", "EMP-1", "Ing. en Sistemas de Información", 360],
  ["3",  "ASE-5", "EMP-2", "Ing. en Sistemas de Información", 240],
  ["8",  "ASE-5", "EMP-5", "Ing. en Sistemas de Información", 120],
  ["10", "ASE-5", "EMP-6", "Ing. Electrónica",                 60],
  // Laura's group (ASE-6)
  ["2",  "ASE-6", "EMP-2", "Ing. Industrial",                 480],
  ["4",  "ASE-6", "EMP-3", "Ing. Industrial",                 180],
  ["9",  "ASE-6", "EMP-4", "Ing. en Gestión Empresarial",     300],
  ["11", "ASE-6", "EMP-1", "Ing. Electrónica",                 90],
];

// ── Proyectos (uno por residente, agrupados por asesor) ───────────────────────
const PROYECTOS = [
  // Marco's group
  { id: "PROY-1", titulo: "Sistema de Gestión de Inventarios",    desc: "Módulo web para control de almacén en tiempo real.",            estado: "desarrollo",  prioridad: "Alta",  tech: "React, Node.js, MySQL",       progreso: 75, resIdx: 0 },
  { id: "PROY-2", titulo: "App CRM para PYME",                    desc: "Aplicación de gestión de clientes para pequeñas empresas.",     estado: "revision",    prioridad: "Media", tech: "React Native, Firebase",       progreso: 90, resIdx: 1 },
  { id: "PROY-3", titulo: "Portal de Comunicación Interna",       desc: "Intranet corporativa con chat y gestión de documentos.",        estado: "propuesto",   prioridad: "Baja",  tech: "Vue.js, Express, PostgreSQL",  progreso: 15, resIdx: 2 },
  { id: "PROY-4", titulo: "Módulo de Analytics en Tiempo Real",   desc: "Dashboard de métricas industriales conectado a sensores IoT.",  estado: "desarrollo",  prioridad: "Alta",  tech: "Python, MQTT, Grafana",        progreso: 55, resIdx: 3 },
  // Laura's group
  { id: "PROY-5", titulo: "Dashboard de Analítica Industrial",    desc: "Panel de KPIs para planta manufacturera.",                      estado: "concluido",   prioridad: "Media", tech: "Power BI, Python, SQL",        progreso: 100,resIdx: 4 },
  { id: "PROY-6", titulo: "App de Rastreo Logístico",             desc: "Seguimiento de rutas de distribución con geolocalización.",     estado: "desarrollo",  prioridad: "Alta",  tech: "React Native, Google Maps API",progreso: 60, resIdx: 5 },
  { id: "PROY-7", titulo: "Sistema de Gestión Agrícola",          desc: "Control de cultivos y maquinaria para campo.",                  estado: "propuesto",   prioridad: "Baja",  tech: "Laravel, MySQL, Arduino",      progreso: 10, resIdx: 6 },
  { id: "PROY-8", titulo: "Automatización de Reportes Energía",   desc: "Generación automática de informes de consumo eléctrico.",       estado: "revision",    prioridad: "Media", tech: "Python, pandas, Excel",        progreso: 85, resIdx: 7 },
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  const conn = await getConnection();
  console.log("✅  Conectado a MySQL.");

  try {
    await conn.execute("SET FOREIGN_KEY_CHECKS = 0");
    for (const t of [
      "fuentes_informacion","notificaciones","citas","reportes",
      "proyectos","residentes","asesores","jefes_vinculacion","empresas","usuarios",
    ]) {
      await conn.execute(`TRUNCATE TABLE ${t}`);
    }
    await conn.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log("🗑️   Tablas limpiadas.");

    const hash = await bcrypt.hash(PASSWORD_PLAIN, 10);

    // ── Usuarios ──────────────────────────────────────────────────────────────
    const usuarioIds = {};
    for (const u of USUARIOS) {
      await conn.execute(
        "INSERT INTO usuarios (id, nombre, apellidos, correo, password_hash, rol) VALUES (?,?,?,?,?,?)",
        [u.id, u.nombre, u.apellidos, u.correo, hash, u.rol],
      );
      usuarioIds[u.correo] = u.id;
    }
    console.log(`👤  ${USUARIOS.length} usuarios insertados.`);

    // ── Empresas ──────────────────────────────────────────────────────────────
    for (const e of EMPRESAS) {
      await conn.execute(
        "INSERT INTO empresas (id, nombre, sector, ciudad, estado, convenio_vencimiento, contacto_nombre, contacto_email, contacto_telefono) VALUES (?,?,?,?,?,?,?,?,?)",
        [e.id, e.nombre, e.sector, e.ciudad, e.estado, e.convenio_vencimiento, e.contacto_nombre, e.contacto_email, e.contacto_telefono],
      );
    }
    console.log(`🏢  ${EMPRESAS.length} empresas insertadas.`);

    // ── Asesores ──────────────────────────────────────────────────────────────
    const asesorUsers = USUARIOS.filter((u) => u.rol === "asesor");
    const deptos = ["Ing. en Sistemas", "Ing. Industrial"];
    for (let i = 0; i < asesorUsers.length; i++) {
      const uid     = asesorUsers[i].id;
      const asesorId = `ASE-${uid}`;
      await conn.execute(
        "INSERT INTO asesores (id, usuario_id, departamento, num_empleado, max_residentes) VALUES (?,?,?,?,?)",
        [asesorId, uid, deptos[i] || "Ciencias Básicas", `EMP-${String(uid).padStart(4,"0")}`, 12],
      );
    }
    console.log(`👨‍🏫  ${asesorUsers.length} asesores insertados.`);

    // ── Jefe de Vinculación ───────────────────────────────────────────────────
    const jefeUser = USUARIOS.find((u) => u.rol === "jefe");
    const jefeUid  = jefeUser.id;
    await conn.execute(
      "INSERT INTO jefes_vinculacion (id, usuario_id, departamento) VALUES (?,?,?)",
      ["JEF-1", jefeUid, "Vinculación y Residencia Profesional"],
    );
    console.log("🎓  Jefe de vinculación insertado.");

    // ── Residentes ────────────────────────────────────────────────────────────
    const carreras = [
      "Ing. en Sistemas de Información",
      "Ing. Industrial",
      "Ing. en Sistemas de Información",
      "Ing. Electrónica",
      "Ing. en Sistemas de Información",
      "Ing. Industrial",
      "Ing. en Gestión Empresarial",
      "Ing. Electrónica",
    ];
    const residenteIds = [];
    for (let i = 0; i < RESIDENTES_CONFIG.length; i++) {
      const [uid, asesorId, empresaId, carrera, horas] = RESIDENTES_CONFIG[i];
      const resid = `RES-${uid}`;
      await conn.execute(
        `INSERT INTO residentes
           (id, usuario_id, num_control, carrera, semestre, empresa_id, asesor_id,
            horas_completadas, horas_requeridas, fecha_inicio, fecha_fin, estado)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          resid, uid,
          `21${String(uid).padStart(6,"0")}`,
          carrera, 9,
          empresaId, asesorId,
          horas, 480,
          "2026-01-13", "2026-07-13", "activo",
        ],
      );
      residenteIds.push(resid);
    }
    console.log(`🎒  ${residenteIds.length} residentes insertados.`);

    // ── Proyectos ─────────────────────────────────────────────────────────────
    // Marco supervisa PROY-1..4, Laura supervisa PROY-5..8
    const asesorPorProyecto = {
      "PROY-1": "ASE-5", "PROY-2": "ASE-5", "PROY-3": "ASE-5", "PROY-4": "ASE-5",
      "PROY-5": "ASE-6", "PROY-6": "ASE-6", "PROY-7": "ASE-6", "PROY-8": "ASE-6",
    };
    for (const p of PROYECTOS) {
      const resid   = residenteIds[p.resIdx];
      const asesorId = asesorPorProyecto[p.id];
      // empresa del residente correspondiente
      const [, , empresaId] = RESIDENTES_CONFIG[p.resIdx];
      await conn.execute(
        `INSERT INTO proyectos (id, titulo, descripcion, empresa_id, residente_id, asesor_id, estado, prioridad, tecnologias, progreso)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [p.id, p.titulo, p.desc, empresaId, resid, asesorId, p.estado, p.prioridad, p.tech, p.progreso],
      );
    }
    console.log(`🗂️   ${PROYECTOS.length} proyectos insertados.`);

    // ── Reportes ──────────────────────────────────────────────────────────────
    const tiposReporte  = ["preliminar","parcial1","parcial2","parcial3","final"];
    const estadosBase   = ["Aprobado","En Revisión","Pendiente","Pendiente","Pendiente"];
    for (let ri = 0; ri < residenteIds.length; ri++) {
      const rid = residenteIds[ri];
      // Residentes más avanzadas (Ana, Laura) tienen más reportes aprobados
      const aprobados = ri === 0 ? 3 : ri === 4 ? 5 : ri < 2 ? 2 : 1;
      for (let t = 0; t < tiposReporte.length; t++) {
        const estado = t < aprobados ? "Aprobado" : t === aprobados ? "En Revisión" : "Pendiente";
        await conn.execute(
          `INSERT INTO reportes (id, residente_id, tipo, fecha_limite, fecha_entrega, estado)
           VALUES (?,?,?,?,?,?)`,
          [
            `REP-${rid}-${t+1}`, rid, tiposReporte[t],
            `2026-0${t+2}-15`,
            t < aprobados ? `2026-0${t+2}-14` : null,
            estado,
          ],
        );
      }
    }
    console.log("📄  Reportes insertados.");

    // ── Citas ─────────────────────────────────────────────────────────────────
    const citas = [
      { sol: "1", par: "5", tipo: "Asesoría",  motivo: "Revisión de avance del sistema de inventarios",  fecha: "2026-01-15 10:00:00", lugar: "Sala 204",    estado: "Confirmada" },
      { sol: "2", par: "6", tipo: "Revisión",  motivo: "Entrega Reporte Parcial 1",                       fecha: "2026-01-20 09:00:00", lugar: "Oficina A3",  estado: "Confirmada" },
      { sol: "3", par: "5", tipo: "Evaluación",motivo: "Evaluación intermedia de App CRM",                fecha: "2026-02-10 11:00:00", lugar: "Virtual",     estado: "Pendiente"  },
      { sol: "1", par: "7", tipo: "Asesoría",  motivo: "Validación de fuente de información",             fecha: "2026-02-03 14:00:00", lugar: "Rectoría",    estado: "Pendiente"  },
      { sol: "8", par: "5", tipo: "Asesoría",  motivo: "Kickoff — Portal de Comunicación Interna",        fecha: "2026-01-25 10:00:00", lugar: "Sala 102",    estado: "Confirmada" },
      { sol: "9", par: "6", tipo: "Revisión",  motivo: "Revisión de avance App Logística",                fecha: "2026-02-05 15:00:00", lugar: "Oficina B2",  estado: "Pendiente"  },
      { sol: "4", par: "6", tipo: "Evaluación",motivo: "Presentación de propuesta de proyecto",           fecha: "2026-01-28 09:30:00", lugar: "Sala 301",    estado: "Confirmada" },
      { sol: "11",par: "6", tipo: "Asesoría",  motivo: "Revisión de avance reportes automáticos",         fecha: "2026-02-12 11:00:00", lugar: "Virtual",     estado: "Pendiente"  },
    ];
    for (let i = 0; i < citas.length; i++) {
      const c = citas[i];
      await conn.execute(
        "INSERT INTO citas (id, solicitante_id, participante_id, tipo, motivo, fecha_hora, lugar, estado) VALUES (?,?,?,?,?,?,?,?)",
        [`CITA-${i+1}`, c.sol, c.par, c.tipo, c.motivo, c.fecha, c.lugar, c.estado],
      );
    }
    console.log(`📅  ${citas.length} citas insertadas.`);

    // ── Notificaciones ────────────────────────────────────────────────────────
    const notifs = [
      { uid: "1",  tipo: "Cita",     titulo: "Cita confirmada con Asesor Marco",       cuerpo: "Tu cita del 15 de enero fue confirmada.",              icono: "calendar",       leida: false },
      { uid: "2",  tipo: "Reporte",  titulo: "Reporte Final Aprobado",                 cuerpo: "Tu reporte final fue aprobado con 9.5.",                icono: "file-text",      leida: true  },
      { uid: "5",  tipo: "Mensaje",  titulo: "Nueva solicitud de cita — Ana García",   cuerpo: "Ana solicitó asesoría para revisar avances.",           icono: "message-circle", leida: false },
      { uid: "7",  tipo: "Alerta",   titulo: "Convenio próximo a vencer",              cuerpo: "InnovaLogística vence el 20 de enero.",                 icono: "alert-triangle", leida: false },
      { uid: "3",  tipo: "Logro",    titulo: "¡240 horas completadas!",                cuerpo: "Alcanzaste el 50% de tus horas requeridas.",            icono: "award",          leida: false },
      { uid: "8",  tipo: "Cita",     titulo: "Kickoff confirmado con Asesor Marco",    cuerpo: "Cita para iniciar el Portal de Comunicación.",          icono: "calendar",       leida: false },
      { uid: "6",  tipo: "Mensaje",  titulo: "Nueva solicitud de cita — Pedro R.",     cuerpo: "Pedro solicita revisión de propuesta.",                 icono: "message-circle", leida: false },
      { uid: "9",  tipo: "Alerta",   titulo: "Fecha límite Reporte 2 próxima",         cuerpo: "Tienes 5 días para entregar el Reporte Parcial 2.",     icono: "clock",          leida: false },
      { uid: "4",  tipo: "Reporte",  titulo: "Reporte Preliminar En Revisión",         cuerpo: "Tu asesor está revisando tu reporte preliminar.",       icono: "file-text",      leida: true  },
      { uid: "7",  tipo: "Alerta",   titulo: "3 residentes sin asesor asignado",       cuerpo: "Revisa la pantalla de Asignación.",                     icono: "user-plus",      leida: false },
    ];
    for (let i = 0; i < notifs.length; i++) {
      const n = notifs[i];
      await conn.execute(
        "INSERT INTO notificaciones (id, usuario_id, tipo, titulo, cuerpo, icono, leida) VALUES (?,?,?,?,?,?,?)",
        [`NOT-${i+1}`, n.uid, n.tipo, n.titulo, n.cuerpo, n.icono, n.leida],
      );
    }
    console.log(`🔔  ${notifs.length} notificaciones insertadas.`);

    // ── Fuentes de información ─────────────────────────────────────────────────
    const fuentes = [
      { res: residenteIds[0], tipo: "propia",  desc: "Propuesta propia: sistema de control de inventarios",    estado: "Validada",  obs: "Bien fundamentada, aprobada sin cambios." },
      { res: residenteIds[1], tipo: "banco",   desc: "Proyecto del banco institucional: app CRM",              estado: "Validada",  obs: "Aprobada sin observaciones."              },
      { res: residenteIds[2], tipo: "empresa", desc: "Propuesta de la empresa: portal de comunicación",        estado: "Pendiente", obs: null                                       },
      { res: residenteIds[3], tipo: "propia",  desc: "Iniciativa propia: módulo de analytics con IoT",         estado: "Pendiente", obs: null                                       },
      { res: residenteIds[4], tipo: "banco",   desc: "Banco: dashboard de analítica industrial",               estado: "Validada",  obs: "Aprobada. Proyecto concluido."             },
      { res: residenteIds[5], tipo: "empresa", desc: "Empresa propone rastreo logístico en tiempo real",       estado: "Validada",  obs: "Validada con observaciones menores."       },
      { res: residenteIds[6], tipo: "propia",  desc: "Propuesta de sistema de gestión agrícola",               estado: "Pendiente", obs: null                                       },
      { res: residenteIds[7], tipo: "empresa", desc: "Empresa: automatización de reportes de consumo eléctrico",estado: "Pendiente",obs: null                                       },
    ];
    for (let i = 0; i < fuentes.length; i++) {
      const f = fuentes[i];
      await conn.execute(
        `INSERT INTO fuentes_informacion (id, residente_id, tipo, descripcion, estado, revisado_por, fecha_revision, observaciones)
         VALUES (?,?,?,?,?,?,?,?)`,
        [
          `FUENTE-${i+1}`, f.res, f.tipo, f.desc, f.estado,
          f.estado === "Validada" ? jefeUid : null,
          f.estado === "Validada" ? "2026-01-10"  : null,
          f.obs,
        ],
      );
    }
    console.log(`📚  ${fuentes.length} fuentes insertadas.`);

    console.log("\n🎉  Seed completado exitosamente.");
    console.log("🔑  Contraseña de todos los usuarios: vinculatec123");
    console.log("─────────────────────────────────────────────────────────────");
    console.log("  GRUPO MARCO REYES (asesor):");
    console.log("    ana.garcia | sofia.martinez | carmen.lopez | diana.flores");
    console.log("  GRUPO LAURA VEGA (asesor):");
    console.log("    luis.hernandez | pedro.ramirez | miguel.torres | roberto.sanchez");
    console.log("  JEFE:  director@itm.edu.mx");
    console.log("  Dominio: @itm.edu.mx");
  } catch (err) {
    console.error("❌  Error en seed:", err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

seed();
