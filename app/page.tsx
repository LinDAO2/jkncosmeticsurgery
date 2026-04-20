import { client } from '@/sanity/lib/client'
import { philosophyQuery, siteSettingsQuery, casesPreviewQuery, doctorQuery } from '@/sanity/lib/queries'
import type { PhilosophyCard, SiteSettings, BeforeAfterCase, Doctor } from '@/lib/types'

import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Philosophy from '@/components/Philosophy'
import CaseStudies from '@/components/CaseStudies'
import AboutPreview from '@/components/AboutPreview'
import QuoteSection from '@/components/QuoteSection'
import Footer from '@/components/Footer'

export const revalidate = 60

export default async function HomePage() {
  const [philosophy, settings, cases, doctor] = await Promise.all([
    client.fetch<PhilosophyCard[]>(philosophyQuery).catch(() => []),
    client.fetch<SiteSettings>(siteSettingsQuery).catch(() => null),
    client.fetch<BeforeAfterCase[]>(casesPreviewQuery).catch(() => []),
    client.fetch<Doctor>(doctorQuery).catch(() => null),
  ])

  return (
    <>
      <Nav />
      <Hero />
      <Philosophy cards={philosophy} />
      <CaseStudies cases={cases} />
      <AboutPreview doctor={doctor} />
      <QuoteSection settings={settings} />
      <Footer />
    </>
  )
}
