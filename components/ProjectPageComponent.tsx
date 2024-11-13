// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import { Project, PROJECT_QUERYResult } from "@/sanity.types";
import { PortableText } from "next-sanity";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CodeBlock from "./CodeBlock";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
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
					className="items-center justify-center mx-auto rounded-lg my-6"
					src={builder.image(value).height(1000).url()}
					alt={value.alt}
				/>
			);
		},
	},
	block: {
		// Adding custom rendering for normal paragraphs
		normal: ({ children }: { children: React.ReactNode }) => <p className="mb-4">{children}</p>,
		// You can add more custom styles for other block types if needed
		h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
		h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-2xl font-semibold mb-3">{children}</h2>,
		h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-xl font-medium mb-2">{children}</h3>,
		h4: ({ children }: { children: React.ReactNode }) => <h4 className="text-3xl mt-6 mb-2">{children}</h4>,
		blockquote: ({ children }: { children: React.ReactNode }) => (
			<blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">{children}</blockquote>
		),
	},
	marks: {
		link: ({ children, value }: { children: React.ReactNode; value: { href: string } }) => {
			const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
			return (
				<Link href={value.href} rel={rel} className="text-blue-500 hover:underline">
					{children}
				</Link>
			);
		},
        strong: ({ children }: { children: React.ReactNode }) => <strong className="font-bold text-accent">{children}</strong>,
	},
};

function Bc({ title, slug }: { title: string | undefined; slug: string }) {
	return (
		<Breadcrumb className="py-2">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href={slug}>{title}</BreadcrumbLink>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export default function ProjectPageComponent({ project }: { project: PROJECT_QUERYResult }) {
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
					<Bc title={project?.title} slug={`/projects/${project?.slug?.current}`} />
				</motion.div>
				<motion.div variants={item}>
					<h1 className="text-4xl font-bold mb-8">{project?.title}</h1>
				</motion.div>
				<motion.div variants={item}>
					{Array.isArray(project?.body) && <PortableText value={project?.body} components={ptComponents} />}
				</motion.div>
			</motion.div>
		</main>
	);
}
