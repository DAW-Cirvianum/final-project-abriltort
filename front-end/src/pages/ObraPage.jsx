import { useParams, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/obraPage.css";
import BackButton from "../components/BackButton";
import { useTranslation } from "react-i18next";

/**
 * Mostra el detall d'una obra concreta amb informació,
 * imatge i navegació dins l'àlbum.
 *
 * @returns {JSX.Element} La pàgina completa de l'obra
 */
const ObraPage = () => {
  // Hook de traducció
  const { t } = useTranslation();

  // ID de l'obra des de la ruta
  const { obraId } = useParams(); 
  const navigate = useNavigate();

  // Estats per l'obra, llista d'obres de l'àlbum i errors
  const [obra, setObra] = useState(null);
  const [albumObres, setAlbumObres] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Funció reusable per obtenir la URL correcta de la imatge de l'obra
   *
   * @param {string} url URL o nom del fitxer de la imatge
   * @returns {string} URL completa per mostrar la imatge
   */
  const getObraImage = (url) => {
    if (!url) return "/no-image.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/storage")) return `http://localhost:8085${url}`; 
    return `http://localhost:8085/storage/${url}`; 
  };

  /**
   * useEffect per carregar l'obra i les obres del seu àlbum
   * quan canvia l'obraId
   */
  useEffect(() => {
    const fetchObra = async () => {
      try {
        const res = await axios.get(`http://localhost:8085/api/obres/${obraId}`);
        setObra(res.data.data);
        setAlbumObres(res.data.data.album.obres || []);
      } catch (err) {
        setError(t("obra.notFound"));
      }
    };

    fetchObra();
  }, [obraId, t]);

  // Envia l'error a l'ErrorBoundary
  if (error) throw new Error(error);

  // Missatge de càrrega
  if (!obra) return <p>{t("obra.loading")}</p>;

  // Obres anterior i següent per navegar dins l'àlbum
  const currentIndex = albumObres.findIndex((o) => o.id === obra.id);
  const prevObra = albumObres[currentIndex - 1];
  const nextObra = albumObres[currentIndex + 1];

  return (
    <main className="obra-wrapper">
      {/* Botó per tornar al portfoli */}
      <BackButton
        to={`/portfoli/${obra.album.portfoli_id}`}
        label={t("obra.backToPortfolio")}
      />

      <div className="obra-page">
        {/* Imatge de l'obra */}
        <div className="obra-image">
          <img src={getObraImage(obra.fitxer_url)} alt={obra.titol} />
        </div>

        {/* Informació de l'obra */}
        <div className="obra-info">
          <h1>{obra.titol}</h1>
          <p className="obra-views">
            {obra.visualitzacions_count ?? obra.visualitzacions?.length} {t("obra.views")}
          </p>
          <p>{obra.descripcio}</p>
          <p>
            <strong>{t("obra.album")}:</strong> {obra.album.nom}
          </p>

          {/* Navegació entre obres de l'àlbum */}
          <div className="obra-nav">
            {prevObra && (
              <button onClick={() => navigate(`/obres/${prevObra.id}`)}>
                {t("obra.prev")}
              </button>
            )}
            {nextObra && (
              <button onClick={() => navigate(`/obres/${nextObra.id}`)}>
                {t("obra.next")}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ObraPage;
