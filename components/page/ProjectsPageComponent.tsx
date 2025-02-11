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
import { Image } from "next-sanity/image";
import { NextSanityImage, urlForImage } from "../utils/sanity-image";
import { WinButton } from "../ui/win-button";

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
		<motion.div variants={motionContainer()} initial="hidden" animate="visible">
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
										className="group grid border border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,0.25)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.25)] p-4 transition-colors duration-200 ease-in-out hover:bg-foreground hover:text-background"
										key={project._id}
									>
										<div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
											<div className="col-start-1 row-start-1 space-y-2">
												<div className="flex flex-row items-center space-x-2">
													<h2 className="underline text-xl font-semibold">{project.title}</h2>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 39.24 32.26"
														className="w-4 h-4 text-foreground group-hover:text-background transition-colors duration-200" // Adjust size as needed
														aria-hidden="true"
													>
														<path
															d="M29.1,18.43l-6.19.44H0V13.39H23.91l6.26.44L15.84,0h7.63L39.24,15.84v.58L23.47,32.26H15.84Z"
															fill="currentColor"
														/>
													</svg>
												</div>
												{Array.isArray(truncatedBody) && truncatedBody.length > 0 && (
													<div className="text-sm text-muted-foreground">
														<PortableText value={truncatedBody} />
													</div>
												)}
											</div>
											{project.thumbnail && (
												<NextSanityImage
													className="w-full aspect-square md:w-[200px] md:h-[200px] md:ml-6 m-auto border border-foreground hover:border-background"
													src={project.thumbnail! as any}
													width={300}
													height={300}
												/>)
											}
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
	);
}
