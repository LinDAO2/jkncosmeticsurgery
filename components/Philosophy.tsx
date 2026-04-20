import type { PhilosophyCard } from '@/lib/types'

const CIRCLE_COPY = [
  { number: '01', title: 'Structural Refinement', body: "Dr. Nia's philosophy moves beyond temporary fixes, focusing on the deep structural architecture of the face." },
  { number: '02', title: 'Natural Identity',       body: "Results are intentionally understated. Dr. Nia's patients look rested, refreshed, and authentically themselves — never altered." },
  { number: '03', title: 'Longevity of Result',    body: "Every technique is chosen for its long-term integrity — results designed to age beautifully, not to be revisited." },
]

export default function Philosophy({ cards }: { cards: PhilosophyCard[] }) {
  return (
    <section className="philosophy-bg">
      <div className="philosophy-inner">
        <div className="philosophy-header">
          <div className="philosophy-header-left">
            <span className="section-label">Philosophy</span>
            <h2 className="philosophy-heading">
              True excellence lies not in transformation,<br />but in restoration.
            </h2>
          </div>
          <div className="philosophy-header-right">
            <p className="philosophy-teaser-body">
              Dr. John K. Nia approaches every procedure with a singular conviction: that the most refined aesthetic result is one that restores rather than reinvents. His practice is built on structural refinement, balance, and longevity — delivering results that are intentionally understated, enhancing each patient's natural identity without the tell-tale signs of intervention.
            </p>
            <a className="philosophy-teaser-link" href="/about">Learn More &nbsp;→</a>
          </div>
        </div>
      </div>
    </section>
  )
}
