import { CardImages, CardMeta } from '../custom_typings';
import { Keyword } from './card-enums';
import icons from '../../assets/icons.json';
import Region from './region';

class Card {
  static readonly NO_KEYWORDS: Set<Keyword> = new Set();

  static readonly STAT_WHITE = 'white';

  static readonly STAT_OFFWHITE = '#f6e3e3';

  static readonly BACKGROUND_COLOR = '#1c1c1c';

  private readonly canvas: HTMLCanvasElement;

  private readonly ctx: CanvasRenderingContext2D;

  private readonly meta: CardMeta;

  private readonly images: CardImages;

  private readonly descriptionHeight: number;

  private readonly nameHeight: number;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    meta: CardMeta,
    images: CardImages,
    descriptionHeight: number,
    nameHeight: number
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.meta = meta;
    this.images = images;
    this.descriptionHeight = descriptionHeight;
    this.nameHeight = nameHeight;
  }

  drawStrokedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    font: string,
    fontSize: number,
    fillStyle = 'white',
    strokeStyle = 'black'
  ): void => {
    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = strokeStyle;
    ctx.fillText(text, x - 1, y);
    ctx.fillText(text, x + 1, y);
    ctx.fillText(text, x, y - 1);
    ctx.fillText(text, x, y + 1);
    ctx.fillStyle = fillStyle;
    ctx.fillText(text, x, y);
    ctx.restore();
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
    if (this.images.icons && this.meta.region !== Region.NONE) {
      const region = this.meta.region.getIcon();
      const icon = icons.icons[region];
      this.ctx.drawImage(
        this.images.icons,
        icon.frame.x,
        icon.frame.y,
        icon.frame.w,
        icon.frame.h,
        579,
        72,
        icon.frame.w,
        icon.frame.h
      );
    }
  };

  drawPower = (): void => {
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.meta.power}`,
      88,
      this.canvas.height - 86,
      'BeaufortBold',
      75,
      Card.STAT_OFFWHITE
    );
  };

  drawHealth = (): void => {
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.meta.health}`,
      this.canvas.width - 88,
      this.canvas.height - 86,
      'BeaufortBold',
      75
    );
  };

  drawCost = (): void => {
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.meta.cost}`,
      88,
      133,
      'BeaufortBold',
      92,
      Card.STAT_OFFWHITE
    );
  };

  drawDescription = (): void => {
    if (this.images.description) {
      this.ctx.drawImage(
        this.images.description,
        48,
        this.canvas.height / 2 + 329 - this.descriptionHeight
      );
    }
  };

  drawName = (): void => {
    if (this.images.name) {
      this.ctx.drawImage(
        this.images.name,
        48,
        this.canvas.height / 2 + 229 - this.nameHeight
      );
    }
  };

  clear = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  draw = (): void => {
    this.clear();
    this.drawArt();
    this.drawFrame();
    this.drawRegion();
    this.drawPower();
    this.drawHealth();
    this.drawCost();
    this.drawDescription();
    this.drawName();
  };
}

export default Card;
