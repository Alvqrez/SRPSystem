import { View, Text, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import Row from "./Row";

// TopBar construye el label del breadcrumb a partir de navItems dinámico del rol
export default function TopBar({ activeNav, navItems = [], role, onLogout }) {
  const currentItem = navItems.find((item) => item.id === activeNav);
  const pageTitle = currentItem ? currentItem.label : "Dashboard";

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
          <Text style={{ fontSize: 11, color: C.textMuted }}>{pageTitle}</Text>
        </Row>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            color: C.text,
            marginTop: 1,
          }}
        >
          {pageTitle}
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
