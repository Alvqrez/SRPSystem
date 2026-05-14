import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, StatCard, Badge, ProgressBar } from "../components";
import { useProyectos } from "../context/ProyectosContext";
import { useReportes } from "../context/ReportesContext";
import { useNotificaciones } from "../context/NotificacionesContext";

// Mapeo fase → id en ReportesContext (para sincronizar feedback al Residente)
const FASE_TO_REPORTES_ID = {
  "Preliminar": "preliminar",
  "Parcial 1":  1,
  "Parcial 2":  2,
  "Parcial 3":  3,
  "Final":      "final",
};

export default function SeguimientoAsesor() {
  const { proyectos, updateReporte }  = useProyectos() || { proyectos: [] };
  const { reviewReport }              = useReportes()   || {};
  const { setNotifications }          = useNotificaciones() || {};

  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewingReport, setReviewingReport] = useState(null);
  const [feedback,        setFeedback]        = useState("");
  const [expandedReport,  setExpandedReport]  = useState(null);

  const activeProject = proyectos.find((p) => p.id === selectedProject) || proyectos[0];

  // ── Stats globales ────────────────────────────────────────────────────────
  const globalStats = useMemo(() => {
    let aceptados = 0, total = 0;
    proyectos.forEach((p) => {
      p.reportes.forEach((r) => {
        total++;
        if (r.status === "Aceptado") aceptados++;
      });
    });
    return { aceptados, total, nextDeadline: "15 May 2026" };
  }, [proyectos]);

  // ── Stats del proyecto activo ────────────────────────────────────────────
  const projectStats = useMemo(() => {
    if (!activeProject) return null;
    const reps = activeProject.reportes;
    const aceptados       = reps.filter((r) => r.status === "Aceptado").length;
    const totalReqReportes = 5; // preliminar + 3 parciales + final
    const avancePct       = Math.round((aceptados / totalReqReportes) * 100);
    return { aceptados, total: reps.length, avancePct, totalReqReportes };
  }, [activeProject]);

  // ── Guardar revisión ────────────────────────────────────────────────────
  const submitReview = (newStatus) => {
    if (!reviewingReport || !activeProject) return;
    if (!feedback.trim()) {
      Alert.alert("Retroalimentación requerida", "Escribe comentarios antes de guardar la revisión.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const statusFinal = newStatus === "Aceptado" ? "Aceptado" : "Por corregir";

    const historialEntry = { status: statusFinal, fecha: today, comentario: feedback.trim() };

    // 1. Actualizar ProyectosContext (vista del Asesor)
    updateReporte(activeProject.id, reviewingReport.id, {
      status:            statusFinal,
      feedback:          feedback.trim(),
      fechaRevision:     today,
      historial:         [...(reviewingReport.historial || []), historialEntry],
      cumpleObjetivos:   statusFinal === "Aceptado" ? true : reviewingReport.cumpleObjetivos,
      cumpleDiagnostico: statusFinal === "Aceptado" ? true : reviewingReport.cumpleDiagnostico,
      cumplePlanTrabajo: statusFinal === "Aceptado" ? true : reviewingReport.cumplePlanTrabajo,
    });

    // 2. Sincronizar a ReportesContext para que el RESIDENTE vea el feedback
    const reportesId = FASE_TO_REPORTES_ID[reviewingReport.fase];
    if (reportesId !== undefined && reviewReport) {
      reviewReport(reportesId, { status: statusFinal, feedback: feedback.trim() });
    }

    // 3. Notificación
    if (setNotifications) {
      setNotifications((prev) => [
        {
          id: Date.now(),
          icon:      statusFinal === "Aceptado" ? "check-circle" : "x-circle",
          iconBg:    statusFinal === "Aceptado" ? C.greenLight   : C.redLight,
          iconColor: statusFinal === "Aceptado" ? C.green        : C.red,
          title:     `${reviewingReport.titulo} — ${statusFinal === "Aceptado" ? "Aceptado" : "Requiere correcciones"}`,
          body:      feedback.trim(),
          time:      "Ahora",
          unread:    true,
          type:      statusFinal === "Aceptado" ? "Aceptación" : "Reporte",
          typeBg:    statusFinal === "Aceptado" ? C.greenLight   : C.redLight,
          typeColor: statusFinal === "Aceptado" ? C.green        : C.red,
          proyecto:  activeProject.title,
          fase:      activeProject.phase,
          actionScreen: "seguimiento",
          actionLabel:  "Ver reporte",
        },
        ...(prev || []),
      ]);
    }

    setReviewingReport(null);
    setFeedback("");
    Alert.alert(
      "Revisión guardada",
      `Reporte marcado como ${statusFinal === "Aceptado" ? "Aceptado ✓" : "Por Corregir — el residente será notificado"}.`
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      {/* ── Header ── */}
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Seguimiento de Reportes</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Revisión de reportes por proyecto</Text>
        </View>
      </Row>

      {/* ── Stats globales ── */}
      <Row style={{ gap: 12, marginBottom: 22 }}>
        <StatCard label="Aceptados / Total" value={`${globalStats.aceptados}/${globalStats.total}`} icon="check-circle" iconBg={C.greenLight} iconColor={C.green} />
        <StatCard label="Próx. Vencimiento" value={globalStats.nextDeadline} icon="clock" iconBg={C.redLight} iconColor={C.red} />
      </Row>

      {/* ── Selector de proyecto ── */}
      <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
        Seleccionar Proyecto
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <Row style={{ gap: 8 }}>
          {proyectos.map((p) => {
            const pendientes = p.reportes.filter((r) => r.status === "Pendiente").length;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setSelectedProject(p.id)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10,
                  backgroundColor: activeProject?.id === p.id ? C.teal : C.card,
                  borderWidth: 1, borderColor: activeProject?.id === p.id ? C.teal : C.border,
                }}
              >
                <Row style={{ alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: activeProject?.id === p.id ? "white" : C.textMuted }}>
                    {p.title}
                  </Text>
                  {pendientes > 0 && (
                    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.amber, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 9, fontWeight: "800", color: "white" }}>{pendientes}</Text>
                    </View>
                  )}
                </Row>
                <Text style={{ fontSize: 10, color: activeProject?.id === p.id ? "rgba(255,255,255,0.7)" : C.textLight, marginTop: 1 }}>
                  {p.company}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Row>
      </ScrollView>

      {activeProject && projectStats && (
        <>
          {/* ── Stats del proyecto ── */}
          <Card style={{ marginBottom: 20 }}>
            <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: C.text }}>{activeProject.title}</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>{activeProject.company}</Text>
              </View>
            </Row>
            <Row style={{ gap: 14 }}>
              <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 10, padding: 12, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: C.green }}>{projectStats.aceptados}/{projectStats.total}</Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>Aceptados / Recibidos</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 10, padding: 12, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: C.teal }}>{projectStats.avancePct}%</Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>Avance reportes</Text>
              </View>
            </Row>
            <View style={{ marginTop: 12 }}>
              <Row style={{ justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 11, color: C.textMuted }}>Progreso de reportes requeridos</Text>
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.teal }}>{projectStats.aceptados}/{projectStats.totalReqReportes}</Text>
              </Row>
              <ProgressBar pct={projectStats.avancePct} color={C.teal} />
            </View>
          </Card>

          {/* ── Historial de Reportes ── */}
          <Text style={{ fontSize: 13, fontWeight: "800", color: C.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Historial de Reportes — {activeProject.title}
          </Text>

          <View style={{ gap: 12 }}>
            {activeProject.reportes.map((report) => {
              const statusMap = {
                "Aceptado":     { color: C.green, bg: C.greenLight, icon: "check"        },
                "Pendiente":    { color: C.amber, bg: C.amberLight, icon: "clock"        },
                "Por corregir": { color: C.red,   bg: C.redLight,   icon: "alert-circle" },
              };
              const st         = statusMap[report.status] || { color: C.textMuted, bg: C.bg, icon: "minus" };
              const isExpanded = expandedReport === report.id;
              // FIXED: el botón "Revisar" ahora aparece correctamente para "Pendiente" y "Por corregir"
              const canReview  = (report.status === "Pendiente" || report.status === "Por corregir") && report.fecha;

              return (
                <Card key={report.id} style={{ padding: 0, overflow: "hidden", borderLeftWidth: report.status === "Pendiente" ? 3 : 0, borderLeftColor: C.amber }}>
                  <TouchableOpacity onPress={() => setExpandedReport(isExpanded ? null : report.id)} activeOpacity={0.9} style={{ padding: 16 }}>
                    <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Row style={{ flex: 1, gap: 12, alignItems: "flex-start" }}>
                        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: st.bg, alignItems: "center", justifyContent: "center" }}>
                          <Feather name={st.icon} size={16} color={st.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{report.titulo}</Text>
                          <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                            {report.residente} · Fase: {report.fase}
                          </Text>
                          {report.fecha
                            ? <Text style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>Enviado: {report.fecha}</Text>
                            : <Text style={{ fontSize: 11, color: C.textLight, marginTop: 2, fontStyle: "italic" }}>Sin entregar</Text>
                          }
                        </View>
                      </Row>
                      <Row style={{ alignItems: "center", gap: 8 }}>
                        <Badge text={report.status} color={st.color} bg={st.bg} />
                        <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color={C.textMuted} />
                      </Row>
                    </Row>
                  </TouchableOpacity>

                  {/* ── Expandido ── */}
                  {isExpanded && (
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 }}>
                      {/* Requerimientos */}
                      <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, marginBottom: 8, textTransform: "uppercase" }}>
                        Cumplimiento de Requerimientos
                      </Text>
                      <View style={{ gap: 6, marginBottom: 14 }}>
                        {[
                          { label: "Cumple con objetivos del proyecto",    value: report.cumpleObjetivos   },
                          { label: "Aprobación del diagnóstico empresarial", value: report.cumpleDiagnostico },
                          { label: "Cumple con el plan de trabajo",         value: report.cumplePlanTrabajo },
                        ].map((req, ri) => (
                          <Row key={ri} style={{ alignItems: "center", gap: 8 }}>
                            <Feather
                              name={req.value === true ? "check-circle" : req.value === false ? "x-circle" : "minus-circle"}
                              size={14}
                              color={req.value === true ? C.green : req.value === false ? C.red : C.textLight}
                            />
                            <Text style={{ fontSize: 12, color: C.textSub }}>{req.label}</Text>
                          </Row>
                        ))}
                      </View>

                      {/* Retroalimentación existente */}
                      {report.feedback && (
                        <View style={{ backgroundColor: C.tealLighter, borderRadius: 8, padding: 10, marginBottom: 14, borderLeftWidth: 2, borderLeftColor: C.teal }}>
                          <Text style={{ fontSize: 11, fontWeight: "700", color: C.teal, marginBottom: 3 }}>Retroalimentación</Text>
                          <Text style={{ fontSize: 12, color: C.textSub, lineHeight: 17 }}>{report.feedback}</Text>
                          {report.fechaRevision && (
                            <Text style={{ fontSize: 10, color: C.textLight, marginTop: 4 }}>Revisado: {report.fechaRevision}</Text>
                          )}
                        </View>
                      )}

                      {/* Historial de cambios */}
                      {report.historial && report.historial.length > 0 && (
                        <View style={{ marginBottom: 14 }}>
                          <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, marginBottom: 6, textTransform: "uppercase" }}>
                            Historial de Revisiones
                          </Text>
                          {report.historial.map((h, hi) => (
                            <Row key={hi} style={{ alignItems: "center", gap: 8, paddingVertical: 4 }}>
                              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: h.status === "Aceptado" ? C.green : C.red }} />
                              <Text style={{ fontSize: 11, color: C.textMuted }}>
                                {h.fecha} — <Text style={{ fontWeight: "700" }}>{h.status}</Text>: {h.comentario}
                              </Text>
                            </Row>
                          ))}
                        </View>
                      )}

                      {/* Acciones */}
                      <Row style={{ gap: 10, flexWrap: "wrap" }}>
                        {/* Descargar documento del reporte */}
                        {report.archivo && (
                          <TouchableOpacity
                            onPress={() => Alert.alert(
                              "Documento del reporte",
                              `Archivo: ${report.archivo}\n\nEn producción, aquí se descargaría el documento enviado por ${report.residente}.`
                            )}
                            style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: C.border }}
                          >
                            <Feather name="file-text" size={12} color={C.blue} />
                            <Text style={{ fontSize: 11, color: C.blue, fontWeight: "600" }}>Ver documento</Text>
                          </TouchableOpacity>
                        )}
                        {/* Botón "Revisar" — solo si el reporte está en estado revisable */}
                        {canReview && (
                          <TouchableOpacity
                            onPress={() => { setReviewingReport(report); setFeedback(""); }}
                            style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.teal, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
                          >
                            <Feather name="edit-2" size={12} color="white" />
                            <Text style={{ fontSize: 11, color: "white", fontWeight: "700" }}>
                              {report.status === "Por corregir" ? "Re-revisar" : "Revisar"}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </Row>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        </>
      )}

      {/* ── Modal de Revisión ── */}
      <Modal visible={!!reviewingReport} transparent animationType="slide">
        <Pressable
          onPress={() => setReviewingReport(null)}
          style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "flex-end" }}
        >
          <Pressable onPress={() => {}} style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 28 }}>
            {reviewingReport && (
              <>
                <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>Revisar Reporte</Text>
                  <TouchableOpacity onPress={() => setReviewingReport(null)}>
                    <Feather name="x" size={20} color={C.textMuted} />
                  </TouchableOpacity>
                </Row>
                <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
                  {reviewingReport.titulo} · {reviewingReport.residente}
                </Text>

                {/* Archivo adjunto */}
                {reviewingReport.archivo && (
                  <TouchableOpacity
                    onPress={() => Alert.alert("Documento", `Archivo: ${reviewingReport.archivo}`)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.tealLighter, borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: C.tealLight }}
                  >
                    <Feather name="file-text" size={16} color={C.teal} />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: C.teal, flex: 1 }}>
                      {reviewingReport.archivo}
                    </Text>
                    <Text style={{ fontSize: 11, color: C.teal }}>Ver</Text>
                  </TouchableOpacity>
                )}

                {/* Requerimientos */}
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
                  Verificar Requerimientos
                </Text>
                <View style={{ gap: 6, marginBottom: 16, backgroundColor: C.bg, borderRadius: 10, padding: 12 }}>
                  {["Cumple objetivos del proyecto", "Aprobación diagnóstico empresarial", "Cumple plan de trabajo"].map((req, i) => (
                    <Row key={i} style={{ alignItems: "center", gap: 8 }}>
                      <Feather name="check-square" size={14} color={C.teal} />
                      <Text style={{ fontSize: 12, color: C.textSub }}>{req}</Text>
                    </Row>
                  ))}
                </View>

                {/* Retroalimentación */}
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>
                  Retroalimentación / Comentarios *
                </Text>
                <TextInput
                  value={feedback}
                  onChangeText={setFeedback}
                  placeholder="Escribe tus comentarios detallados para el residente..."
                  placeholderTextColor={C.textLight}
                  multiline
                  style={{
                    padding: 12, borderRadius: 10, borderWidth: 1.5,
                    borderColor: feedback.trim() ? C.teal : C.border,
                    fontSize: 13, color: C.text, backgroundColor: "#FAFAFA",
                    minHeight: 100, textAlignVertical: "top", marginBottom: 18,
                  }}
                />

                <Row style={{ gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => submitReview("Por corregir")}
                    style={{ flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1.5, borderColor: C.red, alignItems: "center" }}
                  >
                    <Row style={{ alignItems: "center", gap: 6 }}>
                      <Feather name="x-circle" size={14} color={C.red} />
                      <Text style={{ fontSize: 13, fontWeight: "700", color: C.red }}>Por Corregir</Text>
                    </Row>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => submitReview("Aceptado")}
                    style={{ flex: 2, paddingVertical: 13, borderRadius: 10, backgroundColor: C.teal, alignItems: "center" }}
                  >
                    <Row style={{ alignItems: "center", gap: 6 }}>
                      <Feather name="check-circle" size={14} color="white" />
                      <Text style={{ fontSize: 13, fontWeight: "700", color: "white" }}>Aceptar Reporte</Text>
                    </Row>
                  </TouchableOpacity>
                </Row>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
