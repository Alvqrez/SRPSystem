import { useState } from "react";
import { Alert, Modal, Pressable, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, StatCard, Badge, ProgressBar } from "../components";
import { useReportes } from "../context/ReportesContext";
import { useNotificaciones } from "../context/NotificacionesContext";

// Datos de demo del residente asignado
const RESIDENTE = {
  nombre: "Carlos Ramírez",
  iniciales: "CR",
  carrera: "Ing. en Sistemas de Información",
  empresa: "AutoParts Globales S.A. de C.V.",
  numControl: "210000042",
};

const statusStyle = (status) =>
  ({
    Aprobado:      { color: C.green,    bg: C.greenLight  },
    "En Revisión": { color: C.amber,    bg: C.amberLight  },
    Rechazado:     { color: C.red,      bg: C.redLight    },
    Pendiente:     { color: C.textMuted, bg: C.bg         },
  }[status] || { color: C.textMuted, bg: C.bg });

export default function SeguimientoAsesor() {
  const { reports, updateReport } = useReportes() || {};
  const { setNotifications } = useNotificaciones() || {};

  const [reviewingId, setReviewingId] = useState(null);
  const [scoreInput, setScoreInput]   = useState("");
  const [feedback, setFeedback]       = useState("");

  // Solo se muestran reportes que el residente haya entregado (excluye Final pendiente)
  const displayReports = (reports || []).filter((r) => r.id !== "final");
  const pendingReview  = displayReports.filter((r) => r.status === "En Revisión");
  const reviewingReport = (reports || []).find((r) => r.id === reviewingId);

  const openReview = (id) => {
    setReviewingId(id);
    setScoreInput("");
    setFeedback("");
  };

  const submitReview = (newStatus) => {
    const parsedScore = parseFloat(scoreInput);
    if (newStatus === "Aprobado" && (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100)) {
      Alert.alert("Calificación inválida", "Ingresa un número entre 0 y 100.");
      return;
    }
    if (!feedback.trim()) {
      Alert.alert("Falta retroalimentación", "Escribe retroalimentación antes de guardar.");
      return;
    }

    updateReport(reviewingId, {
      status: newStatus,
      score:  newStatus === "Aprobado" ? parsedScore : null,
      feedback: feedback.trim(),
    });

    // Agregar notificación al contexto compartido
    if (setNotifications) {
      const notif = {
        id: Date.now(),
        icon:      newStatus === "Aprobado" ? "check-circle" : "x-circle",
        iconBg:    newStatus === "Aprobado" ? C.greenLight   : C.redLight,
        iconColor: newStatus === "Aprobado" ? C.green        : C.red,
        title:     `${reviewingReport?.title} ${newStatus === "Aprobado" ? "aprobado" : "rechazado"}`,
        body:      feedback.trim(),
        time:      "Ahora",
        unread:    true,
        type:      newStatus === "Aprobado" ? "Aprobación" : "Reporte",
        typeBg:    newStatus === "Aprobado" ? C.greenLight   : C.redLight,
        typeColor: newStatus === "Aprobado" ? C.green        : C.red,
        actionScreen: "seguimiento",
        actionLabel:  "Ver retroalimentación",
      };
      setNotifications((prev) => [notif, ...(prev || [])]);
    }

    setReviewingId(null);
    Alert.alert("Revisión guardada", `Reporte marcado como ${newStatus}.`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>

      {/* Header */}
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Revisión de Reportes</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Retroalimentación y calificación de residentes</Text>
        </View>
      </Row>

      {/* Stat Cards */}
      <Row style={{ gap: 12, marginBottom: 22 }}>
        <StatCard label="En Revisión"   value={String(pendingReview.length)}                                  icon="clock"        iconBg={C.amberLight} iconColor={C.amber} />
        <StatCard label="Aprobados"     value={String(displayReports.filter((r) => r.status === "Aprobado").length)} icon="check-circle" iconBg={C.greenLight} iconColor={C.green} />
        <StatCard label="Rechazados"    value={String(displayReports.filter((r) => r.status === "Rechazado").length)} icon="x-circle"    iconBg={C.redLight}   iconColor={C.red}   />
        <StatCard label="Total entregados" value={String(displayReports.filter((r) => r.submitted).length)}  icon="file-text"    iconBg={C.blueLight}  iconColor={C.blue}  />
      </Row>

      {/* Residente info */}
      <Card style={{ marginBottom: 20 }}>
        <Row style={{ alignItems: "center", gap: 14 }}>
          <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: C.navy, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 14, color: "white", fontWeight: "800" }}>{RESIDENTE.iniciales}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }}>{RESIDENTE.nombre}</Text>
            <Text style={{ fontSize: 12, color: C.textMuted }}>{RESIDENTE.carrera} · #{RESIDENTE.numControl}</Text>
            <Text style={{ fontSize: 12, color: C.teal, fontWeight: "600", marginTop: 2 }}>{RESIDENTE.empresa}</Text>
          </View>
          {pendingReview.length > 0 && (
            <View style={{ backgroundColor: C.amber, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>{pendingReview.length} por revisar</Text>
            </View>
          )}
        </Row>
      </Card>

      {/* Reportes list */}
      <Text style={{ fontSize: 13, fontWeight: "800", color: C.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Historial de reportes
      </Text>

      <View style={{ gap: 12 }}>
        {displayReports.map((report) => {
          const { color, bg } = statusStyle(report.status);
          const needsReview   = report.status === "En Revisión";
          return (
            <Card key={report.id} style={{ padding: 0, overflow: "hidden", borderLeftWidth: needsReview ? 3 : 0, borderLeftColor: C.amber }}>
              <View style={{ padding: 18 }}>
                <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Row style={{ flex: 1, gap: 12, alignItems: "flex-start" }}>
                    <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
                      <Feather
                        name={report.status === "Aprobado" ? "check" : report.status === "En Revisión" ? "clock" : report.status === "Rechazado" ? "x" : "minus"}
                        size={16} color={color}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{report.title}</Text>
                      <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{report.subtitle}</Text>
                      {report.submitted && (
                        <Row style={{ alignItems: "center", gap: 5, marginTop: 4 }}>
                          <Feather name="calendar" size={11} color={C.textLight} />
                          <Text style={{ fontSize: 11, color: C.textLight }}>Enviado: {report.submitted}</Text>
                        </Row>
                      )}
                    </View>
                  </Row>
                  <Row style={{ alignItems: "center", gap: 8 }}>
                    {report.score !== null && (
                      <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: report.score >= 90 ? C.greenLight : C.amberLight }}>
                        <Text style={{ fontSize: 15, fontWeight: "800", color: report.score >= 90 ? C.green : C.amber }}>{report.score}</Text>
                      </View>
                    )}
                    <Badge text={report.status} color={color} bg={bg} />
                  </Row>
                </Row>

                {/* Feedback preview */}
                {report.feedback && (
                  <View style={{ marginTop: 12, backgroundColor: C.tealLighter, borderRadius: 8, padding: 10, borderLeftWidth: 2, borderLeftColor: C.teal }}>
                    <Text style={{ fontSize: 11, color: C.teal, fontWeight: "700", marginBottom: 3 }}>Tu retroalimentación</Text>
                    <Text style={{ fontSize: 11, color: C.textSub, lineHeight: 16 }} numberOfLines={2}>{report.feedback}</Text>
                  </View>
                )}

                {/* Action */}
                <Row style={{ marginTop: 14, justifyContent: "flex-end", gap: 8 }}>
                  {needsReview && (
                    <TouchableOpacity
                      onPress={() => openReview(report.id)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.teal, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 }}
                    >
                      <Feather name="edit-2" size={12} color="white" />
                      <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>Revisar</Text>
                    </TouchableOpacity>
                  )}
                  {!needsReview && report.submitted && (
                    <TouchableOpacity
                      onPress={() => openReview(report.id)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 }}
                    >
                      <Feather name="edit-2" size={12} color={C.textMuted} />
                      <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: "600" }}>Editar revisión</Text>
                    </TouchableOpacity>
                  )}
                  {!report.submitted && (
                    <Text style={{ fontSize: 12, color: C.textLight, fontStyle: "italic" }}>Sin entregar aún</Text>
                  )}
                </Row>
              </View>
            </Card>
          );
        })}
      </View>

      {/* ── Review Modal ── */}
      <Modal visible={!!reviewingId} transparent animationType="slide">
        <Pressable onPress={() => setReviewingId(null)} style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "flex-end" }}>
          <Pressable onPress={() => {}} style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 28 }}>
            {reviewingReport && (
              <>
                {/* Modal Header */}
                <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>Revisar reporte</Text>
                  <TouchableOpacity onPress={() => setReviewingId(null)}>
                    <Feather name="x" size={20} color={C.textMuted} />
                  </TouchableOpacity>
                </Row>
                <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
                  {reviewingReport.title} · {RESIDENTE.nombre}
                </Text>

                {/* Score */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                    Calificación (0 – 100)
                  </Text>
                  <TextInput
                    value={scoreInput}
                    onChangeText={setScoreInput}
                    placeholder="Ej. 92"
                    placeholderTextColor={C.textLight}
                    keyboardType="numeric"
                    style={{ padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, fontSize: 16, color: C.text, backgroundColor: "#FAFAFA" }}
                  />
                </View>

                {/* Feedback */}
                <View style={{ marginBottom: 22 }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                    Retroalimentación *
                  </Text>
                  <TextInput
                    value={feedback}
                    onChangeText={setFeedback}
                    placeholder="Escribe tus comentarios al residente..."
                    placeholderTextColor={C.textLight}
                    multiline
                    style={{ padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, fontSize: 13, color: C.text, backgroundColor: "#FAFAFA", minHeight: 100, textAlignVertical: "top" }}
                  />
                </View>

                {/* Buttons */}
                <Row style={{ gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => submitReview("Rechazado")}
                    style={{ flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1.5, borderColor: C.red, alignItems: "center" }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: C.red }}>Rechazar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => submitReview("Aprobado")}
                    style={{ flex: 2, paddingVertical: 13, borderRadius: 10, backgroundColor: C.teal, alignItems: "center" }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "white" }}>Aprobar reporte</Text>
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
