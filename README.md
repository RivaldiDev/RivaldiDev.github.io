# rivaldidev.work

Portfolio and last-60-days CV. Astro static site with GSAP motion, served from a VPS behind a Cloudflare tunnel.

- `src/` pages, components, `data/cv.json` (CV content) and `scripts/motion.ts` (GSAP)
- `public/assets/` stylesheets, `app.js` (i18n, GitHub projects, terminal, palette), previews and icons
- `npm run dev` for local work, `npm run build` writes `dist/`

Deploy: a post-commit hook runs `portfolio-deploy`, which builds and syncs `dist/` to the folder the site service serves. The root `index.html` only redirects the old GitHub Pages address to the domain.
