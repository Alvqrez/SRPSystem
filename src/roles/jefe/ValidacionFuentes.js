import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../../constants/colors";
import { Row, Card, Badge } from "../../components";

const ESTUDIANTES = [
  {
    nombre: "Oscar",
    carrera: "Ing. en Sistemas de Información",
    fuenteDeclarada: "Propuesta Propia",
    tipoFuente: "propia",
  },
  {
    nombre: "Ana García",
    carrera: "Ing. Industrial",
    fuenteDeclarada: "Banco de Proyectos",
    tipoFuente: "banco",
  },
  {
    nombre: "Luis Hernández",
    carrera: "Ing. en Sistemas",
    fuenteDeclarada: "Propuesta Empresa",
    tipoFuente: "empresa",
  },
  {
    nombre: "Sofía Martínez",
    carrera: "Ing. Industrial",
    fuenteDeclarada: "Propuesta Propia",
    tipoFuente: "propia",
  },
];

const FUENTE_STYLES = {
  banco: { bg: "#e0f2fe", color: "#0369a1", label: "Banco de Proyectos" },
  propia: { bg: "#fef3c7", color: "#92400e", label: "Propuesta Propia" },
  empresa: { bg: "#dcfce7", color: "#166534", label: "Propuesta Empresa" },
};

export default function ValidacionFuentes({ onNavigate }) {
  const [estudiantes, setEstudiantes] = useState(
    ESTUDIANTES.map((e) => ({ ...e, autorizado: false }))
  );

  const autorizarFuente = (index) => {
    const copy = [...estudiantes];
    copy[index].autorizado = true;
    setEstudiantes(copy);
  };

  return (
    <View>
      {/* Header */}
      <Card style={{ marginBottom: 16, padding: 0, overflow: "hidden" }}>
        <View style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: C.border }}>
          <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>Validación de Fuente del Proyecto</Text>
              <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Clasificación obligatoria para Reporte Preliminar</Text>
            </View>
            <Badge text="ITV-AC-PO-004-A01" color={C.teal} bg="#e6f6f5" />
          </Row>
        </View>

        {/* Navegación */}
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: C.border }}>
          <Row style={{ alignItems: "center", gap: 12 }}>
            <TouchableOpacity onPress={() => onNavigate && onNavigate("proyectos")} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text style={{ fontSize: 18, color: C.teal }}>←</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: C.teal }}>Volver al listado</Text>
            </TouchableOpacity>
            <Text style={{ color: "#cbd5e1" }}>|</Text>
            <Text style={{ fontSize: 12, color: C.textMuted }}>
              Procesos Académicos / <Text style={{ color: C.text, fontWeight: "500" }}>Revisión de Proyecto</Text>
            </Text>
          </Row>
        </View>

        {/* Tabla */}
        <View>
          {/* Header de tabla */}
          <Row style={{ backgroundColor: "#fafbfc", paddingVertical: 15, paddingHorizontal: 32, borderBottomWidth: 1, borderBottomColor: C.borderLight }}>
            {["Estudiante / Proyecto", "Fuente Declarada", "Validación", "Acción"].map((h, i) => (
              <Text key={i} style={{ flex: i === 0 ? 2 : 1, fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase" }}>{h}</Text>
            ))}
          </Row>

          {/* Filas */}
          {estudiantes.map((est, i) => {
            const style = FUENTE_STYLES[est.tipoFuente];
            return (
              <Row key={i} style={{ paddingVertical: 20, paddingHorizontal: 32, borderBottomWidth: i < estudiantes.length - 1 ? 1 : 0, borderBottomColor: C.borderLight, alignItems: "center" }}>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{est.nombre}</Text>
                  <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{est.carrera}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: style.bg, alignSelf: "flex-start" }}>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: style.color }}>{style.label}</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ padding: 6, borderRadius: 4, borderWidth: 1, borderColor: C.border, backgroundColor: "white" }}>
                    <Text style={{ fontSize: 13, color: C.textSub }}>Validar como {style.label}</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  {est.autorizado ? (
                    <Row style={{ alignItems: "center", gap: 6 }}>
                      <Feather name="check-circle" size={16} color={C.green} />
                      <Text style={{ fontSize: 13, fontWeight: "600", color: C.green }}>Autorizado</Text>
                    </Row>
                  ) : (
                    <TouchableOpacity
                      onPress={() => autorizarFuente(i)}
                      style={{ backgroundColor: C.teal, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, alignSelf: "flex-start" }}
                    >
                      <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>Autorizar Fuente</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Row>
            );
          })}
        </View>
      </Card>

      {/* Nota */}
      <View style={{ padding: 20, borderWidth: 1, borderStyle: "dashed", borderColor: C.border, borderRadius: 12 }}>
        <Text style={{ fontSize: 13, color: C.textMuted }}>
          <Text style={{ fontWeight: "700" }}>Nota de cumplimiento: </Text>
          El Jefe de Departamento debe confirmar que la fuente declarada coincida con los registros oficiales antes de proceder a la firma del dictamen.
        </Text>
      </View>
    </View>
  );
}
