import { Home, HOME_QUERYResult, internalGroqTypeReferenceTo, Project } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq, PortableText } from "next-sanity";
import Link from "next/link";

const HOME_QUERY = groq`*[_type == "home"][0]{
  title,
  body,
  projects[]->{
    _type,
    _id,
    title,
    slug,
    body
  }
}`;

export default async function HomePage() {
	const { data } = await sanityFetch({ query: HOME_QUERY, params: {} });
	const home = data as HOME_QUERYResult;

	return (
		<main className="container mx-auto min-h-screen max-w-3xl p-8">
			<h1 className="text-4xl font-bold mb-8">{home?.title}</h1>
			{Array.isArray(home?.body) && <PortableText value={home?.body} />}
			<ul className="pt-10 flex flex-col gap-y-4">
				{home?.projects?.map((project) => {
					if (project) {
						return (
							<li className="hover:underline" key={project._id}>
								<Link href={`/projects/${project.slug.current}`}>
									<h2 className="text-xl font-semibold">{project.title}</h2>
									{Array.isArray(project.body) && <PortableText value={project.body} />}
								</Link>
							</li>
						);
					}
					return null;
				})}
			</ul>
		</main>
	);
}
