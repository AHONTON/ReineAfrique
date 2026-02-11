import { motion } from "framer-motion";
import Header from "../components/Layout/Header";
import AboutHeroBanner from "../components/About/AboutHeroBanner";
import AboutSection from "../components/About/AboutSection";
import HistoryImpactSection from "../components/About/HistoryImpactSection";
import Choix from "../components/About/Choix";
import Faq from "../components/About/Faq";
import Wrapper from "../components/Layout/Wrapper";
import Footer from "../components/Layout/Footer";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-4">
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
    </motion.div>
  );
};

export default About;
