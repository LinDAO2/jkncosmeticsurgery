export default function Hero() {
  return (
    <section className="hero" id="hero">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-wordmark">JKN</span>
        <span className="hero-tagline">Cosmetic Surgery</span>
      </div>
      <div className="hero-scroll">
        <div className="scroll-line" />
        <span className="scroll-label">Explore</span>
      </div>
    </section>
  )
}
