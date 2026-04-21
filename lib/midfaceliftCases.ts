export type MidfaceliftCase = {
  slug: string
  caseNumber: string
  procedures: string[]
  imageCount: number
}

export const MIDFACELIFT_CASES_DATA: MidfaceliftCase[] = [
  {
    slug: 'case-01',
    caseNumber: '01',
    procedures: ['Invisible Access Mid Facelift'],
    imageCount: 10,
  },
  {
    slug: 'case-02',
    caseNumber: '02',
    procedures: ['Invisible Access Mid Facelift'],
    imageCount: 5,
  },
]

export function getCaseBySlug(slug: string): MidfaceliftCase | undefined {
  return MIDFACELIFT_CASES_DATA.find((c) => c.slug === slug)
}
