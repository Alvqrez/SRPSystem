import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../../constants/colors";
import { Row, Card, StatCard, Badge, SectionTitle } from "../../components";

export default function DashJefe({ onNavigate }) {
  const empresas = [
    { nombre: "Telmex",  proyectos: 8, residentes: 12, estado: "Activo",      estadoColor: C.green, estadoBg: C.greenLight },
    { nombre: "Pemex",   proyectos: 6, residentes:  9, estado: "Activo",      estadoColor: C.green, estadoBg: C.greenLight },
    { nombre: "CFE",     proyectos: 5, residentes:  8, estado: "Activo",      estadoColor: C.green, estadoBg: C.greenLight },
    { nombre: "Bimbo",   proyectos: 4, residentes:  6, estado: "Activo",      estadoColor: C.green, estadoBg: C.greenLight },
    { nombre: "IMSS",    proyectos: 3, residentes:  5, estado: "En Revisión", estadoColor: C.amber, estadoBg: C.amberLight },
    { nombre: "Siemens", proyectos: 2, residentes:  4, estado: "Activo",      estadoColor: C.green, estadoBg: C.greenLight },
  ];

  const alertas = [
    {
      icono: "alert-triangle", color: C.red, bg: C.redLight,
      titulo: "Reportes Atrasados",
      descripcion: "8 residentes llevan más de 7 días sin entregar su reporte programado.",
      accion: "Ver seguimiento", screen: "seguimiento",
    },
    {
      icono: "clock", color: C.amber, bg: C.amberLight,
      titulo: "Evaluaciones Próximas",
      descripcion: "5 residentes tienen evaluación final en los próximos 10 días.",
      accion: "Ver calendario", screen: "calendario",
    },
    {
      icono: "user-plus", color: C.purple, bg: C.purpleLight,
      titulo: "Asignaciones Pendientes",
      descripcion: "3 residentes nuevos esperan asignación de asesor y proyecto.",
      accion: "Ir a Asignación", screen: "asignacion",
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      <SectionTitle title="Dashboard — Departamento de Sistemas" />

      {/* Stat Cards */}
      <Row style={{ gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Residentes Totales"  value="47"  sub="38 activos"      icon="users"        iconBg={C.tealLight}   iconColor={C.teal}   trend="+8" trendUp />
        <StatCard label="Empresas Vinculadas" value="22"  sub="6 nuevas"        icon="briefcase"    iconBg={C.blueLight}   iconColor={C.blue}   trend="+3" trendUp />
        <StatCard label="Proyectos Activos"   value="28"  sub="4 por concluir"  icon="folder"       iconBg={C.purpleLight} iconColor={C.purple} />
        <StatCard label="Reportes Pendientes" value="11"  sub="3 con atraso"    icon="alert-circle" iconBg={C.redLight}    iconColor={C.red}    />
      </Row>

      {/* Empresas Más Activas — tabla completa */}
      <Card style={{ marginBottom: 20 }}>
        <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: C.text }}>Empresas Más Activas</Text>
          <TouchableOpacity
            onPress={() => onNavigate && onNavigate("empresas")}
            style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: C.teal }}
          >
            <Text style={{ fontSize: 12, color: C.teal, fontWeight: "600" }}>Ver todas</Text>
          </TouchableOpacity>
        </Row>
        <Row style={{ paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.bg, borderRadius: 8, marginBottom: 4 }}>
          <Text style={{ flex: 2, fontSize: 12, fontWeight: "600", color: C.textMuted }}>EMPRESA</Text>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: C.textMuted, textAlign: "center" }}>PROYECTOS</Text>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: C.textMuted, textAlign: "center" }}>RESIDENTES</Text>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: C.textMuted, textAlign: "center" }}>ESTADO</Text>
        </Row>
        {empresas.map((e, i) => (
          <Row key={i} style={{ paddingHorizontal: 10, paddingVertical: 13, borderBottomWidth: i < empresas.length - 1 ? 1 : 0, borderBottomColor: C.border, alignItems: "center" }}>
            <Row style={{ flex: 2, gap: 10, alignItems: "center" }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.blue }}>{e.nombre[0]}</Text>
              </View>
              <Text style={{ fontSize: 14, color: C.text, fontWeight: "600" }}>{e.nombre}</Text>
            </Row>
            <Text style={{ flex: 1, fontSize: 14, color: C.text, textAlign: "center" }}>{e.proyectos}</Text>
            <Text style={{ flex: 1, fontSize: 14, color: C.text, textAlign: "center" }}>{e.residentes}</Text>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Badge text={e.estado} color={e.estadoColor} bg={e.estadoBg} />
            </View>
          </Row>
        ))}
      </Card>

      {/* Alertas y Acciones Requeridas */}
      <Card>
        <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: C.text }}>Alertas y Acciones Requeridas</Text>
          <Badge text="3 urgentes" color={C.red} bg={C.redLight} />
        </Row>
        <Row style={{ gap: 16, flexWrap: "wrap" }}>
          {alertas.map((a, i) => (
            <View key={i} style={{ flex: 1, minWidth: 220, backgroundColor: a.bg, borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: a.color }}>
              <Row style={{ gap: 10, alignItems: "center", marginBottom: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: a.color + "33", alignItems: "center", justifyContent: "center" }}>
                  <Feather name={a.icono} size={18} color={a.color} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: "700", color: C.text, flex: 1 }}>{a.titulo}</Text>
              </Row>
              <Text style={{ fontSize: 13, color: C.textMuted, lineHeight: 19, marginBottom: 14 }}>{a.descripcion}</Text>
              <TouchableOpacity
                onPress={() => onNavigate && onNavigate(a.screen)}
                style={{ backgroundColor: a.color, borderRadius: 8, paddingVertical: 8, alignItems: "center" }}
              >
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>{a.accion}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Row>
      </Card>
    </ScrollView>
  );
}
