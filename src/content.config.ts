import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const releases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['article', 'video']).default('article'),
    /** For kind: video, the YouTube/Vimeo URL of the episode */
    video: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const standard = defineCollection({
  loader: glob({ pattern: 'agentic-grc-standard.md', base: './docs' }),
  schema: z.object({}),
});

export const collections = { releases, standard };
