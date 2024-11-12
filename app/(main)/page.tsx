import CodeBlock from "@/components/CodeBlock";
import { Home, HOME_QUERYResult, internalGroqTypeReferenceTo, Project } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq, PortableText } from "next-sanity";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const HOME_QUERY = groq`*[_type == "home"][0]{
  cta,
  title,
  body,
}`;

const ptComponents = {
	types: {
		code: ({ value }: any) => {
			return <CodeBlock value={value} />
		},
	},
	marks: {
		strong: ({ children }: { children: React.ReactNode }) => <strong className="font-bold text-accent">{children}</strong>,
	},
}

export default async function HomePage() {
	const { data } = await sanityFetch({ query: HOME_QUERY, params: {} });
	const home = data as HOME_QUERYResult;

	return (
		<main className="container mx-auto min-h-screen max-w-3xl p-8 pt-24">
			<h2 className="text-md text-secondary">{home?.cta}</h2>
			<h1 className="text-4xl font-bold mb-8">{home?.title}</h1>

			{/* hero component goes here */}
			<div className="pb-8 -mt-2">
				<video
					className="rounded-lg"
					autoPlay
					loop
					muted
					playsInline
					preload="auto"
					aria-hidden="true"
				>
					<source src="/hero-cfps-v4.webm" type="video/webm" />
				</video>
			</div>

			{Array.isArray(home?.body) && <PortableText value={home?.body} components={ptComponents} />}

			<div className="flex flex-row gap-x-8 pt-8">
				<Button asChild variant="default" className="w-32">
					<Link href="/projects">
						Projects
					</Link>
				</Button>
				<Button asChild variant="default" className="w-32">
					<Link href="/about">
						About
					</Link>
				</Button>
				<Button asChild variant="default" className="w-32">
					<Link href="/resume">
						Resume
					</Link>
				</Button>
			</div>

			<h3 className="text-lg font-semibold pt-10 pb-4">Let's connect!</h3>
			<div className="flex flex-row gap-x-10">
				<a
					href="https://github.com/pserb"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FontAwesomeIcon className="w-8" icon={faGithub} />
				</a>
				<a
					href="https://linkedin.com/in/pserb"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FontAwesomeIcon className="w-8" icon={faLinkedin} />
				</a>
				<a href='mailto: pserb@gatech.edu' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon className="w-8" icon={faEnvelope} /></a>
			</div>
		</main>
	);
}
