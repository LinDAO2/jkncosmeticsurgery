export default function QuoteSection({ quote, attribution }: { quote?: string | null; attribution?: string | null }) {
  const q = quote ?? 'The goal is never to look different — it is to look entirely, unmistakably yourself.'
  const a = attribution ?? '— Dr. John K. Nia, MD'

  return (
    <section className="quote-section">
      <p className="quote-text">&ldquo;{q}&rdquo;</p>
      <span className="quote-attr">{a}</span>
    </section>
  )
}
