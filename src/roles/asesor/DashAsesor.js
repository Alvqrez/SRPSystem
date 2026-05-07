import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../../constants/colors";
import { Row, Card, StatCard, Badge, ProgressBar, SectionTitle } from "../../components";

export default function DashAsesor() {
  const residentes = [
    {
      iniciales: "AG",
      nombre: "Ana García",
      empresa: "Telmex",
      proyecto: "App Móvil",
      horas: "384/480",
      progreso: 0.8,
      estado: "En Progreso",
      estadoColor: C.blue,
      estadoBg: C.blueLight,
    },
    {
      iniciales: "LH",
      nombre: "Luis Hernández",
      empresa: "Pemex",
      proyecto: "Dashboard",
      horas: "320/480",
      progreso: 0.67,
      estado: "Pendiente Revisión",
      estadoColor: C.amber,
      estadoBg: C.amberLight,
    },
    {
      iniciales: "SM",
      nombre: "Sofía Martínez",
      empresa: "Bimbo",
      proyecto: "ERP",
      horas: "440/480",
      progreso: 0.92,
      estado: "Por Concluir",
      estadoColor: C.purple,
      estadoBg: C.purpleLight,
    },
    {
      iniciales: "CL",
      nombre: "Carlos López",
      empresa: "CFE",
      proyecto: "Automatización",
      horas: "200/480",
      progreso: 0.42,
      estado: "En Progreso",
      estadoColor: C.blue,
      estadoBg: C.blueLight,
    },
    {
      iniciales: "MT",
      nombre: "María Torres",
      empresa: "IMSS",
      proyecto: "Portal Web",
      horas: "480/480",
      progreso: 1.0,
      estado: "Completado",
      estadoColor: C.green,
      estadoBg: C.greenLight,
    },
  ];

  const reportesPendientes = [
    { dot: C.amber,  texto: "Luis Hernández — Reporte 2 en revisión",    sub: "Recibido hace 2 días" },
    { dot: C.amber,  texto: "Carlos López — Reporte 1 esperando firma",  sub: "Recibido hace 5 días" },
    { dot: C.red,    texto: "Ana García — Reporte 3 con observaciones",  sub: "Requiere correcciones" },
  ];

  const reuniones = [
    { icono: "user", nombre: "Ana García",      hora: "Hoy 15:00",       tag: "Reporte 3",    tagColor: C.teal  },
    { icono: "user", nombre: "Sofía Martínez",  hora: "Mañana 10:30",    tag: "Cierre",       tagColor: C.green },
    { icono: "user", nombre: "Carlos López",    hora: "Vie 14:00",       tag: "Seguimiento",  tagColor: C.blue  },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 24 }}
    >
      <SectionTitle>Dashboard Asesor</SectionTitle>

      {/* ── Stat Cards ── */}
      <Row style={{ gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard
          label="Residentes Activos"
          value="12"
          subtitle="3 departamentos"
          icon={<Feather name="users" size={20} color={C.teal} />}
          bgColor={C.tealLight}
          valueColor={C.teal}
          trend="+2"
          trendUp={true}
        />
        <StatCard
          label="Reportes Pendientes"
          value="5"
          subtitle="Por revisar"
          icon={<Feather name="file-text" size={20} color={C.amber} />}
          bgColor={C.amberLight}
          valueColor={C.amber}
        />
        <StatCard
          label="Tasa Aprobación"
          value="94%"
          subtitle="Último trimestre"
          icon={<Feather name="trending-up" size={20} color={C.green} />}
          bgColor={C.greenLight}
          valueColor={C.green}
          trend="+3%"
          trendUp={true}
        />
        <StatCard
          label="Próx. Reuniones"
          value="3"
          subtitle="Esta semana"
          icon={<Feather name="calendar" size={20} color={C.blue} />}
          bgColor={C.blueLight}
          valueColor={C.blue}
        />
      </Row>

      {/* ── Mis Residentes ── */}
      <Card style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: C.text, marginBottom: 16 }}>
          Mis Residentes
        </Text>

        {/* Table header */}
        <Row
          style={{
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: C.bg,
            borderRadius: 8,
            marginBottom: 4,
          }}
        >
          <Text style={{ flex: 3, fontSize: 12, fontWeight: "600", color: C.textMuted }}>
            RESIDENTE
          </Text>
          <Text style={{ flex: 2, fontSize: 12, fontWeight: "600", color: C.textMuted }}>
            EMPRESA / PROYECTO
          </Text>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: C.textMuted, textAlign: "center" }}>
            HORAS
          </Text>
          <Text style={{ flex: 2, fontSize: 12, fontWeight: "600", color: C.textMuted, textAlign: "center" }}>
            PROGRESO
          </Text>
          <Text style={{ flex: 2, fontSize: 12, fontWeight: "600", color: C.textMuted, textAlign: "center" }}>
            ESTADO
          </Text>
        </Row>

        {/* Rows */}
        {residentes.map((r, i) => (
          <Row
            key={i}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 14,
              borderBottomWidth: i < residentes.length - 1 ? 1 : 0,
              borderBottomColor: C.border,
              alignItems: "center",
            }}
          >
            {/* Avatar + name */}
            <Row style={{ flex: 3, gap: 10, alignItems: "center" }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: C.tealLight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.teal }}>
                  {r.iniciales}
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: C.text, fontWeight: "600" }}>
                {r.nombre}
              </Text>
            </Row>

            {/* Empresa / Proyecto */}
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 13, color: C.text }}>{r.empresa}</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>{r.proyecto}</Text>
            </View>

            {/* Horas */}
            <Text style={{ flex: 1, fontSize: 13, color: C.textMuted, textAlign: "center" }}>
              {r.horas}
            </Text>

            {/* Progress */}
            <View style={{ flex: 2, paddingHorizontal: 8 }}>
              <ProgressBar progress={r.progreso} color={C.teal} />
              <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 4, textAlign: "center" }}>
                {Math.round(r.progreso * 100)}%
              </Text>
            </View>

            {/* Status badge */}
            <View style={{ flex: 2, alignItems: "center" }}>
              <Badge
                label={r.estado}
                color={r.estadoColor}
                bgColor={r.estadoBg}
              />
            </View>
          </Row>
        ))}
      </Card>

      {/* ── Bottom row: Reportes Pendientes + Agenda ── */}
      <Row style={{ gap: 20, alignItems: "flex-start" }}>

        {/* Reportes Pendientes */}
        <Card style={{ flex: 1 }}>
          <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>
              Reportes Pendientes
            </Text>
            <Badge label="3" color={C.amber} bgColor={C.amberLight} />
          </Row>

          <View style={{ gap: 14 }}>
            {reportesPendientes.map((item, i) => (
              <Row key={i} style={{ gap: 12, alignItems: "flex-start" }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: item.dot,
                    marginTop: 4,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, color: C.text, fontWeight: "500" }}>
                    {item.texto}
                  </Text>
                  <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                    {item.sub}
                  </Text>
                </View>
              </Row>
            ))}
          </View>

          <TouchableOpacity
            style={{
              marginTop: 16,
              borderWidth: 1,
              borderColor: C.teal,
              borderRadius: 8,
              paddingVertical: 9,
              alignItems: "center",
            }}
          >
            <Text style={{ color: C.teal, fontSize: 13, fontWeight: "600" }}>
              Ver todos los reportes
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Agenda de Reuniones */}
        <Card style={{ flex: 1 }}>
          <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>
              Agenda de Reuniones
            </Text>
            <Badge label="3" color={C.blue} bgColor={C.blueLight} />
          </Row>

          <View style={{ gap: 14 }}>
            {reuniones.map((r, i) => (
              <Row
                key={i}
                style={{
                  gap: 12,
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: C.bg,
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: C.blueLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="user" size={16} color={C.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: C.text }}>{r.nombre}</Text>
                  <Text style={{ fontSize: 12, color: C.textMuted }}>{r.hora}</Text>
                </View>
                <Badge label={r.tag} color={r.tagColor} bgColor={r.tagColor + "22"} />
              </Row>
            ))}
          </View>

          <TouchableOpacity
            style={{
              marginTop: 16,
              borderWidth: 1,
              borderColor: C.blue,
              borderRadius: 8,
              paddingVertical: 9,
              alignItems: "center",
            }}
          >
            <Text style={{ color: C.blue, fontSize: 13, fontWeight: "600" }}>
              Ver agenda completa
            </Text>
          </TouchableOpacity>
        </Card>
      </Row>
    </ScrollView>
  );
}
