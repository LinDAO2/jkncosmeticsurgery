'use client'

import { useState } from 'react'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ImageWatermark from '@/components/ImageWatermark'

const PROCEDURES = [
  'Deep plane face and neck lift with submandibular gland sculpting',
  'Buccal fat contouring',
  'Fat transfer',
  'Laser resurfacing',
]

const IMAGES_1M = [
  { src: '/ba/hc/1month/01.jpg', alt: 'Front view — 1 month post-procedure' },
  { src: '/ba/hc/1month/02.jpg', alt: '3/4 angle — 1 month post-procedure' },
  { src: '/ba/hc/1month/03.jpg', alt: 'Front view — 1 month post-procedure' },
  { src: '/ba/hc/1month/04.jpg', alt: 'Side profile — 1 month post-procedure' },
  { src: '/ba/hc/1month/05.jpg', alt: 'Profile view — 1 month post-procedure' },
]

const IMAGES_10W = [
  { src: '/ba/hc/01.jpg', alt: 'Front view — 10 weeks post-procedure' },
  { src: '/ba/hc/02.jpg', alt: '3/4 view — 10 weeks post-procedure' },
  { src: '/ba/hc/03.jpg', alt: '3/4 angle — 10 weeks post-procedure' },
  { src: '/ba/hc/04.jpg', alt: 'Side profile — 10 weeks post-procedure' },
  { src: '/ba/hc/05.jpg', alt: 'Profile view — 10 weeks post-procedure' },
]

type LightboxState = { images: typeof IMAGES_1M; index: number } | null

export default function CaseHC() {
  const [lightbox, setLightbox] = useState<LightboxState>(null)

  function openLightbox(images: typeof IMAGES_1M, index: number) {
    setLightbox({ images, index })
  }
  function prev() {
    setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length })
  }
  function next() {
    setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.images.length })
  }

  return (
    <>
      <Nav />

      <section className="case-detail-section">

        {/* ── Back link ── */}
        <a className="case-detail-back" href="/before-after">← All Cases</a>

        {/* ── Header ── */}
        <div className="case-detail-header">
          <span className="section-label">Patient Case</span>
          <h1 className="case-detail-title">Comprehensive Rejuvenation</h1>
          <p className="case-detail-subtitle">Face, Neck and Eyes</p>
        </div>

        {/* ── Procedure details ── */}
        <div className="case-detail-procedures">
          <span className="section-label">Procedure Details</span>
          <ul className="case-proc-list">
            {PROCEDURES.map((p) => (
              <li key={p} className="case-proc-item">{p}</li>
            ))}
          </ul>
        </div>

        {/* ── Divider ── */}
        <div className="case-detail-rule" />

        {/* ── 1-Month photos ── */}
        <div className="case-detail-set">
          <div className="case-set-meta">
            <span className="case-set-label">1 Month Post-Procedure</span>
            <p className="case-set-note">Each image shows before (left) and after (right). All results shared with patient consent.</p>
          </div>
          <div className="case-detail-grid">
            {IMAGES_1M.map((img, i) => (
              <button
                key={img.src}
                className="case-detail-card"
                onClick={() => openLightbox(IMAGES_1M, i)}
                aria-label={`View ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  priority={i === 0}
                />
                <ImageWatermark />
                <div className="case-detail-card-overlay">
                  <span className="case-detail-card-link">Expand →</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="case-detail-rule" />

        {/* ── 10-Week photos ── */}
        <div className="case-detail-set">
          <div className="case-set-meta">
            <span className="case-set-label">10 Weeks Post-Procedure</span>
            <p className="case-set-note">Continued healing. Each image shows before (left) and after (right).</p>
          </div>
          <div className="case-detail-grid">
            {IMAGES_10W.map((img, i) => (
              <button
                key={img.src}
                className="case-detail-card"
                onClick={() => openLightbox(IMAGES_10W, i)}
                aria-label={`View ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  priority={false}
                />
                <ImageWatermark />
                <div className="case-detail-card-overlay">
                  <span className="case-detail-card-link">Expand →</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="case-detail-cta">
          <a className="btn-navy" href="/begin">Begin Your Journey</a>
        </div>

      </section>

      <Footer />

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="ba-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
        >
          <div className="ba-lightbox">
            <button className="ba-modal-close" onClick={() => setLightbox(null)}>✕</button>
            <div style={{ position: 'relative', width: '100%', maxWidth: '780px', aspectRatio: '1/1' }}>
              <Image
                key={lightbox.images[lightbox.index].src}
                src={lightbox.images[lightbox.index].src}
                alt={lightbox.images[lightbox.index].alt}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <button className="ba-slide-prev" onClick={prev}>‹</button>
            <button className="ba-slide-next" onClick={next}>›</button>
            <div className="ba-slide-dots">
              {lightbox.images.map((_, i) => (
                <button
                  key={i}
                  className={`ba-slide-dot${i === lightbox.index ? ' active' : ''}`}
                  onClick={() => setLightbox((lb) => lb && { ...lb, index: i })}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
