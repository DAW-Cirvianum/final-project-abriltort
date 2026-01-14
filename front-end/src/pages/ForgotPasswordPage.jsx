import { useState } from "react";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(""); 
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error
    setEmailError("");

    if (!email.trim()) {
      setEmailError("L’email és obligatori");
      return;
    }

    // Regex per validar format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("El format de l’email no és vàlid");
      return;
    }

    setLoading(true);
  try {
  const res = await axios.post("http://localhost:8085/api/forgot-password", {
    email,
  });

  if (res.data.success) {
    // neteja errors del camp
    setEmailError(""); 
    // modal o notificació
    showNotification(res.data.message, "success"); 
  } else {
    setEmailError(res.data.message || "L’email no és vàlid");
  }
} catch (err) {
  console.error(err);
  showNotification("No s'ha pogut connectar amb el servidor", "error");
}finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Recupera la contrasenya</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
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
          {loading ? "Enviant..." : "Envia correu"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
