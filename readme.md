# la_pages

The published site: a story page (`index.html`) and 14 chapters, with the menu and chapter strips drawn by `site-nav.js`. The pages are built from the analysis code in the private `cs-academy-analysis` repository; `PAGES.md` there says which script builds which page and how to update one, and its `findings/la_pages_fixes.md` lists the open fixes.

**Deploying.** Every push to `main` deploys the site through the GitHub Actions workflow in `.github/workflows/static.yml` (GitHub Pages). There is no separate build step.
