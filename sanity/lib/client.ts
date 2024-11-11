import { createClient } from "next-sanity";

import { dataset, projectId } from "../env";

export const client = createClient({
	projectId,
	dataset,
	apiVersion: "vX",
	useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
	stega: { studioUrl: "/studio" }, // IMPORTANT: this has to be /studio for vercel toolbar "open in studio" to work
});
