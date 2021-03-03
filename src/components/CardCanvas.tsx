import React, { useEffect, useRef, useState } from 'react';
import { CardImages, CardMeta } from '../custom_typings';
import frames from '../../assets/frames.png';
import icons from '../../assets/icons.png';
import Card from '../utilities/card';
import css from '../stylesheet';

interface CardCanvasProps {
  meta: CardMeta;
}

const CardCanvas: React.FC<CardCanvasProps> = (props: CardCanvasProps) => {
  const { meta } = props;
  const [finishedLoading, setFinishedLoading] = useState(false);
  // const [loaded, error] = useFonts({
  //   'Beaufort-Bold': BeaufortBold,
  //   'Beaufort-Regular': BeaufortRegular,
  //   Univers55,
  //   Univers59,
  //   UniversRegular,
  // });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<CardImages>({
    frames: null,
    icons: null,
    description: null,
    art: null,
  });

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
    const newImages = { ...images };
    const finishLoading = (): void => {
      setImages(newImages);
      setFinishedLoading(true);
    };
    let image = new Image();
    image.onload = (): void => {
      count += 1;

      if (count === 2) {
        finishLoading();
      }
    };
    image.src = frames;
    newImages.frames = image;
    image = new Image();
    image.onload = (): void => {
      count += 1;

      if (count === 2) {
        finishLoading();
      }
    };
    image.src = icons;
    newImages.icons = image;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        if (meta.description.length === 0) {
          setImages({
            ...images,
            description: null,
          });
        } else {
          const image = new Image();
          image.onload = (): void => {
            setImages({
              ...images,
              description: image,
            });
          };
          image.src = getHtmlToData(meta.description, ctx, 600, 500);
        }
      }
    }
  }, [meta.description]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && finishedLoading) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // loadFonts(ctx);
        const card = new Card(canvas, ctx, meta, images);
        card.draw();
      }
    }
  }, [finishedLoading, images]);

  // if (!loaded) {
  //   return <AppLoading />;
  // }
  return (
    <>
      <canvas ref={canvasRef} width={680} height={1024} />
    </>
  );
};

export default CardCanvas;
