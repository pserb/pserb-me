import { PortableText } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import Link from "next/link";
import { Post } from "@/sanity.types";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) => (projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null);

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const { data } = await sanityFetch({ query: POST_QUERY, params: params });
	const post = data as Post;
	const postImageUrl = post.image ? urlFor(post.image)?.width(550).height(310).url() : null;

	return (
		<main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
			<Link href="/" className="hover:underline">
				← Back to posts
			</Link>
			{postImageUrl && <img src={postImageUrl} alt={post.title} className="aspect-video rounded-xl" width="550" height="310" />}
			<h1 className="text-4xl font-bold mb-8">{post.title}</h1>
			<div className="prose">
				<p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
				{Array.isArray(post.body) && <PortableText value={post.body} />}
			</div>
		</main>
	);
}