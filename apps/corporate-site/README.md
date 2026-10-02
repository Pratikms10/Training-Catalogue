# TechnoEdge corporate website

This app is the React and TypeScript conversion of the approved corporate landing page. It is an isolated Vite workspace at `/website/` so its existing visual styles do not affect the catalogue at `/` or the learning studio at `/e-learning/`.

From the repository root:

- `npm run dev` starts the catalogue, API, e-learning app, and this website. Open `http://localhost:3000/website/`.
- `npm run build` writes this app to `dist/website/` after building the catalogue and e-learning app.
- `npm run lint --workspace technoedge-corporate-site` checks this app's TypeScript.

The page markup is in `src/App.tsx`. Scroll, menu, contact, and counter behaviors are in `src/interactions.ts`, with listeners removed on unmount. The original visual rules are in `src/legacy.css`; responsive overrides are in `src/overrides.css`. Tailwind CSS 4 is available through the Vite plugin. Motion animates the hero entrance, and Lucide supplies interface icons.

The enquiry form preserves the approved prototype behavior: it displays a local confirmation but does not send data. Connect it to the destination project's preferred API or CRM before treating it as a live submission form. The media montage currently contains the supplied photos and testimonials; no video files were supplied for this section.
