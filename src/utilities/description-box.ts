import { CardMeta } from '../custom_typings';
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

  static readonly DEFAULT_NAME_VERTICAL_OFFSET = 193;

  static readonly VERTICAL_OFFSET_PER_LINE = 38;

  private canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  private maxWidth: number;

  private spacing: number;

  private description: string;

  private keywords: Set<Keyword>;

  private name: string;

  private nameVerticalOffset: number;

  private parsed: string[] = [];

  private lineWidths: number[] = [];

  private spaceBroken: boolean;

  private images: { [key: string]: HTMLImageElement };

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    config: CardMeta,
    images: { [key: string]: HTMLImageElement },
    maxWidth: number,
    spaceBroken = true,
    spacing = 1
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.name = config.name;
    this.nameVerticalOffset = DescriptionBox.DEFAULT_NAME_VERTICAL_OFFSET;
    this.keywords = config.keywords;
    this.description = config.description;
    this.maxWidth = maxWidth;
    this.spaceBroken = spaceBroken;
    this.spacing = spacing;
    this.images = images;
    this.parse();
  }

  drawName = (): void => {
    if (this.name.length === 0) {
      return;
    }
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    let fontSize = 57;
    this.ctx.font = `${fontSize}px Beaufort-Bold`;
    this.name = this.name.toUpperCase();
    const characterSpacing = 1.06;

    while (this.ctx.measureText(this.name).width * characterSpacing > 550) {
      fontSize -= 1;
      this.ctx.font = `${fontSize}px Beaufort-Bold`;
    }
    this.ctx.fillText(
      this.name,
      this.canvas.width / 2,
      this.canvas.height - this.nameVerticalOffset
    );
  };

  // fillSpacedText = (
  //   text: string,
  //   x: number,
  //   y: number,
  //   spacing: number
  // ): void => {
  //   let wAll = this.ctx.measureText(text).width;
  //   let characterX = x;
  //   let currentText = text;
  //
  //   do {
  //     const char = currentText.substr(0, 1);
  //     currentText = currentText.substr(1);
  //
  //     this.ctx.fillText(char, characterX, y);
  //     let wShorter;
  //
  //     if (currentText === '') {
  //       wShorter = 0;
  //     } else {
  //       wShorter = this.ctx.measureText(currentText).width;
  //     }
  //     characterX += wAll - wShorter + spacing;
  //     wAll = wShorter;
  //   } while (currentText !== '');
  // };

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
    // this.ctx.font = 'bold 34px UniversRegular';
    // this.ctx.fillStyle = DescriptionBox.DESCRIPTION_WHITE;
    // this.ctx.textAlign = 'center';
    // let currentLine = '';
    // let lineIndex = 0;
    // let descriptionYOffset = 328 - (this.lineWidths.length - 1) * 39;
    // let characterX = this.canvas.width / 2 - this.lineWidths[lineIndex] / 2;
    // console.log(this.parsed);
    //
    // if (this.parsed.length !== 0) {
    //   this.nameVerticalOffset += 47;
    // }
    // this.parsed.forEach((word) => {
    //   console.log(currentLine);
    //   if (word === '<#>') {
    //     this.ctx.fillStyle = 'yellow';
    //   } else if (word === '</#>') {
    //     this.ctx.fillStyle = DescriptionBox.DESCRIPTION_WHITE;
    //   } else {
    //     const newLine = `${currentLine}${word}`;
    //     const width =
    //       this.ctx.measureText(newLine).width - newLine.length * 1.35;
    //
    //     if (width > this.lineWidths[lineIndex]) {
    //       currentLine = word;
    //       lineIndex += 1;
    //       this.nameVerticalOffset += DescriptionBox.VERTICAL_OFFSET_PER_LINE;
    //       characterX =
    //         this.canvas.width / 2 - this.lineWidths[lineIndex] / 2 + 4;
    //       descriptionYOffset += 39;
    //     } else {
    //       currentLine = newLine;
    //       const currentWord = word;
    //       characterX += this.ctx.measureText(currentWord).width / 2 - 0.675;
    //       this.ctx.fillText(
    //         currentWord,
    //         characterX,
    //         this.canvas.height / 2 + descriptionYOffset
    //       );
    //       characterX += this.ctx.measureText(currentWord).width / 2 - 0.675;
    //     }
    //   }
    // });
    this.drawName();
  };

  private calcLineWidths = (): void => {
    const words = [];
    let index = 0;

    while (index < this.parsed.length) {
      let word = this.parsed[index];

      if (this.spaceBroken) {
        while (
          index < this.parsed.length - 1 &&
          this.parsed[index + 1] !== ' '
        ) {
          word += this.parsed[index + 1];
          index += 1;
        }
      }
      words.push(word);
      index += 1;
    }

    const lineWidths: number[] = [];
    let line = '';
    this.ctx.font = 'bold 34px UniversRegular';

    words.forEach((word) => {
      const { width } = this.ctx.measureText(line + word);

      if (width > this.maxWidth) {
        lineWidths.push(this.ctx.measureText(line).width - line.length * 1.35);
        line = word;
      } else {
        line += word;
      }
    });

    if (line.length !== 0) {
      lineWidths.push(this.ctx.measureText(line).width - line.length * 1.35);
    }
    this.lineWidths = lineWidths;
  };

  private parse = (): void => {
    const characters = this.description.split('');
    const parsed = [];

    let text = '';
    let index = 0;

    while (index < characters.length) {
      const character = characters[index];

      if (character === '<') {
        let command = '';
        index += 1;

        if (text.length > 0) {
          parsed.push(text);
          text = '';
        }

        while (characters[index] !== '>' && index < characters.length) {
          command += characters[index];
          index += 1;
        }

        if (characters[index] === '>') {
          parsed.push(`<${command}>`);
        } else {
          parsed.push(character);
        }
      } else {
        parsed.push(character);
      }
      index += 1;
    }
    this.parsed = parsed;
    this.calcLineWidths();
  };
}

export default DescriptionBox;
