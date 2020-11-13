import { Options } from './app-enums';

class Card {
  static readonly SPRITES = {
    common: 0,
    rare: 680,
    epic: 1360,
    none: 2040,
  };

  static readonly GOLD = '#f0cc70';

  static readonly KEYWORD_SPRITES: { [name: string]: number[] } = {
    ephemeral: [0, 0],
    fearsome: [1, 0],
    tough: [2, 0],
    fleeting: [0, 1],
    regeneration: [1, 1],
  };

  private readonly canvas: HTMLCanvasElement;

  private readonly ctx: CanvasRenderingContext2D;

  private readonly options: Options;

  private readonly images: { [key: string]: HTMLImageElement };

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    options: Options,
    images: { [key: string]: HTMLImageElement }
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.options = options;
    this.images = images;
  }

  drawStrokedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    font: string,
    fillStyle = 'white',
    strokeStyle = 'black'
  ): void => {
    ctx.font = font;
    ctx.strokeStyle = strokeStyle;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillStyle;
    ctx.fillText(text, x, y);
  };

  drawMain = (): void => {
    if (this.images.content) {
      const contentRatio =
        this.images.content.height / this.images.content.width;
      this.ctx.drawImage(
        this.images.content,
        0,
        0,
        this.images.content.width,
        this.images.content.height,
        0,
        0,
        this.canvas.width,
        this.canvas.width * contentRatio
      );
    }
  };

  drawFrame = (): void => {
    this.ctx.fillStyle = '#1c1c1c';
    this.ctx.fillRect(20, 40, 640, 925);
    this.ctx.drawImage(
      this.images.frames,
      Card.SPRITES[this.options.rarity],
      0,
      680,
      this.images.frames.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  };

  drawRegion = (): void => {
    this.ctx.drawImage(
      this.images.regions,
      this.options.region.position[0],
      this.options.region.position[1],
      128,
      128,
      132,
      400,
      128 * 0.4,
      128 * 0.4
    );
  };

  drawName = (): void => {
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.font = '48px Beaufort-Bold';
    this.ctx.fillText(
      `${this.options.name.toUpperCase()}`,
      this.canvas.width / 2,
      this.canvas.height - 315
    );
  };

  drawPower = (): void => {
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.options.power}`,
      88,
      this.canvas.height - 86,
      '72px Beaufort-Bold'
    );
  };

  drawHealth = (): void => {
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.options.health}`,
      this.canvas.width - 88,
      this.canvas.height - 86,
      '72px Beaufort-Bold'
    );
  };

  drawCost = (): void => {
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.options.mana}`,
      90,
      133,
      '92px Beaufort-Bold'
    );
  };

  drawKeywords = (): void => {
    const numKeywords = this.options.keywords.size;

    if (numKeywords > 0) {
      this.ctx.fillStyle = Card.GOLD;
      this.ctx.textAlign = 'center';
      this.ctx.font = '42px Beaufort-Bold';
      const keywordY =
        this.canvas.height / 2 +
        300 -
        (this.options.description.length > 0 ? 122 : 74);
      const keyword = this.options.keywords.keys().next().value.value;
      const keywordWidth =
        this.ctx.measureText(keyword.toUpperCase()).width + 50;
      const keywordX = this.canvas.width / 2 - keywordWidth / 2;

      if (numKeywords === 1 && keyword in Card.KEYWORD_SPRITES) {
        const [spriteX, spriteY] = Card.KEYWORD_SPRITES[keyword];
        this.ctx.drawImage(
          this.images.keywordLeft,
          0,
          0,
          20,
          82,
          keywordX - 20,
          keywordY,
          20,
          82
        );
        this.ctx.drawImage(
          this.images.keywordRight,
          0,
          0,
          22,
          82,
          keywordX + keywordWidth - 1,
          keywordY,
          22,
          82
        );
        this.ctx.drawImage(
          this.images.keywordFill,
          0,
          0,
          170,
          82,
          keywordX - 1,
          keywordY,
          keywordWidth + 1,
          82
        );
        this.ctx.drawImage(
          this.images.keywordIcons,
          spriteX * 55,
          spriteY * 55,
          55,
          55,
          keywordX - 2,
          keywordY + 13,
          55,
          55
        );
        this.ctx.fillText(
          `${keyword.toUpperCase()}`,
          this.canvas.width / 2 + 32,
          keywordY + 56
        );
      }
    }
  };

  draw = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMain();
    this.drawFrame();
    this.drawRegion();
    this.drawName();
    this.drawPower();
    this.drawHealth();
    this.drawCost();
    this.drawKeywords();
  };
}

export default Card;
