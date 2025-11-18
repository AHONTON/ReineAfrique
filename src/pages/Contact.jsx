import React from "react";
import Header from "../components/UI/Header";
import ContactBaner from "../components/Contact/ContactBaner";
import ContactSection from "../components/Contact/ContactSection"
import Wrapper from "../components/UI/Wrapper";
import Footer from "../components/UI/Footer";

const About = () => {
  return (
    <div>
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-16">
        {/* Wrapper pour centrer et limiter les sections suivantes */}
        <Wrapper>
          <ContactBaner />
          <ContactSection />
          <Footer />
        </Wrapper>
      </main>
    </div>
  );
};

export default About;
