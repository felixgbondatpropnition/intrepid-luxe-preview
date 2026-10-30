import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './data/site';

// One markdown file per article in src/content/journal.
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(CATEGORIES),
    summary: z.string(),
    image: z.string().optional(), // file name in public/img, for example "temple.jpg"
    imageAlt: z.string().default(''),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }).refine((d) => !d.image || d.imageAlt.trim() !== '', {
    message: 'imageAlt is required when image is set',
    path: ['imageAlt'],
  }),
});

// One markdown file per review in src/content/reviews. The quote is the body.
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    name: z.string(),
    trip: z.string().optional(),
    photo: z.string().optional(), // file name in public/img/reviews
    order: z.number().default(100),
  }),
});

export const collections = { journal, reviews };
