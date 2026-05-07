import { View, Text } from "react-native";

export default function Badge({ text, color, bg }) {
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
