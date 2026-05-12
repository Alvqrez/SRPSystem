import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // Al montar, leer token guardado
  useEffect(() => {
    const stored = localStorage.getItem("authToken");
    if (stored) setToken(stored);
  }, []);

  const guardarToken = (nuevoToken) => {
    setToken(nuevoToken);
    if (nuevoToken) {
      localStorage.setItem("authToken", nuevoToken);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  return (
    <AuthContext.Provider value={{ token, getToken: () => token, guardarToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}

// Funciones que usa App.js (setAuthToken, getAuthToken) las exportamos
export function setAuthToken(token) {
  // Esta será llamada desde App.js, pero debemos asegurarnos de que tenga acceso al contexto.
  // Alternativa: usar un singleton simple (menos elegante pero funcional).
  // Para simplificar, dejaremos que App.js siga usando su propio estado, pero también guardaremos en localStorage.
  // Luego en DashAsesor leeremos de localStorage directamente.
  // (Ver abajo la adaptación)
}