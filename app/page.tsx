import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Philosophy from '@/components/Philosophy'
import CaseStudies from '@/components/CaseStudies'
import AboutPreview from '@/components/AboutPreview'
import QuoteSection from '@/components/QuoteSection'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'JKN Cosmetic Surgery — Dr. John K. Nia, MD | New York City',
  description: 'Dr. John K. Nia is a fellowship-trained facial cosmetic and reconstructive surgeon in New York City. Specialising in face and neck lift, eyelid rejuvenation, mid facelift, and skin cancer reconstruction. Board certified. Chief Resident, Mount Sinai.',
  keywords: ['cosmetic surgeon New York', 'facial plastic surgeon NYC', 'face lift New York City', 'eyelid surgery NYC', 'Dr John Nia', 'JKN cosmetic surgery', 'fellowship trained surgeon New York', 'facelift Manhattan'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://jkncosmeticsurgery.com/' },
  openGraph: {
    title: 'JKN Cosmetic Surgery — Dr. John K. Nia, MD',
    description: 'Fellowship-trained facial cosmetic surgeon in New York City. Natural results, surgical precision.',
    url: 'https://jkncosmeticsurgery.com/',
    type: 'website',
    images: [{ url: 'https://jkncosmeticsurgery.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JKN Cosmetic Surgery — Dr. John K. Nia, MD',
    description: 'Fellowship-trained facial cosmetic surgeon in New York City. Natural results, surgical precision.',
    images: ['https://jkncosmeticsurgery.com/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: 'Dr. John K. Nia, MD',
  url: 'https://jkncosmeticsurgery.com',
  logo: 'https://jkncosmeticsurgery.com/logo.png',
  image: 'https://jkncosmeticsurgery.com/dr-nia-home.png',
  description: 'Fellowship-trained facial cosmetic and reconstructive surgeon in New York City. Specialising in face and neck lift, eyelid rejuvenation, mid facelift, and skin cancer reconstruction.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'New York',
    addressRegion: 'NY',
    addressCountry: 'US',
  },
  medicalSpecialty: [
    'Facial Plastic Surgery',
    'Cosmetic Surgery',
    'Dermatologic Surgery',
    'Mohs Surgery',
    'Oculoplastic Surgery',
  ],
  knowsAbout: [
    'Face and Neck Lift',
    'Mid Facelift',
    'Eyelid Rejuvenation',
    'Blepharoplasty',
    'Lip Lifting',
    'Facial Contouring',
    'Hair Restoration',
    'Skin Cancer Reconstruction',
    'Mohs Surgery Reconstruction',
  ],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Icahn School of Medicine at Mount Sinai' },
    { '@type': 'EducationalOrganization', name: 'Clinic 5C' },
  ],
  sameAs: ['https://www.instagram.com/jknmd/'],
}

export default async function HomePage() {
  const [contentResult, featuredResult, aboutItemsResult] = await Promise.all([
    supabase.from('site_content').select('*'),
    supabase.from('cases').select('id, gallery, procedures, images, cover_image').eq('featured', true).order('display_order', { ascending: true }).limit(3),
    supabase.from('about_items').select('content').eq('type', 'bio').order('display_order', { ascending: true }).limit(1),
  ])

  const content: Record<string, Record<string, string>> = {}
  for (const row of contentResult.data ?? []) {
    if (!content[row.section]) content[row.section] = {}
    content[row.section][row.key] = row.value
  }

  const quote = content.quote?.text ?? null
  const quoteAttr = content.quote?.attribution ?? null
  const philHeading = content.philosophy?.heading ?? null
  const philBody = content.philosophy?.body ?? null
  const photoUrl = content.about?.photo_url ?? null
  const aboutName = content.about?.name ?? null
  const aboutTitle = content.about?.title ?? null
  const firstBio = aboutItemsResult.data?.[0]?.content ?? null

  const featuredCases = featuredResult.data ?? []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <Hero />
      <Philosophy heading={philHeading} body={philBody} />
      <CaseStudies dbCases={featuredCases.length > 0 ? featuredCases : undefined} />
      <AboutPreview name={aboutName} title={aboutTitle} para={firstBio} photoUrl={photoUrl} />
      <QuoteSection quote={quote} attribution={quoteAttr} />
      <Testimonials />
      <Footer />
    </>
  )
}
