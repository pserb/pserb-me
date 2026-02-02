import { defineField, defineType } from "sanity";

export const projectType = defineType({
	name: "project",
	title: "Project",
	type: "document",
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: { source: "title" },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "thumbnail",
			type: "image",
			options: {
				hotspot: true,
			}
		}),
		defineField({
			name: "thumbnailAnimation",
			title: "Thumbnail Animation",
			type: "reference",
			to: [{ type: "asciiAnimation" }],
		}),
		defineField({
			name: "body",
			type: "blockContent",
		}),
	],
});
