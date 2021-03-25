import React, { useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import FontFaceObserver from 'fontfaceobserver';
import { CardImages, CardMeta } from '../custom_typings';
import frames from '../../assets/frames.png';
import icons from '../../assets/icons.png';
import Card from '../utilities/card';
import { descriptionCss, nameCss } from '../stylesheet';
import BeaufortBold from '../../assets/fonts/BeaufortBold.ttf';
import Univers55 from '../../assets/fonts/Univers55.ttf';

interface CardCanvasProps {
  meta: CardMeta;
}

const CardCanvas: React.FC<CardCanvasProps> = (props: CardCanvasProps) => {
  const { meta } = props;
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontsPreloaded, fontsPreloadingError] = useFonts({
    BeaufortBold,
    Univers55,
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [images, setImages] = useState<CardImages>({
    frames: null,
    icons: null,
    name: null,
    description: null,
    art: null,
  });
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const [nameHeight, setNameHeight] = useState(0);
  const loadFonts = (): void => {
    setFontsLoaded(true);
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
    height: number,
    name: boolean
  ): string => {
    const multiline = html.replace(/(?:\r\n|\r|\n)/g, '<br>');
    let xml = htmlToXml(multiline);
    xml = xml.replace(/#/g, '%23');
    return `${
      'data:image/svg+xml;charset=utf-8,' +
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `${
        name ? nameCss : descriptionCss
      }<foreignObject width="${width}" height="${height}">${xml}</foreignObject>` +
      `</svg>`
    }`;
  };

  useEffect(() => {
    let count = 0;
    const newImages = { ...images };
    const finishLoading = (): void => {
      setImages(newImages);
      setImagesLoaded(true);
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
    const image = new Image();
    image.onload = (): void => {
      setImages({
        ...images,
        art: image,
      });
    };
    image.src = meta.art;
  }, [meta.art]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx && fontsLoaded) {
        if (meta.name.length === 0) {
          setImages({
            ...images,
            name: null,
          });
        } else {
          const image = new Image();
          image.onload = (): void => {
            setImages({
              ...images,
              name: image,
            });
          };
          const name = meta.name.toLocaleUpperCase();
          const div = document.createElement('div');
          div.textContent = name;
          div.style.width = '565px';
          div.style.maxHeight = '1000px';
          div.style.fontSize = '34px';
          div.style.fontFamily = "'BeaufortBold', sans-serif";
          div.style.fontWeight = 'bold';
          div.style.lineHeight = '40px';
          div.style.textAlign = 'center';
          div.style.letterSpacing = '-0.7px';
          document.body.appendChild(div);
          setNameHeight(div.offsetHeight);
          document.body.removeChild(div);
          image.src = getHtmlToData(name, ctx, 580, 500, true);
          console.log(image.src);
        }
      }
    }
  }, [meta.name]);

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
          const description = meta.description
            .replace(/\[+([^\][]+)]+/g, '<span class="vocab">$1</span>')
            .replace(/{+([^}{]+)}+/g, '<span class="name">$1</span>');
          image.src = getHtmlToData(description, ctx, 580, 500, false);
          const div = document.createElement('div');
          div.innerHTML = description.replace(/(?:\r\n|\r|\n)/g, '<br>');
          div.style.width = '565px';
          div.style.maxHeight = '1000px';
          div.style.fontSize = '34px';
          div.style.fontFamily = "'Univers55', serif";
          div.style.fontWeight = 'bold';
          div.style.lineHeight = '40px';
          div.style.textAlign = 'center';
          div.style.letterSpacing = '-0.7px';
          document.body.appendChild(div);
          setDescriptionHeight(div.offsetHeight);
          // document.body.removeChild(div);
        }
      }
    }
  }, [meta.description]);

  useEffect(() => {
    if (fontsPreloaded) {
      loadFonts();
    }
  }, [fontsPreloaded]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && imagesLoaded && fontsLoaded) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const card = new Card(
          canvas,
          ctx,
          meta,
          images,
          descriptionHeight,
          nameHeight
        );
        card.draw();
      }
    }
  }, [fontsLoaded, imagesLoaded, images, meta]);

  return (
    <>
      <canvas ref={canvasRef} width={680} height={1024} />
    </>
  );
};

export default CardCanvas;
