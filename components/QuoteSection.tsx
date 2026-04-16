import type { SiteSettings } from '@/lib/types'

export default function QuoteSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="quote-section">
      <div className="quote-section__inner">
        <blockquote className="quote-section__quote">
          <p>{settings.quote}</p>
          <footer>
            <cite>{settings.quoteAttribution}</cite>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
