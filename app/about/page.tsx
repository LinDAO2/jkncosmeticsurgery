import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { doctorQuery } from '@/sanity/lib/queries'
import type { Doctor } from '@/lib/types'

import Nav from '@/components/Nav'
import About from '@/components/About'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About Dr. John K. Nia, MD — Fellowship-Trained Cosmetic Surgeon NYC',
  description: 'Dr. John K. Nia is board certified in dermatology and Mohs surgery, fellowship trained at Clinic 5C under Dr. Cameron Chesnut, and a former Chief Resident at Icahn School of Medicine at Mount Sinai.',
  alternates: { canonical: 'https://jkncosmeticsurgery.com/about' },
}

export default async function AboutPage() {
  const doctor = await client.fetch<Doctor>(doctorQuery).catch(() => null)

  return (
    <>
      <Nav />
      <About doctor={doctor} />
      <Footer />
    </>
  )
}
