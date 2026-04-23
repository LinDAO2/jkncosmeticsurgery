'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import type { BeforeAfterCase } from '@/lib/types'
import ImageWatermark from '@/components/ImageWatermark'

type DbCase = {
  id: string
  gallery: 'comprehensive' | 'eyelid' | 'midfacelift' | 'skincancer'
  procedures: string[]
  images: string[]
  cover_image: string | null
  display_order: number
  all_display_order: number | null
  instagram_videos: { url: string; label: string }[]
}

type DisplayCase = {
  id: string
  thumbnail: string
  images: string[]
  procedure: string
  sub?: string
  category: string
  href?: string
  isSkinCancer: boolean
  allOrder: number
}

const GALLERY_TO_CATEGORY: Record<string, string> = {
  comprehensive: 'comprehensive',
  eyelid: 'bleph',
  midfacelift: 'ponytail',
  skincancer: 'skincancer',
}

const FILTERS = [
  { label: 'All',                           value: 'all' },
  { label: 'Invisible Access Mid Facelift', value: 'ponytail' },
  { label: 'Comprehensive Rejuvenation',    value: 'comprehensive' },
  { label: 'Eyelid and Brow',               value: 'bleph' },
  { label: 'Skin Cancer Reconstruction',    value: 'skincancer' },
]

const CASES_PER_PAGE = 6

type Lightbox = { images: string[]; index: number }

export default function BeforeAfter({ cases, dbCases = [] }: { cases: BeforeAfterCase[]; dbCases?: DbCase[] }) {
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState(() => searchParams.get('category') ?? 'all')
  const [scVisible, setScVisible] = useState(CASES_PER_PAGE)
  const [loadBatchStart, setLoadBatchStart] = useState<number | null>(null)
  const [lightbox, setLightbox] = useState<Lightbox | null>(null)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

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

  const hasSanityCases = cases?.length > 0

  // Map DB cases to unified display format
  const allDisplay: DisplayCase[] = dbCases
    .filter((c) => c.cover_image)
    .map((c) => {
      const isSkinCancer = c.gallery === 'skincancer'
      return {
        id: c.id,
        thumbnail: c.cover_image!,
        images: c.images,
        procedure: c.procedures[0] ?? 'Case',
        sub: c.procedures.length > 1 ? c.procedures.slice(1).join(', ') : undefined,
        category: GALLERY_TO_CATEGORY[c.gallery] ?? 'comprehensive',
        href: isSkinCancer ? undefined : `/before-after/${c.gallery}/db-${c.id}`,
        isSkinCancer,
        allOrder: c.all_display_order ?? 999999,
      }
    })

  const skinCancerCases = allDisplay.filter((c) => c.isSkinCancer)
  const nonSkinCancerCases = allDisplay.filter((c) => !c.isSkinCancer)
  const totalSkinCancer = skinCancerCases.length

  const visible: DisplayCase[] = filter === 'skincancer'
    ? skinCancerCases.slice(0, scVisible)
    : filter === 'all'
      ? [...nonSkinCancerCases.sort((a, b) => a.allOrder - b.allOrder), ...(skinCancerCases.length > 0 ? [skinCancerCases[0]] : [])]
      : allDisplay.filter((c) => c.category === filter)

  function loadMore() {
    const prev = scVisible
    setLoadBatchStart(prev)
    setScVisible((n) => Math.min(n + CASES_PER_PAGE, totalSkinCancer))
  }

  function handleCardClick(c: DisplayCase) {
    if (c.isSkinCancer && !revealed.has(c.thumbnail)) {
      setRevealed((prev) => new Set(prev).add(c.thumbnail))
    } else if (c.images.length > 0) {
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
              onClick={() => {
                setFilter(f.value)
                if (f.value !== 'skincancer') { setScVisible(CASES_PER_PAGE); setLoadBatchStart(null) }
              }}
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
          : visible.map((c, i) => {
              const isTeaser = c.isSkinCancer && filter === 'all'
              const isRevealed = revealed.has(c.thumbnail)
              const hasMultiple = c.images.length > 1
              const batchIdx = (c.isSkinCancer && loadBatchStart !== null && i >= loadBatchStart) ? i - loadBatchStart : null
              const animStyle = batchIdx !== null ? { animation: 'scFadeIn 0.5s ease-out both', animationDelay: `${batchIdx * 0.08}s` } : {}

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
                        filter: c.isSkinCancer && !isRevealed ? 'blur(14px)' : 'none',
                        transform: c.isSkinCancer && !isRevealed ? 'scale(1.05)' : 'scale(1)',
                        transition: 'filter 0.4s, transform 0.4s',
                      }}
                      priority={i < 3}
                    />
                    {!c.isSkinCancer && <ImageWatermark />}
                  </div>
                  {isTeaser ? (
                    <div className="ba-sensitive-overlay">
                      <span className="ba-sensitive-icon">!</span>
                      <span className="ba-sensitive-title">Skin Cancer Reconstruction</span>
                      <span className="ba-sensitive-body">Contains medical imagery. Click to view all cases.</span>
                      <span className="ba-sensitive-cta">View all cases →</span>
                    </div>
                  ) : c.isSkinCancer && !isRevealed ? (
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
                <div key={c.id} className="ba-card" style={{ cursor: 'pointer', ...animStyle }}
                  onClick={() => { setFilter('skincancer'); document.querySelector('.ba-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                  {cardInner}
                </div>
              ) : c.href ? (
                <a key={c.id} className="ba-card" href={c.href} style={{ textDecoration: 'none', display: 'block', ...animStyle }}>
                  {cardInner}
                </a>
              ) : (
                <div key={c.id} className="ba-card" style={animStyle} onClick={() => handleCardClick(c)}>
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
        <div className="ba-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setLightbox(null)}>
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
