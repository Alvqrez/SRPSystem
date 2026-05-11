import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../../constants/colors";
import { Row, Card, Badge, ProgressBar } from "../../components";
import { useProyectos } from "../../context/ProyectosContext";

const PHASE_LABELS = { propuesto: "Propuesto", desarrollo: "En Desarrollo", revision: "En Revisión", concluido: "Concluido" };
const PHASE_COLORS = { propuesto: C.blue, desarrollo: C.amber, revision: C.purple, concluido: C.green };
const PRIORITY_OPTS = [
  { label: "Alta", color: C.red, bg: C.redLight },
  { label: "Media", color: C.amber, bg: C.amberLight },
  { label: "Baja", color: C.green, bg: C.greenLight },
];

const EMPTY_FORM = {
  title: "", company: "", residentesRequeridos: "2", residentesAsignados: "",
  habilidades: "", rolRequerido: "", descripcionAvance: "", priority: "Media",
};

export default function ProyectosAsesor() {
  const { proyectos, propuestas, addPropuesta, solicitarAvanceFase } = useProyectos() || { proyectos: [], propuestas: [] };
  const [modalVisible, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sortBy, setSortBy] = useState("proyecto"); // proyecto, residente, fase
  const [showSort, setShowSort] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const sortedProyectos = useMemo(() => {
    const arr = [...proyectos];
    if (sortBy === "proyecto") arr.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "residente") arr.sort((a, b) => (a.residentes[0]?.nombre || "").localeCompare(b.residentes[0]?.nombre || ""));
    else if (sortBy === "fase") {
      const order = ["propuesto", "desarrollo", "revision", "concluido"];
      arr.sort((a, b) => order.indexOf(a.phase) - order.indexOf(b.phase));
    }
    return arr;
  }, [proyectos, sortBy]);

  const handleProposal = () => {
    if (!form.title.trim()) { Alert.alert("Error", "Ingresa el nombre del proyecto."); return; }
    if (!form.company.trim()) { Alert.alert("Error", "Ingresa la empresa."); return; }

    const asignados = form.residentesAsignados.split(",").map((s) => s.trim()).filter(Boolean).map((n) => ({
      nombre: n,
      iniciales: n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
      rol: "Por definir",
    }));

    addPropuesta({
      title: form.title.trim(),
      company: form.company.trim(),
      priority: form.priority,
      residentesRequeridos: parseInt(form.residentesRequeridos) || 2,
      residentesAsignados: asignados,
      residentesFaltantes: Math.max(0, (parseInt(form.residentesRequeridos) || 2) - asignados.length),
      habilidadesRequeridas: form.habilidades.split(",").map((s) => s.trim()).filter(Boolean),
      rolRequerido: form.rolRequerido.trim(),
      descripcionAvance: form.descripcionAvance.trim(),
      asesor: "Dr. Martínez",
      asesorId: "asesor1",
      fechaPropuesta: new Date().toISOString().slice(0, 10),
    });

    setModal(false);
    setForm(EMPTY_FORM);
    Alert.alert("Propuesta enviada", "Tu propuesta de proyecto ha sido enviada al Jefe de Vinculación para su aprobación.");
  };

  const handleSolicitarAvance = (proyectoId) => {
    if (solicitarAvanceFase) {
      solicitarAvanceFase(proyectoId);
      Alert.alert("Solicitud enviada", "Se ha notificado al Jefe de Vinculación para aprobar el avance de fase.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Mis Proyectos</Text>
            <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{proyectos.length} proyectos asignados · {propuestas.filter((p) => p.status === "Pendiente").length} propuestas pendientes</Text>
          </View>
          <Row style={{ gap: 10 }}>
            {/* Sort */}
            <View style={{ position: "relative" }}>
              <TouchableOpacity onPress={() => setShowSort(!showSort)} style={{ flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 9, backgroundColor: C.card }}>
                <Feather name="bar-chart-2" size={13} color={C.textMuted} />
                <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: "600" }}>Ordenar</Text>
              </TouchableOpacity>
              {showSort && (
                <View style={{ position: "absolute", top: 42, right: 0, width: 180, backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 10, zIndex: 50 }}>
                  {[{ id: "proyecto", label: "Nombre del proyecto" }, { id: "residente", label: "Nombre del residente" }, { id: "fase", label: "Fase del proyecto" }].map((opt) => (
                    <TouchableOpacity key={opt.id} onPress={() => { setSortBy(opt.id); setShowSort(false); }} style={{ paddingVertical: 7 }}>
                      <Text style={{ fontSize: 12, color: sortBy === opt.id ? C.teal : C.textSub, fontWeight: sortBy === opt.id ? "800" : "600" }}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            {/* New proposal */}
            <TouchableOpacity onPress={() => setModal(true)} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.teal, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 9 }}>
              <Feather name="plus" size={14} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>Proponer Proyecto</Text>
            </TouchableOpacity>
          </Row>
        </Row>

        {/* Propuestas Pendientes */}
        {propuestas.filter((p) => p.status === "Pendiente").length > 0 && (
          <Card style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: C.blue }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.text, marginBottom: 12 }}>Propuestas Pendientes de Aprobación</Text>
            {propuestas.filter((p) => p.status === "Pendiente").map((prop, i) => (
              <Row key={i} style={{ alignItems: "center", gap: 12, paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" }}>
                  <Feather name="clock" size={16} color={C.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: C.text }}>{prop.title}</Text>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>{prop.company} · Prioridad: {prop.priority}</Text>
                </View>
                <Badge text="Esperando aprobación" color={C.blue} bg={C.blueLight} />
              </Row>
            ))}
          </Card>
        )}

        {/* Project Cards */}
        <View style={{ gap: 16 }}>
          {sortedProyectos.map((p) => {
            const isExpanded = expanded === p.id;
            const pct = p.horasTotales > 0 ? Math.round((p.horasDocumentadas / p.horasTotales) * 100) : 0;
            const phaseColor = PHASE_COLORS[p.phase] || C.textMuted;
            const aprobados = p.reportes.filter((r) => r.status === "Aprobado").length;
            const totalReps = p.reportes.length;

            return (
              <Card key={p.id} style={{ padding: 0, overflow: "hidden" }}>
                <TouchableOpacity onPress={() => setExpanded(isExpanded ? null : p.id)} activeOpacity={0.9} style={{ padding: 18 }}>
                  <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View style={{ flex: 1 }}>
                      <Row style={{ alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <Badge text={PHASE_LABELS[p.phase]} color={phaseColor} bg={phaseColor + "22"} />
                        <Badge text={p.priority} color={PRIORITY_OPTS.find((o) => o.label === p.priority)?.color || C.amber} bg={PRIORITY_OPTS.find((o) => o.label === p.priority)?.bg || C.amberLight} />
                      </Row>
                      <Text style={{ fontSize: 16, fontWeight: "700", color: C.text }}>{p.title}</Text>
                      <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{p.company}</Text>
                    </View>
                    <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={C.textMuted} />
                  </Row>

                  {/* Progress bar */}
                  <View style={{ marginTop: 14 }}>
                    <Row style={{ justifyContent: "space-between", marginBottom: 4 }}>
                      <Text style={{ fontSize: 11, color: C.textMuted }}>Progreso: {p.horasDocumentadas}/{p.horasTotales} hrs</Text>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: C.teal }}>{pct}%</Text>
                    </Row>
                    <ProgressBar pct={pct} color={C.teal} />
                  </View>

                  {/* Residentes pills */}
                  <Row style={{ marginTop: 12, gap: 8, flexWrap: "wrap" }}>
                    {p.residentes.map((r, ri) => (
                      <Row key={ri} style={{ alignItems: "center", gap: 5, backgroundColor: C.tealLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ fontSize: 8, color: "white", fontWeight: "800" }}>{r.iniciales}</Text>
                        </View>
                        <Text style={{ fontSize: 11, color: C.teal, fontWeight: "600" }}>{r.nombre}</Text>
                      </Row>
                    ))}
                    {p.residentes.length < p.residentesRequeridos && (
                      <Row style={{ alignItems: "center", gap: 4, backgroundColor: C.amberLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                        <Feather name="user-plus" size={10} color={C.amber} />
                        <Text style={{ fontSize: 11, color: C.amber, fontWeight: "600" }}>Faltan {p.residentesRequeridos - p.residentes.length}</Text>
                      </Row>
                    )}
                  </Row>
                </TouchableOpacity>

                {/* Expanded details */}
                {isExpanded && (
                  <View style={{ paddingHorizontal: 18, paddingBottom: 18, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 14 }}>
                    <Row style={{ gap: 16, marginBottom: 14 }}>
                      <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: 10, alignItems: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: "800", color: C.teal }}>{aprobados}/{totalReps}</Text>
                        <Text style={{ fontSize: 10, color: C.textMuted }}>Reportes aprobados</Text>
                      </View>
                      <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: 10, alignItems: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: "800", color: C.blue }}>{p.habilidades.length}</Text>
                        <Text style={{ fontSize: 10, color: C.textMuted }}>Tecnologías</Text>
                      </View>
                      <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: 10, alignItems: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: "800", color: C.purple }}>{p.reuniones.length}</Text>
                        <Text style={{ fontSize: 10, color: C.textMuted }}>Reuniones</Text>
                      </View>
                    </Row>

                    {/* Tech tags */}
                    <Row style={{ flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {p.habilidades.map((h, hi) => (
                        <View key={hi} style={{ backgroundColor: C.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: C.border }}>
                          <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: "600" }}>{h}</Text>
                        </View>
                      ))}
                    </Row>

                    {/* Actions */}
                    <Row style={{ gap: 10 }}>
                      <TouchableOpacity
                        onPress={() => handleSolicitarAvance(p.id)}
                        disabled={p.phase === "concluido" || p.solicitudAvance}
                        style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: p.solicitudAvance ? C.textLight : C.teal, opacity: p.phase === "concluido" ? 0.5 : 1 }}
                      >
                        <Feather name="arrow-right-circle" size={14} color={p.solicitudAvance ? C.textLight : C.teal} />
                        <Text style={{ fontSize: 12, fontWeight: "600", color: p.solicitudAvance ? C.textLight : C.teal }}>
                          {p.solicitudAvance ? "Solicitud enviada" : "Solicitar avance de fase"}
                        </Text>
                      </TouchableOpacity>
                    </Row>
                    {p.phase !== "concluido" && (
                      <Text style={{ fontSize: 10, color: C.textMuted, marginTop: 8, fontStyle: "italic", textAlign: "center" }}>
                        El avance de fase requiere aprobación del Jefe de Vinculación
                      </Text>
                    )}
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal: Proponer Proyecto */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" }} onPress={() => setModal(false)}>
          <Pressable style={{ width: 520, maxHeight: "85%", backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border }} onPress={() => {}}>
            <View style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>Proponer Nuevo Proyecto</Text>
                  <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Se enviará al Jefe de Vinculación para aprobación</Text>
                </View>
                <TouchableOpacity onPress={() => setModal(false)}>
                  <Feather name="x" size={20} color={C.textMuted} />
                </TouchableOpacity>
              </Row>
            </View>
            <ScrollView style={{ padding: 24 }}>
              {[
                ["Nombre del proyecto *", "title", "Ej: Sistema de Control de Calidad"],
                ["Empresa *", "company", "Ej: Industrias del Norte S.A."],
                ["Residentes asignados (separados por coma)", "residentesAsignados", "Ej: Juan Pérez, María López"],
                ["Residentes requeridos (número)", "residentesRequeridos", "Ej: 3"],
                ["Habilidades/tecnologías requeridas (separadas por coma)", "habilidades", "Ej: React, Node.js, MongoDB"],
                ["Rol o perfil deseado para faltantes", "rolRequerido", "Ej: Backend Developer con experiencia en APIs REST"],
              ].map(([label, key, ph]) => (
                <View key={key} style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>{label}</Text>
                  <TextInput
                    value={form[key]}
                    onChangeText={(v) => setForm({ ...form, [key]: v })}
                    placeholder={ph}
                    placeholderTextColor={C.textLight}
                    style={{ padding: 11, borderRadius: 8, borderWidth: 1, borderColor: C.border, fontSize: 13, color: C.text, backgroundColor: "#FAFAFA" }}
                  />
                </View>
              ))}

              {/* Avances */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>Descripción de avances del proyecto</Text>
                <TextInput
                  value={form.descripcionAvance}
                  onChangeText={(v) => setForm({ ...form, descripcionAvance: v })}
                  placeholder="Describe los avances que tiene el proyecto hasta el momento..."
                  placeholderTextColor={C.textLight}
                  multiline
                  style={{ padding: 11, borderRadius: 8, borderWidth: 1, borderColor: C.border, fontSize: 13, color: C.text, backgroundColor: "#FAFAFA", minHeight: 80, textAlignVertical: "top" }}
                />
              </View>

              {/* Prioridad */}
              <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>Prioridad</Text>
              <Row style={{ gap: 8, marginBottom: 22 }}>
                {PRIORITY_OPTS.map(({ label, color, bg }) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() => setForm({ ...form, priority: label })}
                    style={{ flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, borderColor: form.priority === label ? color : C.border, backgroundColor: form.priority === label ? bg : "transparent", alignItems: "center" }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: "700", color: form.priority === label ? color : C.textMuted }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </Row>

              {/* Buttons */}
              <Row style={{ gap: 10, marginBottom: 10 }}>
                <TouchableOpacity onPress={() => setModal(false)} style={{ flex: 1, paddingVertical: 11, borderRadius: 9, borderWidth: 1, borderColor: C.border, alignItems: "center" }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: C.textMuted }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleProposal} style={{ flex: 2, paddingVertical: 11, borderRadius: 9, backgroundColor: C.teal, alignItems: "center" }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "white" }}>Enviar Propuesta</Text>
                </TouchableOpacity>
              </Row>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
