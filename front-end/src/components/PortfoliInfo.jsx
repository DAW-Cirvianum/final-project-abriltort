// src/components/PortfoliInfo.jsx
import React from "react";

const PortfoliInfo = ({ portfoli }) => {
  if (!portfoli) return null;

  return (
    <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "1.5rem" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>{portfoli.titol}</h2>
      <p>{portfoli.descripcio}</p>
    </div>
  );
};

export default PortfoliInfo;
