'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { BeforeAfterCase } from '@/lib/types'

type StaticCase = {
  src: string
  procedure: string
  category: string
}

const STATIC_CASES: StaticCase[] = [
  { src: '/ba/facelift-1.jpg',     procedure: 'Face & Neck Lift',                category: 'facelift' },
  { src: '/ba/facelift-2.jpg',     procedure: 'Face & Neck Lift',                category: 'facelift' },
  { src: '/ba/facelift-3.jpg',     procedure: 'Face & Neck Lift',                category: 'facelift' },
  { src: '/ba/midfacelift-1.jpg',  procedure: 'Invisible Access Mid Facelift',   category: 'midfacelift' },
  { src: '/ba/midfacelift-2.jpg',  procedure: 'Invisible Access Mid Facelift',   category: 'midfacelift' },
  { src: '/ba/midfacelift-3.jpg',  procedure: 'Invisible Access Mid Facelift',   category: 'midfacelift' },
  { src: '/ba/eyelid-1.jpg',       procedure: 'Eyelid & Brow Rejuvenation',      category: 'eyelid' },
  { src: '/ba/eyelid-2.jpg',       procedure: 'Eyelid & Brow Rejuvenation',      category: 'eyelid' },
  { src: '/ba/eyelid-3.jpg',       procedure: 'Eyelid & Brow Rejuvenation',      category: 'eyelid' },
  { src: '/ba/skincancer-1.jpg',   procedure: 'Skin Cancer Reconstruction',      category: 'skincancer' },
  { src: '/ba/skincancer-2.jpg',   procedure: 'Skin Cancer Reconstruction',      category: 'skincancer' },
]

const FILTERS = [
  { label: 'All',                          value: 'all' },
  { label: 'Face & Neck Lift',             value: 'facelift' },
  { label: 'Mid Facelift',                 value: 'midfacelift' },
  { label: 'Eyelid & Brow',               value: 'eyelid' },
  { label: 'Skin Cancer Reconstruction',   value: 'skincancer' },
]

export default function BeforeAfter({ cases }: { cases: BeforeAfterCase[] }) {
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const hasSanityCases = cases?.length > 0
  const visible = hasSanityCases
    ? cases
    : STATIC_CASES.filter((c) => filter === 'all' || c.category === filter)

  function handleCardClick(c: StaticCase) {
    if (c.category === 'skincancer' && !revealed.has(c.src)) {
      setRevealed((prev) => new Set(prev).add(c.src))
    } else {
      setLightbox(c.src)
    }
  }

  return (
    <section className="ba-section" id="ba-section">
      <div className="ba-header">
        <span className="section-label">Results</span>
        <h2 className="ba-heading">Before &amp; After</h2>
      </div>

      {!hasSanityCases && (
        <div className="ba-filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`ba-filter-btn${filter === f.value ? ' active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="ba-grid">
        {hasSanityCases
          ? (cases as BeforeAfterCase[]).map((c) => (
              <div key={c._id} className="ba-card" onClick={() => setLightbox(c._id)}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image src={c.afterImage as unknown as string} alt={c.title} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="ba-overlay">
                  <span className="ba-overlay-title">{c.procedureType}</span>
                  <span className="ba-overlay-link">View →</span>
                </div>
              </div>
            ))
          : (visible as StaticCase[]).map((c, i) => {
              const isSensitive = c.category === 'skincancer'
              const isRevealed = revealed.has(c.src)
              return (
                <div key={c.src} className="ba-card" onClick={() => handleCardClick(c)}>
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={c.src}
                      alt={c.procedure}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        filter: isSensitive && !isRevealed ? 'blur(14px)' : 'none',
                        transform: isSensitive && !isRevealed ? 'scale(1.05)' : 'scale(1)',
                        transition: 'filter 0.4s, transform 0.4s',
                      }}
                      priority={i < 3}
                    />
                  </div>
                  {isSensitive && !isRevealed ? (
                    <div className="ba-sensitive-overlay">
                      <span className="ba-sensitive-icon">!</span>
                      <span className="ba-sensitive-title">Sensitive Content</span>
                      <span className="ba-sensitive-body">This image contains medical imagery including surgical wounds. Click to view.</span>
                      <span className="ba-sensitive-cta">Tap to reveal</span>
                    </div>
                  ) : (
                    <div className="ba-overlay">
                      <span className="ba-overlay-title">{c.procedure}</span>
                      <span className="ba-overlay-link">View →</span>
                    </div>
                  )}
                </div>
              )
            })}
      </div>

      <div className="ba-cta">
        <a className="btn-navy" href="#contact-section">Begin Your Journey</a>
      </div>

      {lightbox && (
        <div
          className="ba-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
        >
          <div className="ba-lightbox">
            <button className="ba-modal-close" onClick={() => setLightbox(null)}>✕</button>
            <div style={{ position: 'relative', width: '100%', maxWidth: '680px', aspectRatio: '1/1' }}>
              <Image
                src={typeof lightbox === 'string' && lightbox.startsWith('/') ? lightbox : ''}
                alt="Before & After"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
