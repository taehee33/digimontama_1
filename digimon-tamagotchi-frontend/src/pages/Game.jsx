import { useEffect, useRef } from "react";
import digimonStartNumber from "../data/digimonStartNumber";
import digimonAnimations from "../data/digimonAnimations";

const Game = () => {
  const canvasRef = useRef(null);
  const spriteImages = useRef({});

  const digimon = "botamon";
  const startNumber = digimonStartNumber[digimon];

  const animations = {};
  Object.keys(digimonAnimations).forEach((key) => {
    animations[key] = digimonAnimations[key].map(
      (offset) => `/images/${startNumber + offset}.png`
    );
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 현재 애니메이션 상태
    const currentAnimation = "1_idle";
    const currentFrames = animations[currentAnimation];

    const imageSources = {};
    currentFrames.forEach((src, index) => {
      imageSources[`frame${index}`] = src;
    });

    const loadImages = (sources, callback) => {
      let loadedCount = 0;
      const totalImages = Object.keys(sources).length;

      Object.keys(sources).forEach((key) => {
        spriteImages.current[key] = new Image();
        spriteImages.current[key].src = sources[key];
        spriteImages.current[key].onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            callback();
          }
        };
      });
    };

    let frame = 0;

    const initGame = () => {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 디지몬 애니메이션 (n프레임 루프)
        const currentFrame = spriteImages.current[`frame${frame % currentFrames.length}`];
        ctx.drawImage(currentFrame, 100, 80, 80, 80);

        frame++;
        requestAnimationFrame(animate);
      };

      animate();
    };

    loadImages(imageSources, initGame);
  }, []);

  return <canvas ref={canvasRef} width={300} height={200} />;
};

export default Game;
