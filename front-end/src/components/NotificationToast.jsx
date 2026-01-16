import React from "react";
import { useNotification } from "../context/NotificationContext";
import "../styles/notifications.css"; 

/**
 * Componente NotificationToast, mostra notificacions temporals
 *
 * @returns {JSX.Element|null} Retorna null si no hi ha notificació activa
 */
const NotificationToast = () => {
  // Obté la notificació actual del context
  const { notification } = useNotification();

  // No renderitza res si no hi ha notificació
  if (!notification) return null;

  return (
    <div
      className={`notification notification-${notification.type}`}
      role="alert"
      aria-live="assertive"
    >
      {/* Missatge de la notificació */}
      {notification.message}
    </div>
  );
};

export default NotificationToast;
