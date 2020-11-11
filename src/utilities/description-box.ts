class DescriptionBox {
  static FONT_COLOR = '#e1eeec';

  private canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  private maxWidth: number;

  private spacing: number;

  private text: string;

  private parsed: string[] = [];

  private lineWidths: number[] = [];

  private spaceBroken: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    spaceBroken = true,
    spacing = 1
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.text = text;
    this.maxWidth = maxWidth;
    this.spaceBroken = spaceBroken;
    this.spacing = spacing;
    this.parse();
  }

  private draw = (): void => {
    this.ctx.font = 'bold 34px UniversRegular';
    this.ctx.fillStyle = DescriptionBox.FONT_COLOR;
    let currentLine = '';
    let lineIndex = 0;
    let descriptionYOffset = 0;
    let characterX = this.canvas.width / 2 - this.lineWidths[lineIndex] / 2;
    this.parsed.forEach((word) => {
      if (word === '<#>') {
        this.ctx.fillStyle = 'yellow';
      } else if (word === '</#>') {
        this.ctx.fillStyle = DescriptionBox.FONT_COLOR;
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
    const characters = this.text.split('');
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
