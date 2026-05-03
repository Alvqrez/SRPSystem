import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// ─── COLORES ──────────────────────────────────────────────────────────────────
const C = {
  navy: "#0C1A35",
  navyMid: "#162444",
  navyLight: "#1E3259",
  teal: "#0D9488",
  tealLight: "#CCFBF1",
  tealLighter: "#F0FDFA",
  green: "#10B981",
  greenLight: "#D1FAE5",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  red: "#EF4444",
  redLight: "#FEE2E2",
  blue: "#3B82F6",
  blueLight: "#DBEAFE",
  purple: "#8B5CF6",
  purpleLight: "#EDE9FE",
  bg: "#F0F4F8",
  card: "#FFFFFF",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  text: "#0F172A",
  textSub: "#334155",
  textMuted: "#64748B",
  textLight: "#94A3B8",
};

// ─── NAVEGACIÓN ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "empresas", label: "Empresas", icon: "briefcase" },
  { id: "proyectos", label: "Proyectos", icon: "folder" },
  { id: "seguimiento", label: "Seguimiento", icon: "file-text" },
  { id: "reporte-final", label: "Reporte Final", icon: "book-open" },
  { id: "notificaciones", label: "Notificaciones", icon: "bell" },
  { id: "calendario", label: "Calendario", icon: "calendar" },
];

