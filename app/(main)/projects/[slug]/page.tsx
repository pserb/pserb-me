import { PROJECT_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import ProjectPageComponent from "@/components/page/ProjectPageComponent";
import { Metadata } from "next";
import { customMetadata } from "@/components/utils/metadata";

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

	return customMetadata({
		title: `${project?.title} | Paul Serbanescu`,
		description: "Project: " + project?.title || "",
		ogtitle: project?.title || "",
	})
}

export default async function ProjectPage({ params }: Params) {
	const { slug } = await params;
	const project = await fetchProjectData(slug);

	return <ProjectPageComponent project={project} />;
}
