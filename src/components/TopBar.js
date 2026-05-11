import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import Row from "./Row";
import { useNotificaciones } from "../context/NotificacionesContext";

export default function TopBar({ activeNav, navItems = [], setActiveNav, role, onLogout, usuario }) {
  const [query, setQuery] = useState("");
  const { unreadCount } = useNotificaciones() || { unreadCount: 0 };
  // Busca también dentro de grupos colapsables
  const findNavItem = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.group && item.children) {
        const child = item.children.find((c) => c.id === id);
        if (child) return child;
      }
    }
    return null;
  };
  const currentItem = findNavItem(navItems, activeNav);
  const pageTitle   = currentItem ? currentItem.label : "Dashboard";
  const hasNotif    = navItems.some((item) => item.id === "notificaciones");
  const initials    = usuario?.nombre
    ? usuario.nombre.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";
  const searchSection = () => {
    if (!query.trim()) return;
    const q = query.trim().toLowerCase();
    // Busca en items directos y en hijos de grupos
    for (const item of navItems) {
      if (!item.group && item.label.toLowerCase().includes(q)) {
        if (setActiveNav) setActiveNav(item.id);
        setQuery("");
        return;
      }
      if (item.group && item.children) {
        const child = item.children.find((c) => c.label.toLowerCase().includes(q));
        if (child) { if (setActiveNav) setActiveNav(child.id); setQuery(""); return; }
      }
    }
  };

  return (
    <View style={{ backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border,
      paddingHorizontal: 24, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <View>
        <Row style={{ alignItems: "center", gap: 5 }}>
          <Text style={{ fontSize: 11, color: C.textLight }}>VinculaTec</Text>
          <Feather name="chevron-right" size={11} color={C.textLight} />
          <Text style={{ fontSize: 11, color: C.textMuted }}>{pageTitle}</Text>
        </Row>
        <Text style={{ fontSize: 17, fontWeight: "800", color: C.text, marginTop: 1 }}>{pageTitle}</Text>
      </View>

      <Row style={{ alignItems: "center", gap: 12 }}>
        {/* Buscador */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.bg, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: C.border }}>
          <Feather name="search" size={13} color={C.textLight} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={searchSection}
            placeholder="Buscar..."
            style={{ fontSize: 13, color: C.text, width: 130 }}
            placeholderTextColor={C.textLight}
          />
        </View>

        {/* Campana con contador dinámico */}
        <TouchableOpacity
          onPress={() => hasNotif && setActiveNav && setActiveNav("notificaciones")}
          style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" }}
        >
          <Feather name="bell" size={15} color={C.textMuted} />
          {unreadCount > 0 && (
            <View style={{ position: "absolute", top: -4, right: -4, minWidth: 16, height: 16,
              backgroundColor: C.red, borderRadius: 8, alignItems: "center", justifyContent: "center",
              paddingHorizontal: 3, borderWidth: 1.5, borderColor: "white" }}>
              <Text style={{ color: "white", fontSize: 8, fontWeight: "800" }}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Usuario */}
        <Row style={{ alignItems: "center", gap: 8 }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>{initials}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, fontWeight: "700", color: C.text }}>{usuario?.nombre || "Usuario"}</Text>
            <Text style={{ fontSize: 10, color: C.textLight }}>{role}</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={{ marginLeft: 4 }}>
            <Feather name="log-out" size={15} color={C.textMuted} />
          </TouchableOpacity>
        </Row>
      </Row>
    </View>
  );
}
