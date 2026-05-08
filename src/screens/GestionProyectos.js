import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Badge } from "../components";

const INITIAL_COLUMNS = [
  {
    id: "propuesto", label: "Propuesto", color: C.blue, bg: C.blueLight,
    cards: [
      { title: "App de Logística Interna",   company: "AutoParts Globales",   companyIcon: "truck",     student: "C.R", studentBg: "#7C3AED", priority: "Alta",  priorityColor: C.red,   priorityBg: C.redLight,   tags: ["React Native", "Node.js"]       },
      { title: "Plataforma de E-learning",   company: "EduTech Innovación",   companyIcon: "book-open", student: "M.G", studentBg: "#0891B2", priority: "Media", priorityColor: C.amber, priorityBg: C.amberLight, tags: ["Vue.js", "Firebase"]             },
    ],
  },
  {
    id: "desarrollo", label: "En Desarrollo", color: C.amber, bg: C.amberLight,
    cards: [
      { title: "Sistema ERP Módulo RRHH",    company: "Grupo Industrial MX",  companyIcon: "tool",      student: "A.L", studentBg: "#059669", priority: "Alta",  priorityColor: C.red,   priorityBg: C.redLight,   tags: ["Python", "Django", "PostgreSQL"] },
      { title: "Portal de Clientes Web",     company: "Tecnológica del Norte", companyIcon: "cpu",      student: "J.P", studentBg: "#DC2626", priority: "Media", priorityColor: C.amber, priorityBg: C.amberLight, tags: ["React", "GraphQL"]               },
      { title: "Automatización de Reportes", company: "BioFarma México",       companyIcon: "activity", student: "L.V", studentBg: "#7C3AED", priority: "Baja",  priorityColor: C.green, priorityBg: C.greenLight, tags: ["Python", "Excel API"]            },
    ],
  },
  {
    id: "revision", label: "En Revisión", color: C.purple, bg: C.purpleLight,
    cards: [
      { title: "App Inventarios Móvil",      company: "Constructora Peña",    companyIcon: "home",      student: "R.M", studentBg: "#0891B2", priority: "Alta",  priorityColor: C.red,   priorityBg: C.redLight,   tags: ["Flutter", "SQLite"]              },
      { title: "Dashboard BI Financiero",    company: "SoftSolutions SA",     companyIcon: "code",      student: "K.F", studentBg: "#D97706", priority: "Media", priorityColor: C.amber, priorityBg: C.amberLight, tags: ["Power BI", "SQL Server"]         },
    ],
  },
  {
    id: "concluido", label: "Concluido", color: C.green, bg: C.greenLight,
    cards: [
      { title: "Rediseño UI/UX Tienda",      company: "Tecnológica del Norte", companyIcon: "cpu",      student: "S.H", studentBg: "#059669", priority: "Baja",  priorityColor: C.green, priorityBg: C.greenLight, tags: ["Figma", "React"]                 },
      { title: "Integración API Pagos",      company: "AutoParts Globales",   companyIcon: "truck",     student: "N.T", studentBg: "#DC2626", priority: "Alta",  priorityColor: C.red,   priorityBg: C.redLight,   tags: ["Stripe", "Node.js"]              },
    ],
  },
];

const EMPTY_FORM = { title: "", company: "", student: "", priority: "Media", tags: "", targetCol: "propuesto" };

