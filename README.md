# Intrepid Luxe website

A plain static website built with [Astro](https://astro.build). No WordPress, no PHP, no database.
The build produces ordinary HTML, CSS and a tiny bit of JavaScript that any host can serve.

## Run it

```
npm install        # first time only
npm run dev        # http://localhost:4321
npm run build      # writes the finished site to dist
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

## Adding reviews and articles (Emilie)

Emilie edits through Pages CMS at https://app.pagescms.org. The settings are in `.pages.yml`. She is invited by email, so she needs no GitHub account, and she cannot change the site's code or settings. Saving an entry updates the site by itself within a couple of minutes (the workflow in `.github/workflows/deploy.yml`).

- Photos can be any size from a phone (JPEG). The workflow shrinks them before publishing (`scripts/optimise-images.mjs`), and the originals stay in the repository.
- A mistake in an entry cannot stop the site building: a missing photo description falls back to the article title, and an unusable crop position falls back to the middle.
- Reviews show newest first, by their `date` (never shown on the site). The first eight reviews carry sort dates only so editing one does not reorder them.

## Add a journal article by hand

Create `src/content/journal/my-title.md`. The file name becomes the web address.

```
---
title: "Why the Maldives suits a slow holiday"
date: 2026-11-02
category: Destinations
summary: "One or two sentences shown on the article card and in Google."
image: maldives.jpg          # optional, a photo in public/img
imageAlt: "A white sand beach"   # describes the photo
imagePosition: "center 70%"      # optional, where to crop the photo (default center)
seoTitle: "Optional different title for Google"
seoDescription: "Optional different description for Google"
---
The article, written in Markdown.
```

`category` must be one of: News, Destinations, Hotels.

## Add a review by hand

Create `src/content/reviews/sarah-and-james.md`. Put their photo in `public/img/reviews`.

```
---
name: Sarah and James
date: 2026-11-02                 # newest first; never shown
trip: Maldives, October 2026     # optional
photo: sarah-and-james.jpg       # optional
featured: true                   # optional, shows it on the home page (if none are set, the first three show)
---
What they said.
```

The Intrepid Edit and Reviews sections on the home page appear automatically once there is at least one.

## Search listing

Every page has its own title and description in its `<Base ...>` tag. Intrepid Edit articles use `seoTitle` and `seoDescription`.

## Taking the site live on intrepidluxe.co.uk

Until the repository variable `LIVE_DOMAIN` is set, every push builds the private preview at `/intrepid-luxe-preview/` (hidden from search engines). To go live:

1. Set the repository variable and start a build: `gh variable set LIVE_DOMAIN --body intrepidluxe.co.uk`, then `gh workflow run "Publish site"`. The result is the real site for that address, open to search engines, with a `CNAME` file. Do this first: a preview build made after the Pages domain is set would delete the `CNAME` file.
2. In the repository's Pages settings, set the custom domain to `intrepidluxe.co.uk`, and tick Enforce HTTPS once the certificate is ready.
3. At GoDaddy (DNS), replace the two website `A` records for `@` with the four GitHub Pages addresses 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, and point the `www` `CNAME` at `felixgbondatpropnition.github.io`. Leave the `MX`, `TXT` and `autodiscover` records alone: they carry Emilie's email.

## Still to do

- The privacy policy wording is a draft for Emilie to confirm before going live.
