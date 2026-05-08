import { useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import C from "../../constants/colors";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { NotificacionesProvider } from "../../context/NotificacionesContext";

import DashAsesor from "./DashAsesor";
import GestionProyectos from "../../screens/GestionProyectos";
import Seguimiento from "../../screens/Seguimiento";
import Notificaciones from "../../screens/Notificaciones";
import CalendarioCitas from "../../screens/CalendarioCitas";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "proyectos", label: "Proyectos", icon: "folder" },
  { id: "seguimiento", label: "Seguimiento", icon: "file-text" },
  { id: "notificaciones", label: "Notificaciones", icon: "bell" },
  { id: "calendario", label: "Calendario", icon: "calendar" },
];

function AsesorAppInner({ usuario, onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const views = {
    dashboard: <DashAsesor onNavigate={setActiveNav} />,
    proyectos: <GestionProyectos />,
    seguimiento: <Seguimiento />,
    notificaciones: <Notificaciones />,
    calendario: <CalendarioCitas />,
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        height: Platform.OS === "web" ? "100vh" : "100%",
        backgroundColor: C.bg,
      }}
    >
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        role="Asesor"
        navItems={NAV}
        onLogout={onLogout}
        usuario={usuario}
      />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TopBar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          navItems={NAV}
          role="Asesor"
          onLogout={onLogout}
          usuario={usuario}
        />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          {views[activeNav] || views.dashboard}
        </ScrollView>
      </View>
    </View>
  );
}

export default function AsesorApp({ usuario, onLogout }) {
  return (
    <NotificacionesProvider initialUnread={4}>
      <AsesorAppInner usuario={usuario} onLogout={onLogout} />
    </NotificacionesProvider>
  );
}
