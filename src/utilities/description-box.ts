import { CardConfig } from '../custom_typings';
import { Keyword } from './card-enums';

class DescriptionBox {
  static readonly DESCRIPTION_WHITE = '#e1eeec';

  static readonly KEYWORD_GOLD = '#f0cc70';

  static readonly KEYWORD_SPRITES: { [name: string]: number[] } = {
    ephemeral: [0, 0],
    fearsome: [1, 0],
    tough: [2, 0],
    fleeting: [0, 1],
    regeneration: [1, 1],
  };

  private canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  private maxWidth: number;

  private spacing: number;

  private description: string;

  private keywords: Set<Keyword>;

  private name: string;

  private parsed: string[] = [];

  private lineWidths: number[] = [];

  private spaceBroken: boolean;

  private images: { [key: string]: HTMLImageElement };

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    config: CardConfig,
    images: { [key: string]: HTMLImageElement },
    maxWidth: number,
    spaceBroken = true,
    spacing = 1
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.name = config.name;
    this.keywords = config.keywords;
    this.description = config.description;
    this.maxWidth = maxWidth;
    this.spaceBroken = spaceBroken;
    this.spacing = spacing;
    this.images = images;
    this.parse();
  }

  drawName = (): void => {
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.font = '48px Beaufort-Bold';
    this.ctx.fillText(
      `${this.name.toUpperCase()}`,
      this.canvas.width / 2,
      this.canvas.height - 315
    );
  };

  drawKeywords = (): void => {
    const numKeywords = this.keywords.size;

    if (numKeywords > 0) {
      this.ctx.fillStyle = DescriptionBox.KEYWORD_GOLD;
      this.ctx.textAlign = 'center';
      this.ctx.font = '42px Beaufort-Bold';
      const keywordY =
        this.canvas.height / 2 + 300 - (this.description.length > 0 ? 122 : 74);
      const keyword = this.keywords.keys().next().value.value;
      const keywordWidth =
        this.ctx.measureText(keyword.toUpperCase()).width + 50;
      const keywordX = this.canvas.width / 2 - keywordWidth / 2;

      if (numKeywords === 1 && keyword in DescriptionBox.KEYWORD_SPRITES) {
        const [spriteX, spriteY] = DescriptionBox.KEYWORD_SPRITES[keyword];
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
    this.ctx.font = 'bold 34px UniversRegular';
    this.ctx.fillStyle = DescriptionBox.DESCRIPTION_WHITE;
    let currentLine = '';
    let lineIndex = 0;
    let descriptionYOffset = 0;
    let characterX = this.canvas.width / 2 - this.lineWidths[lineIndex] / 2;
    this.parsed.forEach((word) => {
      if (word === '<#>') {
        this.ctx.fillStyle = 'yellow';
      } else if (word === '</#>') {
        this.ctx.fillStyle = DescriptionBox.DESCRIPTION_WHITE;
      } else {
        const newLine = this.spaceBroken
          ? `${currentLine} ${word}`
          : `${currentLine}${word}`;
        const { width } = this.ctx.measureText(newLine);

        if (width >= this.maxWidth) {
          currentLine = '';
          lineIndex += 1;
          characterX = this.canvas.width / 2 - this.lineWidths[lineIndex] / 2;
          descriptionYOffset += 39;
        } else {
          currentLine = newLine;
          characterX += this.ctx.measureText(word).width / 2 - 0.65;
          this.ctx.fillText(
            word,
            characterX,
            this.canvas.height / 2 + descriptionYOffset
          );
          characterX += this.ctx.measureText(word).width / 2 - 0.65;
        }
      }
    });
  };

  private parse = (): void => {
    const characters = this.description.split('');
    const parsed = [];
    const lineWidths = [];

    let currentWord = '';

    for (let i = 0; i < characters.length; i += 1) {
      const character = characters[i];

      if (character === '<') {
        let temp = i + 1;
        let command = '';

        if (currentWord.length > 0) {
          parsed.push(currentWord);
          currentWord = '';
        }

        while (characters[temp] !== '>' && temp < characters.length) {
          command += characters[temp];
          temp += 1;
        }

        if (characters[temp] === '>') {
          i = temp;
          parsed.push(`<${command}>`);
        } else {
          parsed.push(character);
        }
      } else if (this.spaceBroken) {
        if (character === ' ') {
          if (currentWord.length !== 0) {
            parsed.push(currentWord);
            currentWord = '';
          }
        } else {
          currentWord = `${currentWord}${character}`;
        }
      } else {
        parsed.push(character);
      }
    }

    if (currentWord.length > 0) {
      parsed.push(currentWord);
    }

    let currentLine = '';

    for (let i = 0; i < parsed.length; i += 1) {
      const word = parsed[i];
      const newLine = this.spaceBroken
        ? `${currentLine} ${word}`
        : `${currentLine}${word}`;
      let { width } = this.ctx.measureText(newLine);
      width *= this.spacing;

      if (width >= this.maxWidth) {
        lineWidths.push(
          this.ctx.measureText(currentLine).width - currentLine.length
        );
        currentLine = '';
      } else {
        currentLine = newLine;
      }
    }
    lineWidths.push(
      this.ctx.measureText(currentLine).width - currentLine.length
    );
    this.parsed = parsed;
    this.lineWidths = lineWidths;
  };
}
export default DescriptionBox;
