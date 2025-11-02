import React from "react";
import ServiceCard from "./ServiceCard";

// 🖼️ Import all images
import wedding from "../assets/wedding.jpg";
import stage from "../assets/stage.jpg";
import gate from "../assets/gate.jpg";
import birthday from "../assets/birthday.jpg";
import haldi from "../assets/haldi.jpg";
import ganpati from "../assets/god.jpg";
import catering from "../assets/utensill.jpeg";
import celling from "../assets/celling.jpg";
import seating from "../assets/seating.jpg";
import otherstuff from "../assets/otherstuff.jpg";

export default function Services() {
  const services = [
    {
      image: wedding,
      title: "Wedding / Engagement",
      description: "Beautiful decorations and arrangements for weddings & engagements 💍",
      link: "/wedding",
    },
    {
      image: stage,
      title: "Stage Decoration",
      description: "Elegant and grand stage setups for weddings and events 🎭",
      link: "/stage",
    },
    {
      image: gate,
      title: "Gate Decoration",
      description: "Royal gate entrances to welcome your guests 👑",
      link: "/gate",
    },
    {
      image: birthday,
      title: "Birthday / Baby Shower",
      description: "Joyful themes and cute decorations for birthdays & baby showers 🎂👶",
      link: "/birthday",
    },
    {
      image: haldi,
      title: "Haldi / Mehendi",
      description: "Vibrant yellow-green decor for haldi & mehendi functions 🌼",
      link: "/haldi",
    },
    {
      image: ganpati,
      title: "Ganpati / Devi Setup",
      description: "Divine and spiritual decorations for festive occasions 🙏",
      link: "/ganpati",
    },
    {
      image: catering,
      title: "Utensil",
      description: "High-quality utensils and catering setups for all events 🍽️",
      link: "/catering",
    },
    {
      image: celling,
      title: "Ceiling Decoration",
      description: "Stylish and elegant ceiling drapes and floral hangings ✨",
      link: "/ceiling",
    },
    {
      image: seating,
      title: "Seating Setup",
      description: "Comfortable and themed seating arrangements for your guests 🪑",
      link: "/seating",
    },
    {
      image: otherstuff,
      title: "Other Stuff",
      description: "Speakers, lighting, and all extra event essentials 🎤",
      link: "/otherstuff",
    },
  ];

  return (
    <section id="services">
      <h1>Our Services</h1>
      <div className="services-container">
        {services.map((s, i) => (
          <ServiceCard
            key={i}
            image={s.image}
            title={s.title}
            description={s.description}
            link={s.link}
          />
        ))}
      </div>
    </section>
  );
}
