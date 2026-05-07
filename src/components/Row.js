import { View } from "react-native";

export default function Row({ children, style }) {
  return <View style={[{ flexDirection: "row" }, style]}>{children}</View>;
}
