import CodeBlock from "@/components/CodeBlock";
import { PROJECT_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq, PortableText } from "next-sanity";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import imageUrlBuilder from '@sanity/image-url'
import { client } from "@/sanity/lib/client";

const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]`;

const builder = imageUrlBuilder(client);

const ptComponents = {
    types: {
        code: ({ value }: any) => {
            return <CodeBlock value={value} />
        },
        image: ({ value }: any) => {
            return <img className="items-center justify-center mx-auto" src={builder.image(value).height(1000).url()} alt={value.alt} />
        }
    },
}

function Bc({ title, slug }: { title: string | undefined, slug: string }) {
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
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href={slug}>{title}</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { data } = await sanityFetch({ query: PROJECT_QUERY, params: params });
    const project = data as PROJECT_QUERYResult;

    return (
        <main className="container mx-auto min-h-screen max-w-3xl p-8 pt-24">
            <Bc title={project?.title} slug={`/projects/${project?.slug?.current}`} />
            <h1 className="text-4xl font-bold mb-8">{project?.title}</h1>
            {Array.isArray(project?.body) && <PortableText value={project?.body} components={ptComponents} />}
        </main>
    )
}