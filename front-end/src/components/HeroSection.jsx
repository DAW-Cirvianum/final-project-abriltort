import "../styles/home.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>Descobreix el món de l’artista</h1>
        <p>Explora les visions de cada artista</p>
        <button>Explora ara</button>
      </div>
      <div className="hero-right">
        <img src="/placeholder-hero.png" alt="Art destacat" />
      </div>
    </section>
  );
};

export default HeroSection;