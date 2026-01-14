import { useNavigate } from "react-router-dom";

const ObresGrid = ({ obres }) => {
  const navigate = useNavigate();

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
          <img src={getObraImage(obra)} alt={obra.titol} />
          <div className="p-3">
            <h3>{obra.titol}</h3>
            {obra.categoria && <p>{obra.categoria.nom}</p>}
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
