import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Overlay from "./Overlay";

function MainRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/overlay" element={<Overlay />} />
      </Routes>
    </Router>
  );
}

export default MainRoutes;
