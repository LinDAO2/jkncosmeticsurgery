import type { SiteSettings } from '@/lib/types'

export default function QuoteSection({ settings }: { settings: SiteSettings | null }) {
  const quote = settings?.quote ?? 'At the core of my practice is a single principle: true aesthetic excellence lies not in transformation, but in restoration.'
  const attr = settings?.quoteAttribution ?? '— Dr. John K. Nia, MD'

  return (
    <section className="quote-section">
      <span className="quote-mark">&ldquo;</span>
      <p className="quote-text">{quote}</p>
      <span className="quote-attr">{attr}</span>
    </section>
  )
}
