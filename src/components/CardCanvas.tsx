import React, { useEffect, useRef } from 'react';
import { Options } from '../utilities/app-enums';

interface CardCanvasProps {
  options: Options;
}

const CardCanvas: React.FC<CardCanvasProps> = (props: CardCanvasProps) => {
  const { options } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sprites = {
    common: 0,
    rare: 653,
    epic: 1306,
    none: 1959,
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
          const ratio = images.frames.height / 653;

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
          ctx.drawImage(
            images.frames,
            xDiff,
            0,
            653,
            images.frames.height,
            0,
            0,
            canvas.width,
            canvas.width * ratio
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
  }, [options]);

  return <canvas ref={canvasRef} width={325} height={500} />;
};

export default CardCanvas;
