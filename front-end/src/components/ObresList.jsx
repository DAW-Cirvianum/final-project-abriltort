import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Modal from "./Modal";

/**
 * Llista d'obres amb opcions d'edició i eliminació per al propietari
 * @param {Object} props
 * @param {Array} props.obres Llista d'obres a mostrar
 * @param {number} props.ownerId ID del propietari de les obres
 * @param {function} props.onObraAction Callback quan una obra és modificada (o eliminada)
 * @returns {JSX.Element}
 */
const ObresList = ({ obres, ownerId, onObraAction }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const loggedUserId = user?.id;

  // Estat per al modal de confirmació d'eliminació
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    obraId: null,
  });
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Determina si l'usuari autenticat és el propietari
  const isOwner = loggedUserId === ownerId;

  /**
   * Retorna la URL correcta de la imatge d'una obra
   * @param {Object} obra 
   * @returns {string}
   */
  const getObraImage = (obra) => {
    if (!obra?.fitxer_url) return "/no-image.png";
    if (obra.fitxer_url.startsWith("http")) return obra.fitxer_url;
    if (obra.fitxer_url.startsWith("/storage"))
      return `http://localhost:8085${obra.fitxer_url}`;
    return `http://localhost:8085/storage/${obra.fitxer_url}`;
  };

  /**
   * Obre el modal per confirmar eliminació
   * @param {number} obraId 
   */
  const confirmDeleteObra = (obraId) => {
    setDeleteModal({ isOpen: true, obraId });
  };

  /**
   * Elimina l'obra després de confirmar
   */
  const handleConfirmDelete = async () => {
    const obraId = deleteModal.obraId;
    setDeleteModal({ isOpen: false, obraId: null });
    setLoadingDelete(true);

    try {
      await axios.delete(`http://localhost:8085/api/obres/${obraId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Notifica al component pare
      onObraAction?.({ type: "delete", id: obraId });

      showNotification(t("obres.deleteSuccess"), "success");
    } catch (err) {
      console.error(err);
      showNotification(
        err.response?.data?.message || t("obres.deleteError"),
        "error"
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className="obres-grid">
        {obres.map((obra) => (
          <div key={obra.id} className="obra-card">
            {/* Imatge clicable que navega a la vista de l'obra */}
            <img
              src={getObraImage(obra)}
              alt={obra.titol}
              loading="lazy"
              onClick={() => navigate(`/obres/${obra.id}`)}
            />

            <h4>{obra.titol}</h4>

            {/* Accions només visibles pel propietari */}
            {isOwner && (
              <div className="obra-actions">
                {/* Editar obra */}
                <button
                  className="edit-obra-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/editar-obra/${obra.id}`);
                  }}
                >
                  {t("common.edit")}
                </button>

                {/* Eliminar obra */}
                <button
                  className="delete-obra-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteObra(obra.id);
                  }}
                  disabled={loadingDelete && deleteModal.obraId === obra.id}
                >
                  {loadingDelete && deleteModal.obraId === obra.id
                    ? t("common.deleting")
                    : t("common.delete")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de confirmació per eliminar obra */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, obraId: null })}
        onConfirm={handleConfirmDelete}
        title={t("obres.confirmDeleteTitle")}
        message={t("obres.confirmDeleteMessage")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
      />
    </>
  );
};

export default ObresList;
