import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const homeType = defineType({
    name: 'home',
    title: 'Home',
    type: 'document',
    icon: HomeIcon,
    fields: [
        defineField({
        name: 'title',
        type: 'string',
        validation: (rule) => rule.required(),
        }),
        defineField({
        name: 'body',
        type: 'array',
        of: [{ type: 'block' }],
        }),
        defineField({
        name: 'projects',
        type: 'array',
        of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
        }),
    ],
})