import React from "react";
import Header from "../components/UI/Header";
import BlogBanner from "../components/Blog/BlogBanner";
import Wrapper from "../components/UI/Wrapper";
import Footer from "../components/UI/Footer";

const Blog = () => {
  return (
    <div>
      <Header logoSrc="/images/logo2.png" />
      <main className="pt-16">
        {/* BlogBanner en full width */}
        <BlogBanner whatsappNumber="2290154142255" />
        {/* Wrapper pour centrer et limiter les sections suivantes */}
        <Wrapper>
          <Footer />
        </Wrapper>
      </main>
    </div>
  );
};

export default Blog;
