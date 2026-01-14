import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../styles/modal.css";

const ModalConfirm = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar" }) => {
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  // Mou focus al modal i guarda l'element anterior
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previouslyFocusedElement.current?.focus();
    }
  }, [isOpen]);

  // Escape per tancar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
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

  return createPortal(
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
      
    >
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
          <p>{message}</p>
          <div className="modal-actions">
            <button className="modal-btn modal-btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
            <button
              className="modal-btn modal-btn-confirm"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalConfirm;
