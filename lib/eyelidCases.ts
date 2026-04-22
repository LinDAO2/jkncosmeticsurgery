export type EyelidCase = {
  slug: string
  caseNumber: string
  procedures: string[]
  imageCount: number
}

export const EYELID_CASES_DATA: EyelidCase[] = [
  { slug: 'case-01', caseNumber: '01', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 4 },
  { slug: 'case-02', caseNumber: '02', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-03', caseNumber: '03', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 5 },
  { slug: 'case-04', caseNumber: '04', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-05', caseNumber: '05', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 19 },
  { slug: 'case-06', caseNumber: '06', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-07', caseNumber: '07', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 4 },
  { slug: 'case-08', caseNumber: '08', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 5 },
  { slug: 'case-09', caseNumber: '09', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-10', caseNumber: '10', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-11', caseNumber: '11', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 6 },
  { slug: 'case-12', caseNumber: '12', procedures: ['Brow Lift'], imageCount: 8 },
  { slug: 'case-13', caseNumber: '13', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 5 },
  { slug: 'case-14', caseNumber: '14', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 7 },
  { slug: 'case-15', caseNumber: '15', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
]

export function getCaseBySlug(slug: string): EyelidCase | undefined {
  return EYELID_CASES_DATA.find((c) => c.slug === slug)
}
