import { CardMeta, CardImages } from '../custom_typings';
import DescriptionBox from './description-box';
import { Keyword } from './card-enums';

class Card {
  static readonly NO_KEYWORDS: Set<Keyword> = new Set();

  static readonly SPRITES = {
    common: 0,
    rare: 680,
    epic: 1360,
    none: 2040,
  };

  static readonly STAT_WHITE = 'white';

  static readonly BACKGROUND_COLOR = '#1c1c1c';

  private readonly canvas: HTMLCanvasElement;

  private readonly ctx: CanvasRenderingContext2D;

  private readonly meta: CardMeta;

  private readonly images: CardImages;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    meta: CardMeta,
    images: CardImages
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.meta = meta;
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

  drawArt = (): void => {
    this.ctx.clearRect(20, 40, 640, 925);
    this.ctx.fillStyle = Card.BACKGROUND_COLOR;
    this.ctx.fillRect(20, 40, 640, 925);

    if (this.images.art) {
      const contentRatio = this.images.art.height / this.images.art.width;
      this.ctx.drawImage(
        this.images.art,
        0,
        0,
        this.images.art.width,
        this.images.art.height,
        20,
        40,
        640,
        640 * contentRatio
      );
    }
  };

  drawFrame = (): void => {
    if (this.images.frames) {
      this.ctx.drawImage(
        this.images.frames,
        1360,
        0,
        680,
        1024,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }
  };

  drawRegion = (): void => {
    // this.ctx.drawImage(
    //   this.images.regions,
    //   this.meta.region.position[0],
    //   this.meta.region.position[1],
    //   128,
    //   128,
    //   132,
    //   400,
    //   128 * 0.4,
    //   128 * 0.4
    // );
  };

  drawPower = (): void => {
    this.ctx.fillStyle = Card.STAT_WHITE;
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.meta.power}`,
      88,
      this.canvas.height - 86,
      '72px Beaufort-Bold'
    );
  };

  drawHealth = (): void => {
    this.ctx.fillStyle = Card.STAT_WHITE;
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.meta.health}`,
      this.canvas.width - 88,
      this.canvas.height - 86,
      '72px Beaufort-Bold'
    );
  };

  drawCost = (): void => {
    this.ctx.fillStyle = Card.STAT_WHITE;
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.meta.cost}`,
      90,
      133,
      '92px Beaufort-Bold'
    );
  };

  drawDescription = (): void => {
    if (this.images.description) {
      this.ctx.drawImage(
        this.images.description,
        38,
        this.canvas.height / 2 + 289
      );
    }
  };

  draw = (): void => {
    this.drawArt();
    this.drawFrame();
    // this.drawRegion();
    // this.drawPower();
    // this.drawHealth();
    // this.drawCost();
    // this.drawDescription();
  };
}

export default Card;
