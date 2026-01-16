import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";
import "../styles/form.css";

/**
 * Pàgina de login
 * Gestiona l'entrada de l'usuari i la contrasenya,
 *
 * @returns {JSX.Element} Formulari de login
 */
const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Enfoca el primer camp amb error quan hi ha errors de validació
   */
  useEffect(() => {
    if (errors.loginInput) document.getElementById("login-input")?.focus();
    else if (errors.password)
      document.getElementById("login-password")?.focus();
  }, [errors]);

  /**
   * Gestiona l'enviament del formulari
   * Valida els camps i crida a la funció de login
   *
   * @param {React.FormEvent<HTMLFormElement>} e esdeveniment del formulari
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validació bàsica dels camps
    if (!loginInput.trim()) {
      setErrors({ loginInput: t("login.loginInputRequired") });
      return;
    }
    if (!password.trim()) {
      setErrors({ password: t("login.passwordRequired") });
      return;
    }

    setLoading(true);

    try {
      const res = await login(loginInput, password);

      if (!res.success) {
        showNotification(res.message || t("login.invalidCredentials"), "error");
      } else {
        showNotification(t("login.success"), "success");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      console.error(err);
      showNotification(t("login.error"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{t("login.title")}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Camp de login (usuari o email) */}
        <div className="form-group">
          <label htmlFor="login-input">{t("login.loginInputLabel")}</label>
          <input
            id="login-input"
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            aria-required="true"
            aria-invalid={errors.loginInput ? "true" : "false"}
            aria-describedby={errors.loginInput ? "login-input-error" : undefined}
          />
          {errors.loginInput && (
            <p id="login-input-error" className="error">
              {errors.loginInput}
            </p>
          )}
        </div>

        {/* Camp de contrasenya */}
        <div className="form-group">
          <label htmlFor="login-password">{t("login.passwordLabel")}</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "login-password-error" : undefined}
          />
          {errors.password && (
            <p id="login-password-error" className="error">
              {errors.password}
            </p>
          )}
        </div>

        {/* Botó d'enviament */}
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? t("login.loading") : t("login.submit")}
        </button>

        {/* Enllaç a recuperar contrasenya */}
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <a href="/forgot-password" className="forgot-password-link">
            {t("login.forgotPassword")}
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
