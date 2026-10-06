# IMD Signal design

## Overview

IMD Signal lets the IdentityMD community scan six curated tweet excerpts, find a topic or author, and keep a local collection. The requested dark-green, AI-armed Pepe theme appears in the locally bundled hero illustration, frog mark, forest surfaces, and lime accents. Expressive artwork sits above a compact feed. The implementation lives in `src/App.tsx`, `src/styles.css`, and `src/data.ts`.

Desktop uses persistent navigation, a two-column tweet grid, and a secondary community rail. Mobile preserves reading order, moves navigation above the page, and places topic discovery after the feed. The dated summary and About dialog explain that this is a static collection.

## Colors

Canonical primitives and semantic properties are in `src/styles.css:5`. Shared components use semantic colors; artwork treatments have local literal colors. This is one dark theme.

| Semantic token | Value | Role |
| --- | --- | --- |
| `--color-bg-page` | `#0c1510` | Main canvas |
| `--color-bg-sidebar` | `#101912` | Sidebar, rail, search, overview |
| `--color-bg-surface` | `#131e17` | Cards and dialog |
| `--color-bg-hover` | `#19271c` | Hover surfaces and icon wells |
| `--color-bg-selected` | `#223426` | Selected navigation, filters, bookmarks |
| `--color-border` | `#223426` | Structural boundaries |
| `--color-control-border` | `#68846c` | Search, select, outlined controls |
| `--color-text-primary` | `#ecf0e7` | Headings and quotes |
| `--color-text-secondary` | `#a3b0a0` | Descriptions and secondary labels |
| `--color-text-muted` | `#91a08d` | Handles, metadata, supporting icons |
| `--color-accent` | `#b9ed78` | Primary fill, brand, selected states |
| `--color-accent-hover` | `#d0fa9e` | Primary hover |
| `--color-on-accent` | `#182611` | Text on the primary fill |
| `--color-focus` | `#d0fa9e` | Focus perimeter |

Primitives are named `forest-950`, `forest-925`, `forest-900`, `forest-850`, `forest-800`, `forest-700`, `forest-500`, `forest-300`, `forest-100`, `lime-300`, and `lime-200`. Forest-700 is reserved and currently unused. Semantic roles, rather than that reserved primitive, describe the visible implementation.

The hero shade uses `#102016` with alpha stops and explicit `in oklab` interpolation. Featured card #01 blends `#1b2c1c` into the surface and has a `#47603a` border. The terminal panel uses `#19291b` and `#354c30`. Avatar classes `.sand`, `.blue`, `.green`, `.mint`, `.purple`, `.olive` provide original person monograms without implying status.

Selected states also have text, underlines, aria-pressed, or filled bookmark icons. Notifications explain the result and stay dismissible. There is no unused warning/error ramp. Measured contrast includes tweet text 14.84:1, secondary card copy 7.57:1, and primary action text 11.67:1. Exact pairs and gradient/image limitations are in `artifacts/validation.md`.

## Typography

The body family is `'Inter Variable', Inter, ui-sans-serif, system-ui, sans-serif`. Its locally bundled normal variable WOFF2 supplies weights 100–900; the site uses about 400–760. `@font-face` in `src/styles.css:1` imports only `inter-latin-wght-normal.woff2` from `@fontsource-variable/inter` and uses `font-display: swap`. Browser checks confirmed the font loaded. No italic Inter is requested.

Command details use `'SFMono-Regular', Consolas, 'Liberation Mono', monospace`. The sand monogram uses italic Georgia; the olive monogram uses Georgia. These system faces and the X symbol may render differently across operating systems.

| Role | Style |
| --- | --- |
| Hero h1 | `--text-display`: clamp(2.25rem, 3.4vw, 3rem); weight 670; line height 1.12; tracking −1.8px |
| Feed h2 | 1.5rem / 24px; weight 630; tracking −0.75px |
| Rail h2 | 13px; weight 550 |
| Tweet quote | 1rem / 16px; weight 450; line height 1.55; tracking −0.2px |
| UI scale | `--text-caption` 12px, `--text-label` 13px, `--text-small` 14px, `--text-body` 16px |
| Card context | 12px; line height 1.65 |
| Search | 13px desktop; 16px at ≤50rem |
| Dialog | h2 27px / 24px mobile; body 14px, detail copy 13px; line height 1.7 |

Hero overrides are 43px at ≤76rem, 38px at ≤60rem, 43px at ≤50rem, 39px at ≤42rem, and 33px at ≤23rem. Summary captions are 11px below 60rem; mobile card metadata is 11–12px. Decorative command ornaments and the tightest navigation use 8–10px as deliberate density exceptions, not body text.

Headings balance; descriptions and quotes wrap prettily. Long author names and handles can break; meaningful post content is never line-clamped. The native search placeholder can clip, but the field retains a visible label. Counters use tabular numerals. Text is selectable, and root font smoothing is applied once.

## Layout

The declared spacing vocabulary is 4, 8, 12, 16, 20, 24, 32, 40px (`--space-1` through `--space-10`). Current rules use matching literal values plus local 7, 18, 22, 26px adjustments; these spacing variables are a vocabulary rather than an automatically enforced engine.

