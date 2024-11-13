import AboutPageComponent from "@/components/AboutPageComponent";
import CodeBlock from "@/components/CodeBlock";
import { ABOUT_QUERYResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import imageUrlBuilder from "@sanity/image-url";
import { Metadata } from "next";
import { groq, PortableText } from "next-sanity";

const ABOUT_QUERY = groq`*[_type == "about"][0]{
    cta,
    title,
    body
}`;

async function fetchData() {
	const { data } = await sanityFetch({ query: ABOUT_QUERY, params: {} });
	const about = data as ABOUT_QUERYResult;

	return about;
}

export async function generateMetadata(): Promise<Metadata> {
	const about = await fetchData();

	return {
		title: about?.title + " | Paul Serbanescu",
	};
}

export default async function About() {
	const about = await fetchData();

	return <AboutPageComponent about={about} />;
}
