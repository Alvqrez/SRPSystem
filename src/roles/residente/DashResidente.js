import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../../constants/colors";
import { Row, Card, StatCard, Badge, ProgressBar, SectionTitle } from "../../components";

export default function DashResidente({ onNavigate }) {
  const steps = [
    { label: "Registro",   done: true,  active: false },
    { label: "Asignación", done: true,  active: false },
    { label: "Reporte 1",  done: true,  active: false },
    { label: "Reporte 2",  done: true,  active: false },
    { label: "Reporte 3",  done: false, active: true  },
    { label: "Final",      done: false, active: false },
  ];

  const reportes = [
    { nombre: "Reporte 1 — Avance Inicial", fechaLimite: "15 Oct", fechaEntrega: "12 Oct", estado: "Aprobado",  estadoColor: C.green, estadoBg: C.greenLight },
    { nombre: "Reporte 2 — Desarrollo",     fechaLimite: "15 Nov", fechaEntrega: "13 Nov", estado: "Aprobado",  estadoColor: C.green, estadoBg: C.greenLight },
    { nombre: "Reporte 3 — Avance Final",   fechaLimite: "15 Dic", fechaEntrega: "—",      estado: "Pendiente", estadoColor: C.amber, estadoBg: C.amberLight },
  ];

  const eventos = [
    { fecha: "18 Dic", titulo: "Entrega Reporte 3",  color: C.amber },
    { fecha: "20 Dic", titulo: "Reunión con Asesor",  color: C.blue  },
    { fecha: "20 Ene", titulo: "Reporte Final",       color: C.red   },
    { fecha: "27 Ene", titulo: "Evaluación Final",    color: C.green },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      <SectionTitle title="Dashboard Residente" />

      {/* Stat Cards */}
      <Row style={{ gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Horas Completadas" value="384" sub="de 480 requeridas"  icon="clock"       iconBg={C.blueLight}  iconColor={C.blue}  trend="+12h" trendUp />
        <StatCard label="Reportes"          value="2/3" sub="Reporte 3 pendiente" icon="file-text"  iconBg={C.tealLight}  iconColor={C.teal}  />
        <StatCard label="Progreso"          value="80%" sub="Buen ritmo"          icon="trending-up" iconBg={C.greenLight} iconColor={C.green} trend="+5%" trendUp />
        <StatCard label="Días Restantes"    value="28"  sub="Fin: 20 ene 2025"   icon="calendar"    iconBg={C.amberLight} iconColor={C.amber} />
      </Row>

      <Row style={{ gap: 20, alignItems: "flex-start" }}>
        {/* Columna izquierda */}
        <View style={{ flex: 1, gap: 20 }}>

          {/* Progreso de Residencia */}
          <Card>
            <Text style={{ fontSize: 16, fontWeight: "700", color: C.text, marginBottom: 20 }}>
              Progreso de Residencia
            </Text>
            <Row style={{ alignItems: "center", marginBottom: 24 }}>
              {steps.map((step, index) => (
                <View key={index} style={{ flex: 1, alignItems: "center" }}>
                  <Row style={{ alignItems: "center", width: "100%" }}>
                    {index > 0 && (
                      <View style={{ flex: 1, height: 2, backgroundColor: steps[index - 1].done ? C.teal : C.border }} />
                    )}
                    <View style={{
                      width: 28, height: 28, borderRadius: 14,
                      backgroundColor: step.done ? C.teal : step.active ? C.amber : C.bg,
                      borderWidth: step.done || step.active ? 0 : 2,
                      borderColor: C.border,
                      alignItems: "center", justifyContent: "center",
                    }}>
                      {step.done ? (
                        <Feather name="check" size={14} color="#fff" />
                      ) : step.active ? (
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#fff" }} />
                      ) : null}
                    </View>
                    {index < steps.length - 1 && (
                      <View style={{ flex: 1, height: 2, backgroundColor: step.done ? C.teal : C.border }} />
                    )}
                  </Row>
                  <Text style={{
                    fontSize: 11, marginTop: 6, textAlign: "center",
                    color: step.done ? C.teal : step.active ? C.amber : C.textMuted,
                    fontWeight: step.active ? "700" : "400",
                  }}>
                    {step.label}
                  </Text>
                </View>
              ))}
            </Row>
            <View style={{ backgroundColor: C.bg, borderRadius: 10, padding: 16 }}>
              <Row style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: C.text }}>Horas (80%)</Text>
                <Text style={{ fontSize: 13, color: C.textMuted }}>384 / 480</Text>
              </Row>
              <ProgressBar pct={80} color={C.teal} />
              <Row style={{ justifyContent: "space-between", marginTop: 8 }}>
                <Text style={{ fontSize: 12, color: C.teal }}>384 completadas</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>96 restantes</Text>
              </Row>
            </View>
          </Card>

          {/* Mis Reportes */}
          <Card>
            <Text style={{ fontSize: 16, fontWeight: "700", color: C.text, marginBottom: 16 }}>Mis Reportes</Text>
            <Row style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: C.bg, borderRadius: 8, marginBottom: 8 }}>
              <Text style={{ flex: 2, fontSize: 12, fontWeight: "600", color: C.textMuted }}>REPORTE</Text>
              <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: C.textMuted, textAlign: "center" }}>LÍMITE</Text>
              <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: C.textMuted, textAlign: "center" }}>ENTREGA</Text>
              <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: C.textMuted, textAlign: "center" }}>ESTADO</Text>
            </Row>
            {reportes.map((r, i) => (
              <Row key={i} style={{ paddingHorizontal: 12, paddingVertical: 14, borderBottomWidth: i < reportes.length - 1 ? 1 : 0, borderBottomColor: C.border, alignItems: "center" }}>
                <Text style={{ flex: 2, fontSize: 14, color: C.text }}>{r.nombre}</Text>
                <Text style={{ flex: 1, fontSize: 13, color: C.textMuted, textAlign: "center" }}>{r.fechaLimite}</Text>
                <Text style={{ flex: 1, fontSize: 13, color: C.textMuted, textAlign: "center" }}>{r.fechaEntrega}</Text>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Badge text={r.estado} color={r.estadoColor} bg={r.estadoBg} />
                </View>
              </Row>
            ))}
          </Card>
        </View>

        {/* Sidebar derecho */}
        <View style={{ width: 280, gap: 20 }}>
          {/* Mi Asesor */}
          <Card>
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.text, marginBottom: 16 }}>Mi Asesor</Text>
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: C.tealLight, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: "700", color: C.teal }}>MR</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>Dr. Marco Reyes</Text>
              <Text style={{ fontSize: 13, color: C.textMuted }}>Ing. en Sistemas</Text>
            </View>
            <View style={{ gap: 8, marginBottom: 16 }}>
              {[
                ["mail",    "marco.reyes@itm.edu.mx"],
                ["phone",   "Ext. 2341"],
                ["map-pin", "Cubículo B-12"],
              ].map(([icon, txt], i) => (
                <Row key={i} style={{ gap: 8, alignItems: "center" }}>
                  <Feather name={icon} size={14} color={C.textMuted} />
                  <Text style={{ fontSize: 13, color: C.textMuted }}>{txt}</Text>
                </Row>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => onNavigate && onNavigate("calendario")}
              style={{ backgroundColor: C.teal, borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
            >
              <Row style={{ gap: 6, alignItems: "center" }}>
                <Feather name="message-circle" size={15} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>Agendar Cita</Text>
              </Row>
            </TouchableOpacity>
          </Card>

          {/* Próximos Eventos */}
          <Card>
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.text, marginBottom: 14 }}>Próximos Eventos</Text>
            <View style={{ gap: 12 }}>
              {eventos.map((ev, i) => (
                <Row key={i} style={{ gap: 12, alignItems: "center" }}>
                  <View style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: ev.color + "22", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: ev.color }}>{ev.fecha}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, color: C.text }}>{ev.titulo}</Text>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: ev.color }} />
                </Row>
              ))}
            </View>
          </Card>
        </View>
      </Row>
    </ScrollView>
  );
}
