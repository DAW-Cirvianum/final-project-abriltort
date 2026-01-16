import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Paginacio";
import { useAuth } from "../context/AuthContext"; 
import { useTranslation } from "react-i18next";

/**
 * Pàgina d'artistes
 * 
 * Mostra una llista paginada d'artistes públics excloent l'usuari loguejat
 */
const ArtistesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); 
  const [artistes, setArtistes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const limit = 4;
  const navigate = useNavigate();

  /**
   * Obté artistes des de l'API cada cop que canvia la pàgina o l'usuari
   */
  useEffect(() => {
    const fetchArtistes = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`http://localhost:8085/api/artistes?limit=${limit}&page=${page}`);
        let data = res.data.data || [];

        // Excloure l'usuari loguejat si existeix
        if (user?.id) {
          data = data.filter((artista) => artista.id !== user.id);
        }

        setArtistes(data);

        const meta = res.data.meta || {};
        setHasMore(meta.current_page < meta.last_page);
      } catch (err) {
        console.error(err);
        setError(t("artistesPage.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchArtistes();
  }, [page, user, t]);

  /**
   * Navega al portfoli de l'artista
   * @param {number} id ID de l'artista
   */
  const handleClick = (id) => navigate(`/portfoli/${id}`);

  /**
   * Obté la imatge correcta de l'artista
   * @param {Object} artista Objecte artista
   * @returns {string} URL de la imatge
   */
  const getArtistaImage = (artista) => {
    if (!artista?.imatge) return "/default-avatar.png";
    if (artista.imatge.startsWith("http")) return artista.imatge;
    if (artista.imatge.startsWith("/storage")) return `http://localhost:8085${artista.imatge}`;
    return `http://localhost:8085/storage/${artista.imatge}`;
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "2rem auto" }}>
      <h1>{t("artistesPage.title")}</h1>

      {/* Estat de càrrega */}
      {loading && <p>{t("artistesPage.loading")}</p>}

      {/* Error en la càrrega */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {/* Cap artistes trobats */}
          {artistes.length === 0 ? (
            <p>{t("artistesPage.noArtistes")}</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
              {artistes.map((artista) => (
                <div
                  key={artista.id}
                  style={{ cursor: "pointer", textAlign: "center", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}
                  onClick={() => handleClick(artista.id)}
                >
                  <img
                    src={getArtistaImage(artista)}
                    alt={artista.nom || artista.name || t("artistesPage.defaultName")}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "50%" }}
                    loading="lazy"
                  />
                  <h3>{artista.nom || artista.name || t("artistesPage.defaultName")}</h3>
                  <p>{artista.rol}</p>
                </div>
              ))}
            </div>
          )}

          {/* Paginació */}
          <Pagination
            page={page}
            onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => hasMore && setPage((prev) => prev + 1)}
            disableNext={!hasMore}
          />
        </>
      )}
    </div>
  );
};

export default ArtistesPage;
