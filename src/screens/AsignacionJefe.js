import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, Badge } from "../components";

const ASESORES = [
  { id: "a1", nombre: "Dr. Martínez",  departamento: "Sistemas", activos: 4 },
  { id: "a2", nombre: "Dra. López",    departamento: "Sistemas", activos: 3 },
  { id: "a3", nombre: "Dr. Herrera",   departamento: "Sistemas", activos: 2 },
  { id: "a4", nombre: "Dra. Sánchez",  departamento: "Sistemas", activos: 1 },
  { id: "a5", nombre: "Dr. Ramírez",   departamento: "Sistemas", activos: 0 },
];

const EMPRESAS = ["Telmex", "Pemex", "CFE", "BioFarma México", "AutoParts Globales", "EduTech Innovación", "Constructora Peña", "SoftSolutions SA", "Tecnológica del Norte", "Grupo Industrial MX"];

const RESIDENTES_DISPONIBLES = [
  { id: "r1", nombre: "Sofia Hernández",  matricula: "21CS001", carrera: "Ing. en Sistemas" },
  { id: "r2", nombre: "Diego Castillo",   matricula: "21CS014", carrera: "Ing. en Sistemas" },
  { id: "r3", nombre: "Valentina Cruz",   matricula: "21CS027", carrera: "Ing. en Sistemas" },
  { id: "r4", nombre: "Miguel Torres",    matricula: "22CS003", carrera: "Ing. en Sistemas" },
  { id: "r5", nombre: "Natalia Ramírez",  matricula: "22CS011", carrera: "Ing. en Sistemas" },
  { id: "r6", nombre: "Emiliano Vargas",  matricula: "22CS019", carrera: "Ing. en Sistemas" },
];

const PASO_LABELS = ["Proyecto", "Asesor", "Residente", "Confirmar"];

