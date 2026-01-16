import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/backButton.css";

/**
 * Botó reutilitzable per tornar a una ruta concreta
 *
 * @param {string} to Ruta de destinació
 * @param {string} labelKey Clau de traducció del text del botó
 * @returns {JSX.Element}
 */
const BackButton = ({ to, labelKey = "common.back" }) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <button className="back-button" onClick={() => navigate(to)}>
      {t(labelKey)}
    </button>
  );
};

export default BackButton;