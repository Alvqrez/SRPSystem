import { useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import C from "../../constants/colors";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

import DashAsesor from "./DashAsesor";
import GestionProyectos from "../../screens/GestionProyectos";
import SeguimientoAsesor from "../../screens/SeguimientoAsesor";
import Notificaciones from "../../screens/Notificaciones";
import CalendarioCitas from "../../screens/CalendarioCitas";

const NAV = [
  { id: "dashboard",      label: "Dashboard",      icon: "grid"      },
  { id: "proyectos",      label: "Proyectos",      icon: "folder"    },
  { id: "seguimiento",    label: "Reportes",       icon: "file-text" },
  { id: "notificaciones", label: "Notificaciones", icon: "bell"      },
  { id: "calendario",     label: "Calendario",     icon: "calendar"  },
];

export default function AsesorApp({ usuario, onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");

  const views = {
    dashboard:      <DashAsesor onNavigate={setActiveNav} />,
    proyectos:      <GestionProyectos />,
    seguimiento:    <SeguimientoAsesor />,
    notificaciones: <Notificaciones onNavigate={setActiveNav} />,
    calendario:     <CalendarioCitas />,
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", height: Platform.OS === "web" ? "100vh" : "100%", backgroundColor: C.bg }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} role="Asesor" navItems={NAV} onLogout={onLogout} usuario={usuario} />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TopBar activeNav={activeNav} setActiveNav={setActiveNav} navItems={NAV} role="Asesor" onLogout={onLogout} usuario={usuario} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          {views[activeNav] || views.dashboard}
        </ScrollView>
      </View>
    </View>
  );
}
