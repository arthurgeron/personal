# arthurgeron.com

Arthur Geron's consulting site: a single prerendered page built with SolidJS, Rspack and Bun.

## How it works

- `src/components` holds one component per section. `src/constants` holds the copy, `src/styles` one stylesheet per section, `src/utils` the imperative parts (the WebGL2 code rain in `glyphs.ts`, the frame loop, the React 18 render demo).
- `bun run build` bundles the client, then `scripts/prerender.ts` renders the page to static HTML in `dist/index.html` and the client hydrates it. The page reads without JavaScript.
- `src/data/stats.json` is a committed snapshot of the GitHub and npm figures. `bun run stats` refreshes it from the public GitHub profile, the GitHub search API (`GH_TOKEN`) and npm. A source that fails keeps its previous value.
- The deploy workflow runs on every push to `main` and once a day. It refreshes the stats, builds and uploads `dist` over FTP. The workflow only holds the repository's own read-only token, so it sees public work. The merged pull request total that includes private repositories comes from the committed snapshot and never shrinks. To raise it, run `GH_TOKEN=$(gh auth token) bun run stats` locally and commit the result.
- "Download CV" builds an ATS-friendly PDF in the browser with jsPDF from the same constants, with no e-mail address or phone number.

## Development

```bash
bun install
bun run dev      # development server
bun run build    # production build and prerender into dist
bun run stats    # refresh src/data/stats.json, needs GH_TOKEN
bun run check    # Biome lint and format
```

## Accessibility

Keyboard access for every control, a skip link, a "Pause" control that also follows `prefers-reduced-motion`, and a "Contrast" control that also follows `prefers-contrast: more`.

## License

This project is licensed under the MIT License.
