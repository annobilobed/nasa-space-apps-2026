/**
 * AIRXON hardware catalogue: the single source of truth for the museum,
 * archive, location explorer and search. Add an entry here and every page,
 * filter, map and index picks it up at build time.
 *
 * Accuracy rules (see CONTENT-GUIDELINES in README):
 *  - every factual claim must be supported by an entry in `sources`;
 *  - `location.precision` must be honest: 'confirmed' only when a published
 *    coordinate for that exact object/site is cited;
 *  - `status` describes what is known now, not a dramatic label.
 */

export type World = 'moon' | 'mars' | 'deep-space';
export type Category = 'rover' | 'lander' | 'lunar-equipment' | 'instrument' | 'spacecraft' | 'helicopter';
export type Status = 'operational' | 'completed' | 'silent' | 'inactive' | 'left-in-place' | 'lost';
export type Precision = 'confirmed' | 'approximate' | 'unknown' | 'not-applicable';

export interface Source { title: string; publisher: string; url: string }
export interface Milestone { date: string; label: string; detail?: string }
export interface Location {
  lat?: number; lon?: number;            // planetocentric degrees, east-positive, −180…180
  precision: Precision;
  label: string;                         // human description of where it is
  note?: string;                         // caveats about the coordinate
  source?: Source;
}
export interface Hardware {
  slug: string; name: string; short: string;
  world: World; category: Category; agency: string;
  mission: string; launch: string; arrival?: string; lastContact?: string; missionEnd?: string;
  era: string;
  status: Status; statusNote: string;
  summary: string; purpose: string;
  instruments: string[]; achievements: string[]; discoveries: string[];
  timeline: Milestone[];
  location: Location;
  significance: string;
  images: string[];                      // media.json slugs, first = hero
  story?: string;                        // link to full mission story
  related: string[];
  sources: Source[];
  featured?: boolean;
}

export const STATUS_LABEL: Record<Status, string> = {
  operational: 'Still operational',
  completed: 'Mission completed',
  silent: 'No longer communicating',
  inactive: 'Inactive',
  'left-in-place': 'Left in place',
  lost: 'Lost or unknown status',
};
export const STATUS_EXPLAIN: Record<Status, string> = {
  operational: 'Still working, or still being used for science today.',
  completed: 'Finished its planned work; the hardware is no longer in active use.',
  silent: 'Stopped responding to Earth. Its mission was later declared over.',
  inactive: 'Shut down or powered off. No longer operating.',
  'left-in-place': 'Deliberately left at its site after use. Never meant to come home.',
  lost: 'Its condition or whereabouts cannot be confirmed.',
};
export const WORLD_LABEL: Record<World, string> = { moon: 'The Moon', mars: 'Mars', 'deep-space': 'Deep space' };
export const CATEGORY_LABEL: Record<Category, string> = {
  rover: 'Rover', lander: 'Lander', 'lunar-equipment': 'Lunar surface equipment',
  instrument: 'Scientific instrument', spacecraft: 'Spacecraft / probe', helicopter: 'Helicopter',
};
export const PRECISION_LABEL: Record<Precision, string> = {
  confirmed: 'Confirmed coordinates', approximate: 'Approximate location',
  unknown: 'Location unknown', 'not-applicable': 'In flight, no surface location',
};

// ── Shared sources ─────────────────────────────────────────────
const nssdc = (id: string, title: string): Source => ({
  title: `${title}, NSSDCA Master Catalog`, publisher: 'NASA Space Science Data Coordinated Archive',
  url: `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${id}`,
});
const sci = (path: string, title: string): Source => ({
  title, publisher: 'NASA Science', url: `https://science.nasa.gov/mission/${path}/`,
});
const OPP_END: Source = {
  title: "NASA's Record-Setting Opportunity Rover Mission on Mars Comes to End (Release 19-004)",
  publisher: 'NASA', url: 'https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end/',
};
const MER = sci('mars-exploration-rovers-spirit-and-opportunity', 'Mars Exploration Rovers: Spirit and Opportunity');
const LRV_FACTS: Source = {
  title: 'The Apollo Lunar Roving Vehicle', publisher: 'NASA Space Science Data Coordinated Archive',
  url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html',
};
const INSIGHT_END: Source = {
  title: 'NASA Retires InSight Mars Lander Mission After Years of Science', publisher: 'NASA',
  url: 'https://www.nasa.gov/press-release/nasa-retires-insight-mars-lander-mission-after-years-of-science',
};
const INSIGHT_LOC: Source = {
  title: 'Golombek et al. (2020), Location and Setting of the Mars InSight Lander, Instruments, and Landing Site, Earth and Space Science',
  publisher: 'AGU / NASA-funded study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7583488',
};
const LLR: Source = {
  title: 'The Apollo Experiment That Keeps on Giving', publisher: 'NASA Jet Propulsion Laboratory',
  url: 'https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/',
};
const LLR_RATE: Source = {
  title: 'Lunar Laser Ranging: Fundamental Physics in Space', publisher: 'NASA Jet Propulsion Laboratory',
  url: 'https://funphysics.jpl.nasa.gov/technical/grp/lunar-laser.html',
};
export const PAYDIRT: Source = {
  title: "Paydirt at 8-Year-Old Mars Rover's 'New Landing Site'", publisher: 'NASA Jet Propulsion Laboratory',
  url: 'https://www.jpl.nasa.gov/news/paydirt-at-8-year-old-mars-rovers-new-landing-site/',
};
export const OPP_END_SRC = OPP_END;
const ENDEAVOUR_W: Source = {
  title: 'HiRISE ESP_056256_1775: Western Endeavour Crater', publisher: 'University of Arizona HiRISE / NASA MRO',
  url: 'https://hirise.lpl.arizona.edu/ESP_056256_1775',
};

