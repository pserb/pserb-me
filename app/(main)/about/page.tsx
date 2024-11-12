import CodeBlock from "@/components/CodeBlock";
import { ABOUT_QUERYResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import imageUrlBuilder from '@sanity/image-url'
import { groq, PortableText } from "next-sanity";

const ABOUT_QUERY = groq`*[_type == "about"][0]{
    cta,
    title,
    body
}`

const builder = imageUrlBuilder(client);

const ptComponents = {
    types: {
        code: ({ value }: any) => {
            return <CodeBlock value={value} />
        },
        image: ({ value }: any) => {
            return <img className="items-center justify-center mx-auto rounded-lg mb-6" src={builder.image(value).height(1000).url()} alt={value.alt} />
        }
    },
    marks: {
        strong: ({ children }: { children: React.ReactNode }) => <strong className="font-bold text-accent">{children}</strong>,
    },
}

export default async function About() {
    const { data } = await sanityFetch({ query: ABOUT_QUERY, params: {} });
    const about = data as ABOUT_QUERYResult;

    return (
        <main className="container mx-auto min-h-screen max-w-3xl p-8 pt-24">
            <h2 className="text-md text-secondary">{about?.cta}</h2>
            <h1 className="text-4xl font-bold mb-8">{about?.title}</h1>

            {Array.isArray(about?.body) && <PortableText value={about?.body} components={ptComponents} />}
        </main>
    )
}