const ROLES = ["Residente", "Asesor", "Jefe de Vinculación"];

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function VinculaTec() {
  const [screen, setScreen] = useState("login");
  const [role, setRole] = useState("Residente");
  const [loginRole, setLoginRole] = useState("residente");
  const [activeNav, setActiveNav] = useState("dashboard");

  const handleLogin = () => {
    const map = {
      residente: "Residente",
      asesor: "Asesor",
      jefe: "Jefe de Vinculación",
    };
    setRole(map[loginRole]);
    setScreen("app");
  };

  if (screen === "login") {
    return (
      <LoginScreen
        loginRole={loginRole}
        setLoginRole={setLoginRole}
        onLogin={handleLogin}
      />
    );
  }

  const views = {
    dashboard:
      role === "Residente" ? (
        <DashResidente />
      ) : role === "Asesor" ? (
        <DashAsesor />
      ) : (
        <DashJefe />
      ),
    empresas: <GestionEmpresas />,
    proyectos: <GestionProyectos />,
    seguimiento: <Seguimiento />,
    "reporte-final": <ReporteFinal />,
    notificaciones: <Notificaciones />,
    calendario: <CalendarioCitas />,
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        height: Platform.OS === "web" ? "100vh" : "100%",
        backgroundColor: C.bg,
      }}
    >
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        role={role}
        setRole={setRole}
      />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TopBar
          activeNav={activeNav}
          role={role}
          onLogout={() => setScreen("login")}
        />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          {views[activeNav] || views.dashboard}
        </ScrollView>
      </View>
    </View>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ loginRole, setLoginRole, onLogin }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        height: Platform.OS === "web" ? "100vh" : "100%",
      }}
    >
      {/* Panel izquierdo */}
      <View
        style={{
          width: "40%",
          backgroundColor: C.navy,
          padding: 48,
          justifyContent: "center",
        }}
      >
        <Row style={{ alignItems: "center", gap: 10, marginBottom: 28 }}>
          <View
            style={{
              width: 42,
              height: 42,
              backgroundColor: C.teal,
              borderRadius: 11,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
              VT
            </Text>
          </View>
          <Text style={{ color: "white", fontSize: 22, fontWeight: "800" }}>
            VinculaTec
          </Text>
        </Row>
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "800",
            lineHeight: 36,
            marginBottom: 12,
          }}
        >
          Sistema de Seguimiento de Residencias Profesionales
        </Text>
        <Text
          style={{
            color: C.textLight,
            fontSize: 14,
            lineHeight: 22,
            marginBottom: 32,
          }}
        >
          Plataforma institucional para la gestión y monitoreo integral del
          proceso de residencias.
        </Text>
        {[
          ["check-circle", "Seguimiento en tiempo real de residentes"],
          ["file-text", "Reportes parciales y final digitalizados"],
          ["briefcase", "Gestión de empresas colaboradoras"],
          ["users", "Comunicación directa asesor-residente"],
        ].map(([icon, text], i) => (
          <Row
            key={i}
            style={{ alignItems: "center", gap: 10, marginBottom: 14 }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                backgroundColor: "rgba(13,148,136,0.2)",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name={icon} size={13} color={C.teal} />
            </View>
            <Text style={{ color: "#CBD5E1", fontSize: 13 }}>{text}</Text>
          </Row>
        ))}
      </View>

      {/* Panel derecho */}
      <View
        style={{
          flex: 1,
          backgroundColor: C.bg,
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: C.card,
            borderRadius: 16,
            padding: 32,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: C.text,
              marginBottom: 4,
            }}
          >
            Iniciar Sesión
          </Text>
          <Text style={{ color: C.textMuted, fontSize: 13, marginBottom: 24 }}>
            Selecciona tu rol e ingresa tus credenciales
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            Tipo de Usuario
          </Text>
          <Row style={{ gap: 8, marginBottom: 20 }}>
            {[
              ["residente", "Residente", "book-open"],
              ["asesor", "Asesor", "user-check"],
              ["jefe", "Jefe Vinc.", "briefcase"],
            ].map(([val, label, icon]) => (
              <TouchableOpacity
                key={val}
                onPress={() => setLoginRole(val)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: loginRole === val ? C.teal : C.border,
                  backgroundColor: loginRole === val ? C.tealLight : "white",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Feather
                  name={icon}
                  size={16}
                  color={loginRole === val ? C.teal : C.textMuted}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: loginRole === val ? C.teal : C.textMuted,
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </Row>

          {[
            ["Correo Electrónico", "ana.garcia@tecnolandia.edu.mx", false],
            ["Contraseña", "••••••••", true],
          ].map(([label, ph, secure]) => (
            <View key={label} style={{ marginBottom: 14 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: C.textSub,
                  marginBottom: 6,
                }}
              >
                {label}
              </Text>
              <TextInput
                placeholder={ph}
                secureTextEntry={secure}
                defaultValue={ph}
                style={{
                  padding: 11,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: C.border,
                  fontSize: 13,
                  color: C.text,
                  backgroundColor: "#FAFAFA",
                }}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={onLogin}
            style={{
              backgroundColor: C.teal,
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800", fontSize: 15 }}>
              Acceder a VinculaTec →
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              textAlign: "center",
              color: C.textLight,
              fontSize: 12,
              marginTop: 16,
            }}
          >
            ¿Problemas?{" "}
            <Text style={{ color: C.teal, fontWeight: "700" }}>
              Contactar soporte
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ activeNav, setActiveNav, role, setRole }) {
  return (
    <View
      style={{
        width: 230,
        backgroundColor: C.navy,
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Logo */}
      <View
        style={{
          padding: 18,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.07)",
        }}
      >
        <Row style={{ alignItems: "center", gap: 9, marginBottom: 14 }}>
          <View
            style={{
              width: 32,
              height: 32,
              backgroundColor: C.teal,
              borderRadius: 9,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "800", fontSize: 13 }}>
              VT
            </Text>
          </View>
          <View>
            <Text style={{ color: "white", fontWeight: "800", fontSize: 15 }}>
              VinculaTec
            </Text>
            <Text style={{ color: "#3D5A8A", fontSize: 10 }}>
              v2.4 — 2024-B
            </Text>
          </View>
        </Row>
        {/* Role switcher */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 8,
            padding: 3,
            flexDirection: "row",
            gap: 3,
          }}
        >
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              style={{
                flex: 1,
                paddingVertical: 5,
                borderRadius: 6,
                backgroundColor: role === r ? C.teal : "transparent",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: role === r ? "white" : "#64748B",
                  fontSize: 8,
                  fontWeight: "700",
                }}
              >
                {r === "Jefe de Vinculación" ? "Jefe V." : r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Nav items */}
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <Text
          style={{
            fontSize: 9,
            fontWeight: "700",
            color: "#3D5A8A",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
            paddingHorizontal: 6,
          }}
        >
          Navegación
        </Text>
        {NAV.map(({ id, label, icon }) => {
          const active = activeNav === id;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => setActiveNav(id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 9,
                paddingHorizontal: 12,
                borderRadius: 9,
                backgroundColor: active
                  ? "rgba(13,148,136,0.2)"
                  : "transparent",
                marginBottom: 2,
              }}
            >
              <Feather
                name={icon}
                size={15}
                color={active ? "#5EEAD4" : C.textLight}
              />
              <Text
                style={{
                  color: active ? "#5EEAD4" : C.textLight,
                  fontSize: 13,
                  fontWeight: active ? "700" : "500",
                  flex: 1,
                }}
              >
                {label}
              </Text>
              {id === "notificaciones" && (
                <View
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: C.red,
                    borderRadius: 9,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 9, fontWeight: "700" }}
                  >
                    4
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* User */}
      <View
        style={{
          padding: 14,
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.07)",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: C.teal,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
            AG
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
            Ana García
          </Text>
          <Text style={{ color: "#4B6CA8", fontSize: 10 }}>{role}</Text>
        </View>
        <Feather name="log-out" size={14} color="#4B6CA8" />
      </View>
    </View>
  );
}

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
function TopBar({ activeNav, role }) {
  const labels = {
    dashboard: "Dashboard",
    empresas: "Gestión de Empresas",
    proyectos: "Gestión de Proyectos",
    seguimiento: "Seguimiento de Reportes",
    "reporte-final": "Reporte Final",
    notificaciones: "Notificaciones",
    calendario: "Calendario de Citas",
  };
  return (
    <View
      style={{
        backgroundColor: C.card,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        paddingHorizontal: 24,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Row style={{ alignItems: "center", gap: 5 }}>
          <Text style={{ fontSize: 11, color: C.textLight }}>VinculaTec</Text>
          <Feather name="chevron-right" size={11} color={C.textLight} />
          <Text style={{ fontSize: 11, color: C.textMuted }}>
            {labels[activeNav]}
          </Text>
        </Row>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            color: C.text,
            marginTop: 1,
          }}
        >
          {labels[activeNav]}
        </Text>
      </View>
      <Row style={{ alignItems: "center", gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: C.bg,
            borderRadius: 9,
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <Feather name="search" size={13} color={C.textLight} />
          <TextInput
            placeholder="Buscar..."
            style={{ fontSize: 13, color: C.text, width: 130 }}
            placeholderTextColor={C.textLight}
          />
        </View>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            backgroundColor: C.bg,
            borderWidth: 1,
            borderColor: C.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="bell" size={15} color={C.textMuted} />
          <View
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 7,
              height: 7,
              backgroundColor: C.red,
              borderRadius: 4,
              borderWidth: 1.5,
              borderColor: "white",
            }}
          />
        </View>
        <Row style={{ alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: C.teal,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
              AG
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, fontWeight: "700", color: C.text }}>
              Ana García
            </Text>
            <Text style={{ fontSize: 10, color: C.textLight }}>{role}</Text>
          </View>
        </Row>
      </Row>
    </View>
  );
}

// ─── COMPONENTES REUTILIZABLES ────────────────────────────────────────────────
function Row({ children, style }) {
  return <View style={[{ flexDirection: "row" }, style]}>{children}</View>;
}

function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: C.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: C.border,
          padding: 20,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  iconBg,
  iconColor,
  trend,
  trendUp,
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: C.border,
        padding: 18,
      }}
    >
      <Row
        style={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            backgroundColor: iconBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name={icon} size={18} color={iconColor} />
        </View>
        {trend && (
          <Row style={{ alignItems: "center", gap: 3 }}>
            <Feather
              name={trendUp ? "arrow-up" : "arrow-down"}
              size={11}
              color={trendUp ? C.green : C.red}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: trendUp ? C.green : C.red,
              }}
            >
              {trend}
            </Text>
          </Row>
        )}
      </Row>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "800",
          color: C.text,
          lineHeight: 28,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: C.textMuted,
          marginTop: 4,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
      {sub && (
        <Text style={{ fontSize: 11, color: C.textLight, marginTop: 3 }}>
          {sub}
        </Text>
      )}
    </View>
  );
}

function Badge({ text, color, bg }) {
  return (
    <View
      style={{
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 20,
        backgroundColor: bg,
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: "700", color }}>{text}</Text>
    </View>
  );
}

function SectionTitle({ title, action, actionLabel }) {
  return (
    <Row
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>
        {title}
      </Text>
      {action && (
        <TouchableOpacity
          onPress={action}
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
          <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </Row>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <View
      style={{
        height: 6,
        backgroundColor: C.bg,
        borderRadius: 3,
        overflow: "hidden",
        flex: 1,
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${pct}%`,
          backgroundColor: color || C.teal,
          borderRadius: 3,
        }}
      />
    </View>
  );
}

// ─── DASHBOARD RESIDENTE ──────────────────────────────────────────────────────
function DashResidente() {
  const steps = [
    { label: "Registro", done: true },
    { label: "Asignación", done: true },
    { label: "Reporte 1", done: true },
    { label: "Reporte 2", done: true },
    { label: "Reporte 3", done: false, active: true },
    { label: "Final", done: false },
  ];
  return (
    <View>
      <Row style={{ gap: 12, marginBottom: 16 }}>
        <StatCard
          label="Horas Completadas"
          value="384"
          sub="de 480 requeridas"
          icon="clock"
          iconBg={C.blueLight}
          iconColor={C.blue}
          trend="+12h"
          trendUp
        />
        <StatCard
          label="Reportes"
          value="2 / 3"
          sub="Reporte 3 pendiente"
          icon="file-text"
          iconBg={C.tealLight}
          iconColor={C.teal}
        />
        <StatCard
          label="Progreso"
          value="80%"
          sub="Buen ritmo"
          icon="trending-up"
          iconBg={C.greenLight}
          iconColor={C.green}
          trend="+5%"
          trendUp
        />
        <StatCard
          label="Días Restantes"
          value="28"
          sub="Fin: 20 ene 2025"
          icon="calendar"
          iconBg={C.amberLight}
          iconColor={C.amber}
        />
      </Row>

      <Row style={{ gap: 14 }}>
        <View style={{ flex: 2 }}>
          <Card style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: C.text,
                marginBottom: 16,
              }}
            >
              Progreso de Residencia
            </Text>
            <Row style={{ alignItems: "center", marginBottom: 16 }}>
              {steps.map((s, i) => (
                <Row
                  key={i}
                  style={{
                    alignItems: "center",
                    flex: i < steps.length - 1 ? 1 : 0,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: s.done
                          ? C.teal
                          : s.active
                            ? C.amber
                            : C.bg,
                        borderWidth: 2,
                        borderColor: s.done
                          ? C.teal
                          : s.active
                            ? C.amber
                            : C.border,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {s.done ? (
                        <Feather name="check" size={13} color="white" />
                      ) : s.active ? (
                        <Feather name="clock" size={11} color="white" />
                      ) : null}
                    </View>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: s.active ? "700" : "500",
                        color: s.done
                          ? C.teal
                          : s.active
                            ? C.amber
                            : C.textLight,
                        marginTop: 4,
                        textAlign: "center",
                      }}
                    >
                      {s.label}
                    </Text>
                  </View>
                  {i < steps.length - 1 && (
                    <View
                      style={{
                        flex: 1,
                        height: 2,
                        backgroundColor: s.done ? C.teal : C.border,
                        marginBottom: 14,
                        marginHorizontal: 2,
                      }}
                    />
                  )}
                </Row>
              ))}
            </Row>
            <View
              style={{
                backgroundColor: C.bg,
                borderRadius: 10,
                padding: 14,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Row style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <Text
                  style={{ fontSize: 13, fontWeight: "700", color: C.text }}
                >
                  Progreso de Horas
                </Text>
                <Text
                  style={{ fontSize: 13, fontWeight: "800", color: C.teal }}
                >
                  80%
                </Text>
              </Row>
              <ProgressBar pct={80} />
              <Row style={{ justifyContent: "space-between", marginTop: 6 }}>
                <Text style={{ fontSize: 11, color: C.textLight }}>
                  384 completadas
                </Text>
                <Text style={{ fontSize: 11, color: C.textLight }}>
                  96 restantes
                </Text>
              </Row>
            </View>
          </Card>

          <Card>
            <SectionTitle title="Mis Reportes" />
            {[
              [
                "Reporte 1 — Avance Inicial",
                "15 Oct",
                "12 Oct",
                "Aprobado",
                C.green,
                C.greenLight,
                "#065F46",
              ],
              [
                "Reporte 2 — Desarrollo",
                "15 Nov",
                "13 Nov",
                "Aprobado",
                C.green,
                C.greenLight,
                "#065F46",
              ],
              [
                "Reporte 3 — Avance Final",
                "15 Dic",
                "—",
                "Pendiente",
                C.amber,
                C.amberLight,
                "#92400E",
              ],
            ].map(([name, lim, ent, status, sc, sbg, stc], i) => (
              <View
                key={i}
                style={{
                  borderBottomWidth: i < 2 ? 1 : 0,
                  borderBottomColor: C.borderLight,
                  paddingVertical: 12,
                }}
              >
                <Row
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: C.text,
                      flex: 1,
                    }}
                  >
                    {name}
                  </Text>
                  <Badge text={status} color={stc} bg={sbg} />
                </Row>
                <Row style={{ gap: 16, marginTop: 4 }}>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>
                    Límite: <Text style={{ fontWeight: "600" }}>{lim}</Text>
                  </Text>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>
                    Entregado: <Text style={{ fontWeight: "600" }}>{ent}</Text>
                  </Text>
                </Row>
              </View>
            ))}
          </Card>
        </View>

        <View style={{ width: 280, gap: 14 }}>
          <Card>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: C.text,
                marginBottom: 14,
              }}
            >
              Mi Asesor
            </Text>
            <Row style={{ alignItems: "center", gap: 10, marginBottom: 14 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: C.teal,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "700", fontSize: 14 }}
                >
                  MR
                </Text>
              </View>
              <View>
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: C.text }}
                >
                  Dr. Marco Reyes
                </Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>
                  Ing. en Sistemas
                </Text>
              </View>
            </Row>
            {[
              ["mail", "m.reyes@tecnol.edu.mx"],
              ["phone", "Ext. 3142"],
              ["calendar", "Jue 10:00–12:00"],
            ].map(([icon, txt], i) => (
              <Row
                key={i}
                style={{ alignItems: "center", gap: 8, marginBottom: 7 }}
              >
                <Feather name={icon} size={12} color={C.textLight} />
                <Text style={{ fontSize: 12, color: C.textMuted }}>{txt}</Text>
              </Row>
            ))}
            <TouchableOpacity
              style={{
                backgroundColor: C.teal,
                borderRadius: 8,
                padding: 10,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
                Enviar mensaje
              </Text>
            </TouchableOpacity>
          </Card>

          <Card>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: C.text,
                marginBottom: 14,
              }}
            >
              Próximos Eventos
            </Text>
            {[
              ["18 Dic", "Entrega Reporte 3", C.amber, C.amberLight],
              ["20 Dic", "Reunión con Asesor", C.blue, C.blueLight],
              ["20 Ene", "Reporte Final", C.red, C.redLight],
              ["27 Ene", "Evaluación Final", C.green, C.greenLight],
            ].map(([date, label, c, bg], i) => (
              <Row
                key={i}
                style={{
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 8,
                  borderBottomWidth: i < 3 ? 1 : 0,
                  borderBottomColor: C.borderLight,
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    backgroundColor: bg,
                    borderRadius: 9,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 9, fontWeight: "800", color: c }}>
                    {date.split(" ")[0]}
                  </Text>
                  <Text style={{ fontSize: 8, color: c }}>
                    {date.split(" ")[1]}
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 12, fontWeight: "600", color: C.text }}
                >
                  {label}
                </Text>
              </Row>
            ))}
          </Card>
        </View>
      </Row>
    </View>
  );
}

// ─── DASHBOARD ASESOR ─────────────────────────────────────────────────────────
function DashAsesor() {
  const residentes = [
    ["Ana García", "Telmex / App Móvil", "384/480", 80, "En Progreso"],
    [
      "Luis Hernández",
      "Pemex / Dashboard",
      "320/480",
      67,
      "Pendiente Revisión",
    ],
    ["Sofía Martínez", "Bimbo / ERP", "440/480", 92, "Por Concluir"],
    ["Carlos López", "CFE / Automatización", "200/480", 42, "En Progreso"],
    ["María Torres", "IMSS / Portal Web", "480/480", 100, "Completado"],
  ];
  return (
    <View>
      <Row style={{ gap: 12, marginBottom: 16 }}>
        <StatCard
          label="Residentes Activos"
          value="12"
          sub="3 departamentos"
          icon="users"
          iconBg={C.tealLight}
          iconColor={C.teal}
          trend="+2"
          trendUp
        />
        <StatCard
          label="Reportes Pendientes"
          value="5"
          sub="Por revisar"
          icon="file-text"
          iconBg={C.amberLight}
          iconColor={C.amber}
        />
        <StatCard
          label="Tasa Aprobación"
          value="94%"
          sub="Último trimestre"
          icon="trending-up"
          iconBg={C.greenLight}
          iconColor={C.green}
          trend="+3%"
          trendUp
        />
        <StatCard
          label="Próx. Reuniones"
          value="3"
          sub="Esta semana"
          icon="calendar"
          iconBg={C.blueLight}
          iconColor={C.blue}
        />
      </Row>

      <Card style={{ marginBottom: 14 }}>
        <SectionTitle title="Mis Residentes" actionLabel="Asignar" />
        {/* Header */}
        <Row
          style={{
            backgroundColor: "#F8FAFC",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
            paddingVertical: 8,
          }}
        >
          {[
            "Residente",
            "Empresa / Proyecto",
            "Horas",
            "Progreso",
            "Estado",
          ].map((h, i) => (
            <Text
              key={i}
              style={{
                flex: i === 0 ? 1.5 : i === 1 ? 2 : 1,
                fontSize: 10,
                fontWeight: "700",
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                paddingHorizontal: 12,
              }}
            >
              {h}
            </Text>
          ))}
        </Row>
        {residentes.map(([name, company, hours, pct, status], i) => {
          const statusInfo = {
            Completado: [C.green, C.greenLight, "#065F46"],
            "Por Concluir": [C.teal, C.tealLight, "#0F4C75"],
            "Pendiente Revisión": [C.amber, C.amberLight, "#92400E"],
            "En Progreso": [C.blue, C.blueLight, "#1E40AF"],
          };
          const [sc, sbg, stc] = statusInfo[status] || [
            C.textLight,
            C.bg,
            C.textMuted,
          ];
          return (
            <Row
              key={i}
              style={{
                paddingVertical: 12,
                borderBottomWidth: i < residentes.length - 1 ? 1 : 0,
                borderBottomColor: C.borderLight,
                alignItems: "center",
              }}
            >
              <Row
                style={{
                  flex: 1.5,
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 12,
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: C.tealLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 9, fontWeight: "700", color: C.teal }}
                  >
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: C.text }}
                >
                  {name}
                </Text>
              </Row>
              <Text
                style={{
                  flex: 2,
                  fontSize: 12,
                  color: C.textMuted,
                  paddingHorizontal: 12,
                }}
              >
                {company}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: C.textSub,
                  paddingHorizontal: 12,
                }}
              >
                {hours}
              </Text>
              <Row
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 12,
                }}
              >
                <ProgressBar
                  pct={pct}
                  color={pct >= 90 ? C.green : pct >= 60 ? C.teal : C.amber}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: C.textMuted,
                    minWidth: 28,
                  }}
                >
                  {pct}%
                </Text>
              </Row>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Badge text={status} color={stc} bg={sbg} />
              </View>
            </Row>
          );
        })}
      </Card>

      <Row style={{ gap: 14 }}>
        <Card style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "800",
              color: C.text,
              marginBottom: 14,
            }}
          >
            Reportes Pendientes
          </Text>
          {[
            ["Luis Hernández", "Reporte 2", "Hace 2 días", C.amber],
            ["Carlos López", "Reporte 1", "Hace 5 días", C.red],
            ["Ana García", "Reporte 3", "Vence en 3 días", C.blue],
          ].map(([name, rep, sub, c], i) => (
            <Row
              key={i}
              style={{
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: i < 2 ? 1 : 0,
                borderBottomColor: C.borderLight,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: c,
                  marginRight: 10,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 13, fontWeight: "700", color: C.text }}
                >
                  {name} — {rep}
                </Text>
                <Text style={{ fontSize: 11, color: C.textMuted }}>{sub}</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: C.bg,
                  borderRadius: 7,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <Text
                  style={{ fontSize: 11, fontWeight: "600", color: C.text }}
                >
                  Revisar
                </Text>
              </TouchableOpacity>
            </Row>
          ))}
        </Card>

        <Card style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "800",
              color: C.text,
              marginBottom: 14,
            }}
          >
            Agenda de Reuniones
          </Text>
          {[
            ["Lun 16", "09:00", "Ana García", "Seguimiento Reporte 3"],
            ["Mié 18", "11:00", "Luis Hernández", "Revisión de Avances"],
            ["Vie 20", "10:00", "Sofía Martínez", "Pre-entrega Final"],
          ].map(([date, time, name, topic], i) => (
            <Row
              key={i}
              style={{
                paddingVertical: 10,
                borderBottomWidth: i < 2 ? 1 : 0,
                borderBottomColor: C.borderLight,
                gap: 12,
              }}
            >
              <View style={{ minWidth: 44 }}>
                <Text
                  style={{ fontSize: 11, fontWeight: "700", color: C.teal }}
                >
                  {date}
                </Text>
                <Text
                  style={{ fontSize: 13, fontWeight: "800", color: C.text }}
                >
                  {time}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 13, fontWeight: "700", color: C.text }}
                >
                  {name}
                </Text>
                <Text style={{ fontSize: 11, color: C.textMuted }}>
                  {topic}
                </Text>
              </View>
              <Feather name="check-circle" size={14} color={C.teal} />
            </Row>
          ))}
        </Card>
      </Row>
    </View>
  );
}

// ─── DASHBOARD JEFE ───────────────────────────────────────────────────────────
function DashJefe() {
  return (
    <View>
      <Row style={{ gap: 12, marginBottom: 16 }}>
        <StatCard
          label="Residentes Totales"
          value="86"
          sub="47 activos"
          icon="users"
          iconBg={C.tealLight}
          iconColor={C.teal}
          trend="+8"
          trendUp
        />
        <StatCard
          label="Empresas"
          value="34"
          sub="12 nuevas"
          icon="briefcase"
          iconBg={C.blueLight}
          iconColor={C.blue}
          trend="+5"
          trendUp
        />
        <StatCard
          label="Proyectos Activos"
          value="47"
          sub="5 por concluir"
          icon="folder"
          iconBg={C.purpleLight}
          iconColor={C.purple}
        />
        <StatCard
          label="Reportes Pendientes"
          value="18"
          sub="8 con atraso"
          icon="alert-circle"
          iconBg={C.redLight}
          iconColor={C.red}
        />
      </Row>

      <Row style={{ gap: 14, marginBottom: 14 }}>
        <Card style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "800",
              color: C.text,
              marginBottom: 14,
            }}
          >
            Distribución por Carrera
          </Text>
          {[
            ["Ing. en Sistemas", 28, C.teal],
            ["Ing. Industrial", 18, C.blue],
            ["Ing. Electrónica", 12, C.purple],
            ["Ing. Civil", 9, C.green],
            ["Ing. Mecatrónica", 8, C.amber],
            ["Otras", 11, C.textLight],
          ].map(([career, count, color]) => (
            <View key={career} style={{ marginBottom: 10 }}>
              <Row style={{ justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 12, color: C.textSub }}>{career}</Text>
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: C.text }}
                >
                  {count}
                </Text>
              </Row>
              <ProgressBar pct={(count / 86) * 100} color={color} />
            </View>
          ))}
        </Card>

        <Card style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "800",
              color: C.text,
              marginBottom: 14,
            }}
          >
            Empresas Más Activas
          </Text>
          <Row
            style={{
              backgroundColor: "#F8FAFC",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: C.border,
            }}
          >
            {["Empresa", "Residentes", "Estado"].map((h, i) => (
              <Text
                key={i}
                style={{
                  flex: i === 0 ? 2 : 1,
                  fontSize: 10,
                  fontWeight: "700",
                  color: C.textMuted,
                  textTransform: "uppercase",
                  paddingHorizontal: 12,
                }}
              >
                {h}
              </Text>
            ))}
          </Row>
          {[
            ["Telmex", 8],
            ["Pemex", 7],
            ["Bimbo", 6],
            ["CFE", 5],
            ["IMSS", 4],
          ].map(([name, n], i) => (
            <Row
              key={i}
              style={{
                paddingVertical: 11,
                borderBottomWidth: i < 4 ? 1 : 0,
                borderBottomColor: C.borderLight,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  fontSize: 13,
                  fontWeight: "700",
                  color: C.text,
                  paddingHorizontal: 12,
                }}
              >
                {name}
              </Text>
              <Badge text={`${n} activos`} color="#0F4C75" bg={C.tealLight} />
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Badge text="Activa" color="#065F46" bg={C.greenLight} />
              </View>
            </Row>
          ))}
        </Card>
      </Row>

      <Card>
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>
            Alertas y Acciones Requeridas
          </Text>
          <Badge text="8 urgentes" color={C.red} bg={C.redLight} />
        </Row>
        <Row style={{ gap: 12 }}>
          {[
            [
              "alert-triangle",
              "5 residentes con reporte vencido",
              C.red,
              C.redLight,
            ],
            [
              "clock",
              "3 empresas con convenio por vencer",
              C.amber,
              C.amberLight,
            ],
            [
              "check-circle",
              "12 residentes próximos a concluir",
              C.green,
              C.greenLight,
            ],
          ].map(([icon, text, c, bg], i) => (
            <View
              key={i}
              style={{
                flex: 1,
                backgroundColor: bg,
                borderRadius: 10,
                padding: 14,
              }}
            >
              <Feather
                name={icon}
                size={16}
                color={c}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: C.text,
                  marginBottom: 6,
                }}
              >
                {text}
              </Text>
              <Text style={{ fontSize: 11, color: c, fontWeight: "700" }}>
                Ver detalle →
              </Text>
            </View>
          ))}
        </Row>
      </Card>
    </View>
  );
}

// ─── GESTIÓN EMPRESAS ─────────────────────────────────────────────────────────
function GestionEmpresas() {
  const empresas = [
    [
      "Telmex S.A. de C.V.",
      "Telecomunicaciones",
      "CDMX",
      8,
      "Activa",
      "31 Dic 2025",
    ],
    ["Pemex Exploración", "Energía", "Veracruz", 7, "Activa", "15 Mar 2025"],
    ["Grupo Bimbo", "Manufactura", "CDMX", 6, "Activa", "30 Jun 2025"],
    ["CFE División Sureste", "Energía", "Mérida", 5, "Activa", "01 Feb 2025"],
    ["IMSS Delegación Sur", "Salud / TI", "Puebla", 4, "Activa", "30 Sep 2025"],
    [
      "Cinépolis Digital",
      "Entretenimiento",
      "CDMX",
      3,
      "Por Vencer",
      "20 Dic 2024",
    ],
    [
      "Femsa Servicios",
      "Logística",
      "Monterrey",
      2,
      "Por Vencer",
      "31 Dic 2024",
    ],
  ];
  const statusColor = {
    Activa: [C.green, C.greenLight, "#065F46"],
    "Por Vencer": [C.amber, C.amberLight, "#92400E"],
  };
  return (
    <View>
      <Row style={{ gap: 12, marginBottom: 16 }}>
        <StatCard
          label="Total Empresas"
          value="34"
          sub="Registradas"
          icon="briefcase"
          iconBg={C.tealLight}
          iconColor={C.teal}
        />
        <StatCard
          label="Activas"
          value="28"
          sub="Convenio vigente"
          icon="check-circle"
          iconBg={C.greenLight}
          iconColor={C.green}
        />
        <StatCard
          label="Por Vencer"
          value="4"
          sub="Próximos 60 días"
          icon="alert-circle"
          iconBg={C.amberLight}
          iconColor={C.amber}
        />
        <StatCard
          label="Nuevas"
          value="12"
          sub="Este ciclo 2024-B"
          icon="trending-up"
          iconBg={C.blueLight}
          iconColor={C.blue}
          trend="+3"
          trendUp
        />
      </Row>

      <Card>
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>
            Directorio de Empresas
          </Text>
          <Row style={{ gap: 8 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <Feather name="filter" size={13} color={C.textMuted} />
              <Text style={{ fontSize: 12, fontWeight: "600", color: C.text }}>
                Filtrar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: C.teal,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <Feather name="plus" size={13} color="white" />
              <Text style={{ fontSize: 12, fontWeight: "700", color: "white" }}>
                Nueva Empresa
              </Text>
            </TouchableOpacity>
          </Row>
        </Row>
        <Row
          style={{
            backgroundColor: "#F8FAFC",
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}
        >
          {[
            "Empresa",
            "Sector",
            "Ciudad",
            "Residentes",
            "Convenio",
            "Estado",
            "",
          ].map((h, i) => (
            <Text
              key={i}
              style={{
                flex: i === 0 ? 2 : i === 1 ? 1.5 : 1,
                fontSize: 10,
                fontWeight: "700",
                color: C.textMuted,
                textTransform: "uppercase",
                paddingHorizontal: 12,
              }}
            >
              {h}
            </Text>
          ))}
        </Row>
        {empresas.map(([name, sector, city, res, status, convenio], i) => {
          const [sc, sbg, stc] = statusColor[status] || [
            C.textLight,
            C.bg,
            C.textMuted,
          ];
          return (
            <Row
              key={i}
              style={{
                paddingVertical: 13,
                borderBottomWidth: i < empresas.length - 1 ? 1 : 0,
                borderBottomColor: C.borderLight,
                alignItems: "center",
              }}
            >
              <Row
                style={{
                  flex: 2,
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 12,
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: C.tealLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="briefcase" size={13} color={C.teal} />
                </View>
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: C.text }}
                >
                  {name}
                </Text>
              </Row>
              <Text
                style={{
                  flex: 1.5,
                  fontSize: 11,
                  color: C.textMuted,
                  paddingHorizontal: 12,
                }}
              >
                {sector}
              </Text>
              <Row
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 12,
                }}
              >
                <Feather name="map-pin" size={11} color={C.textLight} />
                <Text style={{ fontSize: 12, color: C.textSub }}>{city}</Text>
              </Row>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Badge
                  text={`${res} activos`}
                  color="#0F4C75"
                  bg={C.tealLight}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: "600",
                  color: status === "Por Vencer" ? C.amber : C.textSub,
                  paddingHorizontal: 12,
                }}
              >
                {convenio}
              </Text>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Badge text={status} color={stc} bg={sbg} />
              </View>
              <Row style={{ flex: 1, gap: 8, paddingHorizontal: 12 }}>
                <Feather name="eye" size={13} color={C.textLight} />
                <Feather name="edit-2" size={13} color={C.textLight} />
              </Row>
            </Row>
          );
        })}
      </Card>
    </View>
  );
}

// ─── GESTIÓN PROYECTOS ────────────────────────────────────────────────────────
function GestionProyectos() {
  const cols = [
    {
      label: "Propuesto",
      color: C.blue,
      cards: [
        {
          title: "Sistema de Inventarios",
          company: "Bimbo",
          student: "P. Ramírez",
          prio: "Alta",
        },
        {
          title: "Portal de Clientes",
          company: "Telmex",
          student: "Sin asignar",
          prio: "Media",
        },
      ],
    },
    {
      label: "En Desarrollo",
      color: C.amber,
      cards: [
        {
          title: "App Móvil iOS/Android",
          company: "Telmex",
          student: "A. García",
          prio: "Alta",
        },
        {
          title: "Dashboard BI",
          company: "Pemex",
          student: "L. Hernández",
          prio: "Alta",
        },
        {
          title: "Automatización CFE",
          company: "CFE",
          student: "C. López",
          prio: "Media",
        },
      ],
    },
    {
      label: "En Revisión",
      color: C.purple,
      cards: [
        {
          title: "Módulo de Nómina ERP",
          company: "Bimbo",
          student: "S. Martínez",
          prio: "Alta",
        },
        {
          title: "Sistema de Turnos",
          company: "IMSS",
          student: "M. Torres",
          prio: "Baja",
        },
      ],
    },
    {
      label: "Concluido",
      color: C.green,
      cards: [
        {
          title: "Portal Web Interno",
          company: "IMSS",
          student: "M. Torres",
          prio: "Media",
        },
        {
          title: "Migración BD",
          company: "CFE",
          student: "R. Vargas",
          prio: "Alta",
        },
      ],
    },
  ];
  const prioC = {
    Alta: [C.red, C.redLight],
    Media: [C.amber, C.amberLight],
    Baja: [C.green, C.greenLight],
  };
  return (
    <View>
      <Row
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Row style={{ gap: 24 }}>
          {[
            ["47", "Total"],
            ["31", "Activos"],
            ["9", "Concluidos"],
          ].map(([n, l]) => (
            <View key={l}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>
                {n}
              </Text>
              <Text style={{ fontSize: 11, color: C.textMuted }}>{l}</Text>
            </View>
          ))}
        </Row>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: C.teal,
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <Feather name="plus" size={13} color="white" />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>
            Nuevo Proyecto
          </Text>
        </TouchableOpacity>
      </Row>
      <Row style={{ gap: 12, alignItems: "flex-start" }}>
        {cols.map(({ label, color, cards }) => (
          <View key={label} style={{ flex: 1 }}>
            <Row style={{ alignItems: "center", gap: 7, marginBottom: 12 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: color,
                }}
              />
              <Text
                style={{ fontSize: 12, fontWeight: "700", color: C.textSub }}
              >
                {label}
              </Text>
              <View
                style={{
                  marginLeft: "auto",
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: C.bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: C.textMuted,
                  }}
                >
                  {cards.length}
                </Text>
              </View>
            </Row>
            {cards.map((card, i) => {
              const [pc, pbg] = prioC[card.prio];
              return (
                <View
                  key={i}
                  style={{
                    backgroundColor: C.card,
                    borderRadius: 11,
                    borderWidth: 1,
                    borderColor: C.border,
                    padding: 14,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: C.text,
                      marginBottom: 6,
                      lineHeight: 17,
                    }}
                  >
                    {card.title}
                  </Text>
                  <Row
                    style={{ alignItems: "center", gap: 5, marginBottom: 10 }}
                  >
                    <Feather name="briefcase" size={10} color={C.textLight} />
                    <Text style={{ fontSize: 10, color: C.textMuted }}>
                      {card.company}
                    </Text>
                  </Row>
                  <Row
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Row style={{ alignItems: "center", gap: 5 }}>
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          backgroundColor: C.tealLight,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 7,
                            fontWeight: "700",
                            color: C.teal,
                          }}
                        >
                          {card.student.charAt(0)}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 10, color: C.textMuted }}>
                        {card.student}
                      </Text>
                    </Row>
                    <Badge text={card.prio} color={pc} bg={pbg} />
                  </Row>
                </View>
              );
            })}
          </View>
        ))}
      </Row>
    </View>
  );
}

// ─── SEGUIMIENTO ──────────────────────────────────────────────────────────────
function Seguimiento() {
  const [selected, setSelected] = useState(null);
  const reportes = [
    {
      num: "1",
      title: "Reporte Parcial 1 — Diagnóstico Inicial",
      due: "15 Oct 2024",
      submitted: "12 Oct 2024",
      status: "Aprobado",
      score: 95,
      feedback:
        "Excelente diagnóstico inicial. Se identifica claramente el problema y la metodología a utilizar. Se recomienda profundizar en el análisis de requerimientos.",
    },
    {
      num: "2",
      title: "Reporte Parcial 2 — Desarrollo y Avances",
      due: "15 Nov 2024",
      submitted: "14 Nov 2024",
      status: "Aprobado",
      score: 88,
      feedback:
        "Buen progreso en el desarrollo. Las funcionalidades implementadas cumplen con los requisitos establecidos. Corregir la documentación de las APIs.",
    },
    {
      num: "3",
      title: "Reporte Parcial 3 — Integración y Pruebas",
      due: "15 Dic 2024",
      submitted: "—",
      status: "Pendiente",
      score: null,
      feedback: null,
    },
    {
      num: "F",
      title: "Reporte Final — Entrega Completa",
      due: "20 Ene 2025",
      submitted: "—",
      status: "Bloqueado",
      score: null,
      feedback: null,
    },
  ];
  return (
    <View>
      <Row style={{ gap: 12, marginBottom: 16 }}>
        <StatCard
          label="Reportes Aprobados"
          value="2 / 3"
          sub="Parciales"
          icon="check-circle"
          iconBg={C.greenLight}
          iconColor={C.green}
        />
        <StatCard
          label="Calif. Promedio"
          value="91.5"
          sub="Escala 0–100"
          icon="star"
          iconBg={C.amberLight}
          iconColor={C.amber}
        />
        <StatCard
          label="Próx. Vencimiento"
          value="15 Dic"
          sub="Reporte 3 — 3 días"
          icon="clock"
          iconBg={C.redLight}
          iconColor={C.red}
        />
        <StatCard
          label="Horas Documentadas"
          value="384h"
          sub="80% del total"
          icon="trending-up"
          iconBg={C.tealLight}
          iconColor={C.teal}
        />
      </Row>
      {reportes.map((r, i) => {
        const statusColors = {
          Aprobado: [C.green, C.greenLight, "#065F46"],
          Pendiente: [C.amber, C.amberLight, "#92400E"],
          Bloqueado: [C.textLight, C.bg, C.textMuted],
        };
        const [sc, sbg, stc] = statusColors[r.status];
        const isOpen = selected === i;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => setSelected(isOpen ? null : i)}
            style={{
              backgroundColor: C.card,
              borderRadius: 12,
              borderWidth: isOpen ? 2 : 1,
              borderColor: isOpen ? C.teal : C.border,
              padding: 18,
              marginBottom: 12,
            }}
          >
            <Row style={{ alignItems: "center", gap: 14 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor:
                    r.status === "Aprobado"
                      ? C.tealLight
                      : r.status === "Pendiente"
                        ? C.amberLight
                        : C.bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color:
                      r.status === "Aprobado"
                        ? C.teal
                        : r.status === "Pendiente"
                          ? C.amber
                          : C.textLight,
                  }}
                >
                  {r.num}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: C.text,
                    marginBottom: 4,
                  }}
                >
                  {r.title}
                </Text>
                <Row style={{ gap: 16 }}>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>
                    Límite: <Text style={{ fontWeight: "600" }}>{r.due}</Text>
                  </Text>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>
                    Entregado:{" "}
                    <Text style={{ fontWeight: "600" }}>{r.submitted}</Text>
                  </Text>
                </Row>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <Badge text={r.status} color={stc} bg={sbg} />
                {r.score && (
                  <Text
                    style={{ fontSize: 18, fontWeight: "800", color: C.text }}
                  >
                    {r.score}
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "400",
                        color: C.textMuted,
                      }}
                    >
                      /100
                    </Text>
                  </Text>
                )}
              </View>
              <Feather
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={16}
                color={C.textLight}
              />
            </Row>
            {isOpen && r.feedback && (
              <View
                style={{
                  marginTop: 14,
                  padding: 14,
                  backgroundColor: C.bg,
                  borderRadius: 10,
                  borderLeftWidth: 3,
                  borderLeftColor: C.teal,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: C.textMuted,
                    marginBottom: 6,
                  }}
                >
                  Retroalimentación del Asesor:
                </Text>
                <Text
                  style={{ fontSize: 13, color: C.textSub, lineHeight: 20 }}
                >
                  {r.feedback}
                </Text>
              </View>
            )}
            {isOpen && r.status === "Pendiente" && (
              <View
                style={{
                  marginTop: 14,
                  padding: 14,
                  backgroundColor: C.amberLight,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#92400E",
                    marginBottom: 10,
                  }}
                >
                  Este reporte está pendiente de entrega
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: C.amber,
                    borderRadius: 8,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    alignSelf: "flex-start",
                  }}
                >
                  <Feather name="upload" size={13} color="white" />
                  <Text
                    style={{ color: "white", fontWeight: "700", fontSize: 12 }}
                  >
                    Subir Reporte
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── REPORTE FINAL ────────────────────────────────────────────────────────────
function ReporteFinal() {
  const checklist = [
    ["Portada con datos del estudiante", true],
    ["Resumen ejecutivo (máx. 300 palabras)", true],
    ["Introducción y justificación", true],
    ["Marco teórico referenciado", true],
    ["Descripción detallada de actividades", true],
    ["Resultados y evidencias obtenidas", false],
    ["Conclusiones y recomendaciones", false],
    ["Referencias bibliográficas (APA 7)", false],
    ["Anexos y documentación técnica", false],
    ["Carta de terminación de la empresa", false],
    ["Evaluación del asesor externo", false],
    ["Firmas y sellos correspondientes", false],
  ];
  const done = checklist.filter(([, v]) => v).length;
  const pct = Math.round((done / checklist.length) * 100);
  return (
    <View>
      <View
        style={{
          backgroundColor: C.navy,
          borderRadius: 14,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Row style={{ alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Feather name="book-open" size={18} color={C.teal} />
              <Text style={{ fontSize: 18, fontWeight: "800", color: "white" }}>
                Reporte Final de Residencias
              </Text>
            </Row>
            <Text
              style={{ color: C.textLight, fontSize: 13, marginBottom: 14 }}
            >
              Ana García Mendoza · No. Control: 20CS1001 · Telmex S.A. de C.V.
            </Text>
            <Row style={{ gap: 20 }}>
              {[
                ["Fecha límite", "20 Ene 2025"],
                ["Asesor", "Dr. Marco Reyes"],
              ].map(([l, v]) => (
                <View key={l}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#4B6CA8",
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    {l}
                  </Text>
                  <Text
                    style={{ fontSize: 12, fontWeight: "700", color: "white" }}
                  >
                    {v}
                  </Text>
                </View>
              ))}
            </Row>
          </View>
          <View style={{ alignItems: "center", marginLeft: 20 }}>
            <Text
              style={{
                fontSize: 44,
                fontWeight: "800",
                color: C.teal,
                lineHeight: 48,
              }}
            >
              {pct}%
            </Text>
            <Text style={{ fontSize: 11, color: C.textLight }}>completado</Text>
            <View
              style={{
                marginTop: 8,
                height: 5,
                width: 90,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 3,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  backgroundColor: C.teal,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
        </Row>
      </View>

      <Row style={{ gap: 14 }}>
        <View style={{ flex: 2 }}>
          <Card style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: C.text,
                marginBottom: 14,
              }}
            >
              Lista de Verificación
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {checklist.map(([item, isDone], i) => (
                <View
                  key={i}
                  style={{
                    width: "47%",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: isDone ? "#F0FDF4" : C.bg,
                    borderWidth: 1,
                    borderColor: isDone ? "#BBF7D0" : C.border,
                  }}
                >
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      backgroundColor: isDone ? C.green : "white",
                      borderWidth: 1.5,
                      borderColor: isDone ? C.green : C.border,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 1,
                    }}
                  >
                    {isDone && <Feather name="check" size={10} color="white" />}
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: isDone ? "#065F46" : C.textMuted,
                      fontWeight: isDone ? "600" : "400",
                      flex: 1,
                      lineHeight: 16,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          <Card>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: C.text,
                marginBottom: 14,
              }}
            >
              Subir Documento
            </Text>
            <View
              style={{
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: C.border,
                borderRadius: 12,
                padding: 28,
                alignItems: "center",
                backgroundColor: C.bg,
              }}
            >
              <Feather
                name="upload"
                size={32}
                color={C.textLight}
                style={{ marginBottom: 12 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: C.text,
                  marginBottom: 4,
                }}
              >
                Arrastra tu reporte final aquí
              </Text>
              <Text
                style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}
              >
                Formato PDF · Máx. 30MB
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: C.teal,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                }}
              >
                <Feather name="upload" size={13} color="white" />
                <Text
                  style={{ color: "white", fontWeight: "700", fontSize: 13 }}
                >
                  Seleccionar Archivo
                </Text>
              </TouchableOpacity>
            </View>
            <Row
              style={{
                marginTop: 14,
                padding: 12,
                backgroundColor: C.bg,
                borderRadius: 9,
                borderWidth: 1,
                borderColor: C.border,
                alignItems: "center",
                gap: 10,
              }}
            >
              <Feather name="file-text" size={18} color={C.teal} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: C.text }}
                >
                  Reporte_Final_AG_v2.pdf
                </Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>
                  Subido hace 2 días · 4.7 MB
                </Text>
              </View>
              <Badge text="Borrador" color="#92400E" bg={C.amberLight} />
            </Row>
          </Card>
        </View>

        <View style={{ width: 280, gap: 14 }}>
          <Card>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: C.text,
                marginBottom: 14,
              }}
            >
              Cronograma Final
            </Text>
            {[
              ["Entrega borrador", "10 Ene 2025", true],
              ["Revisión asesor", "13 Ene 2025", false],
              ["Correcciones", "16 Ene 2025", false],
              ["Entrega definitiva", "20 Ene 2025", false],
              ["Presentación oral", "27 Ene 2025", false],
            ].map(([step, date, isDone], i) => (
              <Row
                key={i}
                style={{
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 9,
                  borderBottomWidth: i < 4 ? 1 : 0,
                  borderBottomColor: C.borderLight,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: isDone ? C.greenLight : C.bg,
                    borderWidth: 2,
                    borderColor: isDone ? C.green : C.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isDone && <Feather name="check" size={10} color={C.green} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: isDone ? "700" : "500",
                      color: isDone ? C.text : C.textMuted,
                    }}
                  >
                    {step}
                  </Text>
                  <Text style={{ fontSize: 11, color: C.textLight }}>
                    {date}
                  </Text>
                </View>
              </Row>
            ))}
          </Card>

          <Card>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: C.text,
                marginBottom: 14,
              }}
            >
              Rúbrica
            </Text>
            {[
              ["Contenido técnico", 35],
              ["Presentación", 20],
              ["Resultados", 25],
              ["Conclusiones", 20],
            ].map(([crit, pts]) => (
              <View key={crit} style={{ marginBottom: 10 }}>
                <Row
                  style={{ justifyContent: "space-between", marginBottom: 4 }}
                >
                  <Text style={{ fontSize: 12, color: C.textSub }}>{crit}</Text>
                  <Text
                    style={{ fontSize: 12, fontWeight: "700", color: C.teal }}
                  >
                    {pts} pts
                  </Text>
                </Row>
                <ProgressBar pct={pts} color={C.teal} />
              </View>
            ))}
            <View
              style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: C.tealLight,
                borderRadius: 9,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: "#0F4C75",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                Mínimo aprobatorio
              </Text>
              <Text style={{ fontSize: 24, fontWeight: "800", color: C.teal }}>
                70 / 100
              </Text>
            </View>
          </Card>
        </View>
      </Row>
    </View>
  );
}

// ─── NOTIFICACIONES ───────────────────────────────────────────────────────────
function Notificaciones() {
  const notifs = [
    {
      type: "warning",
      icon: "alert-triangle",
      title: "Reporte 3 próximo a vencer",
      body: "Tu Reporte Parcial 3 tiene fecha límite el 15 de diciembre. Quedan 3 días hábiles para la entrega.",
      time: "Hace 2 horas",
      unread: true,
    },
    {
      type: "success",
      icon: "check-circle",
      title: "Reporte 2 aprobado",
      body: "El Dr. Marco Reyes ha aprobado tu Reporte Parcial 2 con calificación de 88/100. Consulta la retroalimentación.",
      time: "Hace 1 día",
      unread: true,
    },
    {
      type: "info",
      icon: "calendar",
      title: "Reunión programada",
      body: "Reunión de seguimiento confirmada con el Dr. Reyes para el jueves 20 de diciembre a las 10:00 hrs.",
      time: "Hace 2 días",
      unread: true,
    },
    {
      type: "info",
      icon: "mail",
      title: "Mensaje de tu asesor",
      body: "El Dr. Reyes ha enviado comentarios adicionales sobre el avance del módulo de autenticación.",
      time: "Hace 3 días",
      unread: true,
    },
    {
      type: "success",
      icon: "check-circle",
      title: "Carta de aceptación registrada",
      body: "Tu carta de Telmex S.A. de C.V. ha sido registrada exitosamente en el sistema.",
      time: "Hace 5 días",
      unread: false,
    },
    {
      type: "info",
      icon: "bell",
      title: "Actualización del sistema",
      body: "VinculaTec ha sido actualizado a la versión 2.4. Nuevas funciones disponibles.",
      time: "Hace 1 semana",
      unread: false,
    },
  ];
  const typeStyle = {
    warning: [C.amber, C.amberLight],
    success: [C.green, C.greenLight],
    info: [C.blue, C.blueLight],
  };
  return (
    <View style={{ maxWidth: 720 }}>
      <Row
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Row style={{ gap: 20 }}>
          {[
            ["4", "Sin Leer", C.teal],
            ["2", "Leídas", C.textMuted],
            ["6", "Total", C.textMuted],
          ].map(([n, l, c]) => (
            <View key={l}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: c }}>
                {n}
              </Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>{l}</Text>
            </View>
          ))}
        </Row>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 7,
          }}
        >
          <Feather name="refresh-cw" size={13} color={C.textMuted} />
          <Text style={{ fontSize: 12, fontWeight: "600", color: C.text }}>
            Marcar todo como leído
          </Text>
        </TouchableOpacity>
      </Row>
      {notifs.map((n, i) => {
        const [c, bg] = typeStyle[n.type] || [C.blue, C.blueLight];
        return (
          <View
            key={i}
            style={{
              backgroundColor: C.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: n.unread ? c + "40" : C.border,
              padding: 18,
              marginBottom: 10,
              flexDirection: "row",
              gap: 14,
            }}
          >
            {n.unread && (
              <View
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: c,
                }}
              />
            )}
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: bg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name={n.icon} size={18} color={c} />
            </View>
            <View style={{ flex: 1 }}>
              <Row style={{ alignItems: "center", gap: 8, marginBottom: 5 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: C.text }}
                >
                  {n.title}
                </Text>
                {n.unread && <Badge text="Nuevo" color={c} bg={bg} />}
              </Row>
              <Text
                style={{
                  fontSize: 13,
                  color: C.textMuted,
                  lineHeight: 20,
                  marginBottom: 6,
                }}
              >
                {n.body}
              </Text>
              <Row style={{ gap: 12 }}>
                <Text style={{ fontSize: 11, color: C.textLight }}>
                  {n.time}
                </Text>
                <Text
                  style={{ fontSize: 11, color: C.teal, fontWeight: "700" }}
                >
                  Ver detalle
                </Text>
              </Row>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── CALENDARIO ───────────────────────────────────────────────────────────────
function CalendarioCitas() {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const events = {
    5: [{ title: "Reunión Asesor", type: "info" }],
    10: [{ title: "Reporte 2", type: "success" }],
    15: [{ title: "Límite R3", type: "warning" }],
    18: [{ title: "Reunión", type: "info" }],
    20: [{ title: "Cita Telmex", type: "purple" }],
    27: [{ title: "Evaluación", type: "danger" }],
  };
  const typeC = {
    info: C.blue,
    success: C.green,
    warning: C.amber,
    danger: C.red,
    purple: C.purple,
  };
  const typeBg = {
    info: C.blueLight,
    success: C.greenLight,
    warning: C.amberLight,
    danger: C.redLight,
    purple: C.purpleLight,
  };
  const cells = [
    null,
    null,
    null,
    null,
    null,
    null,
    ...Array.from({ length: 31 }, (_, i) => i + 1),
  ];

  const upcoming = [
    {
      day: "15 Dic",
      title: "Límite Reporte 3",
      time: "23:59",
      type: "warning",
      who: "Sistema",
    },
    {
      day: "18 Dic",
      title: "Reunión Seguimiento",
      time: "10:00 AM",
      type: "info",
      who: "Dr. Marco Reyes",
    },
    {
      day: "20 Dic",
      title: "Cita en empresa",
      time: "09:00 AM",
      type: "purple",
      who: "Ing. Rosa Fuentes",
    },
    {
      day: "20 Ene",
      title: "Entrega Reporte Final",
      time: "23:59",
      type: "danger",
      who: "Sistema",
    },
    {
      day: "27 Ene",
      title: "Evaluación Final",
      time: "10:00 AM",
      type: "success",
      who: "Comité evaluador",
    },
  ];

  return (
    <Row style={{ gap: 14, alignItems: "flex-start" }}>
      <Card style={{ flex: 1 }}>
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>
            Diciembre 2024
          </Text>
          <Row style={{ gap: 8 }}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 8,
                padding: 7,
              }}
            >
              <Feather name="chevron-left" size={14} color={C.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 8,
                padding: 7,
              }}
            >
              <Feather name="chevron-right" size={14} color={C.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: C.teal,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <Feather name="plus" size={13} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
                Nueva Cita
              </Text>
            </TouchableOpacity>
          </Row>
        </Row>
        <Row style={{ marginBottom: 4 }}>
          {days.map((d) => (
            <Text
              key={d}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 11,
                fontWeight: "700",
                color: C.textLight,
                paddingVertical: 6,
              }}
            >
              {d}
            </Text>
          ))}
        </Row>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {cells.map((day, i) => {
            const ev = day ? events[day] : null;
            const isToday = day === 12;
            return (
              <View
                key={i}
                style={{ width: `${100 / 7}%`, minHeight: 68, padding: 4 }}
              >
                {day && (
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 8,
                      backgroundColor: isToday
                        ? C.navy
                        : ev
                          ? "#FAFCFE"
                          : "transparent",
                      borderWidth: ev && !isToday ? 1 : 0,
                      borderColor: C.border,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: isToday ? "800" : "500",
                        color: isToday ? "white" : C.text,
                        textAlign: "center",
                        marginBottom: 3,
                      }}
                    >
                      {day}
                    </Text>
                    {ev &&
                      ev.map((e, j) => (
                        <View
                          key={j}
                          style={{
                            backgroundColor: typeBg[e.type],
                            borderRadius: 4,
                            paddingHorizontal: 3,
                            paddingVertical: 2,
                            marginBottom: 2,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 8,
                              fontWeight: "700",
                              color: typeC[e.type],
                            }}
                            numberOfLines={1}
                          >
                            {e.title}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <Row
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: C.border,
            gap: 16,
          }}
        >
          {[
            ["Reunión", C.blue],
            ["Entrega", C.green],
            ["Vencimiento", C.amber],
            ["Evaluación", C.red],
          ].map(([label, c]) => (
            <Row key={label} style={{ alignItems: "center", gap: 5 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: c,
                }}
              />
              <Text style={{ fontSize: 11, color: C.textMuted }}>{label}</Text>
            </Row>
          ))}
        </Row>
      </Card>

      <View style={{ width: 290, gap: 14 }}>
        <Card>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "800",
              color: C.text,
              marginBottom: 14,
            }}
          >
            Próximas Citas
          </Text>
          {upcoming.map(({ day, title, time, type, who }, i) => (
            <Row
              key={i}
              style={{
                gap: 12,
                paddingVertical: 10,
                borderBottomWidth: i < upcoming.length - 1 ? 1 : 0,
                borderBottomColor: C.borderLight,
              }}
            >
              <View style={{ minWidth: 40, alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "800",
                    color: typeC[type],
                  }}
                >
                  {day.split(" ")[0]}
                </Text>
                <Text style={{ fontSize: 9, color: C.textLight }}>
                  {day.split(" ")[1]}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  borderLeftWidth: 2,
                  borderLeftColor: typeC[type],
                  paddingLeft: 10,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: C.text }}
                >
                  {title}
                </Text>
                <Text
                  style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}
                >
                  {time} · {who}
                </Text>
              </View>
            </Row>
          ))}
        </Card>

        <Card>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "800",
              color: C.text,
              marginBottom: 14,
            }}
          >
            Agendar Cita
          </Text>
          {[
            ["Motivo", "Ej: Seguimiento de proyecto"],
            ["Participante", "Nombre del participante"],
            ["Fecha", "DD/MM/AAAA"],
            ["Hora", "00:00"],
          ].map(([label, ph]) => (
            <View key={label} style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 5,
                }}
              >
                {label}
              </Text>
              <TextInput
                placeholder={ph}
                placeholderTextColor={C.textLight}
                style={{
                  padding: 9,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: C.border,
                  fontSize: 12,
                  color: C.text,
                  backgroundColor: "#FAFAFA",
                }}
              />
            </View>
          ))}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: C.teal,
              borderRadius: 8,
              paddingVertical: 11,
            }}
          >
            <Feather name="send" size={13} color="white" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>
              Solicitar Cita
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
    </Row>
  );
}
