import { defineField, defineType } from "sanity";
import { PresentationIcon } from "@sanity/icons";

export const aboutType = defineType({
    name: 'about',
    title: 'About',
    type: 'document',
    icon: PresentationIcon,
    fields: [
        defineField({
            title: "cta",
            name: "cta",
            type: "string",
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'blockContent',
        }),
    ],
})