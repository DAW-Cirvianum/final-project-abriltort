import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import "../styles/form.css";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Focus al primer camp amb error
  useEffect(() => {
    if (errors.name) document.getElementById("register-name")?.focus();
    else if (errors.email) document.getElementById("register-email")?.focus();
    else if (errors.password)
      document.getElementById("register-password")?.focus();
    else if (errors.passwordConfirmation)
      document.getElementById("register-password-confirm")?.focus();
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!name.trim()) newErrors.name = "El nom és obligatori.";
    if (!email.trim()) newErrors.email = "L’email és obligatori.";
    if (!password) newErrors.password = "La contrasenya és obligatòria.";
    if (password !== passwordConfirmation)
      newErrors.passwordConfirmation = "Les contrasenyes no coincideixen.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);
      if (avatar) formData.append("imatge", avatar);

      const res = await register(formData);

      if (!res.success) {
        showNotification(res.message || "No s'ha pogut registrar", "error");
      } else {
        showNotification("Registre correcte!", "success");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      console.error(err);
      showNotification("Hi ha hagut un error, torna-ho a provar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar-se</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <div className="form-group">
          <label htmlFor="register-name">Nom *</label>
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
            <p id="register-name-error" className="error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email *</label>
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
            <p id="register-email-error" className="error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password *</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={
              errors.password ? "register-password-error" : undefined
            }
          />
          {errors.password && (
            <p id="register-password-error" className="error">
              {errors.password}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="register-password-confirm">
            Confirmar Password *
          </label>
          <input
            id="register-password-confirm"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            aria-required="true"
            aria-invalid={errors.passwordConfirmation ? "true" : "false"}
            aria-describedby={
              errors.passwordConfirmation
                ? "register-password-confirm-error"
                : undefined
            }
          />
          {errors.passwordConfirmation && (
            <p id="register-password-confirm-error" className="error">
              {errors.passwordConfirmation}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="register-avatar">Avatar (opcional)</label>
          <input
            id="register-avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>

        <button type="submit" className="form-button" disabled={loading}>
          {loading ? "Registrant..." : "Registrar-se"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
