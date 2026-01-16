import "../styles/home.css";
import { useTranslation } from "react-i18next";

/**
 * Secció Hero de la pàgina principal
 * @returns {JSX.Element}
 */
const HeroSection = () => {
  // Funció de traducció
  const { t } = useTranslation();

  return (
    <section className="hero">
      {/* Columna esquerra: títol, subtítol i botó */}
      <div className="hero-left">
        <h1>{t("hero.title")}</h1>
        <p>{t("hero.subtitle")}</p>
        <button>{t("hero.button")}</button>
      </div>

      {/* Columna dreta: imatge destacada */}
      <div className="hero-right">
        <img src="/placeholder-hero.png" alt="Art destacat" />
      </div>
    </section>
  );
};

export default HeroSection;