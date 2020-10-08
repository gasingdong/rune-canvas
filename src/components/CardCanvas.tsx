import { useFonts } from 'expo-font';
import React, { useEffect, useRef, useState } from 'react';
import { AppLoading } from 'expo';
import { Options } from '../utilities/app-enums';
import BeaufortBold from '../../assets/fonts/BeaufortforLOLJa-Bold.ttf';
import BeaufortRegular from '../../assets/fonts/BeaufortforLOLJa-Regular.ttf';
import Univers55 from '../../assets/fonts/Univers55.ttf';
import Univers59 from '../../assets/fonts/Univers59-UltraCondensed.ttf';
import UniversRegular from '../../assets/fonts/UniversforRiotGames-Regular.ttf';

interface CardCanvasProps {
  options: Options;
}

const gold = '#f0cc70';
const descriptiveBlue = '#e1eeec';

const CardCanvas: React.FC<CardCanvasProps> = (props: CardCanvasProps) => {
  const { options } = props;
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [loaded, error] = useFonts({
    'Beaufort-Bold': BeaufortBold,
    'Beaufort-Regular': BeaufortRegular,
    Univers55,
    Univers59,
    UniversRegular,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sprites = {
    common: 0,
    rare: 680,
    epic: 1360,
    none: 2040,
  };

  const keywordSprites: { [name: string]: number[] } = {
    ephemeral: [0, 0],
    fearsome: [1, 0],
    tough: [2, 0],
    fleeting: [0, 1],
    regeneration: [1, 1],
  };

  const getCharacters = (text: string, special = true): string[] => {
    const letters = text.split('');
    const result = [];

    for (let i = 0; i < letters.length; i += 1) {
      const letter = letters[i];

      if (letter === '<') {
        let temp = i + 1;
        let command = '';

        while (letters[temp] !== '>' && temp < letters.length) {
          command += letters[temp];
          temp += 1;
        }

        if (letters[temp] === '>') {
          i = temp;

          if (special) {
            result.push(command);
          }
        } else {
          result.push(letter);
        }
      } else {
        result.push(letter);
      }
    }
    return result;
  };

  const getLineWidths = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): number[] => {
    const widths = [];
    const characters = getCharacters(text, false);
    let currentLine = '';

    for (let i = 0; i < characters.length; i += 1) {
      const character = characters[i];
      const { width } = ctx.measureText(`${currentLine}${character}`);

      if (width >= maxWidth && character === ' ') {
        widths.push(ctx.measureText(currentLine).width);
        currentLine = '';
      } else {
        currentLine = `${currentLine}${character}`;
      }
    }
    widths.push(ctx.measureText(currentLine).width);
    return widths;
  };

  const drawStrokedText = (
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

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const images: { [key: string]: HTMLImageElement } = {};
        let count = 0;
        const finishLoading = (): void => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const xDiff = sprites[options.rarity];

          if (images.content) {
            const contentRatio = images.content.height / images.content.width;
            ctx.drawImage(
              images.content,
              0,
              0,
              images.content.width,
              images.content.height,
              0,
              0,
              canvas.width * 1,
              canvas.width * contentRatio * 1
            );
          }
          ctx.fillStyle = '#1c1c1c';
          ctx.fillRect(20, 40, 640, 925);
          ctx.drawImage(
            images.frames,
            xDiff,
            0,
            680,
            images.frames.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
          ctx.drawImage(
            images.regions,
            options.region.position[0],
            options.region.position[1],
            128,
            128,
            132,
            400,
            128 * 0.4,
            128 * 0.4
          );
          const numKeywords = options.keywords.size;

          if (numKeywords > 0) {
            ctx.fillStyle = gold;
            ctx.textAlign = 'center';
            ctx.font = '42px Beaufort-Bold';
            const keywordY = canvas.height / 2 + 207;
            const keyword = options.keywords.keys().next().value.value;
            const keywordWidth =
              ctx.measureText(keyword.toUpperCase()).width + 50;
            const keywordX = canvas.width / 2 - keywordWidth / 2;

            if (numKeywords === 1 && keyword in keywordSprites) {
              const [spriteX, spriteY] = keywordSprites[keyword];
              ctx.drawImage(
                images.keywordLeft,
                0,
                0,
                20,
                82,
                keywordX - 20,
                keywordY,
                20,
                82
              );
              ctx.drawImage(
                images.keywordRight,
                0,
                0,
                22,
                82,
                keywordX + keywordWidth - 1,
                keywordY,
                22,
                82
              );
              ctx.drawImage(
                images.keywordFill,
                0,
                0,
                170,
                82,
                keywordX - 1,
                keywordY,
                keywordWidth + 1,
                82
              );
              ctx.drawImage(
                images.keywordIcons,
                spriteX * 55,
                spriteY * 55,
                55,
                55,
                keywordX - 2,
                keywordY + 13,
                55,
                55
              );
              ctx.fillText(
                `${keyword.toUpperCase()}`,
                canvas.width / 2 + 32,
                canvas.height - 249
              );
            }
          }
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.font = '48px Beaufort-Bold';
          ctx.fillText(
            `${options.name.toUpperCase()}`,
            canvas.width / 2,
            canvas.height - 315
          );
          const powerFont = '72px Beaufort-Bold';
          drawStrokedText(
            ctx,
            `${options.power}`,
            88,
            canvas.height - 86,
            powerFont
          );
          drawStrokedText(
            ctx,
            `${options.health}`,
            canvas.width - 88,
            canvas.height - 86,
            powerFont
          );
          const costFont = '92px Beaufort-Bold';
          drawStrokedText(ctx, `${options.mana}`, 90, 133, costFont);

          if (options.description.length > 0) {
            ctx.font = 'bold 33px UniversRegular';
            ctx.fillStyle = descriptiveBlue;
            const characters = getCharacters(options.description);
            const maxWidth = 450;
            const widths = getLineWidths(ctx, options.description, maxWidth);
            let currentLine = '';
            let lineIndex = 0;
            let yOffset = 185 + (widths.length - 1) * 39;
            let characterX = canvas.width / 2 - widths[0] / 2;
            characters.forEach((character) => {
              if (character === '#') {
                ctx.fillStyle = 'yellow';
              } else if (character === '/#') {
                ctx.fillStyle = descriptiveBlue;
              } else {
                const { width } = ctx.measureText(`${currentLine}${character}`);

                if (width >= maxWidth && character === ' ') {
                  currentLine = '';
                  lineIndex += 1;
                  characterX = canvas.width / 2 - widths[lineIndex] / 2;
                  yOffset -= 40;
                } else {
                  currentLine = `${currentLine}${character}`;
                  characterX += ctx.measureText(character).width / 2;
                  ctx.fillText(character, characterX, canvas.height - yOffset);
                  characterX += ctx.measureText(character).width / 2;
                }
              }
            });
          }
        };
        Object.entries(options.images).forEach((entry) => {
          const [id, src] = entry;
          const image = new Image();
          image.onload = (): void => {
            count += 1;

            if (count === Object.keys(options.images).length) {
              finishLoading();
            }
          };
          image.src = src;
          images[id] = image;
        });
      }
    }
  }, [options, loaded]);

  if (!loaded) {
    return <AppLoading />;
  }
  return (
    <canvas
      ref={canvasRef}
      width={680}
      height={1024}
      style={{ textRendering: 'optimizeLegibility' }}
    />
  );
};

export default CardCanvas;
