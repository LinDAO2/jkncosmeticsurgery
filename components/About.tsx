import Image from 'next/image'
import type { Doctor } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

const DEFAULT_BIO = [
  "Dr. John K. Nia is a board-certified dermatologist and fellowship-trained surgeon renowned for his refined, natural approach to facial aesthetics. With advanced training spanning facial plastic surgery, oculoplastic surgery, dermatologic surgery, cutaneous oncology, and skin cancer reconstruction, he brings a rare level of precision and artistry to every procedure.",
  "A native New Yorker, Dr. Nia graduated with honours from an accelerated seven-year programme at the City University of New York, earning both his undergraduate and medical degrees. He completed his internship at Lenox Hill Hospital and trained in dermatology at Mount Sinai, where he was selected as Chief Resident.",
  "Dr. Nia further refined his expertise through an elite fellowship at Clinic 5C under the mentorship of Dr. Cameron Chesnut — mastering a sophisticated integration of facial plastic, oculoplastic, and dermatologic surgery. Recognising the limitations of trend-driven cosmetic treatments, he pursued a more elevated path: structural refinement, balance, and longevity.",
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
              <div className="about-photo-placeholder">
                <span className="about-photo-label">Portrait coming soon</span>
              </div>
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
