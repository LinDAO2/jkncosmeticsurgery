import { defineField, defineType } from 'sanity'

export const doctorSchema = defineType({
  name: 'doctor',
  title: 'Doctor',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'bio',
      title: 'Bio Paragraphs',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Each item is one paragraph of the bio.',
    }),
    defineField({ name: 'photo', title: 'Portrait Photo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'credentials',
      title: 'Education & Training',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'institution', title: 'Institution', type: 'string' }),
          defineField({ name: 'year', title: 'Year', type: 'string' }),
        ],
      }],
    }),
    defineField({ name: 'expertiseTags', title: 'Expertise Tags', type: 'array', of: [{ type: 'string' }] }),
  ],
})
