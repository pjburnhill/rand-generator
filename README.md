# rand-generator

Random Something Generator (UUID, etc)

## Front-end setup

This repository is initialized as a Vite + React app.

- Development server: `npm run dev`
- Production build (static output): `npm run build` (emits to `dist/`)

### Base path for GitHub Pages project sites

`vite.config.js` sets:

- `base: '/rand-generator/'`

This ensures asset URLs resolve correctly when hosting under a project path like `https://<user>.github.io/rand-generator/`.

### Custom domain/root hosting

If this app is hosted at a custom domain root (for example, `https://example.com/`), set:

- `base: '/'`
