'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import LogoMark from './LogoMark'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const transparent = isHome && !scrolled

  return (
    <nav className={[!transparent ? 'scrolled' : '', isHome ? 'nav-home' : ''].join(' ').trim()}>
      <div className="nav-left">
        <a href="/services">Services</a>
        <a href="/before-after">Before & After</a>
      </div>
      <a className="nav-center" href="/">
        {!isHome && <LogoMark circleSize={44} color="#0a0a0a" showName={false} />}
      </a>
      <div className="nav-right">
        <a href="/about">About</a>
        <a className="nav-cta" href="/begin">Begin Your Journey</a>
      </div>
    </nav>
  )
}
