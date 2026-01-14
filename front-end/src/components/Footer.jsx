import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h3>B612</h3>
          <p>
            Connecta amb artistes i descobreix les seves obres. La teva passió per l'art, aquí.
          </p>
        </div>
        <div className="footer-links">
          <h4>Enllaços</h4>
          <ul>
            <li><a href="/">Inici</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Registrar-se</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contacte</h4>
          <p>Email: info@B612.art</p>
          <p>Telèfon: +34 123 123 123</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} B612. Tots els drets reservats.
      </div>
    </footer>
  );
};

export default Footer;
