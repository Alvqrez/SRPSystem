import { useState } from "react";
import LoginScreen from "./src/shared/LoginScreen";
import ResidenteApp from "./src/roles/residente/ResidenteApp";
import AsesorApp from "./src/roles/asesor/AsesorApp";
import JefeApp from "./src/roles/jefe/JefeApp";

// ─────────────────────────────────────────────────────────────────────────────
// Tabla simulada de usuarios  (sustituir por fetch a Node/Express + MySQL)
// Formato: { correo: { rol, nombre } }
// ─────────────────────────────────────────────────────────────────────────────
const USUARIOS_DB = {
  "ana.garcia@itm.edu.mx": { rol: "Residente", nombre: "Ana García" },
  "luis.hernandez@itm.edu.mx": { rol: "Residente", nombre: "Luis Hernández" },
  "sofia.martinez@itm.edu.mx": { rol: "Residente", nombre: "Sofía Martínez" },
  "marco.reyes@itm.edu.mx": { rol: "Asesor", nombre: "Dr. Marco Reyes" },
  "laura.vega@itm.edu.mx": { rol: "Asesor", nombre: "Dra. Laura Vega" },
  "director@itm.edu.mx": {
    rol: "Jefe de Vinculación",
    nombre: "Ing. Carlos Mendoza",
  },
};

export default function App() {
  const [screen, setScreen] = useState("login");
  const [usuario, setUsuario] = useState(null); // { rol, nombre }
  const [loginError, setLoginError] = useState("");

  // ── Lógica de login ─────────────────────────────────────────────────────────
  // Aquí se reemplaza el lookup local por:
  //   const res = await fetch("http://TU_IP:3001/api/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ correo: email, password }),
  //   });
  //   const data = await res.json();
  //   if (data.ok) { setUsuario(data.usuario); setScreen("app"); }
  //   else { /* mostrar error */ }
  const handleLogin = async (email, _password) => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password: _password }),
      });
      const data = await res.json();

      if (!data.ok) {
        setLoginError(data.mensaje || "Error en login");
        return;
      }

      setLoginError("");
      setUsuario(data.usuario);
      setScreen("app");
    } catch (err) {
      setLoginError("Error de conexión. ¿El backend está corriendo en :3001?");
      console.error(err);
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setScreen("login");
  };

  if (screen === "login") {
    return <LoginScreen onLogin={handleLogin} loginError={loginError} />;
  }

  if (usuario?.rol === "Residente")
    return <ResidenteApp usuario={usuario} onLogout={handleLogout} />;
  if (usuario?.rol === "Asesor")
    return <AsesorApp usuario={usuario} onLogout={handleLogout} />;
  if (usuario?.rol === "Jefe de Vinculación")
    return <JefeApp usuario={usuario} onLogout={handleLogout} />;

  return <LoginScreen onLogin={handleLogin} loginError={loginError} />;
}
