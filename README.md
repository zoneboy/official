# Recyclers Association of Nigeria — Website

Official website for the Recyclers Association of Nigeria (RAN), built with React + Vite.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Production Build

```bash
npm run build
npm run preview   # preview locally
```

## Deploy to Netlify

**Option A — Git deploy (recommended):**
1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Build settings are auto-detected from `netlify.toml`
5. Click Deploy

**Option B — Drag & drop:**
1. Run `npm run build`
2. Drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

## Project Structure

```
ran-website/
├── index.html                  # HTML entry point
├── netlify.toml                # Netlify build + redirect config
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                # React mount point
    ├── App.jsx                 # Root — routing + layout shell
    ├── styles/
    │   ├── global.css          # Reset + base styles
    │   └── tokens.js           # Design system (colors, fonts, gradients)
    ├── components/
    │   ├── index.js            # Barrel export
    │   ├── Icon.jsx            # Material Symbols wrapper
    │   ├── FadeIn.jsx          # Scroll-triggered animation
    │   ├── Navbar.jsx          # Sticky navigation
    │   ├── Footer.jsx          # Site footer
    │   ├── Buttons.jsx         # PrimaryButton, OutlineButton, PillButton, etc.
    │   ├── SectionHeading.jsx  # SectionTag, SectionTitle, AccentBar, Badge
    │   ├── HoverCard.jsx       # Lift-on-hover card wrapper
    │   └── NewsletterCTA.jsx   # Reusable newsletter section
    └── pages/
        ├── index.js            # Barrel export
        ├── HomePage.jsx
        ├── AboutPage.jsx
        ├── EventsPage.jsx
        ├── BlogPage.jsx
        └── ContactPage.jsx
```

## Tech Stack

- **React 18** — UI library
- **Vite 6** — Build tool
- **Manrope + Inter** — Typography (Google Fonts)
- **Material Symbols** — Iconography
- **MD3 Design Tokens** — Color system from Google Stitch

## License

© 2026 Recyclers Association of Nigeria
