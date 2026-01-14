import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PortfoliInfo from "../components/PortfoliInfo";
import AlbumsList from "../components/AlbumsList";
import ObresList from "../components/ObresList";
import { useNotification } from "../context/NotificationContext";
import "../styles/portfoliPage.css";

const PortfoliPage = ({ portfoli: propPortfoli }) => {
  const { artistId } = useParams();
  const { showNotification } = useNotification();

  const [portfoli, setPortfoli] = useState(
    propPortfoli || { albums: [], usuari_id: null, id: null }
  );
  const [loading, setLoading] = useState(!propPortfoli);
  const [error, setError] = useState(null);

  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [obresByAlbum, setObresByAlbum] = useState({});
  const [loadingObres, setLoadingObres] = useState(false);

  // Carregar portfoli si no arriba per props
  useEffect(() => {
    if (propPortfoli) return;
    if (!artistId) {
      setError("No s’ha proporcionat cap ID d’artista.");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`http://localhost:8085/api/portfolis/${artistId}`)
      .then((res) => {
        const data = res.data?.data;
        if (!data || !data.id) {
          setError("Aquest artista no té cap portfoli.");
          setPortfoli({ albums: [], usuari_id: null, id: null });
        } else {
          setPortfoli(data);
        }
      })
      .catch(() => setError("L'artista en questió no té portfoli."))
      .finally(() => setLoading(false));
  }, [artistId, propPortfoli]);

  // Seleccionar àlbum i carregar obres si no existeixen
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
        showNotification("No s'han pogut carregar les obres.", "error");
      } finally {
        setLoadingObres(false);
      }
    }
  };

  // Gestiona eliminacions i actualitzacions d'obres
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

  if (loading) return <p>Carregant portfoli...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="portfoli-wrapper">
      <PortfoliInfo portfoli={portfoli} />

      <div className="portfoli-content">
        <AlbumsList
          albums={portfoli.albums}
          portfoli={portfoli}
          onAlbumDeleted={(albumId) => {
            setPortfoli((prev) => ({
              ...prev,
              albums: prev.albums.filter((a) => a.id !== albumId),
            }));
            // Si eliminem l'àlbum seleccionat, netegem obres
            if (selectedAlbumId === albumId) {
              setSelectedAlbumId(null);
            }
          }}
          onSelectAlbum={handleSelectAlbum}
        />

        {selectedAlbumId && (
          <div className="obres-list">
            {loadingObres ? (
              <p>Carregant obres...</p>
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
