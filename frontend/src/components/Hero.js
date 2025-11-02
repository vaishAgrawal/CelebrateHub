import React from 'react';
import bgHero from '../assets/bgHero.png';   // background image
import logo from '../assets/logo1.webp';     // logo image

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        backgroundImage: `url(${bgHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div className="hero-content">
        <img src={logo} alt="Logo" className="hero-logo" />
        <h1 className="hero-title">न्यू वैष्णवी बिछायत केंद्र</h1>
      </div>
    </section>
  );
}
