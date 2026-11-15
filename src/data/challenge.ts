/**
 * The Resources list of the 2026 NASA Space Apps challenge
 * "Abandoned but Not Forgotten" (spaceappschallenge.org), as published on the challenge page.
 * The Credits page shows which AIRXON profiles cite each link (worked out from hardware.ts sources).
 */
export interface ChallengeResource { group: string; name: string; url: string; note: string }

export const challengeResources: ChallengeResource[] = [
  { group: 'The Moon', name: 'Apollo Lunar Modules', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C', note: 'The descent stages of the Lunar Modules (like Apollo 11’s Eagle) were left behind as launch pads.' },
  { group: 'The Moon', name: 'Lunar Roving Vehicles (LRVs)', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C', note: 'Three electric “moon buggies” driven by astronauts. Parked permanently on the Moon.' },
  { group: 'The Moon', name: 'ALSEP Scientific Packages', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C', note: 'Apollo Lunar Surface Experiments Packages (seismometers, retroreflectors, etc.) left to do science after astronauts departed.' },
  { group: 'The Moon', name: 'Surveyor Landers', url: 'https://science.nasa.gov/mission/surveyor-3/', note: 'Robotic probes sent in the 1960s to prove soft landings were possible.' },
  { group: 'Mars and beyond', name: 'Sojourner Rover', url: 'https://science.nasa.gov/mission/mars-pathfinder/', note: 'The first rover on Mars (1997), delivered by the Pathfinder lander. Now permanently parked.' },
  { group: 'Mars and beyond', name: 'Spirit & Opportunity', url: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/', note: 'Twin rovers that operated for years. Both are now inactive monuments to Mars exploration.' },
  { group: 'Mars and beyond', name: 'Viking 1 & 2 Landers', url: 'https://science.nasa.gov/mission/viking-1/', note: 'The first U.S. landers to successfully operate on Mars (1976), remaining exactly where they touched down.' },
  { group: 'Mars and beyond', name: 'Phoenix & InSight Landers', url: 'https://science.nasa.gov/mission/insight/', note: 'Phoenix dug for water ice; InSight listened for marsquakes. Both eventually lost power.' },
  { group: 'Mars and beyond', name: 'Dawn Spacecraft', url: 'https://science.nasa.gov/mission/dawn/', note: 'Mapped Vesta and Ceres. Ran out of fuel and remains in a perpetual, unpowered orbit around Ceres.' },
  { group: 'Mars and beyond', name: 'NEAR Shoemaker', url: 'https://science.nasa.gov/mission/near-shoemaker/', note: 'First spacecraft to orbit and land on an asteroid. Left resting on the surface of 433 Eros.' },
  { group: 'Mars and beyond', name: 'Pioneer 10 & 11', url: 'https://science.nasa.gov/mission/pioneer-10/', note: 'Early deep-space probes that explored the outer planets. Now drifting silently out of the solar system.' },
  { group: 'Mars and beyond', name: 'Ingenuity Helicopter', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/', note: 'The first aircraft on another planet. Sustained rotor damage and became a stationary artifact.' },
  { group: 'Mars and beyond', name: 'Kepler Space Telescope', url: 'https://science.nasa.gov/mission/kepler/', note: 'Revolutionary exoplanet-hunting telescope that ran out of fuel and is drifting in an Earth-trailing orbit.' },
];
