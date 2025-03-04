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
import { solidShadow, WinButton } from "../ui/win-button";
import GlassSheet from "../ui/glass-sheet";

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
		// glass-like div
		// <div className="backdrop-blur border">
		<GlassSheet tint="clear" rounded={false} elevation="raised" transparency={50}>
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
						<video
							className={`border border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,0.25)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.25)]`}
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

				<motion.div variants={motionItem}>
					{Array.isArray(body) && <PortableText value={body} components={ptComponents} />}
				</motion.div>

				<motion.div variants={motionItem}>
					<h3 className="text-2xl font-semibold pt-10 pb-4">Connect</h3>
					<div className="flex flex-row gap-x-10">
						<a href="https://github.com/pserb" target="_blank" rel="noopener noreferrer">
							<WinButton variant="default" shadow="stippled" className="w-[50px] h-[50px]">
								<FontAwesomeIcon icon={faGithub} className="w-[40px] h-[40px]" />
							</WinButton>
						</a>
						<a href="https://linkedin.com/in/pserb" target="_blank" rel="noopener noreferrer">
							<WinButton variant="default" shadow="stippled" className="w-[50px] h-[50px]">
								<FontAwesomeIcon className="w-[40px] h-[40px]" icon={faLinkedin} />
							</WinButton>
						</a>
						<a href="mailto: pserb@gatech.edu" rel="noopener noreferrer">
							<WinButton variant="default" shadow="stippled" className="w-[50px] h-[50px]">
								<FontAwesomeIcon className="w-[40px] h-[40px]" icon={faEnvelope} />
							</WinButton>
						</a>
					</div>
				</motion.div>
				{/* </FlutedGlass> */}
			</motion.div>
			{/* </div> */}
		</GlassSheet>
	);
}
