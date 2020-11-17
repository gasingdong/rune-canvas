import { Keyword, Rarity } from '../utilities/card-enums';
import Region from '../utilities/region';

export interface CardConfig {
  rarity: Rarity;
  region: Region;
  art: string;
  description: string;
  name: string;
  power: number;
  mana: number;
  health: number;
  keywords: Set<Keyword>;
}
