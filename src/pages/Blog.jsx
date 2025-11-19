import React from "react";
import Header from "../components/UI/Header";
import BlogBanner from "../components/Blog/BlogBanner";
import CategoryCard from "../components/Blog/CategoryCard";
import Wrapper from "../components/UI/Wrapper";
import Footer from "../components/UI/Footer";

const Blog = () => {
  return (
    <div>
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-16">
        {/* BlogBanner en full width */}
        <BlogBanner whatsappNumber="2290150035719" />
        {/* Wrapper pour centrer et limiter les sections suivantes */}
        <Wrapper>
          {/* Sections du blog */}
          <CategoryCard />
          <Footer />
        </Wrapper>
      </main>
    </div>
  );
};

export default Blog;
