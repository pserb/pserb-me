"use client";

import { PROJECT_QUERYResult } from "@/sanity.types";
import { PortableText } from "next-sanity";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "../utils/framer-motion-utils";
import { portableTextComponents } from "../utils/portable-text-utils";
import { usePathname } from "next/navigation";
import SmartBreadcrumb from "../utils/breadcrumb-utils";

export default function ProjectPageComponent({ project }: { project: PROJECT_QUERYResult }) {
	const pathname = usePathname();

	return (
		// <main className="container mx-auto min-h-screen max-w-3xl p-8 pt-24">
			<motion.div variants={motionContainer(0.12, 0.1)} initial="hidden" animate="visible">
				<motion.div variants={motionItem}>
					<SmartBreadcrumb pathname={pathname} pageTitle={project?.title} />
				</motion.div>
				<motion.div variants={motionItem}>
					<h1 className="text-4xl font-bold mb-8">{project?.title}</h1>
				</motion.div>
				<motion.div variants={motionItem}>
					{Array.isArray(project?.body) && <PortableText value={project?.body} components={portableTextComponents} />}
				</motion.div>
			</motion.div>
		// </main>
	);
}
