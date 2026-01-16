import { useNavigate } from "react-router-dom";

/**
 * Component per mostrar obres en una graella
 *
 * @param {Object} props
 * @param {Array} props.obres Llista d'obres a mostrar
 * @returns {JSX.Element}
 */
const ObresGrid = ({ obres }) => {
  const navigate = useNavigate();

  /**
   * Obté la URL correcta de la imatge d'una obra
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
    <div className="grid">
      {obres.map(obra => (
        <div
          key={obra.id}
          className="border"
          onClick={() => navigate(`/obres/${obra.id}`)}
        >
          {/* Imatge de l'obra */}
          <img src={getObraImage(obra)} alt={obra.titol} />

          {/* Informació de l'obra */}
          <div className="p-3">
            <h3>{obra.titol}</h3>
            {obra.categoria && <p>{obra.categoria.nom}</p>}

            {/* Tags */}
            <div className="flex">
              {obra.tags?.map(tag => (
                <span key={tag.id}>#{tag.nom}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ObresGrid;

