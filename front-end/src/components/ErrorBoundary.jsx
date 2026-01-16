import React from "react";
import { withTranslation } from "react-i18next";

/**
 * Component ErrorBoundary
 * Captura errors de renderitzat en components fills
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children Components fills
 * @param {string} [props.fallback] Missatge personalitzat d’error
 * @param {Function} props.t Funció de traducció (i18n)
 * @returns {JSX.Element}
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Actualitza l’estat quan es produeix un error
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * Captura informació detallada de l’error
   *
   * @param {Error} error
   * @param {Object} info
   */
  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    const { t, fallback } = this.props;

    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
          <h2>{fallback || t("errorBoundary.fallback")}</h2>
        </div>
      );
    }

    // Renderitza els components fills si no hi ha errors
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
