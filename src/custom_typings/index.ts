import { Keyword, Rarity } from '../utilities/card-enums';
import Region from '../utilities/region';

export interface CardMeta {
  rarity: Rarity;
  region: Region;
  art: string;
  description: string;
  name: string;
  power: number;
  cost: number;
  health: number;
  keywords: Set<Keyword>;
}

export interface CardImages {
  frames: HTMLImageElement | null;
  icons: HTMLImageElement | null;
  name: HTMLImageElement | null;
  description: HTMLImageElement | null;
  art: HTMLImageElement | null;
}
