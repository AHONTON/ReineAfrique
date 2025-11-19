import React from "react";
import Header from "../components/UI/Header";
import HeroBanner from "../components/Accueil/HeroBanner";
import FeatureCards from "../components/Accueil/FeatureCards";
import Wrapper from "../components/UI/Wrapper";
import ValeursSection from "../components/Accueil/ValeursSection";
import NotreMission from "../components/Accueil/NotreMission";
import NotreVision from "../components/Accueil/NotreVision";
import Newsletter from "../components/Accueil/Newsletter";
import Footer from "../components/UI/Footer";

const Accueil = () => {
  return (
    <div>
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-16">
        {/* HeroBanner en full width */}
        <HeroBanner whatsappNumber="2290150035719" />

        {/* Wrapper pour centrer et limiter les sections suivantes */}
        <Wrapper>
          <FeatureCards />
          <ValeursSection />
          <NotreMission />
          <NotreVision />
          <Newsletter />
          <Footer />
        </Wrapper>
      </main>
    </div>
  );
};

export default Accueil;
