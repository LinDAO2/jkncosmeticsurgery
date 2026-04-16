import { type SchemaTypeDefinition } from 'sanity'
import { serviceSchema } from './service'
import { beforeAfterSchema } from './beforeAfter'
import { philosophySchema } from './philosophy'
import { doctorSchema } from './doctor'
import { siteSettingsSchema } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [serviceSchema, beforeAfterSchema, philosophySchema, doctorSchema, siteSettingsSchema],
}
