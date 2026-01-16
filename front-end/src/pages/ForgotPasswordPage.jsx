import { useState } from "react";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";

/**
 * Pàgina per recuperar la contrasenya
 * Permet enviar un correu electrònic per generar un enllaç de recuperació
 *
 * @returns {JSX.Element} Formulari de recuperació de contrasenya
 */
const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();

  // Estat per controlar email, errors i loading
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Funció que gestiona l'enviament del formulari
   * @param {React.FormEvent<HTMLFormElement>} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");

    // Validació bàsica del camp email
    if (!email.trim()) {
      setEmailError(t("forgotPassword.emailRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t("forgotPassword.invalidEmail"));
      return;
    }

    setLoading(true);

    try {
      // Crida API per recuperar la contrasenya
      const res = await axios.post("http://localhost:8085/api/forgot-password", { email });

      if (res.data.success) {
        setEmailError("");
        showNotification(res.data.message, "success");
      } else {
        setEmailError(res.data.message || t("forgotPassword.emailInvalid"));
      }
    } catch (err) {
      console.error(err);
      showNotification(t("forgotPassword.serverError"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{t("forgotPassword.title")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">{t("forgotPassword.emailLabel")}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label={t("forgotPassword.emailLabel")}
            aria-describedby="email-error"
            required
          />
          {emailError && (
            <div id="email-error" style={{ color: "red", marginTop: "4px" }}>
              {emailError}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? t("forgotPassword.sending") : t("forgotPassword.sendButton")}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
