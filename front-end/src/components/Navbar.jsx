import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const getAvatar = () => {
    if (!user || !user.imatge) return "/avatars/default.png";
    return `http://localhost:8085/storage/${user.imatge}`;
  };

  return (
    <nav className="navbar">
      {/* Icona hamburguer */}
      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>

      {/* Menú complet: esquerra + dreta */}
      <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
        <div className="navbar-left">
          <Link to="/">B612</Link>
          <Link to="/artistes">Autors</Link>
          <Link to="/obres">Obres</Link>
          {user && <Link to="/dashboard">El meu portfoli</Link>}
          <Link to="/dashboard/editar-perfil" className="navbar-link">
            Editar Perfil
          </Link>
        </div>

        <div className="navbar-right">
          {user ? (
            <>
              <img src={getAvatar()} alt="Avatar" className="navbar-avatar" />
              <span>Hola, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
