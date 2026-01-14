import { useParams, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/obraPage.css";
import BackButton from "../components/BackButton";

/**
 * Mostra el detall d'una obra concreta amb informació, imatge i navegació dins l'àlbum.
 *
 * @returns {JSX.Element} La pàgina completa de l'obra
 */
const ObraPage = () => {
  // ID de l'obra des de la ruta
  const { obraId } = useParams(); 
  const navigate = useNavigate();

  // Estats per l'obra, llista d'obres de l'àlbum i errors
  const [obra, setObra] = useState(null);
  const [albumObres, setAlbumObres] = useState([]);
  const [error, setError] = useState(null);

  // Funció reusable per obtenir la URL correcta de la imatge
  const getObraImage = (url) => {
    // fallback
    if (!url) return "/no-image.png"; 

    // URL absoluta externa
    if (url.startsWith("http")) return url;

    // Ruta relativa que comença amb /storage
    if (url.startsWith("/storage")) return `http://localhost:8085${url}`;

    // Nom de fitxer
    return `http://localhost:8085/storage/${url}`;
  };

  // Carrega l'obra del backend quan canvia obraId
  useEffect(() => {
    const fetchObra = async () => {
      try {
        const res = await axios.get(`http://localhost:8085/api/obres/${obraId}`);
        setObra(res.data.data);
        setAlbumObres(res.data.data.album.obres);
      } catch (err) {
        setError("Obra no trobada");
      }
    };

    fetchObra();
  }, [obraId]);

  // Envia l'error a l'ErrorBoundary
  if (error) throw new Error(error);

  // Missatge de càrrega
  if (!obra) return <p>Carregant obra...</p>;

  // Obres anterior i següent per navegar dins l'àlbum
  const currentIndex = albumObres.findIndex((o) => o.id === obra.id);
  const prevObra = albumObres[currentIndex - 1];
  const nextObra = albumObres[currentIndex + 1];

  return (
    <main className="obra-wrapper">
      {/* Botó per tornar al portfoli */}
      <BackButton
        to={`/portfoli/${obra.album.portfoli_id}`}
        label="Tornar al portfoli"
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
            {obra.visualitzacions_count ?? obra.visualitzacions?.length} visualitzacions
          </p>
          <p>{obra.descripcio}</p>
          <p>
            <strong>Àlbum:</strong> {obra.album.nom}
          </p>

          {/* Navegació entre obres de l'àlbum */}
          <div className="obra-nav">
            {prevObra && (
              <button onClick={() => navigate(`/obres/${prevObra.id}`)}>Anterior</button>
            )}
            {nextObra && (
              <button onClick={() => navigate(`/obres/${nextObra.id}`)}>Següent</button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ObraPage;
