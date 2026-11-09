import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './data/site';

// A photo field may arrive as "temple.jpg" or "/img/temple.jpg" (the editor writes the full path).
// Article photos live in public/img, review photos in public/img/reviews.
const articlePhoto = z.string().transform((v) => v.trim().replace(/^\/?img\//, '').replace(/^\/+/, ''));
const reviewPhoto = z.string().transform((v) => v.trim().split('/').filter(Boolean).pop() ?? '');

// One markdown file per article in src/content/journal.
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(CATEGORIES),
    summary: z.string(),
    image: articlePhoto.optional().transform((v) => v || undefined), // a photo in public/img, for example "temple.jpg"
    imageAlt: z.string().default(''),
    // where to crop the photo, for example "center 70%"; anything unusable falls back to the middle
    imagePosition: z.string().regex(/^(center|top|bottom|left|right|\d{1,3}%)( (center|top|bottom|left|right|\d{1,3}%))?$/).catch('center').default('center'),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }).transform((d) => ({ ...d, imageAlt: d.image && !d.imageAlt.trim() ? d.title : d.imageAlt })),
});

// One markdown file per review in src/content/reviews. The quote is the body.
// Newest first: reviews with a date sort by it, and undated ones follow in `order`.
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    name: z.string(),
    trip: z.string().optional(),
    photo: reviewPhoto.optional().transform((v) => v || undefined), // a photo in public/img/reviews
    date: z.coerce.date().optional(), // only used for ordering, never shown
    order: z.number().default(100),
    featured: z.boolean().default(false), // shown on the home page; if none are set, the first three are
  }),
});

export const collections = { journal, reviews };
