import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import "../styles/PortfoliForm.css";

const PortfoliForm = ({ onSuccess }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [titol, setTitol] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchPortfoli = async () => {
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:8085/api/portfoli/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.data) {
          setTitol(res.data.data.titol || "");
          setDescripcio(res.data.data.descripcio || "");
          setIsEdit(true);
        }
      } catch (err) {
        console.error("No s'ha pogut carregar el portfoli:", err);
      }
    };

    fetchPortfoli();
  }, [token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!titol.trim()) {
      setErrors({ titol: "El camp títol és obligatori." });
      return;
    }

    setLoading(true);

    try {
      const payload = { titol, descripcio };
      const url = isEdit
        ? "http://localhost:8085/api/portfoli/my"
        : "http://localhost:8085/api/portfolis";
      const method = isEdit ? axios.put : axios.post;

      const res = await method(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification(
        isEdit
          ? "Portfoli actualitzat correctament!"
          : "Portfoli creat correctament!",
        "success"
      );

      if (onSuccess) onSuccess(res.data.data);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        const fieldErrors = {};
        for (const field in err.response.data.errors) {
          fieldErrors[field] = err.response.data.errors[field].join(" ");
        }
        setErrors(fieldErrors);
      } else {
        showNotification(
          err.response?.data?.message || "Hi ha hagut un problema. Torna-ho a provar.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="portfoli-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="portfoli-titol">Títol *</label>
        <input
          id="portfoli-titol"
          type="text"
          value={titol}
          onChange={(e) => setTitol(e.target.value)}
          aria-required="true"
          aria-invalid={errors.titol ? "true" : "false"}
          aria-describedby={errors.titol ? "error-titol" : undefined}
        />
        {errors.titol && (
          <p id="error-titol" className="error">
            {errors.titol}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="portfoli-descripcio">Descripció</label>
        <textarea
          id="portfoli-descripcio"
          value={descripcio}
          onChange={(e) => setDescripcio(e.target.value)}
          rows={4}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Guardant..." : isEdit ? "Actualitzar" : "Crear"}
      </button>
    </form>
  );
};

export default PortfoliForm;
