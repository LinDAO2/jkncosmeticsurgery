'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import LogoMark from './LogoMark'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome   = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const transparent = isHome && !scrolled

  return (
    <>
      <nav className={[!transparent ? 'scrolled' : '', isHome ? 'nav-home' : ''].join(' ').trim()}>
        {/* Desktop links */}
        <div className="nav-left">
          <a href="/services">Services</a>
          <a href="/before-after">Before and After</a>
        </div>
        <a className="nav-center" href="/">
          {!isHome && <LogoMark circleSize={44} color="#0a0a0a" showName={false} />}
        </a>
        <div className="nav-right">
          <a href="/about">About</a>
          <a className="nav-cta" href="/begin">Begin Your Journey</a>
        </div>

        {/* Mobile bar */}
        <div className="mobile-nav-bar">
          <div style={{ width: 40 }} />
          <a href="/" className="mobile-nav-logo">
            <LogoMark circleSize={40} color="#0a0a0a" showName={false} />
          </a>
          <button
            className={`hamburger-btn${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className="ham-line" />
            <span className="ham-line" />
            <span className="ham-line" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-menu-overlay${menuOpen ? ' menu-open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>Close</button>
        <a href="/services"     className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="/before-after" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Before and After</a>
        <a href="/about"        className="mobile-menu-link" onClick={() => setMenuOpen(false)}>About</a>
        <a href="/begin"        className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Begin Your Journey</a>
      </div>
    </>
  )
}
