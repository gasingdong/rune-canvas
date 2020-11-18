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
  const images = {
    frames,
    regions,
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const loadedImages: { [key: string]: HTMLImageElement } = {};
        let count = 0;
        const finishLoading = (): void => {
          const card = new Card(canvas, ctx, config, loadedImages);
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
  return <canvas ref={canvasRef} width={680} height={1024} />;
};

export default CardCanvas;
