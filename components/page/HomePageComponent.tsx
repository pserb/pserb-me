"use client";

import { PortableText } from "next-sanity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "@/components/utils/framer-motion-utils";
import Card from "../ui/card";
import { portableTextComponents } from "../utils/portable-text-utils";
import { Button } from "../ui/button";

interface HomePageComponentProps {
	cta?: string | null;
	title?: string;
	body: any;
}

export default function HomePageComponent({ cta, title, body }: HomePageComponentProps) {
	return (
		<Card>
			<motion.div variants={motionContainer()} initial="hidden" animate="visible" className="space-y-6">
				<motion.div variants={motionItem} className="space-y-1">
					{cta && (
						<span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
							{cta}
						</span>
					)}
					<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
				</motion.div>

				<motion.div variants={motionItem}>
					<div className="overflow-hidden rounded border border-border shadow-md">
						<video
							className="w-full"
							autoPlay
							loop
							muted
							playsInline
							preload="auto"
							aria-hidden="true"
						>
							<source src="/hero-c-v11.webm" type="video/webm" />
						</video>
					</div>
				</motion.div>

				<motion.div variants={motionItem} className="prose-terminal">
					{Array.isArray(body) && <PortableText value={body} components={portableTextComponents} />}
				</motion.div>

				<motion.div variants={motionItem} className="flex items-center gap-3 pt-2">
					<a href="https://github.com/pserb" target="_blank" rel="noopener noreferrer">
						<Button variant="outline" size="icon" className="size-10">
							<FontAwesomeIcon icon={faGithub} className="size-5" />
						</Button>
					</a>
					<a href="https://linkedin.com/in/pserb" target="_blank" rel="noopener noreferrer">
						<Button variant="outline" size="icon" className="size-10">
							<FontAwesomeIcon icon={faLinkedin} className="size-5" />
						</Button>
					</a>
					<a href="mailto:pserb@gatech.edu" rel="noopener noreferrer">
						<Button variant="outline" size="icon" className="size-10">
							<FontAwesomeIcon icon={faEnvelope} className="size-5" />
						</Button>
					</a>
				</motion.div>
			</motion.div>
		</Card>
	);
}
