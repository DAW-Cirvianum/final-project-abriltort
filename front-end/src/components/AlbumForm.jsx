import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";
import "../styles/albumForm.css";

/**
 * Formulari per crear o editar un àlbum dins d’un portfoli
 *
 * @param {number} portfoliId - ID del portfoli al qual pertany l’àlbum
 * @param {Array} portfoliAlbums - Llista d’àlbums del portfoli (opcional)
 * @param {Object} initialData - Dades inicials de l’àlbum si estem editant
 * @param {Function} onSuccess - Callback que s’executa quan el formulari s’envia correctament
 * @returns {JSX.Element}
 */
const AlbumForm = ({
  portfoliId,
  portfoliAlbums = [],
  initialData = {},
  onSuccess,
}) => {
  // Token d'autenticació de l'usuari
  const { token } = useAuth();

  // Funció per mostrar notificacions a l'usuari
  const { showNotification } = useNotification();

  // Funció de traducció (i18n)
  const { t } = useTranslation();

  // Estat del nom de l’àlbum
  const [nom, setNom] = useState(initialData.nom || "");

  // Estat de la descripció de l’àlbum
  const [descripcio, setDescripcio] = useState(initialData.descripcio || "");

  // Controla l’estat de càrrega del formulari
  const [loading, setLoading] = useState(false);

  // Errors de validació del formulari
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

  /**
   * Gestiona l'enviament del formulari
   * Valida les dades, fa la petició a l’API i gestiona els errors
   *
   * @param {React.FormEvent} e - Esdeveniment del submit del formulari
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validació nom és obligatori
    if (!nom.trim()) {
      setErrors({ nom: t("album.errors.requiredName") });
      setLoading(false);
      return;
    }

    try {
      const payload = { nom, descripcio, portfoli_id: portfoliId };

      // URL i mètode depenent de l'acció
      const url = initialData.id
        ? `http://localhost:8085/api/albums/${initialData.id}`
        : "http://localhost:8085/api/albums";
      const method = initialData.id ? axios.put : axios.post;

      // Petició a l'API amb token d'autenticació
      const response = await method(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Àlbum retornat pel backend
      const updatedAlbum = response.data?.data || response.data;

      // Notificació d'èxit
      showNotification(
        initialData.id
          ? t("album.notifications.updateSuccess")
          : t("album.notifications.createSuccess"),
        "success"
      );

      // Neteja del formulari si s’ha creat un nou àlbum
      if (!initialData.id) {
        setNom("");
        setDescripcio("");
      }

      
      if (onSuccess) onSuccess(updatedAlbum);
    } catch (err) {
      console.error(err);

      // Errors de validació del backend
      if (err.response?.status === 422) {
        const message =
          err.response.data?.message || t("album.errors.formError");
        setErrors({ nom: message });
      } else {
        // Error genèric
        showNotification(
          err.response?.data?.message || t("album.errors.saveError"),
          "error"
        );
      }
    } finally {
      // Finalitza l’estat de càrrega
      setLoading(false);
    }
  };

  return (
    <form className="album-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="album-nom">{t("album.fields.name")} *</label>
        <input
          id="album-nom"
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder={t("album.placeholders.name")}
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
        <label htmlFor="album-descripcio">
          {t("album.fields.description")}
        </label>
        <textarea
          id="album-descripcio"
          value={descripcio}
          onChange={(e) => setDescripcio(e.target.value)}
          placeholder={t("album.placeholders.description")}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading
          ? t("common.saving")
          : initialData.id
          ? t("album.buttons.update")
          : t("album.buttons.create")}
      </button>
    </form>
  );
};

export default AlbumForm;
