import React from "react";
import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import FeatureCards from "../components/FeatureCards";
import Wrapper from "../components/Wrapper";
import logoImg from "../assets/images/logo.png";
import ValeursSection from "../components/ValeursSection";
import NotreMission from "../components/NotreMission";
import NotreVision from "../components/NotreVision"
import Newsletter from "../components/Newsletter"
import Footer from "../components/Footer"

const Accueil = () => {
  return (
    <div>
      <Header logoSrc={logoImg} />
      <main className="pt-16">
        {/* HeroBanner en full width */}
        <HeroBanner whatsappNumber="2290154142255" />

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
