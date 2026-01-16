import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

/**
 * Component per protegir rutes que només poden veure usuaris autenticats
 *
 * @param {Object} props
 * @param {JSX.Element} props.children Components fills a renderitzar si l'usuari està autenticat
 * @returns {JSX.Element} Contingut protegit o redirecció al login
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Mostra missatge de càrrega mentre es comprova l'usuari
  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Carregant...</p>;
  }

  // Si no hi ha usuari autenticat, redirigeix al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Usuari autenticat, renderitza els fills
  return children;
};

export default ProtectedRoute;
