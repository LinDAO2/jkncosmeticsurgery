import { client } from '@/sanity/lib/client'
import { servicesQuery, beforeAftersQuery, philosophyQuery, doctorQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { Service, BeforeAfterCase, PhilosophyCard, Doctor, SiteSettings } from '@/lib/types'

import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import IntroStrip from '@/components/IntroStrip'
import Philosophy from '@/components/Philosophy'
import Services from '@/components/Services'
import BeforeAfter from '@/components/BeforeAfter'
import QuoteSection from '@/components/QuoteSection'
import About from '@/components/About'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export const revalidate = 60

export default async function HomePage() {
  const [services, cases, philosophy, doctor, settings] = await Promise.all([
    client.fetch<Service[]>(servicesQuery).catch(() => []),
    client.fetch<BeforeAfterCase[]>(beforeAftersQuery).catch(() => []),
    client.fetch<PhilosophyCard[]>(philosophyQuery).catch(() => []),
    client.fetch<Doctor>(doctorQuery).catch(() => null),
    client.fetch<SiteSettings>(siteSettingsQuery).catch(() => null),
  ])

  return (
    <>
      <Nav />
      <Hero />
      <IntroStrip settings={settings} />
      <Philosophy cards={philosophy} />
      <Services services={services} />
      <BeforeAfter cases={cases} />
      <QuoteSection settings={settings} />
      <About doctor={doctor} />
      <ContactSection settings={settings} />
      <Footer />
    </>
  )
}
