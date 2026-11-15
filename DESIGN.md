# AIRXON: Design system

Source of truth for the look and behaviour of AIRXON. If the code and this file disagree, this file wins.

## 1. Discovery

| | |
|---|---|
| **Artifact** | Cinematic editorial / museum website (marketing-grade landing + content archive + interactive tools) |
| **Audience** | School-age learners (≈10 to 16), young space enthusiasts, Space Apps judges |
| **Positioning** | Educational, reverent, scientifically precise: not a tech product, not a game |
| **Primary action** | Enter the museum (“Explore the legacy”), then read Opportunity’s story |
| **Adjectives** | cinematic · reverent · curious · precise · hopeful |
| **Essence** | *archival signal light* |
| **Brief constraints** | Palette supplied by the client (navy, cosmic blue, violet, cyan, starlight, copper). Opportunity is the first featured mission. No fabricated media. |

## 2. Aesthetic commitment

**A museum archive at night.** Monumental condensed headlines like gallery wall text, quiet placards under every image, and mission telemetry in a monospace “log” voice. Imagery is authentic NASA photography that runs edge to edge. Colour is mostly deep navy, so the photographs carry the colour.

Candidates considered: (a) mission-control HUD, rejected as cliché and too techy for young readers; (b) editorial serif documentary, rejected because italic-serif heroes are a 2026 AI tell; (c) **museum archive + telemetry**, chosen.

**Signature move: the Signal Line.** A thin cyan telemetry trace that appears where machines “speak”. In the Opportunity story it flatlines on June 10, 2018 and continues as a dotted *listening* line. The story page’s sticky **mission clock** (chapter · sol · date · place, with signal bars that fade in the final chapters) belongs to the same idea.

## 3. Typography

| Role | Family | Why |
|---|---|---|
| Display | **Big Shoulders Display** (variable, 700 to 800) | Condensed, monumental, plaque-like; cinematic when uppercase in the hero |
| Body | **Atkinson Hyperlegible Next** (variable) | Designed for legibility for low-vision readers; ideal for young readers. Distinct letterforms (including the slashed zero) |
| Data | **Atkinson Hyperlegible Mono** (variable) | Telemetry, coordinates, dates. Same family as the body for harmony |

All fonts are self-hosted through Fontsource, with no external requests.

Scale: perfect fourth (1.333), base 17px. Steps: −1 0.8rem · 0 1.0625rem · 1 1.4rem · 2 ≈1.9rem · 3 ≈2.55rem · 4 ≈3.4rem · 5 up to 6.2rem (fluid `clamp`). Display line-height 0.9 to 1.05, `text-wrap: balance`. Body measure ≤ 66ch.

## 4. Colour

| Token | Value | Role |
|---|---|---|
| `--bg` | `#080d1c` Deep Space Navy | page ground (≈60%) |
| `--surface` | `oklch(0.205 0.04 265)` | cards, panels |
| `--surface-2` | `#17233f` Cosmic Blue | selected rows, raised surfaces |
| `--fg` | `#e7eaf2` Starlight | text |
| `--muted` | `oklch(0.76 0.025 265)` | secondary text (≥ 7:1) |
| `--faint` | `oklch(0.6 0.03 265)` | captions/labels (≥ 4.5:1) |
| `--accent` | `#8b7cff` Electric Violet | **interaction only**: primary buttons, active states, range thumbs |
| `--signal` | `#65d9f2` Atmospheric Cyan | data, telemetry, focus rings, the Signal Line |
| `--mars` | `#c47a54` Martian Copper | Mars / Opportunity chapters, “no longer communicating” |
| semantic | success / warning / error in OKLCH | operational status, approximate-location flags |

There are no gradients on text and no violet gradients. Gradients are used only as image scrims, for legibility.

## 5. Tokens & rules

- Spacing base 4px; tight inside groups, `--section` (72 to 160px) between sections.
- Radii: `--r-1` 3px (controls, images), `--r-2` 8px (cards, panels). Nothing larger, except 999px pills for chips.
- Elevation: defined 1px borders plus lighter surfaces. No diffuse drop shadows.
- Motion tokens: `--ease-out` cubic-bezier(.22,1,.36,1); 140 / 220 / 600ms.

## 6. Craft decisions

