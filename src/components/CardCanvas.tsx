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
  const [description, setDescription] = useState<HTMLImageElement | null>(null);
  const [loadedImages, setLoadedImages] = useState<
    Record<string, HTMLImageElement>
  >({});
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

  const getHtmlToData = (
    html: string,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): string => {
    let xml = htmlToXml(html);
    xml = xml.replace(/#/g, '%23');
    return `${
      'data:image/svg+xml;charset=utf-8,' +
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `${css}<foreignObject width="100%" height="100%">${xml}</foreignObject>` +
      `</svg>`
    }`;
  };

  useEffect(() => {
    let count = 0;
    const finishLoading = (): void => {
      setFinishedLoading(true);
    };
    const updated = { ...loadedImages };
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
      updated[id] = image;
    });
    setLoadedImages(updated);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && loaded) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        if (config.description.length === 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const card = new Card(canvas, ctx, config, loadedImages, undefined);
          card.draw();
        } else {
          const image = new Image();
          image.onload = (): void => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const card = new Card(canvas, ctx, config, loadedImages, image);
            card.draw();
          };
          image.src = getHtmlToData(config.description, ctx, 600, 500);
        }
      }
    }
  }, [config.description]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && finishedLoading && loadedImages) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        loadFonts(ctx);
        const card = new Card(canvas, ctx, config, loadedImages, undefined);
        card.draw();
      }
    }
  }, [loadedImages, finishedLoading]);

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
