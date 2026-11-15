# AIRXON: Echoes Beyond Earth

*Every machine has a story. Every discovery leaves a legacy.*

An interactive educational space museum about the hardware humanity left on the Moon, on Mars and in deep space. Built for the 2026 NASA International Space Apps Challenge, **Abandoned but Not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars**.

> AIRXON is an independent educational project. It is not an official NASA product and is not endorsed by NASA.

## Pages

| Route | What it is |
|---|---|
| `/` | Cinematic gateway: starfield, rendered Mars globe, timed headline, pinned scroll “descent” into Opportunity’s last panorama, featured hardware, status spectrum, sourced statistics, museum halls |
| `/museum/` | Three exhibition halls (Moon, Mars, Deep space) with category filters and a slide-in exhibit placard |
| `/archive/` + `/archive/<slug>/` | Searchable, filterable, sortable hardware archive; full profile for every machine (facts, instruments, achievements, discoveries, timeline, final status, verified location with mini-map, gallery with lightbox, sources) |
| `/stories/opportunity/` | Six-chapter mission story with a sticky mission clock, interactive timeline, dust-storm (tau) explorer, and Opportunity’s last message |
| `/theatre/` | “Beyond the Silence” documentary theatre: plays AIRXON’s AI-generated documentary *Opportunity: The Last Signal* (watermarked, captioned, with chapters and an AI disclosure) and NASA’s archive films about Opportunity |
| `/where/` | Location explorer: zoomable Moon and Mars maps with confirmed vs approximate pins, plus a logarithmic deep-space distance scale |
| `/discoveries/` | Explained science: water on Mars, dust (before/after slider), marsquakes, Phoenix ice, lunar laser ranging (live demo), Pale Blue Dot |
| `/knowledge/` | Articles, facts, searchable glossary, FAQ, learning resources |
| `/about/`, `/credits/` | Vision, team, commitments; every media credit, reference, AI disclosure and branding note |

## Technology choices

- **Astro 7 (static output).** Multi-page, content-first, ships zero JavaScript by default, with small vanilla-TypeScript islands only where interaction is needed. No server or database is required, so it can be hosted anywhere and is fast on slow connections.
- **Typed data files instead of a CMS.** `src/data/hardware.ts` (24 machines) drives the museum, archive, profiles, maps, search and statistics. Adding an entry adds it everywhere at build time. The data shape mirrors NASA services (NSSDCA IDs, image-library IDs), which keeps future live integrations straightforward.
- **GSAP + ScrollTrigger + Lenis.** These power the cinematic homepage only (pinned descent, scrubbed parallax, smooth scrolling), with a full reduced-motion path.
- **One pre-rendered film instead of live 3D.** The hero and the descent share a single scroll-scrubbed video rendered from NASA data, so there is no seam between sections and phones only decode one all-intra MP4. Reduced motion shows still images instead.
- **Search.** A client-side weighted index (name ≫ body text, all terms must match) over embedded JSON. The cards are server-rendered, so content works without JavaScript.
- **Media pipeline.** `scripts/build-media.mjs` (sharp) turns NASA originals into responsive WebP variants with blur-up placeholders, and writes `src/data/media.json` with title, credit, NASA ID, source URL and usage note for every asset.
- **Maps.** Global equirectangular mosaics are assembled from NASA Moon Trek / Mars Trek WMTS tiles. The pins are plain CSS percentages of the real coordinates, with no map library.
- **Testing.** Playwright (desktop and Pixel 7) plus axe-core: every page loads with no console errors or horizontal overflow, a crawl confirms every internal link and image resolves, and all interactive features and WCAG 2.2 AA checks are covered.

## The homepage journey film

The top of the homepage is one continuous, scroll-scrubbed film (hero planet → centred globe → descent to Endeavour Crater → landing → a forward drive over Opportunity's own photo of the plain toward Endeavour's west rim), 300 frames rendered from NASA data:

