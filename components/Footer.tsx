import LogoMark from './LogoMark'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <LogoMark circleSize={56} color="rgba(255,255,255,0.75)" showName={true} />
      <div className="footer-links">
        <a className="footer-link" href="/services">Services</a>
        <a className="footer-link" href="/before-after">Before & After</a>
        <a className="footer-link" href="/about">About</a>
        <a className="footer-link" href="/begin">Contact</a>
        <p className="footer-copy">&copy; {year} JKN Cosmetic Surgery. All rights reserved.</p>
      </div>
    </footer>
  )
}
