import { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import { beforeAftersQuery } from '@/sanity/lib/queries'
import type { BeforeAfterCase } from '@/lib/types'

import Nav from '@/components/Nav'
import BeforeAfter from '@/components/BeforeAfter'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Before & After — JKN Cosmetic Surgery',
}

export default async function BeforeAfterPage() {
  const cases = await client.fetch<BeforeAfterCase[]>(beforeAftersQuery).catch(() => [])

  return (
    <>
      <Nav />
      <Suspense fallback={null}>
        <BeforeAfter cases={cases} />
      </Suspense>
      <Footer />
    </>
  )
}
