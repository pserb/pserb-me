import { PROJECT_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import ProjectPageComponent from "@/components/ProjectPageComponent";
import { Metadata } from "next";

const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]`;

async function fetchProjectData(slug: string): Promise<PROJECT_QUERYResult> {
	const { data } = await sanityFetch({ query: PROJECT_QUERY, params: { slug } });
	return data as PROJECT_QUERYResult;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
	const project = await fetchProjectData(params.slug);

	return {
		title: `${project?.title} | Paul Serbanescu`,
	};
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
	const project = await fetchProjectData(params.slug);

	return <ProjectPageComponent project={project} />;
}
