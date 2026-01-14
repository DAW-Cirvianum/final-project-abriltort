import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";

const ResetPasswordPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const email = query.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  // Estats per errors
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setPasswordError("");
    setPasswordConfirmationError("");
    setGeneralError("");

    // Validacions locals
    if (!token || !email) {
      setGeneralError("Enllaç no vàlid o caducat");
      return;
    }

    if (password.length < 8) {
      setPasswordError("La contrasenya ha de tenir mínim 8 caràcters");
      return;
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError("Les contrasenyes no coincideixen");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8085/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Si tot és correcte, mostrem el modal de notificació
      showNotification("Contrasenya canviada correctament!", "success");

      // Naveguem al login després d'uns segons
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err.response?.data || err);
      setGeneralError(
        "L'enllaç ha caducat o és incorrecte. Sol·licita un nou enllaç."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Restablir contrasenya</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Nova contrasenya *</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Nova contrasenya"
            placeholder="Mínim 8 caràcters"
          />
          {passwordError && (
            <p className="error-message" role="alert">{passwordError}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="passwordConfirmation">Confirma la contrasenya *</label>
          <input
            id="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            aria-label="Confirma la contrasenya"
            placeholder="Torna a escriure la contrasenya"
          />
          {passwordConfirmationError && (
            <p className="error-message" role="alert">{passwordConfirmationError}</p>
          )}
        </div>

        {generalError && (
          <p className="error-message" role="alert">{generalError}</p>
        )}

        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Restablint..." : "Restablir contrasenya"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
