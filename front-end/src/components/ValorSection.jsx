import React from "react";
import "../styles/valorSection.css";

const ValorSection = () => {
  return (
    <section className="valor-section">
      <div className="valor-container">
        <div className="valor-text">
          <h2>Explora l’art com mai abans</h2>
          <p>
            Descobreix artistes emergents i les seves obres més fascinants. 
            Connecta amb la creativitat i la inspiració a cada pas.
          </p>
        </div>
        <div className="valor-blocs">
          <div className="bloc">
            <h3>Exclusiu</h3>
            <p>Accedeix a obres úniques i creadors que no trobaràs enlloc més.</p>
          </div>
          <div className="bloc">
            <h3>Comunitat</h3>
            <p>Uneix-te a altres amants de l’art i comparteix la teva passió.</p>
          </div>
          <div className="bloc">
            <h3>Inspiració</h3>
            <p>Descobreix nous estils i idees a cada visita.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValorSection;
