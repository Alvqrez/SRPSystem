import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, StatCard, Badge, ProgressBar } from "../components";

const REPORTS = [
  {
    id: 1,
    title: "Reporte Parcial 1",
    subtitle: "Semana 1 - 4 · Diagnóstico inicial",
    status: "Aprobado",
    statusColor: C.green,
    statusBg: C.greenLight,
    score: 95,
    scoreColor: C.green,
    submitted: "15 Oct 2024",
    reviewer: "Dr. Martínez",
    feedback:
      "Excelente diagnóstico inicial. Se identificaron correctamente los procesos críticos de la empresa y se establecieron metas claras y medibles para el proyecto.",
    items: [
      { label: "Diagnóstico empresarial", done: true },
      { label: "Objetivos del proyecto", done: true },
      { label: "Plan de trabajo", done: true },
    ],
  },
  {
    id: 2,
    title: "Reporte Parcial 2",
    subtitle: "Semana 5 - 8 · Desarrollo",
    status: "Aprobado",
    statusColor: C.green,
    statusBg: C.greenLight,
    score: 88,
    scoreColor: C.green,
    submitted: "12 Nov 2024",
    reviewer: "Dr. Martínez",
    feedback:
      "Buen avance en el desarrollo. Se recomienda profundizar más en la documentación técnica y detallar las pruebas unitarias realizadas.",
    items: [
      { label: "Avance de implementación", done: true },
      { label: "Documentación técnica", done: true },
      { label: "Pruebas unitarias", done: false },
    ],
  },
  {
    id: 3,
    title: "Reporte Parcial 3",
    subtitle: "Semana 9 - 12 · Integración",
    status: "En Revisión",
    statusColor: C.amber,
    statusBg: C.amberLight,
    score: null,
    scoreColor: C.textMuted,
    submitted: "05 Dic 2024",
    reviewer: "Dr. Martínez",
    feedback: null,
    items: [
      { label: "Integración de módulos", done: true },
      { label: "Pruebas de integración", done: true },
      { label: "Manual de usuario", done: false },
    ],
  },
  {
    id: 4,
    title: "Reporte Final",
    subtitle: "Semana 13 - 16 · Cierre",
    status: "Pendiente",
    statusColor: C.textMuted,
    statusBg: C.bg,
    score: null,
    scoreColor: C.textMuted,
    submitted: null,
    reviewer: "Dr. Martínez",
    feedback: null,
    items: [
      { label: "Resultados obtenidos", done: false },
      { label: "Conclusiones", done: false },
      { label: "Anexos y evidencias", done: false },
    ],
  },
];

