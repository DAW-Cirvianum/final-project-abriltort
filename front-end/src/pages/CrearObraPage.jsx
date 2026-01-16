import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ObraForm from "../components/ObraForm";
import { useTranslation } from "react-i18next";

/**
 * Pàgina per crear o editar una obra dins del portfoli de l'usuari.
 *
 * @param {Object} props
 * @param {number} [props.obraId] ID de l'obra a editar (si existeix)
 * @returns {JSX.Element} Formulari d'obra amb dades carregades
 */
const CrearObraPage = ({ obraId }) => {
  const { t } = useTranslation();
  const { token } = useAuth();

  // Estat per àlbums, categories i obra (en cas d'edició)
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [obraData, setObraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect per carregar les dades necessàries: àlbums, categories i obra (si s'edita)
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Crida per àlbums i categories
        const [albumsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:8085/api/portfoli/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8085/api/categories"),
        ]);

        setAlbums(albumsRes.data.data.albums || []);
        setCategories(categoriesRes.data.data || []);

        // Si estem editant, carregar obra específica
        if (obraId) {
          const obraRes = await axios.get(`http://localhost:8085/api/obres/${obraId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setObraData(obraRes.data.data);
        }
      } catch (err) {
        console.error(err);
        setError(t("crearObraPage.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, obraId, t]);

  /**
   * Callback després de crear o editar l'obra
   * @param {Object} novaObra Dades de l'obra guardada
   */
  const handleSuccess = (novaObra) => {
    console.log("Obra guardada:", novaObra);
  };

  // Missatges de carregant i errors
  if (loading) return <p>{t("crearObraPage.loading")}</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>{obraId ? t("crearObraPage.editTitle") : t("crearObraPage.createTitle")}</h2>

      {/* Formulari reutilitzable amb àlbums, categories i dades inicials */}
      <ObraForm
        initialData={obraData}
        albums={albums}
        categories={categories}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CrearObraPage;
