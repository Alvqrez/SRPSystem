import { useState } from "react";
import LoginScreen from "./src/shared/LoginScreen";
import ResidenteApp from "./src/roles/residente/ResidenteApp";
import AsesorApp from "./src/roles/asesor/AsesorApp";
import JefeApp from "./src/roles/jefe/JefeApp";
import { ReportesProvider } from "./src/context/ReportesContext";
import { NotificacionesProvider } from "./src/context/NotificacionesContext";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [usuario, setUsuario] = useState(null);
  const [loginError, setLoginError] = useState("");

  const rolNormalizado = usuario?.rol?.toLowerCase();

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

  return (
    <ReportesProvider>
      <NotificacionesProvider initialUnread={4}>
        {screen === "login" || !usuario ? (
          <LoginScreen onLogin={handleLogin} loginError={loginError} />
        ) : rolNormalizado === "residente" ? (
          <ResidenteApp usuario={usuario} onLogout={handleLogout} />
        ) : rolNormalizado === "asesor" ? (
          <AsesorApp usuario={usuario} onLogout={handleLogout} />
        ) : rolNormalizado === "jefe" ? (
          <JefeApp usuario={usuario} onLogout={handleLogout} />
        ) : (
          <LoginScreen onLogin={handleLogin} loginError={loginError} />
        )}
      </NotificacionesProvider>
    </ReportesProvider>
  );
}
