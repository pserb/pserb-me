import { PortableTextReactComponents } from "next-sanity";
import CodeBlock from "./CodeBlock";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";

const builder = imageUrlBuilder(client);

export const portableTextComponents: Partial<PortableTextReactComponents> = {
	types: {
		code: ({ value }: any) => {
			return <CodeBlock value={value} />;
		},
		image: ({ value }: any) => {
			return (
				<img
					className="mx-auto my-6 rounded border border-border shadow-sm"
					src={builder.image(value).height(1000).url()}
					alt={value.alt}
				/>
			);
		},
	},
	block: {
		normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
		h1: ({ children }) => <h1 className="text-2xl font-bold tracking-tight mt-8 mb-4">{children}</h1>,
		h2: ({ children }) => <h2 className="text-xl font-semibold tracking-tight mt-6 mb-3">{children}</h2>,
		h3: ({ children }) => <h3 className="text-lg font-semibold mt-5 mb-2">{children}</h3>,
		h4: ({ children }) => <h4 className="text-base font-semibold mt-4 mb-2">{children}</h4>,
		blockquote: ({ children }) => (
			<blockquote className="border-l-2 border-border pl-4 my-4 italic text-muted-foreground">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }) => <ul className="my-4 ml-4 list-disc list-outside space-y-1">{children}</ul>,
		number: ({ children }) => <ol className="my-4 ml-4 list-decimal list-outside space-y-1">{children}</ol>,
	},
	listItem: {
		bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
		number: ({ children }) => <li className="leading-relaxed">{children}</li>,
	},
	marks: {
		strong: ({ children }: { children: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
		em: ({ children }: { children: React.ReactNode }) => <em>{children}</em>,
		code: ({ children }: { children: React.ReactNode }) => (
			<code className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-sm">
				{children}
			</code>
		),
		link: ({ children, value }) => {
			const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
			return (
				<Link 
					href={value.href} 
					rel={rel} 
					className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
				>
					{children}
				</Link>
			);
		},
	},
};
