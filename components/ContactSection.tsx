import ContactForm from './ContactForm'

export default function ContactSection({ content = {} }: { content?: Record<string, string> }) {
  const body1 = content.body1 ?? 'Every patient relationship begins with a private, unhurried consultation. Dr. Nia takes the time to understand your goals, assess your anatomy, and present the most appropriate path forward — without pressure, without templates.'
  const body2 = content.body2 ?? 'All enquiries are handled with complete discretion.'
  const availability = content.availability ?? 'Accepting new consultations'
  const instagramHandle = content.instagram_handle ?? '@jknmd'
  const instagramUrl = content.instagram_url ?? 'https://www.instagram.com/jknmd'
  const email = content.email ?? 'info@jkncosmeticsurgery.com'

  return (
    <section className="contact-section" id="contact-section">
      <span className="section-label">Begin</span>
      <div className="contact-grid">
        <div className="contact-left">
          <h2 className="contact-heading">Begin Your Journey</h2>
          <p className="contact-body">{body1}</p>
          <p className="contact-body">{body2}</p>
          <div className="contact-detail">
            <div className="contact-detail-row" style={{ borderBottom: 'none' }}>
              <span className="contact-detail-label">Availability</span>
              <span className="contact-detail-value">{availability}</span>
            </div>
          </div>

          <div className="contact-social">
            <a className="contact-social-link" href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <svg className="contact-social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
              <span>{instagramHandle}</span>
            </a>
            <a className="contact-social-link" href={`mailto:${email}`}>
              <svg className="contact-social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>
              </svg>
              <span>{email}</span>
            </a>
          </div>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
