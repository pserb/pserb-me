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
					className="items-center justify-center mx-auto rounded-lg mb-6"
					src={builder.image(value).height(1000).url()}
					alt={value.alt}
				/>
			);
		},
	},
	block: {
		normal: ({ children }) => <p className="mb-4">{children}</p>,
		h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
		h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3">{children}</h2>,
		h3: ({ children }) => <h3 className="text-xl font-medium mb-2">{children}</h3>,
		h4: ({ children }) => <h4 className="text-3xl mt-6 mb-2">{children}</h4>,
		blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">{children}</blockquote>,
	},
	marks: {
		strong: ({ children }: { children: React.ReactNode }) => <strong className="font-bold text-accent">{children}</strong>,
		link: ({ children, value }) => {
			const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
			return (
				<Link href={value.href} rel={rel} className="text-blue-500 hover:underline">
					{children}
				</Link>
			);
		},
	},
};
