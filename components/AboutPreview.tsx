'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

const DEFAULT_FIRST_PARA = "Dr. John Nia is a fellowship-trained cosmetic and reconstructive surgeon renowned for his refined, natural approach to facial aesthetics. With advanced training spanning facial plastic surgery, oculoplastic surgery, dermatologic surgery, cutaneous oncology, and skin cancer reconstruction, he brings a rare level of precision and artistry to every procedure."

export default function AboutPreview({ name, title, para, photoUrl }: {
  name?: string | null
  title?: string | null
  para?: string | null
  photoUrl?: string | null
}) {
  const displayName  = name  ?? 'Dr. John K. Nia'
  const displayTitle = title ?? 'Fellowship-Trained Cosmetic and Reconstructive Surgeon'
  const displayPara  = para  ?? DEFAULT_FIRST_PARA
  const photo        = photoUrl || '/dr-nia-home.png'

  const sectionRef  = useRef<HTMLElement>(null)
  const imgWrapRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafPending = false

    function onScroll() {
      if (rafPending) return
      rafPending = true
      requestAnimationFrame(() => {
        rafPending = false
        if (!sectionRef.current || !imgWrapRef.current) return
        const rect     = sectionRef.current.getBoundingClientRect()
        const vh       = window.innerHeight
        const progress = 1 - rect.bottom / (vh + rect.height)
        const offset   = (progress - 0.5) * 60
        imgWrapRef.current.style.transform = `translateY(${offset}px)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="about-preview" id="about-preview" ref={sectionRef}>
      <span className="section-label">The Surgeon</span>
      <div className="about-preview-grid">
        <div className="about-preview-photo">
          <div
            ref={imgWrapRef}
            style={{ position: 'absolute', inset: '-30px 0', willChange: 'transform' }}
          >
            <Image
              src={photo}
              alt={displayName}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
            />
          </div>
        </div>
        <div className="about-preview-content">
          <span className="section-label">About</span>
          <h2 className="about-name">{displayName}</h2>
          <span className="about-title">{displayTitle}</span>
          <p className="about-body" style={{ marginTop: '28px' }}>{displayPara}</p>
          <div style={{ marginTop: '36px' }}>
            <a className="about-read-more" href="/about">Read More &nbsp;→</a>
          </div>
        </div>
      </div>
    </section>
  )
}
