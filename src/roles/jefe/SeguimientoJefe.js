import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, Badge, StatCard } from "../components";

const RESIDENTES = [
  {
    id: 1, nombre: "Ana López",      iniciales: "AL", empresa: "Telmex",              proyecto: "Sistema ERP Módulo RRHH",    asesor: "Dr. Martínez",
    reportes: [
      { tipo: "Preliminar",  estado: "Aceptado",     fecha: "10 Ene 2026" },
      { tipo: "Parcial 1",   estado: "Aceptado",     fecha: "15 Feb 2026" },
      { tipo: "Parcial 2",   estado: "Aceptado",     fecha: "14 Mar 2026" },
      { tipo: "Parcial 3",   estado: "Pendiente",    fecha: "05 Abr 2026" },
      { tipo: "Final",       estado: "Pendiente",    fecha: null          },
    ],
  },
  {
    id: 2, nombre: "Carlos Ruiz",    iniciales: "CR", empresa: "AutoParts Globales",   proyecto: "App de Logística Interna",   asesor: "Dr. Martínez",
    reportes: [
      { tipo: "Preliminar",  estado: "Aceptado",     fecha: "08 Ene 2026" },
      { tipo: "Parcial 1",   estado: "Aceptado",     fecha: "12 Feb 2026" },
      { tipo: "Parcial 2",   estado: "Por corregir", fecha: "10 Mar 2026" },
      { tipo: "Parcial 3",   estado: "Pendiente",    fecha: null          },
      { tipo: "Final",       estado: "Pendiente",    fecha: null          },
    ],
  },
  {
    id: 3, nombre: "María García",   iniciales: "MG", empresa: "EduTech Innovación",   proyecto: "Plataforma de E-learning",   asesor: "Dra. López",
    reportes: [
      { tipo: "Preliminar",  estado: "Aceptado",     fecha: "12 Ene 2026" },
      { tipo: "Parcial 1",   estado: "Aceptado",     fecha: "18 Feb 2026" },
      { tipo: "Parcial 2",   estado: "Pendiente",    fecha: "20 Mar 2026" },
      { tipo: "Parcial 3",   estado: "Pendiente",    fecha: null          },
      { tipo: "Final",       estado: "Pendiente",    fecha: null          },
    ],
  },
  {
    id: 4, nombre: "Juan Pérez",     iniciales: "JP", empresa: "Tecnológica del Norte", proyecto: "Portal de Clientes Web",     asesor: "Dr. Herrera",
    reportes: [
      { tipo: "Preliminar",  estado: "Aceptado",     fecha: "09 Ene 2026" },
      { tipo: "Parcial 1",   estado: "Por corregir", fecha: "14 Feb 2026" },
      { tipo: "Parcial 2",   estado: "Pendiente",    fecha: null          },
      { tipo: "Parcial 3",   estado: "Pendiente",    fecha: null          },
      { tipo: "Final",       estado: "Pendiente",    fecha: null          },
    ],
  },
  {
    id: 5, nombre: "Laura Vega",     iniciales: "LV", empresa: "BioFarma México",       proyecto: "Automatización de Reportes", asesor: "Dra. López",
    reportes: [
      { tipo: "Preliminar",  estado: "Aceptado",     fecha: "11 Ene 2026" },
      { tipo: "Parcial 1",   estado: "Aceptado",     fecha: "16 Feb 2026" },
      { tipo: "Parcial 2",   estado: "Aceptado",     fecha: "15 Mar 2026" },
      { tipo: "Parcial 3",   estado: "Aceptado",     fecha: "14 Abr 2026" },
      { tipo: "Final",       estado: "Pendiente",    fecha: "02 May 2026" },
    ],
  },
  {
    id: 6, nombre: "Roberto Mena",   iniciales: "RM", empresa: "Constructora Peña",     proyecto: "App Inventarios Móvil",      asesor: "Dr. Martínez",
    reportes: [
      { tipo: "Preliminar",  estado: "Aceptado",     fecha: "07 Ene 2026" },
      { tipo: "Parcial 1",   estado: "Aceptado",     fecha: "10 Feb 2026" },
      { tipo: "Parcial 2",   estado: "Aceptado",     fecha: "08 Mar 2026" },
      { tipo: "Parcial 3",   estado: "Pendiente",    fecha: "07 Abr 2026" },
      { tipo: "Final",       estado: "Pendiente",    fecha: null          },
    ],
  },
  {
    id: 7, nombre: "Karen Flores",   iniciales: "KF", empresa: "SoftSolutions SA",      proyecto: "Dashboard BI Financiero",    asesor: "Dr. Herrera",
    reportes: [
      { tipo: "Preliminar",  estado: "Por corregir", fecha: "15 Ene 2026" },
      { tipo: "Parcial 1",   estado: "Pendiente",    fecha: null          },
      { tipo: "Parcial 2",   estado: "Pendiente",    fecha: null          },
      { tipo: "Parcial 3",   estado: "Pendiente",    fecha: null          },
      { tipo: "Final",       estado: "Pendiente",    fecha: null          },
    ],
  },
];

