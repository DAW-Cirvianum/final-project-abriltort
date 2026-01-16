import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AlbumForm from "../components/AlbumForm";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

/**
 * Pàgina per editar un àlbum existent dins del portfoli
 *
 * @returns {JSX.Element} Formulari per editar àlbum
 */
const EditAlbumPage = () => {
  const { t } = useTranslation();
  const { albumId } = useParams(); 
  const navigate = useNavigate();
  const { token } = useAuth(); 

  // Estat per l'àlbum carregat i possibles errors
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState(null);

  /**
   * useEffect per carregar les dades de l'àlbum a editar
   */
  useEffect(() => {
    axios
      .get(`http://localhost:8085/api/albums/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAlbum(res.data.data))
      .catch(() => {
        setError(t("editAlbum.noPermission"));
      });
  }, [albumId, token, t]);

  // Mostrem error si l'usuari no té permisos
  if (error) return <p className="error">{error}</p>;

  // Mostrem carregant mentre l'àlbum s'està carregant
  if (!album) return <p>{t("editAlbum.loading")}</p>;

  return (
    <div className="page-wrapper">
      <h2>{t("editAlbum.title")}</h2>

      {/* Formulari reutilitzable amb dades inicials de l'àlbum */}
      <AlbumForm
        portfoliId={album.portfoli_id}
        initialData={album}
        onSuccess={() => navigate(-1)}
      />
    </div>
  );
};

export default EditAlbumPage;
