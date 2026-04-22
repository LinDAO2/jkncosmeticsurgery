const DEFAULT_HEADING = 'True excellence lies not in transformation, but in restoration.'
const DEFAULT_BODY = "Dr. John K. Nia approaches every procedure with a singular conviction: that the most refined aesthetic result is one that restores rather than reinvents. His practice is built on structural refinement, balance, and longevity — delivering results that are intentionally understated, enhancing each patient's natural identity without the tell-tale signs of intervention."

export default function Philosophy({ heading, body }: { heading?: string | null; body?: string | null }) {
  return (
    <section className="philosophy-bg">
      <div className="philosophy-inner">
        <div className="philosophy-header">
          <div className="philosophy-header-left">
            <span className="section-label">Philosophy</span>
            <h2 className="philosophy-heading">{heading || DEFAULT_HEADING}</h2>
          </div>
          <div className="philosophy-header-right">
            <p className="philosophy-teaser-body">{body || DEFAULT_BODY}</p>
            <a className="philosophy-teaser-link" href="/about">Learn More &nbsp;→</a>
          </div>
        </div>
      </div>
    </section>
  )
}
