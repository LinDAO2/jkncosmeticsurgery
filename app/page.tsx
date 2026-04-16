import { client } from '@/sanity/lib/client'
import {
  servicesQuery,
  beforeAftersQuery,
  philosophyQuery,
  doctorQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries'
import type { Service, BeforeAfterCase, PhilosophyCard, Doctor, SiteSettings } from '@/lib/types'

import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import IntroStrip from '@/components/IntroStrip'
import Philosophy from '@/components/Philosophy'
import Services from '@/components/Services'
import BeforeAfter from '@/components/BeforeAfter'
import About from '@/components/About'
import QuoteSection from '@/components/QuoteSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export const revalidate = 60

export default async function HomePage() {
  const [services, cases, philosophy, doctor, settings] = await Promise.all([
    client.fetch<Service[]>(servicesQuery),
    client.fetch<BeforeAfterCase[]>(beforeAftersQuery),
    client.fetch<PhilosophyCard[]>(philosophyQuery),
    client.fetch<Doctor>(doctorQuery),
    client.fetch<SiteSettings>(siteSettingsQuery),
  ])

  return (
    <>
      <Nav />
      <Hero />
      {settings && <IntroStrip settings={settings} />}
      {philosophy?.length > 0 && <Philosophy cards={philosophy} />}
      {services?.length > 0 && <Services services={services} />}
      {cases?.length > 0 && <BeforeAfter cases={cases} />}
      {doctor && <About doctor={doctor} />}
      {settings?.quote && <QuoteSection settings={settings} />}
      {settings && <ContactSection settings={settings} />}
      {settings && <Footer settings={settings} />}
    </>
  )
}
