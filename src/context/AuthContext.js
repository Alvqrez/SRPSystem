import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

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

// ── Helpers de token (singleton sobre localStorage) ────────────────────────
// Usados por App.js y DashAsesor.js directamente (sin contexto React)
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

export function getAuthToken() {
  try {
    return localStorage.getItem("authToken") || null;
  } catch {
    return null;
  }
}
