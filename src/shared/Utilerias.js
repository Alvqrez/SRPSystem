import { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card } from "../components";

const INFO_POR_ROL = {
  "Jefe de Vinculación": {
    color: C.teal,
    contactos: [
      { nombre: "Coordinación de Residencias", correo: "residencias@tec.edu.mx", ext: "Ext. 1001" },
      { nombre: "Recursos Humanos",            correo: "rh@tec.edu.mx",          ext: "Ext. 1020" },
      { nombre: "Soporte TI",                  correo: "soporte@tec.edu.mx",     ext: "Ext. 1050" },
    ],
    herramientas: [
      { icon: "calendar",    label: "Calendario académico 2025-B", url: "https://tec.edu.mx/calendario" },
      { icon: "file-text",   label: "Formato ITV-AC-PO-004-A01",   url: "https://tec.edu.mx/formatos"   },
      { icon: "book",        label: "Reglamento de residencias",   url: "https://tec.edu.mx/reglamento"  },
      { icon: "link",        label: "Portal de empresas vinculadas", url: "https://tec.edu.mx/empresas"  },
    ],
    notas: [
      "Las asignaciones deben completarse antes del inicio del periodo.",
      "Los proyectos sin residente asignado deben resolverse en 5 días hábiles.",
      "El cambio de asesor debe justificarse por escrito.",
    ],
  },
  "Asesor": {
    color: C.blue,
    contactos: [
      { nombre: "Jefe de Vinculación",    correo: "vinculacion@tec.edu.mx", ext: "Ext. 1010" },
      { nombre: "Coordinación Académica", correo: "academica@tec.edu.mx",   ext: "Ext. 1002" },
      { nombre: "Soporte TI",             correo: "soporte@tec.edu.mx",     ext: "Ext. 1050" },
    ],
    herramientas: [
      { icon: "file-text", label: "Criterios de evaluación de reportes", url: "https://tec.edu.mx/criterios" },
      { icon: "book",      label: "Guía del asesor",                     url: "https://tec.edu.mx/guia"     },
      { icon: "calendar",  label: "Fechas límite 2025-B",                url: "https://tec.edu.mx/fechas"   },
    ],
    notas: [
      "Revisar reportes en un máximo de 5 días hábiles tras su recepción.",
      "Notificar al Jefe de Vinculación si un residente no entrega en tiempo.",
      "Los reportes 'Por corregir' deben retroalimentarse de forma detallada.",
    ],
  },
  "Residente": {
    color: C.purple,
    contactos: [
      { nombre: "Mi Asesor",           correo: "asesor@tec.edu.mx",      ext: "Consultar perfil" },
      { nombre: "Vinculación",         correo: "vinculacion@tec.edu.mx", ext: "Ext. 1010"        },
      { nombre: "Control Escolar",     correo: "escolar@tec.edu.mx",     ext: "Ext. 1030"        },
    ],
    herramientas: [
      { icon: "edit",      label: "Plantilla Reporte Preliminar",  url: "https://tec.edu.mx/plantillas"  },
      { icon: "layers",    label: "Plantilla Reportes Parciales",  url: "https://tec.edu.mx/plantillas"  },
      { icon: "book-open", label: "Plantilla Reporte Final",       url: "https://tec.edu.mx/plantillas"  },
      { icon: "book",      label: "Reglamento de residencias",     url: "https://tec.edu.mx/reglamento"  },
    ],
    notas: [
      "Entrega puntual: los reportes tienen fecha límite inamovible.",
      "Un reporte 'Por corregir' debe corregirse y resubirse antes de 7 días.",
      "Para cualquier duda o incidencia contacta primero a tu asesor.",
    ],
  },
};

