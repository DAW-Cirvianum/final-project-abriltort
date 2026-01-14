import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/home.css";

const ObresSection = () => {
  const [obres, setObres] = useState([]);
  const navigate = useNavigate(); // <-- per la navegació

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

  const getObraImage = (obra) => {
    if (!obra?.fitxer_url) return "/no-image.png";
    if (obra.fitxer_url.startsWith("http")) return obra.fitxer_url;
    if (obra.fitxer_url.startsWith("/storage"))
      return `http://localhost:8085${obra.fitxer_url}`;
    return `http://localhost:8085/storage/${obra.fitxer_url}`;
  };

  return (
    <section className="obres-section">
      <h2>Obres</h2>
      <p className="subtitle">
        Explora les galàxies úniques i les constel·lacions de cada artista
      </p>

      <div className="obres-grid">
        {obres.map((obra) => (
          <article
            key={obra.id}
            className="obra-card"
            //navega al clicar la imatge o card
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

      <button
        className="veure-mes"
        // navega a totes les obres
        onClick={() => navigate("/obres")} 
      >
        Veure totes
      </button>
    </section>
  );
};

export default ObresSection;
