# AI / Super Intelligence (SI) disclosure

AIRXON was made with the help of generative AI ("Super Intelligence") tools, as allowed by the NASA Space Apps Challenge. This file is the machine-readable and human-readable record of where and how they were used.

| Part of the project | SI tool | How it was used | Where it is indicated |
|---|---|---|---|
| Website code (Astro, TypeScript, CSS, Python build scripts, tests) | Claude (Anthropic), in Claude Code | Wrote most of the code, under the team's direction and review | This file; README; `ai` field in `package.json`; `<meta name="ai-disclosure">` on every page; the website's Credits page |
| Website text and data (facts, timelines, coordinates, captions) | Claude (Anthropic), in Claude Code | Drafted the text and gathered facts from the cited NASA sources; every fact links to its source and was reviewed by the team | Same as above; every claim is cited on its page |
| Documentary video *Opportunity: The Last Signal* | Google Flow | Generated every video shot | A visible "AI-GENERATED VIDEO" watermark in every frame; Theatre and Credits pages; video file metadata |
| Documentary voice-over | ElevenLabs | Generated the narration (AI-generated audio) | Theatre and Credits pages; video file metadata (audio track titled "AI-generated voice-over (ElevenLabs)") |
| Documentary subtitles | Whisper (faster-whisper, small.en) | Speech recognition to transcribe the narration; checked by hand | Theatre page; `NOTE` line in the subtitle file |
| Documentary editing | CapCut | Editing, titles and timing by the team | Theatre and Credits pages |

**Not SI-generated:** the photographs (NASA Image and Video Library), the maps, globes and homepage scroll film (rendered by our own scripts from NASA Trek mosaic data), the vector diagrams, and the AIRXON logo (supplied by the team).

No SI-generated content in this project is intended to use or imitate NASA branding. AIRXON is an independent educational project and is not endorsed by NASA.
