import { CardConfig } from '../custom_typings';
import DescriptionBox from './description-box';

class Card {
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

  private readonly settings: CardConfig;

  private readonly images: { [key: string]: HTMLImageElement };

  private readonly descriptionBox: DescriptionBox;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    options: CardConfig,
    images: { [key: string]: HTMLImageElement }
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.settings = options;
    this.images = images;
    this.descriptionBox = new DescriptionBox(canvas, ctx, options, images, 500);
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
    this.ctx.fillStyle = Card.BACKGROUND_COLOR;
    this.ctx.fillRect(20, 40, 640, 925);
    this.ctx.drawImage(
      this.images.frames,
      Card.SPRITES[this.settings.rarity],
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
      this.settings.region.position[0],
      this.settings.region.position[1],
      128,
      128,
      132,
      400,
      128 * 0.4,
      128 * 0.4
    );
  };

  drawPower = (): void => {
    this.ctx.fillStyle = Card.STAT_WHITE;
    this.ctx.textAlign = 'center';
    this.drawStrokedText(
      this.ctx,
      `${this.settings.power}`,
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
      `${this.settings.health}`,
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
      `${this.settings.mana}`,
      90,
      133,
      '92px Beaufort-Bold'
    );
  };

  draw = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMain();
    this.drawFrame();
    this.drawRegion();
    this.drawPower();
    this.drawHealth();
    this.drawCost();
    this.descriptionBox.draw();
  };
}

export default Card;
