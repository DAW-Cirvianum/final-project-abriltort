import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/valorSection.css";

/**
 * Secció ValorSection
 * Mostra el valor de la plataforma amb blocs destacant exclusivitat, comunitat i inspiració
 *
 * @returns {JSX.Element} Secció amb contingut informatiu i visual
 */
const ValorSection = () => {
  const { t } = useTranslation();

  return (
    <section className="valor-section">
      <div className="valor-container">
        {/* Text principal de la secció */}
        <div className="valor-text">
          <h2>{t("valor.exploreArt")}</h2>
          <p>{t("valor.description")}</p>
        </div>

        {/* Blocs de valor */}
        <div className="valor-blocs">
          <div className="bloc">
            <h3>{t("valor.exclusive.title")}</h3>
            <p>{t("valor.exclusive.text")}</p>
          </div>
          <div className="bloc">
            <h3>{t("valor.community.title")}</h3>
            <p>{t("valor.community.text")}</p>
          </div>
          <div className="bloc">
            <h3>{t("valor.inspiration.title")}</h3>
            <p>{t("valor.inspiration.text")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValorSection;

