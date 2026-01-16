import { createContext, useContext, useState } from "react";
import NotificationToast from "../components/NotificationToast";

/**
 * Context per gestionar notificacions globals proporciona missatges temporals a l'usuari
 */
const NotificationContext = createContext();

/**
 * Proveïdor de notificacions
 *
 * @param {Object} props
 * @param {JSX.Element} props.children Components fills que poden mostrar notificacions
 */
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null); 

  /**
   * Mostra una notificació
   *
   * @param {string} message Missatge a mostrar
   * @param {"success"|"error"|"info"} type Tipus de notificació (per estil)
   * @param {number} duration Temps en ms que es mostrarà la notificació
   */
  const showNotification = (message, type = "success", duration = 3000) => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  /**
   * Amaga la notificació manualment abans que acabi el temporitzador
   */
  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, hideNotification }}
    >
      {children}
      {/* Component que renderitza la notificació com a toast */}
      <NotificationToast /> 
    </NotificationContext.Provider>
  );
};

/**
 * Hook personalitzat per consumir el context de notificacions
 *
 * @returns {Object} { notification, showNotification, hideNotification }
 */
export const useNotification = () => {
  return useContext(NotificationContext);
};
