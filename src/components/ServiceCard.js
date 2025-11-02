import React from "react";
import { Link } from "react-router-dom";

export default function ServiceCard({ image, title, description, link }) {
  return (
    <div className="service">
      <Link to={link}>
      <img src={image} alt={title} className="service-img" />
      </Link>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={link}>
        <button className="view-btn">View Gallery</button>
      </Link>
    </div>
  );
}
