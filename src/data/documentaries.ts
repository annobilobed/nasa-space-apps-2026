/**
 * Documentary registry for "Beyond the Silence".
 * To publish the film: put the files in public/media/docs/ and fill in `video`,
 * `captions` and `credits`, then rebuild. Until `video` is set, the theatre shows
 * an honest "in production" state and never simulates playback.
 */
export interface Documentary {
  slug: string; title: string; subtitle: string; runtime: string; status: 'in-production' | 'released';
  kind?: 'airxon' | 'nasa-archive'; date?: string; credit?: string; sourceUrl?: string; videoPoster?: string;
  /** Required for any film made with generative AI: shown on the page next to the player. */
  ai?: { summary: string; tools: { tool: string; use: string }[]; licence: string[] };
  chapters?: { at: number; title: string }[];
  description: string; poster: string;            // media.json slug
  video: null | { src: string; type: string; width?: number; height?: number };
  captions: null | { src: string; srclang: string; label: string };
  outline: { t: string; title: string }[];        // planned structure
  credits: { role: string; name: string }[];
  sources: { title: string; url: string }[];
  relatedImages: string[];
}

export const archiveFilms: Documentary[] = [
  {
    slug: 'nasa-wet-planet', kind: 'nasa-archive', status: 'released',
    title: 'Opportunity finds rocks formed in water', subtitle: 'NASA video report, March 2004', runtime: '52 seconds',
    date: '2004-03-29', credit: 'NASA / Kennedy Space Center (KSC-04-S-00074)',
    sourceUrl: 'https://images.nasa.gov/details/ksc_032904_wetplanet',
    description: '“It appears that the rocks at Meridiani were not just altered or modified by water, they were formed in water, perhaps a shallow salty sea.” NASA’s report on Opportunity’s evidence of sedimentation at Meridiani Planum, two months after landing.',
    poster: 'opp-berries', videoPoster: '/media/video/ksc_032904_wetplanet-poster.jpg',
    video: { src: '/media/video/ksc_032904_wetplanet.mp4', type: 'video/mp4', width: 320, height: 240 },
    captions: { src: '/media/video/ksc_032904_wetplanet.vtt', srclang: 'en', label: 'English' },
    outline: [], credits: [], sources: [{ title: 'NASA Image and Video Library: ksc_032904_wetplanet', url: 'https://images.nasa.gov/details/ksc_032904_wetplanet' }], relatedImages: [],
  },
  {
    slug: 'nasa-mission-complete', kind: 'nasa-archive', status: 'released',
    title: 'Spirit and Opportunity complete their primary mission', subtitle: 'NASA video report, May 2004', runtime: '67 seconds',
    date: '2004-05-06', credit: 'NASA / Kennedy Space Center (KSC-04-S-00163)',
    sourceUrl: 'https://images.nasa.gov/details/ksc_050604_complete',
    description: 'An “A plus” for both rovers: after finishing their planned 90-day missions, Spirit and Opportunity headed into an extended mission. Nobody knew it would last for years.',
    poster: 'spirit-mcmurdo', videoPoster: '/media/video/ksc_050604_complete-poster.jpg',
    video: { src: '/media/video/ksc_050604_complete.mp4', type: 'video/mp4', width: 320, height: 212 },
    captions: { src: '/media/video/ksc_050604_complete.vtt', srclang: 'en', label: 'English' },
    outline: [], credits: [], sources: [{ title: 'NASA Image and Video Library: ksc_050604_complete', url: 'https://images.nasa.gov/details/ksc_050604_complete' }], relatedImages: [],
  },
];

export const documentaries: Documentary[] = [
  {
    slug: 'opportunity-the-last-signal', kind: 'airxon',
    title: 'Opportunity: The Last Signal',
    subtitle: 'An AIRXON documentary · AI-generated',
    runtime: '2 minutes 45 seconds',
    status: 'released', date: '2026-11',
    credit: 'AIRXON team · AI-generated with Google Flow and ElevenLabs',
    description: 'From a launch in 2003 to the silence after the 2018 dust storm: the story of the rover that was designed for 90 sols and kept working for nearly fifteen years.',
    poster: 'opp-shadow', videoPoster: '/media/docs/opportunity-the-last-signal-poster.jpg',
    video: { src: '/media/docs/opportunity-the-last-signal.mp4', type: 'video/mp4', width: 1280, height: 720 },
    captions: { src: '/media/docs/opportunity-the-last-signal.en.vtt', srclang: 'en', label: 'English' },
    ai: {
      summary: 'This film is AI-generated. Its pictures and its narrator’s voice were made with generative AI tools. It is not NASA footage, and every frame carries a visible “AI-generated video” watermark.',
      tools: [
        { tool: 'Google Flow', use: 'generated every video shot' },
        { tool: 'ElevenLabs', use: 'generated the voice-over (AI-generated audio)' },
        { tool: 'CapCut', use: 'editing, titles and music timing, done by the AIRXON team' },
      ],
      licence: [
        'The landing shot shows a rover being lowered on cables. Opportunity really landed inside a cocoon of airbags that bounced across Meridiani Planum.',
        'Opportunity and its spacecraft are artistic impressions, not exact models. For real photographs, see the Opportunity profile and story.',
        'The “blueberries” (hematite spherules) are shown much larger than life. The real ones are only a few millimetres across.',
      ],
    },
    chapters: [
      { at: 0, title: 'What another world can teach us' },
      { at: 23.7, title: 'Meet Opportunity' },
      { at: 36.1, title: 'Launch and cruise, 2003' },
      { at: 53.7, title: 'Landing on Mars' },
      { at: 63.6, title: 'Exploring Meridiani Planum' },
      { at: 89.4, title: 'Evidence of water' },
      { at: 108.6, title: 'Nearly fifteen years' },
      { at: 121.1, title: 'The 2018 dust storm' },
      { at: 140.2, title: 'The last signal' },
      { at: 149.9, title: 'Legacy' },
    ],
    outline: [],
    credits: [
      { role: 'Made by', name: 'The AIRXON team' },
      { role: 'Video generation', name: 'Google Flow (generative AI)' },
      { role: 'Voice-over', name: 'ElevenLabs (AI-generated voice)' },
      { role: 'Editing', name: 'CapCut' },
      { role: 'Subtitles', name: 'AIRXON, transcribed from the voice-over' },
    ],
    sources: [
      { title: "NASA's Record-Setting Opportunity Rover Mission on Mars Comes to End", url: 'https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end/' },
      { title: 'NASA Image and Video Library', url: 'https://images.nasa.gov/' },
    ],
    relatedImages: ['opp-launch', 'opp-berries', 'opp-cape-verde', 'opp-selfie-2007', 'dust-storm-2018', 'opp-last-message'],
  },
];