export default function AsignacionJefe() {
  const [paso, setPaso]                   = useState(0);
  const [proyecto, setProyecto]           = useState({ nombre: "", empresa: "", descripcion: "" });
  const [asesorId, setAsesorId]           = useState(null);
  const [residentesIds, setResidentesIds] = useState([]);
  const [asignaciones, setAsignaciones]   = useState([]);

  const asesorSel = ASESORES.find((a) => a.id === asesorId);

  const toggleResidente = (id) => {
    setResidentesIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const validarPaso = () => {
    if (paso === 0) {
      if (!proyecto.nombre.trim()) { Alert.alert("Falta información", "Ingresa el nombre del proyecto."); return; }
      if (!proyecto.empresa.trim()) { Alert.alert("Falta información", "Selecciona la empresa."); return; }
    }
    if (paso === 1 && !asesorId) { Alert.alert("Falta información", "Selecciona un asesor."); return; }
    if (paso === 2 && residentesIds.length === 0) { Alert.alert("Falta información", "Selecciona al menos un residente."); return; }
    setPaso((p) => p + 1);
  };

  const guardarAsignacion = () => {
    const nuevaAsignacion = {
      id: Date.now(),
      proyecto: proyecto.nombre,
      empresa: proyecto.empresa,
      descripcion: proyecto.descripcion,
      asesor: asesorSel?.nombre,
      residentes: residentesIds.map((id) => RESIDENTES_DISPONIBLES.find((r) => r.id === id)?.nombre),
      fecha: new Date().toLocaleDateString("es-MX"),
    };
    setAsignaciones((prev) => [nuevaAsignacion, ...prev]);
    // Reset
    setProyecto({ nombre: "", empresa: "", descripcion: "" });
    setAsesorId(null);
    setResidentesIds([]);
    setPaso(0);
    Alert.alert("Asignación guardada", `El proyecto "${nuevaAsignacion.proyecto}" ha sido asignado correctamente.`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Asignación de Proyectos</Text>
        <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Registra un nuevo proyecto y asigna asesor y residente(s)</Text>
      </View>

      {/* Stepper */}
      <Card style={{ marginBottom: 24, padding: 20 }}>
        <Row style={{ justifyContent: "center", alignItems: "center", gap: 0 }}>
          {PASO_LABELS.map((label, i) => (
            <Row key={i} style={{ alignItems: "center", flex: i < PASO_LABELS.length - 1 ? 1 : undefined }}>
              <View style={{ alignItems: "center" }}>
                <View style={{
                  width: 36, height: 36, borderRadius: 18,
                  backgroundColor: i < paso ? C.teal : i === paso ? C.navy : C.bg,
                  borderWidth: i === paso ? 3 : 0, borderColor: C.teal,
                  alignItems: "center", justifyContent: "center",
                }}>
                  {i < paso
                    ? <Feather name="check" size={16} color="white" />
                    : <Text style={{ fontSize: 13, fontWeight: "800", color: i === paso ? C.teal : C.textMuted }}>{i + 1}</Text>
                  }
                </View>
                <Text style={{ fontSize: 10, fontWeight: i === paso ? "700" : "500", color: i === paso ? C.teal : i < paso ? C.green : C.textMuted, marginTop: 6, textAlign: "center" }}>
                  {label}
                </Text>
              </View>
              {i < PASO_LABELS.length - 1 && (
                <View style={{ flex: 1, height: 2, backgroundColor: i < paso ? C.teal : C.border, marginHorizontal: 8, marginBottom: 20 }} />
              )}
            </Row>
          ))}
        </Row>
      </Card>

      {/* ── Paso 0: Proyecto ── */}
      {paso === 0 && (
        <Card style={{ marginBottom: 20 }}>
          <Row style={{ alignItems: "center", gap: 10, marginBottom: 20 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" }}>
              <Feather name="folder-plus" size={18} color={C.blue} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }}>Datos del Proyecto</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>Proyecto aprobado para residencia profesional</Text>
            </View>
          </Row>

          <Field label="Nombre del Proyecto *" value={proyecto.nombre} onChangeText={(v) => setProyecto({ ...proyecto, nombre: v })} placeholder="Ej: Sistema de Gestión de Inventarios" />

          <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Empresa *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <Row style={{ gap: 8 }}>
              {EMPRESAS.map((emp) => (
                <TouchableOpacity
                  key={emp}
                  onPress={() => setProyecto({ ...proyecto, empresa: emp })}
                  style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: proyecto.empresa === emp ? C.teal : C.bg, borderWidth: 1, borderColor: proyecto.empresa === emp ? C.teal : C.border }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "600", color: proyecto.empresa === emp ? "white" : C.textMuted }}>{emp}</Text>
                </TouchableOpacity>
              ))}
            </Row>
          </ScrollView>
          {proyecto.empresa === "" && (
            <TextInput
              value={proyecto.empresa}
              onChangeText={(v) => setProyecto({ ...proyecto, empresa: v })}
              placeholder="O escribe el nombre de la empresa..."
              placeholderTextColor={C.textLight}
              style={{ padding: 11, borderRadius: 8, borderWidth: 1, borderColor: C.border, fontSize: 13, color: C.text, backgroundColor: "#FAFAFA", marginBottom: 16 }}
            />
          )}

          <Field label="Descripción del Proyecto" value={proyecto.descripcion} onChangeText={(v) => setProyecto({ ...proyecto, descripcion: v })} placeholder="Breve descripción del proyecto y sus objetivos..." multiline />
        </Card>
      )}

      {/* ── Paso 1: Asesor ── */}
      {paso === 1 && (
        <Card style={{ marginBottom: 20 }}>
          <Row style={{ alignItems: "center", gap: 10, marginBottom: 20 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.purpleLight, alignItems: "center", justifyContent: "center" }}>
              <Feather name="user-check" size={18} color={C.purple} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }}>Asignar Asesor</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>Proyecto: {proyecto.nombre}</Text>
            </View>
          </Row>

          <View style={{ gap: 10 }}>
            {ASESORES.map((a) => (
              <TouchableOpacity
                key={a.id}
                onPress={() => setAsesorId(a.id)}
                style={{ borderRadius: 12, borderWidth: 2, borderColor: asesorId === a.id ? C.teal : C.border, backgroundColor: asesorId === a.id ? C.tealLighter : C.card, padding: 16 }}
              >
                <Row style={{ alignItems: "center", gap: 14 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: asesorId === a.id ? C.teal : C.tealLight, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 14, fontWeight: "800", color: asesorId === a.id ? "white" : C.teal }}>
                      {a.nombre.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{a.nombre}</Text>
                    <Text style={{ fontSize: 12, color: C.textMuted }}>{a.departamento}</Text>
                  </View>
                  <Badge
                    text={`${a.activos} activos`}
                    color={a.activos >= 4 ? C.amber : C.green}
                    bg={a.activos >= 4 ? C.amberLight : C.greenLight}
                  />
                  {asesorId === a.id && (
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" }}>
                      <Feather name="check" size={13} color="white" />
                    </View>
                  )}
                </Row>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}

      {/* ── Paso 2: Residente ── */}
      {paso === 2 && (
        <Card style={{ marginBottom: 20 }}>
          <Row style={{ alignItems: "center", gap: 10, marginBottom: 20 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.greenLight, alignItems: "center", justifyContent: "center" }}>
              <Feather name="users" size={18} color={C.green} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }}>Asignar Residente(s)</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>Residentes sin proyecto asignado</Text>
            </View>
          </Row>

          {residentesIds.length > 0 && (
            <View style={{ backgroundColor: C.tealLighter, borderRadius: 8, padding: 10, marginBottom: 14 }}>
              <Text style={{ fontSize: 12, color: C.teal, fontWeight: "600" }}>
                {residentesIds.length} residente(s) seleccionado(s)
              </Text>
            </View>
          )}

          <View style={{ gap: 10 }}>
            {RESIDENTES_DISPONIBLES.map((r) => {
              const sel = residentesIds.includes(r.id);
              return (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => toggleResidente(r.id)}
                  style={{ borderRadius: 12, borderWidth: 2, borderColor: sel ? C.teal : C.border, backgroundColor: sel ? C.tealLighter : C.card, padding: 14 }}
                >
                  <Row style={{ alignItems: "center", gap: 12 }}>
                    <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: sel ? C.teal : C.tealLight, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 12, fontWeight: "800", color: sel ? "white" : C.teal }}>
                        {r.nombre.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{r.nombre}</Text>
                      <Text style={{ fontSize: 11, color: C.textMuted }}>{r.matricula} · {r.carrera}</Text>
                    </View>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: sel ? C.teal : C.bg, borderWidth: sel ? 0 : 1.5, borderColor: C.border, alignItems: "center", justifyContent: "center" }}>
                      {sel && <Feather name="check" size={12} color="white" />}
                    </View>
                  </Row>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>
      )}

      {/* ── Paso 3: Confirmación ── */}
      {paso === 3 && (
        <Card style={{ marginBottom: 20, borderWidth: 2, borderColor: C.teal }}>
          <Row style={{ alignItems: "center", gap: 10, marginBottom: 20 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.tealLight, alignItems: "center", justifyContent: "center" }}>
              <Feather name="check-circle" size={18} color={C.teal} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }}>Confirmar Asignación</Text>
          </Row>

          {[
            { label: "Proyecto",    value: proyecto.nombre,        icon: "folder"     },
            { label: "Empresa",     value: proyecto.empresa,       icon: "briefcase"  },
            { label: "Asesor",      value: asesorSel?.nombre,      icon: "user-check" },
            { label: "Residentes",  value: residentesIds.map((id) => RESIDENTES_DISPONIBLES.find((r) => r.id === id)?.nombre).join(", "), icon: "users" },
          ].map((item, i) => (
            <Row key={i} style={{ alignItems: "flex-start", gap: 12, paddingVertical: 12, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: C.border }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.tealLight, alignItems: "center", justifyContent: "center" }}>
                <Feather name={item.icon} size={15} color={C.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.4 }}>{item.label}</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: C.text, marginTop: 2 }}>{item.value}</Text>
              </View>
            </Row>
          ))}

          {proyecto.descripcion.trim() !== "" && (
            <View style={{ marginTop: 12, backgroundColor: C.bg, borderRadius: 8, padding: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, marginBottom: 4 }}>DESCRIPCIÓN</Text>
              <Text style={{ fontSize: 13, color: C.textSub, lineHeight: 19 }}>{proyecto.descripcion}</Text>
            </View>
          )}
        </Card>
      )}

      {/* Navegación */}
      <Row style={{ gap: 12, marginBottom: 24 }}>
        {paso > 0 && (
          <TouchableOpacity onPress={() => setPaso((p) => p - 1)} style={{ flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}>
            <Feather name="arrow-left" size={15} color={C.textMuted} />
            <Text style={{ fontSize: 14, fontWeight: "600", color: C.textMuted }}>Anterior</Text>
          </TouchableOpacity>
        )}
        {paso < 3 ? (
          <TouchableOpacity onPress={validarPaso} style={{ flex: 2, paddingVertical: 13, borderRadius: 10, backgroundColor: C.teal, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "white" }}>Siguiente</Text>
            <Feather name="arrow-right" size={15} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={guardarAsignacion} style={{ flex: 2, paddingVertical: 13, borderRadius: 10, backgroundColor: C.teal, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}>
            <Feather name="check" size={16} color="white" />
            <Text style={{ fontSize: 14, fontWeight: "700", color: "white" }}>Guardar Asignación</Text>
          </TouchableOpacity>
        )}
      </Row>

      {/* Historial de asignaciones */}
      {asignaciones.length > 0 && (
        <>
          <Text style={{ fontSize: 13, fontWeight: "800", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Asignaciones Recientes</Text>
          <View style={{ gap: 10 }}>
            {asignaciones.map((a) => (
              <Card key={a.id} style={{ padding: 14, borderLeftWidth: 4, borderLeftColor: C.teal }}>
                <Row style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: C.text, flex: 1 }}>{a.proyecto}</Text>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>{a.fecha}</Text>
                </Row>
                <Text style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{a.empresa} · Asesor: {a.asesor}</Text>
                <Text style={{ fontSize: 12, color: C.teal, fontWeight: "600" }}>Residentes: {a.residentes.join(", ")}</Text>
              </Card>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textLight}
        multiline={multiline}
        style={{
          padding: 11, borderRadius: 8, borderWidth: 1, borderColor: C.border,
          fontSize: 13, color: C.text, backgroundColor: "#FAFAFA",
          ...(multiline ? { minHeight: 80, textAlignVertical: "top" } : {}),
        }}
      />
    </View>
  );
}
