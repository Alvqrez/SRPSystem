import { View } from "react-native";
import C from "../constants/colors";

export default function Card({ children, style }) {
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
