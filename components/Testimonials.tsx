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
    quote: 'For years, I felt like my appearance didn\'t reflect how I felt, and being on video calls so often made it harder to ignore. I spent a lot on fillers and lower eye surgery, but they left my under-eye area looking loose and uneven.\n\nWhen I started considering a facelift, I did extensive research. That\'s when I found Dr. Nia and his holistic approach. What I didn\'t realize at the time was how much the previous work had complicated things. My case turned out to be one of his more challenging.\n\nI\'m incredibly grateful I chose him. Fifteen months later, the results look completely natural and feel like me. Most friends and family don\'t know I had anything done. They just say I look great. I usually smile and credit a little weight loss and growing my hair longer.',
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
              <p className="testimonial-quote">{t.quote.split('\n\n').map((para, i) => (
                <span key={i}>{para}{i < t.quote.split('\n\n').length - 1 && <><br /><br /></>}</span>
              ))}</p>
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
