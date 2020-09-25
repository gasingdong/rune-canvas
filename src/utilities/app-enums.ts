import { Rarity } from './card-enums';
import Region from './region';

export interface Options {
  rarity: Rarity;
  region: Region;
  images: Record<string, never | string>;
}
