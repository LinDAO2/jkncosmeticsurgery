export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="footer-brand">
        <span className="footer-logo">JKN</span>
        <span className="footer-tagline">Cosmetic Surgery</span>
      </div>
      <div className="footer-links">
        <a className="footer-link" href="#services-section">Services</a>
        <a className="footer-link" href="#ba-section">Before &amp; After</a>
        <a className="footer-link" href="#about-section">About</a>
        <a className="footer-link" href="#contact-section">Contact</a>
        <p className="footer-copy">&copy; {year} JKN Cosmetic Surgery. All rights reserved.</p>
      </div>
    </footer>
  )
}
