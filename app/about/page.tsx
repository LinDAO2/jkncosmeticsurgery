import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { AboutData } from '@/components/About'

import Nav from '@/components/Nav'
import About from '@/components/About'
import Footer from '@/components/Footer'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'About Dr. John K. Nia, MD — Fellowship-Trained Cosmetic Surgeon NYC',
  description: 'Dr. John K. Nia is board certified in dermatology and Mohs surgery, fellowship trained at Clinic 5C under Dr. Cameron Chesnut, and a former Chief Resident at Icahn School of Medicine at Mount Sinai.',
  alternates: { canonical: 'https://jkncosmeticsurgery.com/about' },
}

export default async function AboutPage() {
  const [contentResult, itemsResult] = await Promise.all([
    supabase.from('site_content').select('*').eq('section', 'about'),
    supabase.from('about_items').select('*').order('display_order', { ascending: true }),
  ])

  const content: Record<string, string> = {}
  for (const row of contentResult.data ?? []) content[row.key] = row.value

  const items = itemsResult.data ?? []
  const byType = (type: string) => items.filter(i => i.type === type)

  const data: AboutData | null = items.length === 0 ? null : {
    name: content.name ?? 'Dr. John K. Nia',
    title: content.title ?? 'Fellowship-Trained Cosmetic and Reconstructive Surgeon',
    bio: byType('bio').map(i => i.content),
    credentials: byType('credential').map(i => ({ id: i.id, content: i.content })),
    certs: byType('cert').map(i => ({ id: i.id, content: i.content })),
    recognition: byType('recognition').map(i => ({ id: i.id, content: i.content, url: i.url })),
    tags: byType('tag').map(i => i.content),
  }

  return (
    <>
      <Nav />
      <About data={data} />
      <Footer />
    </>
  )
}
