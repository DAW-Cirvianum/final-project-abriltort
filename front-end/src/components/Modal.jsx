import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "../styles/modal.css";

/**
 * Modal de confirmació reutilitzable
 * Mostra un missatge amb botons de confirmació i cancel·lació
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Controla si el modal està obert
 * @param {Function} props.onClose Funció per tancar el modal
 * @param {Function} props.onConfirm Funció a executar quan es confirma
 * @param {string} props.title Títol del modal
 * @param {string} props.message Missatge del modal
 * @param {string} [props.confirmKey] Clau de traducció per al botó de confirmar
 * @param {string} [props.cancelKey] Clau de traducció per al botó de cancel·lar
 * @returns {JSX.Element|null}
 */
const ModalConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmKey = "common.confirm",
  cancelKey = "common.cancel",
}) => {
  const { t } = useTranslation();

  // Referència al modal per focus i accessibilitat
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  // Mou el focus al modal quan s’obre 
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previouslyFocusedElement.current?.focus();
    }
  }, [isOpen]);

  // Tanca el modal amb la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Evita que el focus surti del modal mentre està obert
  useEffect(() => {
    const handleFocus = (e) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        e.stopPropagation();
        modalRef.current.focus();
      }
    };
    if (isOpen) document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, [isOpen]);

  if (!isOpen) return null;

  // Renderitza el modal
  return createPortal(
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal-content confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 id="modal-title">{title}</h2>}
        <div className="modal-body">
          {message && <p>{message}</p>}
          <div className="modal-actions">
            {/* Botó de cancel·lar */}
            <button className="modal-btn modal-btn-cancel" onClick={onClose}>
              {t(cancelKey)}
            </button>

            {/* Botó de confirmar */}
            <button
              className="modal-btn modal-btn-confirm"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            >
              {t(confirmKey)}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalConfirm;
