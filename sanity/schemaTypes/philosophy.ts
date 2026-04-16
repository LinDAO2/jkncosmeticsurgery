import { defineField, defineType } from 'sanity'

export const philosophySchema = defineType({
  name: 'philosophy',
  title: 'Philosophy Card',
  type: 'document',
  fields: [
    defineField({ name: 'number', title: 'Number', type: 'string', description: 'e.g. "01", "02", "03"' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
  ],
})
