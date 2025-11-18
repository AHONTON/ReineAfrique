import React from "react";
import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
// import d'autres pages si besoin

function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