export default function GestionProyectos() {
  const [columns, setColumns]     = useState(INITIAL_COLUMNS);
  const [active, setActive]       = useState(null);
  const [modalVisible, setModal]  = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);

  const priorityOpts = [
    { label: "Alta",  color: C.red,   bg: C.redLight   },
    { label: "Media", color: C.amber, bg: C.amberLight },
    { label: "Baja",  color: C.green, bg: C.greenLight },
  ];

  const openModal = (colId = "propuesto") => {
    setForm({ ...EMPTY_FORM, targetCol: colId });
    setModal(true);
  };

  const saveProject = () => {
    if (!form.title.trim()) return;
    const pOpt = priorityOpts.find((p) => p.label === form.priority) || priorityOpts[1];
    const newCard = {
      title: form.title.trim(),
      company: form.company.trim() || "Sin empresa",
      companyIcon: "briefcase",
      student: (form.student.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)) || "??",
      studentBg: C.teal,
      priority: pOpt.label,
      priorityColor: pOpt.color,
      priorityBg: pOpt.bg,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setColumns((prev) =>
      prev.map((col) =>
        col.id === form.targetCol ? { ...col, cards: [...col.cards, newCard] } : col
      )
    );
    setModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>

        {/* Header */}
        <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Gestión de Proyectos</Text>
            <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
              Tablero Kanban · {columns.reduce((acc, c) => acc + c.cards.length, 0)} proyectos
            </Text>
          </View>
          <Row style={{ gap: 10 }}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 9, backgroundColor: C.card }}>
              <Feather name="filter" size={13} color={C.textMuted} />
              <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: "600" }}>Filtrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openModal("propuesto")}
              style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.teal, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 9 }}
            >
              <Feather name="plus" size={14} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>Nuevo Proyecto</Text>
            </TouchableOpacity>
          </Row>
        </Row>

        {/* Kanban Board */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Row style={{ gap: 14, alignItems: "flex-start" }}>
            {columns.map((col) => (
              <View key={col.id} style={{ width: 260, backgroundColor: "#F8FAFC", borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>

                {/* Column Header */}
                <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.card }}>
                  <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Row style={{ alignItems: "center", gap: 8 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: col.color }} />
                      <Text style={{ fontSize: 13, fontWeight: "800", color: C.text }}>{col.label}</Text>
                    </Row>
                    <View style={{ backgroundColor: col.bg, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: col.color }}>{col.cards.length}</Text>
                    </View>
                  </Row>
                </View>

                {/* Cards */}
                <View style={{ padding: 10, gap: 10 }}>
                  {col.cards.map((card, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setActive(active === `${col.id}-${i}` ? null : `${col.id}-${i}`)}
                      activeOpacity={0.85}
                      style={{ backgroundColor: C.card, borderRadius: 11, borderWidth: 1, borderColor: active === `${col.id}-${i}` ? col.color : C.border, padding: 14 }}
                    >
                      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <Badge text={card.priority} color={card.priorityColor} bg={card.priorityBg} />
                        <Feather name="more-horizontal" size={14} color={C.textLight} />
                      </Row>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: C.text, marginBottom: 10, lineHeight: 18 }}>{card.title}</Text>
                      <Row style={{ flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                        {card.tags.map((tag, ti) => (
                          <View key={ti} style={{ backgroundColor: C.bg, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: C.border }}>
                            <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: "600" }}>{tag}</Text>
                          </View>
                        ))}
                      </Row>
                      <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Row style={{ alignItems: "center", gap: 6 }}>
                          <View style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: C.tealLight, alignItems: "center", justifyContent: "center" }}>
                            <Feather name={card.companyIcon} size={11} color={C.teal} />
                          </View>
                          <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: "600" }} numberOfLines={1}>{card.company}</Text>
                        </Row>
                        <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: card.studentBg, alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ fontSize: 9, color: "white", fontWeight: "800" }}>{card.student}</Text>
                        </View>
                      </Row>
                    </TouchableOpacity>
                  ))}

                  {/* Botón Agregar en columna */}
                  <TouchableOpacity
                    onPress={() => openModal(col.id)}
                    style={{ borderWidth: 1.5, borderColor: C.border, borderStyle: "dashed", borderRadius: 10, padding: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                  >
                    <Feather name="plus" size={13} color={C.textLight} />
                    <Text style={{ fontSize: 12, color: C.textLight, fontWeight: "600" }}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Row>
        </ScrollView>
      </ScrollView>

      {/* ── Modal Nuevo Proyecto ── */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" }}
          onPress={() => setModal(false)}
        >
          <Pressable
            style={{ width: 480, backgroundColor: C.card, borderRadius: 16, padding: 28, borderWidth: 1, borderColor: C.border }}
            onPress={() => {}}
          >
            {/* Modal Header */}
            <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>Nuevo Proyecto</Text>
              <TouchableOpacity onPress={() => setModal(false)}>
                <Feather name="x" size={20} color={C.textMuted} />
              </TouchableOpacity>
            </Row>

            {/* Columna destino */}
            <Text style={{ fontSize: 12, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Columna</Text>
            <Row style={{ gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {INITIAL_COLUMNS.map((col) => (
                <TouchableOpacity
                  key={col.id}
                  onPress={() => setForm({ ...form, targetCol: col.id })}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: form.targetCol === col.id ? col.color : C.border, backgroundColor: form.targetCol === col.id ? col.bg : "transparent" }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: form.targetCol === col.id ? col.color : C.textMuted }}>{col.label}</Text>
                </TouchableOpacity>
              ))}
            </Row>

            {/* Título */}
            {[
              ["Título del proyecto *", "title",   "Ej: Sistema de Inventarios", false],
              ["Empresa",              "company", "Ej: Telmex",                  false],
              ["Residente",            "student", "Ej: Ana García",              false],
              ["Tecnologías (separadas por coma)", "tags", "Ej: React, Node.js, MySQL", false],
            ].map(([label, key, ph]) => (
              <View key={key} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</Text>
                <TextInput
                  value={form[key]}
                  onChangeText={(v) => setForm({ ...form, [key]: v })}
                  placeholder={ph}
                  placeholderTextColor={C.textLight}
                  style={{ padding: 10, borderRadius: 8, borderWidth: 1, borderColor: C.border, fontSize: 13, color: C.text, backgroundColor: "#FAFAFA" }}
                />
              </View>
            ))}

            {/* Prioridad */}
            <Text style={{ fontSize: 12, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Prioridad</Text>
            <Row style={{ gap: 8, marginBottom: 22 }}>
              {priorityOpts.map(({ label, color, bg }) => (
                <TouchableOpacity
                  key={label}
                  onPress={() => setForm({ ...form, priority: label })}
                  style={{ flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, borderColor: form.priority === label ? color : C.border, backgroundColor: form.priority === label ? bg : "transparent", alignItems: "center" }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "700", color: form.priority === label ? color : C.textMuted }}>{label}</Text>
                </TouchableOpacity>
              ))}
            </Row>

            {/* Botones */}
            <Row style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{ flex: 1, paddingVertical: 11, borderRadius: 9, borderWidth: 1, borderColor: C.border, alignItems: "center" }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: C.textMuted }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveProject}
                style={{ flex: 2, paddingVertical: 11, borderRadius: 9, backgroundColor: C.teal, alignItems: "center" }}
              >
                <Text style={{ fontSize: 14, fontWeight: "700", color: "white" }}>Crear Proyecto</Text>
              </TouchableOpacity>
            </Row>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
