import React, { useRef, useEffect } from 'react';
import frames from '../assets/frames.png';

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const image = new Image();
        image.onload = (): void => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            image,
            0,
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
  }, []);

  return <canvas ref={canvasRef} width={700} height={1000} />;
};

export default Home;
