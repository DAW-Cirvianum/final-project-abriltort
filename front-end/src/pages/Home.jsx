import React from 'react';
import HeroSection from "../components/HeroSection";
import ObresSection from "../components/ObresSection";
import ArtistesSection from '../components/ArtistesSection';
import ValorSection from '../components/valorSection';


const Home = () => {
  return (
  <>
      <HeroSection />
      <ObresSection />
      <ArtistesSection/>
      <ValorSection/>     
    </>
    )
};

export default Home;