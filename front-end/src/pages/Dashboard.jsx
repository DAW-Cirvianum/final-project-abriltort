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

const PortfoliPage = ({ portfoli: propPortfoli }) => {
  const { user } = useAuth();
  const { artistId: paramArtistId } = useParams();
  const navigate = useNavigate();

  const artistId = paramArtistId || user?.id;

  const [portfoli, setPortfoli] = useState(
    propPortfoli || { albums: [], usuari_id: null }
  );
  const [loading, setLoading] = useState(!propPortfoli);
  const [error, setError] = useState(null);

  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [obres, setObres] = useState([]);
  const [loadingObres, setLoadingObres] = useState(false);

  const isOwner = user?.id === portfoli?.usuari_id;

  useEffect(() => {
    if (propPortfoli) return;

    if (!artistId) {
      setError("No s’ha pogut determinar l’artista.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8085/api/portfolis/${artistId}`)
      .then((res) => {
        const data = res.data?.data;
        if (!data || !data.usuari_id) {
          // L’usuari loguejat és el propietari i no té portfoli
          if (artistId === user?.id) {
            setError("Encara no tens cap portfoli creat. Crea el teu primer portfoli!");
            setPortfoli(null); // per assegurar-nos que no mostrem altres components
          } else {
            setError("Aquest usuari encara no té portfoli.");
          }
        } else {
          setPortfoli(data);
        }
      })
      .catch(() => {
        setError("No s’ha pogut carregar el portfoli.");
      })
      .finally(() => setLoading(false));
  }, [artistId, propPortfoli, user?.id]);

  const handleSelectAlbum = (albumId) => {
    setSelectedAlbumId(albumId);
    setLoadingObres(true);

    axios
      .get(`http://localhost:8085/api/albums/${albumId}/obres`)
      .then((res) => setObres(res.data?.data || []))
      .catch(() => setObres([]))
      .finally(() => setLoadingObres(false));
  };

  const handleObraUpdated = (updatedObra) => {
    setObres((prev) =>
      prev.map((o) => (o.id === updatedObra.id ? updatedObra : o))
    );
  };

  if (loading) return <p>Carregant portfoli...</p>;

  // ERROR o usuari sense portfoli
 if (error)
  return (
    <div className="dashboard-wrapper">
      {artistId === user?.id ? (
        <div className="dashboard-empty">
          <h2> Hola {user?.name || "artista"}!</h2>
          <p>
            Encara no tens cap portfoli creat. És el moment perfecte per mostrar
            el teu talent!
          </p>
          <button onClick={() => navigate(`/dashboard/crear-portfoli`)}>
            Crear el teu primer portfoli
          </button>
        </div>
      ) : (
        <p className="dashboard-error">{error}</p>
      )}
    </div>
  );

  return (
    <div className="portfoli-wrapper">
      {isOwner && <PortfoliActions portfoli={portfoli} />}

      {/* Info del portfoli */}
      <PortfoliInfo portfoli={portfoli} />

      <div className="portfoli-content">
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

        {selectedAlbumId && (
          <div className="obres-list flex-1">
            {loadingObres ? (
              <p>Carregant obres...</p>
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
