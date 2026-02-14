# Copilot / AI assistant instructions — ChimaDev

Purpose
- Help contributors and AI agents be productive quickly in this repo: a small static Tailwind-based single-page site.

Big picture
- Single-page static site: primary files are [index.html](index.html) and [style.css](style.css).
- `style.css` is a compiled/minified Tailwind output (no local build tool checked in). Treat it as a binary/artifact: editing it directly is possible but large — prefer editing source Tailwind if available externally.

Key patterns and examples
- Layout and UI are built with inline Tailwind utility classes inside `index.html`.
  - Example components: hero header (`<section id="hero">`), navbar (header with `#theme-toggle`), and dashboard preview (ids: `dash-time`, `dash-tasks`, `dash-bookings`, `dash-progress`).
- Small interactive hooks are DOM IDs — attach JS by adding a script before `</body>` and target these IDs (e.g., update `#dash-time` textContent).
- External assets referenced in HTML: audio at `https://assets.mixkit.co/...` and various SVGs/icons. Do not assume local asset pipeline.

Developer workflows (what works now)
- No build or test scripts are present. To preview locally:
  - Open `index.html` in a browser, or
  - Run a simple HTTP server from the repo root (recommended):
    ```bash
    python -m http.server 8000
    # or, from PowerShell
    py -m http.server 8000
    ```
- If you need hot reload during development, use the VS Code Live Server extension.

Conventions & decision notes
- Tailwind utilities are used inline in HTML; there is no source Tailwind config in repo. `style.css` appears to be a full, compiled Tailwind bundle — changes here will be large and manual.
- Prefers small, DOM-driven interactions (IDs and minimal JS) rather than a JS framework. Keep additions lightweight and progressive-enhancement friendly.

Integration points
- Visual references to services (Firebase, Claude, Notion, Airtable, Stripe, etc.) appear in the UI as icons/labels inside `index.html`. There are no credential files or SDK configs in this repo — integrations are currently cosmetic.

How AI assistants should operate here (actionable)
- Make minimal, surgical edits: update `index.html` for content/structure and `style.css` only for tiny fixes. Explain when a change would require regenerating Tailwind output.
- When adding JS, append a single file `scripts.js` and include it via `<script src="scripts.js"></script>` before `</body>`; target DOM IDs shown above.
- Use examples from `index.html` to demonstrate changes (link the file in PR descriptions).

Where to look first
- `index.html` — content structure, Tailwind usage, ID hooks.
- `style.css` — compiled Tailwind output; avoid wholesale edits unless replacing with regenerated CSS.

If anything is unclear
- Ask the repo owner whether there is a Tailwind/source CSS project outside this repo (recommended) before attempting to recompile or drastically edit `style.css`.

---
Please review and tell me if you'd like more references to specific lines or examples. 
