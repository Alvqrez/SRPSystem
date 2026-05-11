import { useState } from "react";
import { Alert, Modal, Pressable, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, StatCard, Badge, ProgressBar } from "../components";
import { useReportes } from "../context/ReportesContext";

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusStyle = (status) =>
  ({
    Aprobado:      { color: C.green,    bg: C.greenLight  },
    "En Revisión": { color: C.amber,    bg: C.amberLight  },
    Rechazado:     { color: C.red,      bg: C.redLight    },
    Entregado:     { color: C.blue,     bg: C.blueLight   },
    Pendiente:     { color: C.textMuted, bg: C.bg         },
  }[status] || { color: C.textMuted, bg: C.bg });

const todayStr = () => {
  const d = new Date();
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
};

export default function Seguimiento() {
  const { reports, updateReport, preliminarAprobado, finalDesbloqueado } = useReportes() || {};
  const [selected, setSelected]       = useState(null);
  const [viewingReport, setViewing]   = useState(null);

  // ── Display groups ────────────────────────────────────────────────────────
  const preliminar = reports?.find((r) => r.id === "preliminar");
  const parciales  = reports?.filter((r) => typeof r.id === "number") || [];
  const final      = reports?.find((r) => r.id === "final");

  const parcialesAprobados = parciales.filter((r) => r.status === "Aprobado").length;
  const promedio = parciales.filter((r) => r.score !== null).length
    ? (parciales.reduce((s, r) => s + (r.score || 0), 0) /
       parciales.filter((r) => r.score !== null).length).toFixed(1)
    : "—";

  // ── Actions ───────────────────────────────────────────────────────────────
  const deliverReport = (id) => {
    updateReport(id, { status: "En Revisión", submitted: todayStr() });
    Alert.alert("Reporte entregado", "Queda en revisión por tu asesor.");
  };

  const exportReports = () => {
    const rows = (reports || [])
      .map((r) => `<tr><td>${r.title}</td><td>${r.status}</td><td>${r.score ?? "—"}</td><td>${r.submitted ?? "Sin entregar"}</td><td>${r.reviewer}</td></tr>`)
      .join("");
    const html = `<html><head><title>Seguimiento</title><style>body{font-family:Arial;padding:32px}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{border:1px solid #CBD5E1;padding:10px}th{background:#F1F5F9}</style></head><body><h1>Seguimiento de Reportes</h1><table><thead><tr><th>Reporte</th><th>Estado</th><th>Calificación</th><th>Envío</th><th>Revisor</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    if (globalThis?.window?.open) {
      const win = globalThis.window.open("", "_blank");
      if (!win) { Alert.alert("Exportar", "Permite ventanas emergentes."); return; }
      win.document.write(html); win.document.close(); win.focus(); win.print();
    } else {
      Alert.alert("Exportar", "Disponible en la versión web.");
    }
  };

  // ── Report card renderer ──────────────────────────────────────────────────
  const ReportCard = ({ report, canDeliver = false }) => {
    const isOpen = selected === report.id;
    const { color, bg } = statusStyle(report.status);
    return (
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <TouchableOpacity
          onPress={() => setSelected(isOpen ? null : report.id)}
          activeOpacity={0.85}
          style={{ padding: 18 }}
        >
          <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Row style={{ flex: 1, gap: 12, alignItems: "flex-start" }}>
              <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
                <Feather name={report.status === "Aprobado" ? "check" : report.status === "En Revisión" ? "clock" : report.status === "Rechazado" ? "x" : "minus"} size={16} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{report.title}</Text>
                <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{report.subtitle}</Text>
                {report.submitted && (
                  <Row style={{ alignItems: "center", gap: 5, marginTop: 5 }}>
                    <Feather name="calendar" size={11} color={C.textLight} />
                    <Text style={{ fontSize: 11, color: C.textLight }}>Enviado: {report.submitted}</Text>
                  </Row>
                )}
              </View>
            </Row>
            <Row style={{ alignItems: "center", gap: 10 }}>
              {report.score !== null && (
                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: report.score >= 90 ? C.greenLight : C.amberLight }}>
                  <Text style={{ fontSize: 15, fontWeight: "800", color: report.score >= 90 ? C.green : C.amber }}>{report.score}</Text>
                </View>
              )}
              <Badge text={report.status} color={color} bg={bg} />
              <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={C.textMuted} />
            </Row>
          </Row>
        </TouchableOpacity>

        {isOpen && (
          <View style={{ borderTopWidth: 1, borderTopColor: C.borderLight, padding: 18, backgroundColor: "#F8FAFC" }}>
            {/* Checklist */}
            <Text style={{ fontSize: 12, fontWeight: "700", color: C.textSub, marginBottom: 10 }}>Secciones</Text>
            <View style={{ gap: 7, marginBottom: 14 }}>
              {report.items.map((item, idx) => (
                <Row key={idx} style={{ alignItems: "center", gap: 8 }}>
                  <View style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: item.done ? C.green : C.bg, borderWidth: item.done ? 0 : 1, borderColor: C.border, alignItems: "center", justifyContent: "center" }}>
                    {item.done && <Feather name="check" size={11} color="white" />}
                  </View>
                  <Text style={{ fontSize: 12, color: item.done ? C.textSub : C.textMuted, fontWeight: item.done ? "600" : "400" }}>{item.label}</Text>
                </Row>
              ))}
            </View>

            {/* Feedback */}
            {report.feedback && (
              <View style={{ backgroundColor: C.tealLighter, borderRadius: 10, borderLeftWidth: 3, borderLeftColor: C.teal, padding: 13, marginBottom: 14 }}>
                <Row style={{ alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Feather name="message-square" size={13} color={C.teal} />
                  <Text style={{ fontSize: 12, fontWeight: "700", color: C.teal }}>Retroalimentación · {report.reviewer}</Text>
                </Row>
                <Text style={{ fontSize: 12, color: C.textSub, lineHeight: 18 }}>{report.feedback}</Text>
              </View>
            )}

            {/* Actions */}
            <Row style={{ gap: 8, justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setViewing(report)}
                style={{ flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, backgroundColor: C.card }}
              >
                <Feather name="eye" size={12} color={C.textMuted} />
                <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: "600" }}>Ver reporte</Text>
              </TouchableOpacity>
              {canDeliver && report.status === "Pendiente" && (
                <TouchableOpacity
                  onPress={() => deliverReport(report.id)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.teal, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 }}
                >
                  <Feather name="upload" size={12} color="white" />
                  <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>Entregar</Text>
                </TouchableOpacity>
              )}
            </Row>
          </View>
        )}
      </Card>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      {/* Header */}
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Seguimiento de Reportes</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Residencia Industrial · 2024-B</Text>
        </View>
        <TouchableOpacity onPress={exportReports} style={{ flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: C.teal, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 9, backgroundColor: C.tealLighter }}>
          <Feather name="download" size={13} color={C.teal} />
          <Text style={{ color: C.teal, fontWeight: "700", fontSize: 13 }}>Exportar</Text>
        </TouchableOpacity>
      </Row>

      {/* Stat Cards */}
      <Row style={{ gap: 12, marginBottom: 22 }}>
        <StatCard label="Parciales Aprobados" value={`${parcialesAprobados}/3`} icon="check-circle" iconBg={C.greenLight} iconColor={C.green} sub={`${Math.round((parcialesAprobados / 3) * 100)}% completado`} />
        <StatCard label="Calif. Promedio" value={promedio} icon="award" iconBg={C.purpleLight} iconColor={C.purple} />
        <StatCard label="Reporte Final" value={finalDesbloqueado ? "Desbloqueado" : "Bloqueado"} icon={finalDesbloqueado ? "unlock" : "lock"} iconBg={finalDesbloqueado ? C.greenLight : C.amberLight} iconColor={finalDesbloqueado ? C.green : C.amber} />
        <StatCard label="Preliminar" value={preliminarAprobado ? "Aprobado" : "Pendiente"} icon="file" iconBg={preliminarAprobado ? C.greenLight : C.bg} iconColor={preliminarAprobado ? C.green : C.textMuted} />
      </Row>

      {/* Progress bar */}
      <Card style={{ marginBottom: 18 }}>
        <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>Progreso General</Text>
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.teal }}>{Math.round((parcialesAprobados / 3) * 100)}%</Text>
        </Row>
        <ProgressBar pct={(parcialesAprobados / 3) * 100} color={C.teal} />
        <Row style={{ justifyContent: "space-between", marginTop: 10 }}>
          <Text style={{ fontSize: 11, color: C.textMuted }}>{parcialesAprobados} de 3 parciales aprobados</Text>
          <Text style={{ fontSize: 11, color: C.textMuted }}>{finalDesbloqueado ? "Reporte Final desbloqueado ✓" : "Reporte Final bloqueado"}</Text>
        </Row>
      </Card>

      {/* ── Preliminar ── */}
      <Text style={{ fontSize: 13, fontWeight: "800", color: C.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Reporte Preliminar</Text>
      <View style={{ marginBottom: 20 }}>
        {preliminar && <ReportCard report={preliminar} canDeliver={false} />}
      </View>

      {/* ── Parciales ── */}
      <Text style={{ fontSize: 13, fontWeight: "800", color: C.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Reportes Parciales</Text>
      {!preliminarAprobado ? (
        <Card style={{ marginBottom: 20, backgroundColor: C.amberLight, borderWidth: 1, borderColor: C.amber }}>
          <Row style={{ alignItems: "center", gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.amber, alignItems: "center", justifyContent: "center" }}>
              <Feather name="lock" size={18} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "#92400e" }}>Parciales bloqueados</Text>
              <Text style={{ fontSize: 12, color: "#92400e", marginTop: 2 }}>Tu Reporte Preliminar debe ser aprobado por tu asesor antes de que puedas entregar los reportes parciales.</Text>
            </View>
          </Row>
        </Card>
      ) : (
        <View style={{ gap: 12, marginBottom: 20 }}>
          {parciales.map((r) => <ReportCard key={r.id} report={r} canDeliver={true} />)}
        </View>
      )}

      {/* ── Final status ── */}
      <Text style={{ fontSize: 13, fontWeight: "800", color: C.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Reporte Final</Text>
      {!finalDesbloqueado ? (
        <Card style={{ backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: C.border, borderStyle: "dashed" }}>
          <Row style={{ alignItems: "center", gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" }}>
              <Feather name="lock" size={18} color={C.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: C.textMuted }}>Reporte Final · Bloqueado</Text>
              <Text style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>
                {!preliminarAprobado
                  ? "Requiere: Preliminar aprobado + los 3 parciales aprobados."
                  : `Requiere: ${3 - parcialesAprobados} parcial(es) más aprobado(s).`}
              </Text>
            </View>
            <Badge text="Bloqueado" color={C.textMuted} bg={C.bg} />
          </Row>
        </Card>
      ) : (
        final && <ReportCard report={final} canDeliver={false} />
      )}

      {/* ── Detail Modal ── */}
      <Modal visible={!!viewingReport} transparent animationType="fade">
        <Pressable onPress={() => setViewing(null)} style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.45)", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Pressable onPress={() => {}} style={{ width: "100%", maxWidth: 620, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 22 }}>
            {viewingReport && (
              <>
                <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>{viewingReport.title}</Text>
                  <TouchableOpacity onPress={() => setViewing(null)}>
                    <Feather name="x" size={20} color={C.textMuted} />
                  </TouchableOpacity>
                </Row>
                <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>{viewingReport.subtitle}</Text>
                <Row style={{ gap: 8, marginBottom: 14 }}>
                  <Badge text={viewingReport.status} color={statusStyle(viewingReport.status).color} bg={statusStyle(viewingReport.status).bg} />
                  <Badge text={`Calificación: ${viewingReport.score ?? "Pendiente"}`} color={viewingReport.score ? C.green : C.textMuted} bg={viewingReport.score ? C.greenLight : C.bg} />
                </Row>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.textSub, marginBottom: 8 }}>Secciones</Text>
                <View style={{ gap: 6, marginBottom: 14 }}>
                  {viewingReport.items.map((item, idx) => (
                    <Row key={idx} style={{ alignItems: "center", gap: 8 }}>
                      <Feather name={item.done ? "check-circle" : "circle"} size={14} color={item.done ? C.green : C.textLight} />
                      <Text style={{ fontSize: 12, color: C.textSub }}>{item.label}</Text>
                    </Row>
                  ))}
                </View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.textSub, marginBottom: 8 }}>Retroalimentación</Text>
                <Text style={{ fontSize: 12, color: C.textMuted, lineHeight: 18 }}>
                  {viewingReport.feedback || "Este reporte todavía no tiene retroalimentación."}
                </Text>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
