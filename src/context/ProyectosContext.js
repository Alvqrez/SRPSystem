import { createContext, useContext, useState } from "react";

const ProyectosCtx = createContext(null);

// ── STATUSES NORMALIZADOS ────────────────────────────────────────────────────
// "Aceptado"    — revisado y aprobado por el asesor
// "Pendiente"   — enviado por el residente, esperando revisión
// "Por corregir"— rechazado, requiere reenvío con correcciones
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_PROJECTS = [
  {
    id: "p1",
    title: "App de Logística Interna",
    company: "AutoParts Globales",
    phase: "desarrollo",
    priority: "Alta",
    residentes: [
      {
        nombre: "Carlos Ramírez",
        iniciales: "CR",
        rol: "Desarrollador Frontend",
        asignado: true,
        usuarioId: "u1",
        correo: "carlos.ramirez@itm.edu.mx",
        telefono: "812-345-6789",
        carrera: "Ing. en Sistemas de Información",
        numControl: "21000001",
      },
      {
        nombre: "Ana García",
        iniciales: "AG",
        rol: "Desarrollador Backend",
        asignado: true,
        usuarioId: "u2",
        correo: "ana.garcia@itm.edu.mx",
        telefono: "812-987-6543",
        carrera: "Ing. en Sistemas de Información",
        numControl: "21000002",
      },
    ],
    residentesRequeridos: 3,
    habilidades: ["React Native", "Node.js", "MongoDB"],
    asesor: "Dr. Martínez",
    asesorId: "asesor1",
    horasDocumentadas: 320,
    horasTotales: 480,
    fechaInicio: "2025-08-15",
    fechaFin: "2026-02-15",
    reportes: [
      {
        id: "r1",
        titulo: "Reporte Preliminar",
        residente: "Carlos Ramírez",
        fase: "Preliminar",
        status: "Aceptado",
        score: 92,
        fecha: "2025-09-01",
        feedback: "Excelente planteamiento inicial.",
        fechaRevision: "2025-09-03",
        historial: [
          {
            status: "Aceptado",
            fecha: "2025-09-03",
            comentario: "Aprobado sin cambios",
          },
        ],
        cumpleObjetivos: true,
        cumpleDiagnostico: true,
        cumplePlanTrabajo: true,
        archivo: "reporte_preliminar_CR.pdf",
      },
      {
        id: "r2",
        titulo: "Reporte Parcial 1",
        residente: "Carlos Ramírez",
        fase: "Parcial 1",
        status: "Aceptado",
        score: 88,
        fecha: "2025-10-15",
        feedback: "Buen avance, mejorar documentación técnica.",
        fechaRevision: "2025-10-18",
        historial: [
          {
            status: "Por corregir",
            fecha: "2025-10-16",
            comentario: "Falta documentación técnica",
          },
          {
            status: "Aceptado",
            fecha: "2025-10-18",
            comentario: "Correcciones aplicadas correctamente",
          },
        ],
        cumpleObjetivos: true,
        cumpleDiagnostico: true,
        cumplePlanTrabajo: false,
        archivo: "reporte_parcial1_CR.pdf",
      },
      {
        id: "r3",
        titulo: "Reporte Parcial 2",
        residente: "Carlos Ramírez",
        fase: "Parcial 2",
        status: "Pendiente",
        score: null,
        fecha: "2025-11-20",
        feedback: null,
        fechaRevision: null,
        historial: [],
        cumpleObjetivos: null,
        cumpleDiagnostico: null,
        cumplePlanTrabajo: null,
        archivo: "reporte_parcial2_CR.pdf",
      },
      {
        id: "r4",
        titulo: "Reporte Preliminar",
        residente: "Ana García",
        fase: "Preliminar",
        status: "Aceptado",
        score: 95,
        fecha: "2025-09-02",
        feedback: "Muy completo.",
        fechaRevision: "2025-09-04",
        historial: [
          { status: "Aceptado", fecha: "2025-09-04", comentario: "Aprobado" },
        ],
        cumpleObjetivos: true,
        cumpleDiagnostico: true,
        cumplePlanTrabajo: true,
        archivo: "reporte_preliminar_AG.pdf",
      },
      {
        id: "r5",
        titulo: "Reporte Parcial 1",
        residente: "Ana García",
        fase: "Parcial 1",
        status: "Por corregir",
        score: null,
        fecha: "2025-10-14",
        feedback: "Revisar sección de pruebas.",
        fechaRevision: "2025-10-16",
        historial: [
          {
            status: "Por corregir",
            fecha: "2025-10-16",
            comentario: "Sección de pruebas incompleta",
          },
        ],
        cumpleObjetivos: true,
        cumpleDiagnostico: false,
        cumplePlanTrabajo: true,
        archivo: "reporte_parcial1_AG.pdf",
      },
    ],
    reuniones: [
      {
        id: "m1",
        titulo: "Revisión de avances Sprint 3",
        fecha: "2026-05-13",
        hora: "10:00",
        tipo: "Revisión",
        modalidad: "Virtual",
        participantes: ["Carlos Ramírez", "Ana García"],
      },
      {
        id: "m2",
        titulo: "Reunión con empresa",
        fecha: "2026-05-15",
        hora: "14:00",
        tipo: "Empresa",
        modalidad: "Presencial",
        participantes: ["Representante AutoParts"],
      },
    ],
  },
  {
    id: "p2",
    title: "Dashboard BI Financiero",
    company: "SoftSolutions SA",
    phase: "revision",
    priority: "Media",
    residentes: [
      {
        nombre: "Luis Hernández",
        iniciales: "LH",
        rol: "Analista de Datos",
        asignado: true,
        usuarioId: "u3",
        correo: "luis.hernandez@itm.edu.mx",
        telefono: "818-123-4567",
        carrera: "Ing. Industrial",
        numControl: "21000003",
      },
    ],
    residentesRequeridos: 2,
    habilidades: ["Power BI", "SQL Server", "Python"],
    asesor: "Dr. Martínez",
    asesorId: "asesor1",
    horasDocumentadas: 400,
    horasTotales: 480,
    fechaInicio: "2025-07-01",
    fechaFin: "2026-01-15",
    reportes: [
      {
        id: "r6",
        titulo: "Reporte Preliminar",
        residente: "Luis Hernández",
        fase: "Preliminar",
        status: "Aceptado",
        score: 90,
        fecha: "2025-07-20",
        feedback: "Bien estructurado.",
        fechaRevision: "2025-07-22",
        historial: [
          { status: "Aceptado", fecha: "2025-07-22", comentario: "OK" },
        ],
        cumpleObjetivos: true,
        cumpleDiagnostico: true,
        cumplePlanTrabajo: true,
        archivo: "reporte_prel_LH.pdf",
      },
      {
        id: "r7",
        titulo: "Reporte Parcial 1",
        residente: "Luis Hernández",
        fase: "Parcial 1",
        status: "Aceptado",
        score: 85,
        fecha: "2025-09-10",
        feedback: "Necesita más detalle en métricas.",
        fechaRevision: "2025-09-14",
        historial: [
          {
            status: "Por corregir",
            fecha: "2025-09-12",
            comentario: "Métricas insuficientes",
          },
          {
            status: "Aceptado",
            fecha: "2025-09-14",
            comentario: "Métricas corregidas",
          },
        ],
        cumpleObjetivos: true,
        cumpleDiagnostico: true,
        cumplePlanTrabajo: true,
        archivo: "reporte_p1_LH.pdf",
      },
      {
        id: "r8",
        titulo: "Reporte Parcial 2",
        residente: "Luis Hernández",
        fase: "Parcial 2",
        status: "Aceptado",
        score: 91,
        fecha: "2025-11-05",
        feedback: "Excelente avance.",
        fechaRevision: "2025-11-07",
        historial: [
          { status: "Aceptado", fecha: "2025-11-07", comentario: "Aprobado" },
        ],
        cumpleObjetivos: true,
        cumpleDiagnostico: true,
        cumplePlanTrabajo: true,
        archivo: "reporte_p2_LH.pdf",
      },
      {
        id: "r9",
        titulo: "Reporte Parcial 3",
        residente: "Luis Hernández",
        fase: "Parcial 3",
        status: "Pendiente",
        score: null,
        fecha: "2026-05-08",
        feedback: null,
        fechaRevision: null,
        historial: [],
        cumpleObjetivos: null,
        cumpleDiagnostico: null,
        cumplePlanTrabajo: null,
        archivo: "reporte_p3_LH.pdf",
      },
    ],
    reuniones: [
      {
        id: "m3",
        titulo: "Presentación de resultados",
        fecha: "2026-05-14",
        hora: "11:00",
        tipo: "Revisión",
        modalidad: "Presencial",
        participantes: ["Luis Hernández"],
      },
    ],
  },
  {
    id: "p3",
    title: "Portal de Clientes Web",
    company: "Tecnológica del Norte",
    phase: "desarrollo",
    priority: "Alta",
    residentes: [
      {
        nombre: "Sofía Martínez",
        iniciales: "SM",
        rol: "Full Stack",
        asignado: true,
        usuarioId: "u4",
        correo: "sofia.martinez@itm.edu.mx",
        telefono: "833-456-7890",
        carrera: "Ing. en Sistemas de Información",
        numControl: "21000004",
      },
      {
        nombre: "Pedro Juárez",
        iniciales: "PJ",
        rol: "UX/UI Designer",
        asignado: true,
        usuarioId: "u5",
        correo: "pedro.juarez@itm.edu.mx",
        telefono: "833-654-3210",
        carrera: "Ing. en Gestión Empresarial",
        numControl: "21000005",
      },
    ],
    residentesRequeridos: 2,
    habilidades: ["React", "GraphQL", "Figma"],
    asesor: "Dr. Martínez",
    asesorId: "asesor1",
    horasDocumentadas: 250,
    horasTotales: 480,
    fechaInicio: "2025-09-01",
    fechaFin: "2026-03-01",
    reportes: [
      {
        id: "r10",
        titulo: "Reporte Preliminar",
        residente: "Sofía Martínez",
        fase: "Preliminar",
        status: "Aceptado",
        score: 94,
        fecha: "2025-09-20",
        feedback: "Propuesta sólida.",
        fechaRevision: "2025-09-22",
        historial: [
          { status: "Aceptado", fecha: "2025-09-22", comentario: "OK" },
        ],
        cumpleObjetivos: true,
        cumpleDiagnostico: true,
        cumplePlanTrabajo: true,
        archivo: "rep_prel_SM.pdf",
      },
      {
        id: "r11",
        titulo: "Reporte Parcial 1",
        residente: "Sofía Martínez",
        fase: "Parcial 1",
        status: "Pendiente",
        score: null,
        fecha: "2026-05-06",
        feedback: null,
        fechaRevision: null,
        historial: [],
        cumpleObjetivos: null,
        cumpleDiagnostico: null,
        cumplePlanTrabajo: null,
        archivo: "rep_p1_SM.pdf",
      },
    ],
    reuniones: [
      {
        id: "m4",
        titulo: "Reunión con jefe de vinculación",
        fecha: "2026-05-16",
        hora: "09:00",
        tipo: "Vinculación",
        modalidad: "Presencial",
        participantes: ["Jefe de Vinculación"],
      },
    ],
  },
];

