import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- importem useNavigate
import axios from "axios";
import "../styles/ArtistesSection.css"; 

const ArtistesSection = () => {
  const [artistes, setArtistes] = useState([]);
  const navigate = useNavigate(); // <-- creem el navigate

  useEffect(() => {
    axios
      .get("http://localhost:8085/api/artistes/public?limit=4")
      .then((res) => {
        console.log(res.data); 
        setArtistes(res.data);
      })
      .catch((err) => {
        console.error(err);
        setArtistes([]);
      });
  }, []);

  // Funció per obtenir la imatge correcta de l'artista
  const getArtistaImage = (artista) => {
    if (!artista?.imatge) return "/default-avatar.png";
    if (artista.imatge.startsWith("http")) return artista.imatge;
    if (artista.imatge.startsWith("/storage")) return `http://localhost:8085${artista.imatge}`;
    return `http://localhost:8085/storage/${artista.imatge}`;
  };

  return (
    <section className="artistes-section">
      <div className="container">
        {/* Columna esquerra: valor de la proposta */}
        <div className="left-col">
          <h2>Explora els nostres artistes</h2>
          <p>
            Descobreix els últims talents que s’han unit a la nostra comunitat.
            Cada artista aporta la seva visió única i creativitat.
          </p>
        </div>

        {/* Columna dreta: últims artistes */}
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
