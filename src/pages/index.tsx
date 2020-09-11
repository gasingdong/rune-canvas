import React, { useRef, useEffect, useState } from 'react';
import frames from '../assets/frames.png';
import { Rarity } from '../utility/card-enums';

const Home: React.FC = () => {
  const [rarity, setRarity] = useState<Rarity>(Rarity.COMMON);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateRarity = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    let newRarity = null;
    const selectedRarity = event.target.value;

    switch (selectedRarity) {
      case 'rare':
        newRarity = Rarity.RARE;
        break;
      case 'epic':
        newRarity = Rarity.EPIC;
        break;
      case 'none':
        newRarity = Rarity.NONE;
        break;
      default:
        newRarity = Rarity.COMMON;
    }
    setRarity(newRarity);
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
        const image = new Image();
        image.onload = (): void => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const xDiff = sprites[rarity];
          ctx.drawImage(
            image,
            xDiff,
            0,
            653,
            image.height,
            0,
            0,
            653 * 0.5,
            image.height * 0.5
          );
        };
        image.onerror = (e): void => console.log(e);
        image.src = frames;
      }
    }
  }, [rarity]);

  return (
    <>
      <canvas ref={canvasRef} width={350} height={600} />
      <div className="controls">
        <select
          name="rarity"
          id="rarity"
          onChange={updateRarity}
          value={rarity}
        >
          <option value={Rarity.COMMON}>Common</option>
          <option value={Rarity.RARE}>Rare</option>
          <option value={Rarity.EPIC}>Epic</option>
          <option value={Rarity.NONE}>None</option>
        </select>
      </div>
    </>
  );
};

export default Home;
