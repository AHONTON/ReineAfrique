import { motion } from "framer-motion";
import Header from "../components/Layout/Header";
import BlogBanner from "../components/Blog/BlogBanner";
import CategoriesSection from "../components/Blog/CategoryCard";
import Wrapper from "../components/Layout/Wrapper";
import Footer from "../components/Layout/Footer";

const Blog = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-4">
        {/* BlogBanner en full width */}
        <BlogBanner whatsappNumber="+2290150035719" />
        {/* Wrapper pour centrer et limiter les sections suivantes */}
        <Wrapper>
          {/* Sections du blog */}
          <CategoriesSection />
          <Footer />
        </Wrapper>
      </main>
    </motion.div>
  );
};

export default Blog;
