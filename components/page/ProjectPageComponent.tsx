"use client";

import { PROJECT_QUERYResult } from "@/sanity.types";
import { PortableText } from "next-sanity";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "../utils/framer-motion-utils";
import { portableTextComponents } from "../utils/portable-text-utils";
import { usePathname } from "next/navigation";
import SmartBreadcrumb from "../utils/breadcrumb-utils";
import Card from "../ui/card";

export default function ProjectPageComponent({ project }: { project: PROJECT_QUERYResult }) {
	const pathname = usePathname();

	return (
		<Card>
			<motion.div variants={motionContainer(0.12, 0.1)} initial="hidden" animate="visible" className="space-y-6">
				<motion.div variants={motionItem}>
					<SmartBreadcrumb pathname={pathname} pageTitle={project?.title} />
				</motion.div>
				
				<motion.div variants={motionItem}>
					<h1 className="-mb-4 text-3xl font-bold tracking-tight">{project?.title}</h1>
				</motion.div>
				
				<motion.div variants={motionItem} className="prose-terminal">
					{Array.isArray(project?.body) && <PortableText value={project?.body} components={portableTextComponents} />}
				</motion.div>
			</motion.div>
		</Card>
	);
}
