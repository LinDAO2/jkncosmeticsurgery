export type EyelidCase = {
  slug: string
  caseNumber: string
  procedures: string[]
  imageCount: number
}

export const EYELID_CASES_DATA: EyelidCase[] = [
  { slug: 'case-15', caseNumber: '15', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 5 },
  { slug: 'case-16', caseNumber: '16', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 4 },
  { slug: 'case-17', caseNumber: '17', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 5 },
  { slug: 'case-18', caseNumber: '18', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 7 },
  { slug: 'case-19', caseNumber: '19', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-20', caseNumber: '20', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 4 },
  { slug: 'case-21', caseNumber: '21', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-22', caseNumber: '22', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 6 },
  { slug: 'case-23', caseNumber: '23', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 5 },
  { slug: 'case-24', caseNumber: '24', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-25', caseNumber: '25', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 19 },
  { slug: 'case-26', caseNumber: '26', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-27', caseNumber: '27', procedures: ['Upper and Lower Blepharoplasty'], imageCount: 3 },
  { slug: 'case-28', caseNumber: '28', procedures: ['Upper Brow Lift'], imageCount: 8 },
]

export function getCaseBySlug(slug: string): EyelidCase | undefined {
  return EYELID_CASES_DATA.find((c) => c.slug === slug)
}
