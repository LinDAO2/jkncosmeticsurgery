import Image from 'next/image'

export type AboutData = {
  name: string
  title: string
  bio: string[]
  credentials: { id: string; content: string }[]
  certs: { id: string; content: string }[]
  recognition: { id: string; content: string; url?: string | null }[]
  tags: string[]
}

const DEFAULTS: AboutData = {
  name: 'Dr. John K. Nia',
  title: 'Fellowship-Trained Cosmetic and Reconstructive Surgeon',
  bio: [
    "Dr. John Nia is a fellowship-trained cosmetic and reconstructive surgeon renowned for his refined, natural approach to facial aesthetics. With advanced training spanning facial plastic surgery, oculoplastic surgery, dermatologic surgery, cutaneous oncology, and skin cancer reconstruction, he brings a rare level of precision and artistry to every procedure.",
    "A native New Yorker, Dr. Nia graduated with honors from an accelerated 7-year program at the City University of New York, earning both his undergraduate and medical degrees. He completed his internship at Lenox Hill Hospital and went on to train in dermatology at Mount Sinai, where he was selected as Chief Resident — an early distinction reflecting both his technical excellence and leadership.",
    "Dr. Nia further honed his expertise through an elite fellowship at Clinic 5C under the mentorship of Dr. Cameron Chesnut, where he mastered a sophisticated integration of facial plastic, oculoplastic, and dermatologic surgery. This multidisciplinary foundation allows him to approach the face with a comprehensive and highly nuanced perspective.",
    "A faculty of the American Academy of Dermatology, Dr. Nia recognised the limitations of trend-driven cosmetic treatments during his residency — overfilled features and repetitive, non-surgical interventions — and opted for a more elevated and surgically integrated path. His philosophy moves beyond temporary fixes, focusing instead on structural refinement, balance, and longevity.",
    "Committed to continual refinement, Dr. Nia has studied alongside leading plastic and oculoplastic surgeons worldwide. His work reflects a discerning eye, meticulous technique, and a deep respect for facial harmony.",
  ],
  credentials: [
    { id: '1', content: 'Fellowship, Mohs Surgery, Dermatologic Oncology and Facial Cosmetic Surgery — Clinic 5C (2020–2021)' },
    { id: '2', content: 'Chief Resident, Dermatology — Icahn School of Medicine at Mount Sinai (2019–2020)' },
    { id: '3', content: 'Dermatology Residency — Icahn School of Medicine at Mount Sinai (2017–2019)' },
    { id: '4', content: 'Dermatopharmacology Research Fellowship — Mount Sinai (2015–2017)' },
    { id: '5', content: 'Internship, Medicine — Lenox Hill Hospital, New York (2014–2015)' },
    { id: '6', content: 'MD — New York Medical College (2014)' },
  ],
  certs: [
    { id: '1', content: 'American Board of Dermatology (2020)' },
    { id: '2', content: 'Mohs Micrographic Surgery and Dermatologic Oncology (2021)' },
    { id: '3', content: 'Faculty, American Academy of Dermatology (Active)' },
    { id: '4', content: 'Author, 20+ peer-reviewed publications and textbook chapters (Ongoing)' },
  ],
  recognition: [
    { id: '1', content: 'Featured in New York Magazine — Best Doctors', url: 'https://nymag.com/bestdoctors/' },
    { id: '2', content: 'Castle Connolly Top Doctor, New York', url: 'https://www.castleconnolly.com/doctors/' },
    { id: '3', content: 'Author of 20+ peer-reviewed publications and textbook chapters', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=John+K+Nia' },
    { id: '4', content: 'Faculty, American Academy of Dermatology', url: 'https://www.aad.org/' },
    { id: '5', content: 'Certified in two surgical specialties', url: 'https://www.certificationmatters.org/' },
  ],
  tags: ['Face and Neck Lift', 'Eyelid Surgery', 'Mohs Surgery', 'Scar Revision', 'Skin Reconstruction', 'Hair Restoration', 'Facial Contouring', 'Lip Lifting'],
}

export default function About({ data }: { data: AboutData | null }) {
  const d = data ?? DEFAULTS

  return (
    <section className="about-section" id="about-section">
      <span className="section-label">The Surgeon</span>
      <div className="about-grid">
        <div>
          <div className="about-photo">
            <Image
              src="/dr-nia-portrait.png"
              alt={d.name}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
            />
          </div>
        </div>
        <div className="about-content">
          <span className="section-label">About</span>
          <h2 className="about-name">{d.name}</h2>
          <span className="about-title">{d.title}</span>

          {d.bio.map((para, i) => (
            <p key={i} className="about-body">{para}</p>
          ))}

          <div className="about-rule" />
          <span className="about-block-label">Education and Training</span>
          <ul className="about-list">
            {d.credentials.map((c) => <li key={c.id}>{c.content}</li>)}
          </ul>

          <div className="about-rule" />
          <span className="about-block-label">Certifications</span>
          <ul className="about-list">
            {d.certs.map((c) => <li key={c.id}>{c.content}</li>)}
          </ul>

          <div className="about-rule" />
          <span className="about-block-label">Recognition</span>
          <div className="about-recognition">
            {d.recognition.map((item) => (
              <div key={item.id} className="recognition-item">
                <div className="recognition-dash" />
                {item.url ? (
                  <a href={item.url} className="recognition-text recognition-link" target="_blank" rel="noopener noreferrer">{item.content}</a>
                ) : (
                  <span className="recognition-text">{item.content}</span>
                )}
              </div>
            ))}
          </div>

          <div className="about-rule" />
          <span className="about-block-label">Areas of Expertise</span>
          <div className="about-expertise">
            {d.tags.map((tag) => (
              <span key={tag} className="expertise-tag">{tag}</span>
            ))}
          </div>

          <div style={{ marginTop: '40px' }}>
            <a className="btn-navy" href="/begin">Request a Consultation</a>
          </div>
        </div>
      </div>
    </section>
  )
}
