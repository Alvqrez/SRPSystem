import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import Row from "./Row";

// Sidebar recibe navItems dinámico según el rol, y onLogout para cerrar sesión
export default function Sidebar({
  activeNav,
  setActiveNav,
  role,
  navItems = [],
  onLogout,
}) {
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
        <Row style={{ alignItems: "center", gap: 9, marginBottom: 10 }}>
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

        {/* Rol badge */}
        <View
          style={{
            backgroundColor: "rgba(13,148,136,0.15)",
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: 10,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "#5EEAD4", fontSize: 11, fontWeight: "700" }}>
            {role === "Jefe de Vinculación" ? "Jefe de Vinculación" : role}
          </Text>
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
        {navItems.map(({ id, label, icon }) => {
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

      {/* User + Logout */}
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
      </TouchableOpacity>
    </View>
  );
}
