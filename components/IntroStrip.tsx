import type { SiteSettings } from '@/lib/types'

export default function IntroStrip({ settings }: { settings: SiteSettings }) {
  return (
    <section className="intro-strip" id="intro">
      <div className="intro-strip__inner">
        <h2 className="intro-strip__heading">{settings.introHeading}</h2>
        <p className="intro-strip__body">{settings.introBody}</p>
      </div>
    </section>
  )
}
