import { PROJECTS_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq, PortableText } from "next-sanity";
import ProjectsPageComponent from "@/components/ProjectsPageComponent";

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

export default async function ProjectsPage() {
	const { data } = await sanityFetch({ query: PROJECTS_QUERY, params: {} });
	const projects = data as PROJECTS_QUERYResult;

	return <ProjectsPageComponent projects={projects} />;
}
