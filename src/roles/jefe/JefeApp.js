import { useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import C from "../../constants/colors";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

import DashJefe           from "./DashJefe";
import ValidacionFuentes  from "./ValidacionFuentes";
import GestionEmpresas    from "../../screens/GestionEmpresas";
import GestionProyectos   from "../../screens/GestionProyectos";
import Notificaciones     from "../../screens/Notificaciones";
import CalendarioCitas    from "../../screens/CalendarioCitas";

const NAV_JEFE = [
  { id: "dashboard",           label: "Dashboard",          icon: "grid"         },
  { id: "empresas",            label: "Empresas",           icon: "briefcase"    },
  { id: "proyectos",           label: "Proyectos",          icon: "folder"       },
  { id: "validacion-fuentes",  label: "Validación Fuentes", icon: "check-square" },
  { id: "notificaciones",      label: "Notificaciones",     icon: "bell"         },
  { id: "calendario",          label: "Calendario",         icon: "calendar"     },
];

export default function JefeApp({ onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");

  const views = {
    dashboard:            <DashJefe onNavigate={setActiveNav} />,
    empresas:             <GestionEmpresas />,
    proyectos:            <GestionProyectos />,
    "validacion-fuentes": <ValidacionFuentes />,
    notificaciones:       <Notificaciones />,
    calendario:           <CalendarioCitas />,
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", height: Platform.OS === "web" ? "100vh" : "100%", backgroundColor: C.bg }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} role="Jefe de Vinculación" navItems={NAV_JEFE} onLogout={onLogout} />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TopBar activeNav={activeNav} setActiveNav={setActiveNav} navItems={NAV_JEFE} role="Jefe de Vinculación" onLogout={onLogout} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          {views[activeNav] || views.dashboard}
        </ScrollView>
      </View>
    </View>
  );
}
