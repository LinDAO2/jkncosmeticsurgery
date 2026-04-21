import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { MIDFACELIFT_CASES_DATA, getCaseBySlug } from '@/lib/midfaceliftCases'
import CaseClient from './CaseClient'

export function generateStaticParams() {
  return MIDFACELIFT_CASES_DATA.map((c) => ({ case: c.slug }))
}

export default async function MidfaceliftCasePage({ params }: { params: Promise<{ case: string }> }) {
  const { case: slug } = await params
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
