import type { SiteSettings } from '@/lib/types'
import ContactForm from './ContactForm'

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <div className="contact__info-col">
          <p className="section-label">Contact</p>
          <h2 className="contact__heading">Begin Your Journey</h2>
          <p className="contact__body">
            Schedule a private consultation with Dr. Nia to discuss your goals
            in a discreet, unhurried setting.
          </p>
          <ul className="contact__details">
            {settings.contactPhone && (
              <li>
                <span className="contact__detail-label">Phone</span>
                <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
              </li>
            )}
            {settings.contactEmail && (
              <li>
                <span className="contact__detail-label">Email</span>
                <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              </li>
            )}
            {settings.contactAddress && (
              <li>
                <span className="contact__detail-label">Address</span>
                <address>{settings.contactAddress}</address>
              </li>
            )}
          </ul>
        </div>
        <div className="contact__form-col">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
