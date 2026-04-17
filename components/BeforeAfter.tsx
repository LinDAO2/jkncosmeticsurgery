'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { BeforeAfterCase } from '@/lib/types'

type StaticCase = {
  thumbnail: string
  images: string[]
  procedure: string
  category: string
}

// Upper & Lower Blepharoplasty — 14 patient cases
const BLEPH_CASES: StaticCase[] = [
  { thumbnail: '/ba/eyelid/case-01/01.jpeg', images: ['/ba/eyelid/case-01/01.jpeg','/ba/eyelid/case-01/02.jpeg','/ba/eyelid/case-01/03.jpeg','/ba/eyelid/case-01/04.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-02/01.jpeg', images: ['/ba/eyelid/case-02/01.jpeg','/ba/eyelid/case-02/02.jpeg','/ba/eyelid/case-02/03.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-03/01.jpeg', images: ['/ba/eyelid/case-03/01.jpeg','/ba/eyelid/case-03/02.jpeg','/ba/eyelid/case-03/03.jpeg','/ba/eyelid/case-03/04.jpeg','/ba/eyelid/case-03/05.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-04/01.jpeg', images: ['/ba/eyelid/case-04/01.jpeg','/ba/eyelid/case-04/02.jpeg','/ba/eyelid/case-04/03.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-05/01.jpeg', images: ['/ba/eyelid/case-05/01.jpeg','/ba/eyelid/case-05/02.jpeg','/ba/eyelid/case-05/03.jpeg','/ba/eyelid/case-05/04.jpeg','/ba/eyelid/case-05/05.jpeg','/ba/eyelid/case-05/06.jpeg','/ba/eyelid/case-05/07.jpeg','/ba/eyelid/case-05/08.jpeg','/ba/eyelid/case-05/09.jpeg','/ba/eyelid/case-05/10.jpeg','/ba/eyelid/case-05/11.jpeg','/ba/eyelid/case-05/12.jpeg','/ba/eyelid/case-05/13.jpeg','/ba/eyelid/case-05/14.jpeg','/ba/eyelid/case-05/15.jpeg','/ba/eyelid/case-05/16.jpeg','/ba/eyelid/case-05/17.jpeg','/ba/eyelid/case-05/18.jpeg','/ba/eyelid/case-05/19.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-06/01.jpg',  images: ['/ba/eyelid/case-06/01.jpg','/ba/eyelid/case-06/02.jpg','/ba/eyelid/case-06/03.jpg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-07/01.jpeg', images: ['/ba/eyelid/case-07/01.jpeg','/ba/eyelid/case-07/02.jpeg','/ba/eyelid/case-07/03.jpeg','/ba/eyelid/case-07/04.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-08/01.jpeg', images: ['/ba/eyelid/case-08/01.jpeg','/ba/eyelid/case-08/02.jpeg','/ba/eyelid/case-08/03.jpeg','/ba/eyelid/case-08/04.jpeg','/ba/eyelid/case-08/05.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-09/01.jpeg', images: ['/ba/eyelid/case-09/01.jpeg','/ba/eyelid/case-09/02.jpeg','/ba/eyelid/case-09/03.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-10/01.jpeg', images: ['/ba/eyelid/case-10/01.jpeg','/ba/eyelid/case-10/02.jpeg','/ba/eyelid/case-10/03.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-11/01.jpeg', images: ['/ba/eyelid/case-11/01.jpeg','/ba/eyelid/case-11/02.jpeg','/ba/eyelid/case-11/03.jpeg','/ba/eyelid/case-11/04.jpeg','/ba/eyelid/case-11/05.jpeg','/ba/eyelid/case-11/06.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-12/01.jpeg', images: ['/ba/eyelid/case-12/01.jpeg','/ba/eyelid/case-12/02.jpeg','/ba/eyelid/case-12/03.jpeg','/ba/eyelid/case-12/04.jpeg','/ba/eyelid/case-12/05.jpeg','/ba/eyelid/case-12/06.jpeg','/ba/eyelid/case-12/07.jpeg','/ba/eyelid/case-12/08.jpeg'], procedure: 'Brow Lift', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-13/01.jpeg', images: ['/ba/eyelid/case-13/01.jpeg','/ba/eyelid/case-13/02.jpeg','/ba/eyelid/case-13/03.jpeg','/ba/eyelid/case-13/04.jpeg','/ba/eyelid/case-13/05.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
  { thumbnail: '/ba/eyelid/case-14/01.jpeg', images: ['/ba/eyelid/case-14/01.jpeg','/ba/eyelid/case-14/02.jpeg','/ba/eyelid/case-14/03.jpeg','/ba/eyelid/case-14/04.jpeg','/ba/eyelid/case-14/05.jpeg','/ba/eyelid/case-14/06.jpeg','/ba/eyelid/case-14/07.jpeg'], procedure: 'Upper & Lower Blepharoplasty', category: 'bleph' },
]

// Ponytail Lift — 1 patient case (Petersen, Tara)
const PONYTAIL_CASES: StaticCase[] = [
  { thumbnail: '/ba/midfacelift/case-01/01.jpeg', images: ['/ba/midfacelift/case-01/01.jpeg','/ba/midfacelift/case-01/02.jpeg','/ba/midfacelift/case-01/03.jpeg','/ba/midfacelift/case-01/04.jpeg','/ba/midfacelift/case-01/05.jpeg','/ba/midfacelift/case-01/06.jpeg','/ba/midfacelift/case-01/07.jpeg','/ba/midfacelift/case-01/08.jpeg','/ba/midfacelift/case-01/09.jpeg','/ba/midfacelift/case-01/10.jpeg'], procedure: 'Ponytail Lift', category: 'ponytail' },
]

// Comprehensive Rejuvenation (Face, Neck & Eyes) — 9 patient cases
const COMPREHENSIVE_CASES: StaticCase[] = [
  { thumbnail: '/ba/comprehensive/case-01/01.jpeg', images: ['/ba/comprehensive/case-01/01.jpeg','/ba/comprehensive/case-01/02.jpeg','/ba/comprehensive/case-01/03.jpeg','/ba/comprehensive/case-01/04.jpeg','/ba/comprehensive/case-01/05.jpeg','/ba/comprehensive/case-01/06.jpeg','/ba/comprehensive/case-01/07.jpeg','/ba/comprehensive/case-01/08.jpeg'], procedure: 'Comprehensive Rejuvenation', category: 'comprehensive' },
  { thumbnail: '/ba/comprehensive/case-02/01.jpeg', images: ['/ba/comprehensive/case-02/01.jpeg','/ba/comprehensive/case-02/02.jpeg','/ba/comprehensive/case-02/03.jpeg','/ba/comprehensive/case-02/04.jpeg','/ba/comprehensive/case-02/05.jpeg','/ba/comprehensive/case-02/06.jpeg','/ba/comprehensive/case-02/07.jpeg','/ba/comprehensive/case-02/08.jpeg','/ba/comprehensive/case-02/09.jpeg','/ba/comprehensive/case-02/10.jpeg'], procedure: 'Comprehensive Rejuvenation', category: 'comprehensive' },
  { thumbnail: '/ba/comprehensive/case-03/01.jpeg', images: ['/ba/comprehensive/case-03/01.jpeg','/ba/comprehensive/case-03/02.jpeg','/ba/comprehensive/case-03/03.jpeg','/ba/comprehensive/case-03/04.jpeg'], procedure: 'Comprehensive Rejuvenation', category: 'comprehensive' },
  { thumbnail: '/ba/comprehensive/case-04/01.jpeg', images: ['/ba/comprehensive/case-04/01.jpeg','/ba/comprehensive/case-04/02.jpeg','/ba/comprehensive/case-04/03.jpeg','/ba/comprehensive/case-04/04.jpeg','/ba/comprehensive/case-04/05.jpeg','/ba/comprehensive/case-04/06.jpeg','/ba/comprehensive/case-04/07.jpeg'], procedure: 'Comprehensive Rejuvenation', category: 'comprehensive' },
  { thumbnail: '/ba/comprehensive/case-05/01.jpeg', images: ['/ba/comprehensive/case-05/01.jpeg','/ba/comprehensive/case-05/02.jpeg','/ba/comprehensive/case-05/03.jpeg','/ba/comprehensive/case-05/04.jpeg','/ba/comprehensive/case-05/05.jpeg','/ba/comprehensive/case-05/06.jpeg','/ba/comprehensive/case-05/07.jpeg','/ba/comprehensive/case-05/08.jpeg','/ba/comprehensive/case-05/09.jpeg','/ba/comprehensive/case-05/10.jpeg','/ba/comprehensive/case-05/11.jpeg','/ba/comprehensive/case-05/12.jpeg'], procedure: 'Comprehensive Rejuvenation', category: 'comprehensive' },
  { thumbnail: '/ba/comprehensive/case-06/01.jpeg', images: ['/ba/comprehensive/case-06/01.jpeg','/ba/comprehensive/case-06/02.jpeg'], procedure: 'Comprehensive Rejuvenation', category: 'comprehensive' },
  { thumbnail: '/ba/comprehensive/case-07/01.jpeg', images: ['/ba/comprehensive/case-07/01.jpeg','/ba/comprehensive/case-07/02.jpeg','/ba/comprehensive/case-07/03.jpeg','/ba/comprehensive/case-07/04.jpeg','/ba/comprehensive/case-07/05.jpeg','/ba/comprehensive/case-07/06.jpeg','/ba/comprehensive/case-07/07.jpeg'], procedure: 'Comprehensive Rejuvenation', category: 'comprehensive' },
  { thumbnail: '/ba/comprehensive/case-08/01.jpeg', images: ['/ba/comprehensive/case-08/01.jpeg','/ba/comprehensive/case-08/02.jpeg','/ba/comprehensive/case-08/03.jpeg','/ba/comprehensive/case-08/04.jpeg','/ba/comprehensive/case-08/05.jpeg','/ba/comprehensive/case-08/06.jpeg'], procedure: 'Comprehensive Rejuvenation', category: 'comprehensive' },
  { thumbnail: '/ba/comprehensive/case-09/01.jpeg', images: ['/ba/comprehensive/case-09/01.jpeg','/ba/comprehensive/case-09/02.jpeg','/ba/comprehensive/case-09/03.jpeg','/ba/comprehensive/case-09/04.jpeg','/ba/comprehensive/case-09/05.jpeg','/ba/comprehensive/case-09/06.jpeg','/ba/comprehensive/case-09/07.jpeg','/ba/comprehensive/case-09/08.jpeg'], procedure: 'Comprehensive Rejuvenation', category: 'comprehensive' },
]

// Skin Cancer Reconstruction — all images in one slideshow
const SKINCANCER_IMAGES = Array.from({ length: 76 }, (_, i) => `/ba/skincancer/${String(i + 1).padStart(2, '0')}.jpeg`)

const STATIC_CASES: StaticCase[] = [
  ...PONYTAIL_CASES,
  ...COMPREHENSIVE_CASES,
  ...BLEPH_CASES,
  { thumbnail: '/ba/skincancer/01.jpeg', images: SKINCANCER_IMAGES, procedure: 'Skin Cancer Reconstruction', category: 'skincancer' },
]

const FILTERS = [
  { label: 'All',                        value: 'all' },
  { label: 'Ponytail Lift',              value: 'ponytail' },
  { label: 'Comprehensive Rejuvenation (Face, Neck & Eyes)', value: 'comprehensive' },
  { label: 'Eyelid & Brow',             value: 'bleph' },
  { label: 'Skin Cancer Reconstruction', value: 'skincancer' },
]

type Lightbox = { images: string[]; index: number }

export default function BeforeAfter({ cases }: { cases: BeforeAfterCase[] }) {
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState<Lightbox | null>(null)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const hasSanityCases = cases?.length > 0
  const visible = hasSanityCases
    ? cases
    : STATIC_CASES.filter((c) => filter === 'all' || c.category === filter)

  function handleCardClick(c: StaticCase) {
    if (c.category === 'skincancer' && !revealed.has(c.thumbnail)) {
      setRevealed((prev) => new Set(prev).add(c.thumbnail))
    } else {
      setLightbox({ images: c.images, index: 0 })
    }
  }

  function prev() {
    setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length })
  }

  function next() {
    setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.images.length })
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
              <div key={c._id} className="ba-card" onClick={() => setLightbox({ images: [c._id], index: 0 })}>
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
              const isRevealed = revealed.has(c.thumbnail)
              const hasMultiple = c.images.length > 1
              return (
                <div key={c.thumbnail} className="ba-card" onClick={() => handleCardClick(c)}>
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={c.thumbnail}
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
                      {hasMultiple && <span className="ba-overlay-count">{c.images.length} photos</span>}
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
            <div style={{ position: 'relative', width: '100%', maxWidth: '680px', aspectRatio: '3/4' }}>
              <Image
                key={lightbox.images[lightbox.index]}
                src={lightbox.images[lightbox.index]}
                alt="Before & After"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            {lightbox.images.length > 1 && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
