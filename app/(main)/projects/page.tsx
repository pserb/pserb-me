import { PROJECTS_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import ProjectsPageComponent from "@/components/page/ProjectsPageComponent";
import { Metadata } from "next";
import { customMetadata } from "@/components/utils/metadata";

const PROJECTS_QUERY = groq`*[_type == "projects"][0]{
  title,
  body,
  projects[]->{
    _type,
    _id,
    title,
    slug,
    thumbnail,
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

  return customMetadata({
    title: projects?.title + " | Paul Serbanescu",
    description: "Paul Serbanescu's projects",
    ogtitle: projects?.title || "",
  })
}

export default async function ProjectsPage() {
  const projects = await fetchData();

  return <ProjectsPageComponent projects={projects} />;
}
