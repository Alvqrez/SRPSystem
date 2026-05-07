import { Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import Row from "./Row";

export default function SectionTitle({ title, action, actionLabel }) {
  return (
    <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <Text style={{ fontSize: 14, fontWeight: "800", color: C.text }}>{title}</Text>
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
          <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </Row>
  );
}
