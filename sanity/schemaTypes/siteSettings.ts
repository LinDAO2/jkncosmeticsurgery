import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Only one siteSettings document should ever exist.
  fields: [
    defineField({ name: 'introHeading', title: 'Intro Heading', type: 'string' }),
    defineField({ name: 'introBody', title: 'Intro Body', type: 'text' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text' }),
    defineField({ name: 'quoteAttribution', title: 'Quote Attribution', type: 'string' }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'contactPhone', title: 'Contact Phone', type: 'string' }),
    defineField({ name: 'contactAddress', title: 'Contact Address', type: 'text' }),
    defineField({ name: 'footerTagline', title: 'Footer Tagline', type: 'string' }),
  ],
})
