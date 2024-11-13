import { PROJECTS_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq, PortableText } from "next-sanity";
import ProjectsPageComponent from "@/components/ProjectsPageComponent";
import { Metadata } from "next";

const PROJECTS_QUERY = groq`*[_type == "projects"][0]{
  title,
  body,
  projects[]->{
    _type,
    _id,
    title,
    slug,
    body
  }
}`;

async function fetchData() {
	const { data } = await sanityFetch({ query: PROJECTS_QUERY, params: {} });
	const projects = data as PROJECTS_QUERYResult;

	return projects;
}

export async function generateMetadata(): Promise<Metadata> {
	const projects = await fetchData();

	return {
		title: projects?.title + " | Paul Serbanescu",
	};
}

export default async function ProjectsPage() {
	const projects = await fetchData();

	return <ProjectsPageComponent projects={projects} />;
}
