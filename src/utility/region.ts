class Region {
  private static readonly VALUES: Array<Region> = [];

  static readonly RUNETERRA = new Region('runeterra', 'Runeterra');

  static readonly BILGEWATER = new Region('bilgewater', 'Bilgewater', [128, 0]);

  static readonly DEMACIA = new Region('demacia', 'Demacia', [256, 0]);

  static readonly FRELJORD = new Region('freljord', 'Freljord', [0, 128]);

  static readonly IONIA = new Region('ionia', 'Ionia', [128, 128]);

  static readonly NOXUS = new Region('noxus', 'Noxus', [256, 128]);

  static readonly PNZ = new Region('pnz', 'Piltover & Zaun', [0, 256]);

  static readonly SHADOWISLES = new Region('shadowisles', 'Shadow Isles', [
    128,
    256,
  ]);

  static readonly SHURIMA = new Region('shurima', 'Shurima', [256, 256]);

  static readonly TARGON = new Region('targon', 'Targon', [384, 0]);

  static getRegions = (): Array<Region> => {
    return Region.VALUES;
  };

  static getRegion = (id: string): Region | null => {
    const matching = Region.getRegions().filter((element) => element.id === id);
    return matching.length > 0 ? matching[0] : null;
  };

  protected constructor(
    private readonly id: string,
    public readonly name: string,
    public readonly position: [number, number] = [0, 0]
  ) {
    Region.VALUES.push(this);
  }

  toString = (): string => {
    return this.id;
  };
}

export default Region;
