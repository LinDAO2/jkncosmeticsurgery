import { defineField, defineType } from 'sanity'

export const serviceSchema = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'price', title: 'Price', type: 'string', description: 'e.g. "From $25,000"' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
