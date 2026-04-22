'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import type { BeforeAfterCase } from '@/lib/types'
import ImageWatermark from '@/components/ImageWatermark'

type StaticCase = {
  thumbnail: string
  images: string[]
  procedure: string
  sub?: string
  category: string
  href?: string
}

type DbCase = {
  id: string
  gallery: 'comprehensive' | 'eyelid' | 'midfacelift'
  procedures: string[]
  images: string[]
  cover_image: string | null
  display_order: number
}

type HiddenCase = {
  slug: string
  gallery: string
}

const DB_GALLERY_TO_CATEGORY: Record<string, string> = {
  comprehensive: 'comprehensive',
  eyelid: 'bleph',
  midfacelift: 'ponytail',
}

// Upper and Lower Blepharoplasty — 15 patient cases, all linking to individual case pages
const BLEPH_CASES: StaticCase[] = [
  { thumbnail: '/ba/eyelid/case-01/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-01' },
  { thumbnail: '/ba/eyelid/case-03/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-03' },
  { thumbnail: '/ba/eyelid/case-02/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-02' },
  { thumbnail: '/ba/eyelid/case-04/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-04' },
  { thumbnail: '/ba/eyelid/case-05/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-05' },
  { thumbnail: '/ba/eyelid/case-06/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-06' },
  { thumbnail: '/ba/eyelid/case-07/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-07' },
  { thumbnail: '/ba/eyelid/case-08/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-08' },
  { thumbnail: '/ba/eyelid/case-09/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-09' },
  { thumbnail: '/ba/eyelid/case-10/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-10' },
  { thumbnail: '/ba/eyelid/case-11/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-11' },
  { thumbnail: '/ba/eyelid/case-12/01.jpeg', images: [], procedure: 'Brow Lift', category: 'bleph', href: '/before-after/eyelid/case-12' },
  { thumbnail: '/ba/eyelid/case-13/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-13' },
  { thumbnail: '/ba/eyelid/case-14/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-14' },
  { thumbnail: '/ba/eyelid/case-15/01.jpeg', images: [], procedure: 'Upper and Lower Blepharoplasty', category: 'bleph', href: '/before-after/eyelid/case-15' },
]

// Invisible Access Mid Facelift — 2 patient cases
const PONYTAIL_CASES: StaticCase[] = [
  { thumbnail: '/ba/midfacelift/case-01-new/01.jpg', images: [], procedure: 'Invisible Access Mid Facelift', category: 'ponytail', href: '/before-after/midfacelift/case-01' },
  { thumbnail: '/ba/midfacelift/case-02/01.jpeg', images: [], procedure: 'Invisible Access Mid Facelift', category: 'ponytail', href: '/before-after/midfacelift/case-02' },
]

// Comprehensive Rejuvenation (Face, Neck and Eyes) — 9 patient cases
const COMPREHENSIVE_CASES: StaticCase[] = [
  { thumbnail: '/ba/hc/01.jpg', images: ['/ba/hc/01.jpg','/ba/hc/02.jpg','/ba/hc/03.jpg','/ba/hc/04.jpg','/ba/hc/05.jpg'], procedure: 'Comprehensive Rejuvenation', sub: 'Face, Neck and Eyes', category: 'comprehensive', href: '/before-after/hc' },
  { thumbnail: '/ba/comprehensive/case-04/01.jpeg', images: [], procedure: 'Comprehensive Rejuvenation', sub: 'Face, Neck and Eyes', category: 'comprehensive', href: '/before-after/comprehensive/case-04' },
  { thumbnail: '/ba/comprehensive/case-05/01.jpeg', images: [], procedure: 'Comprehensive Rejuvenation', sub: 'Face, Neck and Eyes', category: 'comprehensive', href: '/before-after/comprehensive/case-05' },
  { thumbnail: '/ba/comprehensive/case-09/05.jpeg', images: [], procedure: 'Comprehensive Rejuvenation', sub: 'Face, Neck and Eyes', category: 'comprehensive', href: '/before-after/comprehensive/case-09' },
  { thumbnail: '/ba/comprehensive/case-01/01.jpeg', images: [], procedure: 'Comprehensive Rejuvenation', sub: 'Face, Neck and Eyes', category: 'comprehensive', href: '/before-after/comprehensive/case-01' },
  { thumbnail: '/ba/comprehensive/case-03/01.jpeg', images: [], procedure: 'Comprehensive Rejuvenation', sub: 'Face, Neck and Eyes', category: 'comprehensive', href: '/before-after/comprehensive/case-03' },
  { thumbnail: '/ba/comprehensive/case-06/01.jpeg', images: [], procedure: 'Comprehensive Rejuvenation', sub: 'Face, Neck and Eyes', category: 'comprehensive', href: '/before-after/comprehensive/case-06' },
  { thumbnail: '/ba/comprehensive/case-07/01.jpeg', images: [], procedure: 'Comprehensive Rejuvenation', sub: 'Face, Neck and Eyes', category: 'comprehensive', href: '/before-after/comprehensive/case-07' },
  { thumbnail: '/ba/comprehensive/case-08/01.jpeg', images: [], procedure: 'Comprehensive Rejuvenation', sub: 'Face, Neck and Eyes', category: 'comprehensive', href: '/before-after/comprehensive/case-08' },
]

