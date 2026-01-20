import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Layout/Header";
import ContactBaner from "../components/Contact/ContactBaner";
import ContactSection from "../components/Contact/ContactSection";
import Wrapper from "../components/Layout/Wrapper";
import Footer from "../components/Layout/Footer";

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-16">
        {/* Wrapper pour centrer et limiter les sections suivantes */}
        <Wrapper>
          <ContactBaner />
          <ContactSection />
          <Footer />
        </Wrapper>
      </main>
    </motion.div>
  );
};

export default Contact;
