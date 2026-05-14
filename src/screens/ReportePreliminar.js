import { useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, Badge } from "../components";

export default function ReportePreliminar() {
  const [fuenteProyecto, setFuenteProyecto] = useState("");
  const [formData, setFormData] = useState({
    nombreProyecto: "",
    periodoResidencia: "",
    numAlumnos: "",
    empresa: "",
    nombreEmpresa: "",
    domicilioEmpresa: "",
    redSocialEmpresa: "",
    telefonoEmpresa: "",
    extensionEmpresa: "",
    asesorExterno: "",
    contactoExterno: "",
    puestoExterno: "",
    sitioWebEmpresa: "",
    asesorInterno: "",
  });
  const [actividades, setActividades] = useState(["", "", "", "", "", "", ""]);
  const [induccion, setInduccion] = useState(
    Array.from({ length: 16 }, (_, index) => index === 0)
  );
  const [cronograma, setCronograma] = useState(
    Array(7).fill(null).map(() => Array(16).fill(false))
  );
  const [uploadedFile, setUploadedFile] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  const updateField = (key, value) => setFormData({ ...formData, [key]: value });
  const updateActividad = (index, value) => {
    const copy = [...actividades];
    copy[index] = value;
    setActividades(copy);
  };
  const toggleCronograma = (row, col) => {
    const copy = cronograma.map((r) => [...r]);
    copy[row][col] = !copy[row][col];
    setCronograma(copy);
  };
  const toggleInduccion = (col) => {
    const copy = [...induccion];
    copy[col] = !copy[col];
    setInduccion(copy);
  };

  const selectFile = () => {
    if (!globalThis?.document?.createElement) {
      Alert.alert("Seleccionar archivo", "La selección de archivos está disponible en la versión web.");
      return;
    }
    const input = globalThis.document.createElement("input");
    input.type = "file";
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
    setSavedAt(new Date().toLocaleString());
    Alert.alert("Reporte subido", "El reporte preliminar fue subido correctamente y queda pendiente de revisión por tu asesor.");
  };

  const fuentes = [
    { id: "banco", label: "Banco de Proyectos", icon: "database" },
    { id: "propia", label: "Propuesta Propia", icon: "user" },
    { id: "empresa", label: "Propuesta Organización o Empresa", icon: "briefcase" },
  ];

  return (
    <ScrollView>
      {/* Header */}
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

      {/* Fuente del Proyecto */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", color: C.text, marginBottom: 14 }}>Fuente del Proyecto</Text>
        <Row style={{ gap: 12 }}>
          {fuentes.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFuenteProyecto(f.id)}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: fuenteProyecto === f.id ? C.teal : C.border,
                backgroundColor: fuenteProyecto === f.id ? C.tealLight : "white",
                alignItems: "center",
                gap: 8,
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: fuenteProyecto === f.id ? C.teal : C.bg, alignItems: "center", justifyContent: "center" }}>
                <Feather name={f.icon} size={18} color={fuenteProyecto === f.id ? "white" : C.textMuted} />
              </View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: fuenteProyecto === f.id ? C.teal : C.textMuted, textAlign: "center" }}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </Row>
      </Card>

      {/* Datos del Proyecto */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", color: C.text, marginBottom: 14 }}>Datos del Proyecto</Text>
        <FormField label="Nombre del Proyecto" value={formData.nombreProyecto} onChange={(v) => updateField("nombreProyecto", v)} placeholder="Ej: Sistema de gestión de inventarios" />
        <FormField label="Empresa" value={formData.empresa} onChange={(v) => updateField("empresa", v)} placeholder="Ej: Telmex S.A. de C.V." />
        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="Periodo de Residencia" value={formData.periodoResidencia} onChange={(v) => updateField("periodoResidencia", v)} placeholder="Ej: Ago-Dic 2024" />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="No. de Alumnos" value={formData.numAlumnos} onChange={(v) => updateField("numAlumnos", v)} placeholder="1" />
          </View>
        </Row>
      </Card>

      {/* Datos de la Organización */}
      <Card style={{ marginBottom: 16 }}>
        <Row style={{ alignItems: "center", gap: 8, marginBottom: 14 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" }}>
            <Feather name="briefcase" size={14} color={C.blue} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>Datos de la Organización o Empresa</Text>
        </Row>
        <FormField label="Nombre de la Empresa" value={formData.nombreEmpresa} onChange={(v) => updateField("nombreEmpresa", v)} placeholder="Nombre de la organización" />
        <FormField label="Domicilio" value={formData.domicilioEmpresa} onChange={(v) => updateField("domicilioEmpresa", v)} placeholder="Dirección completa" />
        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="Red Social" value={formData.redSocialEmpresa} onChange={(v) => updateField("redSocialEmpresa", v)} placeholder="URL" />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="Sitio Web" value={formData.sitioWebEmpresa} onChange={(v) => updateField("sitioWebEmpresa", v)} placeholder="www.empresa.com" />
          </View>
        </Row>
        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="Teléfono" value={formData.telefonoEmpresa} onChange={(v) => updateField("telefonoEmpresa", v)} placeholder="Teléfono" />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="Extensión" value={formData.extensionEmpresa} onChange={(v) => updateField("extensionEmpresa", v)} placeholder="Ext." />
          </View>
        </Row>
        <FormField label="Asesor Externo" value={formData.asesorExterno} onChange={(v) => updateField("asesorExterno", v)} placeholder="Nombre del asesor en la empresa" />
        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="Contacto" value={formData.contactoExterno} onChange={(v) => updateField("contactoExterno", v)} placeholder="Email o teléfono" />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="Puesto" value={formData.puestoExterno} onChange={(v) => updateField("puestoExterno", v)} placeholder="Cargo" />
          </View>
        </Row>
        <FormField label="Asesor Interno (Propuesta)" value={formData.asesorInterno} onChange={(v) => updateField("asesorInterno", v)} placeholder="Nombre del asesor interno propuesto" />
        <Text style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", marginTop: 4 }}>
          *La asignación final del asesor es responsabilidad del jefe del Dpto. Académico
        </Text>
      </Card>

      {/* Actividades */}
      <Card style={{ marginBottom: 16 }}>
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
              style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: C.border, fontSize: 13, color: C.text, backgroundColor: "#FAFAFA" }}
            />
          </Row>
        ))}
        <TouchableOpacity
          onPress={() => setActividades([...actividades, ""])}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingVertical: 8 }}
        >
          <Feather name="plus-circle" size={14} color={C.teal} />
          <Text style={{ fontSize: 12, fontWeight: "700", color: C.teal }}>Agregar actividad</Text>
        </TouchableOpacity>
      </Card>

      {/* Cronograma */}
      <Card style={{ marginBottom: 16 }}>
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
            {/* Fila Inducción */}
            <Row style={{ borderTopWidth: 1, borderTopColor: C.borderLight }}>
              <View style={{ width: 140, padding: 6, justifyContent: "center" }}>
                <Text style={{ fontSize: 11, color: C.textSub }} numberOfLines={1}>Inducción</Text>
              </View>
              {Array.from({ length: 16 }, (_, col) => (
                <TouchableOpacity key={col} onPress={() => toggleInduccion(col)} style={{ width: 32, height: 28, alignItems: "center", justifyContent: "center" }}>
                  <View style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: induccion[col] ? C.teal : C.bg, borderWidth: 1, borderColor: induccion[col] ? C.teal : C.border }}>
                    {induccion[col] && <Feather name="check" size={10} color="white" />}
                  </View>
                </TouchableOpacity>
              ))}
            </Row>
            {/* Filas de actividades */}
            {actividades.map((act, row) => (
              <Row key={row} style={{ borderTopWidth: 1, borderTopColor: C.borderLight }}>
                <View style={{ width: 140, padding: 6, justifyContent: "center" }}>
                  <Text style={{ fontSize: 11, color: C.textSub }} numberOfLines={1}>{act || `Actividad ${row + 1}`}</Text>
                </View>
                {Array.from({ length: 16 }, (_, col) => (
                  <TouchableOpacity key={col} onPress={() => toggleCronograma(row, col)} style={{ width: 32, height: 28, alignItems: "center", justifyContent: "center" }}>
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

      {/* Subir archivo */}
      <Card style={{ marginBottom: 16 }}>
        <Row style={{ alignItems: "center", gap: 8, marginBottom: 14 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" }}>
            <Feather name="upload-cloud" size={14} color={C.blue} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>Archivo del Reporte</Text>
        </Row>
        <TouchableOpacity
          onPress={selectFile}
          style={{ borderWidth: 2, borderStyle: "dashed", borderColor: uploadedFile ? C.teal : C.border, borderRadius: 12, padding: 24, alignItems: "center", backgroundColor: uploadedFile ? C.tealLighter : C.bg }}
        >
          <Feather name="upload-cloud" size={28} color={uploadedFile ? C.teal : C.textMuted} style={{ marginBottom: 8 }} />
          <Text style={{ fontSize: 13, fontWeight: "700", color: uploadedFile ? C.teal : C.text, marginBottom: 4 }}>
            {uploadedFile ? uploadedFile.name : "Seleccionar archivo"}
          </Text>
          <Text style={{ fontSize: 11, color: C.textMuted }}>
            {uploadedFile ? uploadedFile.size : "PDF, DOCX · máx 25 MB"}
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Confirmación de subida */}
      {savedAt && (
        <View
          style={{
            backgroundColor: C.greenLight,
            borderWidth: 1,
            borderColor: C.green,
            borderRadius: 10,
            padding: 12,
            marginBottom: 14,
          }}
        >
          <Row style={{ alignItems: "center", gap: 8 }}>
            <Feather name="check-circle" size={16} color={C.green} />
            <Text style={{ fontSize: 12, color: C.green, fontWeight: "700" }}>
              Reporte subido: {savedAt}
            </Text>
          </Row>
        </View>
      )}

      {/* Botón subir reporte */}
      <TouchableOpacity
        onPress={uploadReport}
        style={{ backgroundColor: C.teal, borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 40 }}
      >
        <Row style={{ alignItems: "center", gap: 8 }}>
          <Feather name="upload-cloud" size={18} color="white" />
          <Text style={{ color: "white", fontWeight: "800", fontSize: 15 }}>Subir Reporte Preliminar</Text>
        </Row>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Componente auxiliar para campos de formulario
function FormField({ label, value, onChange, placeholder, multiline }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: C.textSub, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={C.textLight}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={{
          padding: 11,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: C.border,
          fontSize: 13,
          color: C.text,
          backgroundColor: "#FAFAFA",
          ...(multiline ? { minHeight: 90, textAlignVertical: "top" } : {}),
        }}
      />
    </View>
  );
}
