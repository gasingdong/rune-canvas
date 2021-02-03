import { useFonts } from 'expo-font';
import React, { useEffect, useRef, useState } from 'react';
import { AppLoading } from 'expo';
import { CardConfig } from '../custom_typings';
import BeaufortBold from '../../assets/fonts/BeaufortforLOLJa-Bold.ttf';
import BeaufortRegular from '../../assets/fonts/BeaufortforLOLJa-Regular.ttf';
import Univers55 from '../../assets/fonts/Univers55.ttf';
import Univers59 from '../../assets/fonts/Univers59-UltraCondensed.ttf';
import UniversRegular from '../../assets/fonts/UniversforRiotGames-Regular.ttf';
import frames from '../../assets/frames.png';
import regions from '../../assets/regions.png';
import Card from '../utilities/card';
import css from '../stylesheet';

interface CardCanvasProps {
  config: CardConfig;
}

const CardCanvas: React.FC<CardCanvasProps> = (props: CardCanvasProps) => {
  const { config } = props;
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [loaded, error] = useFonts({
    'Beaufort-Bold': BeaufortBold,
    'Beaufort-Regular': BeaufortRegular,
    Univers55,
    Univers59,
    UniversRegular,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const images = {
    frames,
    regions,
  };

  const loadFonts = (ctx: CanvasRenderingContext2D): void => {
    ctx.font = '1px Beaufort-Bold';
    ctx.font = '1px Beaufort-Regular';
    ctx.font = '1px Univers55';
    ctx.font = '1px Univers59';
    ctx.font = '1px UniversRegular';
  };

  const htmlToXml = (html: string): string => {
    const doc = document.implementation.createHTMLDocument('');
    doc.write(html);

    if (doc.documentElement.namespaceURI !== null) {
      doc.documentElement.setAttribute(
        'xmlns',
        doc.documentElement.namespaceURI
      );
    }
    return new XMLSerializer().serializeToString(doc.body);
  };

  const renderHtmlToCanvas = (
    html: string,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): void => {
    let xml = htmlToXml(html);
    xml = xml.replace(/#/g, '%23');
    const data = `${
      'data:image/svg+xml;charset=utf-8,' +
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `${css}<foreignObject width="100%" height="100%">${xml}</foreignObject>` +
      `</svg>`
    }`;

    const img = new Image();
    console.log(data);
    img.onload = (): void => {
      ctx.drawImage(img, x, y);
    };
    img.src = data;
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && loaded) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const loadedImages: { [key: string]: HTMLImageElement } = {};
        let count = 0;
        const finishLoading = (): void => {
          loadFonts(ctx);
          const card = new Card(canvas, ctx, config, loadedImages);

          if (config.description.length > 0) {
            renderHtmlToCanvas(
              config.description,
              ctx,
              38,
              canvas.height / 2 + 289,
              600,
              500
            );
          }
          card.draw();
        };
        Object.entries(images).forEach((entry) => {
          const [id, src] = entry;
          const image = new Image();
          image.onload = (): void => {
            count += 1;

            if (count === Object.keys(images).length) {
              finishLoading();
            }
          };
          image.src = src;
          loadedImages[id] = image;
        });
      }
    }
  }, [config, loaded]);

  if (!loaded) {
    return <AppLoading />;
  }
  return (
    <>
      <canvas ref={canvasRef} width={680} height={1024} />
    </>
  );
};

export default CardCanvas;
