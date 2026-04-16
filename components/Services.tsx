import type { Service } from '@/lib/types'

const DEFAULTS: Service[] = [
  { _id: '1', name: 'Face & Neck Lift', description: "Dr. Nia employs a preservation-style, extended deep plane face and neck lift — the gold standard for addressing jowling, heavy midface, and neck laxity. This technically demanding procedure delivers the most comprehensive and enduring rejuvenation available.", price: 'From $25,000', order: 1 },
  { _id: '2', name: 'Invisible Access Mid Facelift', description: 'For younger patients with a slightly heavy midface, this procedure uses a discreet incision behind the hairline to suspend and restore the deep soft tissues — achieving meaningful lifting without a traditional facelift approach. This is not a thread lift.', price: 'From $15,000', order: 2 },
  { _id: '3', name: 'Eyelid & Brow Rejuvenation', description: 'Treating drooping eyelids, under-eye bags, and sagging brows with a focus on volume preservation. The result is brighter, more open eyes and a well-rested, youthful appearance — without the operated look of traditional blepharoplasty.', price: 'Consultation required', order: 3 },
  { _id: '4', name: 'Lip Lifting', description: 'Over time, the lip elongates with age — often concealing the front teeth at rest. Dr. Nia employs the CUPID lift, a refined technique that restores youthful lip proportion and improves the relationship between the lip and the teeth.', price: '$7,000 – $15,000', order: 4 },
  { _id: '5', name: 'Facial Contouring', description: 'Through precise fat transfer or buccal fat contouring, Dr. Nia restores the natural balance and harmony of facial proportion — adding volume where time has depleted it, and refining areas where structure has become less defined.', price: '$6,000 – $12,000', order: 5 },
  { _id: '6', name: 'Scar Revision', description: 'Using both surgical and non-surgical modalities — including stem cell therapies and advanced laser treatments — Dr. Nia improves scar appearances with precision and discretion. Having performed over 7,000 skin cancer reconstructions, his expertise in soft tissue management is unmatched.', price: '$1,000 – $5,000', order: 6 },
  { _id: '7', name: 'Hair Restoration', description: 'Dr. Nia offers follicular unit extraction (FUE) for hair restoration in both men and women — a minimally invasive technique that transplants individual follicles for natural-looking, permanent results without the linear scar of traditional methods.', price: '$8,000 – $20,000', order: 7 },
  { _id: '8', name: 'Skin Cancer Reconstruction', description: 'With over 7,000 reconstructive procedures performed — particularly following Mohs surgery — Dr. Nia brings an exceptional understanding of facial soft tissue to every reconstruction. Board certified in micrographic dermatologic surgery, this is where his surgical mastery was forged.', price: 'Consultation required', order: 8 },
]

export default function Services({ services }: { services: Service[] }) {
  const items = services?.length ? services : DEFAULTS
  return (
    <section className="services-section" id="services-section">
      <div className="services-header">
        <div>
          <span className="section-label section-label-light">Procedures</span>
          <h2 className="services-heading">Services</h2>
        </div>
        <p className="services-sub">Each procedure is selected in consultation with Dr. Nia, tailored to your anatomy, goals, and timeline.</p>
      </div>
      <div className="services-grid">
        {items.map((s) => (
          <div key={s._id} className="service-card">
            <div className="service-icon" />
            <span className="service-name">{s.name}</span>
            <p className="service-desc">{s.description}</p>
            {s.price && <span className="service-price">{s.price}</span>}
          </div>
        ))}
        <div className="service-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', background: 'rgba(255,255,255,0.07)' }}>
          <span className="service-name" style={{ fontSize: '16px', opacity: 0.5 }}>Not sure where to begin?</span>
          <p className="service-desc" style={{ marginBottom: '28px' }}>Dr. Nia offers private consultations to determine the most appropriate approach for your anatomy and goals.</p>
          <a className="btn-outline" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.25)' }} href="#contact-section">Begin Your Journey</a>
        </div>
      </div>
    </section>
  )
}
