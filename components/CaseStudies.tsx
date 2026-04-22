'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { BeforeAfterCase } from '@/lib/types'
import ImageWatermark from '@/components/ImageWatermark'

const FALLBACK_CASES = [
  { id: 'f1', category: '', filter: 'comprehensive', href: '/before-after/hc', title: 'Comprehensive Rejuvenation', tags: ['Deep Plane Face and Neck Lift', 'Buccal Fat Contouring', 'Fat Transfer', 'Laser Resurfacing'], img: '/ba/hc/01.jpg' },
  { id: 'f2', category: '', filter: 'bleph',          href: '/before-after/eyelid/case-12',        title: 'Eyelid Rejuvenation',             tags: ['Brow Lift', 'Upper Blepharoplasty', 'Lower Blepharoplasty'], img: '/ba/eyelid/case-12/01.jpeg' },
  { id: 'f3', category: '', filter: 'ponytail',       href: '/before-after/midfacelift/case-01',   title: 'Invisible Access Mid Facelift',   tags: ['Invisible Access Mid Facelift', 'Lip Lift', 'Upper Blepharoplasty', 'Lower Blepharoplasty'], img: '/ba/midfacelift/case-01/01.jpeg' },
]

const DELAYS = [0, 150, 300]

export default function CaseStudies({ cases }: { cases: BeforeAfterCase[] }) {
  const hasCases = cases && cases.length > 0
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const cards = sectionRef.current?.querySelectorAll<HTMLElement>('.case-card')
      cards?.forEach((card) => card.classList.add('wipe-revealed'))
      return
    }

    const cards = sectionRef.current?.querySelectorAll<HTMLElement>('.case-card')
    if (!cards) return

    const observers: IntersectionObserver[] = []

    cards.forEach((card, i) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                card.classList.add('wipe-revealed')
              }, DELAYS[i] ?? 0)
              observer.disconnect()
            }
          })
        },
        { threshold: 0.15 }
      )
      observer.observe(card)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section className="cases-section" ref={sectionRef}>
      <span className="section-label">Selected Cases</span>
      <div className="cases-grid">
        {hasCases
          ? cases.map((c) => (
              <a key={c._id} className="case-card" href="/before-after">
                <div className="case-img">
                  <div className="case-img-wipe" />
                  {c.afterImage?.asset?.url ? (
                    <Image
                      src={c.afterImage.asset.url}
                      alt={c.title}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                      sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="case-img-placeholder" />
                  )}
                </div>
                <div className="case-meta">
                  <span className="case-category">{c.procedureType}</span>
                  <span className="case-title">{c.title}</span>
                  <div className="case-tags">
                    <span className="case-tag">{c.procedureType}</span>
                  </div>
                  <span className="case-link">View Case &nbsp;→</span>
                </div>
              </a>
            ))
          : FALLBACK_CASES.map((c) => (
              <a key={c.id} className="case-card" href={c.href ?? `/before-after?category=${c.filter}`}>
                <div className="case-img">
                  <div className="case-img-wipe" />
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center 15%', transition: 'transform 0.5s ease' }}
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    className="case-img-inner"
                  />
                  <ImageWatermark />
                </div>
                <div className="case-meta">
                  {c.category && <span className="case-category">{c.category}</span>}
                  <span className="case-title">{c.title}</span>
                  <div className="case-tags">
                    {c.tags.map((t) => (
                      <span key={t} className="case-tag">{t}</span>
                    ))}
                  </div>
                  <span className="case-link">View Case &nbsp;→</span>
                </div>
              </a>
            ))}
      </div>
      <div className="cases-footer">
        <a className="case-view-more" href="/before-after">View All Cases &nbsp;→</a>
      </div>
    </section>
  )
}
