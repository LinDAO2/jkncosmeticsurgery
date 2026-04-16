'use client'

import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="nav-left">
        <a href="#services-section">Services</a>
        <a href="#ba-section">Before &amp; After</a>
      </div>
      <a className="nav-center" href="#hero">
        <span className="nav-logo">JKN</span>
        <span className="nav-sub">Cosmetic Surgery</span>
      </a>
      <div className="nav-right">
        <a href="#about-section">About</a>
        <a className="nav-cta" href="#contact-section">Begin Your Journey</a>
      </div>
    </nav>
  )
}
