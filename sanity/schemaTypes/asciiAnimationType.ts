import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const asciiAnimationType = defineType({
	name: "asciiAnimation",
	title: "ASCII Animation",
	type: "document",
	icon: ImageIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "animationType",
			type: "string",
			options: {
				list: [{ title: "ASCII Chip", value: "ascii-chip" }],
			},
			description: "Select the animation renderer to use.",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "preset",
			title: "Preset",
			type: "string",
			options: {
				list: [
					{ title: "Chip (Dark + Light)", value: "chip-default" },
					{ title: "Chip (Dark Only)", value: "chip-dark" },
					{ title: "Chip (Light Only)", value: "chip-light" },
				],
				layout: "radio",
			},
			description:
				"Optional preset label. Use this to keep a standard look across animations; you can still override fields below.",
			initialValue: "chip-default",
		}),
		defineField({
			name: "poster",
			title: "Poster Image",
			type: "image",
			options: { hotspot: true },
			description: "Optional static thumbnail for Studio lists or previews.",
		}),
		defineField({
			name: "config",
			type: "object",
			initialValue: {
				speed: 1,
				rotationPeriod: 16,
				grid: {
					columns: 120,
					rows: 60,
				},
				character: {
					width: 8,
					height: 16,
					fontSize: 14,
					fontFamily:
						"Berkeley Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
				},
				colors: {
					cyan: "#00FFFF",
					teal: "#00B4C8",
					gold: "#FFC864",
					edge: "#5082A0",
					substrate: "#324B5F",
					background: "#000000",
				},
				themeColors: {
					dark: {
						cyan: "#00FFFF",
						teal: "#00B4C8",
						gold: "#FFC864",
						edge: "#5082A0",
						substrate: "#324B5F",
						background: "#000000",
					},
					light: {
						cyan: "#007A8C",
						teal: "#006B73",
						gold: "#8C5A14",
						edge: "#2F3F4A",
						substrate: "#8EA0AE",
						background: "#FFFFFF",
					},
				},
				chip: {
					size: 1.8,
					thickness: 0.1,
					projectionScale: 64,
					cameraDistance: 3.5,
				},
			},
			fields: [
				defineField({
					name: "speed",
					type: "number",
					description: "Playback speed multiplier (1 = normal).",
					initialValue: 1,
				}),
				defineField({
					name: "rotationPeriod",
					type: "number",
					description: "Seconds per full rotation; lower is faster.",
				}),
				defineField({
					name: "grid",
					type: "object",
					description: "ASCII grid dimensions (characters).",
					fields: [
						defineField({
							name: "columns",
							type: "number",
							description: "Horizontal character count.",
						}),
						defineField({
							name: "rows",
							type: "number",
							description: "Vertical character count.",
						}),
					],
				}),
				defineField({
					name: "character",
					type: "object",
					description: "Character cell sizing and font.",
					fields: [
						defineField({
							name: "width",
							type: "number",
							description: "Character cell width in pixels.",
						}),
						defineField({
							name: "height",
							type: "number",
							description: "Character cell height in pixels.",
						}),
						defineField({
							name: "fontSize",
							type: "number",
							description: "Font size for the ASCII glyphs.",
						}),
						defineField({
							name: "fontFamily",
							type: "string",
							description:
								"Font stack for ASCII rendering; use a monospace font.",
						}),
					],
				}),
				defineField({
					name: "colors",
					type: "object",
					description: "Base color palette (used if no theme override).",
					fields: [
						defineField({
							name: "cyan",
							type: "string",
							description: "Bright node highlights.",
						}),
						defineField({
							name: "teal",
							type: "string",
							description: "Circuit trace color.",
						}),
						defineField({
							name: "gold",
							type: "string",
							description: "BGA pin color.",
						}),
						defineField({
							name: "edge",
							type: "string",
							description: "Edge lighting color.",
						}),
						defineField({
							name: "substrate",
							type: "string",
							description: "Silicon base color.",
						}),
						defineField({
							name: "background",
							type: "string",
							description: "Canvas background color.",
						}),
					],
				}),
				defineField({
					name: "themeColors",
					title: "Theme Colors",
					type: "object",
					description: "Optional palette overrides per theme.",
					fields: [
						defineField({
							name: "dark",
							type: "object",
							description: "Override palette for dark mode.",
							fields: [
								defineField({
									name: "cyan",
									type: "string",
									description: "Bright node highlights.",
								}),
								defineField({
									name: "teal",
									type: "string",
									description: "Circuit trace color.",
								}),
								defineField({
									name: "gold",
									type: "string",
									description: "BGA pin color.",
								}),
								defineField({
									name: "edge",
									type: "string",
									description: "Edge lighting color.",
								}),
								defineField({
									name: "substrate",
									type: "string",
									description: "Silicon base color.",
								}),
								defineField({
									name: "background",
									type: "string",
									description: "Canvas background color.",
								}),
							],
						}),
						defineField({
							name: "light",
							type: "object",
							description: "Override palette for light mode.",
							fields: [
								defineField({
									name: "cyan",
									type: "string",
									description: "Bright node highlights.",
								}),
								defineField({
									name: "teal",
									type: "string",
									description: "Circuit trace color.",
								}),
								defineField({
									name: "gold",
									type: "string",
									description: "BGA pin color.",
								}),
								defineField({
									name: "edge",
									type: "string",
									description: "Edge lighting color.",
								}),
								defineField({
									name: "substrate",
									type: "string",
									description: "Silicon base color.",
								}),
								defineField({
									name: "background",
									type: "string",
									description: "Canvas background color.",
								}),
							],
						}),
					],
				}),
				defineField({
					name: "chip",
					type: "object",
					description: "Chip geometry and camera settings.",
					fields: [
						defineField({
							name: "size",
							type: "number",
							description: "Chip size scaling factor.",
						}),
						defineField({
							name: "thickness",
							type: "number",
							description: "Chip thickness (z-axis).",
						}),
						defineField({
							name: "projectionScale",
							type: "number",
							description: "Projection scale; higher zooms in.",
						}),
						defineField({
							name: "cameraDistance",
							type: "number",
							description: "Camera distance; higher zooms out.",
						}),
					],
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "animationType",
			media: "poster",
		},
	},
});
