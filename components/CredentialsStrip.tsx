'use client'

import { Fragment, useEffect, useRef } from 'react'

const CREDENTIALS = [
  { id: '1', countTo: 7000, suffix: '+', label: ['Reconstructive', 'Procedures Performed'], numeric: true },
  { id: '2', value: 'Chief Resident',      label: ['Icahn School of Medicine', 'at Mount Sinai'],      numeric: false },
  { id: '3', value: 'Fellowship Trained',   label: ['Clinic 5C under', 'Dr. Cameron Chesnut'],          numeric: false },
  { id: '4', value: 'Board Certified',      label: ['American Board', 'of Dermatology'],                 numeric: false },
  { id: '5', countTo: 20,   suffix: '+', label: ['Peer-Reviewed', 'Publications'],                    numeric: true },
]

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function CredentialsStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const fired      = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      sectionRef.current?.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
        const to = parseInt(el.dataset.count ?? '0')
        el.textContent = to.toLocaleString() + (el.dataset.suffix ?? '')
      })
      sectionRef.current?.querySelectorAll<HTMLElement>('.dark-cred-text').forEach(el => {
        el.style.opacity = '1'; el.style.transform = 'translateY(0)'
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (fired.current || !entries[0].isIntersecting) return
        fired.current = true
        observer.disconnect()
        const start = performance.now()

        sectionRef.current?.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
          const to       = parseInt(el.dataset.count ?? '0')
          const suffix   = el.dataset.suffix ?? ''
          const duration = to >= 1000 ? 1800 : 1200
          function tick(now: number) {
            const p = Math.min((now - start) / duration, 1)
            el.textContent = Math.round(easeOut(p) * to).toLocaleString() + (p >= 1 ? suffix : '')
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })

        sectionRef.current?.querySelectorAll<HTMLElement>('.dark-cred-text').forEach(el => {
          el.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out'
          el.style.opacity    = '1'
          el.style.transform  = 'translateY(0)'
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="dark-cred-strip" ref={sectionRef}>
      {CREDENTIALS.map((c, i) => (
        <Fragment key={c.id}>
          <div className="dark-cred-item">
            {c.numeric ? (
              <span
                className="dark-cred-value"
                data-count={c.countTo}
                data-suffix={c.suffix}
              >
                0{c.suffix}
              </span>
            ) : (
              <span
                className="dark-cred-value dark-cred-text"
                style={{ opacity: 0, transform: 'translateY(8px)' }}
              >
                {c.value}
              </span>
            )}
            <span className="dark-cred-label">
              {c.label[0]}<br />{c.label[1]}
            </span>
          </div>
          {i < CREDENTIALS.length - 1 && (
            <div className="dark-cred-rule" aria-hidden="true" />
          )}
        </Fragment>
      ))}
    </section>
  )
}
