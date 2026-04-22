import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Service } from '@/lib/types'

import Nav from '@/components/Nav'
import Services from '@/components/Services'
import Footer from '@/components/Footer'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Surgical Services — JKN Cosmetic Surgery | Dr. John K. Nia, MD',
  description: 'Facial surgical procedures by Dr. John K. Nia in New York City. Face and neck lift, mid facelift, eyelid rejuvenation, lip lifting, facial contouring, hair restoration, and skin cancer reconstruction.',
  alternates: { canonical: 'https://jkncosmeticsurgery.com/services' },
}

export default async function ServicesPage() {
  const { data } = await supabase.from('services').select('*').order('display_order', { ascending: true })
  const services: Service[] = (data ?? []).map(s => ({ _id: s.id, name: s.name, description: s.description, price: s.price, order: s.display_order }))

  return (
    <>
      <Nav />
      <Services services={services} />
      <Footer />
    </>
  )
}