const STATUS_STYLE = {
  "Aceptado":     { color: C.green,    bg: C.greenLight,  icon: "check-circle"   },
  "Pendiente":    { color: C.amber,    bg: C.amberLight,  icon: "clock"          },
  "Por corregir": { color: C.red,      bg: C.redLight,    icon: "alert-circle"   },
};

export default function SeguimientoJefe() {
  const [busqueda,    setBusqueda]    = useState("");
  const [filtroTipo,  setFiltroTipo]  = useState("residente"); // residente | proyecto | empresa
  const [expandido,   setExpandido]   = useState(null);

  const empresas  = [...new Set(RESIDENTES.map((r) => r.empresa))];
  const proyectos = [...new Set(RESIDENTES.map((r) => r.proyecto))];

  const residenetesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return RESIDENTES;
    if (filtroTipo === "residente") return RESIDENTES.filter((r) => r.nombre.toLowerCase().includes(q));
    if (filtroTipo === "proyecto")  return RESIDENTES.filter((r) => r.proyecto.toLowerCase().includes(q));
    if (filtroTipo === "empresa")   return RESIDENTES.filter((r) => r.empresa.toLowerCase().includes(q));
    return RESIDENTES;
  }, [busqueda, filtroTipo]);

  // Stats globales
  const totalReportes    = RESIDENTES.flatMap((r) => r.reportes).length;
  const totalAceptados   = RESIDENTES.flatMap((r) => r.reportes).filter((rep) => rep.estado === "Aceptado").length;
  const totalPendientes  = RESIDENTES.flatMap((r) => r.reportes).filter((rep) => rep.estado === "Pendiente").length;
  const totalPorCorregir = RESIDENTES.flatMap((r) => r.reportes).filter((rep) => rep.estado === "Por corregir").length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      {/* Header */}
      <View style={{ marginBottom: 22 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Seguimiento del Departamento</Text>
        <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Seguimiento de todos los residentes — Departamento de Sistemas</Text>
      </View>

      {/* Stats */}
      <Row style={{ gap: 12, marginBottom: 22 }}>
        <StatCard label="Residentes"      value={String(RESIDENTES.length)}   icon="users"       iconBg={C.tealLight}   iconColor={C.teal}   />
        <StatCard label="Reportes Totales" value={String(totalReportes)}       icon="file-text"   iconBg={C.blueLight}   iconColor={C.blue}   />
        <StatCard label="Aceptados"        value={String(totalAceptados)}      icon="check-circle" iconBg={C.greenLight} iconColor={C.green}  />
        <StatCard label="Por Corregir"     value={String(totalPorCorregir)}    icon="alert-circle" iconBg={C.redLight}   iconColor={C.red}    />
      </Row>

      {/* Filtros */}
      <View style={{ marginBottom: 18 }}>
        {/* Tipo de filtro */}
        <Row style={{ gap: 8, marginBottom: 12 }}>
          {[{ id: "residente", label: "Por Residente", icon: "user" }, { id: "proyecto", label: "Por Proyecto", icon: "folder" }, { id: "empresa", label: "Por Empresa", icon: "briefcase" }].map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => { setFiltroTipo(f.id); setBusqueda(""); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: filtroTipo === f.id ? C.teal : C.card, borderWidth: 1, borderColor: filtroTipo === f.id ? C.teal : C.border }}
            >
              <Feather name={f.icon} size={12} color={filtroTipo === f.id ? "white" : C.textMuted} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: filtroTipo === f.id ? "white" : C.textMuted }}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </Row>

        {/* Buscador */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 0 }}>
          <Feather name="search" size={15} color={C.textMuted} />
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder={`Buscar por ${filtroTipo === "residente" ? "nombre del residente" : filtroTipo === "proyecto" ? "nombre del proyecto" : "empresa"}...`}
            placeholderTextColor={C.textLight}
            style={{ flex: 1, paddingVertical: 12, fontSize: 13, color: C.text }}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda("")}>
              <Feather name="x" size={14} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Chips rápidos para empresa/proyecto */}
        {filtroTipo === "empresa" && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            <Row style={{ gap: 8 }}>
              {empresas.map((e) => (
                <TouchableOpacity key={e} onPress={() => setBusqueda(e)} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: busqueda === e ? C.tealLight : C.bg, borderWidth: 1, borderColor: busqueda === e ? C.teal : C.border }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: busqueda === e ? C.teal : C.textMuted }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </Row>
          </ScrollView>
        )}
        {filtroTipo === "proyecto" && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            <Row style={{ gap: 8 }}>
              {proyectos.map((p) => (
                <TouchableOpacity key={p} onPress={() => setBusqueda(p)} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: busqueda === p ? C.tealLight : C.bg, borderWidth: 1, borderColor: busqueda === p ? C.teal : C.border }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: busqueda === p ? C.teal : C.textMuted }} numberOfLines={1}>{p}</Text>
                </TouchableOpacity>
              ))}
            </Row>
          </ScrollView>
        )}
      </View>

      {/* Resultado */}
      <Text style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
        {residenetesFiltrados.length === RESIDENTES.length
          ? `Mostrando todos los residentes (${RESIDENTES.length})`
          : `${residenetesFiltrados.length} resultado(s) encontrado(s)`}
      </Text>

      {/* Cards de residentes */}
      <View style={{ gap: 14 }}>
        {residenetesFiltrados.map((res) => {
          const aceptados   = res.reportes.filter((r) => r.estado === "Aceptado").length;
          const porCorregir = res.reportes.filter((r) => r.estado === "Por corregir").length;
          const isOpen      = expandido === res.id;
          const pct         = Math.round((aceptados / res.reportes.length) * 100);

          return (
            <Card key={res.id} style={{ padding: 0, overflow: "hidden" }}>
              <TouchableOpacity onPress={() => setExpandido(isOpen ? null : res.id)} activeOpacity={0.9} style={{ padding: 18 }}>
                <Row style={{ alignItems: "center", gap: 14 }}>
                  {/* Avatar */}
                  <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.tealLight, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 14, fontWeight: "800", color: C.teal }}>{res.iniciales}</Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>{res.nombre}</Text>
                      {porCorregir > 0 && <Badge text={`${porCorregir} por corregir`} color={C.red} bg={C.redLight} />}
                    </Row>
                    <Text style={{ fontSize: 12, color: C.textMuted }}>{res.proyecto}</Text>
                    <Row style={{ gap: 12, marginTop: 4 }}>
                      <Row style={{ gap: 4, alignItems: "center" }}>
                        <Feather name="briefcase" size={11} color={C.textLight} />
                        <Text style={{ fontSize: 11, color: C.textMuted }}>{res.empresa}</Text>
                      </Row>
                      <Row style={{ gap: 4, alignItems: "center" }}>
                        <Feather name="user-check" size={11} color={C.textLight} />
                        <Text style={{ fontSize: 11, color: C.textMuted }}>{res.asesor}</Text>
                      </Row>
                    </Row>

                    {/* Mini barra de progreso */}
                    <View style={{ marginTop: 10 }}>
                      <Row style={{ justifyContent: "space-between", marginBottom: 4 }}>
                        <Text style={{ fontSize: 10, color: C.textMuted }}>{aceptados}/{res.reportes.length} reportes aceptados</Text>
                        <Text style={{ fontSize: 10, fontWeight: "700", color: C.teal }}>{pct}%</Text>
                      </Row>
                      <View style={{ height: 6, borderRadius: 3, backgroundColor: C.border }}>
                        <View style={{ height: 6, borderRadius: 3, backgroundColor: pct === 100 ? C.green : C.teal, width: `${pct}%` }} />
                      </View>
                    </View>
                  </View>

                  <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={18} color={C.textMuted} />
                </Row>
              </TouchableOpacity>

              {/* Detalle expandido: tabla de reportes */}
              {isOpen && (
                <View style={{ paddingHorizontal: 18, paddingBottom: 18, borderTopWidth: 1, borderTopColor: C.borderLight, paddingTop: 14 }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Estado de Reportes</Text>
                  <View style={{ gap: 8 }}>
                    {res.reportes.map((rep, ri) => {
                      const st = STATUS_STYLE[rep.estado] || STATUS_STYLE["Pendiente"];
                      return (
                        <Row key={ri} style={{ alignItems: "center", gap: 12, backgroundColor: C.bg, borderRadius: 8, padding: 10 }}>
                          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: st.bg, alignItems: "center", justifyContent: "center" }}>
                            <Feather name={st.icon} size={14} color={st.color} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 13, fontWeight: "600", color: C.text }}>{rep.tipo}</Text>
                            {rep.fecha && <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>Enviado: {rep.fecha}</Text>}
                            {!rep.fecha && <Text style={{ fontSize: 11, color: C.textLight, marginTop: 1 }}>Sin entregar</Text>}
                          </View>
                          <Badge text={rep.estado} color={st.color} bg={st.bg} />
                        </Row>
                      );
                    })}
                  </View>
                </View>
              )}
            </Card>
          );
        })}
      </View>

      {residenetesFiltrados.length === 0 && (
        <View style={{ alignItems: "center", paddingVertical: 48 }}>
          <Feather name="search" size={32} color={C.textLight} style={{ marginBottom: 12 }} />
          <Text style={{ fontSize: 15, fontWeight: "700", color: C.textMuted }}>Sin resultados</Text>
          <Text style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Intenta con otro término de búsqueda</Text>
        </View>
      )}
    </ScrollView>
  );
}
