# AIRXON: NASA Space Apps 2026 submission pack

Copy each section into the matching field of the Space Apps project submission form.
Challenge: **Abandoned but Not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars**

> Before submitting: add your team members on the Space Apps form, and open every link below in a private (incognito) browser window to confirm it works without logging in.

---

## 1. Project title

**AIRXON: Echoes Beyond Earth**

## 2. Project summary (186 words)

What we developed: AIRXON is an online museum for the machines we've left behind on the Moon, on Mars and out in deep space. It covers 24 of them, from Apollo 11's Eagle and the lunar rovers to Spirit, Opportunity, Ingenuity, Voyager and Kepler.

How it works: You open it in any browser, on a phone or a laptop. As you scroll, a short film made from NASA Mars Trek maps takes you down from orbit to the plain where Opportunity drove. From there you can wander through the museum halls, look up any machine, find where it rests on maps of the Moon and Mars, read Opportunity's story in six chapters, and watch a short documentary. Every fact, location and photo comes from NASA, including all 13 challenge resources, and we say clearly when a location is only approximate.

Why it matters: A mission ending doesn't mean the hardware is gone. These machines are still out there, and each one taught us something new about other worlds. We wanted young people to meet them as real stories, told accurately, so they're remembered rather than forgotten.

## 3. Project details: what it does, how it works, impact and tools

**What it does**

- **Cinematic homepage:** a single scroll-driven film moves from Mars in orbit, down to Endeavour Crater, and onto the plain where Opportunity drove. It was rendered from NASA Mars Trek mosaic data, and a caption makes clear the ground drive is simulated from a NASA photo.
- **Museum:** three halls (the Moon, Mars, deep space) with category filters and exhibit placards.
- **Hardware archive:** 24 searchable profiles, each with purpose, instruments, achievements, discoveries, a timeline, final status, current location and its sources. The machines range from Apollo 11's Eagle descent stage, the Lunar Roving Vehicles and Surveyor 3, through Sojourner, Spirit, Opportunity, the Vikings, Phoenix, InSight and Ingenuity, to Pioneer 10 and 11, Voyager, Dawn, NEAR Shoemaker and Kepler.
- **Where are they now?:** zoomable Moon and Mars maps built from NASA Trek mosaics, with confirmed and approximate pins clearly distinguished. A logarithmic distance scale covers probes leaving the solar system, and a section covers machines resting at asteroids, at Ceres and in orbit around the Sun.
- **Opportunity's story:** six chapters with a sticky mission clock, an interactive timeline, a dust-storm explorer and Opportunity's last message.
- **Documentary theatre:** *Opportunity: The Last Signal*, an AI-generated documentary by the team (watermarked and disclosed), shown alongside NASA's own archive films. All have English subtitles.
- **Discoveries and Learn:** water on Mars, marsquakes, lunar laser ranging and more, with a glossary and FAQ.
- **Sources & credits:** every image credit and reference, the challenge's resource list showing which profiles cite each link, and a full AI disclosure.

**How it works**

AIRXON is a static website built with Astro. It has no server, database or login, so it is fast, cheap to host and works on slow connections. All content comes from one typed data file, so adding a machine adds it to the museum, archive, maps and search at once. The homepage film is pre-rendered from NASA mosaics by our own Python scripts and scrubbed with GSAP ScrollTrigger as you scroll. Images are processed from NASA originals into responsive WebP files with their official credits.

**Impact**

- **Education:** written for curious learners aged about 10 to 16, using real NASA images and precise language. It teaches that a mission ending is not the same as hardware disappearing.
- **Trust:** every claim is cited, uncertainty is shown, artist's concepts are labelled, and nothing is invented.
- **Access:** works on phones and laptops (every effect has a touch version), uses highly legible fonts, captions all videos, supports keyboard use and reduced motion, and is checked by 111 automated tests, including accessibility checks against WCAG 2.2 AA rules.
- **Open:** the code is open source, so schools and other teams can reuse it and add machines.

**Tools:** Astro, TypeScript, GSAP and ScrollTrigger, Lenis, Python (NumPy, Pillow), sharp, ffmpeg, Playwright and axe-core, GitHub and GitHub Pages. The documentary used Google Flow, ElevenLabs and CapCut (see the AI disclosure).

## 4. Project demonstration link (7-slide presentation)

