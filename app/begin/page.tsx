import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/lib/types'

import Nav from '@/components/Nav'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Begin Your Journey — JKN Cosmetic Surgery',
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
