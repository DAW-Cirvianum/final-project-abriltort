import { useNavigate } from "react-router-dom";
import PortfoliForm from "../components/PortfoliForm";

/**
 * Pàgina per crear un nou portfoli
 *
 * @returns {JSX.Element} Formulari per crear un portfoli
 */
const CrearPortfoliPage = () => {
  const navigate = useNavigate();

  /**
   * Funció cridada quan el formulari s'ha enviat correctament i redirigeix al dashboard
   */
  const handleSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="crear-portfoli-page">
      <h2>Crear el teu portfoli</h2>
      {/* Formulari reutilitzable sense dades inicials */}
      <PortfoliForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CrearPortfoliPage;