**https://annobilobed.github.io/nasa-space-apps-2026/submission/airxon-presentation.pdf**

A 7-slide PDF: the challenge, what we built, the storytelling, the NASA data, the impact, and the links with the AI disclosure. Its source is `assets-src/deck/deck.html`; rebuild it with `node scripts/build-deck.mjs`.

## 5. Final project links

- **Working website:** https://annobilobed.github.io/nasa-space-apps-2026/
- **Source code (open source):** https://github.com/annobilobed/nasa-space-apps-2026
- **Documentary (on the website):** https://annobilobed.github.io/nasa-space-apps-2026/theatre.html

## 6. Data and resource citations

**NASA data and resources (official NASA resources used)**

- **NASA Image and Video Library** (https://images.nasa.gov): every photograph and artist's concept on the site, with credits from each asset's official metadata. Also the archive films *Opportunity finds rocks formed in water* (KSC-04-S-00074) and *Spirit and Opportunity complete their primary mission* (KSC-04-S-00163).
- **NASA Mars Trek** (https://trek.nasa.gov/mars/): the Viking MDIM 2.1 global colour mosaic (NASA/JPL/USGS) and the MRO CTX Meridiani Planum mosaic (NASA/JPL/MSSS), used for the Mars map, the Mars globe and the homepage scroll film.
- **NASA Moon Trek** (https://trek.nasa.gov/moon/): the LRO WAC global mosaic (NASA/GSFC/Arizona State University), used for the Moon map and globe.
- **NSSDCA Master Catalog** (https://nssdc.gsfc.nasa.gov/nmc/): launch dates, landing coordinates and end-of-mission details.
- **NASA Science mission pages** (https://science.nasa.gov/): mission facts and status.
- **NASA news releases** (https://www.nasa.gov/), for example the end of the Opportunity, InSight and Dawn missions and the retirement of Kepler.
- **Challenge resources:** all 13 links from the challenge's Resources list are cited in the machine profiles. They're listed with the profiles that cite them at https://annobilobed.github.io/nasa-space-apps-2026/credits.html#challenge

**Space Agency Partner resources:** none used directly. Some NASA image credits include partner institutions, for example MPS/DLR/IDA for Dawn's framing camera.

**Code libraries:** Astro, GSAP (with ScrollTrigger), Lenis, Fontsource fonts (Big Shoulders Display, Atkinson Hyperlegible Next and Mono), sharp, Playwright, axe-core (via @axe-core/playwright), NumPy, Pillow, faster-whisper.

**Third-party tools:** ffmpeg (video encoding), GitHub and GitHub Pages (code hosting and website), Claude Code (AI coding assistant), Google Flow, ElevenLabs and CapCut (documentary).

A full list of every image, credit and reference is on the website: https://annobilobed.github.io/nasa-space-apps-2026/credits.html

## 7. AI / SI disclosure

We used generative AI tools as follows:

1. **Claude (Anthropic), in Claude Code:** a coding and writing assistant. It wrote most of the website's code, drafted the text, and gathered facts from the NASA sources cited on each page. Every fact is linked to a NASA or other cited source, and the AIRXON team reviewed the content.
2. **Google Flow:** generated every video shot in our documentary *Opportunity: The Last Signal*. The video shows a **visible "AI-GENERATED VIDEO" watermark in every frame**, and the Theatre page labels it as AI-generated and lists where its pictures differ from the real mission (for example, Opportunity landed inside airbags, not on a sky crane).
3. **ElevenLabs:** generated the documentary's **voice-over (AI-generated audio)**. This is stated on the website (Theatre and Credits pages) and in the **video file's metadata** (the audio track is titled "AI-generated voice-over (ElevenLabs)", and the file's comment and description name the AI tools).
4. **Whisper (faster-whisper, small.en model):** AI speech recognition, used to transcribe the documentary's English subtitles, which were checked by hand.
5. **CapCut:** used by the team to edit the documentary.

**Not AI-generated:** apart from the documentary, the site uses no AI-generated images. Photographs come from NASA. The diagrams are simple vector drawings written as code. The maps, globes and homepage film are projections of NASA mosaic data made by our own scripts, and are labelled as visualisations. The AIRXON logo was supplied by the team.

AIRXON is an independent educational project. It is not an official NASA product and is not endorsed by NASA.
