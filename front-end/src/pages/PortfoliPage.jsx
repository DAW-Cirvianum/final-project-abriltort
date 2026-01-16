import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PortfoliInfo from "../components/PortfoliInfo";
import AlbumsList from "../components/AlbumsList";
import ObresList from "../components/ObresList";
import { useNotification } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";
import "../styles/portfoliPage.css";

/**
 * Pàgina per mostrar un portfoli amb els seus àlbums i obres.
 *
 * @param {Object} props
 * @param {Object} [props.portfoli] Portfoli pre-carregat opcional
 * @returns {JSX.Element} Component complet del portfoli
 */
const PortfoliPage = ({ portfoli: propPortfoli }) => {
  const { artistId } = useParams();
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  // Estat del portfoli
  const [portfoli, setPortfoli] = useState(
    propPortfoli || { albums: [], usuari_id: null, id: null }
  );
  const [loading, setLoading] = useState(!propPortfoli);
  const [error, setError] = useState(null);

  // Àlbum seleccionat i obres per àlbum
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [obresByAlbum, setObresByAlbum] = useState({});
  const [loadingObres, setLoadingObres] = useState(false);

  /**
   * useEffect per carregar el portfoli des del backend
   */
  useEffect(() => {
    if (propPortfoli) return;

    if (!artistId) {
      setError(t("portfoli.noArtistId"));
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8085/api/portfolis/${artistId}`)
      .then((res) => {
        const data = res.data?.data;
        if (!data || !data.id) {
          setError(t("portfoli.noPortfolio"));
          setPortfoli({ albums: [], usuari_id: null, id: null });
        } else {
          setPortfoli(data);
        }
      })
      .catch(() => setError(t("portfoli.noPortfolio")))
      .finally(() => setLoading(false));
  }, [artistId, propPortfoli, t]);

  /**
   * Selecciona un àlbum i carrega les seves obres, només si encara no s'han carregat
   *
   * @param {number} albumId ID de l'àlbum seleccionat
   */
  const handleSelectAlbum = async (albumId) => {
    setSelectedAlbumId(albumId);
    if (!obresByAlbum[albumId]) {
      setLoadingObres(true);
      try {
        const res = await axios.get(
          `http://localhost:8085/api/albums/${albumId}/obres`
        );
        setObresByAlbum((prev) => ({
          ...prev,
          [albumId]: res.data?.data || [],
        }));
      } catch (err) {
        setObresByAlbum((prev) => ({ ...prev, [albumId]: [] }));
        showNotification(t("portfoli.loadObresError"), "error");
      } finally {
        setLoadingObres(false);
      }
    }
  };

  /**
   * Gestiona accions sobre les obres
   *
   * @param {Object} action Objecte amb informació de l'acció
   * @param {string} action.type Tipus d'acció: 'delete', 'update', 'edit'
   * @param {number} [action.id] ID de l'obra a eliminar
   * @param {Object} [action.obra] Obra actualitzada
   */
  const handleObraAction = (action) => {
    if (!selectedAlbumId) return;

    if (action.type === "delete") {
      setObresByAlbum((prev) => ({
        ...prev,
        [selectedAlbumId]: prev[selectedAlbumId].filter(
          (o) => o.id !== action.id
        ),
      }));
    } else if (action.type === "update" || action.type === "edit") {
      setObresByAlbum((prev) => ({
        ...prev,
        [selectedAlbumId]: prev[selectedAlbumId].map((o) =>
          o.id === action.obra.id ? action.obra : o
        ),
      }));
    }
  };

  if (loading) return <p>{t("portfoli.loading")}</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="portfoli-wrapper">
      {/* Informació general del portfoli */}
      <PortfoliInfo portfoli={portfoli} />

      <div className="portfoli-content">
        {/* Llista d'àlbums */}
        <AlbumsList
          albums={portfoli.albums}
          portfoli={portfoli}
          onAlbumDeleted={(albumId) => {
            setPortfoli((prev) => ({
              ...prev,
              albums: prev.albums.filter((a) => a.id !== albumId),
            }));
            if (selectedAlbumId === albumId) {
              setSelectedAlbumId(null);
            }
          }}
          onSelectAlbum={handleSelectAlbum}
        />

        {/* Llista d'obres de l'àlbum seleccionat */}
        {selectedAlbumId && (
          <div className="obres-list">
            {loadingObres ? (
              <p>{t("portfoli.loadingObres")}</p>
            ) : (
              <ObresList
                obres={obresByAlbum[selectedAlbumId] || []}
                ownerId={portfoli.usuari_id}
                onObraAction={handleObraAction}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfoliPage;
