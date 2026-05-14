import { useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import C from "../../constants/colors";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

import DashJefe           from "./DashJefe";
import GestionEmpresas    from "../../screens/GestionEmpresas";
import GestionProyectos   from "../../screens/GestionProyectos";
import SeguimientoJefe    from "../../screens/SeguimientoJefe";
import AsignacionJefe     from "../../screens/AsignacionJefe";
import PropuestasAsesores from "./PropuestasAsesores";
import ValidacionFuentes  from "./ValidacionFuentes";
import Utilerias          from "../../screens/Utilerias";
import Notificaciones     from "../../screens/Notificaciones";
import CalendarioCitas    from "../../screens/CalendarioCitas";

const NAV = [
  { id: "dashboard",    label: "Dashboard",    icon: "grid"        },
  { id: "empresas",     label: "Empresas",     icon: "briefcase"   },
  { id: "proyectos",    label: "Proyectos",    icon: "folder"      },
  { id: "asignacion",   label: "Asignación",   icon: "user-plus"   },
  { id: "propuestas",   label: "Propuestas",   icon: "layers"      },
  { id: "fuentes",      label: "Validar Fuentes", icon: "check-circle" },
  { id: "seguimiento",  label: "Seguimiento",  icon: "file-text"   },
  { id: "notificaciones", label: "Notificaciones", icon: "bell"    },
  { id: "calendario",   label: "Calendario",   icon: "calendar"    },
  { id: "utilerias",    label: "Utilerías",    icon: "tool"        },
];

function JefeAppInner({ usuario, onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");

  // ── Foto de perfil persistente en localStorage ────────────────────────────
  const storageKey = `vt_foto_${usuario?.id || "jefe"}`;
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
    dashboard:      <DashJefe onNavigate={setActiveNav} />,
    empresas:       <GestionEmpresas />,
    proyectos:      <GestionProyectos />,
    asignacion:     <AsignacionJefe />,
    propuestas:     <PropuestasAsesores onNavigate={setActiveNav} />,
    fuentes:        <ValidacionFuentes onNavigate={setActiveNav} />,
    seguimiento:    <SeguimientoJefe />,
    notificaciones: <Notificaciones onNavigate={setActiveNav} />,
    calendario:     <CalendarioCitas />,
    utilerias:      <Utilerias fotoPerfil={fotoPerfil} setFotoPerfil={setFotoPerfil} usuario={usuario} role="Jefe de Vinculación" />,
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", height: Platform.OS === "web" ? "100vh" : "100%", backgroundColor: C.bg }}>
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        role="Jefe de Vinculación"
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
          role="Jefe de Vinculación"
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

export default function JefeApp({ usuario, onLogout }) {
  return <JefeAppInner usuario={usuario} onLogout={onLogout} />;
}
