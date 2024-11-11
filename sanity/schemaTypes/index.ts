import { type SchemaTypeDefinition } from "sanity";
import { postType } from "./postType";
import { projectType } from "./projectType";
import { homeType } from "./homeType";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [homeType, postType, projectType],
};