// Skin Cancer Reconstruction — 76 individual cards, each with sensitive content overlay
const SKINCANCER_CASES: StaticCase[] = Array.from({ length: 76 }, (_, i) => {
  const img = `/ba/skincancer/${String(i + 1).padStart(2, '0')}.jpeg`
  return { thumbnail: img, images: [img], procedure: 'Skin Cancer Reconstruction', category: 'skincancer' }
})

const STATIC_CASES: StaticCase[] = [
  ...PONYTAIL_CASES,
  ...COMPREHENSIVE_CASES,
  ...BLEPH_CASES,
  ...SKINCANCER_CASES,
]

const FILTERS = [
  { label: 'All',                        value: 'all' },
  { label: 'Invisible Access Mid Facelift', value: 'ponytail' },
  { label: 'Comprehensive Rejuvenation', value: 'comprehensive' },
  { label: 'Eyelid and Brow',             value: 'bleph' },
  { label: 'Skin Cancer Reconstruction', value: 'skincancer' },
]

const CASES_PER_PAGE = 6

type Lightbox = { images: string[]; index: number }

export default function BeforeAfter({ cases, dbCases = [], hiddenCases = [] }: { cases: BeforeAfterCase[]; dbCases?: DbCase[]; hiddenCases?: HiddenCase[] }) {
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState(() => searchParams.get('category') ?? 'all')
  const [scVisible, setScVisible] = useState(CASES_PER_PAGE)
  const [loadBatchStart, setLoadBatchStart] = useState<number | null>(null)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setFilter(cat)
  }, [searchParams])

  useEffect(() => {
    if (filter !== 'skincancer') {
      setScVisible(CASES_PER_PAGE)
      setLoadBatchStart(null)
    }
  }, [filter])

  useEffect(() => {
    if (loadBatchStart === null) return
    const t = setTimeout(() => setLoadBatchStart(null), 1000)
    return () => clearTimeout(t)
  }, [loadBatchStart])

  const [lightbox, setLightbox] = useState<Lightbox | null>(null)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const hasSanityCases = cases?.length > 0

  // Build set of hidden static case hrefs for fast lookup
  const hiddenHrefSet = new Set(
    hiddenCases.map((h) => `/before-after/${h.gallery}/${h.slug}`)
  )

  // Convert DB cases to the same StaticCase shape for rendering
  const dbStaticCases: StaticCase[] = dbCases
    .filter((c) => c.cover_image)
    .map((c) => ({
      thumbnail: c.cover_image!,
      images: c.images,
      procedure: c.procedures.length > 0 ? c.procedures[0] : 'Case',
      sub: c.procedures.length > 1 ? c.procedures.slice(1).join(', ') : undefined,
      category: DB_GALLERY_TO_CATEGORY[c.gallery] ?? 'comprehensive',
      href: `/before-after/${c.gallery}/db-${c.id}`,
    }))

  // Filter hidden static cases
  const visibleStaticNonSC = [...PONYTAIL_CASES, ...COMPREHENSIVE_CASES, ...BLEPH_CASES]
    .filter((c) => !c.href || !hiddenHrefSet.has(c.href))
  const visibleStaticSC = SKINCANCER_CASES

  const ALL_NON_SC: StaticCase[] = [...dbStaticCases, ...visibleStaticNonSC, visibleStaticSC[0]]

  const visible = hasSanityCases
    ? cases
    : filter === 'skincancer'
      ? visibleStaticSC.slice(0, scVisible)
      : filter === 'all'
        ? ALL_NON_SC
        : [
            ...dbStaticCases.filter((c) => c.category === filter),
            ...[...PONYTAIL_CASES, ...COMPREHENSIVE_CASES, ...BLEPH_CASES]
              .filter((c) => c.category === filter && (!c.href || !hiddenHrefSet.has(c.href))),
          ]

  const totalSkinCancer = SKINCANCER_CASES.length

  function loadMore() {
    const prev = scVisible
    setLoadBatchStart(prev)
    setScVisible((n) => Math.min(n + CASES_PER_PAGE, totalSkinCancer))
  }

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
        <h2 className="ba-heading">Before and After</h2>
      </div>

      {!hasSanityCases && (
        <div className="ba-filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`ba-filter-btn${filter === f.value ? ' active' : ''}`}
              onClick={() => { setFilter(f.value); if (f.value !== 'skincancer') { setScVisible(CASES_PER_PAGE); setLoadBatchStart(null) } }}
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
              const isTeaser = isSensitive && filter === 'all'
              const isRevealed = revealed.has(c.thumbnail)
              const hasMultiple = c.images.length > 1
              const batchIdx = (isSensitive && loadBatchStart !== null && i >= loadBatchStart) ? i - loadBatchStart : null
              const animStyle = batchIdx !== null ? { animation: `scFadeIn 0.5s ease-out both`, animationDelay: `${batchIdx * 0.08}s` } : {}
              const cardInner = (
                <>
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
                    {!isSensitive && <ImageWatermark />}
                  </div>
                  {isTeaser ? (
                    <div className="ba-sensitive-overlay">
                      <span className="ba-sensitive-icon">!</span>
                      <span className="ba-sensitive-title">Skin Cancer Reconstruction</span>
                      <span className="ba-sensitive-body">Contains medical imagery. Click to view all cases.</span>
                      <span className="ba-sensitive-cta">View all cases →</span>
                    </div>
                  ) : isSensitive && !isRevealed ? (
                    <div className="ba-sensitive-overlay">
                      <span className="ba-sensitive-icon">!</span>
                      <span className="ba-sensitive-title">Sensitive Content</span>
                      <span className="ba-sensitive-body">This image contains medical imagery including surgical wounds. Click to view.</span>
                      <span className="ba-sensitive-cta">Tap to reveal</span>
                    </div>
                  ) : (
                    <div className="ba-overlay">
                      <span className="ba-overlay-title">{c.procedure}</span>
                      {c.sub && <span className="ba-overlay-sub">{c.sub}</span>}
                      {hasMultiple && <span className="ba-overlay-count">{c.images.length} photos</span>}
                      <span className="ba-overlay-link">View →</span>
                    </div>
                  )}
                </>
              )
              return isTeaser ? (
                <div key={c.thumbnail} className="ba-card" style={{ cursor: 'pointer', ...animStyle }} onClick={() => { setFilter('skincancer'); document.querySelector('.ba-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                  {cardInner}
                </div>
              ) : c.href ? (
                <a key={c.thumbnail} className="ba-card" href={c.href} style={{ textDecoration: 'none', display: 'block', ...animStyle }}>
                  {cardInner}
                </a>
              ) : (
                <div key={c.thumbnail} className="ba-card" style={animStyle} onClick={() => handleCardClick(c)}>
                  {cardInner}
                </div>
              )
            })}
      </div>

      {!hasSanityCases && filter === 'skincancer' && (
        <div className="ba-pagination">
          {scVisible < totalSkinCancer && (
            <button id="load-more-btn" className="ba-load-more" onClick={loadMore}>
              Load More Cases →
            </button>
          )}
          <span id="case-count" className="ba-case-count">
            {scVisible >= totalSkinCancer
              ? `Showing all ${totalSkinCancer} cases`
              : `Showing ${scVisible} of ${totalSkinCancer} cases`}
          </span>
        </div>
      )}

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
                alt="Before and After"
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
