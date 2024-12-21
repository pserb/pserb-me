"use client";

import CodeBlock from "@/components/utils/CodeBlock";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { motionContainer, motionItem } from "@/components/utils/framer-motion-utils";
import FlutedGlass from "../ui/fluted-glass";

const ptComponents = {
	types: {
		code: ({ value }: any) => {
			return <CodeBlock value={value} />;
		},
	},
	marks: {
		strong: ({ children }: { children: React.ReactNode }) => <strong className="font-bold text-accent">{children}</strong>,
	},
};

interface HomePageComponentProps {
	cta?: string | null;
	title?: string;
	body: any;
}

export default function HomePageComponent({ cta, title, body }: HomePageComponentProps) {
	return (
		// <main className="container mx-auto min-h-screen max-w-3xl p-8 pt-24">
			<motion.div variants={motionContainer()} initial="hidden" animate="visible">
				{/* <FlutedGlass type="fluted" className="h-auto min-h-[200px]" angle={90} rounded={true} border={false}> */}
					<motion.div variants={motionItem}>
						<h2 className="text-md text-secondary pt-4">{cta}</h2>
					</motion.div>
					<motion.div variants={motionItem}>
						<h1 className="text-4xl font-bold mb-8">{title}</h1>
					</motion.div>

					{/* hero component goes here */}
					<motion.div variants={motionItem}>
						<div className="pb-8 -mt-2">
							<video className="rounded-lg" autoPlay loop muted playsInline preload="auto" aria-hidden="true">
								<source src="/hero-c-v11.webm" type="video/webm" />
							</video>
						</div>
					</motion.div>

					<motion.div variants={motionItem}>
						{Array.isArray(body) && <PortableText value={body} components={ptComponents} />}
					</motion.div>

					<motion.div variants={motionItem}>
						<div className="flex flex-row gap-x-8 pt-8">
							<Button asChild variant="default" className="w-32">
								<Link href="/projects">Projects</Link>
							</Button>
							<Button asChild variant="default" className="w-32">
								<Link href="/about">About</Link>
							</Button>
							<Button asChild variant="default" className="w-32">
								<Link href="/resume">Resume</Link>
							</Button>
						</div>
					</motion.div>

					<motion.div variants={motionItem}>
						<h3 className="text-lg font-semibold pt-10 pb-4">Let's connect!</h3>
						<div className="flex flex-row gap-x-10">
							<a href="https://github.com/pserb" target="_blank" rel="noopener noreferrer">
								<FontAwesomeIcon className="h-8" icon={faGithub} />
							</a>
							<a href="https://linkedin.com/in/pserb" target="_blank" rel="noopener noreferrer">
								<FontAwesomeIcon className="h-8" icon={faLinkedin} />
							</a>
							<a href="mailto: pserb@gatech.edu" target="_blank" rel="noopener noreferrer">
								<FontAwesomeIcon className="h-8" icon={faEnvelope} />
							</a>
						</div>
					</motion.div>
				{/* </FlutedGlass> */}
			</motion.div>
		// </main>
	);
}