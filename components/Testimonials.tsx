import { supabase } from '@/lib/supabase'

const SEED = [
  { quote: 'I had been considering a facelift for years and was terrified of looking overdone. Dr. Nia understood exactly what I was afraid of. Six months later I look like myself — just rested.', attribution: 'Patient — Deep Plane Face and Neck Lift', display_order: 1 },
  { quote: 'What struck me most was how unhurried the consultation felt. He never pushed me toward anything. The results speak for themselves.', attribution: 'Patient — Eyelid Rejuvenation', display_order: 2 },
  { quote: 'I travelled from London specifically for Dr. Nia. The level of care, the discretion, and the outcome exceeded everything I had hoped for.', attribution: 'Patient — Comprehensive Rejuvenation', display_order: 3 },
  { quote: "I'm incredibly grateful I chose him. Fifteen months later, the results look completely natural and feel like me. Most friends and family don't know I had anything done. They just say I look great. I usually smile and credit a little weight loss and growing my hair longer.", attribution: 'Patient — Deep Plane Face and Neck Lift', display_order: 4 },
  { quote: "Choosing Dr. Nia was one of the best decisions of my life. After a botched procedure and bad filler work, I'm so grateful I waited to find the right surgeon. Fifteen months later, I still catch myself in the mirror in disbelief.", attribution: 'Patient — Deep Plane Face and Neck Lift', display_order: 5 },
]

async function getTestimonials() {
  const { data } = await supabase.from('testimonials').select('*').order('display_order')
  if (data && data.length > 0) return data

  // Seed existing testimonials if table is empty
  await supabase.from('testimonials').insert(SEED)
  return SEED.map((t, i) => ({ ...t, id: String(i) }))
}

export default async function Testimonials() {
  const testimonials = await getTestimonials()

  return (
    <section className="testimonials-section">
      <span className="testimonials-label">Patient Experiences</span>
      <h2 className="testimonials-heading">In Their Words</h2>

      <div className="testimonials-scroll">
        {testimonials.map((t) => (
          <div key={t.id} className="testimonial-card">
            <div>
              <span className="testimonial-mark">&ldquo;</span>
              <p className="testimonial-quote">{t.quote}</p>
              <span className="testimonial-mark testimonial-mark-close">&rdquo;</span>
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
