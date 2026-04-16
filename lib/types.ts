export interface SanityImage {
  asset: { url: string }
  hotspot?: { x: number; y: number }
  crop?: object
}

export interface Service {
  _id: string
  name: string
  description: string
  price: string
  order: number
}

export interface BeforeAfterCase {
  _id: string
  title: string
  procedureType: string
  beforeImage: SanityImage
  afterImage: SanityImage
}

export interface PhilosophyCard {
  _id: string
  number: string
  title: string
  body: string
}

export interface Credential {
  institution: string
  year: string
}

export interface Doctor {
  name: string
  title: string
  bio: string[]
  photo: SanityImage
  credentials: Credential[]
  expertiseTags: string[]
}

export interface SiteSettings {
  introHeading: string
  introBody: string
  quote: string
  quoteAttribution: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  footerTagline: string
}

export interface InquiryPayload {
  first_name: string
  last_name: string
  email: string
  phone?: string
  procedure_interest?: string
  message?: string
}
