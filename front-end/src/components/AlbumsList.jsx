import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import ObresList from "./ObresList";
import "../styles/albumList.css";

/**
 * Component que mostra la llista d’àlbums d’un portfoli, permet desplegar les obres, editar i eliminar àlbums si l’usuari n’és el propietari
 *
 * @param {Array} albums Llista d’àlbums del portfoli
 * @param {Object} portfoli Informació del portfoli
 * @param {Function} onAlbumDeleted Callback quan s’elimina un àlbum
 * @returns {JSX.Element}
 */
const AlbumsList = ({ albums = [], portfoli, onAlbumDeleted }) => {
  const { user, token } = useAuth();

  // Sistema de notificacions
  const { showNotification } = useNotification();

  // Funció de traducció
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ID de l’àlbum actualment desplegat
  const [expandedAlbumId, setExpandedAlbumId] = useState(null);

  // Obres agrupades per àlbum
  const [obresByAlbum, setObresByAlbum] = useState({});
  const [loadingObresId, setLoadingObresId] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    albumId: null,
  });

  // Control de càrrega durant l’eliminació
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Comprova si l’usuari és el propietari del portfoli
  const isOwner = user?.id === portfoli?.usuari_id;

  /**
   * Desplega o plega un àlbum i carrega les seves obres si cal
   *
   * @param {Object} album - Àlbum seleccionat
   */
  const toggleAlbum = (album) => {
    if (expandedAlbumId === album.id) {
      setExpandedAlbumId(null);
      return;
    }

    setExpandedAlbumId(album.id);

    // Carrega les obres només si encara no s’han carregat
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
          showNotification(t("album.errors.loadObres"), "error");
        })
        .finally(() => setLoadingObresId(null));
    }
  };

  /**
   * Obre el modal de confirmació per eliminar un àlbum
   *
   * @param {number} albumId - ID de l’àlbum a eliminar
   */
  const confirmDeleteAlbum = (albumId) => {
    setDeleteModal({ isOpen: true, albumId });
  };

  /**
   * Gestiona l’eliminació de l’àlbum després de confirmar
   */
  const handleConfirmDelete = async () => {
    const albumId = deleteModal.albumId;
    setDeleteModal({ isOpen: false, albumId: null });
    setLoadingDelete(true);

    try {
      // Comprovació prèvia d’obres
      const res = await fetch(
        `http://localhost:8085/api/albums/${albumId}/obres`
      );
      const data = await res.json();

      if ((data.data || []).length > 0) {
        showNotification(t("album.errors.albumWithObres"), "error");
        return;
      }

      // Eliminació de l’àlbum
      await fetch(`http://localhost:8085/api/albums/${albumId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Callback i notificació d’èxit
      if (onAlbumDeleted) onAlbumDeleted(albumId);
      showNotification(t("album.notifications.deleteSuccess"), "success");
    } catch (err) {
      console.error(err);
      showNotification(t("album.errors.deleteError"), "error");
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
                  {t("common.edit")}
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
                    ? t("common.deleting")
                    : t("common.delete")}
                </button>
              </div>
            )}
          </div>

          {expandedAlbumId === album.id && (
            <>
              {loadingObresId === album.id ? (
                <p className="loading-text">{t("album.loadingObres")}</p>
              ) : (
                <ObresList
                  obres={obresByAlbum[album.id] || []}
                  ownerId={portfoli?.usuari_id}
                  onObraAction={({ type, id }) => {
                    if (type === "delete") {
                      setObresByAlbum((prev) => ({
                        ...prev,
                        [album.id]: prev[album.id].filter(
                          (obra) => obra.id !== id
                        ),
                      }));
                    }
                  }}
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
        title={t("album.modal.confirmDeleteTitle")}
        message={t("album.modal.confirmDeleteMessage")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
      />
    </div>
  );
};

export default AlbumsList;
