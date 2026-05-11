import { createContext, useContext, useState } from "react";

const ProyectosCtx = createContext(null);

const INITIAL_PROJECTS = [
  {
    id: "p1",
    title: "App de Logística Interna",
    company: "AutoParts Globales",
    phase: "desarrollo",
    priority: "Alta",
    residentes: [
      { nombre: "Carlos Ramírez", iniciales: "CR", rol: "Desarrollador Frontend", asignado: true },
      { nombre: "Ana García", iniciales: "AG", rol: "Desarrollador Backend", asignado: true },
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
      { id: "r1", titulo: "Reporte Preliminar", residente: "Carlos Ramírez", fase: "Preliminar", status: "Aprobado", score: 92, fecha: "2025-09-01", feedback: "Excelente planteamiento inicial.", fechaRevision: "2025-09-03", historial: [{ status: "Aprobado", fecha: "2025-09-03", comentario: "Aprobado sin cambios" }], cumpleObjetivos: true, cumpleDiagnostico: true, cumplePlanTrabajo: true, archivo: "reporte_preliminar_CR.pdf" },
      { id: "r2", titulo: "Reporte Parcial 1", residente: "Carlos Ramírez", fase: "Parcial 1", status: "Aprobado", score: 88, fecha: "2025-10-15", feedback: "Buen avance, mejorar documentación técnica.", fechaRevision: "2025-10-18", historial: [{ status: "Rechazado", fecha: "2025-10-16", comentario: "Falta documentación técnica" }, { status: "Aprobado", fecha: "2025-10-18", comentario: "Correcciones aplicadas correctamente" }], cumpleObjetivos: true, cumpleDiagnostico: true, cumplePlanTrabajo: false, archivo: "reporte_parcial1_CR.pdf" },
      { id: "r3", titulo: "Reporte Parcial 2", residente: "Carlos Ramírez", fase: "Parcial 2", status: "En Revisión", score: null, fecha: "2025-11-20", feedback: null, fechaRevision: null, historial: [], cumpleObjetivos: null, cumpleDiagnostico: null, cumplePlanTrabajo: null, archivo: "reporte_parcial2_CR.pdf" },
      { id: "r4", titulo: "Reporte Preliminar", residente: "Ana García", fase: "Preliminar", status: "Aprobado", score: 95, fecha: "2025-09-02", feedback: "Muy completo.", fechaRevision: "2025-09-04", historial: [{ status: "Aprobado", fecha: "2025-09-04", comentario: "Aprobado" }], cumpleObjetivos: true, cumpleDiagnostico: true, cumplePlanTrabajo: true, archivo: "reporte_preliminar_AG.pdf" },
      { id: "r5", titulo: "Reporte Parcial 1", residente: "Ana García", fase: "Parcial 1", status: "Pendiente Corrección", score: null, fecha: "2025-10-14", feedback: "Revisar sección de pruebas.", fechaRevision: "2025-10-16", historial: [{ status: "Rechazado", fecha: "2025-10-16", comentario: "Sección de pruebas incompleta" }], cumpleObjetivos: true, cumpleDiagnostico: false, cumplePlanTrabajo: true, archivo: "reporte_parcial1_AG.pdf" },
    ],
    reuniones: [
      { id: "m1", titulo: "Revisión de avances Sprint 3", fecha: "2026-05-13", hora: "10:00", tipo: "Revisión", modalidad: "Virtual", participantes: ["Carlos Ramírez", "Ana García"] },
      { id: "m2", titulo: "Reunión con empresa", fecha: "2026-05-15", hora: "14:00", tipo: "Empresa", modalidad: "Presencial", participantes: ["Representante AutoParts"] },
    ],
  },
  {
    id: "p2",
    title: "Dashboard BI Financiero",
    company: "SoftSolutions SA",
    phase: "revision",
    priority: "Media",
    residentes: [
      { nombre: "Luis Hernández", iniciales: "LH", rol: "Analista de Datos", asignado: true },
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
      { id: "r6", titulo: "Reporte Preliminar", residente: "Luis Hernández", fase: "Preliminar", status: "Aprobado", score: 90, fecha: "2025-07-20", feedback: "Bien estructurado.", fechaRevision: "2025-07-22", historial: [{ status: "Aprobado", fecha: "2025-07-22", comentario: "OK" }], cumpleObjetivos: true, cumpleDiagnostico: true, cumplePlanTrabajo: true, archivo: "reporte_prel_LH.pdf" },
      { id: "r7", titulo: "Reporte Parcial 1", residente: "Luis Hernández", fase: "Parcial 1", status: "Aprobado", score: 85, fecha: "2025-09-10", feedback: "Necesita más detalle en métricas.", fechaRevision: "2025-09-14", historial: [{ status: "Rechazado", fecha: "2025-09-12", comentario: "Métricas insuficientes" }, { status: "Aprobado", fecha: "2025-09-14", comentario: "Métricas corregidas" }], cumpleObjetivos: true, cumpleDiagnostico: true, cumplePlanTrabajo: true, archivo: "reporte_p1_LH.pdf" },
      { id: "r8", titulo: "Reporte Parcial 2", residente: "Luis Hernández", fase: "Parcial 2", status: "Aprobado", score: 91, fecha: "2025-11-05", feedback: "Excelente avance.", fechaRevision: "2025-11-07", historial: [{ status: "Aprobado", fecha: "2025-11-07", comentario: "Aprobado" }], cumpleObjetivos: true, cumpleDiagnostico: true, cumplePlanTrabajo: true, archivo: "reporte_p2_LH.pdf" },
      { id: "r9", titulo: "Reporte Parcial 3", residente: "Luis Hernández", fase: "Parcial 3", status: "En Revisión", score: null, fecha: "2026-05-08", feedback: null, fechaRevision: null, historial: [], cumpleObjetivos: null, cumpleDiagnostico: null, cumplePlanTrabajo: null, archivo: "reporte_p3_LH.pdf" },
    ],
    reuniones: [
      { id: "m3", titulo: "Presentación de resultados", fecha: "2026-05-14", hora: "11:00", tipo: "Revisión", modalidad: "Presencial", participantes: ["Luis Hernández"] },
    ],
  },
  {
    id: "p3",
    title: "Portal de Clientes Web",
    company: "Tecnológica del Norte",
    phase: "desarrollo",
    priority: "Alta",
    residentes: [
      { nombre: "Sofía Martínez", iniciales: "SM", rol: "Full Stack", asignado: true },
      { nombre: "Pedro Juárez", iniciales: "PJ", rol: "UX/UI Designer", asignado: true },
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
      { id: "r10", titulo: "Reporte Preliminar", residente: "Sofía Martínez", fase: "Preliminar", status: "Aprobado", score: 94, fecha: "2025-09-20", feedback: "Propuesta sólida.", fechaRevision: "2025-09-22", historial: [{ status: "Aprobado", fecha: "2025-09-22", comentario: "OK" }], cumpleObjetivos: true, cumpleDiagnostico: true, cumplePlanTrabajo: true, archivo: "rep_prel_SM.pdf" },
      { id: "r11", titulo: "Reporte Parcial 1", residente: "Sofía Martínez", fase: "Parcial 1", status: "En Revisión", score: null, fecha: "2026-05-06", feedback: null, fechaRevision: null, historial: [], cumpleObjetivos: null, cumpleDiagnostico: null, cumplePlanTrabajo: null, archivo: "rep_p1_SM.pdf" },
    ],
    reuniones: [
      { id: "m4", titulo: "Reunión con jefe de vinculación", fecha: "2026-05-16", hora: "09:00", tipo: "Vinculación", modalidad: "Presencial", participantes: ["Jefe de Vinculación"] },
    ],
  },
];

