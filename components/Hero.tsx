export default function Hero() {
  return (
    <section className="hero" id="hero">
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero__overlay" />
      <div className="hero__content">
        <p className="hero__eyebrow">Dr. John K. Nia</p>
        <h1 className="hero__headline">
          The Art of<br />
          <em>Refined Beauty</em>
        </h1>
        <a href="#contact" className="btn">
          Request a Consultation
        </a>
      </div>
    </section>
  )
}
