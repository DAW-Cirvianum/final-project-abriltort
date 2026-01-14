import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";
import Modal from "./Modal";

const ObresList = ({ obres, ownerId, onObraAction }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showNotification } = useNotification();
  const loggedUserId = user?.id;

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    obraId: null,
  });
  const [loadingDelete, setLoadingDelete] = useState(false);

  const isOwner = loggedUserId === ownerId;

  const getObraImage = (obra) => {
    if (!obra?.fitxer_url) return "/no-image.png";
    if (obra.fitxer_url.startsWith("http")) return obra.fitxer_url;
    if (obra.fitxer_url.startsWith("/storage"))
      return `http://localhost:8085${obra.fitxer_url}`;
    return `http://localhost:8085/storage/${obra.fitxer_url}`;
  };

  const confirmDeleteObra = (obraId) => {
    setDeleteModal({ isOpen: true, obraId });
  };

  const handleConfirmDelete = async () => {
    const obraId = deleteModal.obraId;
    setDeleteModal({ isOpen: false, obraId: null });
    setLoadingDelete(true);

    try {
      await axios.delete(`http://localhost:8085/api/obres/${obraId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onObraAction?.({ type: "delete", id: obraId });
      showNotification("Obra eliminada correctament!", "success");
    } catch (err) {
      console.error(err);
      showNotification(
        err.response?.data?.message || "No s'ha pogut eliminar l'obra.",
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
            <img
              src={getObraImage(obra)}
              alt={obra.titol}
              loading="lazy"
              onClick={() => navigate(`/obres/${obra.id}`)}
            />
            <h4>{obra.titol}</h4>

            {isOwner && (
              <div className="obra-actions">
                <button
                  className="edit-obra-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/editar-obra/${obra.id}`);
                  }}
                >
                  Editar
                </button>

                <button
                  className="delete-obra-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteObra(obra.id);
                  }}
                  disabled={loadingDelete && deleteModal.obraId === obra.id}
                >
                  {loadingDelete && deleteModal.obraId === obra.id
                    ? "Eliminant..."
                    : "Eliminar"}
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
        title="Confirmació d'eliminació"
        message="Segur que vols eliminar aquesta obra?"
        confirmText="Eliminar"
        cancelText="Cancel·lar"
      />
    </>
  );
};

export default ObresList;
