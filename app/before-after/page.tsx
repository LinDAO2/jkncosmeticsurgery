import type { Metadata } from 'next'
import { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import { beforeAftersQuery } from '@/sanity/lib/queries'
import type { BeforeAfterCase } from '@/lib/types'
import { supabase } from '@/lib/supabase'

import Nav from '@/components/Nav'
import BeforeAfter from '@/components/BeforeAfter'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Before and After Gallery — JKN Cosmetic Surgery | Dr. John K. Nia',
  description: 'Before and after results from Dr. John K. Nia\'s surgical practice in New York City. Comprehensive facial rejuvenation, eyelid surgery, mid facelift, and Mohs reconstruction cases.',
  alternates: { canonical: 'https://jkncosmeticsurgery.com/before-after' },
}

export default async function BeforeAfterPage() {
  const [sanityCases, dbCasesResult, hiddenResult] = await Promise.all([
    client.fetch<BeforeAfterCase[]>(beforeAftersQuery).catch(() => []),
    supabase.from('cases').select('*').order('display_order', { ascending: true }),
    supabase.from('hidden_cases').select('slug, gallery'),
  ])

  const dbCases = dbCasesResult.data ?? []
  const hiddenCases = hiddenResult.data ?? []

  return (
    <>
      <Nav />
      <Suspense fallback={null}>
        <BeforeAfter cases={sanityCases} dbCases={dbCases} hiddenCases={hiddenCases} />
      </Suspense>
      <Footer />
    </>
  )
}
