import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import Modal from "./Modal";
import ObresList from "./ObresList";
import "../styles/albumList.css";

const AlbumsList = ({ albums = [], portfoli, onAlbumDeleted }) => {
  const { user, token } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [expandedAlbumId, setExpandedAlbumId] = useState(null);
  const [obresByAlbum, setObresByAlbum] = useState({});
  const [loadingObresId, setLoadingObresId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, albumId: null });
  const [loadingDelete, setLoadingDelete] = useState(false);

  const isOwner = user?.id === portfoli?.usuari_id;

  // Toggle i carregar obres d’un àlbum
  const toggleAlbum = (album) => {
    if (expandedAlbumId === album.id) {
      setExpandedAlbumId(null);
      return;
    }

    setExpandedAlbumId(album.id);

    if (!obresByAlbum[album.id]) {
      setLoadingObresId(album.id);
      fetch(`http://localhost:8085/api/albums/${album.id}/obres`)
        .then((res) => res.json())
        .then((data) => {
          setObresByAlbum((prev) => ({
            ...prev,
            [album.id]: data.data || [],
          }));
        })
        .catch(() => {
          setObresByAlbum((prev) => ({
            ...prev,
            [album.id]: [],
          }));
          showNotification("No s'han pogut carregar les obres.", "error");
        })
        .finally(() => setLoadingObresId(null));
    }
  };

  // Obrir modal de confirmació
  const confirmDeleteAlbum = (albumId) => {
    setDeleteModal({ isOpen: true, albumId });
  };

  // Gestionar eliminació després de confirmar
  const handleConfirmDelete = async () => {
    const albumId = deleteModal.albumId;
    setDeleteModal({ isOpen: false, albumId: null });
    setLoadingDelete(true);

    try {
      const res = await fetch(`http://localhost:8085/api/albums/${albumId}/obres`);
      const data = await res.json();

      if ((data.data || []).length > 0) {
        showNotification("No pots eliminar un àlbum que conté obres.", "error");
        return;
      }

      await fetch(`http://localhost:8085/api/albums/${albumId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (onAlbumDeleted) onAlbumDeleted(albumId);
      showNotification("Àlbum eliminat correctament!", "success");
    } catch (err) {
      console.error(err);
      showNotification("No s'ha pogut eliminar l'àlbum.", "error");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="albums-list">
      {albums.map((album) => (
        <div key={album.id} className="album-card">
          <div className="album-header" onClick={() => toggleAlbum(album)}>
            <div>
              <strong>{album.nom}</strong>
              {album.descripcio && <p>{album.descripcio}</p>}
            </div>

            {isOwner && (
              <div className="album-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/albums/${album.id}/edit`);
                  }}
                >
                  Editar
                </button>

                <button
                  className="delete-album-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteAlbum(album.id);
                  }}
                  disabled={loadingDelete}
                >
                  {loadingDelete && deleteModal.albumId === album.id
                    ? "Eliminant..."
                    : "Eliminar"}
                </button>
              </div>
            )}
          </div>

          {expandedAlbumId === album.id && (
            <>
              {loadingObresId === album.id ? (
                <p className="loading-text">Carregant obres...</p>
              ) : (
                <ObresList
                  obres={obresByAlbum[album.id] || []}
                  ownerId={portfoli?.usuari_id}
                />
              )}
            </>
          )}
        </div>
      ))}

      {/* Modal de confirmació per eliminar */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, albumId: null })}
        onConfirm={handleConfirmDelete}
        title="Confirmació d'eliminació"
        message="Segur que vols eliminar aquest àlbum?"
        confirmText="Eliminar"
        cancelText="Cancel·lar"
      />
    </div>
  );
};

export default AlbumsList;
