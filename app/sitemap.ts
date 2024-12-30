import { PROJECTS_QUERYResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/live';
import { MetadataRoute } from 'next'
import { groq } from 'next-sanity';

const PROJECTS_QUERY = groq`*[_type == "projects"][0]{
    title,
    body,
    projects[]->{
      _type,
      _id,
      title,
      slug,
      thumbnail,
      body
    }
  }`;

type SitemapItem = {
    url: string;
    lastModified: Date;
    changeFrequency: 'yearly' | 'monthly' | 'weekly' | 'daily' | 'hourly' | 'always' | 'never';
    priority: number;
};

async function fetchData() {
    const { data } = await sanityFetch({ query: PROJECTS_QUERY, params: {} });
    const projects = data as PROJECTS_QUERYResult;

    return projects;
}

async function fetchDynamicRoutes(): Promise<SitemapItem[]> {
    const projects = await fetchData();

    return projects?.projects?.map((project) => ({
        url: `https://www.pserb.me/projects/${project.slug.current}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9
    })) ?? [];
}

const staticRoutes: SitemapItem[] = [
    {
        url: 'https://www.pserb.me',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1
    },
    {
        url: 'https://www.pserb.me/about',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8
    },
    {
        url: 'https://www.pserb.me/projects',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9
    }
]


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const dynamicRoutes = await fetchDynamicRoutes();

    return [...staticRoutes, ...dynamicRoutes]
}