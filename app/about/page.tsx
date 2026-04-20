import { client } from '@/sanity/lib/client'
import { doctorQuery } from '@/sanity/lib/queries'
import type { Doctor } from '@/lib/types'

import Nav from '@/components/Nav'
import About from '@/components/About'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About — JKN Cosmetic Surgery',
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
