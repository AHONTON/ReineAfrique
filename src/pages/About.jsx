import React from "react";
import Header from "../components/UI/Header";
import AboutHeroBanner from "../components/About/AboutHeroBanner";
import AboutSection from "../components/About/AboutSection";
import HistoryImpactSection from "../components/About/HistoryImpactSection";
import Choix from "../components/About/Choix";
import Faq from "../components/About/Faq";
import Wrapper from "../components/UI/Wrapper";
import Footer from "../components/UI/Footer";

const About = () => {
  return (
    <div>
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-16">
        {/* AboutHeroBanner en full width */}
        <AboutHeroBanner whatsappNumber="2290150035719" />
        {/* Wrapper pour centrer et limiter les sections suivantes */}
        <Wrapper>
          <AboutSection />
          <HistoryImpactSection />
          <Choix />
          <Faq />
          <Footer />
        </Wrapper>
      </main>
    </div>
  );
};

export default About;
