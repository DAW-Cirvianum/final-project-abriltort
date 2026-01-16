import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "../styles/navbar.css";

/**
 * Component Navbar
 *
 * @returns {JSX.Element}
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Funció de traducció
  const { t } = useTranslation();

  // Estat del menú hamburguer
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Gestiona el logout, tanca sessió i redirigeix al login
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /**
   * Toggle del menú hamburguer
   */
  const toggleMenu = () => setIsOpen(!isOpen);

  /**
   * Retorna la URL de l’avatar de l’usuari autenticat
   * @returns {string} URL de la imatge de l’avatar
   */
  const getAvatar = () => {
    if (!user || !user.imatge) return "/avatars/default.png";
    return `http://localhost:8085/storage/${user.imatge}`;
  };

  /**
   * Canvia l’idioma de la aplicació
   * @param {string} lang "ca" o "en"
   */
  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <nav className="navbar">
      {/* Icona hamburguer */}
      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>

      {/* Menú complet: esquerra + dreta */}
      <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
        {/* Enllaços principals */}
        <div className="navbar-left">
          <Link to="/">B612</Link>
          <Link to="/artistes">{t("nav.artists")}</Link>
          <Link to="/obres">{t("nav.works")}</Link>
          {user && <Link to="/dashboard">{t("nav.myPortfolio")}</Link>}

          {user && (
            <Link to="/dashboard/editar-perfil" className="navbar-link">
              {t("nav.editProfile")}
            </Link>
          )}
        </div>

        {/* Zona dreta: idioma, avatar i accions */}
        <div className="navbar-right">
          {/* Selector idioma */}
          <div className="lang-switcher">
            <button
              disabled={i18n.language === "ca"}
              onClick={() => changeLang("ca")}
            >
              CA
            </button>
            <button
              disabled={i18n.language === "en"}
              onClick={() => changeLang("en")}
            >
              EN
            </button>
          </div>

          {/* Usuari autenticat */}
          {user ? (
            <>
              <img
                src={getAvatar()}
                alt={t("nav.avatarAlt")}
                className="navbar-avatar"
              />
              <span>{t("nav.hello", { name: user.name })}</span>
              <button onClick={handleLogout}>{t("nav.logout")}</button>
            </>
          ) : (
            <>
              {/* Usuari no autenticat */}
              <Link to="/login">{t("nav.login")}</Link>
              <Link to="/register">{t("nav.register")}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