- **Layout:** a 12-column grid with asymmetric splits (5/6, 7/12), full-bleed photographic bands, a horizontal hardware rail, and a bento “halls” row. Profiles use a sticky quick-facts sidebar; the story uses a sticky chapter rail.
- **Components:** every control has hover, focus-visible, active and disabled states. Status badges always pair a unique glyph with text, so colour is never the only signal. Buttons are ranked: primary (violet fill) › secondary (outline) › ghost (underlined).
- **Motion:** the opening sequence takes about 2.6s and never blocks input. Any scroll, key or tap finishes it instantly. On desktop the pinned descent runs planet zoom → panorama pan; on mobile and with reduced motion it becomes a stacked, swipeable panorama. Reveals use opacity and transform only. Everything respects `prefers-reduced-motion`.
- **Imagery:** authentic NASA photographs. Artist’s concepts, simulations, maps and visualisations carry a visible type tag. The hero planet is a live three.js sphere textured with the NASA Viking MDIM 2.1 mosaic, lit from the side so the day/night line crosses its face. A static orthographic render of the same data (`scripts/render-globe.py`) is the first image and the fallback for reduced motion, Save-Data and no-WebGL.
- **Kicker labels:** used only where they carry data (mission and dates, exhibit counts, series name). Sections let their headings speak.
- **Iconography:** minimal inline SVG, 1.6px strokes, one set.
- **Dark mode:** the site is dark-only by design (night-sky museum). Text is off-white on near-black, never pure white on pure black.
- **Accessibility:** WCAG 2.2 AA. Skip link, a single h1 per page, landmarks, ARIA tabs for the timeline and explorer, focus restoration on dialogs, 44px targets on touch controls, captions-ready player, alt text on every image. axe-core runs in CI (`tests/a11y.spec.ts`).

## 7. Slop audit (Nov 2026)

| Check | Result |
|---|---|
| Inter/Roboto/system as primary | ✅ none |
| Purple gradients / gradient text | ✅ none (violet used flat, for interaction only) |
| Hero + 3 cards + testimonials boilerplate | ✅ avoided: cinematic hero → pinned descent → editorial split → copper feature band → rail → status spectrum → stat ledger → halls → closing |
| Icon-tile feature cards | ✅ none |
| Decorative grid/glow | ✅ graticule lines appear only on maps (structural); the planet’s atmospheric rim is physical, not decorative |
| Stock / AI imagery | ✅ NASA imagery only; labelled concepts/diagrams |
| Pulsing dots on non-live content | ✅ none |
| Full state matrices | ✅ verified in Playwright + axe |
| Reduced motion | ✅ tested |

## Polish pass (v1.1)

Audited with `frontend-design-deslop` (slop checklist), `ui-ux-pro-max` (quick reference), `web3d-integration-patterns` and `threejs-geometry`. Fixed: reflexive kicker labels removed; “Discovery 01 to 06” numbering removed (content isn’t sequential); hero-metric triptych on the Opportunity band replaced by a sentence (the figures already appear in the stats ledger); image zoom on hover removed site-wide; reveal motion reduced to 12px / 700ms and removed from repeated grid items; selected chips no longer change weight (no layout shift); decorative backdrop blur removed from the exhibit panel; prose em dashes rewritten; `touch-action: manipulation` on controls; hero display font preloaded; archive remembers filters on back navigation and offers suggested searches.

## v1.2 changes

- **Logo:** the team's AIRXON badge sits in the header (52px, links home) and the footer (150px), keyed to transparency so the glow blends into the navy. Favicons are derived from it.
- **No dashes:** em and en dashes are removed from all copy, and decorative horizontal rules are gone (label dashes, the brandline rule, list-marker dashes, the dotted listening line, the footer rule). Structural separators in lists and tables stay.
- **Descent:** the homepage scroll scene is now a continuous, scroll-scrubbed frame sequence rendered from NASA data, from orbit to Endeavour Crater, with a live viewing-width readout. It then cross-fades to Opportunity’s last panorama. The hero globe hands off to the sequence’s opening orientation.
- **Navigation:** “Home” is the first item in the primary navigation and in breadcrumbs, and the logo links home.
- **Theatre:** plays real, captioned NASA archive films (MP4 with WebM fallback), with loading and error states.

## Changelog

- **1.3 (Nov 2026)**: hero and descent merged into one continuous film (no seam), gentler panorama zoom, Home returns to the top.
- **1.2 (Nov 2026)**: logo, dash removal, descent sequence, home navigation, working theatre.
- **1.1 (Nov 2026)**: polish pass (see above); 3D globe hero.
- **1.0 (Nov 2026)**: initial system: museum-archive aesthetic, Signal Line signature, Big Shoulders + Atkinson Hyperlegible, client palette mapped to roles.
