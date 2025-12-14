"use client";

import { PROJECTS_QUERYResult } from "@/sanity.types";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "../utils/framer-motion-utils";
import { portableTextComponents } from "../utils/portable-text-utils";
import SmartBreadcrumb from "../utils/breadcrumb-utils";
import { usePathname } from "next/navigation";
import { NextSanityImage } from "../utils/sanity-image";
import Card from "../ui/card";
import { ArrowUpRight } from "lucide-react";

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
		<Card>
			<motion.div variants={motionContainer()} initial="hidden" animate="visible" className="space-y-6">
				<motion.div variants={motionItem}>
					<SmartBreadcrumb pathname={pathname} pageTitle={projects?.title} />
				</motion.div>
				
				<motion.div variants={motionItem}>
					<h1 className="-mb-4 text-3xl font-bold tracking-tight">{projects?.title}</h1>
				</motion.div>
				
				<motion.div variants={motionItem} className="prose-terminal">
					{Array.isArray(projects?.body) && <PortableText value={projects?.body} components={portableTextComponents} />}
				</motion.div>
				
				<ul className="space-y-4">
					{projects?.projects?.map((project) => {
						if (project) {
							const truncatedBody = Array.isArray(project.body) ? truncatePortableText(project.body, 25) : [];
							return (
								<motion.div key={project._id} variants={motionItem}>
									<Link href={`/projects/${project.slug.current}`}>
										<li className="group rounded border border-border bg-card p-4 shadow-sm transition-all duration-150 hover:duration-0 hover:bg-foreground hover:text-background hover:border-foreground">
											<div className="flex flex-col md:flex-row gap-4">
												<div className="flex-1 space-y-2">
													<div className="flex items-center gap-2">
														<h2 className="text-lg font-semibold">{project.title}</h2>
														<ArrowUpRight className="size-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
													</div>
													{Array.isArray(truncatedBody) && truncatedBody.length > 0 && (
														<div className="text-sm text-muted-foreground group-hover:text-background/70">
															<PortableText value={truncatedBody} />
														</div>
													)}
												</div>
												{project.thumbnail && (
													<NextSanityImage
														className="w-full aspect-video md:w-[180px] md:aspect-square rounded border border-border group-hover:border-background/30"
														src={project.thumbnail! as any}
														width={300}
														height={300}
													/>
												)}
											</div>
										</li>
									</Link>
								</motion.div>
							);
						}
						return null;
					})}
				</ul>
			</motion.div>
		</Card>
	);
}