```bash
python3 scripts/fetch-descent-tiles.py          # unpacks the NASA tiles from assets-src/descent-src-tiles.tar (downloads anything missing)
python3 scripts/render-journey.py frames-l 1280 720
python3 scripts/render-journey.py frames-p 720 1280   # portrait version for phones
```

Encode each folder with every frame as a keyframe (`-g 1`), which makes scrubbing instant, to `public/media/journey/journey-{landscape,portrait}.mp4`, plus a VP9 `.webm` fallback.

## Logo

`assets-src/brand/airxon-logo-original.jpg` is the team's logo. `python3 scripts/build-logo.py` keys its black background to transparency and exports the header, footer and favicon sizes.

## Develop

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # clean-URL build for a normal web host (dist/)
npm run build:portable # flat .html build with relative links (runs from any folder)
npm test               # Playwright + axe (expects a portable build in dist/)
```

`npm run media` regenerates images from `assets-src/`. `python3 scripts/render-globe.py` re-renders the globes.

## Adding content

**A new machine:** add an object to `hardware` in `src/data/hardware.ts`. Every claim needs a `sources` entry. Set `location.precision` honestly: use `confirmed` only when a published coordinate for that exact object or site is cited. Choose `status` from the six defined labels.

**A new image:** add the original to `assets-src/nasa/` (with its metadata in `meta.json`, from the NASA Image Library API). Add a line to `scripts/media-catalog.mjs` with alt text and `kind` (`photo`, `artist-concept`, `simulation`, `map`, `visualization`), then run `npm run media`.

**The documentary:** place the files in `public/media/docs/`, then fill in `video`, `captions` and `credits` in `src/data/documentaries.ts`:

```ts
video: { src: '/media/docs/opportunity-the-last-signal.mp4', type: 'video/mp4', width: 1920, height: 1080 },
captions: { src: '/media/docs/opportunity-the-last-signal.en.vtt', srclang: 'en', label: 'English' },
```

The player turns on automatically, with play/pause, seek, mute, captions toggle, full screen and keyboard shortcuts (space/k, ←/→, f). Until then the page shows an honest “in production” state.

**The documentary video.** *Opportunity: The Last Signal* (Google Flow video, ElevenLabs voice, edited in CapCut). The site uses a 1080p master with a burned-in "AI-GENERATED VIDEO" watermark and AI disclosure metadata, encoded to 720p H.264 (`public/media/docs/opportunity-the-last-signal.mp4`) and 1080p VP9 (`.webm`), each under 20 MB. NASA logos and mission markings that the AI drew in the launch shot (35.9 s to 43.6 s) are blurred out, because SI-generated content must not contain NASA branding. Subtitles (`opportunity-the-last-signal.en.vtt`) were transcribed from the voice-over with Whisper and checked by hand.

**Team members:** edit `src/data/team.ts`.

## AI disclosure

This project was built with AI assistance. **Claude (Anthropic), in Claude Code, wrote most of the code and drafted the text**, under the team's direction and review. The documentary was generated with Google Flow (video) and ElevenLabs (voice), and edited in CapCut. Full details, and where each use is indicated, are in [AI-DISCLOSURE.md](AI-DISCLOSURE.md).

## Content rules

1. NASA and official agency pages are the primary sources; peer-reviewed papers are next. Cite everything.
2. Never invent facts, coordinates, dialogue or media. Quotes are verbatim and attributed.
3. Label non-photographs. Do not present AI-generated imagery as NASA photography. The only AI-generated media is the documentary (see below), which is watermarked and disclosed.
4. A mission ending is not the same as hardware disappearing. Use precise status words.
5. When uncertain, say so on the page.

## Known gaps / to-do before submission

- **Challenge resources:** all 13 links on the challenge's Resources list are cited in the machine profiles and listed on the Credits page (`src/data/challenge.ts`); the list was confirmed by the team from the challenge page.
- Add team member names (`src/data/team.ts`) and the documentary when ready.
- Full stories for Spirit, InSight and others are marked “in research”. Their verified profiles are live.
- Curiosity and Perseverance show landing areas, because both rovers are still driving.
