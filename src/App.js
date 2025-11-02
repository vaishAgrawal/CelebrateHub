import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import OwnerSection from "./components/OwnerSection";
import Contact from "./components/Contact";
import StageGallery from "./components/StageGallery"; // same gallery used for all categories

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* 🏠 Home Page */}
          <Route
  path="/"
  element={
    <>
      <Hero />
      <section id="services">
        <Services />
      </section>
      <section id="owner-section">
        <OwnerSection />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </>
  }
/>


          {/* 🖼️ Gallery Pages (one component handles all) */}
          <Route path="/wedding" element={<StageGallery category="wedding" />} />
          <Route path="/stage" element={<StageGallery category="stage" />} />
          <Route path="/gate" element={<StageGallery category="gate" />} />
          <Route path="/birthday" element={<StageGallery category="birthday" />} />
          <Route path="/haldi" element={<StageGallery category="haldi" />} />
          <Route path="/ganpati" element={<StageGallery category="ganpati" />} />
          <Route path="/catering" element={<StageGallery category="catering" />} />
          <Route path="/ceiling" element={<StageGallery category="ceiling" />} />
          <Route path="/seating" element={<StageGallery category="seating" />} />
          <Route path="/otherstuff" element={<StageGallery category="otherstuff" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
