import CodeBlock from "@/components/CodeBlock";
import { Home, HOME_QUERYResult, internalGroqTypeReferenceTo, Project } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import HomePageComponent from "@/components/HomePageComponent";
import type { Metadata } from "next";

const HOME_QUERY = groq`*[_type == "home"][0]{
  cta,
  title,
  body,
}`;

async function fetchData() {
	const { data } = await sanityFetch({ query: HOME_QUERY, params: {} });
	const home = data as HOME_QUERYResult;

	return home;
}

export async function generateMetadata(): Promise<Metadata> {
	const home = await fetchData();

	return {
		title: home?.title,
	};
}

export default async function HomePage() {
	const home = await fetchData();

	return <HomePageComponent cta={home?.cta} title={home?.title} body={home?.body} />;
}
