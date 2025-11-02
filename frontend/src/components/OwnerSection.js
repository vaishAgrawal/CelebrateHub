import React from "react";
import { motion } from "framer-motion";
import owner from "../assets/owner.png"; // 👉 use a background-removed PNG photo here

export default function OwnerSection() {
  return (
    <section className="owner-section">
      <motion.div
        className="owner-container"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Left: Animated Image */}
        <motion.div
          className="owner-image"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="image-bg-glow"></div>
          <img src={owner} alt="Owner" />
        </motion.div>

        {/* Right: Animated Content */}
        <motion.div
          className="owner-info"
          initial={{ x: 80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Meet the Founder</h2>
          <h3>Anil Agrawal</h3>
          <p className="owner-quote">
            “Turning your dream moments into timeless celebrations.”
          </p>

          <p className="owner-bio">
            I’m the creative mind behind every function. My passion lies in crafting unforgettable experiences
            filled with elegance, emotions, and joy. From intimate gatherings
            to grand celebrations — I ensure every detail shines with perfection.
          </p>

        </motion.div>
      </motion.div>
    </section>
  );
}