export const hardware: Hardware[] = [
  // ════════════════════════════ MARS ════════════════════════════
  {
    slug: 'opportunity', name: 'Opportunity (MER-B)', short: 'Opportunity', featured: true,
    world: 'mars', category: 'rover', agency: 'NASA / JPL',
    mission: 'Mars Exploration Rover mission', launch: '2003-07-07', arrival: '2004-01-25',
    lastContact: '2018-06-10', missionEnd: '2019-02-13', era: '2000s',
    status: 'silent',
    statusNote: 'Last heard from on June 10, 2018, during a planet-wide dust storm. NASA declared the mission complete on February 13, 2019. The rover remains on the western rim of Endeavour Crater in Perseverance Valley.',
    summary: 'A solar-powered geologist built to last 90 Martian days that kept exploring for more than 14 years and drove over 45 kilometres.',
    purpose: 'Search rocks and soils at Meridiani Planum for evidence of past water and of conditions that may once have been favourable for life.',
    instruments: ['Panoramic Camera (Pancam)', 'Miniature Thermal Emission Spectrometer (Mini-TES)', 'Mössbauer Spectrometer', 'Alpha Particle X-Ray Spectrometer (APXS)', 'Microscopic Imager', 'Rock Abrasion Tool (RAT)', 'Magnet arrays', 'Navigation and hazard-avoidance cameras'],
    achievements: [
      'Operated for more than 14 years after a 90-sol design lifetime. NASA says it exceeded its life expectancy 60 times over.',
      'Drove 45.16 km (28.06 miles), the off-world driving record at the time of mission end.',
      'Set a one-day Mars driving record of 220 m (721 ft) on March 20, 2005.',
      'Climbed slopes as steep as 32 degrees, an off-Earth record.',
      'Returned more than 217,000 images, including 15 full-colour 360° panoramas.',
      'Exposed fresh surfaces on 52 rocks and brushed 72 more targets for analysis.',
    ],
    discoveries: [
      'Found hematite, a mineral that forms in water, at its landing site in Eagle Crater.',
      'Found bright veins of a mineral, apparently gypsum, deposited by water near the rim of Endeavour Crater (2011).',
      'Found strong indications at Endeavour Crater of ancient water similar to the drinkable water of a pond or lake on Earth.',
      'Together with Spirit, showed that ancient Mars once had liquid water below and at the surface.',
    ],
    timeline: [
      { date: '2003-07-07', label: 'Launch from Cape Canaveral on a Delta II Heavy', detail: 'Late on July 7 in US Eastern time; July 8 UTC.' },
      { date: '2004-01-25', label: 'Lands in Eagle Crater, Meridiani Planum', detail: 'January 24 in US Pacific time; January 25 UTC.' },
      { date: '2005-03-20', label: 'Drives a record 220 m in one Martian day' },
      { date: '2011', label: 'Reaches Endeavour Crater after about 90 months crossing some 33 km of plains' },
      { date: '2011-11', label: 'Inspects Homestake, a bright vein apparently of gypsum deposited by water' },
      { date: '2015-03-24', label: 'Passes the distance of a marathon' },
      { date: '2018-06-10', label: 'Final communication, sol 5,111' },
      { date: '2019-02-13', label: 'NASA declares the mission complete' },
    ],
    location: {
      lat: -2.3, lon: -5.4, precision: 'approximate',
      label: 'Perseverance Valley, western rim of Endeavour Crater, Meridiani Planum',
      note: 'Plotted on the western rim of Endeavour Crater from orbital image footprints. The landing site (1.946°S, 354.473°E) is confirmed; the exact final position is shown approximately.',
      source: ENDEAVOUR_W,
    },
    significance: 'Opportunity turned a 90-day mission into a 15-year field campaign and delivered definitive evidence that liquid water once shaped Mars. It trained a generation of engineers and scientists and paved the way for Curiosity and Perseverance.',
    images: ['opp-endeavour-view', 'opp-legacy-pan', 'opp-shadow', 'opp-selfie-2007', 'opp-perseverance-tracks', 'opp-last-message'],
    story: '/stories/opportunity/', related: ['spirit', 'curiosity', 'sojourner'],
    sources: [OPP_END, MER, nssdc('2003-032A', 'Opportunity'), PAYDIRT, ENDEAVOUR_W],
  },
  {
    slug: 'spirit', name: 'Spirit (MER-A)', short: 'Spirit', featured: true,
    world: 'mars', category: 'rover', agency: 'NASA / JPL',
    mission: 'Mars Exploration Rover mission', launch: '2003-06-10', arrival: '2004-01-04',
    lastContact: '2010-03-22', missionEnd: '2011-05-25', era: '2000s',
    status: 'silent',
    statusNote: 'Became embedded in soft soil at a site called Troy in 2009. Its last transmission was on March 22, 2010, and NASA concluded recovery efforts in May 2011.',
    summary: "Opportunity's twin, which landed on the other side of Mars in Gusev Crater and explored the Columbia Hills.",
    purpose: 'Study the rocks of Gusev Crater, a possible former lake, for evidence of past water.',
    instruments: ['Panoramic Camera (Pancam)', 'Miniature Thermal Emission Spectrometer (Mini-TES)', 'Mössbauer Spectrometer', 'Alpha Particle X-Ray Spectrometer (APXS)', 'Microscopic Imager', 'Rock Abrasion Tool (RAT)'],
    achievements: ['Operated for more than six years after a 90-sol design lifetime.', 'Drove about 7.7 km (4.8 miles) across Gusev Crater and into the Columbia Hills.'],
    discoveries: ['With Opportunity, showed that ancient Mars was a very different, wetter place than today.'],
    timeline: [
      { date: '2003-06-10', label: 'Launch from Cape Canaveral' },
      { date: '2004-01-04', label: 'Lands in Gusev Crater', detail: 'January 3 in US Pacific time; January 4 UTC.' },
      { date: '2009', label: 'Wheels become embedded in soft soil at Troy' },
      { date: '2010-03-22', label: 'Last transmission received' },
      { date: '2011-05', label: 'Mission concluded' },
    ],
    location: {
      lat: -14.572, lon: 175.478, precision: 'approximate',
      label: 'Gusev Crater, final site "Troy", Columbia Hills',
      note: 'Pin shows the confirmed landing site (14.572°S, 175.478°E). Spirit drove about 7.7 km before stopping at Troy, so its final position is a few kilometres away and is shown approximately.',
      source: nssdc('2003-027A', 'Spirit'),
    },
    significance: "Spirit's long climb into the Columbia Hills showed that even a rover with failing wheels could keep producing science, and its partnership with Opportunity doubled what the mission could learn.",
    images: ['spirit-mcmurdo', 'spirit-selfie'],
    related: ['opportunity', 'sojourner'],
    sources: [MER, nssdc('2003-027A', 'Spirit'), OPP_END],
  },
  {
    slug: 'sojourner', name: 'Sojourner (Mars Pathfinder rover)', short: 'Sojourner', featured: true,
    world: 'mars', category: 'rover', agency: 'NASA / JPL',
    mission: 'Mars Pathfinder', launch: '1996-12-04', arrival: '1997-07-04', lastContact: '1997-09-27', era: '1990s',
    status: 'silent',
    statusNote: "Sojourner communicated with Earth only through the Pathfinder lander. When the lander's final data transmission arrived on September 27, 1997, contact with both ended.",
    summary: 'The first rover ever to drive on Mars: a small pathfinder for every rover that followed.',
    purpose: 'Demonstrate a low-cost way to land on Mars and test a small roving vehicle while studying rocks and soil in Ares Vallis.',
    instruments: ['Alpha Proton X-Ray Spectrometer', 'Front stereo cameras', 'Rear colour camera'],
    achievements: ['First wheeled vehicle to operate on another planet.', 'Studied nearby rocks, including one nicknamed Yogi, alongside the Pathfinder lander.'],
    discoveries: ['Pathfinder returned 2.3 billion bits of information, including more than 16,500 images from the lander and 550 from the rover, plus more than 15 chemical analyses of rocks and soil.'],
    timeline: [
      { date: '1996-12-04', label: 'Launch from Cape Canaveral' },
      { date: '1997-07-04', label: 'Pathfinder lands in Ares Vallis; Sojourner rolls onto Mars' },
      { date: '1997-09-27', label: 'Final data transmission from Pathfinder' },
    ],
    location: {
      lat: 19.33, lon: -33.55, precision: 'approximate',
      label: 'Ares Vallis, beside the Sagan Memorial Station (Pathfinder lander)',
      note: "Coordinate is the Pathfinder lander site from NSSDCA. Sojourner's last position was near the lander but is not precisely known.",
      source: nssdc('1996-068A', 'Mars Pathfinder'),
    },
    significance: 'Sojourner proved a rover could work on Mars. Its 10.6 kg (23 lb) frame is the first step in the size progression shown by Spirit, Opportunity, Curiosity and Perseverance.',
    images: ['sojourner-rock-garden', 'sojourner-yogi', 'rover-generations'],
    related: ['spirit', 'opportunity', 'curiosity'],
    sources: [sci('mars-pathfinder', 'Mars Pathfinder'), nssdc('1996-068A', 'Mars Pathfinder')],
  },
  {
    slug: 'insight', name: 'InSight lander', short: 'InSight', featured: true,
    world: 'mars', category: 'lander', agency: 'NASA / JPL (with CNES, DLR and partners)',
    mission: 'InSight (Interior Exploration using Seismic Investigations, Geodesy and Heat Transport)',
    launch: '2018-05-05', arrival: '2018-11-26', lastContact: '2022-12-15', missionEnd: '2022-12-21', era: '2010s',
    status: 'silent',
    statusNote: 'Dust built up on its solar panels until it could no longer make enough power. Its last transmission was received on December 15, 2022; after two failed attempts to reach it, NASA declared the mission over on December 21, 2022.',
    summary: 'The first mission to listen to the inside of another planet, recording 1,319 marsquakes.',
    purpose: "Study Mars' deep interior (its crust, mantle and core) using a seismometer, a heat probe and radio measurements.",
    instruments: ['SEIS seismometer (CNES)', 'HP³ heat-flow probe, the "mole" (DLR)', 'RISE radio science experiment', 'Weather sensors and magnetometer', 'Instrument Deployment Arm and cameras'],
    achievements: ['Detected 1,319 marsquakes, including quakes caused by meteoroid impacts.', 'Recorded the largest marsquake known, estimated at magnitude 5, in May 2022.'],
    discoveries: ["Its seismic data let scientists measure the layers of Mars' interior; later studies of the data found that the liquid iron core is smaller and denser than previously thought."],
    timeline: [
      { date: '2018-05-05', label: 'Launch from Vandenberg, the first interplanetary launch from the US West Coast' },
      { date: '2018-11-26', label: 'Lands in western Elysium Planitia' },
      { date: '2022-05', label: 'Records a magnitude 5 marsquake' },
      { date: '2022-12-15', label: 'Last transmission received' },
      { date: '2022-12-21', label: 'NASA declares the mission over' },
    ],
    location: {
      lat: 4.5024, lon: 135.6234, precision: 'confirmed',
      label: 'Western Elysium Planitia, near the Martian equator',
      note: 'Located in HiRISE orbital images and published in a peer-reviewed study.',
      source: INSIGHT_LOC,
    },
    significance: 'InSight turned Mars into a planet with a measured interior, giving scientists a second rocky world (after Earth) whose crust, mantle and core can be compared directly.',
    images: ['insight-final-selfie', 'insight-first-selfie'],
    related: ['phoenix', 'viking-1'],
    sources: [sci('insight', 'InSight Lander'), INSIGHT_END, nssdc('2018-042A', 'InSight'), INSIGHT_LOC],
  },
  {
    slug: 'phoenix', name: 'Phoenix Mars Lander', short: 'Phoenix',
    world: 'mars', category: 'lander', agency: 'NASA / JPL / University of Arizona',
    mission: 'Phoenix', launch: '2007-08-04', arrival: '2008-05-25', lastContact: '2008-11-02', era: '2000s',
    status: 'inactive',
    statusNote: 'Phoenix fell silent on November 2, 2008, as the northern winter reduced sunlight on its solar panels. Orbital images taken after later winters show the lander still at its site.',
    summary: 'The farthest-north landing on Mars, which dug into ice just beneath the surface.',
    purpose: 'Study the history of water and ice in the Martian arctic and assess whether the site could ever have been habitable.',
    instruments: ['Robotic arm with scoop', 'Surface Stereo Imager', 'Thermal and Evolved Gas Analyzer (TEGA)', 'Microscopy, Electrochemistry and Conductivity Analyzer (MECA)', 'Meteorological station'],
    achievements: ['First successful stationary soft landing on Mars since Viking 2, about 32 years earlier.', 'Landed farther north than any previous mission.'],
    discoveries: ['Dug into an ice-rich layer near the surface.', 'Discovered perchlorate in the soil, a possible energy source for microbes and a potential resource for human explorers.'],
    timeline: [
      { date: '2007-08-04', label: 'Launch on a Delta II' },
      { date: '2008-05-25', label: 'Lands in Vastitas Borealis' },
      { date: '2008-11-02', label: 'Last signal received' },
    ],
    location: {
      lat: 68.15, lon: -125.9, precision: 'approximate',
      label: 'Vastitas Borealis, northern polar plains',
      note: 'Nominal landing-site coordinate published in the NSSDCA catalogue entry.',
      source: nssdc('2007-034A', 'Phoenix'),
    },
    significance: 'Phoenix touched Martian water ice directly and found chemistry that still shapes how scientists think about life and resources on Mars.',
    images: ['phoenix-composite', 'phoenix-winter'],
    related: ['insight', 'viking-2'],
    sources: [sci('phoenix', 'Mars Phoenix'), nssdc('2007-034A', 'Phoenix')],
  },
  {
    slug: 'viking-1', name: 'Viking 1 Lander', short: 'Viking 1',
    world: 'mars', category: 'lander', agency: 'NASA',
    mission: 'Viking', launch: '1975-08-20', arrival: '1976-07-20', lastContact: '1982-11-11', era: '1970s',
    status: 'silent',
    statusNote: 'Operated until November 1982, when a faulty command sent from Earth interrupted communications. Contact was never restored.',
    summary: 'The first spacecraft to land successfully on Mars and send back pictures from the surface.',
    purpose: 'Photograph the Martian surface, study its atmosphere and soil, and search for signs of life.',
    instruments: ['Two facsimile cameras', 'Biology experiments', 'Gas chromatograph-mass spectrometer', 'X-ray fluorescence spectrometer', 'Seismometer', 'Meteorology package', 'Sampler arm'],
    achievements: ['Returned the first images from the surface of Mars.', 'Renamed the Thomas Mutch Memorial Station in 1982.'],
    discoveries: ['Provided the first direct measurements of Martian soil chemistry and surface weather.'],
    timeline: [
      { date: '1975-08-20', label: 'Launch on a Titan IIIE-Centaur' },
      { date: '1976-07-20', label: 'Lands in western Chryse Planitia' },
      { date: '1982-11-11', label: 'Communications lost after a faulty command' },
    ],
    location: {
      lat: 22.27, lon: -47.95, precision: 'confirmed',
      label: 'Western Chryse Planitia',
      note: 'NSSDCA: 22.27°N, 312.05°E (planetocentric), shown here as 47.95°W.',
      source: nssdc('1975-075C', 'Viking 1 Lander'),
    },
    significance: "Viking 1's first photograph, taken minutes after landing, began the era of exploring Mars from its surface.",
    images: ['viking1-first-color', 'viking1-first-photo', 'mars-hemisphere'],
    related: ['viking-2', 'sojourner'],
    sources: [sci('viking-1', 'Viking 1'), nssdc('1975-075C', 'Viking 1 Lander')],
  },
  {
    slug: 'viking-2', name: 'Viking 2 Lander', short: 'Viking 2',
    world: 'mars', category: 'lander', agency: 'NASA',
    mission: 'Viking', launch: '1975-09-09', arrival: '1976-09-03', missionEnd: '1980-04-11', era: '1970s',
    status: 'inactive',
    statusNote: 'Operated on the surface for 1,281 Mars days and was turned off on April 11, 1980.',
    summary: "Viking 1's twin, which landed far to the north in Utopia Planitia.",
    purpose: 'Repeat the Viking surface investigation at a second, more northerly site.',
    instruments: ['Two facsimile cameras', 'Biology experiments', 'Gas chromatograph-mass spectrometer', 'X-ray fluorescence spectrometer', 'Seismometer', 'Meteorology package'],
    achievements: ['Operated on the surface for 1,281 Mars days.'],
    discoveries: ['Extended Viking surface measurements to the northern plains.'],
    timeline: [
      { date: '1976-09-03', label: 'Lands in Utopia Planitia' },
      { date: '1980-04-11', label: 'Lander turned off' },
    ],
    location: {
      lat: 47.6673, lon: 134.2809, precision: 'confirmed',
      label: 'Utopia Planitia, about 200 km west of the crater Mie',
      source: nssdc('1975-083C', 'Viking 2 Lander'),
    },
    significance: 'Two landers at two sites showed that the Martian surface environment varies from place to place.',
    images: ['mars-hemisphere'],
    related: ['viking-1', 'phoenix'],
    sources: [nssdc('1975-083C', 'Viking 2 Lander')],
  },
  {
    slug: 'curiosity', name: 'Curiosity rover', short: 'Curiosity',
    world: 'mars', category: 'rover', agency: 'NASA / JPL',
    mission: 'Mars Science Laboratory', launch: '2011-11-26', arrival: '2012-08-06', era: '2010s',
    status: 'operational',
    statusNote: 'Still exploring Gale Crater and Mount Sharp. Included in AIRXON for context: not every machine on Mars has gone quiet.',
    summary: 'The largest and most capable rover sent to Mars when it launched, still climbing Mount Sharp.',
    purpose: 'Determine whether Mars was ever able to support microbial life.',
    instruments: ['Mastcam', 'ChemCam laser', 'Sample Analysis at Mars (SAM)', 'CheMin', 'APXS', 'MAHLI hand lens imager', 'Rover Environmental Monitoring Station', 'Drill and robotic arm'],
    achievements: ['Has explored Gale Crater since August 2012.'],
    discoveries: ['Seeks evidence of organics and of rocks that formed in water inside Gale Crater.'],
    timeline: [
      { date: '2011-11-26', label: 'Launch on an Atlas V' },
      { date: '2012-08-06', label: 'Lands in Gale Crater', detail: 'August 5 in US Pacific time; August 6 UTC.' },
    ],
    location: {
      lat: -4.6, lon: 137.4, precision: 'approximate',
      label: 'Gale Crater (landing area). The rover is still driving, so its position keeps changing.',
      note: 'Approximate landing area only; the rover has since driven many kilometres up Mount Sharp.',
      source: sci('msl-curiosity', 'Mars Science Laboratory: Curiosity Rover'),
    },
    significance: "Curiosity carries forward Opportunity's question, “was Mars ever habitable?”, with a full laboratory on wheels.",
    images: ['curiosity-buckskin', 'rover-generations'],
    related: ['perseverance', 'opportunity'],
    sources: [sci('msl-curiosity', 'Mars Science Laboratory: Curiosity Rover'), nssdc('2011-070A', 'Curiosity')],
  },
  {
    slug: 'perseverance', name: 'Perseverance rover', short: 'Perseverance',
    world: 'mars', category: 'rover', agency: 'NASA / JPL',
    mission: 'Mars 2020', launch: '2020-07-30', arrival: '2021-02-18', era: '2020s',
    status: 'operational',
    statusNote: 'Still exploring Jezero Crater and collecting rock samples. Its name echoes the valley where Opportunity rests.',
    summary: 'A rover collecting rock samples in an ancient lake basin, searching for signs of past microbial life.',
    purpose: 'Seek signs of ancient life and collect samples of rock and regolith for possible return to Earth.',
    instruments: ['Mastcam-Z', 'SuperCam', 'PIXL', 'SHERLOC', 'MOXIE', 'MEDA', 'RIMFAX', 'Sample caching system'],
    achievements: ['Delivered the Ingenuity helicopter to Mars.', 'Has driven and sampled across Jezero Crater since 2021.'],
    discoveries: ['In 2024 it found a rock feature that NASA describes as a potential biosignature: a possible, not confirmed, sign of past life.'],
    timeline: [
      { date: '2020-07-30', label: 'Launch on an Atlas V' },
      { date: '2021-02-18', label: 'Lands in Jezero Crater' },
      { date: '2021-04-19', label: 'Ingenuity makes the first powered flight on another planet' },
    ],
    location: {
      lat: 18.4447, lon: 77.4508, precision: 'approximate',
      label: 'Jezero Crater, landing site at Octavia E. Butler Landing. The rover is still driving, so its position keeps changing.',
      note: 'Landing-site coordinate; the rover has since driven many kilometres.',
      source: sci('mars-2020-perseverance', 'Mars 2020: Perseverance Rover'),
    },
    significance: 'Perseverance is assembling the first collection of Martian samples chosen for possible return to Earth, building on what Opportunity and Curiosity learned about water.',
    images: ['perseverance-ingenuity'],
    related: ['ingenuity', 'curiosity'],
    sources: [sci('mars-2020-perseverance', 'Mars 2020: Perseverance Rover'), nssdc('2020-052A', 'Perseverance')],
  },
  {
    slug: 'ingenuity', name: 'Ingenuity Mars Helicopter', short: 'Ingenuity',
    world: 'mars', category: 'helicopter', agency: 'NASA / JPL',
    mission: 'Mars 2020', launch: '2020-07-30', arrival: '2021-02-18', missionEnd: '2024-01-18', era: '2020s',
    status: 'completed',
    statusNote: 'Flew for the last time on January 18, 2024, after damage to its rotor blades ended its ability to fly. It remains in Jezero Crater.',
    summary: 'A technology demonstration planned for up to five flights that completed 72 flights in nearly three years.',
    purpose: 'Demonstrate that powered, controlled flight is possible in the thin Martian atmosphere.',
    instruments: ['Navigation camera', 'Colour camera', 'Solar panel and batteries'],
    achievements: ['First powered, controlled flight on another planet, April 19, 2021.', 'Completed 72 flights over nearly three years.'],
    discoveries: ['Showed that aircraft can scout terrain on Mars for future rovers and explorers.'],
    timeline: [
      { date: '2021-04-19', label: 'First flight' },
      { date: '2024-01-18', label: 'Final flight (flight 72)' },
    ],
    location: {
      precision: 'approximate', lat: 18.4, lon: 77.4,
      label: 'Jezero Crater',
      note: 'Shown at the Jezero Crater landing area. Its exact final resting point is not listed on the sources used here.',
      source: sci('mars-2020-perseverance/ingenuity-mars-helicopter', 'Ingenuity Mars Helicopter'),
    },
    significance: 'Ingenuity opened a new way to explore other worlds: from the air.',
    images: ['ingenuity', 'perseverance-ingenuity'],
    related: ['perseverance'],
    sources: [sci('mars-2020-perseverance/ingenuity-mars-helicopter', 'Ingenuity Mars Helicopter'), nssdc('2020-052A', 'Mars 2020')],
  },

  // ════════════════════════════ MOON ════════════════════════════
  {
    slug: 'apollo-15-lrv', name: 'Lunar Roving Vehicle, Apollo 15 (LRV-1)', short: 'Apollo 15 rover', featured: true,
    world: 'moon', category: 'lunar-equipment', agency: 'NASA',
    mission: 'Apollo 15', launch: '1971-07-26', arrival: '1971-07-30', missionEnd: '1971-08-02', era: '1970s',
    status: 'left-in-place',
    statusNote: 'Deliberately parked and left at Hadley-Apennine when the crew left the Moon in August 1971.',
    summary: 'The first car driven on the Moon, carrying David Scott and James Irwin across the Hadley-Apennine region.',
    purpose: 'Extend the range of astronauts on the lunar surface so they could reach more geological sites.',
    instruments: ['Battery-powered wheel motors', 'Navigation system', 'Television camera and communications relay (mounted)', 'Tool and sample carriers'],
    achievements: ['First crewed vehicle driven on another world.', 'Covered about 27.8 km across three moonwalks.'],
    discoveries: ['Allowed the crew to reach Hadley Rille and the Apennine Front to collect samples.'],
    timeline: [
      { date: '1971-07-26', label: 'Apollo 15 launch' },
      { date: '1971-07-30', label: 'Lunar Module Falcon lands at Hadley-Apennine' },
      { date: '1971-08-02', label: 'Crew departs; the rover stays behind' },
    ],
    location: {
      lat: 26.13239, lon: 3.6333, precision: 'approximate',
      label: 'Hadley-Apennine, Mare Imbrium',
      note: 'Coordinate is the Apollo 15 Lunar Module site, measured from Lunar Reconnaissance Orbiter images. The rover was parked nearby.',
      source: nssdc('1971-063C', 'Apollo 15 Lunar Module'),
    },
    significance: 'The rovers turned short walks into long traverses, multiplying the science each Apollo crew could do.',
    images: ['apollo15-lrv'],
    related: ['apollo-16-lrv', 'apollo-17-lrv'],
    sources: [LRV_FACTS, nssdc('1971-063C', 'Apollo 15 Lunar Module')],
  },
  {
    slug: 'apollo-16-lrv', name: 'Lunar Roving Vehicle, Apollo 16 (LRV-2)', short: 'Apollo 16 rover',
    world: 'moon', category: 'lunar-equipment', agency: 'NASA',
    mission: 'Apollo 16', launch: '1972-04-16', arrival: '1972-04-21', era: '1970s',
    status: 'left-in-place',
    statusNote: 'Left in the Descartes highlands at the end of Apollo 16 in April 1972.',
    summary: 'Carried John Young and Charles Duke across the Descartes highlands.',
    purpose: 'Carry astronauts and equipment to distant sampling stations in the lunar highlands.',
    instruments: ['Battery-powered wheel motors', 'Navigation system', 'Television camera and communications relay (mounted)'],
    achievements: ['Covered about 26.7 km across three moonwalks.'],
    discoveries: ['Allowed sampling of the highlands, the first Apollo landing in the lunar highlands.'],
    timeline: [{ date: '1972-04-21', label: 'Lunar Module Orion lands in the Descartes highlands' }],
    location: {
      lat: -8.973, lon: 15.5002, precision: 'approximate',
      label: 'Descartes highlands, just north of the crater Dolland',
      note: 'Coordinate is the Apollo 16 Lunar Module site from NSSDCA. The rover was parked nearby.',
      source: nssdc('1972-031C', 'Apollo 16 Lunar Module'),
    },
    significance: 'Gave the crew the reach to sample very different highland terrain on one mission.',
    images: ['apollo16-lrv'],
    related: ['apollo-15-lrv', 'apollo-17-lrv'],
    sources: [LRV_FACTS, nssdc('1972-031C', 'Apollo 16 Lunar Module'), nssdc('1971-063C', 'Lunar Roving Vehicle background (Apollo 15 Lunar Module record)')],
  },
  {
    slug: 'apollo-17-lrv', name: 'Lunar Roving Vehicle, Apollo 17 (LRV-3)', short: 'Apollo 17 rover',
    world: 'moon', category: 'lunar-equipment', agency: 'NASA',
    mission: 'Apollo 17', launch: '1972-12-07', arrival: '1972-12-11', era: '1970s',
    status: 'left-in-place',
    statusNote: 'Left in the Taurus-Littrow valley in December 1972. It is the last human-driven vehicle on the Moon.',
    summary: 'Carried Eugene Cernan and Harrison Schmitt on the final Apollo moonwalks.',
    purpose: 'Carry astronauts to sampling stations across the Taurus-Littrow valley.',
    instruments: ['Battery-powered wheel motors', 'Navigation system', 'Television camera and communications relay (mounted)'],
    achievements: ['Covered about 35.9 km, the longest of the three lunar rover traverses.'],
    discoveries: ['Supported the collection of samples from the valley floor and surrounding massifs.'],
    timeline: [{ date: '1972-12-11', label: 'Lunar Module Challenger lands at Taurus-Littrow' }],
    location: {
      lat: 20.1911, lon: 30.7723, precision: 'approximate',
      label: 'Taurus-Littrow valley',
      note: 'Coordinate is the Apollo 17 Lunar Module site from NSSDCA. The rover was parked nearby.',
      source: nssdc('1972-096C', 'Apollo 17 Lunar Module'),
    },
    significance: "The last vehicle humans drove on another world. It's still parked where the final Apollo crew left it.",
    images: ['apollo17-lrv', 'apollo17-alsep'],
    related: ['apollo-17-alsep', 'apollo-15-lrv'],
    sources: [LRV_FACTS, nssdc('1972-096C', 'Apollo 17 Lunar Module'), nssdc('1971-063C', 'Lunar Roving Vehicle background (Apollo 15 Lunar Module record)')],
  },
  {
    slug: 'apollo-17-alsep', name: 'Apollo 17 Lunar Surface Experiments Package (ALSEP)', short: 'Apollo 17 ALSEP',
    world: 'moon', category: 'instrument', agency: 'NASA',
    mission: 'Apollo 17', launch: '1972-12-07', arrival: '1972-12-11', missionEnd: '1977-09-30', era: '1970s',
    status: 'inactive',
    statusNote: 'Shut down on September 30, 1977, along with the other Apollo surface experiment stations. The equipment remains at Taurus-Littrow.',
    summary: 'A nuclear-powered science station that kept sending data from the Moon for almost five years after the astronauts left.',
    purpose: 'Measure the Moon’s heat flow, gravity, surface environment and ejecta long after the crew departed.',
    instruments: ['Heat Flow Experiment', 'Lunar Surface Gravimeter', 'Lunar Atmospheric Composition Experiment', 'Lunar Ejecta and Meteorites experiment', 'Lunar Seismic Profiling experiment', 'Central station with radioisotope generator'],
    achievements: ['Returned data from December 1972 until September 1977.'],
    discoveries: ['Contributed to measurements of the Moon’s thermal and surface environment.'],
    timeline: [
      { date: '1972-12-12', label: 'Central station switched on' },
      { date: '1977-09-30', label: 'All Apollo surface stations shut down' },
    ],
    location: {
      lat: 20.1921, lon: 30.7649, precision: 'confirmed',
      label: 'Taurus-Littrow valley, west of the Lunar Module site',
      note: 'NSSDCA lists the central station at 20.1921°N, 30.7649°E.',
      source: nssdc('1972-096C', 'Apollo 17 Lunar Module'),
    },
    significance: 'ALSEP stations let scientists keep doing experiments on the Moon long after the astronauts had gone home.',
    images: ['apollo17-alsep'],
    related: ['apollo-17-lrv', 'apollo-11-lrrr'],
    sources: [nssdc('1972-096C', 'Apollo 17 Lunar Module'), nssdc('1969-099C', 'ALSEP background (Apollo 12 Lunar Module record)')],
  },
  {
    slug: 'surveyor-3', name: 'Surveyor 3', short: 'Surveyor 3', featured: true,
    world: 'moon', category: 'lander', agency: 'NASA / JPL',
    mission: 'Surveyor program', launch: '1967-04-17', arrival: '1967-04-20', lastContact: '1967-05-04', era: '1960s',
    status: 'left-in-place',
    statusNote: 'Last contact was on May 4, 1967. In November 1969, Apollo 12 landed within about 180 m, and the crew removed parts, including its camera, and brought them back to Earth. The rest of the spacecraft remains on the Moon.',
    summary: 'A robotic lander that tested the lunar surface for Apollo, and was later visited by astronauts.',
    purpose: 'Develop and validate soft-landing technology and show the lunar surface could support a crewed landing.',
    instruments: ['Television camera', 'Surface sampler (scoop) on an extendable arm'],
    achievements: ['First Surveyor to carry a surface sampler; dug trenches up to 18 cm deep.', 'Returned 6,326 pictures.', 'The only robotic spacecraft on another world to be visited by humans.'],
    discoveries: ['Its sampling tests showed the lunar surface was solid enough to support an Apollo Lunar Module.'],
    timeline: [
      { date: '1967-04-17', label: 'Launch from Cape Canaveral' },
      { date: '1967-04-20', label: 'Lands in Oceanus Procellarum' },
      { date: '1967-05-04', label: 'Last contact' },
      { date: '1969-11-19', label: 'Apollo 12 lands about 180 m away; the crew later retrieves parts' },
    ],
    location: {
      lat: -3.0162, lon: -23.418, precision: 'confirmed',
      label: 'Oceanus Procellarum, beside the Apollo 12 landing site',
      note: 'NSSDCA: 3.0162°S, 336.582°E, shown here as 23.418°W.',
      source: nssdc('1967-035A', 'Surveyor 3'),
    },
    significance: 'Surveyor 3 connects the robotic and human eras of lunar exploration. Pieces of it flew home on Apollo 12 and were studied to learn how materials age on the Moon.',
    images: ['surveyor3-bean', 'surveyor3-crater'],
    related: ['apollo-11-lrrr', 'apollo-15-lrv'],
    sources: [sci('surveyor-3', 'Surveyor 3'), nssdc('1967-035A', 'Surveyor 3'), nssdc('1969-099C', 'Apollo 12 Lunar Module')],
  },
  {
    slug: 'apollo-11-lrrr', name: 'Apollo 11 Laser Ranging Retroreflector', short: 'Apollo 11 retroreflector', featured: true,
    world: 'moon', category: 'instrument', agency: 'NASA',
    mission: 'Apollo 11: Early Apollo Scientific Experiments Package (EASEP)', launch: '1969-07-16', arrival: '1969-07-20', era: '1960s',
    status: 'operational',
    statusNote: 'A passive mirror array that needs no power. Scientists still bounce lasers off it to measure the Earth-Moon distance. The seismometer deployed beside it no longer operates.',
    summary: 'An array of 100 mirrors, set up by Buzz Aldrin, that still returns laser pulses fired from Earth.',
    purpose: 'Reflect laser pulses from Earth back to their source so the round-trip time gives the precise distance to the Moon.',
    instruments: ['Array of 100 corner-cube reflectors (passive, no power required)'],
    achievements: ['Still in use for lunar laser ranging, more than five decades after it was placed.'],
    discoveries: ['Laser ranging shows the Moon is moving away from Earth by about 3.8 cm (1.5 in) a year.', 'Provides strong evidence that the Moon has a fluid core.'],
    timeline: [
      { date: '1969-07-20', label: 'Apollo 11 lands at Tranquility Base' },
      { date: '1969-07-21', label: 'Retroreflector and seismometer deployed during the moonwalk' },
    ],
    location: {
      lat: 0.67416, lon: 23.47314, precision: 'approximate',
      label: 'Tranquility Base, Mare Tranquillitatis',
      note: 'Coordinate is the Apollo 11 Lunar Module site from Lunar Reconnaissance Orbiter images (NSSDCA). The retroreflector was placed a short walk from the Lunar Module.',
      source: nssdc('1969-059C', 'Apollo 11 Lunar Module'),
    },
    significance: 'Proof that "abandoned" is the wrong word for much of what humanity left behind: this small instrument is still doing science.',
    images: ['apollo11-easep', 'apollo11-pse', 'moon-full'],
    related: ['apollo-11-eagle', 'apollo-17-alsep'],
    sources: [LLR, LLR_RATE, nssdc('1969-059C', 'Apollo 11 Lunar Module')],
  },
  {
    slug: 'apollo-11-eagle', name: 'Apollo 11 Lunar Module "Eagle" descent stage', short: 'Eagle descent stage',
    world: 'moon', category: 'lunar-equipment', agency: 'NASA',
    mission: 'Apollo 11', launch: '1969-07-16', arrival: '1969-07-20', era: '1960s',
    status: 'left-in-place',
    statusNote: "The descent stage served as the launch pad for the ascent stage and was left at Tranquility Base on July 21, 1969.",
    summary: 'The lower half of the first crewed spacecraft to land on another world.',
    purpose: 'Land two astronauts on the Moon and act as the launch platform for their return to lunar orbit.',
    instruments: ['Descent engine', 'Landing legs and footpads', 'Equipment bays for surface experiments'],
    achievements: ['Landed at 20:17:40 UT on July 20, 1969: the first crewed landing on another world.'],
    discoveries: ['Enabled the first human collection of lunar samples: about 47 pounds (21 kg) of lunar material.'],
    timeline: [
      { date: '1969-07-20', label: 'Lands in Mare Tranquillitatis' },
      { date: '1969-07-21', label: 'Ascent stage lifts off; descent stage remains' },
    ],
    location: {
      lat: 0.67416, lon: 23.47314, precision: 'confirmed',
      label: 'Tranquility Base, Mare Tranquillitatis',
      note: 'Measured from Lunar Reconnaissance Orbiter images (NSSDCA).',
      source: nssdc('1969-059C', 'Apollo 11 Lunar Module'),
    },
    significance: 'The base of the first human footsteps on another world, still standing where it landed.',
    images: ['apollo11-easep', 'apollo11-pse'],
    related: ['apollo-11-lrrr', 'surveyor-3'],
    sources: [nssdc('1969-059C', 'Apollo 11 Lunar Module')],
  },

  // ═════════════════════════ DEEP SPACE ═════════════════════════
  {
    slug: 'voyager-1', name: 'Voyager 1', short: 'Voyager 1', featured: true,
    world: 'deep-space', category: 'spacecraft', agency: 'NASA / JPL',
    mission: 'Voyager Interstellar Mission', launch: '1977-09-05', era: '1970s',
    status: 'operational',
    statusNote: 'Still communicating from interstellar space, with some instruments switched off to save power. NASA expects it to reach one light-day from Earth in November 2026.',
    summary: "Humanity's most distant spacecraft, which crossed into interstellar space in 2012.",
    purpose: 'Fly past Jupiter and Saturn, then study the outer heliosphere and interstellar space.',
    instruments: ['Magnetometer', 'Plasma wave subsystem', 'Cosmic ray subsystem', 'Low-energy charged particle instrument', 'Imaging science (now off)', 'Golden Record'],
    achievements: ['Crossed the boundary into interstellar space in 2012.', 'Became the most distant human-made object from the Sun in February 1998.'],
    discoveries: ['Took the 1990 "Pale Blue Dot" image of Earth as part of the Family Portrait of the Solar System.'],
    timeline: [
      { date: '1977-09-05', label: 'Launch' },
      { date: '1990-02-14', label: 'Takes the Family Portrait, including the Pale Blue Dot' },
      { date: '1998-02-17', label: 'Becomes the most distant human-made object' },
      { date: '2012-08-25', label: 'Enters interstellar space' },
      { date: '2026-11', label: 'Expected to reach one light-day from Earth' },
    ],
    location: { precision: 'not-applicable', label: 'Interstellar space, more than 16 billion miles from Earth' },
    significance: 'Proof that a machine can keep its mission alive for nearly half a century and carry a message from Earth farther than anything else humans have built.',
    images: ['voyager-artist', 'pale-blue-dot-revisited', 'golden-record'],
    related: ['voyager-2', 'pioneer-10'],
    sources: [sci('voyager', 'Voyager'), nssdc('1977-084A', 'Voyager 1')],
  },
  {
    slug: 'voyager-2', name: 'Voyager 2', short: 'Voyager 2',
    world: 'deep-space', category: 'spacecraft', agency: 'NASA / JPL',
    mission: 'Voyager Interstellar Mission', launch: '1977-08-20', era: '1970s',
    status: 'operational',
    statusNote: 'Still communicating from interstellar space, which it reached in 2018.',
    summary: 'The only spacecraft to have visited all four giant planets.',
    purpose: 'Fly past the outer planets, then study the outer heliosphere and interstellar space.',
    instruments: ['Magnetometer', 'Plasma science', 'Cosmic ray subsystem', 'Plasma wave subsystem', 'Golden Record'],
    achievements: ['Reached interstellar space in 2018.'],
    discoveries: ['Its flybys returned the first close-up views of Uranus and Neptune.'],
    timeline: [{ date: '1977-08-20', label: 'Launch' }, { date: '2018-11-05', label: 'Enters interstellar space' }],
    location: { precision: 'not-applicable', label: 'Interstellar space, travelling in a different direction from Voyager 1' },
    significance: "A grand tour of the outer planets that hasn't been repeated.",
    images: ['voyager-artist', 'golden-record'],
    related: ['voyager-1', 'pioneer-10'],
    sources: [sci('voyager', 'Voyager'), nssdc('1977-076A', 'Voyager 2')],
  },
  {
    slug: 'pioneer-10', name: 'Pioneer 10', short: 'Pioneer 10',
    world: 'deep-space', category: 'spacecraft', agency: 'NASA / Ames',
    mission: 'Pioneer 10', launch: '1972-03-03', lastContact: '2003-01-23', era: '1970s',
    status: 'silent',
    statusNote: 'Its signal was last detected on January 23, 2003. No signal was found in a final attempt in February 2003. It continues to coast out of the solar system.',
    summary: 'The first spacecraft to fly past Jupiter and the first set on a path out of the solar system.',
    purpose: 'Fly through the asteroid belt and make the first close-up study of Jupiter.',
    instruments: ['Imaging photopolarimeter', 'Helium vector magnetometer', 'Infrared radiometer', 'Geiger Tube Telescope', 'Plaque engraved with a message from Earth'],
    achievements: ['First spacecraft placed on a trajectory to escape the solar system.', 'Designed for a 21-month mission; tracked for more than 30 years.'],
    discoveries: ['Returned the first close-up observations of Jupiter.'],
    timeline: [
      { date: '1972-03-03', label: 'Launch (March 2 local time)' },
      { date: '2002-04-27', label: 'Last successful data acquisition' },
      { date: '2003-01-23', label: 'Last signal detected' },
    ],
    location: { precision: 'not-applicable', label: 'Leaving the solar system; last tracked about 7.6 billion miles from Earth' },
    significance: 'Pioneer 10 showed that spacecraft could survive the asteroid belt and Jupiter’s radiation, opening the outer solar system to exploration.',
    images: ['pioneer10-plaque'],
    related: ['pioneer-11', 'voyager-1', 'voyager-2'],
    sources: [sci('pioneer-10', 'Pioneer 10'), nssdc('1972-012A', 'Pioneer 10')],
  },
  {
    slug: 'pioneer-11', name: 'Pioneer 11', short: 'Pioneer 11',
    world: 'deep-space', category: 'spacecraft', agency: 'NASA / Ames',
    mission: 'Pioneer 11', launch: '1973-04-06', lastContact: '1995-09-30', era: '1970s',
    status: 'silent',
    statusNote: 'NASA’s Ames Research Center made last contact on September 30, 1995, when its nuclear power supply could no longer run any experiments. Scientists received its last engineering data on November 24, 1995. It is coasting out of the solar system.',
    summary: 'Pioneer 10’s twin, and the first spacecraft to fly past Saturn.',
    purpose: 'Follow Pioneer 10 to Jupiter, then use Jupiter’s gravity to swing across the solar system to Saturn.',
    instruments: ['Imaging photopolarimeter', 'Magnetometers (including an extra low-sensitivity fluxgate magnetometer)', 'Plasma analyzer for the solar wind', 'Charged-particle and cosmic-ray detectors', 'Ultraviolet photometer and infrared radiometer', 'Plaque engraved with a message from Earth'],
    achievements: [
      'First spacecraft to fly past Saturn, on September 1, 1979, about 21,000 km from the planet.',
      'Passed about 42,500 km from Jupiter’s cloud tops on December 3, 1974, three times closer than Pioneer 10.',
      'Returned the first pictures of Jupiter’s polar regions.',
    ],
    discoveries: [
      'Discovered Saturn’s narrow F ring, just outside the A ring, and a new moon about 200 km across.',
      'Gave the first conclusive evidence that Saturn has a magnetic field.',
    ],
    timeline: [
      { date: '1973-04-06', label: 'Launch (April 5 local time)' },
      { date: '1974-12-03', label: 'Closest approach to Jupiter' },
      { date: '1979-09-01', label: 'Saturn flyby: first spacecraft at Saturn' },
      { date: '1990-02-23', label: 'Crossed the orbit of Neptune' },
      { date: '1995-09-30', label: 'Last contact made by NASA Ames' },
      { date: '1995-11-24', label: 'Last engineering data received' },
    ],
    location: { precision: 'not-applicable', label: 'Leaving the solar system toward the constellation Sagittarius; about 44.7 AU from the Sun at the end of 1995', note: 'Distance at the end of 1995 from the NSSDCA Master Catalog. It has kept moving outward since.' },
    significance: 'Pioneer 11 made the first visit to Saturn, discovering a new ring and a new moon, and then headed out of the solar system in the opposite direction from its twin.',
    images: ['pioneer11-saturn-painting', 'pioneer11-launch'],
    related: ['pioneer-10', 'voyager-1', 'voyager-2'],
    sources: [sci('pioneer-11', 'Pioneer 11'), nssdc('1973-019A', 'Pioneer 11')],
  },
  {
    slug: 'dawn', name: 'Dawn', short: 'Dawn',
    world: 'deep-space', category: 'spacecraft', agency: 'NASA / JPL',
    mission: 'Dawn', launch: '2007-09-27', arrival: '2015-03-06', missionEnd: '2018-11-01', era: '2000s',
    status: 'silent',
    statusNote: 'Dawn missed its scheduled contacts with Earth on October 31 and November 1, 2018. NASA concluded it had run out of hydrazine, the fuel that kept its antennas pointed at Earth and its solar panels at the Sun. It is still orbiting Ceres, where NASA expects it to remain for decades.',
    summary: 'The first spacecraft to orbit two different worlds beyond Earth: the giant asteroid Vesta and the dwarf planet Ceres.',
    purpose: 'Orbit Vesta and then Ceres, the two largest bodies in the main asteroid belt, to learn how planets formed in the solar system’s earliest days.',
    instruments: ['Framing cameras', 'Visible and infrared mapping spectrometer', 'Gamma ray and neutron detector', 'Ion engines powered by solar panels 19.7 m from tip to tip'],
    achievements: [
      'First spacecraft to orbit a body in the main asteroid belt (Vesta, 2011).',
      'First mission to visit a dwarf planet (Ceres, 2015) and to orbit two destinations beyond Earth.',
      'Travelled about 6.9 billion km using ion propulsion.',
    ],
    discoveries: [
      'Revealed that the mysterious bright spots in Ceres’ Occator Crater are evaporite deposits: salts left behind when salty water evaporated.',
      'Reinforced the idea that dwarf planets like Ceres could have hosted oceans for a large part of their history.',
    ],
    timeline: [
      { date: '2007-09-27', label: 'Launch from Cape Canaveral' },
      { date: '2009-02-18', label: 'Mars flyby and gravity assist' },
      { date: '2011-07-16', label: 'Arrives at Vesta' },
      { date: '2012-09-05', label: 'Departs Vesta' },
      { date: '2015-03-06', label: 'Enters orbit around Ceres' },
      { date: '2018-11-01', label: 'NASA announces the end of the mission after missed contacts on October 31 and November 1' },
    ],
    location: { precision: 'not-applicable', label: 'In a stable orbit around the dwarf planet Ceres, in the main asteroid belt', note: 'NASA expects the orbit to last for at least 20 years, with more than 99 percent confidence that it will last at least 50 years.' },
    significance: 'Dawn compared two planet-like worlds that grew up very differently, and showed how much where something formed shaped what it became.',
    images: ['dawn-ceres-artist', 'dawn-occator-ahuna'],
    related: ['near-shoemaker', 'kepler'],
    sources: [sci('dawn', 'Dawn'), nssdc('2007-043A', 'Dawn'),
      { title: 'NASA’s Dawn Mission to Asteroid Belt Comes to End', publisher: 'NASA', url: 'https://www.nasa.gov/news-release/nasas-dawn-mission-to-asteroid-belt-comes-to-end/' },
      { title: 'Occator and Ahuna (PIA11240)', publisher: 'NASA Image and Video Library', url: 'https://images.nasa.gov/details/PIA11240' }],
  },
  {
    slug: 'near-shoemaker', name: 'NEAR Shoemaker', short: 'NEAR Shoemaker',
    world: 'deep-space', category: 'spacecraft', agency: 'NASA / Johns Hopkins APL',
    mission: 'Near Earth Asteroid Rendezvous (NEAR) Shoemaker', launch: '1996-02-17', arrival: '2000-02-14', lastContact: '2001-02-28', era: '1990s',
    status: 'silent',
    statusNote: 'After touching down on Eros, NEAR kept working until its last contact on February 28, 2001; NASA says it succumbed to the extreme cold. An attempt to contact it on December 10, 2002 was unsuccessful.',
    summary: 'The first spacecraft to orbit an asteroid and the first to land on one. It still rests on the surface of 433 Eros.',
    purpose: 'Orbit the near-Earth asteroid 433 Eros for about a year and study its size, shape, minerals, gravity and magnetism.',
    instruments: ['Multispectral imager', 'Near-infrared spectrograph', 'X-ray and gamma-ray spectrometer', 'Laser rangefinder', 'Magnetometer'],
    achievements: [
      'First human-made object to orbit an asteroid (February 14, 2000).',
      'First spacecraft to land on an asteroid (February 12, 2001), even though it was not designed as a lander.',
      'First spacecraft to rely on solar cells for power beyond the orbit of Mars.',
      'Flew past the asteroid 253 Mathilde on June 27, 1997.',
    ],
    discoveries: [
      'Mapped Eros, a rocky asteroid about 13 × 13 × 33 km, from as close as a few kilometres.',
      'Its gamma-ray spectrometer kept collecting data from the surface for about two weeks after landing.',
    ],
    timeline: [
      { date: '1996-02-17', label: 'Launch: first mission of NASA’s Discovery program' },
      { date: '1997-06-27', label: 'Flyby of asteroid Mathilde' },
      { date: '1998-12-23', label: 'Unplanned flyby of Eros after an aborted engine burn' },
      { date: '2000-02-14', label: 'Enters orbit around Eros' },
      { date: '2001-02-12', label: 'Touches down in the saddle region of Eros' },
      { date: '2001-02-28', label: 'Last contact' },
    ],
    location: { precision: 'approximate', label: 'On the surface of asteroid 433 Eros, in the region known as the saddle', note: 'NSSDCA names the touchdown area as the “saddle” region. AIRXON does not cite an exact landing coordinate, so the spot is described rather than pinned' },
    significance: 'NEAR showed that a spacecraft could orbit, and even land on, a small and oddly shaped world. It was also the first U.S. spacecraft to be the first to land on a celestial body.',
    images: ['near-eros-mosaic', 'near-saddle', 'near-artist'],
    related: ['dawn', 'kepler'],
    sources: [sci('near-shoemaker', 'NEAR Shoemaker'), nssdc('1996-008A', 'NEAR Shoemaker')],
  },
  {
    slug: 'kepler', name: 'Kepler Space Telescope', short: 'Kepler',
    world: 'deep-space', category: 'spacecraft', agency: 'NASA / Ames',
    mission: 'Kepler and K2', launch: '2009-03-07', missionEnd: '2018-10-30', era: '2000s',
    status: 'inactive',
    statusNote: 'Kepler ran out of the fuel it needed for science. On October 30, 2018, NASA announced it was retiring the telescope in its current, safe orbit, away from Earth.',
    summary: 'NASA’s first planet-hunting telescope. It showed that our galaxy holds billions of hidden planets, more planets even than stars.',
    purpose: 'Watch more than 100,000 stars for tiny dips in brightness caused by planets passing in front of them, to find out how common Earth-size planets are.',
    instruments: ['Photometer: the largest digital camera flown in space at the time', 'Telescope staring at one patch of sky in the constellation Cygnus (original mission)'],
    achievements: [
      'More than 2,600 confirmed planet discoveries outside our solar system.',
      'First NASA mission to detect Earth-size planets in the habitable zones of their stars.',
      'After a mechanical failure in 2013, the K2 mission kept it working by shifting its view every three months; K2 lasted as long as the first mission.',
    ],
    discoveries: [
      'Found that 20 to 50 percent of the stars visible in the night sky are likely to have small, possibly rocky planets in their habitable zones.',
      'The most common planet size it found, between Earth and Neptune, does not exist in our solar system.',
    ],
    timeline: [
      { date: '2009-03-07', label: 'Launch (March 6 US Eastern time)' },
      { date: '2010-01', label: 'First five exoplanet discoveries announced' },
      { date: '2013', label: 'Mechanical failure ends the original mission; K2 begins' },
      { date: '2018-10-30', label: 'NASA announces Kepler’s retirement' },
    ],
    location: { precision: 'not-applicable', label: 'Drifting in an Earth-trailing orbit around the Sun, slowly falling behind Earth', note: 'Kepler was placed in an Earth-trailing heliocentric orbit with a period of 372.5 days (NSSDCA).' },
    significance: 'Kepler showed that planets are everywhere: our galaxy holds billions of them, more planets even than stars. It started a whole new field of research.',
    images: ['kepler-cleanroom', 'kepler-artist'],
    related: ['dawn', 'near-shoemaker', 'voyager-1'],
    sources: [sci('kepler', 'Kepler'), nssdc('2009-011A', 'Kepler'),
      { title: 'NASA Retires Kepler Space Telescope, Passes Planet-Hunting Torch', publisher: 'NASA', url: 'https://www.nasa.gov/news-release/nasa-retires-kepler-space-telescope-passes-planet-hunting-torch/' }],
  },
];

export const bySlug = (slug: string) => hardware.find((h) => h.slug === slug);
export const fmtDate = (iso?: string) => {
  if (!iso) return 'Not recorded';
  const [y, m, d] = iso.split('-').map(Number);
  if (!m) return String(y);
  const month = new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
  return d ? `${d} ${month} ${y}` : `${month} ${y}`;
};
export const fmtCoord = (lat?: number, lon?: number) => {
  if (lat === undefined || lon === undefined) return 'Not applicable';
  const la = `${Math.abs(lat).toFixed(Math.abs(lat) < 10 ? 3 : 2)}°${lat >= 0 ? 'N' : 'S'}`;
  const lo = `${Math.abs(lon).toFixed(Math.abs(lon) < 10 ? 3 : 2)}°${lon >= 0 ? 'E' : 'W'}`;
  return `${la}, ${lo}`;
};
