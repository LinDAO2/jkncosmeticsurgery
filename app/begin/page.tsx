import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

import Nav from '@/components/Nav'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Begin Your Journey — Request a Consultation | JKN Cosmetic Surgery',
  description: 'Request a private consultation with Dr. John K. Nia, MD. All enquiries are handled with complete discretion and responded to within 48 hours.',
  alternates: { canonical: 'https://jkncosmeticsurgery.com/begin' },
}

export default async function BeginPage() {
  const { data } = await supabase.from('site_content').select('*').eq('section', 'contact')
  const content: Record<string, string> = {}
  for (const row of data ?? []) content[row.key] = row.value

  return (
    <>
      <Nav />
      <ContactSection content={content} />
      <Footer />
    </>
  )
}
