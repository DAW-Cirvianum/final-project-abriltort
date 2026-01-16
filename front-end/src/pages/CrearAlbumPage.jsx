import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AlbumForm from "../components/AlbumForm";
import "../styles/albumForm.css"; 
import { useTranslation } from "react-i18next"; 

/**
 * Pàgina per crear un nou àlbum dins del portfoli de l'usuari
 *
 * @returns {JSX.Element} Formulari per crear àlbum amb verificació de portfoli
 */
const CrearAlbumPage = () => {
  const { t } = useTranslation(); 
  const { token } = useAuth();
  const navigate = useNavigate();

  // Estat per guardar el portfoli de l'usuari i el loading
  const [portfoli, setPortfoli] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * useEffect per carregar el portfoli de l'usuari autenticat
   */
  useEffect(() => {
    axios
      .get("http://localhost:8085/api/portfoli/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPortfoli(res.data.data))
      .catch(() => setPortfoli(null))
      .finally(() => setLoading(false));
  }, [token]);

  // Mostrem loading mentre carrega el portfoli
  if (loading) return <p style={{ textAlign: "center" }}>{t("crearAlbumPage.loading")}</p>;

  // Si l'usuari no té portfoli, mostrar missatge i botó per tornar al dashboard
  if (!portfoli) {
    return (
      <div className="crear-album-page">
        <h2>{t("crearAlbumPage.noPortfoli")}</h2>
        <button onClick={() => navigate("/dashboard")}>
          {t("crearAlbumPage.backButton")}
        </button>
      </div>
    );
  }

  return (
    <div className="crear-album-page">
      <h1>{t("crearAlbumPage.title")}</h1>

      {/* Formulari reutilitzable amb l'ID del portfoli */}
      <AlbumForm
        portfoliId={portfoli.id}
        onSuccess={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default CrearAlbumPage;
