"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "@/components/utils/framer-motion-utils";
import SmartBreadcrumb from "../utils/breadcrumb-utils";

export default function ResumePageComponent() {
	const pathname = usePathname();

	return (
		<main className="container mx-auto min-h-screen p-8 pt-16">
			<motion.div variants={motionContainer(0.18, 0.2)} initial="hidden" animate="visible">
				<div className="max-w-3xl p-8 mx-auto">
					<motion.div variants={motionItem}>
						<SmartBreadcrumb pathname={pathname} pageTitle="Resume" />
					</motion.div>
					<motion.div variants={motionItem}>
						<h2 className="text-md text-secondary">paul serbanescu</h2>
					</motion.div>
					<motion.div variants={motionItem}>
						<h1 className="text-4xl font-bold mb-8">Resume</h1>
					</motion.div>
				</div>
				<motion.div variants={motionItem}>
					<iframe
						className="mx-auto items-center justify-center max-w-5xl"
						src="paul-serbanescu-resume.pdf"
						width="100%"
						height="1000px"
					></iframe>
				</motion.div>
			</motion.div>
		</main>
	);
}
