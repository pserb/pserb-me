import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const asciiAnimationEmbedType = defineType({
	name: "asciiAnimationEmbed",
	title: "ASCII Animation",
	type: "object",
	icon: ImageIcon,
	fields: [
		defineField({
			name: "animation",
			type: "reference",
			to: [{ type: "asciiAnimation" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "size",
			type: "string",
			options: {
				list: [
					{ title: "Small", value: "small" },
					{ title: "Medium", value: "medium" },
					{ title: "Large", value: "large" },
				],
				layout: "radio",
			},
			initialValue: "medium",
		}),
	],
	preview: {
		select: {
			title: "animation.title",
			subtitle: "size",
			media: "animation.poster",
		},
	},
});
