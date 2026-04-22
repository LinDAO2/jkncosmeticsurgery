const TESTIMONIALS = [
  {
    id: '1',
    quote: 'I had been considering a facelift for years and was terrified of looking overdone. Dr. Nia understood exactly what I was afraid of. Six months later I look like myself — just rested.',
    attribution: 'Patient — Deep Plane Face and Neck Lift',
  },
  {
    id: '2',
    quote: 'What struck me most was how unhurried the consultation felt. He never pushed me toward anything. The results speak for themselves.',
    attribution: 'Patient — Eyelid Rejuvenation',
  },
  {
    id: '3',
    quote: 'I travelled from London specifically for Dr. Nia. The level of care, the discretion, and the outcome exceeded everything I had hoped for.',
    attribution: 'Patient — Comprehensive Rejuvenation',
  },
  {
    id: '4',
    quote: 'I\'m incredibly grateful I chose him. Fifteen months later, the results look completely natural and feel like me. Most friends and family don\'t know I had anything done. They just say I look great. I usually smile and credit a little weight loss and growing my hair longer.',
    attribution: 'Patient — Deep Plane Face and Neck Lift',
  },
  {
    id: '5',
    quote: 'Choosing Dr. Nia was one of the best decisions of my life. After a botched procedure and bad filler work, I\'m so grateful I waited to find the right surgeon. Fifteen months later, I still catch myself in the mirror in disbelief.',
    attribution: 'Patient — Deep Plane Face and Neck Lift',
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <span className="testimonials-label">Patient Experiences</span>
      <h2 className="testimonials-heading">In Their Words</h2>

      <div className="testimonials-scroll">
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className="testimonial-card">
            <div>
              <span className="testimonial-mark">&ldquo;</span>
              <p className="testimonial-quote">{t.quote}&rdquo;</p>
            </div>
            <div className="testimonial-attribution">{t.attribution}</div>
          </div>
        ))}
      </div>

      <p className="testimonials-consent">All patient experiences shared with consent.</p>
      <div className="testimonials-reviews">
        <a
          className="testimonials-reviews-link"
          href="https://www.google.com/search?q=Dr+John+K+Nia+MD+reviews"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read our Google Reviews &nbsp;→
        </a>
      </div>

      <div className="testimonials-cta">
        <a className="btn-navy" href="/begin">Begin Your Journey</a>
      </div>
    </section>
  )
}
