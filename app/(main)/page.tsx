import CodeBlock from "@/components/CodeBlock";
import { Home, HOME_QUERYResult, internalGroqTypeReferenceTo, Project } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq, PortableText } from "next-sanity";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import HomePageComponent from "@/components/HomePageComponent";

const HOME_QUERY = groq`*[_type == "home"][0]{
  cta,
  title,
  body,
}`;

export default async function HomePage() {
	const { data } = await sanityFetch({ query: HOME_QUERY, params: {} });
	const home = data as HOME_QUERYResult;

	return (
		<HomePageComponent cta={home?.cta} title={home?.title} body={home?.body} />
	)
}
