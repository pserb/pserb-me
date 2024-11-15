"use client";

import { ABOUT_QUERYResult } from "@/sanity.types";
import { PortableText } from "next-sanity";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "../utils/framer-motion-utils";
import { portableTextComponents } from "../utils/portable-text-utils";
import { usePathname } from "next/navigation";
import SmartBreadcrumb from "../utils/breadcrumb-utils";

export default function AboutPageComponent({ about }: { about: ABOUT_QUERYResult }) {
	const pathname = usePathname();
	
	return (
		<main className="container mx-auto min-h-screen max-w-3xl p-8 pt-24">
			<motion.div variants={motionContainer(0.18, 0.22)} initial="hidden" animate="visible">
				<motion.div variants={motionItem}>
					<SmartBreadcrumb pathname={pathname} pageTitle={about?.title} />
				</motion.div>
				<motion.div variants={motionItem}>
					<h2 className="text-md text-secondary">{about?.cta}</h2>
				</motion.div>
				<motion.div variants={motionItem}>
					<h1 className="text-4xl font-bold mb-8">{about?.title}</h1>
				</motion.div>
				<motion.div variants={motionItem}>
					{Array.isArray(about?.body) && <PortableText value={about?.body} components={portableTextComponents} />}
				</motion.div>
			</motion.div>
		</main>
	);
}
