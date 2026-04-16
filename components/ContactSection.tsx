import type { SiteSettings } from '@/lib/types'
import ContactForm from './ContactForm'

export default function ContactSection({ settings }: { settings: SiteSettings | null }) {
  return (
    <section className="contact-section" id="contact-section">
      <span className="section-label">Begin</span>
      <div className="contact-grid">
        <div className="contact-left">
          <h2 className="contact-heading">Begin Your Journey</h2>
          <p className="contact-body">Every patient relationship begins with a private, unhurried consultation. Dr. Nia takes the time to understand your goals, assess your anatomy, and present the most appropriate path forward — without pressure, without templates.</p>
          <p className="contact-body">All enquiries are handled with complete discretion.</p>
          <div className="contact-detail">
            <div className="contact-detail-row">
              <span className="contact-detail-label">Practice</span>
              <span className="contact-detail-value">JKN Cosmetic Surgery</span>
            </div>
            <div className="contact-detail-row">
              <span className="contact-detail-label">Instagram</span>
              <span className="contact-detail-value">@jknmd</span>
            </div>
            <div className="contact-detail-row">
              <span className="contact-detail-label">Enquiries</span>
              <span className="contact-detail-value">{settings?.contactEmail ?? 'hello@jkncosmeticsurgery.com'}</span>
            </div>
            <div className="contact-detail-row" style={{ borderBottom: 'none' }}>
              <span className="contact-detail-label">Availability</span>
              <span className="contact-detail-value">Accepting new consultations</span>
            </div>
          </div>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
