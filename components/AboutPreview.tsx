'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { Doctor } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

const DEFAULT_FIRST_PARA = "Dr. John Nia is a fellowship-trained cosmetic and reconstructive surgeon renowned for his refined, natural approach to facial aesthetics. With advanced training spanning facial plastic surgery, oculoplastic surgery, dermatologic surgery, cutaneous oncology, and skin cancer reconstruction, he brings a rare level of precision and artistry to every procedure."

export default function AboutPreview({ doctor }: { doctor: Doctor | null }) {
  const name  = doctor?.name  ?? 'Dr. John K. Nia'
  const title = doctor?.title ?? 'Fellowship-Trained Cosmetic & Reconstructive Surgeon'
  const para  = doctor?.bio?.[0] ?? DEFAULT_FIRST_PARA

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
          {/* Inner wrapper receives the parallax transform; extra height lets image shift without white edges */}
          <div
            ref={imgWrapRef}
            style={{ position: 'absolute', inset: '-30px 0', willChange: 'transform' }}
          >
            {doctor?.photo ? (
              <Image
                src={urlFor(doctor.photo).width(560).height(760).url()}
                alt={name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
              />
            ) : (
              <Image
                src="/dr-nia-home.png"
                alt={name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
              />
            )}
          </div>
        </div>
        <div className="about-preview-content">
          <span className="section-label">About</span>
          <h2 className="about-name">{name}</h2>
          <span className="about-title">{title}</span>
          <p className="about-body" style={{ marginTop: '28px' }}>{para}</p>
          <div style={{ marginTop: '36px' }}>
            <a className="about-read-more" href="/about">Read More &nbsp;→</a>
          </div>
        </div>
      </div>
    </section>
  )
}
