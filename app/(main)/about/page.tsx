import AboutPageComponent from "@/components/AboutPageComponent";
import CodeBlock from "@/components/CodeBlock";
import { ABOUT_QUERYResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import imageUrlBuilder from "@sanity/image-url";
import { groq, PortableText } from "next-sanity";

const ABOUT_QUERY = groq`*[_type == "about"][0]{
    cta,
    title,
    body
}`;

export default async function About() {
	const { data } = await sanityFetch({ query: ABOUT_QUERY, params: {} });
	const about = data as ABOUT_QUERYResult;

	return <AboutPageComponent about={about} />;
}
