import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import PortfoliActions from "../components/PortfoliActions";
import PortfoliInfo from "../components/PortfoliInfo";
import AlbumsList from "../components/AlbumsList";
import ObresList from "../components/ObresList";

import "../styles/portfoliPage.css";
import "../styles/dashboardPage.css";
import { useTranslation } from "react-i18next";

/**
 * Pàgina que mostra el portfoli d'un artista
 *
 * @param {Object} props
 * @param {Object} [props.portfoli] Portfoli pre-carregat
 * @returns {JSX.Element} Component amb àlbums i obres d'un portfoli
 */
const PortfoliPage = ({ portfoli: propPortfoli }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { artistId: paramArtistId } = useParams();
  const navigate = useNavigate();

  const artistId = paramArtistId || user?.id;

  // Estat principal del portfoli
  const [portfoli, setPortfoli] = useState(
    propPortfoli || { albums: [], usuari_id: null }
  );
  const [loading, setLoading] = useState(!propPortfoli);
  const [error, setError] = useState(null);

  // Estat per àlbums i obres
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [obres, setObres] = useState([]);
  const [loadingObres, setLoadingObres] = useState(false);

  // Determina si l'usuari actual és el propietari del portfoli
  const isOwner = user?.id === portfoli?.usuari_id;

  /**
   * useEffect per carregar el portfoli de l'artista
   * si no es passa com a prop
   */
  useEffect(() => {
    if (propPortfoli) return;

    if (!artistId) {
      setError(t("portfoliPage.noArtistId"));
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8085/api/portfolis/${artistId}`)
      .then((res) => {
        const data = res.data?.data;
        if (!data || !data.usuari_id) {
          if (artistId === user?.id) {
            setError(t("portfoliPage.noPortfolioOwner"));
            setPortfoli(null);
          } else {
            setError(t("portfoliPage.noPortfolioUser"));
          }
        } else {
          setPortfoli(data);
        }
      })
      .catch(() => {
        setError(t("portfoliPage.loadError"));
      })
      .finally(() => setLoading(false));
  }, [artistId, propPortfoli, user?.id, t]);

  /**
   * Selecciona un àlbum i carrega les seves obres
   * @param {number} albumId ID de l'àlbum seleccionat
   */
  const handleSelectAlbum = (albumId) => {
    setSelectedAlbumId(albumId);
    setLoadingObres(true);

    axios
      .get(`http://localhost:8085/api/albums/${albumId}/obres`)
      .then((res) => setObres(res.data?.data || []))
      .catch(() => setObres([]))
      .finally(() => setLoadingObres(false));
  };

  /**
   * Actualitza una obra quan es modifica
   * @param {Object} updatedObra Obra actualitzada
   */
  const handleObraUpdated = (updatedObra) => {
    setObres((prev) =>
      prev.map((o) => (o.id === updatedObra.id ? updatedObra : o))
    );
  };

  // Mostra carregant mentre es carrega el portfoli
  if (loading) return <p>{t("portfoliPage.loading")}</p>;

  // Mostra errors segons si és el propietari o un altre usuari
  if (error)
    return (
      <div className="dashboard-wrapper">
        {artistId === user?.id ? (
          <div className="dashboard-empty">
            <h2>
              {t("portfoliPage.hello", {
                name: user?.name || t("portfoliPage.defaultName"),
              })}
            </h2>
            <p>{t("portfoliPage.noPortfolioMessage")}</p>
            <button onClick={() => navigate(`/dashboard/crear-portfoli`)}>
              {t("portfoliPage.createFirstPortfolio")}
            </button>
          </div>
        ) : (
          <p className="dashboard-error">{error}</p>
        )}
      </div>
    );

  return (
    <div className="portfoli-wrapper">
      {/* Accions del propietari del portfoli */}
      {isOwner && <PortfoliActions portfoli={portfoli} />}

      {/* Informació general del portfoli */}
      <PortfoliInfo portfoli={portfoli} />

      <div className="portfoli-content">
        {/* Llista d'àlbums */}
        <div className={selectedAlbumId ? "albums-list flex-1" : "albums-list"}>
          <AlbumsList
            albums={portfoli.albums || []}
            portfoli={portfoli}
            onSelectAlbum={handleSelectAlbum}
            onAlbumDeleted={(albumId) => {
              setPortfoli((prev) => ({
                ...prev,
                albums: prev.albums.filter((a) => a.id !== albumId),
              }));

              if (selectedAlbumId === albumId) {
                setSelectedAlbumId(null);
                setObres([]);
              }
            }}
          />
        </div>

        {/* Llista d'obres de l'àlbum seleccionat */}
        {selectedAlbumId && (
          <div className="obres-list flex-1">
            {loadingObres ? (
              <p>{t("portfoliPage.loadingObres")}</p>
            ) : (
              <ObresList
                obres={obres}
                onObraUpdated={handleObraUpdated}
                ownerId={portfoli.usuari_id}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfoliPage;
