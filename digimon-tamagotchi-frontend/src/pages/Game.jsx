import { useEffect, useRef } from "react";

const Game = () => {
  const canvasRef = useRef(null);
  const spriteImages = useRef({}); // 👉 useRef로 변경!

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const loadImages = (sources, callback) => {
      let loadedCount = 0;
      const totalImages = Object.keys(sources).length;

      Object.keys(sources).forEach((key) => {
        spriteImages.current[key] = new Image(); // 👈 .current 사용
        spriteImages.current[key].src = sources[key];
        spriteImages.current[key].onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            callback(); // 모든 이미지 로드 완료
          }
        };
      });
    };

    const imageSources = {
      background: "/images/162.png",
      digimon: "/images/225.png",
      numbers: "/images/140.png",
      attack: "/images/2.png",
    };

    const initGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(spriteImages.current.background, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(spriteImages.current.digimon, 50, 50, 100, 100);
    };

    loadImages(imageSources, initGame);
  }, []); // 빈 배열 그대로 둬도 경고 안 나옴!

  return <canvas ref={canvasRef} width={300} height={200} />;
};

export default Game;
