import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/footer.css";

/**
 * Component Footer
 * Mostra el peu de pàgina de l’aplicació amb informació,
 *
 * @returns {JSX.Element}
 */
const Footer = () => {
  // Funció de traducció
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Informació general del projecte */}
        <div className="footer-info">
          <h3>B612</h3>
          <p>{t("footer.description")}</p>
        </div>

        {/* Enllaços principals */}
        <div className="footer-links">
          <h4>{t("footer.links.title")}</h4>
          <ul>
            <li><a href="/">{t("footer.links.home")}</a></li>
            <li><a href="/login">{t("footer.links.login")}</a></li>
            <li><a href="/register">{t("footer.links.register")}</a></li>
          </ul>
        </div>

        {/* Informació de contacte */}
        <div className="footer-contact">
          <h4>{t("footer.contact.title")}</h4>
          <p>{t("footer.contact.email")}</p>
          <p>{t("footer.contact.phone")}</p>
        </div>
      </div>

      {/* Peu inferior amb copyright */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} B612. {t("footer.bottom")}
      </div>
    </footer>
  );
};

export default Footer;
