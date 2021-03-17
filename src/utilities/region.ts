type RegionIcon =
  | 'icon-bilgewater.png'
  | 'icon-demacia.png'
  | 'icon-freljord.png'
  | 'icon-targon.png'
  | 'icon-pnz.png'
  | 'icon-shurima.png'
  | 'icon-ionia.png'
  | 'icon-noxus.png'
  | 'icon-shadowisles.png';

class Region {
  private static readonly VALUES: Array<Region> = [];

  static readonly NONE = new Region('none');

  static readonly BILGEWATER = new Region('bilgewater');

  static readonly DEMACIA = new Region('demacia');

  static readonly FRELJORD = new Region('freljord');

  static readonly IONIA = new Region('ionia');

  static readonly NOXUS = new Region('noxus');

  static readonly PNZ = new Region('pnz');

  static readonly SHADOWISLES = new Region('shadowisles');

  static readonly SHURIMA = new Region('shurima');

  static readonly TARGON = new Region('targon');

  static getAll = (): Array<Region> => {
    return Region.VALUES;
  };

  static get = (id: string): Region | null => {
    const matching = Region.getAll().filter((element) => element.id === id);
    return matching.length > 0 ? matching[0] : null;
  };

  protected constructor(private readonly id: string) {
    Region.VALUES.push(this);
  }

  getIcon = (): RegionIcon => {
    return <RegionIcon>`icon-${this.id}.png`;
  };

  toString = (): string => {
    return this.id;
  };
}

export default Region;
