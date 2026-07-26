# rivaldi.dev — portfolio

> **Vibecoder · Full AI Agentic · Web3 Enthusiast**

Live at **[rivaldidev.github.io](https://rivaldidev.github.io)** — zero frameworks, zero build steps, zero dependencies. Modern web platform + GitHub Pages.

## Features

- **Bilingual** — Bahasa Indonesia by default, English toggle (persisted in `localStorage`)
- **Live GitHub API integration** — the projects grid renders itself from `api.github.com` on every page load. Push a new repo → it appears on the site.
- **Interactive terminal** — a real shell visitors can type into (`help`, `whoami`, `projects`, …), fully bilingual
- **Command palette** — `Ctrl+K`
- **Editorial design** — warm paper tones, Fraunces serif, restrained single accent, custom 404
- **Accessible** — respects `prefers-reduced-motion`, semantic HTML, keyboard navigable

## Stack

| Layer | Choice |
|---|---|
| Framework | none — the platform is the framework |
| Build step | none — push = deploy |
| Hosting | GitHub Pages |
| Data | GitHub REST API (client-side) |
| Fonts | Fraunces · Inter · JetBrains Mono |

## Deploy

```bash
git push origin master   # that's it. that's the pipeline.
```
