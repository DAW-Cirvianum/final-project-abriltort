import React from "react";

/**
 * Mostra informació bàsica d'un portfoli
 *
 * @param {Object} props
 * @param {Object} props.portfoli Portfoli a mostrar
 * @param {string} props.portfoli.titol Títol del portfoli
 * @param {string} props.portfoli.descripcio Descripció del portfoli
 * @returns {JSX.Element|null} Component de informació del portfoli
 */
const PortfoliInfo = ({ portfoli }) => {
  if (!portfoli) return null; // No mostrar res si no hi ha portfoli

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "1.5rem",
      }}
    >
      {/* Títol del portfoli */}
      <h2 style={{ marginBottom: "0.5rem" }}>{portfoli.titol}</h2>

      {/* Descripció del portfoli */}
      <p>{portfoli.descripcio}</p>
    </div>
  );
};

export default PortfoliInfo;
