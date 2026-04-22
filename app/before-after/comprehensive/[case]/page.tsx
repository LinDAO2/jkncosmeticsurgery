import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { COMPREHENSIVE_CASES_DATA, getCaseBySlug } from '@/lib/comprehensiveCases'
import { supabase } from '@/lib/supabase'
import CaseClient from './CaseClient'
import DynamicCaseClient from '@/components/DynamicCaseClient'

export const dynamicParams = true

export function generateStaticParams() {
  return COMPREHENSIVE_CASES_DATA.map((c) => ({ case: c.slug }))
}

export default async function ComprehensiveCasePage({ params }: { params: Promise<{ case: string }> }) {
  const { case: slug } = await params

  if (slug.startsWith('db-')) {
    const id = slug.slice(3)
    const { data } = await supabase.from('cases').select('*').eq('id', id).single()
    if (!data) {
      return (
        <>
          <Nav />
          <section style={{ padding: '160px 40px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#888' }}>Case not found.</p>
          </section>
          <Footer />
        </>
      )
    }
    return <DynamicCaseClient gallery="comprehensive" procedures={data.procedures ?? []} images={data.images ?? []} instagramVideos={data.instagram_videos ?? []} />
  }

  const data = getCaseBySlug(slug)

  if (!data) {
    return (
      <>
        <Nav />
        <section style={{ padding: '160px 40px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#888' }}>Case not found.</p>
        </section>
        <Footer />
      </>
    )
  }

  return <CaseClient data={data} />
}
