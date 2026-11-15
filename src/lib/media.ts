import media from '../data/media.json';

export interface MediaItem {
  slug: string; nasaId: string | null; kind: 'photo' | 'artist-concept' | 'simulation' | 'map' | 'visualization';
  mission: string; alt: string; title: string; credit: string; date: string | null; center?: string;
  source: string; library: string; usage: string; width: number; height: number; widths: number[]; lqip: string;
}
const all = media as Record<string, MediaItem>;
export const allMedia = Object.values(all);
export function getMedia(slug: string): MediaItem {
  const m = all[slug];
  if (!m) throw new Error(`Unknown media slug: ${slug}`);
  return m;
}
export const src = (m: MediaItem, w?: number) => `/media/${m.slug}-${w ?? m.widths[m.widths.length - 1]}.webp`;
export const srcset = (m: MediaItem) => m.widths.map((w) => `/media/${m.slug}-${w}.webp ${w}w`).join(', ');
export const KIND_LABEL: Record<MediaItem['kind'], string | null> = {
  photo: null, map: 'Map', 'artist-concept': 'Artist’s concept', simulation: 'Simulation', visualization: 'Data visualisation',
};
