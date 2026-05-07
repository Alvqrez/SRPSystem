import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { NAV, ROLES } from "../constants/navigation";
import Row from "./Row";

export default function Sidebar({ activeNav, setActiveNav, role, setRole }) {
  return (
    <View style={{ width: 230, backgroundColor: C.navy, flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)" }}>
        <Row style={{ alignItems: "center", gap: 9, marginBottom: 14 }}>
          <View style={{ width: 32, height: 32, backgroundColor: C.teal, borderRadius: 9, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "white", fontWeight: "800", fontSize: 13 }}>VT</Text>
          </View>
          <View>
            <Text style={{ color: "white", fontWeight: "800", fontSize: 15 }}>VinculaTec</Text>
            <Text style={{ color: "#3D5A8A", fontSize: 10 }}>v2.4 — 2024-B</Text>
          </View>
        </Row>
        {/* Role switcher */}
        <View style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 3, flexDirection: "row", gap: 3 }}>
          {ROLES.map((r) => (
            <TouchableOpacity key={r} onPress={() => setRole(r)} style={{ flex: 1, paddingVertical: 5, borderRadius: 6, backgroundColor: role === r ? C.teal : "transparent", alignItems: "center" }}>
              <Text style={{ color: role === r ? "white" : "#64748B", fontSize: 8, fontWeight: "700" }}>
                {r === "Jefe de Vinculación" ? "Jefe V." : r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Nav items */}
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 9, fontWeight: "700", color: "#3D5A8A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingHorizontal: 6 }}>Navegación</Text>
        {NAV.map(({ id, label, icon }) => {
          const active = activeNav === id;
          return (
            <TouchableOpacity key={id} onPress={() => setActiveNav(id)} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 9, backgroundColor: active ? "rgba(13,148,136,0.2)" : "transparent", marginBottom: 2 }}>
              <Feather name={icon} size={15} color={active ? "#5EEAD4" : C.textLight} />
              <Text style={{ color: active ? "#5EEAD4" : C.textLight, fontSize: 13, fontWeight: active ? "700" : "500", flex: 1 }}>{label}</Text>
              {id === "notificaciones" && (
                <View style={{ width: 18, height: 18, backgroundColor: C.red, borderRadius: 9, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "white", fontSize: 9, fontWeight: "700" }}>4</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* User */}
      <View style={{ padding: 14, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.07)", flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>AG</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>Ana García</Text>
          <Text style={{ color: "#4B6CA8", fontSize: 10 }}>{role}</Text>
        </View>
        <Feather name="log-out" size={14} color="#4B6CA8" />
      </View>
    </View>
  );
}
