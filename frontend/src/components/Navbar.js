import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo"><a href="#home">Your Event, Our Setup!</a></div>
      <ul className="nav-links">
        <li><a href="#hero">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#owner-section">Owner</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}
