import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Badge } from "../components";

const COLUMNS = [
  {
    id: "propuesto",
    label: "Propuesto",
    color: C.blue,
    bg: C.blueLight,
    cards: [
      {
        title: "App de Logística Interna",
        company: "AutoParts Globales",
        companyIcon: "truck",
        student: "C.R",
        studentBg: "#7C3AED",
        priority: "Alta",
        priorityColor: C.red,
        priorityBg: C.redLight,
        tags: ["React Native", "Node.js"],
      },
      {
        title: "Plataforma de E-learning",
        company: "EduTech Innovación",
        companyIcon: "book-open",
        student: "M.G",
        studentBg: "#0891B2",
        priority: "Media",
        priorityColor: C.amber,
        priorityBg: C.amberLight,
        tags: ["Vue.js", "Firebase"],
      },
    ],
  },
  {
    id: "desarrollo",
    label: "En Desarrollo",
    color: C.amber,
    bg: C.amberLight,
    cards: [
      {
        title: "Sistema ERP Módulo RRHH",
        company: "Grupo Industrial MX",
        companyIcon: "tool",
        student: "A.L",
        studentBg: "#059669",
        priority: "Alta",
        priorityColor: C.red,
        priorityBg: C.redLight,
        tags: ["Python", "Django", "PostgreSQL"],
      },
      {
        title: "Portal de Clientes Web",
        company: "Tecnológica del Norte",
        companyIcon: "cpu",
        student: "J.P",
        studentBg: "#DC2626",
        priority: "Media",
        priorityColor: C.amber,
        priorityBg: C.amberLight,
        tags: ["React", "GraphQL"],
      },
      {
        title: "Automatización de Reportes",
        company: "BioFarma México",
        companyIcon: "activity",
        student: "L.V",
        studentBg: "#7C3AED",
        priority: "Baja",
        priorityColor: C.green,
        priorityBg: C.greenLight,
        tags: ["Python", "Excel API"],
      },
    ],
  },
  {
    id: "revision",
    label: "En Revisión",
    color: C.purple,
    bg: C.purpleLight,
    cards: [
      {
        title: "App Inventarios Móvil",
        company: "Constructora Peña",
        companyIcon: "home",
        student: "R.M",
        studentBg: "#0891B2",
        priority: "Alta",
        priorityColor: C.red,
        priorityBg: C.redLight,
        tags: ["Flutter", "SQLite"],
      },
      {
        title: "Dashboard BI Financiero",
        company: "SoftSolutions SA",
        companyIcon: "code",
        student: "K.F",
        studentBg: "#D97706",
        priority: "Media",
        priorityColor: C.amber,
        priorityBg: C.amberLight,
        tags: ["Power BI", "SQL Server"],
      },
    ],
  },
  {
    id: "concluido",
    label: "Concluido",
    color: C.green,
    bg: C.greenLight,
    cards: [
      {
        title: "Rediseño UI/UX Tienda",
        company: "Tecnológica del Norte",
        companyIcon: "cpu",
        student: "S.H",
        studentBg: "#059669",
        priority: "Baja",
        priorityColor: C.green,
        priorityBg: C.greenLight,
        tags: ["Figma", "React"],
      },
      {
        title: "Integración API Pagos",
        company: "AutoParts Globales",
        companyIcon: "truck",
        student: "N.T",
        studentBg: "#DC2626",
        priority: "Alta",
        priorityColor: C.red,
        priorityBg: C.redLight,
        tags: ["Stripe", "Node.js"],
      },
    ],
  },
];

export default function GestionProyectos() {
  const [active, setActive] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Gestión de Proyectos</Text>
            <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Tablero Kanban · 9 proyectos activos</Text>
          </View>
          <Row style={{ gap: 10 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderWidth: 1,
                borderColor: C.border,
                paddingHorizontal: 12,
                paddingVertical: 9,
                borderRadius: 9,
                backgroundColor: C.card,
              }}
            >
              <Feather name="filter" size={13} color={C.textMuted} />
              <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: "600" }}>Filtrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: C.teal,
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 9,
              }}
            >
              <Feather name="plus" size={14} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>Nuevo Proyecto</Text>
            </TouchableOpacity>
          </Row>
        </Row>

        {/* Kanban Board */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Row style={{ gap: 14, alignItems: "flex-start" }}>
            {COLUMNS.map((col) => (
              <View
                key={col.id}
                style={{
                  width: 260,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: C.border,
                  overflow: "hidden",
                }}
              >
                {/* Column Header */}
                <View
                  style={{
                    padding: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: C.border,
                    backgroundColor: C.card,
                  }}
                >
                  <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Row style={{ alignItems: "center", gap: 8 }}>
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: col.color,
                        }}
                      />
                      <Text style={{ fontSize: 13, fontWeight: "800", color: C.text }}>{col.label}</Text>
                    </Row>
                    <View
                      style={{
                        backgroundColor: col.bg,
                        borderRadius: 20,
                        paddingHorizontal: 9,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "700", color: col.color }}>
                        {col.cards.length}
                      </Text>
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
                      style={{
                        backgroundColor: C.card,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: active === `${col.id}-${i}` ? col.color : C.border,
                        padding: 14,
                        shadowColor: "#000",
                        shadowOpacity: 0.04,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                      }}
                    >
                      {/* Priority Badge */}
                      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <Badge
                          text={card.priority}
                          color={card.priorityColor}
                          bg={card.priorityBg}
                        />
                        <TouchableOpacity>
                          <Feather name="more-horizontal" size={14} color={C.textLight} />
                        </TouchableOpacity>
                      </Row>

                      {/* Title */}
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: C.text,
                          marginBottom: 10,
                          lineHeight: 18,
                        }}
                      >
                        {card.title}
                      </Text>

                      {/* Tags */}
                      <Row style={{ flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                        {card.tags.map((tag, ti) => (
                          <View
                            key={ti}
                            style={{
                              backgroundColor: C.bg,
                              borderRadius: 5,
                              paddingHorizontal: 7,
                              paddingVertical: 2,
                              borderWidth: 1,
                              borderColor: C.border,
                            }}
                          >
                            <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: "600" }}>{tag}</Text>
                          </View>
                        ))}
                      </Row>

                      {/* Footer: company + student */}
                      <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Row style={{ alignItems: "center", gap: 6 }}>
                          <View
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 6,
                              backgroundColor: C.tealLight,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Feather name={card.companyIcon} size={11} color={C.teal} />
                          </View>
                          <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: "600" }} numberOfLines={1}>
                            {card.company}
                          </Text>
                        </Row>
                        {/* Student avatar */}
                        <View
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: card.studentBg,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontSize: 9, color: "white", fontWeight: "800" }}>{card.student}</Text>
                        </View>
                      </Row>
                    </TouchableOpacity>
                  ))}

                  {/* Add card button */}
                  <TouchableOpacity
                    style={{
                      borderWidth: 1.5,
                      borderColor: C.border,
                      borderStyle: "dashed",
                      borderRadius: 10,
                      padding: 10,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 6,
                    }}
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
    </View>
  );
}
