import { PROJECTS_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq, PortableText } from "next-sanity";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ExternalLink } from "lucide-react";

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
}`

function Bc() {
    return (
        <Breadcrumb className="py-2">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default async function ProjectsPage() {
    const { data } = await sanityFetch({ query: PROJECTS_QUERY, params: {} });
    const projects = data as PROJECTS_QUERYResult;

    return (
        <main className="container mx-auto min-h-screen max-w-3xl p-8 pt-24">
            <Bc />
            <h1 className="text-4xl font-bold mb-8">{projects?.title}</h1>
            {Array.isArray(projects?.body) && <PortableText value={projects?.body} />}
            <ul className="pt-10 flex flex-col gap-y-4">
                {projects?.projects?.map((project) => {
                    if (project) {
                        return (
                            <li className="grid border p-4 rounded-md transition-colors duration-200 ease-in-out hover:bg-accent/30" key={project._id}>
                                <span className="justify-self-end col-start-1 row-start-1 text-muted-foreground">
                                    <ExternalLink />
                                </span>
                                <span className="col-start-1 row-start-1">
                                    <Link href={`/projects/${project.slug.current}`}>
                                        <h2 className="hover:underline text-xl font-semibold">{project.title}</h2>
                                        {Array.isArray(project.body) && <PortableText value={project.body} />}
                                    </Link>
                                </span>
                            </li>
                        );
                    }
                    return null;
                })}
            </ul>
        </main>
    )
}