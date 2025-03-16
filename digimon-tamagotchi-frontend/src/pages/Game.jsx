import { useEffect, useRef, useState } from "react";
import digimonData from "../data/digimonData";
import animationDefinitions from "../data/digimonAnimations";

const Game = () => {
  const canvasRef = useRef(null);
  const spriteImages = useRef({});
  const [selectedDigimon, setSelectedDigimon] = useState("Botamon");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const selectedData = digimonData[selectedDigimon];
    if (!selectedData) {
      console.error(`No data found for ${selectedDigimon}`);
      return;
    }

    const { startNumber } = selectedData;

    const imageSources = {
      background: "/images/162.png", // 배경 고정
    };

    // idle 애니메이션 프레임 계산
    const idleFrames = animationDefinitions[1].frames.map(
      (offset) => `${startNumber + offset}.png`
    );

    // 이미지 경로 준비
    idleFrames.forEach((fileName, idx) => {
      imageSources[`idle${idx}`] = `/images/${fileName}`;
    });

    // 이미지 로드 함수
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
    const speed = 50; // 속도 조절 (숫자가 클수록 느림)

    const initGame = () => {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(spriteImages.current.background, 0, 0, canvas.width, canvas.height);

        const currentFrameIndex = Math.floor(frame / speed) % idleFrames.length;
        const currentFrame = spriteImages.current[`idle${currentFrameIndex}`];
        ctx.drawImage(currentFrame, 100, 80, 80, 80);

        frame++;
        requestAnimationFrame(animate);
      };

      animate();
    };

    loadImages(imageSources, initGame);
  }, [selectedDigimon]);

  return (
    <div>
      <select
        value={selectedDigimon}
        onChange={(e) => setSelectedDigimon(e.target.value)}
      >
        {Object.keys(digimonData).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <canvas ref={canvasRef} width={300} height={200} />
    </div>
  );
};

export default Game;
