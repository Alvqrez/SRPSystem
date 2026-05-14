import { useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, Badge } from "../components";
import { useReportes } from "../context/ReportesContext";
import { useProyectos } from "../context/ProyectosContext";

export default function ReportePreliminar() {
  // ── Contextos — conexión al flujo de revisión ─────────────────────────────
  const { updateReport, reports }         = useReportes()  || {};
  const { submitReporteFromResidente }    = useProyectos() || {};

  const preliminarReport = reports?.find((r) => r.id === "preliminar");

  const [fuenteProyecto, setFuenteProyecto] = useState("");
  const [formData, setFormData] = useState({
    nombreProyecto:    "",
    periodoResidencia: "",
    numAlumnos:        "",
    empresa:           "",
    nombreEmpresa:     "",
    domicilioEmpresa:  "",
    redSocialEmpresa:  "",
    telefonoEmpresa:   "",
    extensionEmpresa:  "",
    asesorExterno:     "",
    contactoExterno:   "",
    puestoExterno:     "",
    sitioWebEmpresa:   "",
    asesorInterno:     "",
  });
  const [actividades, setActividades] = useState(["", "", "", "", "", "", ""]);
  const [induccion,   setInduccion]   = useState(
    Array.from({ length: 16 }, (_, i) => i === 0)
  );
  const [cronograma, setCronograma] = useState(
    Array(7).fill(null).map(() => Array(16).fill(false))
  );
  const [uploadedFile, setUploadedFile] = useState(null);
  const [savedAt,      setSavedAt]     = useState(null);

  const updateField     = (key, val) => setFormData({ ...formData, [key]: val });
  const updateActividad = (i, val) => { const c = [...actividades]; c[i] = val; setActividades(c); };
  const toggleCronograma = (row, col) => { const c = cronograma.map((r) => [...r]); c[row][col] = !c[row][col]; setCronograma(c); };
  const toggleInduccion  = (col) => { const c = [...induccion]; c[col] = !c[col]; setInduccion(c); };

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
      setUploadedFile({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(2)} MB` });
    };
    input.click();
  };

  const uploadReport = () => {
    if (!formData.nombreProyecto.trim()) {
      Alert.alert("Falta información", "Escribe el nombre del proyecto antes de subir.");
      return;
    }
    if (!uploadedFile) {
      Alert.alert("Sin archivo", "Selecciona el archivo del reporte preliminar antes de subirlo.");
      return;
    }
    if (preliminarReport?.status === "Aceptado") {
      Alert.alert("Ya aceptado", "Tu reporte preliminar ya fue aceptado por tu asesor.");
      return;
    }
    if (preliminarReport?.status === "Pendiente" && preliminarReport?.submitted) {
      Alert.alert("En revisión", "Tu reporte preliminar ya fue enviado y está pendiente de revisión.");
      return;
    }

    const today = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
    setSavedAt(new Date().toLocaleString());

    // 1. Actualizar ReportesContext (el Residente ve el estado)
    if (updateReport) {
      updateReport("preliminar", { status: "Pendiente", submitted: today, feedback: null });
    }

    // 2. Sincronizar a ProyectosContext (el Asesor lo ve en SeguimientoAsesor)
    if (submitReporteFromResidente) {
      submitReporteFromResidente("Preliminar");
    }

    Alert.alert(
      "Reporte Preliminar enviado",
      "Tu reporte fue enviado correctamente. Tu asesor lo revisará y recibirás retroalimentación en breve."
    );
  };

  const fuentes = [
    { id: "banco",   label: "Banco de Proyectos",               icon: "database"  },
    { id: "propia",  label: "Propuesta Propia",                  icon: "user"      },
    { id: "empresa", label: "Propuesta Organización o Empresa",  icon: "briefcase" },
  ];

  // ── Mostrar estado si ya fue enviado/revisado ─────────────────────────────
  const isLocked = preliminarReport?.status === "Aceptado" ||
    (preliminarReport?.status === "Pendiente" && preliminarReport?.submitted);

  return (
    <ScrollView>
      {/* ── Header ── */}
      <View style={{ backgroundColor: C.navy, borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Row style={{ alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Feather name="edit" size={18} color={C.teal} />
              <Text style={{ fontSize: 18, fontWeight: "800", color: "white" }}>Reporte Preliminar</Text>
            </Row>
            <Text style={{ color: C.textLight, fontSize: 13 }}>Residencia Profesional — Datos del Proyecto</Text>
          </View>
          <Badge text="ITV-AC-PO-004-A01" color={C.teal} bg="rgba(13,148,136,0.2)" />
        </Row>
      </View>

      {/* ── Banner de estado ── */}
      {preliminarReport?.status && preliminarReport.submitted && (
        <View style={{
          marginBottom: 16,
          backgroundColor:
            preliminarReport.status === "Aceptado"     ? C.greenLight :
            preliminarReport.status === "Por corregir" ? C.redLight   : C.amberLight,
          borderRadius: 12, padding: 14,
          borderWidth: 1,
          borderColor:
            preliminarReport.status === "Aceptado"     ? C.green :
            preliminarReport.status === "Por corregir" ? C.red   : C.amber,
        }}>
          <Row style={{ alignItems: "center", gap: 10 }}>
            <Feather
              name={
                preliminarReport.status === "Aceptado"     ? "check-circle" :
                preliminarReport.status === "Por corregir" ? "x-circle"     : "clock"
              }
              size={20}
              color={
                preliminarReport.status === "Aceptado"     ? C.green :
                preliminarReport.status === "Por corregir" ? C.red   : C.amber
              }
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>
                {preliminarReport.status === "Aceptado"     ? "Reporte aceptado por tu asesor ✓" :
                 preliminarReport.status === "Por corregir" ? "Se requieren correcciones" :
                 "En revisión por tu asesor — pendiente de respuesta"}
              </Text>
              {preliminarReport.feedback && (
                <Text style={{ fontSize: 12, color: C.textSub, marginTop: 4, lineHeight: 18 }}>
                  {preliminarReport.feedback}
                </Text>
              )}
            </View>
          </Row>
        </View>
      )}

      {/* ── Fuente del Proyecto ── */}
      <Card style={{ marginBottom: 16, opacity: isLocked ? 0.7 : 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", color: C.text, marginBottom: 14 }}>Fuente del Proyecto</Text>
        <Row style={{ gap: 12 }}>
          {fuentes.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => !isLocked && setFuenteProyecto(f.id)}
              style={{
                flex: 1, padding: 16, borderRadius: 12, borderWidth: 2,
                borderColor: fuenteProyecto === f.id ? C.teal : C.border,
                backgroundColor: fuenteProyecto === f.id ? C.tealLight : "white",
                alignItems: "center", gap: 8,
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: fuenteProyecto === f.id ? C.teal : C.bg, alignItems: "center", justifyContent: "center" }}>
                <Feather name={f.icon} size={18} color={fuenteProyecto === f.id ? "white" : C.textMuted} />
              </View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: fuenteProyecto === f.id ? C.teal : C.textMuted, textAlign: "center" }}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Row>
      </Card>

      {/* ── Datos del Proyecto ── */}
      <Card style={{ marginBottom: 16, opacity: isLocked ? 0.7 : 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", color: C.text, marginBottom: 14 }}>Datos del Proyecto</Text>
        <FormField label="Nombre del Proyecto" value={formData.nombreProyecto} onChange={(v) => updateField("nombreProyecto", v)} placeholder="Ej: Sistema de gestión de inventarios" disabled={isLocked} />
        <FormField label="Empresa" value={formData.empresa} onChange={(v) => updateField("empresa", v)} placeholder="Ej: Telmex S.A. de C.V." disabled={isLocked} />
        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="Periodo de Residencia" value={formData.periodoResidencia} onChange={(v) => updateField("periodoResidencia", v)} placeholder="Ej: Ago-Dic 2024" disabled={isLocked} />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="No. de Alumnos" value={formData.numAlumnos} onChange={(v) => updateField("numAlumnos", v)} placeholder="1" disabled={isLocked} />
          </View>
        </Row>
      </Card>

      {/* ── Datos de la Organización ── */}
      <Card style={{ marginBottom: 16, opacity: isLocked ? 0.7 : 1 }}>
        <Row style={{ alignItems: "center", gap: 8, marginBottom: 14 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" }}>
            <Feather name="briefcase" size={14} color={C.blue} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>Datos de la Organización o Empresa</Text>
        </Row>
        <FormField label="Nombre de la Empresa"    value={formData.nombreEmpresa}    onChange={(v) => updateField("nombreEmpresa", v)}    placeholder="Nombre de la organización" disabled={isLocked} />
        <FormField label="Domicilio"               value={formData.domicilioEmpresa} onChange={(v) => updateField("domicilioEmpresa", v)} placeholder="Dirección completa"       disabled={isLocked} />
        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}><FormField label="Red Social"  value={formData.redSocialEmpresa}  onChange={(v) => updateField("redSocialEmpresa", v)}  placeholder="URL"             disabled={isLocked} /></View>
          <View style={{ flex: 1 }}><FormField label="Sitio Web"   value={formData.sitioWebEmpresa}   onChange={(v) => updateField("sitioWebEmpresa", v)}   placeholder="www.empresa.com" disabled={isLocked} /></View>
        </Row>
        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}><FormField label="Teléfono"  value={formData.telefonoEmpresa}  onChange={(v) => updateField("telefonoEmpresa", v)}  placeholder="Teléfono" disabled={isLocked} /></View>
          <View style={{ flex: 1 }}><FormField label="Extensión" value={formData.extensionEmpresa} onChange={(v) => updateField("extensionEmpresa", v)} placeholder="Ext."     disabled={isLocked} /></View>
        </Row>
        <FormField label="Asesor Externo" value={formData.asesorExterno} onChange={(v) => updateField("asesorExterno", v)} placeholder="Nombre del asesor en la empresa" disabled={isLocked} />
        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}><FormField label="Contacto" value={formData.contactoExterno} onChange={(v) => updateField("contactoExterno", v)} placeholder="Email o teléfono" disabled={isLocked} /></View>
          <View style={{ flex: 1 }}><FormField label="Puesto"   value={formData.puestoExterno}   onChange={(v) => updateField("puestoExterno", v)}   placeholder="Cargo"           disabled={isLocked} /></View>
        </Row>
        <FormField label="Asesor Interno (Propuesta)" value={formData.asesorInterno} onChange={(v) => updateField("asesorInterno", v)} placeholder="Nombre del asesor interno propuesto" disabled={isLocked} />
        <Text style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", marginTop: 4 }}>
          *La asignación final del asesor es responsabilidad del jefe del Dpto. Académico
        </Text>
      </Card>

      {/* ── Actividades ── */}
      <Card style={{ marginBottom: 16, opacity: isLocked ? 0.7 : 1 }}>
        <Row style={{ alignItems: "center", gap: 8, marginBottom: 14 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.greenLight, alignItems: "center", justifyContent: "center" }}>
            <Feather name="list" size={14} color={C.green} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>Descripción de las Actividades</Text>
        </Row>
        {actividades.map((act, i) => (
          <Row key={i} style={{ alignItems: "center", gap: 10, marginBottom: 10 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: C.textMuted }}>{i + 1}</Text>
            </View>
            <TextInput
              value={act}
              onChangeText={(v) => updateActividad(i, v)}
              placeholder={`Actividad ${i + 1}`}
              placeholderTextColor={C.textLight}
              editable={!isLocked}
              style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: C.border, fontSize: 13, color: C.text, backgroundColor: isLocked ? C.bg : "#FAFAFA" }}
            />
          </Row>
        ))}
        {!isLocked && (
          <TouchableOpacity onPress={() => setActividades([...actividades, ""])} style={{ flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingVertical: 8 }}>
            <Feather name="plus-circle" size={14} color={C.teal} />
            <Text style={{ fontSize: 12, fontWeight: "700", color: C.teal }}>Agregar actividad</Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* ── Cronograma ── */}
      <Card style={{ marginBottom: 16, opacity: isLocked ? 0.7 : 1 }}>
        <Row style={{ alignItems: "center", gap: 8, marginBottom: 14 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.amberLight, alignItems: "center", justifyContent: "center" }}>
            <Feather name="calendar" size={14} color={C.amber} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>Cronograma de Actividades (16 semanas)</Text>
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <Row>
              <View style={{ width: 140, padding: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: C.textMuted, textTransform: "uppercase" }}>Actividad</Text>
              </View>
              {Array.from({ length: 16 }, (_, i) => (
                <View key={i} style={{ width: 32, alignItems: "center", padding: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: "700", color: C.textMuted }}>{i + 1}</Text>
                </View>
              ))}
            </Row>
            {/* Inducción */}
            <Row style={{ borderTopWidth: 1, borderTopColor: C.borderLight }}>
              <View style={{ width: 140, padding: 6, justifyContent: "center" }}>
                <Text style={{ fontSize: 11, color: C.textSub }} numberOfLines={1}>Inducción</Text>
              </View>
              {Array.from({ length: 16 }, (_, col) => (
                <TouchableOpacity key={col} onPress={() => !isLocked && toggleInduccion(col)} style={{ width: 32, height: 28, alignItems: "center", justifyContent: "center" }}>
                  <View style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: induccion[col] ? C.teal : C.bg, borderWidth: 1, borderColor: induccion[col] ? C.teal : C.border }}>
                    {induccion[col] && <Feather name="check" size={10} color="white" />}
                  </View>
                </TouchableOpacity>
              ))}
            </Row>
            {/* Actividades */}
            {actividades.map((act, row) => (
              <Row key={row} style={{ borderTopWidth: 1, borderTopColor: C.borderLight }}>
                <View style={{ width: 140, padding: 6, justifyContent: "center" }}>
                  <Text style={{ fontSize: 11, color: C.textSub }} numberOfLines={1}>{act || `Actividad ${row + 1}`}</Text>
                </View>
                {Array.from({ length: 16 }, (_, col) => (
                  <TouchableOpacity key={col} onPress={() => !isLocked && toggleCronograma(row, col)} style={{ width: 32, height: 28, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: cronograma[row][col] ? C.teal : C.bg, borderWidth: 1, borderColor: cronograma[row][col] ? C.teal : C.border }}>
                      {cronograma[row][col] && <Feather name="check" size={10} color="white" />}
                    </View>
                  </TouchableOpacity>
                ))}
              </Row>
            ))}
          </View>
        </ScrollView>
      </Card>

      {/* ── Subir archivo ── */}
      <Card style={{ marginBottom: 16 }}>
        <Row style={{ alignItems: "center", gap: 8, marginBottom: 14 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" }}>
            <Feather name="upload-cloud" size={14} color={C.blue} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>Archivo del Reporte</Text>
        </Row>
        {!isLocked ? (
          <TouchableOpacity
            onPress={selectFile}
            style={{ borderWidth: 2, borderStyle: "dashed", borderColor: uploadedFile ? C.teal : C.border, borderRadius: 12, padding: 24, alignItems: "center", backgroundColor: uploadedFile ? C.tealLighter : C.bg }}
          >
            <Feather name="upload-cloud" size={28} color={uploadedFile ? C.teal : C.textMuted} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 13, fontWeight: "700", color: uploadedFile ? C.teal : C.text, marginBottom: 4 }}>
              {uploadedFile ? uploadedFile.name : "Seleccionar archivo"}
            </Text>
            <Text style={{ fontSize: 11, color: C.textMuted }}>{uploadedFile ? uploadedFile.size : "PDF, DOCX · máx 25 MB"}</Text>
          </TouchableOpacity>
        ) : (
          <Row style={{ alignItems: "center", gap: 10, padding: 12, backgroundColor: C.tealLighter, borderRadius: 10 }}>
            <Feather name="file-text" size={18} color={C.teal} />
            <Text style={{ fontSize: 13, color: C.teal, fontWeight: "600" }}>
              Documento enviado el {preliminarReport?.submitted || "—"}
            </Text>
          </Row>
        )}
      </Card>

      {/* ── Confirmación ── */}
      {savedAt && !isLocked && (
        <View style={{ backgroundColor: C.greenLight, borderWidth: 1, borderColor: C.green, borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <Row style={{ alignItems: "center", gap: 8 }}>
            <Feather name="check-circle" size={16} color={C.green} />
            <Text style={{ fontSize: 12, color: C.green, fontWeight: "700" }}>Reporte subido: {savedAt}</Text>
          </Row>
        </View>
      )}

      {/* ── Botón enviar ── */}
      {!isLocked && (
        <TouchableOpacity
          onPress={uploadReport}
          style={{ backgroundColor: C.teal, borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 40 }}
        >
          <Row style={{ alignItems: "center", gap: 8 }}>
            <Feather name="upload-cloud" size={18} color="white" />
            <Text style={{ color: "white", fontWeight: "800", fontSize: 15 }}>Subir Reporte Preliminar</Text>
          </Row>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

function FormField({ label, value, onChange, placeholder, multiline, disabled = false }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: C.textSub, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value} onChangeText={onChange}
        placeholder={placeholder} placeholderTextColor={C.textLight}
        multiline={multiline} numberOfLines={multiline ? 4 : 1}
        editable={!disabled}
        style={{
          padding: 11, borderRadius: 8, borderWidth: 1,
          borderColor: disabled ? C.borderLight : C.border,
          fontSize: 13, color: disabled ? C.textMuted : C.text,
          backgroundColor: disabled ? C.bg : "#FAFAFA",
          ...(multiline ? { minHeight: 90, textAlignVertical: "top" } : {}),
        }}
      />
    </View>
  );
}
