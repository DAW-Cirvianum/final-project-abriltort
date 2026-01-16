import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/ArtistesSection.css"; 

/**
 * Secció que mostra una selecció d’artistes destacats
 *
 * @returns {JSX.Element}
 */
const ArtistesSection = () => {
  // Llista d’artistes a mostrar
  const [artistes, setArtistes] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Carrega els últims artistes en muntar el component
  useEffect(() => {
    axios
      .get("http://localhost:8085/api/artistes/public?limit=4")
      .then((res) => {
        setArtistes(res.data);
      })
      .catch((err) => {
        console.error(err);
        setArtistes([]);
      });
  }, []);

  /**
   * Retorna la URL correcta de la imatge de l’artista, gestiona imatges 
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
    <section className="artistes-section">
      <div className="container">
        {/* Columna esquerra */}
        <div className="left-col">
          <h2>{t("artistes.title")}</h2>
          <p>{t("artistes.description")}</p>
        </div>

        {/* Columna dreta*/}
        <div className="right-col">
          {artistes.map((artista) => (
            <div
              key={artista.id}
              className="artista-card"
              onClick={() => navigate(`/portfoli/${artista.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={getArtistaImage(artista)}
                alt={artista.nom || artista.name}
              />
              <h3>{artista.nom || artista.name}</h3>
              <p>{artista.rol}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistesSection;
