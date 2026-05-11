import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, StatCard, Badge, ProgressBar } from "../components";
import { useProyectos } from "../context/ProyectosContext";
import { useNotificaciones } from "../context/NotificacionesContext";

export default function SeguimientoAsesor() {
  const { proyectos, updateReporte } = useProyectos() || { proyectos: [] };
  const { setNotifications } = useNotificaciones() || {};
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewingReport, setReviewingReport] = useState(null);
  const [scoreInput, setScoreInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showNewReport, setShowNewReport] = useState(false);
  const [expandedReport, setExpandedReport] = useState(null);

  const activeProject = proyectos.find((p) => p.id === selectedProject) || proyectos[0];

  // Global stats
  const globalStats = useMemo(() => {
    let totalAprobados = 0, totalRecibidos = 0, totalScore = 0, scoreCount = 0, totalHoras = 0;
    let nextDeadline = null;

    proyectos.forEach((p) => {
      totalHoras += p.horasDocumentadas;
      p.reportes.forEach((r) => {
        totalRecibidos++;
        if (r.status === "Aprobado") {
          totalAprobados++;
          if (r.score) { totalScore += r.score; scoreCount++; }
        }
      });
    });

    return {
      aprobados: totalAprobados,
      totalRecibidos,
      promedioCalificacion: scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : "N/A",
      totalHoras,
      nextDeadline: "15 May 2026",
    };
  }, [proyectos]);

  // Project-level stats
  const projectStats = useMemo(() => {
    if (!activeProject) return null;
    const reps = activeProject.reportes;
    const aprobados = reps.filter((r) => r.status === "Aprobado").length;
    const totalReqReportes = 5; // preliminar + 3 parciales + final
    const avancePct = Math.round((aprobados / totalReqReportes) * 100);
    const scores = reps.filter((r) => r.score).map((r) => r.score);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "N/A";

    return { aprobados, total: reps.length, avancePct, avgScore, totalReqReportes };
  }, [activeProject]);

  const submitReview = (newStatus) => {
    if (!reviewingReport || !activeProject) return;
    const parsedScore = parseFloat(scoreInput);
    if (newStatus === "Aprobado" && (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100)) {
      Alert.alert("Error", "Ingresa una calificación válida (0-100).");
      return;
    }
    if (!feedback.trim()) {
      Alert.alert("Error", "Escribe retroalimentación.");
      return;
    }

    const historialEntry = {
      status: newStatus,
      fecha: new Date().toISOString().slice(0, 10),
      comentario: feedback.trim(),
    };

    updateReporte(activeProject.id, reviewingReport.id, {
      status: newStatus === "Aprobado" ? "Aprobado" : "Pendiente Corrección",
      score: newStatus === "Aprobado" ? parsedScore : null,
      feedback: feedback.trim(),
      fechaRevision: new Date().toISOString().slice(0, 10),
      historial: [...(reviewingReport.historial || []), historialEntry],
      cumpleObjetivos: newStatus === "Aprobado" ? true : reviewingReport.cumpleObjetivos,
      cumpleDiagnostico: newStatus === "Aprobado" ? true : reviewingReport.cumpleDiagnostico,
      cumplePlanTrabajo: newStatus === "Aprobado" ? true : reviewingReport.cumplePlanTrabajo,
    });

    // Notificación
    if (setNotifications) {
      setNotifications((prev) => [{
        id: Date.now(),
        icon: newStatus === "Aprobado" ? "check-circle" : "x-circle",
        iconBg: newStatus === "Aprobado" ? C.greenLight : C.redLight,
        iconColor: newStatus === "Aprobado" ? C.green : C.red,
        title: `${reviewingReport.titulo} — ${newStatus === "Aprobado" ? "Aprobado" : "Requiere correcciones"}`,
        body: feedback.trim(),
        time: "Ahora",
        unread: true,
        type: newStatus === "Aprobado" ? "Aprobación" : "Reporte",
        typeBg: newStatus === "Aprobado" ? C.greenLight : C.redLight,
        typeColor: newStatus === "Aprobado" ? C.green : C.red,
        proyecto: activeProject.title,
        fase: activeProject.phase,
        actionScreen: "seguimiento",
        actionLabel: "Ver reporte",
      }, ...(prev || [])]);
    }

    setReviewingReport(null);
    Alert.alert("Revisión guardada", `Reporte marcado como ${newStatus === "Aprobado" ? "Aprobado" : "Pendiente de Corrección"}.`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      {/* Header */}
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Seguimiento de Reportes</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Revisión y calificación por proyecto</Text>
        </View>
      </Row>

      {/* Global Stats */}
      <Row style={{ gap: 12, marginBottom: 22 }}>
        <StatCard label="Aprobados / Total" value={`${globalStats.aprobados}/${globalStats.totalRecibidos}`} icon="check-circle" iconBg={C.greenLight} iconColor={C.green} />
        <StatCard label="Calif. Promedio" value={String(globalStats.promedioCalificacion)} icon="star" iconBg={C.amberLight} iconColor={C.amber} />
        <StatCard label="Próx. Vencimiento" value={globalStats.nextDeadline} icon="clock" iconBg={C.redLight} iconColor={C.red} />
        <StatCard label="Horas Documentadas" value={String(globalStats.totalHoras)} icon="activity" iconBg={C.blueLight} iconColor={C.blue} />
      </Row>

      {/* Project Selector */}
      <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Seleccionar Proyecto</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <Row style={{ gap: 8 }}>
          {proyectos.map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => setSelectedProject(p.id)}
              style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: (activeProject?.id === p.id) ? C.teal : C.card, borderWidth: 1, borderColor: (activeProject?.id === p.id) ? C.teal : C.border }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: (activeProject?.id === p.id) ? "white" : C.textMuted }}>{p.title}</Text>
              <Text style={{ fontSize: 10, color: (activeProject?.id === p.id) ? "rgba(255,255,255,0.7)" : C.textLight, marginTop: 1 }}>{p.company}</Text>
            </TouchableOpacity>
          ))}
        </Row>
      </ScrollView>

      {activeProject && projectStats && (
        <>
          {/* Project Stats */}
          <Card style={{ marginBottom: 20 }}>
            <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: C.text }}>{activeProject.title}</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>{activeProject.company}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNewReport(true)}
                style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.teal, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
              >
                <Feather name="plus" size={12} color="white" />
                <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>Generar Reporte</Text>
              </TouchableOpacity>
            </Row>
            <Row style={{ gap: 14 }}>
              <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 10, padding: 12, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: C.green }}>{projectStats.aprobados}/{projectStats.total}</Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>Aprobados / Recibidos</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 10, padding: 12, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: C.amber }}>{projectStats.avgScore}</Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>Calif. Promedio</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 10, padding: 12, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: C.teal }}>{projectStats.avancePct}%</Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>Avance reportes</Text>
              </View>
            </Row>
            <View style={{ marginTop: 12 }}>
              <Row style={{ justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 11, color: C.textMuted }}>Progreso de reportes requeridos</Text>
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.teal }}>{projectStats.aprobados}/{projectStats.totalReqReportes}</Text>
              </Row>
              <ProgressBar pct={projectStats.avancePct} color={C.teal} />
            </View>
          </Card>

          {/* Historial de Reportes */}
          <Text style={{ fontSize: 13, fontWeight: "800", color: C.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Historial de Reportes — {activeProject.title}</Text>

          <View style={{ gap: 12 }}>
            {activeProject.reportes.map((report) => {
              const statusColors = {
                Aprobado: { color: C.green, bg: C.greenLight, icon: "check" },
                "En Revisión": { color: C.amber, bg: C.amberLight, icon: "clock" },
                "Pendiente Corrección": { color: C.red, bg: C.redLight, icon: "alert-circle" },
                Pendiente: { color: C.textMuted, bg: C.bg, icon: "minus" },
              };
              const st = statusColors[report.status] || statusColors.Pendiente;
              const isExpanded = expandedReport === report.id;

              return (
                <Card key={report.id} style={{ padding: 0, overflow: "hidden", borderLeftWidth: report.status === "En Revisión" ? 3 : 0, borderLeftColor: C.amber }}>
                  <TouchableOpacity onPress={() => setExpandedReport(isExpanded ? null : report.id)} activeOpacity={0.9} style={{ padding: 16 }}>
                    <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Row style={{ flex: 1, gap: 12, alignItems: "flex-start" }}>
                        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: st.bg, alignItems: "center", justifyContent: "center" }}>
                          <Feather name={st.icon} size={16} color={st.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{report.titulo}</Text>
                          <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{report.residente} · Fase: {report.fase}</Text>
                          <Text style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>Enviado: {report.fecha}</Text>
                        </View>
                      </Row>
                      <Row style={{ alignItems: "center", gap: 8 }}>
                        {report.score !== null && (
                          <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: report.score >= 90 ? C.greenLight : C.amberLight }}>
                            <Text style={{ fontSize: 14, fontWeight: "800", color: report.score >= 90 ? C.green : C.amber }}>{report.score}</Text>
                          </View>
                        )}
                        <Badge text={report.status} color={st.color} bg={st.bg} />
                        <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color={C.textMuted} />
                      </Row>
                    </Row>
                  </TouchableOpacity>

                  {/* Expanded: Requirements + History + Actions */}
                  {isExpanded && (
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 }}>
                      {/* Requirements check */}
                      <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, marginBottom: 8, textTransform: "uppercase" }}>Cumplimiento de Requerimientos</Text>
                      <View style={{ gap: 6, marginBottom: 14 }}>
                        {[
                          { label: "Cumple con objetivos del proyecto", value: report.cumpleObjetivos },
                          { label: "Aprobación del diagnóstico empresarial", value: report.cumpleDiagnostico },
                          { label: "Cumple con el plan de trabajo", value: report.cumplePlanTrabajo },
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

                      {/* Feedback */}
                      {report.feedback && (
                        <View style={{ backgroundColor: C.tealLighter, borderRadius: 8, padding: 10, marginBottom: 14, borderLeftWidth: 2, borderLeftColor: C.teal }}>
                          <Text style={{ fontSize: 11, fontWeight: "700", color: C.teal, marginBottom: 3 }}>Retroalimentación</Text>
                          <Text style={{ fontSize: 12, color: C.textSub, lineHeight: 17 }}>{report.feedback}</Text>
                        </View>
                      )}

                      {/* Historial de cambios */}
                      {report.historial && report.historial.length > 0 && (
                        <View style={{ marginBottom: 14 }}>
                          <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, marginBottom: 6, textTransform: "uppercase" }}>Historial de Revisiones</Text>
                          {report.historial.map((h, hi) => (
                            <Row key={hi} style={{ alignItems: "center", gap: 8, paddingVertical: 4 }}>
                              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: h.status === "Aprobado" ? C.green : C.red }} />
                              <Text style={{ fontSize: 11, color: C.textMuted }}>{h.fecha} — <Text style={{ fontWeight: "700" }}>{h.status}</Text>: {h.comentario}</Text>
                            </Row>
                          ))}
                        </View>
                      )}

                      {/* File actions */}
                      <Row style={{ gap: 10 }}>
                        {report.archivo && (
                          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: C.border }}>
                            <Feather name="download" size={12} color={C.blue} />
                            <Text style={{ fontSize: 11, color: C.blue, fontWeight: "600" }}>Descargar archivo</Text>
                          </TouchableOpacity>
                        )}
                        {(report.status === "En Revisión" || report.status === "Pendiente Corrección") && (
                          <TouchableOpacity
                            onPress={() => { setReviewingReport(report); setScoreInput(""); setFeedback(""); }}
                            style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.teal, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
                          >
                            <Feather name="edit-2" size={12} color="white" />
                            <Text style={{ fontSize: 11, color: "white", fontWeight: "700" }}>Revisar</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: C.border }}>
                          <Feather name="upload" size={12} color={C.textMuted} />
                          <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: "600" }}>Subir correcciones</Text>
                        </TouchableOpacity>
                      </Row>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        </>
      )}

      {/* Review Modal */}
      <Modal visible={!!reviewingReport} transparent animationType="slide">
        <Pressable onPress={() => setReviewingReport(null)} style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "flex-end" }}>
          <Pressable onPress={() => {}} style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 28 }}>
            {reviewingReport && (
              <>
                <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>Revisar Reporte</Text>
                  <TouchableOpacity onPress={() => setReviewingReport(null)}>
                    <Feather name="x" size={20} color={C.textMuted} />
                  </TouchableOpacity>
                </Row>
                <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>{reviewingReport.titulo} · {reviewingReport.residente}</Text>

                {/* Requirements toggles */}
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Verificar Requerimientos</Text>
                <View style={{ gap: 6, marginBottom: 16, backgroundColor: C.bg, borderRadius: 10, padding: 12 }}>
                  {["Cumple objetivos del proyecto", "Aprobación diagnóstico empresarial", "Cumple plan de trabajo"].map((req, i) => (
                    <Row key={i} style={{ alignItems: "center", gap: 8 }}>
                      <Feather name="check-square" size={14} color={C.teal} />
                      <Text style={{ fontSize: 12, color: C.textSub }}>{req}</Text>
                    </Row>
                  ))}
                </View>

                {/* Score */}
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Calificación (0-100)</Text>
                <TextInput
                  value={scoreInput}
                  onChangeText={setScoreInput}
                  placeholder="Ej. 88"
                  placeholderTextColor={C.textLight}
                  keyboardType="numeric"
                  style={{ padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, fontSize: 16, color: C.text, backgroundColor: "#FAFAFA", marginBottom: 14 }}
                />

                {/* Feedback */}
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Retroalimentación / Comentarios *</Text>
                <TextInput
                  value={feedback}
                  onChangeText={setFeedback}
                  placeholder="Escribe tus comentarios detallados..."
                  placeholderTextColor={C.textLight}
                  multiline
                  style={{ padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, fontSize: 13, color: C.text, backgroundColor: "#FAFAFA", minHeight: 100, textAlignVertical: "top", marginBottom: 18 }}
                />

                <Row style={{ gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => submitReview("Rechazado")}
                    style={{ flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1.5, borderColor: C.red, alignItems: "center" }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: C.red }}>Solicitar Corrección</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => submitReview("Aprobado")}
                    style={{ flex: 2, paddingVertical: 13, borderRadius: 10, backgroundColor: C.teal, alignItems: "center" }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "white" }}>Aprobar</Text>
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