export default function Utilerias({ fotoPerfil, setFotoPerfil, usuario, role }) {
  const info = INFO_POR_ROL[role] || INFO_POR_ROL["Residente"];
  const initials = usuario?.nombre
    ? usuario.nombre.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const seleccionarFoto = () => {
    if (!globalThis?.document?.createElement) {
      Alert.alert("Foto de perfil", "La selección de fotos está disponible en la versión web.");
      return;
    }
    const input = globalThis.document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        Alert.alert("Archivo muy grande", "La imagen debe ser menor a 5 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFotoPerfil(ev.target.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const eliminarFoto = () => {
    Alert.alert("Eliminar foto", "¿Seguro que quieres eliminar tu foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => setFotoPerfil(null) },
    ]);
  };

  const abrirEnlace = (url) => {
    Alert.alert("Abrir enlace", `Se abrirá: ${url}`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Abrir", onPress: () => Linking.openURL(url).catch(() => Alert.alert("Error", "No se pudo abrir el enlace.")) },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Utilerías</Text>
        <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Perfil, herramientas e información útil</Text>
      </View>

      {/* ── Foto de perfil ── */}
      <Card style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: C.text, marginBottom: 18 }}>Foto de Perfil</Text>
        <Row style={{ alignItems: "center", gap: 24 }}>
          {/* Avatar grande */}
          <View style={{ position: "relative" }}>
            {fotoPerfil ? (
              <Image
                source={{ uri: fotoPerfil }}
                style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: info.color }}
              />
            ) : (
              <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: C.teal, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: info.color }}>
                <Text style={{ fontSize: 28, fontWeight: "800", color: "white" }}>{initials}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={seleccionarFoto}
              style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: info.color, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "white" }}
            >
              <Feather name="camera" size={13} color="white" />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: "800", color: C.text }}>{usuario?.nombre || "Usuario"}</Text>
            <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 2 }}>{usuario?.correo || ""}</Text>
            <View style={{ backgroundColor: info.color + "22", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 14 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: info.color }}>{role}</Text>
            </View>
            <Row style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={seleccionarFoto}
                style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 9, backgroundColor: info.color }}
              >
                <Feather name="upload" size={13} color="white" />
                <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>{fotoPerfil ? "Cambiar foto" : "Subir foto"}</Text>
              </TouchableOpacity>
              {fotoPerfil && (
                <TouchableOpacity
                  onPress={eliminarFoto}
                  style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 9, borderWidth: 1, borderColor: C.red }}
                >
                  <Feather name="trash-2" size={13} color={C.red} />
                  <Text style={{ color: C.red, fontWeight: "700", fontSize: 13 }}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </Row>
            <Text style={{ fontSize: 11, color: C.textLight, marginTop: 8 }}>JPG, PNG o WEBP · máx. 5 MB</Text>
          </View>
        </Row>
      </Card>

      {/* ── Herramientas y Recursos ── */}
      <Card style={{ marginBottom: 20 }}>
        <Row style={{ alignItems: "center", gap: 10, marginBottom: 16 }}>
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: info.color + "22", alignItems: "center", justifyContent: "center" }}>
            <Feather name="tool" size={16} color={info.color} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>Recursos y Documentos</Text>
        </Row>
        <View style={{ gap: 10 }}>
          {info.herramientas.map((h, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => abrirEnlace(h.url)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, backgroundColor: C.bg, borderRadius: 10, borderWidth: 1, borderColor: C.border }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: info.color + "22", alignItems: "center", justifyContent: "center" }}>
                <Feather name={h.icon} size={16} color={info.color} />
              </View>
              <Text style={{ flex: 1, fontSize: 13, fontWeight: "600", color: C.text }}>{h.label}</Text>
              <Feather name="external-link" size={14} color={C.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* ── Contactos Importantes ── */}
      <Card style={{ marginBottom: 20 }}>
        <Row style={{ alignItems: "center", gap: 10, marginBottom: 16 }}>
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" }}>
            <Feather name="phone" size={16} color={C.blue} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>Contactos Importantes</Text>
        </Row>
        <View style={{ gap: 12 }}>
          {info.contactos.map((c, i) => (
            <Row key={i} style={{ alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: C.bg, borderRadius: 10 }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 13, fontWeight: "800", color: C.blue }}>{c.nombre[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.text }}>{c.nombre}</Text>
                <Text style={{ fontSize: 11, color: C.textMuted }}>{c.correo} · {c.ext}</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert("Correo", `Contactar a: ${c.correo}`)}>
                <Feather name="mail" size={16} color={C.blue} />
              </TouchableOpacity>
            </Row>
          ))}
        </View>
      </Card>

      {/* ── Notas Importantes ── */}
      <Card style={{ marginBottom: 20 }}>
        <Row style={{ alignItems: "center", gap: 10, marginBottom: 16 }}>
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.amberLight, alignItems: "center", justifyContent: "center" }}>
            <Feather name="alert-circle" size={16} color={C.amber} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>Notas Importantes</Text>
        </Row>
        <View style={{ gap: 10 }}>
          {info.notas.map((nota, i) => (
            <Row key={i} style={{ gap: 10, alignItems: "flex-start", backgroundColor: C.amberLight, borderRadius: 8, padding: 12 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.amber, alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                <Text style={{ fontSize: 10, fontWeight: "800", color: "white" }}>{i + 1}</Text>
              </View>
              <Text style={{ fontSize: 13, color: "#92400e", flex: 1, lineHeight: 19 }}>{nota}</Text>
            </Row>
          ))}
        </View>
      </Card>

      {/* ── Info del sistema ── */}
      <Card>
        <Row style={{ alignItems: "center", gap: 10, marginBottom: 14 }}>
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.border }}>
            <Feather name="info" size={16} color={C.textMuted} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>Información del Sistema</Text>
        </Row>
        {[
          ["Sistema",       "VinculaTec"],
          ["Versión",       "v2.5 — 2025-B"],
          ["Desarrollado",  "ITVER — Depto. de Sistemas"],
          ["Soporte",       "soporte@tec.edu.mx"],
        ].map(([k, v], i) => (
          <Row key={i} style={{ paddingVertical: 8, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: C.borderLight }}>
            <Text style={{ flex: 1, fontSize: 13, color: C.textMuted, fontWeight: "600" }}>{k}</Text>
            <Text style={{ fontSize: 13, color: C.text }}>{v}</Text>
          </Row>
        ))}
      </Card>
    </ScrollView>
  );
}
