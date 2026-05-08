import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function NotificacionesProvider({ children, initialUnread = 4 }) {
  const [unreadCount, setUnreadCount] = useState(initialUnread);
  return (
    <Ctx.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNotificaciones() {
  return useContext(Ctx);
}
