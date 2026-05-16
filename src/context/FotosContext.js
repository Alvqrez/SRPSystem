/**
 * FotosContext
 * Almacén centralizado de fotos de perfil de todos los usuarios.
 * Las fotos se persisten en localStorage con la clave `vt_foto_${userId}`.
 * Al iniciar, carga TODAS las claves `vt_foto_*` existentes en localStorage,
 * por lo que si el asesor subió su foto en una sesión anterior, el residente
 * la verá automáticamente en la siguiente sesión.
 */
import { createContext, useContext, useState, useCallback } from "react";

const FotosCtx = createContext(null);

const PREFIX = "vt_foto_";

function loadAllFotos() {
  try {
    const fotos = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        const userId = key.slice(PREFIX.length);
        const val = localStorage.getItem(key);
        if (val) fotos[userId] = val;
      }
    }
    return fotos;
  } catch {
    return {};
  }
}

export function FotosProvider({ children }) {
  const [fotos, setFotos] = useState(loadAllFotos);

  const getFoto = useCallback(
    (userId) => {
      if (!userId) return null;
      return fotos[String(userId)] || null;
    },
    [fotos],
  );

  const setFoto = useCallback((userId, base64OrNull) => {
    if (!userId) return;
    const key = String(userId);
    setFotos((prev) => {
      if (base64OrNull === null) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: base64OrNull };
    });
    try {
      if (base64OrNull) localStorage.setItem(PREFIX + key, base64OrNull);
      else localStorage.removeItem(PREFIX + key);
    } catch {
      /* sin localStorage */
    }
  }, []);

  return (
    <FotosCtx.Provider value={{ getFoto, setFoto }}>
      {children}
    </FotosCtx.Provider>
  );
}

export function useFotos() {
  return useContext(FotosCtx);
}
