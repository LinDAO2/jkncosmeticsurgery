import { defineField, defineType } from 'sanity'

export const beforeAfterSchema = defineType({
  name: 'beforeAfter',
  title: 'Before and After',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'procedureType', title: 'Procedure Type', type: 'string' }),
    defineField({ name: 'beforeImage', title: 'Before Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'afterImage', title: 'After Image', type: 'image', options: { hotspot: true } }),
  ],
})
