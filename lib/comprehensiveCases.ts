export type ComprehensiveCase = {
  slug: string
  caseNumber: string
  procedures: string[]
  imageCount: number
  videoUrl?: string
  videoUrl2?: string
}

// Procedures marked TODO — update from Google Drive patient detail files
export const COMPREHENSIVE_CASES_DATA: ComprehensiveCase[] = [
  {
    slug: 'case-01',
    caseNumber: '01',
    procedures: [
      'Deep Plane Face and Neck Lift',
      'Upper Blepharoplasty',
      'Lower Blepharoplasty',
      'Brow Lift',
      'Fat Transfer',
      'Lip Lift',
      'Laser Resurfacing',
    ],
    imageCount: 8,
  },
  {
    slug: 'case-02',
    caseNumber: '02',
    procedures: [
      'Deep Plane Face and Neck Lift',
      'Upper Blepharoplasty',
      'Lower Blepharoplasty',
      'Fat Transfer',
      'Laser Resurfacing',
    ],
    imageCount: 10,
  },
  {
    slug: 'case-03',
    caseNumber: '03',
    procedures: [
      'Deep Plane Face and Neck Lift',
      'Upper Blepharoplasty',
      'Lower Blepharoplasty',
      'Fat Transfer',
    ],
    imageCount: 4,
  },
  {
    slug: 'case-04',
    caseNumber: '04',
    procedures: [
      'Deep Plane Face and Neck Lift',
      'Upper Blepharoplasty',
      'Lower Blepharoplasty',
      'Brow Lift',
      'Fat Transfer',
      'Laser Resurfacing',
    ],
    imageCount: 7,
  },
  {
    slug: 'case-05',
    caseNumber: '05',
    procedures: [
      'Deep Plane Face and Neck Lift',
      'Upper Blepharoplasty',
      'Lower Blepharoplasty',
      'Brow Lift',
      'Lip Lift',
      'Fat Transfer',
      'Laser Resurfacing',
      'Ptosis Repair',
    ],
    imageCount: 12,
    videoUrl: 'https://www.instagram.com/reel/DV1Uyy7D8ta/?igsh=dnIyZjZsYzB6cDlx',
    videoUrl2: 'https://www.instagram.com/reel/DMGAk4RxuMm/?igsh=MWNxZHdzcTJxYjQ0OA==',
  },
  {
    slug: 'case-06',
    caseNumber: '06',
    procedures: [
      'Deep Plane Face and Neck Lift',
      'Fat Transfer',
    ],
    imageCount: 2,
  },
  {
    slug: 'case-07',
    caseNumber: '07',
    procedures: [
      'Deep Plane Face and Neck Lift',
      'Upper Blepharoplasty',
      'Lower Blepharoplasty',
      'Fat Transfer',
      'Laser Resurfacing',
    ],
    imageCount: 7,
  },
  {
    slug: 'case-08',
    caseNumber: '08',
    procedures: [
      'Deep Plane Face and Neck Lift',
      'Upper Blepharoplasty',
      'Lower Blepharoplasty',
      'Fat Transfer',
      'Laser Resurfacing',
    ],
    imageCount: 6,
  },
  {
    slug: 'case-09',
    caseNumber: '09',
    procedures: [
      'Brow Lift',
      'Upper Blepharoplasty',
      'Ptosis Repair',
      'Lower Blepharoplasty',
      'Deep Plane Face and Neck Lift with Submandibular Gland Sculpting',
      'Buccal Fat Contouring',
      'Fat Transfer',
      'Laser Resurfacing',
    ],
    imageCount: 8,
  },
]

export function getCaseBySlug(slug: string): ComprehensiveCase | undefined {
  return COMPREHENSIVE_CASES_DATA.find((c) => c.slug === slug)
}
