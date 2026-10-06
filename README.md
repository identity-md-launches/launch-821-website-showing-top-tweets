# IMD Signal

A dark-green community tweet dashboard for IdentityMD, with AI-equipped Pepe artwork, search, topic and author filters, sorting, browser-local bookmarks, share links, and an accessible About dialog.

The feed is a **curated static snapshot captured on 7 October 2026**, containing six attributed public-indexed post excerpts. Rankings and engagement counts are limited to this collection and are not live X analytics. See [feed provenance](artifacts/sources.md) for sources and limitations.

## Install and develop

Use Node.js 22 or newer and npm. This delivery was checked with Node 24.21.0 and npm 11.19.0.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Source is in `src/`; editable runtime artwork and favicon are in `public/`. Dependencies are fixed by `package-lock.json`.

## Rebuild and preview

```sh
npm run typecheck
npm run build
npm run check:export
npm run preview
```

The production build writes `dist/index.html`, a CSS bundle, a JavaScript bundle, the local Inter font, the hero artwork, and favicon. Vite’s `base: './'` makes their URLs relative. Preview serves this finished export. To preview the supplied export without installing anything:

```sh
python3 -m http.server 8080 --directory dist
```

Then open `http://localhost:8080/`. Use HTTP hosting for the ES module export rather than opening `index.html` as a file URL.

## Publish

Upload **all contents of `dist/`** to the static host’s document directory, retaining `assets/`, `pepe-ai.webp`, and `favicon.svg`. The included export is ready to publish; the publisher does not need to rebuild it. Keep source, manifest, lockfile, and `dist/` together in the submission. After a source change, rebuild and replace the whole export so obsolete hashed assets do not accumulate.

The site can be served at a root or subpath, including a gateway path or ENS-hosted directory. Explore, Bookmarks, and shared cards use hash URLs, so no route rewrites are needed. Runtime assets are local. X and source destinations are ordinary outbound links. Publishing was not performed in this assignment.

## Actual validation

The worker installed frontend dependencies in `/tmp/imd-signal-build` to keep the repository’s dependency directories untouched, copied this source/configuration into that directory, ran its ordinary scripts, and copied the finished export back here.

| Check | Actual result |
| --- | --- |
| Production build | `npm run build --prefix /tmp/imd-signal-build`: exit 0, Vite 6.4.1, 1,580 modules transformed; final build 8.43 seconds |
| Typecheck | `npm run typecheck --prefix /tmp/imd-signal-build`: exit 0, `tsc --noEmit` |
| Export integrity | `npm run check:export`: exit 0; three relative HTML asset references resolved; complete local artwork and submission-size checks passed |
| Interaction validation | Browser checks passed for search, no-results recovery, topic and author filters, likes/recent sorting, bookmarks/reload/removal, hash navigation, sharing and clipboard-denial recovery, storage-denial recovery, and dialog keyboard behavior |
| Responsive review | Rendered export inspected at 1440×1000, 1024×900, 800×900, 390×844, and 320×720; no page horizontal overflow at those widths |
| Accessibility scan | axe-core 4.10.3: zero reported violations on desktop and mobile; gradient contrast checks required manual review |
| Resources | Final export had no recorded console errors or failed runtime asset loads under `/preview/` |

The initial build failed on an unsupported font import and was fixed. A later build was interrupted with exit 143; the final source was rebuilt successfully afterward. The final export contains a roughly 220KB JavaScript bundle, 29KB CSS, 48KB WOFF2, and 104KB WebP. The delivery remains below the 8 MiB limit. These are worker-side results, not independent certification.

The consolidated [validation record](artifacts/validation.md) documents all six Better Interface domains, source findings and fixes, measured contrast, commands, screenshots, and remaining limits. [DESIGN.md](DESIGN.md) describes the final implementation. Screenshots: [desktop](artifacts/desktop.webp), [mobile](artifacts/mobile.webp), [mobile feed](artifacts/mobile-feed.webp), [dialog focus](artifacts/dialog-focus.webp).

Manual screen-reader sessions, native browser zoom, physical mobile devices, cross-browser testing, OS clipboard paste/readback, and live X metric verification were not performed. Root font enlargement and forced-colors/reduced-motion emulation were checked separately and do not substitute for those checks.

## Content and assets

Update posts in `src/data.ts`; retain attribution, capture counts and approximate ages, and update the static overview counts/date and provenance notes when the collection changes. Quote excerpts and editorial context are separate. Bookmarks remain in localStorage under `imd-signal-bookmarks`; no account or server is involved. If storage is denied, they last for the current visit.

The final AI artwork is [public/pepe-ai.webp](public/pepe-ai.webp), generated with the built-in imagegen tool. Its exact final prompt and preparation are in [artifacts/image-prompt.md](artifacts/image-prompt.md). Inter, React, and Lucide licenses are retained under `artifacts/licenses/`.

Design guidance follows the supplied Better Interface reference by Jakub Krehel (MIT, commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`), with documentation guidance adapted from Paul Bakaus’s Impeccable (Apache-2.0, commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`). Both license texts are preserved in [artifacts/licenses/better-interface.txt](artifacts/licenses/better-interface.txt).

## Submission hygiene

The explicit `.gitignore` path budget is **512 bytes**; the implemented file is 160 bytes. It excludes dependency/cache directories at every nesting level, generated coverage/build-info, browser scratch logs, and `test/scratch/`. It deliberately includes `dist/`. No dependency archives, registry mirrors, submodules, or repository `node_modules` are required or delivered. The integrity checker rejects dependency/cache directories and symlinks in delivered paths and enforces the 8 MiB limit.
