import React from 'react';
import HeroSection from "../components/HeroSection";
import ObresSection from "../components/ObresSection";
import ArtistesSection from '../components/ArtistesSection';
import ValorSection from '../components/ValorSection';

/**
 * Componente principal de la pàgina d'inici que combina les seccions principals de la web
 *
 * @returns {JSX.Element} Pàgina Home amb les seccions
 */
const Home = () => {
  return (
    <>
      {/* Secció principal del hero / banner */}
      <HeroSection />

      {/* Secció amb les últimes obres */}
      <ObresSection />

      {/* Secció amb artistes destacats */}
      <ArtistesSection />

      {/* Secció amb els valors i avantatges de la plataforma */}
      <ValorSection />     
    </>
  );
};

export default Home;
