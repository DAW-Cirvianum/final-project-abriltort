import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
          <h2>{this.props.fallback || "Alguna cosa ha fallat"}</h2>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
