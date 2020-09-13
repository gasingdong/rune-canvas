import React, { useRef, useEffect, useState } from 'react';
import frames from '../assets/frames.png';
import regions from '../assets/regions.png';
import { Rarity } from '../utility/card-enums';
import Region from '../utility/region';
import 'normalize.css';
import '../stylesheets/main.scss';

const Home: React.FC = () => {
  const [rarity, setRarity] = useState<Rarity>(Rarity.COMMON);
  const [region, setRegion] = useState<Region>(Region.RUNETERRA);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageSources: { [key: string]: never } = {
    frames,
    regions,
  };

  const updateRarity = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const matching = Object.values(Rarity).filter(
      (element) => element === event.target.value
    );

    if (matching.length > 0) {
      setRarity(matching[0]);
    }
  };

  const updateRegion = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedRegion = Region.getRegion(event.target.value);

    if (selectedRegion) {
      setRegion(selectedRegion);
    }
  };

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
          const xDiff = sprites[rarity];
          const ratio = images.frames.height / 653;
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
            region.position[0],
            region.position[1],
            128,
            128,
            132,
            400,
            128 * 0.4,
            128 * 0.4
          );
        };
        Object.entries(imageSources).forEach((entry) => {
          const [id, src] = entry;
          const image = new Image();
          image.onload = (): void => {
            count += 1;

            if (count === Object.keys(imageSources).length) {
              finishLoading();
            }
          };
          image.src = src;
          images[id] = image;
        });
      }
    }
  }, [rarity, region]);

  return (
    <main className="container">
      <canvas ref={canvasRef} width={327} height={500} />
      <div className="controls">
        <select
          name="rarity"
          id="rarity"
          onChange={updateRarity}
          value={rarity}
        >
          {Object.values(Rarity).map((element) => (
            <option key={element} value={element}>
              {element.charAt(0).toUpperCase() + element.slice(1)}
            </option>
          ))}
        </select>
        <select
          name="region"
          id="region"
          onChange={updateRegion}
          value={region.toString()}
        >
          {Region.getRegions().map((element) => (
            <option key={element.toString()} value={element.toString()}>
              {element.name}
            </option>
          ))}
        </select>
      </div>
    </main>
  );
};

export default Home;
