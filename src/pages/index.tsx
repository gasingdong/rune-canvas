import React, { useRef, useEffect, useState } from 'react';
import frames from '../assets/frames.png';
import regions from '../assets/regions.png';
import { Rarity } from '../utility/card-enums';
import Region from '../utility/region';
import 'normalize.css';
import '../stylesheets/main.scss';

interface Options {
  scale: number;
  offsetX: number;
  offsetY: number;
}

const Home: React.FC = () => {
  const [rarity, setRarity] = useState<Rarity>(Rarity.COMMON);
  const [region, setRegion] = useState<Region>(Region.RUNETERRA);
  const [sources, setSources] = useState<Record<string, never | string>>({
    frames,
    regions,
  });
  const [options, setOptions] = useState<Options>({
    scale: 1.0,
    offsetX: 0,
    offsetY: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const updateScale = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOptions({
      ...options,
      scale: parseFloat(event.target.value),
    });
  };

  const updateOffset = (
    event: React.ChangeEvent<HTMLInputElement>,
    flag: boolean
  ): void => {
    setOptions({
      ...options,
      offsetX: flag ? options.offsetX : parseFloat(event.target.value),
      offsetY: flag ? parseFloat(event.target.value) : options.offsetY,
    });
  };

  const updateContentImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { files } = event.target;

    if (files) {
      const file = files.item(0);

      if (file) {
        const reader = new FileReader();
        reader.onloadend = (e: ProgressEvent<FileReader>): void => {
          if (e?.target?.result) {
            setSources({ ...sources, content: e.target.result.toString() });
          }
        };
        reader.readAsDataURL(file);
      }
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

          if (images.content) {
            const contentRatio = images.content.height / images.content.width;
            ctx.drawImage(
              images.content,
              0,
              0,
              images.content.width,
              images.content.height,
              0 + options.offsetX,
              0 + options.offsetY,
              canvas.width * options.scale,
              canvas.width * contentRatio * options.scale
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
        Object.entries(sources).forEach((entry) => {
          const [id, src] = entry;
          const image = new Image();
          image.onload = (): void => {
            count += 1;

            if (count === Object.keys(sources).length) {
              finishLoading();
            }
          };
          image.src = src;
          images[id] = image;
        });
      }
    }
  }, [rarity, region, sources, options]);

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
        <input
          type="file"
          accept="image/*"
          onChange={updateContentImage}
          multiple={false}
        />
        <input
          id="scale"
          type="number"
          value={options.scale}
          onChange={updateScale}
          min={0.01}
          step={0.01}
        />
        <input
          id="offsetX"
          type="number"
          value={options.offsetX}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            updateOffset(e, false)
          }
          min={0.0}
          step={1}
        />
        <input
          id="offsetY"
          type="number"
          value={options.offsetY}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            updateOffset(e, true)
          }
          min={0.0}
          step={1}
        />
      </div>
    </main>
  );
};

export default Home;
