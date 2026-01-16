import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { useTranslation } from "react-i18next"; // <-- import i18n
import "../styles/form.css";

/**
 * Pàgina de registre per a nous usuaris
 * Permet registrar usuari amb nom, email, contrasenya i avatar opcional
 *
 * @returns {JSX.Element} Formulari de registre complet
 */
const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { t } = useTranslation(); 

  // Estats del formulari
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Focus automàtic en el primer camp amb error
   */
  useEffect(() => {
    if (errors.name) document.getElementById("register-name")?.focus();
    else if (errors.email) document.getElementById("register-email")?.focus();
    else if (errors.password)
      document.getElementById("register-password")?.focus();
    else if (errors.passwordConfirmation)
      document.getElementById("register-password-confirm")?.focus();
  }, [errors]);

  /**
   * Envia el formulari de registre
   * @param {React.FormEvent<HTMLFormElement>} e esdeveniment del submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validació
    const newErrors = {};
    if (!name.trim()) newErrors.name = t("register.errors.name");
    if (!email.trim()) newErrors.email = t("register.errors.email");
    if (!password) newErrors.password = t("register.errors.password");
    if (password !== passwordConfirmation)
      newErrors.passwordConfirmation = t("register.errors.passwordConfirmation");

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Preparar dades del formulari
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);
      if (avatar) formData.append("imatge", avatar);

      const res = await register(formData);

      // Gestió de notificacions segons èxit/error
      if (!res.success) {
        showNotification(res.message || t("register.notifications.error"), "error");
      } else {
        showNotification(t("register.notifications.success"), "success");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      console.error(err);
      showNotification(t("register.notifications.exception"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{t("register.title")}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        {/* Nom */}
        <div className="form-group">
          <label htmlFor="register-name">{t("register.fields.name")} *</label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "register-name-error" : undefined}
          />
          {errors.name && (
            <p id="register-name-error" className="error">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="register-email">{t("register.fields.email")} *</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "register-email-error" : undefined}
          />
          {errors.email && (
            <p id="register-email-error" className="error">{errors.email}</p>
          )}
        </div>

        {/* Contrasenya */}
        <div className="form-group">
          <label htmlFor="register-password">{t("register.fields.password")} *</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "register-password-error" : undefined}
          />
          {errors.password && (
            <p id="register-password-error" className="error">{errors.password}</p>
          )}
        </div>

        {/* Confirmació contrasenya */}
        <div className="form-group">
          <label htmlFor="register-password-confirm">{t("register.fields.passwordConfirmation")} *</label>
          <input
            id="register-password-confirm"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            aria-required="true"
            aria-invalid={errors.passwordConfirmation ? "true" : "false"}
            aria-describedby={errors.passwordConfirmation ? "register-password-confirm-error" : undefined}
          />
          {errors.passwordConfirmation && (
            <p id="register-password-confirm-error" className="error">{errors.passwordConfirmation}</p>
          )}
        </div>

        {/* Avatar */}
        <div className="form-group">
          <label htmlFor="register-avatar">{t("register.fields.avatar")}</label>
          <input
            id="register-avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>

        {/* Botó enviar */}
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? t("register.buttons.registering") : t("register.buttons.register")}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
