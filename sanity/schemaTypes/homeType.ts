import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const homeType = defineType({
    name: 'home',
    title: 'Home',
    type: 'document',
    icon: HomeIcon,
    fields: [
        defineField({
            title: "cta",
            name: "cta",
            type: "string",
        }),
        defineField({
            title: 'Title',
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            title: 'Body',
            name: 'body',
            type: 'array',
            of: [{ type: 'block' }],
        }),
    ],
})