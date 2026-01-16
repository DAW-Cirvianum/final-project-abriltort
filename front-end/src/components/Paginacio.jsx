import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Component de paginació simple
 *
 * @param {Object} props
 * @param {number} props.page Pàgina actual
 * @param {number} props.totalPages Total de pàgines
 * @param {function} props.onPrev Callback per pàgina anterior
 * @param {function} props.onNext Callback per pàgina següent
 * @param {boolean} props.disableNext Si true, deshabilita el botó següent
 * @returns {JSX.Element}
 */
const Pagination = ({ page, totalPages, onPrev, onNext, disableNext }) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      {/* Botó pàgina anterior */}
      <button onClick={onPrev} disabled={page === 1}>
        {t("pagination.prev")}
      </button>

      {/* Indicador de pàgina */}
      <span style={{ margin: "0 1rem" }}>
        {t("pagination.page")} {page}
        {totalPages ? ` ${t("pagination.of")} ${totalPages}` : ""}
      </span>

      {/* Botó pàgina següent */}
      <button onClick={onNext} disabled={disableNext}>
        {t("pagination.next")}
      </button>
    </div>
  );
};

export default Pagination;
