import { useState } from "react";
import { View, ScrollView, Platform } from "react-native";

// Constants
import C from "./src/constants/colors";

// Components
import Sidebar from "./src/components/Sidebar";
import TopBar from "./src/components/TopBar";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import GestionEmpresas from "./src/screens/GestionEmpresas";
import GestionProyectos from "./src/screens/GestionProyectos";
import Seguimiento from "./src/screens/Seguimiento";
import ReportePreliminar from "./src/screens/ReportePreliminar";
import ReporteFinal from "./src/screens/ReporteFinal";
import Notificaciones from "./src/screens/Notificaciones";
import CalendarioCitas from "./src/screens/CalendarioCitas";

// Role dashboards
import DashResidente from "./src/roles/residente/DashResidente";
import DashAsesor from "./src/roles/asesor/DashAsesor";
import DashJefe from "./src/roles/jefe/DashJefe";
import ValidacionFuentes from "./src/roles/jefe/ValidacionFuentes";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [role, setRole] = useState("Residente");
  const [loginRole, setLoginRole] = useState("residente");
  const [activeNav, setActiveNav] = useState("dashboard");

  const handleLogin = () => {
    const map = {
      residente: "Residente",
      asesor: "Asesor",
      jefe: "Jefe de Vinculación",
    };
    setRole(map[loginRole]);
    setScreen("app");
  };

  if (screen === "login") {
    return (
      <LoginScreen
        loginRole={loginRole}
        setLoginRole={setLoginRole}
        onLogin={handleLogin}
      />
    );
  }

  const views = {
    dashboard:
      role === "Residente" ? (
        <DashResidente />
      ) : role === "Asesor" ? (
        <DashAsesor />
      ) : (
        <DashJefe />
      ),
    empresas: <GestionEmpresas />,
    proyectos: <GestionProyectos />,
    seguimiento: <Seguimiento />,
    "reporte-preliminar": <ReportePreliminar />,
    "reporte-final": <ReporteFinal />,
    "validacion-fuentes": <ValidacionFuentes />,
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
        role={role}
        setRole={setRole}
      />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TopBar
          activeNav={activeNav}
          role={role}
          onLogout={() => setScreen("login")}
        />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          {views[activeNav] || views.dashboard}
        </ScrollView>
      </View>
    </View>
  );
}
