import type { SiteSettings } from '@/lib/types'

export default function IntroStrip({ settings }: { settings: SiteSettings | null }) {
  const heading = settings?.introHeading ?? 'True excellence lies not in transformation, but in restoration.'
  const body = settings?.introBody ?? "Dr. John K. Nia approaches every procedure with a singular conviction: that the most refined aesthetic result is one that restores rather than reinvents. His practice is built on structural refinement, balance, and longevity — delivering results that are intentionally understated, enhancing each patient's natural identity without the tell-tale signs of intervention."

  return (
    <section className="intro-strip" id="intro">
      <div className="intro-left">
        <span className="section-label">Philosophy</span>
        <h2 className="intro-heading">{heading}</h2>
      </div>
      <div className="intro-right">
        <p className="intro-body">{body}</p>
      </div>
    </section>
  )
}
