'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import type { BeforeAfterCase } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

export default function BeforeAfter({ cases }: { cases: BeforeAfterCase[] }) {
  const [active, setActive] = useState<BeforeAfterCase | null>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const dragging = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }, [])

  const open = (c: BeforeAfterCase) => {
    setActive(c)
    setSliderPos(50)
  }

  const close = () => setActive(null)

  return (
    <section className="ba-section" id="results">
      <div className="ba-section__inner">
        <p className="section-label">Results</p>
        <h2 className="ba-section__heading">Before &amp; After</h2>
        <div className="ba-grid">
          {cases.map((c) => (
            <button
              key={c._id}
              className="ba-thumb"
              onClick={() => open(c)}
              aria-label={`View ${c.title} before and after`}
            >
              <Image
                src={urlFor(c.afterImage).width(480).height(600).url()}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="ba-thumb__overlay">
                <span>{c.procedureType}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="ba-modal"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="ba-modal__box">
            <button className="ba-modal__close" onClick={close} aria-label="Close">
              ✕
            </button>
            <p className="ba-modal__label">{active.procedureType}</p>
            <h3 className="ba-modal__title">{active.title}</h3>

            <div
              className="ba-compare"
              ref={trackRef}
              onPointerMove={handlePointerMove}
              onPointerDown={(e) => {
                dragging.current = true
                trackRef.current?.setPointerCapture(e.pointerId)
              }}
              onPointerUp={() => { dragging.current = false }}
            >
              {/* Before */}
              <div className="ba-compare__img ba-compare__img--before">
                <Image
                  src={urlFor(active.beforeImage).width(800).height(1000).url()}
                  alt="Before"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <span className="ba-compare__tag ba-compare__tag--before">Before</span>
              </div>
              {/* After — clipped to sliderPos */}
              <div
                className="ba-compare__img ba-compare__img--after"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <Image
                  src={urlFor(active.afterImage).width(800).height(1000).url()}
                  alt="After"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <span className="ba-compare__tag ba-compare__tag--after">After</span>
              </div>
              {/* Divider handle */}
              <div
                className="ba-compare__handle"
                style={{ left: `${sliderPos}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
