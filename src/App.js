import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main";
import Overlay from "./Overlay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/overlay" element={<Overlay />} />
      </Routes>
    </Router>
  );
}

export default App;
