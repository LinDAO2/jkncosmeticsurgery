'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { BeforeAfterCase } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

const PLACEHOLDERS = [
  { title: "Annie's Journey", type: 'Face & Neck Lift' },
  { title: "Tara's Journey", type: 'Mid Facelift' },
  { title: 'Patient Gallery', type: 'Eyelid Rejuvenation' },
]

export default function BeforeAfter({ cases }: { cases: BeforeAfterCase[] }) {
  const [active, setActive] = useState<BeforeAfterCase | null>(null)

  const hasCases = cases?.length > 0

  return (
    <section className="ba-section" id="ba-section">
      <div className="ba-header">
        <span className="section-label">Results</span>
        <h2 className="ba-heading">Before &amp; After</h2>
      </div>

      <div className="ba-grid">
        {hasCases ? cases.map((c) => (
          <div key={c._id}>
            <div className="ba-card" onClick={() => setActive(c)}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={urlFor(c.afterImage).width(480).height(640).url()}
                  alt={c.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="ba-overlay">
                <span className="ba-overlay-title">{c.title}</span>
                <span className="ba-overlay-link">View Case →</span>
              </div>
            </div>
            <div className="ba-info">
              <span className="ba-title">{c.procedureType}</span>
              <span className="ba-type">{c.title}</span>
            </div>
          </div>
        )) : PLACEHOLDERS.map((p) => (
          <div key={p.title}>
            <div className="ba-card">
              <div className="ba-placeholder">
                <span className="ba-placeholder-label">Image coming soon</span>
              </div>
              <div className="ba-overlay">
                <span className="ba-overlay-title">{p.title}</span>
                <span className="ba-overlay-link">View Case →</span>
              </div>
            </div>
            <div className="ba-info">
              <span className="ba-title">{p.type}</span>
              <span className="ba-type">{p.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ba-cta">
        <a className="btn-navy" href="#contact-section">Begin Your Journey</a>
      </div>

      {active && (
        <div className="ba-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setActive(null)}>
          <div className="ba-modal">
            <button className="ba-modal-close" onClick={() => setActive(null)}>✕</button>
            <div className="ba-modal-img-wrap">
              <Image src={urlFor(active.beforeImage).width(480).height(640).url()} alt="Before" fill style={{ objectFit: 'cover' }} />
              <span className="ba-modal-label">Before</span>
            </div>
            <div className="ba-modal-img-wrap">
              <Image src={urlFor(active.afterImage).width(480).height(640).url()} alt="After" fill style={{ objectFit: 'cover' }} />
              <span className="ba-modal-label">After</span>
            </div>
            <div className="ba-modal-info">
              <span style={{ fontFamily: 'var(--display)', fontSize: '20px', color: 'var(--navy)' }}>{active.title}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--mid)' }}>{active.procedureType}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
