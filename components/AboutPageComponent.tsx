"use client";

import { ABOUT_QUERYResult } from "@/sanity.types";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "next-sanity";
import CodeBlock from "./CodeBlock";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";

const builder = imageUrlBuilder(client);

const ptComponents = {
	types: {
		code: ({ value }: any) => {
			return <CodeBlock value={value} />;
		},
		image: ({ value }: any) => {
			return (
				<img
					className="items-center justify-center mx-auto rounded-lg mb-6"
					src={builder.image(value).height(1000).url()}
					alt={value.alt}
				/>
			);
		},
	},
	marks: {
		strong: ({ children }: { children: React.ReactNode }) => <strong className="font-bold text-accent">{children}</strong>,
	},
};

export default function AboutPageComponent({ about }: { about: ABOUT_QUERYResult }) {
	const container = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.18,
				staggerChildren: 0.22,
			},
		},
	};

	const item = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	return (
		<main className="container mx-auto min-h-screen max-w-3xl p-8 pt-24">
			<motion.div variants={container} initial="hidden" animate="visible">
				<motion.div variants={item}>
					<h2 className="text-md text-secondary pt-4">{about?.cta}</h2>
				</motion.div>
				<motion.div variants={item}>
					<h1 className="text-4xl font-bold mb-8">{about?.title}</h1>
				</motion.div>

				<motion.div variants={item}>
					{Array.isArray(about?.body) && <PortableText value={about?.body} components={ptComponents} />}
				</motion.div>
			</motion.div>
		</main>
	);
}
