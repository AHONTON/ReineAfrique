import React from "react";
import Header from "../components/UI/Header";
import HeroBanner from "../components/Accueil/HeroBanner";
import Wrapper from "../components/UI/Wrapper";
import Footer from "../components/UI/Footer";

const About = () => {
  return (
    <div>
      <Header logoSrc="/images/logo.png" />
      <main className="pt-16">
        {/* HeroBanner en full width */}
        <HeroBanner whatsappNumber="2290154142255" />

        {/* Wrapper pour centrer et limiter les sections suivantes */}
        <Wrapper>
          <Footer />
        </Wrapper>
      </main>
    </div>
  );
};

export default About;
