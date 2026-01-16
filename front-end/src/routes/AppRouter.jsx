import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import RegisterPage from "../pages/RegisterPage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArtistesPage from "../pages/ArtistesPage";
import PortfoliPage from "../pages/PortfoliPage";
import ObraPage from "../pages/ObraPage";
import CrearPortfoliPage from "../pages/CrearPortfoliPage";
import CrearAlbumPage from "../pages/CrearAlbumPage";
import CrearObraPage from "../pages/CrearObraPage";
import EditarPerfil from "../components/EditarPerfil";
import EditarPortfoliPage from "../pages/EditarPrtfoliPage";
import DashboardLayout from "../layouts/DashboardLayout";
import ErrorBoundary from "../components/ErrorBoundary";
import EditAlbumPage from "../pages/EditAlbumPage";
import EditarObraPage from "../pages/EditarObraPage";
import PublicObresPage from "../pages/PublicObresPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPaswordPage";
import { useTranslation } from "react-i18next";

/**
 * Component fallback per a rutes no trobades
 * @returns {JSX.Element} Missatge 404
 */
const NotFound = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>404</h1>
    <p>Pàgina no trobada</p>
  </div>
);

/**
 * Router principal de l'aplicació
 * Defineix les rutes públiques, rutes protegides i rutes amb layout de dashboard també encapsula components amb ErrorBoundary per capturar errors visuals.
 *
 * @returns {JSX.Element} El component de navegació complet de l'app
 */
const AppRouter = () => {
  return (
    <Router>
      {/* Navbar visible a totes les pàgines */}
      <Navbar />

      <Routes>
        {/* Rutes públiques amb ErrorBoundary */}
        <Route
          path="/"
          element={
            <ErrorBoundary fallback="Home no disponible">
              <Home />
            </ErrorBoundary>
          }
        />

        <Route
          path="/login"
          element={
            <ErrorBoundary fallback="Login no disponible">
              <Login />
            </ErrorBoundary>
          }
        />

        <Route
          path="/register"
          element={
            <ErrorBoundary fallback="Registre no disponible">
              <RegisterPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="obres"
          element={
            <ErrorBoundary fallback="Obres públiques no disponibles">
              <PublicObresPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="/artistes"
          element={
            <ErrorBoundary fallback="Artistes no disponibles">
              <ArtistesPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="/portfoli/:artistId"
          element={
            <ErrorBoundary fallback="Portfoli no trobat">
              <PortfoliPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="/obres/:obraId"
          element={
            <ErrorBoundary fallback="Obra no trobada">
              <ObraPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ErrorBoundary fallback="No es pot accedir a la pàgina de recuperació">
              <ForgotPasswordPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="/password-reset"
          element={
            <ErrorBoundary fallback="No es pot accedir a la pàgina de reset">
              <ResetPasswordPage />
            </ErrorBoundary>
          }
        />

        {/* Dashboard amb rutes protegides */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Ruta principal del dashboard */}
          <Route
            index
            element={
              <ErrorBoundary fallback="Dashboard no disponible">
                <Dashboard />
              </ErrorBoundary>
            }
          />

          {/* Rutes de creació dins del dashboard */}
          <Route
            path="crear-portfoli"
            element={
              <ErrorBoundary fallback="No es pot crear el portfoli">
                <CrearPortfoliPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="crear-album"
            element={
              <ErrorBoundary fallback="No es pot crear l'àlbum">
                <CrearAlbumPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="crear-obra"
            element={
              <ErrorBoundary fallback="No es pot crear l'obra">
                <CrearObraPage />
              </ErrorBoundary>
            }
          />

          {/* Rutes d'edició dins del dashboard */}
          <Route
            path="editar-obra/:id"
            element={
              <ErrorBoundary fallback="No es pot editar l'obra">
                <EditarObraPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="editar-perfil"
            element={
              <ErrorBoundary fallback="No es pot editar el perfil">
                <EditarPerfil />
              </ErrorBoundary>
            }
          />
          <Route
            path="editar-portfoli/:portfoliId"
            element={
              <ErrorBoundary fallback="Portfoli no trobat">
                <EditarPortfoliPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="albums/:albumId/edit"
            element={
              <ErrorBoundary fallback="No es pot editar l'àlbum">
                <EditAlbumPage />
              </ErrorBoundary>
            }
          />
        </Route>

        {/* Ruta fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer visible a totes les pàgines */}
      <Footer />
    </Router>
  );
};

export default AppRouter;
