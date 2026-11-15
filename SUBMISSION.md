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

## 3. Project details

What it does and how it works
AIRXON is an online museum for the machines humanity has left on the Moon, on Mars and in deep space. It opens in any browser, on a phone or a laptop, with nothing to install and no account needed.

It starts with a short film that plays as you scroll. Made from NASA Mars Trek maps, it carries you from Mars in orbit down to Endeavour Crater and onto the plain where Opportunity drove. From there you can explore:
- Three museum halls (the Moon, Mars and deep space) with 24 machines, from Apollo 11's Eagle and the lunar rovers to Spirit, Opportunity, Ingenuity, Voyager, Dawn and Kepler.
- An archive where every machine has its own page: why it was sent, its instruments, what it found, a timeline, what happened to it, where it is now, and the sources behind every fact.
- Maps of the Moon and Mars you can zoom and drag, showing where each machine rests today, plus a distance scale for the probes still leaving our solar system.
- Opportunity's full story in six chapters, with a mission clock whose signal bars fade as the 2018 dust storm closes in.
- A theatre showing our short documentary, Opportunity: The Last Signal, alongside NASA's own archive films, all with English subtitles.
- Pages on what these machines discovered, a glossary, and answers to common questions.

Benefits
Everything is checked against NASA sources, including all 13 resources listed by the challenge. Photos come from NASA with their official credits, and every location is marked as confirmed or approximate, so visitors know exactly what is known and what isn't. The site is fast, free to use and works on slow connections.

Intended impact
We want young people, roughly 10 to 16, to see that when a mission ends its hardware doesn't vanish. Rovers, landers and probes are still out there, and each one changed what we know. Instead of calling everything "abandoned", AIRXON uses careful words like "left in place", "inactive" and "no longer communicating", which teaches that each machine has its own ending. Because the code is open source, teachers and other teams can reuse it and add new machines.

Tools, languages, hardware and software
We built the site with Astro, TypeScript, JavaScript, HTML and CSS. GSAP with ScrollTrigger and Lenis drive the scrolling effects. Python with NumPy and Pillow rendered the scroll film, Mars globe and maps from NASA mosaic data. We used sharp to prepare the images, ffmpeg to encode the videos, and Playwright with axe for 111 automated tests, including accessibility checks. The site is hosted on GitHub Pages. We used Claude Code as an AI coding assistant, and made the documentary with Google Flow (video), ElevenLabs (voice), Whisper (subtitles) and CapCut (editing). No special hardware was needed, only our own laptops and phones.

How it is creative
AIRXON treats space hardware like museum exhibits, each with a placard, a story and a place it rests today. The opening film is made from real NASA map data rather than stock footage, so the journey to Opportunity's crater is the real landscape. Small details carry the story, like the signal bars that weaken as Opportunity's final chapter approaches.

Factors we considered
Accuracy came first: nothing is invented, every claim is cited, and uncertainty is shown openly. We designed for young readers with clear language and a highly readable font. We made sure every effect also works by touch on phones, tested accessibility, and added a reduced motion mode. We kept the site light so it loads on slow connections. We followed NASA's brand rules by stating clearly that AIRXON is independent and not endorsed by NASA. We also followed the Space Apps AI rules: our documentary carries a visible watermark saying it was made with AI, and its AI voice is noted on the site and in the video file itself.

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
