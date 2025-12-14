"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "@/components/utils/framer-motion-utils";
import SmartBreadcrumb from "../utils/breadcrumb-utils";
import Card from "../ui/card";

export default function ResumePageComponent() {
	const pathname = usePathname();

	return (
		<motion.div variants={motionContainer()} initial="hidden" animate="visible" className="space-y-6">
			<Card>
				<div className="space-y-6">
					<motion.div variants={motionItem}>
						<SmartBreadcrumb pathname={pathname} pageTitle="Resume" />
					</motion.div>
					
					<motion.div variants={motionItem} className="space-y-2">
						<span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
							paul serbanescu
						</span>
						<h1 className="text-3xl font-bold tracking-tight">Resume</h1>
					</motion.div>
				</div>
			</Card>
			
			<motion.div variants={motionItem}>
				<div className="rounded border border-border overflow-hidden shadow-md">
					<iframe
						className="w-full bg-card"
						src="paul-serbanescu-resume.pdf"
						height="1000"
						title="Resume PDF"
					/>
				</div>
			</motion.div>
		</motion.div>
	);
}
