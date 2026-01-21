import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Marquer pour afficher le loader au chargement
// Cela fonctionne pour tous les types d'accès : rechargement, navigation directe, recherche
try {
  sessionStorage.setItem('shouldShowLoader', 'true');
} catch {
  // Ignorer si sessionStorage n'est pas disponible (mode privé, etc.)
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
