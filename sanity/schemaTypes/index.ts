import { type SchemaTypeDefinition } from "sanity";
import { projectType } from "./projectType";
import { homeType } from "./homeType";
import { projectsType } from "./projectsType";
import { blockContentType } from "./blockContentType";
import { aboutType } from "./aboutType";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [homeType, aboutType, projectsType, projectType, blockContentType],
};
