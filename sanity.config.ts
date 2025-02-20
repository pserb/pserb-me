"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { pageStructure, singletonPlugin } from "@/sanity/plugins/singleton";
import { homeType } from "@/sanity/schemaTypes/homeType";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { resolve } from "./sanity/presentation/resolve";
import { projectsType } from "./sanity/schemaTypes/projectsType";
import { codeInput } from "@sanity/code-input";
import { muxInput } from "sanity-plugin-mux-input";
import { aboutType } from "./sanity/schemaTypes/aboutType";

export const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";

export default defineConfig({
	basePath: "/studio",
	projectId,
	dataset,
	// Add and edit the content schema in the './sanity/schemaTypes' folder
	schema,
	plugins: [
		structureTool({ structure: pageStructure([homeType, aboutType, projectsType]) }),
		// structureTool({ structure }),
		singletonPlugin([homeType.name]),
		// Vision is for querying with GROQ from inside the Studio
		// https://www.sanity.io/docs/the-vision-plugin
		visionTool({ defaultApiVersion: apiVersion }),
		presentationTool({
			resolve,
			// Required: set the base URL to the preview location in the front end
			previewUrl: {
				previewMode: {
					enable: "/api/draft-mode/enable",
				},
			},
		}),
		codeInput(),
	],
});
