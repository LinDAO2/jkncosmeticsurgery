import { groq } from 'next-sanity'

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, name, description, price, order
  }
`

export const beforeAftersQuery = groq`
  *[_type == "beforeAfter"] {
    _id, title, procedureType,
    beforeImage { asset->{ url }, hotspot, crop },
    afterImage  { asset->{ url }, hotspot, crop }
  }
`

export const philosophyQuery = groq`
  *[_type == "philosophy"] | order(number asc) {
    _id, number, title, body
  }
`

export const doctorQuery = groq`
  *[_type == "doctor"][0] {
    name, title, bio,
    photo { asset->{ url }, hotspot, crop },
    credentials, expertiseTags
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    introHeading, introBody,
    quote, quoteAttribution,
    contactEmail, contactPhone, contactAddress,
    footerTagline
  }
`
