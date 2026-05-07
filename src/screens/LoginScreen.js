import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import Row from "../components/Row";

export default function LoginScreen({ loginRole, setLoginRole, onLogin }) {
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
