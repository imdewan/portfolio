# mrdsa.dev

Personal site and blog, built with Next.js (App Router) and deployed on Vercel. Every page is statically generated.

## Writing a post

Add a Markdown file to `content/posts/`. The file name becomes the URL slug.

```md
---
title: "Post title"
excerpt: "One or two sentences for cards and the article intro."
date: 2026-10-01
updated: 2026-10-01
tags: ["React Native", "AI"]
seoTitle: "Optional title override"
seoDescription: "Optional meta description override"
---

Markdown body (GitHub flavored).
```

Commit and push. Vercel rebuilds, and the sitemap, RSS feed, and social preview image update automatically.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