// Proyectos propuestos por asesores (pendientes de aprobación del jefe)
const INITIAL_PROPOSED = [
  {
    id: "prop1",
    title: "Sistema de Control de Inventarios",
    company: "Distribuidora Nacional",
    priority: "Alta",
    residentesRequeridos: 2,
    residentesAsignados: [{ nombre: "María Torres", iniciales: "MT", rol: "Backend Developer" }],
    residentesFaltantes: 1,
    habilidadesRequeridas: ["Java", "Spring Boot", "MySQL"],
    rolRequerido: "Frontend Developer con experiencia en React",
    descripcionAvance: "Se tiene el diseño de la base de datos y los wireframes del sistema.",
    asesor: "Dr. Martínez",
    asesorId: "asesor1",
    fechaPropuesta: "2026-05-10",
    status: "Pendiente", // Pendiente, Aprobado, Rechazado
  },
];

export function ProyectosProvider({ children }) {
  const [proyectos, setProyectos] = useState(INITIAL_PROJECTS);
  const [propuestas, setPropuestas] = useState(INITIAL_PROPOSED);

  const updateProyecto = (id, changes) =>
    setProyectos((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));

  const addReporte = (proyectoId, reporte) =>
    setProyectos((prev) =>
      prev.map((p) =>
        p.id === proyectoId ? { ...p, reportes: [...p.reportes, reporte] } : p
      )
    );

  const updateReporte = (proyectoId, reporteId, changes) =>
    setProyectos((prev) =>
      prev.map((p) =>
        p.id === proyectoId
          ? { ...p, reportes: p.reportes.map((r) => (r.id === reporteId ? { ...r, ...changes } : r)) }
          : p
      )
    );

  const addPropuesta = (propuesta) =>
    setPropuestas((prev) => [...prev, { ...propuesta, id: `prop${Date.now()}`, status: "Pendiente" }]);

  const updatePropuesta = (id, changes) =>
    setPropuestas((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));

  const aprobarPropuesta = (id) => {
    const prop = propuestas.find((p) => p.id === id);
    if (!prop) return;
    updatePropuesta(id, { status: "Aprobado" });
    // Crear proyecto real a partir de la propuesta
    const nuevoProyecto = {
      id: `p${Date.now()}`,
      title: prop.title,
      company: prop.company,
      phase: "propuesto",
      priority: prop.priority,
      residentes: prop.residentesAsignados.map((r) => ({ ...r, asignado: true })),
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

  // Solicitar avance de fase al jefe
  const solicitarAvanceFase = (proyectoId) =>
    updateProyecto(proyectoId, { solicitudAvance: true });

  const aprobarAvanceFase = (proyectoId) => {
    const phases = ["propuesto", "desarrollo", "revision", "concluido"];
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (!proyecto) return;
    const currentIdx = phases.indexOf(proyecto.phase);
    if (currentIdx < phases.length - 1) {
      updateProyecto(proyectoId, { phase: phases[currentIdx + 1], solicitudAvance: false });
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
