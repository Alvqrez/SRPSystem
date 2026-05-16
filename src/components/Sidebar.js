import { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import Row from "./Row";
import { useNotificaciones } from "../context/NotificacionesContext";

const groupHasActive = (group, activeNav) =>
  group.children?.some((c) => c.id === activeNav) ?? false;

function getSaludo() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "¡Buenos días!";
  if (h >= 12 && h < 19) return "¡Buenas tardes!";
  return "¡Buenas noches!";
}

function getRolLabel(role) {
  if (!role) return "Usuario";
  const r = role.toLowerCase();
  if (r === "residente") return "Residente";
  if (r === "asesor") return "Asesor";
  if (r === "jefe") return "Jefe de Vinculación";
  return role;
}

export default function Sidebar({
  activeNav,
  setActiveNav,
  role,
  navItems = [],
  onLogout,
  usuario,
  fotoPerfil,
}) {
  const { unreadCount } = useNotificaciones() || { unreadCount: 0 };

  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    navItems.forEach((item) => {
      if (item.group) init[item.id] = groupHasActive(item, activeNav);
    });
    return init;
  });

  const toggleGroup = (id) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const initials = usuario?.nombre
    ? usuario.nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const saludo = getSaludo();
  const rolLabel = getRolLabel(role);
  const nombre = usuario?.nombre || "Usuario";

  const NavItem = ({ id, label, icon, indent = false }) => {
    const active = activeNav === id;
    const count = id === "notificaciones" ? unreadCount : 0;
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
          paddingLeft: indent ? 28 : 12,
          borderRadius: 9,
          backgroundColor: active ? "rgba(13,148,136,0.2)" : "transparent",
          marginBottom: 2,
        }}
      >
        {indent && (
          <View
            style={{
              width: 2,
              height: 16,
              backgroundColor: active ? "#5EEAD4" : "rgba(255,255,255,0.1)",
              borderRadius: 1,
              marginRight: -2,
            }}
          />
        )}
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
        {count > 0 && (
          <View
            style={{
              minWidth: 18,
              height: 18,
              backgroundColor: C.red,
              borderRadius: 9,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 4,
            }}
          >
            <Text style={{ color: "white", fontSize: 9, fontWeight: "700" }}>
              {count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        width: 230,
        backgroundColor: C.navy,
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* ── Sección de perfil ───────────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={() => setActiveNav && setActiveNav("utilerias")}
        activeOpacity={0.85}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.07)",
          alignItems: "center",
        }}
      >
        {/* 1 — Saludo */}
        <Text
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            fontWeight: "500",
            marginBottom: 3,
          }}
        >
          {saludo}
        </Text>

        {/* 2 — Nombre */}
        <Text
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: "800",
            marginBottom: 10,
            textAlign: "center",
          }}
          numberOfLines={1}
        >
          {nombre}
        </Text>

        {/* 3 — Foto de perfil / avatar */}
        {fotoPerfil ? (
          <Image
            source={{ uri: fotoPerfil }}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              borderWidth: 2,
              borderColor: C.teal,
              marginBottom: 8,
            }}
          />
        ) : (
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: C.teal,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
              borderWidth: 2,
              borderColor: "rgba(94,234,212,0.35)",
            }}
          >
            <Text style={{ color: "white", fontWeight: "800", fontSize: 18 }}>
              {initials}
            </Text>
          </View>
        )}

        {/* 4 — Rol */}
        <View
          style={{
            backgroundColor: "rgba(13,148,136,0.2)",
            borderRadius: 20,
            paddingVertical: 3,
            paddingHorizontal: 12,
            marginBottom: 7,
            borderWidth: 1,
            borderColor: "rgba(94,234,212,0.2)",
          }}
        >
          <Text style={{ color: "#5EEAD4", fontSize: 10, fontWeight: "700" }}>
            {rolLabel}
          </Text>
        </View>

        {/* 5 — Ver perfil */}
        <Row style={{ alignItems: "center", gap: 3 }}>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
            Ver perfil
          </Text>
          <Feather name="arrow-right" size={9} color="rgba(255,255,255,0.4)" />
        </Row>
      </TouchableOpacity>

      {/* ── Navegación ─────────────────────────────────────────────────────────── */}
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

        {navItems.map((item) => {
          if (!item.group) {
            return <NavItem key={item.id} {...item} />;
          }

          const isOpen = openGroups[item.id] ?? false;
          const childActive = groupHasActive(item, activeNav);

          return (
            <View key={item.id}>
              <TouchableOpacity
                onPress={() => toggleGroup(item.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 9,
                  paddingHorizontal: 12,
                  borderRadius: 9,
                  backgroundColor: childActive
                    ? "rgba(13,148,136,0.1)"
                    : "transparent",
                  marginBottom: 2,
                }}
              >
                <Feather
                  name={item.icon}
                  size={15}
                  color={childActive ? "#5EEAD4" : C.textLight}
                />
                <Text
                  style={{
                    flex: 1,
                    color: childActive ? "#5EEAD4" : C.textLight,
                    fontSize: 13,
                    fontWeight: childActive ? "700" : "500",
                  }}
                >
                  {item.label}
                </Text>
                <Feather
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={13}
                  color={childActive ? "#5EEAD4" : "#3D5A8A"}
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={{ marginBottom: 4 }}>
                  {item.children.map((child) => (
                    <NavItem key={child.id} {...child} indent />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* ── Logout ─────────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={onLogout}
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
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: "rgba(239,68,68,0.12)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="log-out" size={15} color="#EF4444" />
        </View>
        <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "600" }}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
