import React from "react";
import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
// import d'autres pages si besoin

function App() {
  return (
      <Routes>
        <Route path="/" element={<Accueil />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/articles" element={<Articles />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
  );
} 

export default App;
