import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (
    await getCollection('releases', ({ data }) => !data.draft)
  ).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Agentic GRC',
    description:
      'Building AI agent systems that perform risk and compliance work, with the determinism, evidence, and accountability that regulated environments demand.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/releases/${post.id}/`,
    })),
    customData: '<language>en-au</language>',
  });
}
