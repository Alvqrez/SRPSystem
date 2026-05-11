import { useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, Badge, ProgressBar } from "../components";
import { useReportes } from "../context/ReportesContext";

const PARCIALES = [
  { id: 1, label: "Parcial 1", weeks: "Semana 1–4",  focus: "Diagnóstico inicial" },
  { id: 2, label: "Parcial 2", weeks: "Semana 5–8",  focus: "Desarrollo"          },
  { id: 3, label: "Parcial 3", weeks: "Semana 9–12", focus: "Integración"          },
];

const EMPTY_FORM = {
  actividadesRealizadas: "",
  horasReportadas:       "",
  avanceObjetivos:       "",
  problemas:             "",
  observaciones:         "",
};

const todayStr = () =>
  new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

export default function ReportesParciales() {
  const { reports, updateReport, preliminarAprobado } = useReportes() || {};
  const [activeTab,    setActiveTab]    = useState(1);
  const [forms,        setForms]        = useState({ 1: EMPTY_FORM, 2: EMPTY_FORM, 3: EMPTY_FORM });
  const [selectedFile, setSelectedFile] = useState({ 1: null, 2: null, 3: null });

  const parcialReport = (id) => reports?.find((r) => r.id === id);
  const form          = forms[activeTab];

  const updateForm = (key, val) =>
    setForms((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [key]: val } }));

  const selectFile = () => {
    if (!globalThis?.document?.createElement) {
      Alert.alert("Seleccionar archivo", "La selección de archivos está disponible en la versión web.");
      return;
    }
    const input = globalThis.document.createElement("input");
    input.type   = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setSelectedFile((prev) => ({
        ...prev,
        [activeTab]: { name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(2)} MB` },
      }));
    };
    input.click();
  };

  const submitReport = () => {
    const r = parcialReport(activeTab);
    if (r?.status === "Aprobado") {
      Alert.alert("Ya aprobado", "Este reporte ya fue aprobado por tu asesor.");
      return;
    }
    if (r?.status === "En Revisión") {
      Alert.alert("En revisión", "Este reporte ya fue enviado y está en revisión.");
      return;
    }
    if (!form.actividadesRealizadas.trim()) {
      Alert.alert("Falta información", "Describe las actividades realizadas.");
      return;
    }
    if (!form.horasReportadas.trim() || isNaN(Number(form.horasReportadas))) {
      Alert.alert("Falta información", "Ingresa las horas reportadas (número).");
      return;
    }

    updateReport(activeTab, {
      status:    "En Revisión",
      submitted: todayStr(),
      feedback:  null,
    });
    Alert.alert("Reporte enviado", `El Parcial ${activeTab} fue enviado a tu asesor para revisión.`);
  };

  // ── Lock si no tiene preliminar aprobado ──────────────────────────────────
  if (!preliminarAprobado) {
    return (
      <View style={{ flex:1, backgroundColor:C.bg, alignItems:"center", justifyContent:"center", padding:40 }}>
        <View style={{ width:72, height:72, borderRadius:18, backgroundColor:C.amberLight, alignItems:"center", justifyContent:"center", marginBottom:20 }}>
          <Feather name="lock" size={32} color={C.amber} />
        </View>
        <Text style={{ fontSize:20, fontWeight:"800", color:C.text, textAlign:"center", marginBottom:10 }}>
          Reportes Parciales bloqueados
        </Text>
        <Text style={{ fontSize:14, color:C.textMuted, textAlign:"center", lineHeight:22, maxWidth:380 }}>
          Tu Reporte Preliminar debe ser aprobado por tu asesor antes de poder entregar los reportes parciales.
        </Text>
      </View>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const activeReport = parcialReport(activeTab);
  const isLocked     = activeReport?.status === "Aprobado" || activeReport?.status === "En Revisión";

  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }} contentContainerStyle={{ padding:24 }}>
      {/* Header */}
      <View style={{ marginBottom:22 }}>
        <Text style={{ fontSize:22, fontWeight:"800", color:C.text }}>Reportes Parciales</Text>
        <Text style={{ fontSize:13, color:C.textMuted, marginTop:2 }}>Entrega tu avance por periodo de residencia</Text>
      </View>

      {/* Tabs */}
      <Row style={{ gap:10, marginBottom:22 }}>
        {PARCIALES.map((p) => {
          const rep    = parcialReport(p.id);
          const active = activeTab === p.id;
          const statusColor = {
            "Aprobado":     C.green,
            "En Revisión":  C.amber,
            "Rechazado":    C.red,
          }[rep?.status] || C.textMuted;

          return (
            <TouchableOpacity key={p.id} onPress={() => setActiveTab(p.id)}
              style={{ flex:1, borderRadius:12, padding:14, borderWidth: active ? 2 : 1,
                borderColor: active ? C.teal : C.border,
                backgroundColor: active ? C.tealLighter : C.card }}>
              <Row style={{ justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <Text style={{ fontSize:13, fontWeight:"800", color: active ? C.teal : C.text }}>{p.label}</Text>
                {rep?.status && (
                  <View style={{ width:8, height:8, borderRadius:4, backgroundColor:statusColor }} />
                )}
              </Row>
              <Text style={{ fontSize:11, color:C.textMuted }}>{p.weeks}</Text>
              <Text style={{ fontSize:11, color: active ? C.teal : C.textMuted, fontWeight:"600" }}>{p.focus}</Text>
              {rep?.status && (
                <View style={{ marginTop:6 }}>
                  <Text style={{ fontSize:10, color:statusColor, fontWeight:"700" }}>{rep.status}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </Row>

      {/* Estado del reporte activo */}
      {activeReport?.status && activeReport.status !== "Pendiente" && (
        <Card style={{ marginBottom:16, backgroundColor: activeReport.status === "Aprobado" ? C.greenLight : activeReport.status === "Rechazado" ? C.redLight : C.amberLight, borderWidth:0 }}>
          <Row style={{ alignItems:"center", gap:12 }}>
            <Feather
              name={ activeReport.status === "Aprobado" ? "check-circle" : activeReport.status === "Rechazado" ? "x-circle" : "clock" }
              size={22}
              color={ activeReport.status === "Aprobado" ? C.green : activeReport.status === "Rechazado" ? C.red : C.amber }
            />
            <View style={{ flex:1 }}>
              <Text style={{ fontSize:14, fontWeight:"800", color:C.text }}>
                {activeReport.status === "Aprobado" ? "Reporte aprobado" : activeReport.status === "Rechazado" ? "Reporte rechazado" : "En revisión por tu asesor"}
              </Text>
              {activeReport.feedback && (
                <Text style={{ fontSize:12, color:C.textSub, marginTop:4, lineHeight:18 }}>
                  {activeReport.feedback}
                </Text>
              )}
              {activeReport.score !== null && activeReport.score !== undefined && (
                <Text style={{ fontSize:13, fontWeight:"700", color:C.green, marginTop:4 }}>
                  Calificación: {activeReport.score}/100
                </Text>
              )}
            </View>
          </Row>
        </Card>
      )}

      {/* Formulario */}
      <Card style={{ opacity: isLocked ? 0.65 : 1 }}>
        <Text style={{ fontSize:16, fontWeight:"800", color:C.text, marginBottom:16 }}>
          Reporte Parcial {activeTab} — {PARCIALES[activeTab-1].focus}
        </Text>

        <Field label="Actividades realizadas *" placeholder="Describe las actividades y tareas completadas durante el periodo..."
          value={form.actividadesRealizadas} onChangeText={(v) => updateForm("actividadesRealizadas", v)}
          multiline editable={!isLocked} />

        <Field label="Horas reportadas *" placeholder="Ej. 120"
          value={form.horasReportadas} onChangeText={(v) => updateForm("horasReportadas", v)}
          keyboardType="numeric" editable={!isLocked} />

        <Field label="Avance en objetivos" placeholder="¿Qué porcentaje de los objetivos se cumplió? Describe brevemente..."
          value={form.avanceObjetivos} onChangeText={(v) => updateForm("avanceObjetivos", v)}
          multiline editable={!isLocked} />

        <Field label="Problemas / obstáculos" placeholder="Menciona dificultades encontradas y cómo se resolvieron..."
          value={form.problemas} onChangeText={(v) => updateForm("problemas", v)}
          multiline editable={!isLocked} />

        <Field label="Observaciones adicionales" placeholder="Cualquier comentario extra para tu asesor..."
          value={form.observaciones} onChangeText={(v) => updateForm("observaciones", v)}
          multiline editable={!isLocked} last />
      </Card>

      {/* Subir archivo */}
      <Card style={{ marginTop:16 }}>
        <Text style={{ fontSize:14, fontWeight:"800", color:C.text, marginBottom:12 }}>Archivo del reporte</Text>
        {!isLocked ? (
          <TouchableOpacity onPress={selectFile}
            style={{ borderWidth:2, borderStyle:"dashed", borderColor:C.border, borderRadius:12, padding:24, alignItems:"center", backgroundColor:C.bg }}>
            <Feather name="upload-cloud" size={28} color={C.teal} style={{ marginBottom:8 }} />
            <Text style={{ fontSize:13, fontWeight:"700", color:C.text, marginBottom:4 }}>
              {selectedFile[activeTab] ? selectedFile[activeTab].name : "Seleccionar archivo"}
            </Text>
            <Text style={{ fontSize:11, color:C.textMuted }}>
              {selectedFile[activeTab] ? selectedFile[activeTab].size : "PDF, DOCX · máx 25 MB"}
            </Text>
          </TouchableOpacity>
        ) : (
          <Row style={{ alignItems:"center", gap:10, padding:12, backgroundColor:C.bg, borderRadius:10 }}>
            <Feather name="file-text" size={18} color={C.textMuted} />
            <Text style={{ fontSize:13, color:C.textMuted }}>
              {activeReport?.submitted ? `Enviado el ${activeReport.submitted}` : "Sin archivo"}
            </Text>
          </Row>
        )}
      </Card>

      {/* Botón enviar */}
      {!isLocked && (
        <TouchableOpacity onPress={submitReport}
          style={{ backgroundColor:C.teal, borderRadius:12, padding:16, alignItems:"center", marginTop:16, marginBottom:40 }}>
          <Row style={{ alignItems:"center", gap:8 }}>
            <Feather name="send" size={16} color="white" />
            <Text style={{ fontSize:14, fontWeight:"800", color:"white" }}>Enviar Parcial {activeTab}</Text>
          </Row>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// ── Field helper ──────────────────────────────────────────────────────────────
function Field({ label, placeholder, value, onChangeText, multiline, keyboardType, editable = true, last = false }) {
  return (
    <View style={{ marginBottom: last ? 0 : 16 }}>
      <Text style={{ fontSize:11, fontWeight:"700", color:C.textMuted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textLight}
        multiline={multiline}
        keyboardType={keyboardType}
        editable={editable}
        style={{
          padding:11, borderRadius:9, borderWidth:1,
          borderColor: editable ? C.border : C.borderLight,
          fontSize:13, color: editable ? C.text : C.textMuted,
          backgroundColor: editable ? "#FAFAFA" : C.bg,
          textAlignVertical: multiline ? "top" : "center",
          minHeight: multiline ? 88 : undefined,
        }}
      />
    </View>
  );
}
