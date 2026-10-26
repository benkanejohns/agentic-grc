# agenticgrc.io

The canonical home of Agentic GRC: manifesto, articles, and video episodes.

Astro 7 + React 19 + Tailwind CSS 4 + shadcn/ui, TypeScript throughout.
Fully static output, built for Cloudflare Pages.

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server at localhost:4321
npm run build      # production build to ./dist
npm run preview    # preview the production build locally
```

## Structure

```
src/
  pages/
    index.astro             # the manifesto (landing page)
    writing/index.astro     # article and episode listing
    writing/[...slug].astro # individual post layout
    rss.xml.ts              # RSS feed
  content/blog/             # posts live here as .mdx files
  content.config.ts         # post schema (title, description, date, kind, video, draft)
  layouts/Base.astro        # nav, footer, meta/OG tags, theme init
  components/
    ThemeToggle.tsx         # dark/light toggle (React island; dark default)
    VideoEmbed.astro        # responsive YouTube/Vimeo embed
    ui/button.tsx           # shadcn/ui button (for future interactive islands)
  styles/global.css         # design tokens and prose styles
```

## Publishing a post

Create `src/content/blog/my-post.mdx`:

```yaml
---
title: 'Post title'
description: 'One-sentence description, used in listings, meta tags, and RSS.'
date: 2026-08-01
kind: article        # or 'video'
video: 'https://www.youtube.com/watch?v=...'   # only for kind: video
draft: false         # true hides the post everywhere
---
```

Write the body in Markdown/MDX below the frontmatter. Commit and push;
Cloudflare Pages rebuilds automatically. For video episodes the player is
rendered from the `video` field; the body becomes the show notes.

One placeholder article and one draft video post are included to demonstrate
both layouts. Edit or delete them before going live.

### Session vocabulary in articles

The design system's "agent session" classes are global, so MDX posts can use
them directly with raw HTML: `.thinking` (reasoning block), `.verify`
(verification card), `.diff` / `.hunk.minus` / `.hunk.plus` (diff block),
`.todos` / `.todo` (task list), `.session` (terminal window), and `.toolline`
(tool call line). See `src/pages/index.astro` for markup examples.

## Deploying to Cloudflare Pages

1. Push this repository to GitHub.
2. Cloudflare dashboard -> Workers & Pages -> Create -> Pages -> Connect to Git.
3. Settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - No environment variables required.
4. Add the custom domain `agenticgrc.io` under the project's Custom Domains tab.

## Adding shadcn/ui components

`components.json` is configured, so:

```bash
npx shadcn@latest add card badge separator
```

Components land in `src/components/ui/` and pick up the site's design tokens
automatically.

## Before going live

- [ ] Update the LinkedIn URL in `src/layouts/Base.astro` (footer) to your profile.
- [ ] Rewrite or delete `src/content/blog/why-this-manifesto-exists.mdx`.
- [ ] Delete or complete `src/content/blog/residual-risk-agents-episode-1.mdx`.
