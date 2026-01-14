import { useNavigate } from "react-router-dom";

const PortfoliActions = ({ portfoli }) => {
  const navigate = useNavigate();

  const hasAlbums = portfoli.albums && portfoli.albums.length > 0;

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        display: "flex",
        gap: "1rem",
        justifyContent: "flex-end",
      }}
    >
      {/* Crear àlbum */}
      <button
        onClick={() => navigate("/dashboard/crear-album")}
        style={buttonStyle}
      >
        Crear àlbum
      </button>

      {/* Crear obra (només si hi ha àlbums) */}
      <button
        onClick={() => navigate("/dashboard/crear-obra")}
        disabled={!hasAlbums}
        style={{
          ...buttonStyle,
          backgroundColor: hasAlbums ? "#4f46e5" : "#aaa",
          cursor: hasAlbums ? "pointer" : "not-allowed",
        }}
        title={!hasAlbums ? "Crea primer un àlbum" : ""}
      >
        Crear obra
      </button>

      {/* Editar portfoli */}
      <button
        onClick={() =>
          navigate(`/dashboard/editar-portfoli/${portfoli.id}`)
        }
        style={{
          ...buttonStyle,
          backgroundColor: "#16a34a",
        }}
      >
        Editar portfoli
      </button>
    </div>
  );
};

const buttonStyle = {
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  color: "white",
  fontWeight: "600",
  backgroundColor: "#4f46e5",
};

export default PortfoliActions;
