import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import "../styles/form.css";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Focus al primer error
  useEffect(() => {
    if (errors.loginInput) document.getElementById("login-input")?.focus();
    else if (errors.password)
      document.getElementById("login-password")?.focus();
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!loginInput.trim()) {
      setErrors({ loginInput: "El nom d’usuari o email és obligatori." });
      return;
    }
    if (!password.trim()) {
      setErrors({ password: "La contrasenya és obligatòria." });
      return;
    }

    setLoading(true);

    try {
      const res = await login(loginInput, password);

      if (!res.success) {
        showNotification(res.message || "Credencials incorrectes", "error");
      } else {
        showNotification("Login correcte!", "success");
        setTimeout(() => navigate("/dashboard"), 1000);
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
  <h2>Login</h2>

  <form onSubmit={handleSubmit} noValidate>
    <div className="form-group">
      <label htmlFor="login-input">Nom d’usuari o Email *</label>
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

    <div className="form-group">
      <label htmlFor="login-password">Password *</label>
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

    <button type="submit" className="form-button" disabled={loading}>
      {loading ? "Iniciant sessió..." : "Login"}
    </button>

    {/* Link per oblit de la contrasenya */}
    <div style={{ marginTop: "1rem", textAlign: "right" }}>
      <a href="/forgot-password" className="forgot-password-link">
        He oblidat la contrasenya
      </a>
    </div>
  </form>
</div>
  );
};

export default LoginPage;
