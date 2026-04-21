import type { SiteSettings } from '@/lib/types'

export default function QuoteSection({ settings }: { settings: SiteSettings | null }) {
  const quote = settings?.quote ?? 'The goal is never to look different — it is to look entirely, unmistakably yourself.'
  const attr  = settings?.quoteAttribution ?? '— Dr. John K. Nia, MD'

  return (
    <section className="quote-section">
      <p className="quote-text">
        &ldquo;{quote}&rdquo;
      </p>
      <span className="quote-attr">{attr}</span>
    </section>
  )
}
