import { motion } from "framer-motion";
import Header from "../components/Layout/Header";
import HeroBanner from "../components/Accueil/HeroBanner";
import FeatureCards from "../components/Accueil/FeatureCards";
import Wrapper from "../components/Layout/Wrapper";
import ValeursSection from "../components/Accueil/ValeursSection";
import NotreMission from "../components/Accueil/NotreMission";
import NotreVision from "../components/Accueil/NotreVision";
import Newsletter from "../components/Accueil/Newsletter";
import Footer from "../components/Layout/Footer";

const Accueil = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-16">
        {/* HeroBanner en full width */}
        <HeroBanner whatsappNumber="2290150035719" logoSrc="/images/logo2.png" />

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
    </motion.div>
  );
};

export default Accueil;
