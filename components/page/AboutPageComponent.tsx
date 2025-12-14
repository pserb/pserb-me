"use client";

import { ABOUT_QUERYResult } from "@/sanity.types";
import { PortableText } from "next-sanity";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "../utils/framer-motion-utils";
import { portableTextComponents } from "../utils/portable-text-utils";
import { usePathname } from "next/navigation";
import SmartBreadcrumb from "../utils/breadcrumb-utils";
import Card from "../ui/card";

export default function AboutPageComponent({ about }: { about: ABOUT_QUERYResult }) {
	const pathname = usePathname();
	
	return (
		<Card>
			<motion.div variants={motionContainer()} initial="hidden" animate="visible" className="space-y-6">
				<motion.div variants={motionItem}>
					<SmartBreadcrumb pathname={pathname} pageTitle={about?.title} />
				</motion.div>
				
				<motion.div variants={motionItem} className="space-y-2">
					{about?.cta && (
						<span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
							{about.cta}
						</span>
					)}
					<h1 className="text-3xl font-bold tracking-tight">{about?.title}</h1>
				</motion.div>
				
				<motion.div variants={motionItem} className="prose-terminal">
					{Array.isArray(about?.body) && <PortableText value={about?.body} components={portableTextComponents} />}
				</motion.div>
			</motion.div>
		</Card>
	);
}