const INITIAL_PROPOSED = [
  {
    id: "prop1",
    title: "Sistema de Control de Inventarios",
    company: "Distribuidora Nacional",
    priority: "Alta",
    residentesRequeridos: 2,
    residentesAsignados: [
      { nombre: "María Torres", iniciales: "MT", rol: "Backend Developer" },
    ],
    residentesFaltantes: 1,
    habilidadesRequeridas: ["Java", "Spring Boot", "MySQL"],
    rolRequerido: "Frontend Developer con experiencia en React",
    descripcionAvance:
      "Se tiene el diseño de la base de datos y los wireframes del sistema.",
    asesor: "Dr. Martínez",
    asesorId: "asesor1",
    fechaPropuesta: "2026-05-10",
    status: "Pendiente",
  },
];

export function ProyectosProvider({ children }) {
  const [proyectos, setProyectos] = useState(INITIAL_PROJECTS);
  const [propuestas, setPropuestas] = useState(INITIAL_PROPOSED);

  const updateProyecto = (id, changes) =>
    setProyectos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p)),
    );

  const addReporte = (proyectoId, reporte) =>
    setProyectos((prev) =>
      prev.map((p) =>
        p.id === proyectoId ? { ...p, reportes: [...p.reportes, reporte] } : p,
      ),
    );

  const updateReporte = (proyectoId, reporteId, changes) =>
    setProyectos((prev) =>
      prev.map((p) =>
        p.id === proyectoId
          ? {
              ...p,
              reportes: p.reportes.map((r) =>
                r.id === reporteId ? { ...r, ...changes } : r,
              ),
            }
          : p,
      ),
    );

  /**
   * Llamada cuando el Residente envía (o re-envía) un reporte.
   * Actualiza el status a "Pendiente" en ProyectosContext para que
   * el Asesor lo vea en SeguimientoAsesor.
   * proyectoId y residenteNombre tienen valores demo por defecto.
   */
  const submitReporteFromResidente = (
    fase,
    residenteNombre = "Carlos Ramírez",
    proyectoId = "p1",
  ) => {
    const today = new Date().toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    setProyectos((prev) =>
      prev.map((p) => {
        if (p.id !== proyectoId) return p;

        const existing = p.reportes.find(
          (r) => r.fase === fase && r.residente === residenteNombre,
        );

        if (existing) {
          // Re-envío: resetear a Pendiente
          return {
            ...p,
            reportes: p.reportes.map((r) =>
              r.fase === fase && r.residente === residenteNombre
                ? {
                    ...r,
                    status: "Pendiente",
                    fecha: today,
                    feedback: null,
                    fechaRevision: null,
                  }
                : r,
            ),
          };
        }

        // Primera entrega: agregar nuevo reporte
        return {
          ...p,
          reportes: [
            ...p.reportes,
            {
              id: `r_${Date.now()}`,
              titulo: `Reporte ${fase}`,
              residente: residenteNombre,
              fase,
              status: "Pendiente",
              score: null,
              fecha: today,
              feedback: null,
              fechaRevision: null,
              historial: [],
              cumpleObjetivos: null,
              cumpleDiagnostico: null,
              cumplePlanTrabajo: null,
              archivo: null,
            },
          ],
        };
      }),
    );
  };

  const addPropuesta = (propuesta) =>
    setPropuestas((prev) => [
      ...prev,
      { ...propuesta, id: `prop${Date.now()}`, status: "Pendiente" },
    ]);

  const updatePropuesta = (id, changes) =>
    setPropuestas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p)),
    );

  const aprobarPropuesta = (id) => {
    const prop = propuestas.find((p) => p.id === id);
    if (!prop) return;
    updatePropuesta(id, { status: "Aprobado" });
    const nuevoProyecto = {
      id: `p${Date.now()}`,
      title: prop.title,
      company: prop.company,
      phase: "propuesto",
      priority: prop.priority,
      residentes: prop.residentesAsignados.map((r) => ({
        ...r,
        asignado: true,
      })),
      residentesRequeridos: prop.residentesRequeridos,
      habilidades: prop.habilidadesRequeridas,
      asesor: prop.asesor,
      asesorId: prop.asesorId,
      horasDocumentadas: 0,
      horasTotales: 480,
      fechaInicio: new Date().toISOString().slice(0, 10),
      fechaFin: null,
      reportes: [],
      reuniones: [],
    };
    setProyectos((prev) => [...prev, nuevoProyecto]);
  };

  const rechazarPropuesta = (id, motivo) =>
    updatePropuesta(id, { status: "Rechazado", motivoRechazo: motivo });

  const solicitarAvanceFase = (proyectoId) =>
    updateProyecto(proyectoId, { solicitudAvance: true });

  const aprobarAvanceFase = (proyectoId) => {
    const phases = ["propuesto", "desarrollo", "revision", "concluido"];
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (!proyecto) return;
    const currentIdx = phases.indexOf(proyecto.phase);
    if (currentIdx < phases.length - 1) {
      updateProyecto(proyectoId, {
        phase: phases[currentIdx + 1],
        solicitudAvance: false,
      });
    }
  };

  return (
    <ProyectosCtx.Provider
      value={{
        proyectos,
        propuestas,
        setProyectos,
        updateProyecto,
        addReporte,
        updateReporte,
        submitReporteFromResidente,
        addPropuesta,
        updatePropuesta,
        aprobarPropuesta,
        rechazarPropuesta,
        solicitarAvanceFase,
        aprobarAvanceFase,
      }}
    >
      {children}
    </ProyectosCtx.Provider>
  );
}

export function useProyectos() {
  return useContext(ProyectosCtx);
}
