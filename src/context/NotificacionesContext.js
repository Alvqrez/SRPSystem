import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
const STORAGE_KEY = "vinculatec:notificaciones";

const loadStoredNotifications = () => {
  try {
    const stored = globalThis?.localStorage?.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export function NotificacionesProvider({ children, initialUnread = 4 }) {
  const [notifications, setNotifications] = useState(loadStoredNotifications);
  const [unreadCount, setUnreadCount] = useState(() =>
    notifications ? notifications.filter((n) => n.unread).length : initialUnread,
  );

  useEffect(() => {
    if (!notifications) return;

    setUnreadCount(notifications.filter((n) => n.unread).length);

    try {
      globalThis?.localStorage?.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications),
      );
    } catch {
      // localStorage only exists in web builds.
    }
  }, [notifications]);

  return (
    <Ctx.Provider
      value={{ notifications, setNotifications, unreadCount, setUnreadCount }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useNotificaciones() {
  return useContext(Ctx);
}
