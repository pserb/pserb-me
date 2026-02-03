import { PROJECT_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import ProjectPageComponent from "@/components/page/ProjectPageComponent";
import { Metadata } from "next";
import { customMetadata } from "@/components/utils/metadata";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { isSanityGif, stripUrlQuery } from "@/components/utils/sanity-image-utils";

const builder = imageUrlBuilder(client);

const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  thumbnail,
  thumbnailAnimation->{
    _id,
    title,
    animationType,
    config,
    poster
  },
  body[]{
    ...,
    _type == "asciiAnimationEmbed" => {
      ...,
      animation->{
        _id,
        title,
        animationType,
        config,
        poster
      }
    }
  }
}`;

async function fetchProjectData(slug: string): Promise<PROJECT_QUERYResult> {
	const { data } = await sanityFetch({ query: PROJECT_QUERY, params: { slug } });
	return data as PROJECT_QUERYResult;
}

function resolveProjectOgImage(
	project: PROJECT_QUERYResult | null,
	baseUrl: string,
	ogTitle: string
) {
	const encodedTitle = encodeURIComponent(ogTitle);

	if (project?.thumbnailAnimation) {
		const asciiGifUrl = `${baseUrl}/api/ascii/thumbnail?id=${project.thumbnailAnimation._id}`;
		return `${baseUrl}/api/og?animated=1&thumb=${encodeURIComponent(asciiGifUrl)}&title=${encodedTitle}`;
	}

	if (project?.thumbnail) {
		const isGif = isSanityGif(project.thumbnail);
		const rawUrl = isGif
			? builder.image(project.thumbnail).url()
			: builder.image(project.thumbnail).width(900).height(900).fit("crop").url();
		const thumbUrl = isGif ? stripUrlQuery(rawUrl) : rawUrl;
		if (isGif) {
			return `${baseUrl}/api/og?animated=1&thumb=${encodeURIComponent(thumbUrl)}&title=${encodedTitle}`;
		}
		return `${baseUrl}/api/og?title=${encodedTitle}&thumb=${encodeURIComponent(thumbUrl)}`;
	}

	return `${baseUrl}/api/og?title=${encodedTitle}`;
}

type Params = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { slug } = await params;
	const project = await fetchProjectData(slug);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pserb.me";
	const ogTitle = project?.title || "";
	const ogImage = resolveProjectOgImage(project, baseUrl, ogTitle);

	return customMetadata({
		title: `${project?.title} | Paul Serbanescu`,
		description: "Project: " + project?.title || "",
		ogtitle: ogTitle,
		image: ogImage,
	})
}

export default async function ProjectPage({ params }: Params) {
	const { slug } = await params;
	const project = await fetchProjectData(slug);

	return <ProjectPageComponent project={project} />;
}
