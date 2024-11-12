import { defineType, defineArrayMember } from 'sanity'

export const blockContentType = defineType({
    title: 'Block Content',
    name: 'blockContent',
    type: 'array',
    of: [
        defineArrayMember({
            title: 'Block',
            type: 'block',
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H1', value: 'h1' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
                { title: 'Caption', value: 'figcaption' },
            ],
            lists: [{ title: 'Bullet', value: 'bullet' }],
            marks: {
                decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                    {
                        title: 'Caption',
                        value: 'caption',
                        icon: () => 'CAP'
                    },
                    {
                        title: 'Inline Code',
                        value: 'inlineCode',
                        icon: () => '</>',
                    },
                ],
                annotations: [
                    {
                        title: 'URL',
                        name: 'link',
                        type: 'object',
                        fields: [
                            {
                                title: 'URL',
                                name: 'href',
                                type: 'url',
                            },
                        ],
                    },
                ],
            },
        }),
        defineArrayMember({
            type: 'image',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
                {
                    name: 'height',
                    type: 'number',
                    title: 'Height',
                },
                {
                    name: 'width',
                    type: 'number',
                    title: 'Width',
                },
            ],
        }),
        defineArrayMember({
            type: 'code',
        }),
    ],
})