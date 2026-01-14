import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import "../styles/obraForm.css";
import { useNavigate } from "react-router-dom";

const ObraForm = ({ initialData = {}, albums = [], categories = [] }) => {
  const { token } = useAuth();
  const { showNotification } = useNotification();

  const [titol, setTitol] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [fitxer, setFitxer] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  /* tags*/
  useEffect(() => {
    axios
      .get("http://localhost:8085/api/tags", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllTags(res.data.data || []))
      .catch(() =>
        showNotification("Error carregant tags", "error")
      );
  }, [token, showNotification]);

  /* edició */
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

  const addTag = (tagId) => {
    const tag = allTags.find((t) => t.id === Number(tagId));
    if (tag && !tags.some((t) => t.id === tag.id)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagId) => {
    setTags(tags.filter((t) => t.id !== tagId));
  };

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    if (!titol.trim()) newErrors.titol = "El títol és obligatori.";
    if (!albumId) newErrors.albumId = "Selecciona un àlbum.";
    if (!categoriaId) newErrors.categoriaId = "Selecciona una categoria.";
    if (!tags.length) newErrors.tags = "Afegeix almenys un tag.";
    if (!fitxer && !initialData?.id) newErrors.fitxer = "El fitxer és obligatori.";

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
          ? "Obra actualitzada correctament!"
          : "Obra creada correctament!",
        "success"
      );
      navigate("/dashboard");

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
        err.response?.data?.message || "No s'ha pogut guardar l'obra.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* render */
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h4>{initialData?.id ? "Editar Obra" : "Afegir Obra"}</h4>

      <label htmlFor="obra-titol">Títol *</label>
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

      <label htmlFor="obra-descripcio">Descripció</label>
      <textarea
        id="obra-descripcio"
        value={descripcio}
        onChange={(e) => setDescripcio(e.target.value)}
      />

      <label htmlFor="obra-album">Àlbum *</label>
      <select
        id="obra-album"
        value={albumId}
        onChange={(e) => setAlbumId(e.target.value)}
        aria-required="true"
        aria-invalid={errors.albumId ? "true" : "false"}
        aria-describedby={errors.albumId ? "obra-album-error" : undefined}
      >
        <option value="">
          {albums.length ? "-- Selecciona un àlbum --" : "No hi ha àlbums disponibles"}
        </option>
        {albums.map((a) => (
          <option key={a.id} value={a.id}>{a.nom}</option>
        ))}
      </select>
      {errors.albumId && <p id="obra-album-error" className="error">{errors.albumId}</p>}

      <label htmlFor="obra-categoria">Categoria *</label>
      <select
        id="obra-categoria"
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
        aria-required="true"
        aria-invalid={errors.categoriaId ? "true" : "false"}
        aria-describedby={errors.categoriaId ? "obra-categoria-error" : undefined}
      >
        <option value="">
          {categories.length ? "-- Selecciona una categoria --" : "No hi ha categories disponibles"}
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.nom}</option>
        ))}
      </select>
      {errors.categoriaId && <p id="obra-categoria-error" className="error">{errors.categoriaId}</p>}

      <label htmlFor="obra-tags">Tags *</label>
      <div id="obra-tags" className="tags-container" aria-describedby={errors.tags ? "obra-tags-error" : undefined}>
        {tags.map((tag) => (
          <span key={tag.id} className="tag-pill" onClick={() => removeTag(tag.id)}>
            {tag.nom} ×
          </span>
        ))}
      </div>
      <select onChange={(e) => addTag(e.target.value)}>
        <option value="">-- Afegir tag --</option>
        {allTags
          .filter((t) => !tags.some((tag) => tag.id === t.id))
          .map((t) => (
            <option key={t.id} value={t.id}>{t.nom}</option>
          ))}
      </select>
      {errors.tags && <p id="obra-tags-error" className="error">{errors.tags}</p>}

      <label htmlFor="obra-fitxer">Fitxer *</label>
      <input
        id="obra-fitxer"
        type="file"
        onChange={(e) => setFitxer(e.target.files[0])}
        aria-required={!initialData?.id}
        aria-invalid={errors.fitxer ? "true" : "false"}
        aria-describedby={errors.fitxer ? "obra-fitxer-error" : undefined}
      />
      {errors.fitxer && <p id="obra-fitxer-error" className="error">{errors.fitxer}</p>}

      <button disabled={loading}>
        {loading
          ? "Guardant..."
          : initialData?.id
          ? "Actualitzar Obra"
          : "Afegir Obra"}
      </button>
    </form>
  );
};

export default ObraForm;
