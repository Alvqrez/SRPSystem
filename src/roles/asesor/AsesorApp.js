import { useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import C from "../../constants/colors";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

import DashAsesor        from "./DashAsesor";
import ProyectosAsesor   from "./ProyectosAsesor";
import SeguimientoAsesor from "../../screens/SeguimientoAsesor";
import Utilerias         from "../../screens/Utilerias";
import Notificaciones    from "../../screens/Notificaciones";
import CalendarioCitas   from "../../screens/CalendarioCitas";

const NAV = [
  { id: "dashboard",      label: "Dashboard",      icon: "grid"      },
  { id: "proyectos",      label: "Proyectos",      icon: "folder"    },
  { id: "seguimiento",    label: "Reportes",       icon: "file-text" },
  { id: "notificaciones", label: "Notificaciones", icon: "bell"      },
  { id: "calendario",     label: "Calendario",     icon: "calendar"  },
  { id: "utilerias",      label: "Utilerías",      icon: "tool"      },
];

export default function AsesorApp({ usuario, onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");

  // ── Foto de perfil persistente en localStorage ────────────────────────────
  const storageKey = `vt_foto_${usuario?.id || "asesor"}`;
  const [fotoPerfil, setFotoPerfilState] = useState(() => {
    try { return localStorage.getItem(storageKey) || null; } catch { return null; }
  });

  const setFotoPerfil = (foto) => {
    setFotoPerfilState(foto);
    try {
      if (foto) localStorage.setItem(storageKey, foto);
      else       localStorage.removeItem(storageKey);
    } catch { /* sin localStorage */ }
  };

  const views = {
    dashboard:      <DashAsesor onNavigate={setActiveNav} />,
    proyectos:      <ProyectosAsesor />,
    seguimiento:    <SeguimientoAsesor />,
    notificaciones: <Notificaciones onNavigate={setActiveNav} />,
    calendario:     <CalendarioCitas />,
    utilerias:      <Utilerias fotoPerfil={fotoPerfil} setFotoPerfil={setFotoPerfil} usuario={usuario} role="Asesor" />,
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", height: Platform.OS === "web" ? "100vh" : "100%", backgroundColor: C.bg }}>
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        role="Asesor"
        navItems={NAV}
        onLogout={onLogout}
        usuario={usuario}
        fotoPerfil={fotoPerfil}
      />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TopBar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          navItems={NAV}
          role="Asesor"
          onLogout={onLogout}
          usuario={usuario}
          fotoPerfil={fotoPerfil}
        />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          {views[activeNav] || views.dashboard}
        </ScrollView>
      </View>
    </View>
  );
}
