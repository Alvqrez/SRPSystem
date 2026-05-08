import { useState } from "react";

// Login (compartido)
import LoginScreen from "./src/shared/LoginScreen";

// App de cada rol
import ResidenteApp from "./src/roles/residente/ResidenteApp";
import AsesorApp from "./src/roles/asesor/AsesorApp";
import JefeApp from "./src/roles/jefe/JefeApp";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [loginRole, setLoginRole] = useState("residente");
  const [role, setRole] = useState(null);

  const handleLogin = () => {
    const map = {
      residente: "Residente",
      asesor: "Asesor",
      jefe: "Jefe de Vinculación",
    };
    setRole(map[loginRole]);
    setScreen("app");
  };

  const handleLogout = () => {
    setRole(null);
    setScreen("login");
  };

  // ── Login ────────────────────────────────────────────────────────────────────
  if (screen === "login") {
    return (
      <LoginScreen
        loginRole={loginRole}
        setLoginRole={setLoginRole}
        onLogin={handleLogin}
      />
    );
  }

  // ── App por rol ──────────────────────────────────────────────────────────────
  if (role === "Residente") return <ResidenteApp onLogout={handleLogout} />;
  if (role === "Asesor") return <AsesorApp onLogout={handleLogout} />;
  if (role === "Jefe de Vinculación")
    return <JefeApp onLogout={handleLogout} />;

  // Fallback por si el rol no coincide
  return (
    <LoginScreen
      loginRole={loginRole}
      setLoginRole={setLoginRole}
      onLogin={handleLogin}
    />
  );
}
