# Intrepid Luxe website

A plain static website built with [Astro](https://astro.build). No WordPress, no PHP, no database.
The build produces ordinary HTML, CSS and a tiny bit of JavaScript that any host can serve.

## Run it

```
cd site
npm install        # first time only
npm run dev        # http://localhost:4321
npm run build      # writes the finished site to site/dist
```

## Where things live

| What | Where |
|---|---|
| Home, About, Contact, Privacy policy wording | `src/pages/*.astro` |
| Phone, email, form link, social links, menu | `src/data/site.ts` |
| Colours, fonts, layout | `src/styles/global.css` |
| Photos | `public/img` |
| The Intrepid Edit articles | `src/content/journal/*.md` |
| Client reviews | `src/content/reviews/*.md` |

## Add a journal article

Create `src/content/journal/my-title.md`. The file name becomes the web address.

```
---
title: "Why the Maldives suits a slow holiday"
date: 2026-11-02
category: Destinations
summary: "One or two sentences shown on the article card and in Google."
image: maldives.jpg          # optional, must exist in public/img (add the photo first)
imageAlt: "A white sand beach"   # required whenever image is set
seoTitle: "Optional different title for Google"
seoDescription: "Optional different description for Google"
---
The article, written in Markdown.
```

`category` must be one of: News, Destinations, Hotels.

## Add a review

Create `src/content/reviews/sarah-and-james.md`. Put their photo in `public/img/reviews`.

```
---
name: Sarah and James
trip: Maldives, October 2026     # optional
photo: sarah-and-james.jpg       # optional
order: 1                         # optional, lower numbers show first
featured: true                   # optional, shows it on the home page (if none are set, the first three show)
---
What they said.
```

The Intrepid Edit and Reviews sections on the home page appear automatically once there is at least one.

## Search listing

Every page has its own title and description in its `<Base ...>` tag. Intrepid Edit articles use `seoTitle` and `seoDescription`.

## Still to do

- Deploying: nothing is published yet. The `dist` folder can go on Vercel, Netlify, Cloudflare Pages or any ordinary web host.
- Emilie editing without code: a content editor (for example Decap CMS or TinaCMS) can be added on top of the same files.
- Privacy policy wording is a draft for Emilie to confirm.
