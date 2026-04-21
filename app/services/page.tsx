import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { servicesQuery } from '@/sanity/lib/queries'
import type { Service } from '@/lib/types'

import Nav from '@/components/Nav'
import Services from '@/components/Services'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Surgical Services — JKN Cosmetic Surgery | Dr. John K. Nia, MD',
  description: 'Facial surgical procedures by Dr. John K. Nia in New York City. Face and neck lift, mid facelift, eyelid rejuvenation, lip lifting, facial contouring, hair restoration, and skin cancer reconstruction.',
  alternates: { canonical: 'https://jkncosmeticsurgery.com/services' },
}

export default async function ServicesPage() {
  const services = await client.fetch<Service[]>(servicesQuery).catch(() => [])

  return (
    <>
      <Nav />
      <Services services={services} />
      <Footer />
    </>
  )
}
