import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/home.css";

/**
 * Secció de la pàgina d'inici amb les últimes obres
 *
 * @returns {JSX.Element}
 */
const ObresSection = () => {
  const [obres, setObres] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Carrega les últimes obres al muntar el component
  useEffect(() => {
    axios
      .get("http://localhost:8085/api/obres/public?limit=4")
      .then((res) => {
        console.log(res.data.data); 
        setObres(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setObres([]);
      });
  }, []);

  /**
   * Retorna la URL correcta de la imatge d'una obra
   * @param {Object} obra 
   * @returns {string}
   */
  const getObraImage = (obra) => {
    if (!obra?.fitxer_url) return "/no-image.png";
    if (obra.fitxer_url.startsWith("http")) return obra.fitxer_url;
    if (obra.fitxer_url.startsWith("/storage"))
      return `http://localhost:8085${obra.fitxer_url}`;
    return `http://localhost:8085/storage/${obra.fitxer_url}`;
  };

  return (
    <section className="obres-section">
      <h2>{t("obresSection.title")}</h2>
      <p className="subtitle">{t("obresSection.subtitle")}</p>

      {/* Graella amb les últimes obres */}
      <div className="obres-grid">
        {obres.map((obra) => (
          <article
            key={obra.id}
            className="obra-card"
            onClick={() => navigate(`/obres/${obra.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={getObraImage(obra)} alt={obra.titol} />
            <div className="obra-info">
              <h3>{obra.titol}</h3>
              <span>{obra.categoria?.nom}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Botó per veure totes les obres */}
      <button
        className="veure-mes"
        onClick={() => navigate("/obres")}
      >
        {t("obresSection.viewAll")}
      </button>
    </section>
  );
};

export default ObresSection;
