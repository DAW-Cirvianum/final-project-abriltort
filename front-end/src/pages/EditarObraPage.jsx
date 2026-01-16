import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import ObraForm from "../components/ObraForm";
import { useTranslation } from "react-i18next";

/**
 * Pàgina per editar una obra existent
 *
 * @returns {JSX.Element} Formulari per editar obra amb àlbums i categories disponibles
 */
const EditarObraPage = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { id } = useParams();

  // Estat per guardar albums, categories, obra i estats de càrrega/errors
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [obraData, setObraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect per carregar dades necessàries abans de mostrar el formulari
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Crida concurrent per millorar rendiment
        const [albumsRes, categoriesRes, obraRes] = await Promise.all([
          axios.get("http://localhost:8085/api/portfoli/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8085/api/categories"),
          axios.get(`http://localhost:8085/api/obres/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Guardem les dades en estat
        setAlbums(albumsRes.data.data.albums || []);
        setCategories(categoriesRes.data.data || []);
        setObraData(obraRes.data.data);
      } catch (err) {
        console.error(err);
        setError(t("editObra.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, id, t]);

  // Mostrem carregant mentre les dades arriben
  if (loading) return <p>{t("editObra.loading")}</p>;

  // Mostrem error si falla alguna crida
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>{t("editObra.title")}</h2>

      {/* Formulari reutilitzable per editar obra */}
      <ObraForm
        initialData={obraData} 
        albums={albums}        
        categories={categories} 
      />
    </div>
  );
};

export default EditarObraPage;
