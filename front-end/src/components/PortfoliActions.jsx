import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Botons d'acció per a un portfolii: crear àlbum, crear obra, editar portfoli
 * @param {Object} props
 * @param {Object} props.portfoli Portfoli de l'usuari
 * @returns {JSX.Element}
 */
const PortfoliActions = ({ portfoli }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        {t("portfolio.createAlbum")}
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
        title={!hasAlbums ? t("portfolio.createAlbumFirst") : ""}
      >
        {t("portfolio.createObra")}
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
        {t("portfolio.editPortfolio")}
      </button>
    </div>
  );
};

/** Estil base per tots els botons del PortfoliActions */
const buttonStyle = {
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  color: "white",
  fontWeight: "600",
  backgroundColor: "#4f46e5",
};

export default PortfoliActions;
