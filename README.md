# avarabyeu.me

Personal site, built with [Hugo](https://gohugo.io) and deployed to GitHub Pages.

Requires [Task](https://taskfile.dev) and Docker — Hugo itself runs from the official image, so there is nothing else to install.

```sh
task serve                      # dev server on http://localhost:1313, drafts included
task build                      # production build into public/
task new-post -- my-post-slug   # new draft at content/blog/my-post-slug/index.md
```

## Writing a post

1. `task new-post -- my-post-slug`, then write in `content/blog/my-post-slug/index.md`. Images go in the same
   folder; a standalone image with a title (`![Alt](diagram.png "Caption")`) renders as a captioned figure.
2. Fill in `title`, a one-sentence `description` (card, lede, and link previews) and `tags`.
3. Preview with `task serve`. Set `draft: false` to publish. The homepage "Latest posts" section and the
   `blog` nav item appear automatically once the first post is published.

`content/blog/formatting-reference/` is a draft showing every supported element; it never builds for
production.

Pushing to `develop` builds and deploys via `.github/workflows/deploy.yml`.

## Where things live

| Path | What |
|---|---|
| `data/home.yaml` | Homepage copy: hero, approach lenses, about, contact |
| `data/work.yaml` | Case studies, grouped by lens |
| `layouts/_partials/diagrams/` | Inline SVG architecture diagrams, one per case study |
| `assets/css/main.css` | All styles; light/dark tokens on `:root` |
| `content/blog/` | Blog posts, one folder each (the nav link and homepage section appear once one is published) |
| `archetypes/blog.md` | Template for `task new-post` |
| `hugo.toml` → `[params]` | Homepage search title/description and the facts behind the schema.org Person (`[params.author]`) |
| `static/og.png`, `assets/og/` | Link-preview images: the site card, and the base each post's title is drawn onto at build time |
| `mockups/` | Original design mockups the site was ported from |
