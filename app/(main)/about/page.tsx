import AboutPageComponent from "@/components/page/AboutPageComponent";
import { customMetadata } from "@/components/utils/metadata";
import { ABOUT_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { Metadata } from "next";
import { groq } from "next-sanity";

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

	return customMetadata({
		title: about?.title + " | Paul Serbanescu",
		description: "About Paul Serbanescu",
		ogtitle: "About",
	})
}

export default async function About() {
	const about = await fetchData();

	return <AboutPageComponent about={about} />;
}
