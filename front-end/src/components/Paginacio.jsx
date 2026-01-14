import React from "react";

const Pagination = ({ page, totalPages, onPrev, onNext, disableNext }) => {
  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <button onClick={onPrev} disabled={page === 1}>
        Anterior
      </button>
      <span style={{ margin: "0 1rem" }}>
        Pàgina {page}{totalPages ? ` de ${totalPages}` : ""}
      </span>
      <button onClick={onNext} disabled={disableNext}>
        Següent
      </button>
    </div>
  );
};

export default Pagination;

