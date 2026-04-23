'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ImageWatermark from '@/components/ImageWatermark'

type LightboxState = { srcs: string[]; index: number } | null

const GALLERY_META: Record<string, { title: string; subtitle?: string; backCategory: string; backLabel: string }> = {
  comprehensive: {
    title: 'Comprehensive Rejuvenation',
    subtitle: 'Face, Neck and Eyes',
    backCategory: 'comprehensive',
    backLabel: 'Before and After',
  },
  eyelid: {
    title: 'Eyelid and Brow Surgery',
    backCategory: 'bleph',
    backLabel: 'Before and After',
  },
  midfacelift: {
    title: 'Invisible Access Mid Facelift',
    backCategory: 'ponytail',
    backLabel: 'Before and After',
  },
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    // YouTube
    if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/shorts/')) return `https://www.youtube.com/embed/${u.pathname.replace('/shorts/', '')}`
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://player.vimeo.com/video/${id}`
    }
    // TikTok
    if (u.hostname.includes('tiktok.com')) {
      const parts = u.pathname.split('/').filter(Boolean)
      const videoId = parts[parts.length - 1]
      if (videoId) return `https://www.tiktok.com/embed/v2/${videoId}`
    }
  } catch {}
  return null
}

type Props = {
  gallery: string
  procedures: string[]
  images: string[]
  instagramVideos?: { url: string; label: string }[]
}

export default function DynamicCaseClient({ gallery, procedures, images, instagramVideos }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState>(null)
  const meta = GALLERY_META[gallery] ?? GALLERY_META.comprehensive

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightbox) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.srcs.length) % lb.srcs.length })
      if (e.key === 'ArrowRight') setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.srcs.length })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <>
      <Nav />

      <section className="case-detail-section">

        <a className="case-detail-back" href={`/before-after?category=${meta.backCategory}`}>← {meta.backLabel}</a>

        <div className="case-detail-header">
          <span className="section-label">Patient Case</span>
          <h1 className="case-detail-title">{meta.title}</h1>
          {meta.subtitle && <p className="case-detail-subtitle">{meta.subtitle}</p>}
        </div>

        {procedures.length > 0 && (
          <div className="case-detail-procedures">
            <span className="section-label">Procedure Details</span>
            <ul className="case-proc-list">
              {procedures.map((p) => (
                <li key={p} className="case-proc-item">{p}</li>
              ))}
            </ul>
          </div>
        )}

        {instagramVideos && instagramVideos.length > 0 && (
          <div className="case-detail-video-link">
            {instagramVideos.map((l) => {
              const embedUrl = getEmbedUrl(l.url)
              if (embedUrl) {
                const isTikTok = l.url.includes('tiktok.com')
                return (
                  <div key={l.url} style={{ width: '100%', maxWidth: isTikTok ? 340 : 720 }}>
                    {l.label && <p className="case-set-note" style={{ marginBottom: 12 }}>{l.label}</p>}
                    <div style={{ position: 'relative', paddingBottom: isTikTok ? '177.77%' : '56.25%', height: 0, overflow: 'hidden' }}>
                      <iframe
                        src={embedUrl}
                        title={l.label || 'Patient Video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  </div>
                )
              }
              return (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="case-video-btn">
                  {l.label || 'View Patient Video'}
                </a>
              )
            })}
          </div>
        )}

        <div className="case-detail-rule" />

        <div className="case-detail-set">
          <div className="case-set-meta">
            <span className="case-set-label">Before and After</span>
            <p className="case-set-note">All results shared with patient consent.</p>
          </div>
          <div className="case-detail-grid">
            {images.map((src, i) => (
              <button
                key={src}
                className="case-detail-card"
                onClick={() => setLightbox({ srcs: images, index: i })}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`Patient case — image ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  priority={i < 2}
                />
                <ImageWatermark />
                <div className="case-detail-card-overlay">
                  <span className="case-detail-card-link">Expand →</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="case-detail-more">
          <a className="case-detail-more-link" href={`/before-after?category=${meta.backCategory}`}>VIEW ALL CASES →</a>
        </div>

        <div className="case-detail-cta">
          <a className="btn-navy" href="/begin">Begin Your Journey</a>
        </div>

      </section>

      <Footer />

      {lightbox && (
        <div
          className="ba-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
        >
          <div className="ba-lightbox">
            <button className="ba-modal-close" onClick={() => setLightbox(null)}>✕</button>
            <div style={{ position: 'relative', width: '100%', maxWidth: '720px', aspectRatio: '3/4' }}>
              <Image
                key={lightbox.srcs[lightbox.index]}
                src={lightbox.srcs[lightbox.index]}
                alt="Before and After"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <button className="ba-slide-prev" onClick={() => setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.srcs.length) % lb.srcs.length })}>‹</button>
            <button className="ba-slide-next" onClick={() => setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.srcs.length })}>›</button>
            <div className="ba-slide-dots">
              {lightbox.srcs.map((_, i) => (
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
