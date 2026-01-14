import React from "react";
import { useNotification } from "../context/NotificationContext";
import "../styles/notifications.css"; 

const NotificationToast = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div
      className={`notification notification-${notification.type}`}
      role="alert"
      aria-live="assertive"
    >
      {notification.message}
    </div>
  );
};

export default NotificationToast;
