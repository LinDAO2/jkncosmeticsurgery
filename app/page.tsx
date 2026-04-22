import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { casesPreviewQuery, doctorQuery } from '@/sanity/lib/queries'
import type { BeforeAfterCase, Doctor } from '@/lib/types'
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
  const [cases, doctor, contentResult] = await Promise.all([
    client.fetch<BeforeAfterCase[]>(casesPreviewQuery).catch(() => []),
    client.fetch<Doctor>(doctorQuery).catch(() => null),
    supabase.from('site_content').select('*'),
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <Hero />
      <Philosophy heading={philHeading} body={philBody} />
      <CaseStudies cases={cases} />
      <AboutPreview doctor={doctor} />
      <QuoteSection quote={quote} attribution={quoteAttr} />
      <Testimonials />
      <Footer />
    </>
  )
}
