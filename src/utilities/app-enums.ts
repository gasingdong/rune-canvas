import { Keyword, Rarity } from './card-enums';
import Region from './region';

export interface Options {
  rarity: Rarity;
  region: Region;
  images: Record<string, never | string>;
  description: string;
  name: string;
  power: number;
  mana: number;
  health: number;
  keywords: Set<Keyword>;
}
