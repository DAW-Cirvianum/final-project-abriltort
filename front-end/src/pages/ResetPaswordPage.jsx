import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import { useTranslation } from "react-i18next"; 
/**
 * Pàgina de reinici de contrasenya
 * Permet a l'usuari establir una nova contrasenya utilitzant un token i email
 *
 * @returns {JSX.Element} Formulari de reset de contrasenya
 */
const ResetPasswordPage = () => {
  const { t } = useTranslation(); 
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  // Obtenim token i email de la URL
  const token = query.get("token");
  const email = query.get("email");

  // Estats del formulari
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  // Estats per errors
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const { showNotification } = useNotification();
  const navigate = useNavigate();

  /**
   * Envia el formulari de reset de contrasenya
   * @param {React.FormEvent<HTMLFormElement>} e - esdeveniment del submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setPasswordError("");
    setPasswordConfirmationError("");
    setGeneralError("");

    // Validacions locals
    if (!token || !email) {
      setGeneralError(t("resetPassword.invalidLink"));
      return;
    }

    if (password.length < 8) {
      setPasswordError(t("resetPassword.passwordTooShort"));
      return;
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError(t("resetPassword.passwordsDontMatch"));
      return;
    }

    setLoading(true);
    try {
      // Crida al backend per reiniciar contrasenya
      const res = await axios.post("http://localhost:8085/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Notificació d'èxit
      showNotification(t("resetPassword.success"), "success");

      // Redirecció al login després d'uns segons
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err.response?.data || err);
      setGeneralError(t("resetPassword.linkExpired"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{t("resetPassword.title")}</h2>
      <form onSubmit={handleSubmit}>
        {/* Contrasenya nova */}
        <div className="form-group">
          <label htmlFor="password">{t("resetPassword.newPassword")} *</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label={t("resetPassword.newPassword")}
            placeholder={t("resetPassword.passwordPlaceholder")}
          />
          {passwordError && (
            <p className="error-message" role="alert">{passwordError}</p>
          )}
        </div>

        {/* Confirmació de contrasenya */}
        <div className="form-group">
          <label htmlFor="passwordConfirmation">{t("resetPassword.confirmPassword")} *</label>
          <input
            id="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            aria-label={t("resetPassword.confirmPassword")}
            placeholder={t("resetPassword.confirmPasswordPlaceholder")}
          />
          {passwordConfirmationError && (
            <p className="error-message" role="alert">{passwordConfirmationError}</p>
          )}
        </div>

        {/* Error general */}
        {generalError && (
          <p className="error-message" role="alert">{generalError}</p>
        )}

        {/* Botó enviar */}
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? t("resetPassword.resetting") : t("resetPassword.button")}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
