import { PROJECT_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import ProjectPageComponent from "@/components/ProjectPageComponent";

const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]`;


export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const { data } = await sanityFetch({ query: PROJECT_QUERY, params: params });
	const project = data as PROJECT_QUERYResult;

	return <ProjectPageComponent project={project} />;
}
