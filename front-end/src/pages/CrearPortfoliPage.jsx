import { useNavigate } from "react-router-dom";
import PortfoliForm from "../components/PortfoliForm";
import { useTranslation } from "react-i18next";

/**
 * Pàgina per crear un nou portfoli
 *
 * @returns {JSX.Element} Formulari per crear un portfoli
 */
const CrearPortfoliPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Funció cridada quan el formulari s'ha enviat correctament
   * Redirigeix al dashboard
   */
  const handleSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="crear-portfoli-page">
      <h2>{t("crearPortfoliPage.title")}</h2>

      {/* Formulari reutilitzable sense dades inicials */}
      <PortfoliForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CrearPortfoliPage;
