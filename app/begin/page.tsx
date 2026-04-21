import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/lib/types'

import Nav from '@/components/Nav'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Begin Your Journey — Request a Consultation | JKN Cosmetic Surgery',
  description: 'Request a private consultation with Dr. John K. Nia, MD. All enquiries are handled with complete discretion and responded to within 48 hours.',
  alternates: { canonical: 'https://jkncosmeticsurgery.com/begin' },
}

export default async function BeginPage() {
  const settings = await client.fetch<SiteSettings>(siteSettingsQuery).catch(() => null)

  return (
    <>
      <Nav />
      <ContactSection settings={settings} />
      <Footer />
    </>
  )
}
