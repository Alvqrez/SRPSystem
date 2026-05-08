import { useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import C from "../../constants/colors";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

import DashResidente      from "./DashResidente";
import Seguimiento        from "../../screens/Seguimiento";
import ReportePreliminar  from "../../screens/ReportePreliminar";
import ReporteFinal       from "../../screens/ReporteFinal";
import Notificaciones     from "../../screens/Notificaciones";
import CalendarioCitas    from "../../screens/CalendarioCitas";

const NAV_RESIDENTE = [
  { id: "dashboard",           label: "Dashboard",          icon: "grid"      },
  { id: "seguimiento",         label: "Seguimiento",        icon: "file-text" },
  { id: "reporte-preliminar",  label: "Reporte Preliminar", icon: "edit"      },
  { id: "reporte-final",       label: "Reporte Final",      icon: "book-open" },
  { id: "notificaciones",      label: "Notificaciones",     icon: "bell"      },
  { id: "calendario",          label: "Calendario",         icon: "calendar"  },
];

export default function ResidenteApp({ onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");

  const views = {
    dashboard:            <DashResidente onNavigate={setActiveNav} />,
    seguimiento:          <Seguimiento />,
    "reporte-preliminar": <ReportePreliminar />,
    "reporte-final":      <ReporteFinal />,
    notificaciones:       <Notificaciones />,
    calendario:           <CalendarioCitas />,
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", height: Platform.OS === "web" ? "100vh" : "100%", backgroundColor: C.bg }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} role="Residente" navItems={NAV_RESIDENTE} onLogout={onLogout} />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TopBar activeNav={activeNav} setActiveNav={setActiveNav} navItems={NAV_RESIDENTE} role="Residente" onLogout={onLogout} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          {views[activeNav] || views.dashboard}
        </ScrollView>
      </View>
    </View>
  );
}
