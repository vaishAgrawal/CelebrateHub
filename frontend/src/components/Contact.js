// src/components/Contact.js
import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "../App.css";

export default function Contact() {
  return (
    <section className="contact-section">
      <h1>Contact Us</h1>
      <p>We’d love to be a part of your special occasion 💍✨</p>

      <div className="contact-details">
        <div className="contact-card">
          <FaPhoneAlt className="contact-icon" />
          <h3>Phone</h3>
          <p>+91 9657366443</p>
        </div>

        <div className="contact-card">
          <FaEnvelope className="contact-icon" />
          <h3>Email</h3>
          <p>anilagrawal@gmail.com</p>
        </div>

        <div className="contact-card">
          <FaMapMarkerAlt className="contact-icon" />
          <h3>Address</h3>
          <p>Bus Stand Road, Akot, Maharashtra, India</p>
        </div>
      </div>
    </section>
  );
}
