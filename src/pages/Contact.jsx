import React from "react";
import Header from "../components/UI/Header";
import ContactBanner from "../components/Contact/ContactBanner";
import Wrapper from "../components/UI/Wrapper";
import Footer from "../components/UI/Footer";

const About = () => {
  return (
    <div>
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-16">
        {/* Wrapper pour centrer et limiter les sections suivantes */}
        <Wrapper>
          <ContactBanner />
          <Footer />
        </Wrapper>
      </main>
    </div>
  );
};

export default About;
