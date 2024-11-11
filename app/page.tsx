import { sanityFetch } from "@/sanity/lib/live";
import Link from "next/link";
import { Post } from "@/sanity.types";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;


export default async function Home() {
	const {data: posts} = await sanityFetch({query: POSTS_QUERY, params: {}});

	return (
		<main className="container mx-auto min-h-screen max-w-3xl p-8">
			<h1 className="text-4xl font-bold mb-8">Posts</h1>
			<ul className="flex flex-col gap-y-4">
				{posts.map((post: Post) => (
					<li className="hover:underline" key={post._id}>
						<Link href={`/${post.slug.current}`}>
							<h2 className="text-xl font-semibold">{post.title}</h2>
							<p>{new Date(post.publishedAt).toLocaleDateString()}</p>
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
