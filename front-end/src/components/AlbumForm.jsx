import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import "../styles/albumForm.css";

const AlbumForm = ({
  portfoliId,
  portfoliAlbums = [],
  initialData = {},
  onSuccess,
}) => {
  const { token } = useAuth();
  const { showNotification } = useNotification();

  const [nom, setNom] = useState(initialData.nom || "");
  const [descripcio, setDescripcio] = useState(initialData.descripcio || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Omple els camps si estem editant
  useEffect(() => {
    if (initialData.id) {
      setNom(initialData.nom || "");
      setDescripcio(initialData.descripcio || "");
    }
  }, [initialData]);

  // Focus automàtic al primer camp amb error
  useEffect(() => {
    if (errors.nom) {
      document.getElementById("album-nom")?.focus();
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!nom.trim()) {
      setErrors({ nom: "El camp nom és obligatori." });
      setLoading(false);
      return;
    }

    try {
      const payload = { nom, descripcio, portfoli_id: portfoliId };
      const url = initialData.id
        ? `http://localhost:8085/api/albums/${initialData.id}`
        : "http://localhost:8085/api/albums";
      const method = initialData.id ? axios.put : axios.post;

      const response = await method(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedAlbum = response.data?.data || response.data;

      showNotification(
        initialData.id
          ? "Àlbum actualitzat correctament!"
          : "Àlbum creat correctament!",
        "success"
      );

      if (!initialData.id) {
        setNom("");
        setDescripcio("");
      }

      if (onSuccess) onSuccess(updatedAlbum);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 422) {
        const message = err.response.data?.message || "Hi ha errors al formulari.";
        setErrors({ nom: message });
      } else {
        showNotification(
          err.response?.data?.message || "No s'ha pogut guardar l'àlbum.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="album-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="album-nom">Nom de l'àlbum *</label>
        <input
          id="album-nom"
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Escriu el nom de l'àlbum"
          aria-required="true"
          aria-invalid={errors.nom ? "true" : "false"}
          aria-describedby={errors.nom ? "album-nom-error" : undefined}
        />
        {errors.nom && (
          <p id="album-nom-error" className="error">
            {errors.nom}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="album-descripcio">Descripció</label>
        <textarea
          id="album-descripcio"
          value={descripcio}
          onChange={(e) => setDescripcio(e.target.value)}
          placeholder="Escriu una descripció opcional"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading
          ? "Guardant..."
          : initialData.id
          ? "Actualitzar àlbum"
          : "Crear àlbum"}
      </button>
    </form>
  );
};

export default AlbumForm;