export default function Seguimiento() {
  const [reports, setReports] = useState(REPORTS);
  const [selected, setSelected] = useState(1);
  const [viewingReport, setViewingReport] = useState(null);

  const exportReports = () => {
    const rows = reports
      .map(
        (report) => `
          <tr>
            <td>${report.title}</td>
            <td>${report.status}</td>
            <td>${report.score ?? "Pendiente"}</td>
            <td>${report.submitted ?? "Sin entregar"}</td>
            <td>${report.reviewer}</td>
          </tr>
        `,
      )
      .join("");

    const html = `
      <html>
        <head>
          <title>Seguimiento de Reportes</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0F172A; }
            h1 { margin-bottom: 4px; }
            p { color: #64748B; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            th, td { border: 1px solid #CBD5E1; padding: 10px; text-align: left; }
            th { background: #F1F5F9; }
          </style>
        </head>
        <body>
          <h1>Seguimiento de Reportes</h1>
          <p>Residencia Industrial - 2024-B</p>
          <table>
            <thead>
              <tr>
                <th>Reporte</th>
                <th>Estado</th>
                <th>Calificacion</th>
                <th>Envio</th>
                <th>Revisor</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;

    if (globalThis?.window?.open) {
      const win = globalThis.window.open("", "_blank");
      if (!win) {
        Alert.alert(
          "Exportar",
          "Permite ventanas emergentes para generar el PDF.",
        );
        return;
      }
      win.document.write(html);
      win.document.close();
      win.focus();
      win.print();
      return;
    }

    Alert.alert(
      "Exportar",
      "La exportacion a PDF esta disponible en la version web.",
    );
  };

  const deliverReport = (id) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              status: "En Revision",
              statusColor: C.amber,
              statusBg: C.amberLight,
              submitted: "Hoy",
            }
          : report,
      ),
    );
    Alert.alert(
      "Reporte entregado",
      "El reporte se marco como enviado y queda en revision.",
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 24 }}
    >
      {/* Header */}
      <Row
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>
            Seguimiento de Reportes
          </Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            Residencia Industrial · 2024-B
          </Text>
        </View>
        <TouchableOpacity
          onPress={exportReports}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            borderWidth: 1,
            borderColor: C.teal,
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 9,
            backgroundColor: C.tealLighter,
          }}
        >
          <Feather name="download" size={13} color={C.teal} />
          <Text style={{ color: C.teal, fontWeight: "700", fontSize: 13 }}>
            Exportar
          </Text>
        </TouchableOpacity>
      </Row>

      {/* Stat Cards */}
      <Row style={{ gap: 12, marginBottom: 22 }}>
        <StatCard
          label="Reportes Aprobados"
          value="2/3"
          icon="check-circle"
          iconBg={C.greenLight}
          iconColor={C.green}
          sub="67% completado"
        />
        <StatCard
          label="Calif. Promedio"
          value="91.5"
          icon="award"
          iconBg={C.purpleLight}
          iconColor={C.purple}
          trend="+3.2"
          trendUp
        />
        <StatCard
          label="Próx. Vencimiento"
          value="15 Dic"
          icon="clock"
          iconBg={C.amberLight}
          iconColor={C.amber}
          sub="10 días restantes"
        />
        <StatCard
          label="Horas Documentadas"
          value="384h"
          icon="bar-chart-2"
          iconBg={C.blueLight}
          iconColor={C.blue}
          trend="+48h"
          trendUp
        />
      </Row>

      {/* Progress Overview */}
      <Card style={{ marginBottom: 18 }}>
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>
            Progreso General
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.teal }}>
            67%
          </Text>
        </Row>
        <ProgressBar pct={67} color={C.teal} />
        <Row style={{ justifyContent: "space-between", marginTop: 10 }}>
          <Text style={{ fontSize: 11, color: C.textMuted }}>
            2 de 3 reportes aprobados
          </Text>
          <Text style={{ fontSize: 11, color: C.textMuted }}>
            Reporte Final pendiente
          </Text>
        </Row>
      </Card>

      {/* Report Cards */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "800",
          color: C.text,
          marginBottom: 12,
        }}
      >
        Historial de Reportes
      </Text>

      <View style={{ gap: 12 }}>
        {reports.map((report) => {
          const isOpen = selected === report.id;
          return (
            <Card key={report.id} style={{ padding: 0, overflow: "hidden" }}>
              {/* Report Header (always visible) */}
              <TouchableOpacity
                onPress={() => setSelected(isOpen ? null : report.id)}
                activeOpacity={0.85}
                style={{ padding: 18 }}
              >
                <Row
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Row style={{ flex: 1, gap: 12, alignItems: "flex-start" }}>
                    {/* Number bubble */}
                    <View
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        backgroundColor:
                          report.status === "Aprobado"
                            ? C.greenLight
                            : report.status === "En Revisión"
                              ? C.amberLight
                              : C.bg,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "800",
                          color:
                            report.status === "Aprobado"
                              ? C.green
                              : report.status === "En Revisión"
                                ? C.amber
                                : C.textMuted,
                        }}
                      >
                        {report.id}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: C.text,
                        }}
                      >
                        {report.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: C.textMuted,
                          marginTop: 2,
                        }}
                      >
                        {report.subtitle}
                      </Text>
                      {report.submitted && (
                        <Row
                          style={{ alignItems: "center", gap: 5, marginTop: 5 }}
                        >
                          <Feather
                            name="calendar"
                            size={11}
                            color={C.textLight}
                          />
                          <Text style={{ fontSize: 11, color: C.textLight }}>
                            Enviado: {report.submitted}
                          </Text>
                        </Row>
                      )}
                    </View>
                  </Row>
                  <Row style={{ alignItems: "center", gap: 10 }}>
                    {report.score !== null && (
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 8,
                          backgroundColor:
                            report.score >= 90 ? C.greenLight : C.amberLight,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "800",
                            color: report.score >= 90 ? C.green : C.amber,
                          }}
                        >
                          {report.score}
                        </Text>
                      </View>
                    )}
                    <Badge
                      text={report.status}
                      color={report.statusColor}
                      bg={report.statusBg}
                    />
                    <Feather
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={C.textMuted}
                    />
                  </Row>
                </Row>
              </TouchableOpacity>

              {/* Expanded content */}
              {isOpen && (
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: C.borderLight,
                    padding: 18,
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  {/* Checklist */}
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: C.textSub,
                      marginBottom: 10,
                    }}
                  >
                    Secciones del reporte
                  </Text>
                  <View style={{ gap: 7, marginBottom: 14 }}>
                    {report.items.map((item, idx) => (
                      <Row key={idx} style={{ alignItems: "center", gap: 8 }}>
                        <View
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 5,
                            backgroundColor: item.done ? C.green : C.bg,
                            borderWidth: item.done ? 0 : 1,
                            borderColor: C.border,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.done && (
                            <Feather name="check" size={11} color="white" />
                          )}
                        </View>
                        <Text
                          style={{
                            fontSize: 12,
                            color: item.done ? C.textSub : C.textMuted,
                            fontWeight: item.done ? "600" : "400",
                          }}
                        >
                          {item.label}
                        </Text>
                      </Row>
                    ))}
                  </View>

                  {/* Feedback */}
                  {report.feedback && (
                    <View
                      style={{
                        backgroundColor: C.tealLighter,
                        borderRadius: 10,
                        borderLeftWidth: 3,
                        borderLeftColor: C.teal,
                        padding: 13,
                      }}
                    >
                      <Row
                        style={{
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 6,
                        }}
                      >
                        <Feather
                          name="message-square"
                          size={13}
                          color={C.teal}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: C.teal,
                          }}
                        >
                          Retroalimentación · {report.reviewer}
                        </Text>
                      </Row>
                      <Text
                        style={{
                          fontSize: 12,
                          color: C.textSub,
                          lineHeight: 18,
                        }}
                      >
                        {report.feedback}
                      </Text>
                    </View>
                  )}

                  {/* Action buttons */}
                  <Row
                    style={{
                      gap: 8,
                      marginTop: 14,
                      justifyContent: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setViewingReport(report)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        borderWidth: 1,
                        borderColor: C.border,
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        borderRadius: 8,
                        backgroundColor: C.card,
                      }}
                    >
                      <Feather name="eye" size={12} color={C.textMuted} />
                      <Text
                        style={{
                          fontSize: 12,
                          color: C.textMuted,
                          fontWeight: "600",
                        }}
                      >
                        Ver reporte
                      </Text>
                    </TouchableOpacity>
                    {report.status === "Pendiente" && (
                      <TouchableOpacity
                        onPress={() => deliverReport(report.id)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                          backgroundColor: C.teal,
                          paddingHorizontal: 12,
                          paddingVertical: 7,
                          borderRadius: 8,
                        }}
                      >
                        <Feather name="upload" size={12} color="white" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "white",
                            fontWeight: "700",
                          }}
                        >
                          Entregar
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

      <Modal visible={!!viewingReport} transparent animationType="fade">
        <Pressable
          onPress={() => setViewingReport(null)}
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.45)",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              width: "100%",
              maxWidth: 620,
              backgroundColor: C.card,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: C.border,
              padding: 22,
            }}
          >
            {viewingReport && (
              <>
                <Row
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "800", color: C.text }}
                  >
                    {viewingReport.title}
                  </Text>
                  <TouchableOpacity onPress={() => setViewingReport(null)}>
                    <Feather name="x" size={20} color={C.textMuted} />
                  </TouchableOpacity>
                </Row>
                <Text
                  style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}
                >
                  {viewingReport.subtitle}
                </Text>
                <Row style={{ gap: 8, marginBottom: 14 }}>
                  <Badge
                    text={viewingReport.status}
                    color={viewingReport.statusColor}
                    bg={viewingReport.statusBg}
                  />
                  <Badge
                    text={`Calificacion: ${viewingReport.score ?? "Pendiente"}`}
                    color={viewingReport.score ? C.green : C.textMuted}
                    bg={viewingReport.score ? C.greenLight : C.bg}
                  />
                </Row>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: C.textSub,
                    marginBottom: 8,
                  }}
                >
                  Secciones
                </Text>
                <View style={{ gap: 6, marginBottom: 14 }}>
                  {viewingReport.items.map((item, idx) => (
                    <Row key={idx} style={{ alignItems: "center", gap: 8 }}>
                      <Feather
                        name={item.done ? "check-circle" : "circle"}
                        size={14}
                        color={item.done ? C.green : C.textLight}
                      />
                      <Text style={{ fontSize: 12, color: C.textSub }}>
                        {item.label}
                      </Text>
                    </Row>
                  ))}
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: C.textSub,
                    marginBottom: 8,
                  }}
                >
                  Retroalimentacion
                </Text>
                <Text
                  style={{ fontSize: 12, color: C.textMuted, lineHeight: 18 }}
                >
                  {viewingReport.feedback ||
                    "Este reporte todavia no tiene retroalimentacion."}
                </Text>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
