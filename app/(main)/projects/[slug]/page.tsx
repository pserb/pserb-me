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

type Params = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { slug } = await params;
	const project = await fetchProjectData(slug);

	return {
		title: `${project?.title} | Paul Serbanescu`,
		// You can add more metadata fields here as needed
	};
}

export default async function ProjectPage({ params }: Params) {
	const { slug } = await params;
	const project = await fetchProjectData(slug);

	return <ProjectPageComponent project={project} />;
}
