import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, StatCard, Badge } from "../components";

const COMPANIES = [
  { name: "Tecnológica del Norte", sector: "Tecnología", ciudad: "Monterrey", residentes: 3, convenio: "2024-12-31", status: "Activa" },
  { name: "Grupo Industrial MX", sector: "Manufactura", ciudad: "Guadalajara", residentes: 5, convenio: "2025-06-30", status: "Activa" },
  { name: "SoftSolutions SA", sector: "Software", ciudad: "CDMX", residentes: 2, convenio: "2024-11-15", status: "Por Vencer" },
  { name: "Constructora Peña", sector: "Construcción", ciudad: "Monterrey", residentes: 4, convenio: "2025-03-20", status: "Activa" },
  { name: "BioFarma México", sector: "Farmacéutica", ciudad: "Puebla", residentes: 1, convenio: "2024-10-01", status: "Por Vencer" },
  { name: "AutoParts Globales", sector: "Automotriz", ciudad: "Saltillo", residentes: 6, convenio: "2025-08-15", status: "Activa" },
  { name: "EduTech Innovación", sector: "Educación", ciudad: "CDMX", residentes: 2, convenio: "2025-01-10", status: "Nueva" },
];

const STATUS_STYLE = {
  Activa:    { color: C.green,  bg: C.greenLight },
  "Por Vencer": { color: C.amber,  bg: C.amberLight },
  Nueva:     { color: C.blue,   bg: C.blueLight },
  Inactiva:  { color: C.red,    bg: C.redLight },
};

const SECTOR_ICON = {
  Tecnología: "cpu",
  Manufactura: "tool",
  Software: "code",
  Construcción: "home",
  Farmacéutica: "activity",
  Automotriz: "truck",
  Educación: "book-open",
};

export default function GestionEmpresas() {
  const [search, setSearch] = useState("");

  const filtered = COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.sector.toLowerCase().includes(search.toLowerCase()) ||
    c.ciudad.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      {/* Header */}
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Gestión de Empresas</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Directorio y convenios vigentes</Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: C.teal,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <Feather name="plus" size={15} color="white" />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>Nueva Empresa</Text>
        </TouchableOpacity>
      </Row>

      {/* Stat Cards */}
      <Row style={{ gap: 12, marginBottom: 20 }}>
        <StatCard
          label="Total Empresas"
          value="34"
          icon="briefcase"
          iconBg={C.blueLight}
          iconColor={C.blue}
          trend="+8%"
          trendUp
        />
        <StatCard
          label="Activas"
          value="28"
          icon="check-circle"
          iconBg={C.greenLight}
          iconColor={C.green}
          trend="+3%"
          trendUp
        />
        <StatCard
          label="Por Vencer"
          value="4"
          icon="alert-triangle"
          iconBg={C.amberLight}
          iconColor={C.amber}
          trend="+1"
          trendUp={false}
        />
        <StatCard
          label="Nuevas"
          value="12"
          icon="star"
          iconBg={C.purpleLight}
          iconColor={C.purple}
          trend="+5"
          trendUp
        />
      </Row>

      {/* Directory Card */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {/* Card Header */}
        <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: C.border }}>
          <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }}>Directorio de Empresas</Text>
            <Row style={{ gap: 8 }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  borderWidth: 1,
                  borderColor: C.border,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 8,
                }}
              >
                <Feather name="filter" size={13} color={C.textMuted} />
                <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: "600" }}>Filtrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
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
                <Feather name="plus" size={13} color="white" />
                <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>Agregar</Text>
              </TouchableOpacity>
            </Row>
          </Row>
          {/* Search */}
          <Row
            style={{
              alignItems: "center",
              backgroundColor: C.bg,
              borderRadius: 9,
              borderWidth: 1,
              borderColor: C.border,
              paddingHorizontal: 12,
              gap: 8,
            }}
          >
            <Feather name="search" size={14} color={C.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar empresa, sector o ciudad..."
              placeholderTextColor={C.textLight}
              style={{ flex: 1, paddingVertical: 9, fontSize: 13, color: C.text }}
            />
          </Row>
        </View>

        {/* Table Header */}
        <View style={{ paddingHorizontal: 18, paddingVertical: 10, backgroundColor: C.bg }}>
          <Row style={{ gap: 0 }}>
            <Text style={[tableHead, { flex: 2.5 }]}>Empresa</Text>
            <Text style={[tableHead, { flex: 1.5 }]}>Sector</Text>
            <Text style={[tableHead, { flex: 1.2 }]}>Ciudad</Text>
            <Text style={[tableHead, { flex: 0.8, textAlign: "center" }]}>Residentes</Text>
            <Text style={[tableHead, { flex: 1.5, textAlign: "center" }]}>Convenio</Text>
            <Text style={[tableHead, { flex: 1, textAlign: "center" }]}>Estado</Text>
            <Text style={[tableHead, { flex: 0.5 }]}>{" "}</Text>
          </Row>
        </View>

        {/* Table Rows */}
        {filtered.map((co, i) => {
          const st = STATUS_STYLE[co.status] || STATUS_STYLE.Activa;
          const ico = SECTOR_ICON[co.sector] || "briefcase";
          return (
            <View
              key={i}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 13,
                borderTopWidth: 1,
                borderTopColor: C.borderLight,
                backgroundColor: i % 2 === 0 ? C.card : "#F8FAFC",
              }}
            >
              <Row style={{ alignItems: "center", gap: 0 }}>
                {/* Empresa */}
                <Row style={{ flex: 2.5, alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      backgroundColor: C.tealLight,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather name={ico} size={15} color={C.teal} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: C.text, flex: 1 }} numberOfLines={1}>
                    {co.name}
                  </Text>
                </Row>
                {/* Sector */}
                <Text style={[tableCell, { flex: 1.5 }]}>{co.sector}</Text>
                {/* Ciudad */}
                <Text style={[tableCell, { flex: 1.2 }]}>{co.ciudad}</Text>
                {/* Residentes */}
                <View style={{ flex: 0.8, alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: C.blueLight,
                      borderRadius: 20,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      minWidth: 28,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "700", color: C.blue }}>{co.residentes}</Text>
                  </View>
                </View>
                {/* Convenio */}
                <Text style={[tableCell, { flex: 1.5, textAlign: "center" }]}>{co.convenio}</Text>
                {/* Estado */}
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Badge text={co.status} color={st.color} bg={st.bg} />
                </View>
                {/* Actions */}
                <Row style={{ flex: 0.5, justifyContent: "flex-end", gap: 6 }}>
                  <TouchableOpacity>
                    <Feather name="edit-2" size={14} color={C.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Feather name="more-vertical" size={14} color={C.textMuted} />
                  </TouchableOpacity>
                </Row>
              </Row>
            </View>
          );
        })}

        {/* Footer */}
        <View style={{ padding: 14, borderTopWidth: 1, borderTopColor: C.border }}>
          <Text style={{ fontSize: 12, color: C.textMuted, textAlign: "center" }}>
            Mostrando {filtered.length} de {COMPANIES.length} empresas
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const tableHead = {
  fontSize: 11,
  fontWeight: "700",
  color: C.textMuted,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const tableCell = {
  fontSize: 12,
  color: C.textSub,
  fontWeight: "500",
};
