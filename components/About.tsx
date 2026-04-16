import Image from 'next/image'
import type { Doctor } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

const DEFAULT_BIO = [
  "Dr. John Nia is a fellowship-trained cosmetic and reconstructive surgeon renowned for his refined, natural approach to facial aesthetics. With advanced training spanning facial plastic surgery, oculoplastic surgery, dermatologic surgery, cutaneous oncology, and skin cancer reconstruction, he brings a rare level of precision and artistry to every procedure.",
  "A native New Yorker, Dr. Nia graduated with honors from an accelerated 7-year program at the City University of New York, earning both his undergraduate and medical degrees. He completed his internship at Lenox Hill Hospital and went on to train in dermatology at Mount Sinai, where he was selected as Chief Resident — an early distinction reflecting both his technical excellence and leadership.",
  "Dr. Nia further honed his expertise through an elite fellowship at Clinic 5C under the mentorship of Dr. Cameron Chesnut, where he mastered a sophisticated integration of facial plastic, oculoplastic, and dermatologic surgery. This multidisciplinary foundation allows him to approach the face with a comprehensive and highly nuanced perspective.",
  "Dr. Nia is board-certified in micrographic dermatologic surgery and dermatology, and is a faculty of the American Academy of Dermatology. Recognizing the limitations of trend-driven cosmetic treatments in his dermatology residency — overfilled features and repetitive, non-surgical interventions — Dr. Nia opted for a more elevated and surgically integrated path. His philosophy moves beyond temporary fixes, focusing instead on structural refinement, balance, and longevity. His results are intentionally understated, based on restoring rather than transforming, and enhancing each patient's natural identity.",
  "Committed to continual refinement, Dr. Nia has studied alongside leading plastic and oculoplastic surgeons worldwide. His work reflects a discerning eye, meticulous technique, and a deep respect for facial harmony.",
]

const DEFAULT_CREDENTIALS = [
  { institution: 'Fellowship, Mohs Surgery, Dermatologic Oncology & Facial Cosmetic Surgery — Clinic 5C', year: '2020–2021' },
  { institution: 'Chief Resident, Dermatology — Icahn School of Medicine at Mount Sinai', year: '2019–2020' },
  { institution: 'Dermatology Residency — Icahn School of Medicine at Mount Sinai', year: '2017–2019' },
  { institution: 'Dermatopharmacology Research Fellowship — Mount Sinai', year: '2015–2017' },
  { institution: 'Internship, Medicine — Lenox Hill Hospital, New York', year: '2014–2015' },
  { institution: 'MD — New York Medical College', year: '2014' },
]

const DEFAULT_CERTS = [
  { institution: 'Board Certified, American Board of Dermatology', year: '2020' },
  { institution: 'Board Certified, Mohs Micrographic Surgery & Dermatologic Oncology', year: '2021' },
  { institution: 'Faculty, American Academy of Dermatology', year: 'Active' },
  { institution: 'Author, 20+ peer-reviewed publications and textbook chapters', year: 'Ongoing' },
]

const DEFAULT_TAGS = ['Face & Neck Lift', 'Eyelid Surgery', 'Mohs Surgery', 'Scar Revision', 'Skin Reconstruction', 'Hair Restoration', 'Facial Contouring', 'Lip Lifting']

export default function About({ doctor }: { doctor: Doctor | null }) {
  const bio = doctor?.bio?.length ? doctor.bio : DEFAULT_BIO
  const credentials = doctor?.credentials?.length ? doctor.credentials : DEFAULT_CREDENTIALS
  const tags = doctor?.expertiseTags?.length ? doctor.expertiseTags : DEFAULT_TAGS
  const name = doctor?.name ?? 'Dr. John K. Nia'
  const title = doctor?.title ?? 'Fellowship-Trained Cosmetic & Reconstructive Surgeon'

  return (
    <section className="about-section" id="about-section">
      <span className="section-label">The Surgeon</span>
      <div className="about-grid">
        <div>
          <div className="about-photo">
            {doctor?.photo ? (
              <Image
                src={urlFor(doctor.photo).width(560).height(747).url()}
                alt={name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            ) : (
              <Image
                src="/dr-nia.png"
                alt={name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            )}
          </div>
        </div>
        <div className="about-content">
          <span className="section-label">About</span>
          <h2 className="about-name">{name}</h2>
          <span className="about-title">{title}</span>

          {bio.map((para, i) => (
            <p key={i} className="about-body">{para}</p>
          ))}

          <div className="about-rule" />
          <span className="about-block-label">Education &amp; Training</span>
          <ul className="about-list">
            {credentials.map((c, i) => (
              <li key={i}>
                {c.institution}
                <span className="about-list-year">{c.year}</span>
              </li>
            ))}
          </ul>

          <div className="about-rule" />
          <span className="about-block-label">Certifications</span>
          <ul className="about-list">
            {DEFAULT_CERTS.map((c, i) => (
              <li key={i}>
                {c.institution}
                <span className="about-list-year">{c.year}</span>
              </li>
            ))}
          </ul>

          <div className="about-rule" />
          <span className="about-block-label">Areas of Expertise</span>
          <div className="about-expertise">
            {tags.map((tag) => (
              <span key={tag} className="expertise-tag">{tag}</span>
            ))}
          </div>

          <div style={{ marginTop: '40px' }}>
            <a className="btn-navy" href="#contact-section">Request a Consultation</a>
          </div>
        </div>
      </div>
    </section>
  )
}
