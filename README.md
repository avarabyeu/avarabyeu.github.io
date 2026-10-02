# avarabyeu.me

Personal site, built with [Hugo](https://gohugo.io) and deployed to GitHub Pages.

Requires [Task](https://taskfile.dev) and Docker — Hugo itself runs from the official image, so there is nothing else to install.

```sh
task serve     # dev server on http://localhost:1313
task build     # production build into public/
```

Pushing to `develop` builds and deploys via `.github/workflows/deploy.yml`.

## Where things live

| Path | What |
|---|---|
| `data/home.yaml` | Homepage copy: hero, approach lenses, about, contact |
| `data/work.yaml` | Case studies, grouped by lens |
| `layouts/_partials/diagrams/` | Inline SVG architecture diagrams, one per case study |
| `assets/css/main.css` | All styles; light/dark tokens on `:root` |
| `content/blog/` | Blog posts (the nav link appears once the first post exists) |
| `mockups/` | Original design mockups the site was ported from |
