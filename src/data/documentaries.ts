/**
 * Documentary registry for "Beyond the Silence".
 * To publish the film: put the files in public/media/docs/ and fill in `video`,
 * `captions` and `credits`, then rebuild. Until `video` is set, the theatre shows
 * an honest "in production" state and never simulates playback.
 */
export interface Documentary {
  slug: string; title: string; subtitle: string; runtime: string; status: 'in-production' | 'released';
  kind?: 'airxon' | 'nasa-archive'; date?: string; credit?: string; sourceUrl?: string; videoPoster?: string;
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
    slug: 'opportunity-the-last-signal',
    title: 'Opportunity: The Last Signal',
    subtitle: 'A five-minute cinematic documentary',
    runtime: 'About 5 minutes',
    status: 'in-production',
    description: 'From a rocket launch in 2003 to a final, half-transmitted picture of a fading Sun in 2018: the story of the rover that was built to last 90 days and explored Mars for almost fifteen years.',
    poster: 'opp-shadow',
    video: null,      // e.g. { src: '/media/docs/opportunity-the-last-signal.mp4', type: 'video/mp4' }
    captions: null,   // e.g. { src: '/media/docs/opportunity-the-last-signal.en.vtt', srclang: 'en', label: 'English' }
    outline: [
      { t: 'Part 1', title: 'Two rovers, one question' },
      { t: 'Part 2', title: 'A hole in one at Eagle Crater' },
      { t: 'Part 3', title: 'Reading water in the rocks' },
      { t: 'Part 4', title: 'The storm' },
      { t: 'Part 5', title: 'Listening in the silence' },
    ],
    credits: [],      // published with the film
    sources: [
      { title: "NASA's Record-Setting Opportunity Rover Mission on Mars Comes to End", url: 'https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end/' },
      { title: 'NASA Image and Video Library', url: 'https://images.nasa.gov/' },
    ],
    relatedImages: ['opp-launch', 'opp-berries', 'opp-cape-verde', 'opp-selfie-2007', 'dust-storm-2018', 'opp-last-message'],
  },
];
