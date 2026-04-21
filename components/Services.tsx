'use client'

import { useEffect, useRef } from 'react'
import type { Service } from '@/lib/types'

const DEFAULTS: Service[] = [
  {
    _id: '1',
    name: 'Face and Neck Lift',
    description: 'A face and neck lift addresses the deep sinking and deflated tissues of the face that have aged with gravity over time. Dr. Nia employs a preservation-style, extended deep plane face and neck lift to address jowling, a heavy midface, and heavy necks — his firm belief that this is the best approach to an aging face.',
    price: '$25,000 – $50,000',
    order: 1,
  },
  {
    _id: '2',
    name: 'Invisible Access Mid Facelift',
    description: 'Best suited for younger patients with a slightly heavy midface. An incision made a few centimetres behind the hairline allows Dr. Nia to release and suspend the deep soft tissues of the midface upward. This is not a thread lift — true soft-tissue release is performed to achieve lasting results.',
    price: '$15,000 – $25,000',
    order: 2,
  },
  {
    _id: '3',
    name: 'Eyelid and Brow Rejuvenation',
    description: 'Treats drooping eyelids, under-eye bags, and sagging brows. Dr. Nia focuses on volume preservation in his approach, producing brighter, more open eyes and a well-rested appearance. Procedures include brow lift, upper and lower blepharoplasty, and ptosis repair.',
    price: 'Brow lift $10,000–$20,000 · Upper bleph $7,000–$15,000 · Lower bleph $8,000–$20,000 · Ptosis repair $5,000–$10,000',
    order: 3,
  },
  {
    _id: '4',
    name: 'Lip Lifting',
    description: 'Over time the lip elongates with age, often covering the front teeth when the mouth is at rest. Dr. Nia employs a Brow Lift to restore youthful lip proportion and its natural relationship to the teeth.',
    price: '$7,000 – $15,000',
    order: 4,
  },
  {
    _id: '5',
    name: 'Facial Contouring',
    description: 'Whether through fat transfer or buccal fat contouring, adding or subtracting volume from precise areas of the face restores balance and harmony. Dr. Nia tailors each approach to the individual anatomy and aesthetic goal.',
    price: '$6,000 – $12,000',
    order: 5,
  },
  {
    _id: '6',
    name: 'Scar Revision',
    description: 'Using both surgical and non-surgical modalities — including stem cell therapies and laser treatments — Dr. Nia improves the appearance of scars with precision and discretion.',
    price: '$1,000 – $5,000',
    order: 6,
  },
  {
    _id: '7',
    name: 'Skin Cancer Reconstruction',
    description: 'Having performed over 7,000 skin cancer reconstructions — particularly following Mohs surgery — Dr. Nia is a world expert in facial soft-tissue reconstruction. This is where he forged his surgical mastery and deep understanding of the face.',
    price: 'Consultation required',
    order: 7,
  },
  {
    _id: '8',
    name: 'Hair Restoration',
    description: 'Dr. Nia offers follicular unit extraction (FUE) for hair restoration in both men and women — a minimally invasive technique that transplants individual follicles for natural, permanent results without a linear donor scar.',
    price: '$8,000 – $20,000',
    order: 8,
  },
]

export default function Services({ services }: { services: Service[] }) {
  const items = services?.length ? services : DEFAULTS
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rows = sectionRef.current?.querySelectorAll<HTMLElement>('.service-row')
    if (!rows) return

    if (reduced) {
      rows.forEach((row) => row.classList.add('row-revealed'))
      return
    }

    const observers: IntersectionObserver[] = []

    rows.forEach((row) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              row.classList.add('row-revealed')
              observer.disconnect()
            }
          })
        },
        { threshold: 0.1 }
      )
      observer.observe(row)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section className="services-section" id="services-section" ref={sectionRef}>
      <div className="services-header">
        <div>
          <span className="section-label section-label-light">Procedures</span>
          <h2 className="services-heading">Services</h2>
        </div>
        <p className="services-sub">Each procedure is selected in consultation with Dr. Nia, tailored to your anatomy, goals, and timeline.</p>
      </div>
      <div className="services-rows">
        {items.map((s) => (
          <div key={s._id} className="service-row">
            <div className="service-row-left">
              <span className="service-row-name">{s.name}</span>
              {s.price && <span className="service-row-price">{s.price}</span>}
            </div>
            <div className="service-row-right">
              <p className="service-row-desc">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '56px', textAlign: 'center' }}>
        <a className="btn-navy" href="/begin">Begin Your Journey</a>
      </div>
    </section>
  )
}
