import { useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import C from "../../constants/colors";
import Sidebar from "../../components/Sidebar";
import TopBar  from "../../components/TopBar";
import { NotificacionesProvider } from "../../context/NotificacionesContext";

import DashResidente     from "./DashResidente";
import Seguimiento       from "../../screens/Seguimiento";
import ReportePreliminar from "../../screens/ReportePreliminar";
import ReporteFinal      from "../../screens/ReporteFinal";
import Notificaciones    from "../../screens/Notificaciones";
import CalendarioCitas   from "../../screens/CalendarioCitas";

const NAV = [
  { id: "dashboard",           label: "Dashboard",          icon: "grid"      },
  { id: "seguimiento",         label: "Seguimiento",        icon: "file-text" },
  { id: "reporte-preliminar",  label: "Reporte Preliminar", icon: "edit"      },
  { id: "reporte-final",       label: "Reporte Final",      icon: "book-open" },
  { id: "notificaciones",      label: "Notificaciones",     icon: "bell"      },
  { id: "calendario",          label: "Calendario",         icon: "calendar"  },
];

function ResidenteAppInner({ usuario, onLogout }) {
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
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} role="Residente" navItems={NAV} onLogout={onLogout} usuario={usuario} />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TopBar activeNav={activeNav} setActiveNav={setActiveNav} navItems={NAV} role="Residente" onLogout={onLogout} usuario={usuario} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          {views[activeNav] || views.dashboard}
        </ScrollView>
      </View>
    </View>
  );
}

export default function ResidenteApp({ usuario, onLogout }) {
  return (
    <NotificacionesProvider initialUnread={4}>
      <ResidenteAppInner usuario={usuario} onLogout={onLogout} />
    </NotificacionesProvider>
  );
}
