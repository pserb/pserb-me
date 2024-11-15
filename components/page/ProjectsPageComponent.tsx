"use client";

import { PROJECTS_QUERYResult } from "@/sanity.types";
import { ExternalLink } from "lucide-react";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "../utils/framer-motion-utils";
import { portableTextComponents } from "../utils/portable-text-utils";
import SmartBreadcrumb from "../utils/breadcrumb-utils";
import { usePathname } from "next/navigation";

// Helper function to truncate PortableText content
function truncatePortableText(portableText: any[], wordLimit: number): any[] {
	let wordCount = 0;
	return portableText.reduce((acc: any[], block: any) => {
		if (wordCount >= wordLimit) return acc;

		if (block._type === "block") {
			const words = block.children
				.filter((child: any) => child._type === "span")
				.map((span: any) => span.text)
				.join(" ")
				.split(" ");

			const remainingWords = wordLimit - wordCount;
			const truncatedWords = words.slice(0, remainingWords);
			wordCount += truncatedWords.length;

			if (truncatedWords.length) {
				acc.push({
					...block,
					children: [{ _type: "span", text: truncatedWords.join(" ") + (wordCount >= wordLimit ? "..." : "") }],
				});
			}
		} else {
			acc.push(block);
		}

		return acc;
	}, []);
}

export default function ProjectsPageComponent({ projects }: { projects: PROJECTS_QUERYResult }) {
	const pathname = usePathname();
	
	return (
		<main className="container mx-auto min-h-screen max-w-3xl p-8 pt-24">
			<motion.div variants={motionContainer(0.18, 0.15)} initial="hidden" animate="visible">
				<motion.div variants={motionItem}>
					<SmartBreadcrumb pathname={pathname} pageTitle={projects?.title} />
				</motion.div>
				<motion.div variants={motionItem}>
					<h1 className="text-4xl font-bold mb-8">{projects?.title}</h1>
				</motion.div>
				<motion.div variants={motionItem}>
					{Array.isArray(projects?.body) && <PortableText value={projects?.body} components={portableTextComponents} />}
				</motion.div>
				<ul className="pt-10 flex flex-col gap-y-4">
					{projects?.projects?.map((project) => {
						if (project) {
							const truncatedBody = Array.isArray(project.body) ? truncatePortableText(project.body, 25) : [];
							return (
								<motion.div key={project._id} variants={motionItem}>
									<Link href={`/projects/${project.slug.current}`}>
										<li
											className="grid border p-4 rounded-md transition-colors duration-200 ease-in-out hover:bg-accent/30"
											key={project._id}
										>
											<span className="justify-self-end col-start-1 row-start-1 text-muted-foreground">
												<ExternalLink />
											</span>
											<span className="col-start-1 row-start-1">
												<h2 className="hover:underline text-xl font-semibold">{project.title}</h2>
												{Array.isArray(truncatedBody) && truncatedBody.length > 0 && (
													<div className="text-sm text-muted-foreground">
														<PortableText value={truncatedBody} />
													</div>
												)}
											</span>
										</li>
									</Link>
								</motion.div>
							);
						}
						return null;
					})}
				</ul>
			</motion.div>
		</main>
	);
}
