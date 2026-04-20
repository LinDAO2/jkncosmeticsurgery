import { client } from '@/sanity/lib/client'
import { servicesQuery } from '@/sanity/lib/queries'
import type { Service } from '@/lib/types'

import Nav from '@/components/Nav'
import Services from '@/components/Services'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Services — JKN Cosmetic Surgery',
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