The sidebar is 216px, with a matching main offset. Shell padding is fluid 24–44px; maximum shell width is 1616px. Desktop content is `minmax(0, 1fr) 260px` with a 26px gap. Tweets use two equal columns with a 16px gap and 18–22px internal padding. Cards have no fixed text height; auto margins align metrics and footers.

| Breakpoint | Behavior |
| --- | --- |
| >110rem | Shell centers with a 240px leading inset |
| ≤76rem / 1216px | 190px sidebar; rail moves after feed into three columns |
| ≤60rem / 960px | 176px sidebar; rail becomes two columns; terminal promo hides |
| ≤50rem / 800px | Normal-flow top navigation; main offset removed; 20px margins; short About label; 16px search; 44px card action targets |
| ≤42rem / 672px | Single-column tweets and rail; voices hide; two-column topics; vertically shaded hero with 405px minimum height; header snapshot badge hides, dated summary remains |
| ≤23rem / 368px | 16px page margins, tighter controls, 33px hero heading |

Filters wrap. Text and actions stay inset. Logical properties preserve alignment; navigation can wrap with enlarged text. English LTR is supported. RTL was stress-tested for overflow, but the physically directional hero is not an RTL-localized art treatment.

Rendered layouts were inspected at 1440, 1024, 800, 390, and 320 CSS-pixel widths, without page horizontal overflow. Root font enlargement to 32px was checked; it is not browser-native zoom. Validation records the remaining manual-check limits.

## Elevation & Depth

Most UI is flat, separated by tonal surfaces and structural 1px borders. Floating notifications use `0 8px 35px #0006`; the modal uses `0 20px 100px #0008`. The dialog backdrop is `#030b08cc` with 5px blur. The hero has an inset 1px white-at-10% outline; the terminal mark has a restrained lime glow.

Sidebar z-index is 5, feedback/share panels 10, skip link 20. Native `dialog.showModal()` uses the top layer and makes background interaction inert; the body stops scrolling while open. Hero image and shade sit behind the copy in an isolated stacking context.

## Shapes

`--radius-control` is 7px, `--radius-card` 12px, `--radius-panel` 16px. Chips use 6px, counters 4–5px, avatars and icon wells circles. The hero caption is a small pill. Primary actions keep their radius and margins. Images crop with `object-fit: cover`; important text remains complete.

## Components

| Component / pattern | Reuse and states |
| --- | --- |
| `FrogMark`, `src/App.tsx:15` | Decorative currentColor SVG for brand, terminal, and feed end |
| `TweetCard`, `src/App.tsx:19` | Props: `tweet`, stable collection `rank`, `saved`, `onSave`, `onShare`; quote, editorial context, snapshot metrics, source link; featured gradient, pressed bookmark, hash-target perimeter |
| `.nav-link`, `src/styles.css:56` | Native destinations and About action; active surface, aria-current, enlarged-text wrapping, compact mobile label |
| Button styles | `.primary-button` lime; `.outline-button` bordered; `.text-button` low emphasis; `.icon-button` named action. Hover is gated to hover-capable devices; focus is a 2px ring with 4px offset |
| Search, `src/App.tsx:100` | Native persistent label, case-insensitive query, clear action, Ctrl/Cmd+K; visible focus-within ring |
| Filters and sort | Native aria-pressed toggle buttons and select; topic, search, and saved mode combine; likes/views/approximate-age sorting |
| `.empty-state` | Different recovery copy/actions for no bookmarks and no matches |
| `.notice`, `.share-fallback` | Stable polite status region; dismissible messages. Clipboard denial offers a labeled selectable URL and X search. Storage denial explains that the bookmark lasts for this visit |
| Dialog, `src/App.tsx:118` | Native modal; focus moves in, Tab/Shift+Tab wraps, Escape or close ends it, trigger focus returns; internally scrollable at short heights |
| Rail panels | Topic and author entry points filter and focus the feed; terminal opens About |

The feed is bundled, so it needs no loading spinner or runtime data request. Icons use Lucide outlines and currentColor. Motion is restricted to 150ms named-property transitions and 0.96 press feedback inside `prefers-reduced-motion: no-preference`. Forced colors preserves system focus and selected borders.

## Do’s and Don’ts

- Start content in `.page-shell`; reuse existing surface, typography, spacing, and control roles.
- Keep one lime primary action per task region, and pair selected colors with visible and semantic cues.
- Add posts through the typed `Tweet` structure with real attribution, capture metadata, and a short excerpt. Update the static summary counts/date when the collection changes.
- Keep card text complete and use `minmax(0, 1fr)` grids instead of fixed card widths.
- Add sections with hash navigation, native links, matching headings, and existing cards; this export has no route-rewrite server.
- Use buttons for local actions and links for destinations; name icons and preserve field labels and overlay keyboard support.
- Preserve `base: './'` and local runtime assets. Do not describe this indexed snapshot as live or add invented verification badges.

Design guidance: Jakub Krehel’s Better Interface, MIT, pinned commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`. Documentation method: Paul Bakaus’s Impeccable, Apache-2.0, pinned commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`. Licenses: `artifacts/licenses/better-interface.txt`.
