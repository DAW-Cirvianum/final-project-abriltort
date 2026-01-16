import { useState, useEffect } from "react"; 
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import "../styles/obraForm.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Formulari per crear o editar una obra
 *
 * @param {Object} props
 * @param {Object} [props.initialData] Dades d’una obra existent per editar
 * @param {Array} [props.albums] Llista d’àlbums disponibles
 * @param {Array} [props.categories] Llista de categories disponibles
 * @returns {JSX.Element}
 */
const ObraForm = ({ initialData = {}, albums = [], categories = [] }) => {
  const { token } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Camps del formulari
  const [titol, setTitol] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [fitxer, setFitxer] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* Carrega tots els tags disponibles */
  useEffect(() => {
    axios
      .get("http://localhost:8085/api/tags", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllTags(res.data.data || []))
      .catch(() =>
        showNotification(t("obraForm.errors.loadTags"), "error")
      );
  }, [token, showNotification, t]);

  /* Omple el formulari si és edició */
  useEffect(() => {
    if (initialData?.id) {
      setTitol(initialData.titol || "");
      setDescripcio(initialData.descripcio || "");
      setAlbumId(initialData.album_id || "");
      setCategoriaId(initialData.categoria_id || "");
      setTags(initialData.tags || []);
    }
  }, [initialData]);

  // Focus automàtic al primer camp amb error
  useEffect(() => {
    if (errors.titol) document.getElementById("obra-titol")?.focus();
    else if (errors.albumId) document.getElementById("obra-album")?.focus();
    else if (errors.categoriaId) document.getElementById("obra-categoria")?.focus();
    else if (errors.tags) document.getElementById("obra-tags")?.focus();
    else if (errors.fitxer) document.getElementById("obra-fitxer")?.focus();
  }, [errors]);

  /**
   * Afegeix un tag al formulari si no hi és
   * @param {number|string} tagId 
   */
  const addTag = (tagId) => {
    const tag = allTags.find((t) => t.id === Number(tagId));
    if (tag && !tags.some((t) => t.id === tag.id)) {
      setTags([...tags, tag]);
    }
  };

  /**
   * Elimina un tag del formulari
   * @param {number|string} tagId 
   */
  const removeTag = (tagId) => {
    setTags(tags.filter((t) => t.id !== tagId));
  };

  /* Gestió de l’enviament del formulari */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    if (!titol.trim()) newErrors.titol = t("obraForm.errors.titleRequired");
    if (!albumId) newErrors.albumId = t("obraForm.errors.albumRequired");
    if (!categoriaId) newErrors.categoriaId = t("obraForm.errors.categoryRequired");
    if (!tags.length) newErrors.tags = t("obraForm.errors.tagsRequired");
    if (!fitxer && !initialData?.id) newErrors.fitxer = t("obraForm.errors.fileRequired");

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("titol", titol);
      formData.append("descripcio", descripcio);
      formData.append("album_id", albumId);
      formData.append("categoria_id", categoriaId);
      if (fitxer) formData.append("fitxer", fitxer);
      tags.forEach((tag) => formData.append("tags[]", tag.id));

      const url = initialData?.id
        ? `http://localhost:8085/api/obres/${initialData.id}`
        : "http://localhost:8085/api/obres";

      const method = initialData?.id ? axios.put : axios.post;

      await method(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showNotification(
        initialData?.id
          ? t("obraForm.success.updated")
          : t("obraForm.success.created"),
        "success"
      );
      navigate("/dashboard");

      // Reset camps si és nova obra
      if (!initialData?.id) {
        setTitol("");
        setDescripcio("");
        setAlbumId("");
        setCategoriaId("");
        setTags([]);
        setFitxer(null);
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || t("obraForm.errors.saveFailed"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* Render del formulari */
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h4>{initialData?.id ? t("obraForm.editTitle") : t("obraForm.addTitle")}</h4>

      {/* Títol */}
      <label htmlFor="obra-titol">{t("obraForm.labels.title")} *</label>
      <input
        id="obra-titol"
        type="text"
        value={titol}
        onChange={(e) => setTitol(e.target.value)}
        aria-required="true"
        aria-invalid={errors.titol ? "true" : "false"}
        aria-describedby={errors.titol ? "obra-titol-error" : undefined}
      />
      {errors.titol && <p id="obra-titol-error" className="error">{errors.titol}</p>}

      {/* Descripció */}
      <label htmlFor="obra-descripcio">{t("obraForm.labels.description")}</label>
      <textarea
        id="obra-descripcio"
        value={descripcio}
        onChange={(e) => setDescripcio(e.target.value)}
      />

      {/* Àlbum */}
      <label htmlFor="obra-album">{t("obraForm.labels.album")} *</label>
      <select
        id="obra-album"
        value={albumId}
        onChange={(e) => setAlbumId(e.target.value)}
        aria-required="true"
        aria-invalid={errors.albumId ? "true" : "false"}
        aria-describedby={errors.albumId ? "obra-album-error" : undefined}
      >
        <option value="">
          {albums.length ? t("obraForm.placeholders.selectAlbum") : t("obraForm.placeholders.noAlbums")}
        </option>
        {albums.map((a) => (
          <option key={a.id} value={a.id}>{a.nom}</option>
        ))}
      </select>
      {errors.albumId && <p id="obra-album-error" className="error">{errors.albumId}</p>}

      {/* Categoria */}
      <label htmlFor="obra-categoria">{t("obraForm.labels.category")} *</label>
      <select
        id="obra-categoria"
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
        aria-required="true"
        aria-invalid={errors.categoriaId ? "true" : "false"}
        aria-describedby={errors.categoriaId ? "obra-categoria-error" : undefined}
      >
        <option value="">
          {categories.length ? t("obraForm.placeholders.selectCategory") : t("obraForm.placeholders.noCategories")}
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.nom}</option>
        ))}
      </select>
      {errors.categoriaId && <p id="obra-categoria-error" className="error">{errors.categoriaId}</p>}

      {/* Tags */}
      <label htmlFor="obra-tags">{t("obraForm.labels.tags")} *</label>
      <div id="obra-tags" className="tags-container" aria-describedby={errors.tags ? "obra-tags-error" : undefined}>
        {tags.map((tag) => (
          <span key={tag.id} className="tag-pill" onClick={() => removeTag(tag.id)}>
            {tag.nom} ×
          </span>
        ))}
      </div>
      <select onChange={(e) => addTag(e.target.value)}>
        <option value="">{t("obraForm.placeholders.addTag")}</option>
        {allTags.filter((t) => !tags.some((tag) => tag.id === t.id)).map((t) => (
          <option key={t.id} value={t.id}>{t.nom}</option>
        ))}
      </select>
      {errors.tags && <p id="obra-tags-error" className="error">{errors.tags}</p>}

      {/* Fitxer */}
      <label htmlFor="obra-fitxer">{t("obraForm.labels.file")} *</label>
      <input
        id="obra-fitxer"
        type="file"
        onChange={(e) => setFitxer(e.target.files[0])}
        aria-required={!initialData?.id}
        aria-invalid={errors.fitxer ? "true" : "false"}
        aria-describedby={errors.fitxer ? "obra-fitxer-error" : undefined}
      />
      {errors.fitxer && <p id="obra-fitxer-error" className="error">{errors.fitxer}</p>}

      {/* Botó submit */}
      <button disabled={loading}>
        {loading
          ? t("obraForm.buttons.saving")
          : initialData?.id
          ? t("obraForm.buttons.update")
          : t("obraForm.buttons.add")}
      </button>
    </form>
  );
};

export default ObraForm;
