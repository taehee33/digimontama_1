import { useEffect, useRef } from "react";
import animationDefinitions from "../data/digimonAnimations";

const Canvas = ({ 
  selectedDigimon, 
  startNumber, 
  idleFrames, 
  eatFrames, 
  width = 300, 
  height = 200,
  currentAnimation = "idle",
  showFood,
  currentFoodIndex,
  foodSprites,
  developerMode,
  feedStep,
  foodSizeScale
}) => {
  const canvasRef = useRef(null);
  const spriteImages = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.style.imageRendering = "pixelated";

    // 로드할 이미지들
    const imageSources = {
      background: "/images/162.png", // 기본 배경 예시
    };

    // 애니메이션 프레임 (idle vs eat)
    const frames = (currentAnimation === "eat") ? eatFrames : idleFrames;
    frames.forEach((fileName, idx) => {
      imageSources[`digimon${idx}`] = `/images/${fileName}`;
    });

    // 음식 스프라이트
    foodSprites.forEach((src, idx) => {
      imageSources[`food${idx}`] = src;
    });

    let loadedCount = 0;
    const totalImages = Object.keys(imageSources).length;

    // 모든 이미지 로드
    Object.keys(imageSources).forEach((key) => {
      spriteImages.current[key] = new Image();
      spriteImages.current[key].src = imageSources[key];
      spriteImages.current[key].onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          initGame();
        }
      };
    });

    let frame = 0;
    const speed = 50;

    // 메인 루프
    const initGame = () => {
      const animate = () => {
        // 화면 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 테두리
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, width, height);

        // 배경
        ctx.drawImage(spriteImages.current.background, 0, 0, width, height);

        // 디지몬
        const currentFrameIndex = Math.floor(frame / speed) % frames.length;
        const currentFrame = spriteImages.current[`digimon${currentFrameIndex}`];

        const digimonWidth = width * 0.4;
        const digimonHeight = height * 0.4;

        // 먹기 모션 때 디지몬 살짝 오른쪽
        const digimonX = (currentAnimation === "eat")
          ? (width * 0.6 - digimonWidth / 2)
          : (width - digimonWidth) / 2;

        ctx.drawImage(
          currentFrame,
          digimonX,
          (height - digimonHeight) / 2,
          digimonWidth,
          digimonHeight
        );

        // 개발자 모드: 스프라이트 파일명 표시
        if (developerMode) {
          ctx.fillStyle = "red";
          ctx.font = "12px Arial";
          const spriteName = frames[currentFrameIndex]; // 파일명 (예: "210.png")
          ctx.fillText(`Sprite: ${spriteName}`, digimonX, (height - digimonHeight) / 2 + digimonHeight + 12);
        }

        // 음식
        if (showFood && feedStep < 4) {
          const foodImage = spriteImages.current[`food${feedStep}`];
          const foodWidth = width * foodSizeScale;
          const foodHeight = height * foodSizeScale;

          // 음식 위치 (왼쪽 측)
          const foodX = (width * 0.2) - (foodWidth / 2);
          const foodY = (height - foodHeight) / 2;

          ctx.drawImage(foodImage, foodX, foodY, foodWidth, foodHeight);

          // 개발자 모드: 음식 파일명 표시
          if (developerMode) {
            ctx.fillStyle = "blue";
            ctx.font = "12px Arial";
            ctx.fillText(
              `Food: ${foodSprites[feedStep]}`,
              foodX,
              foodY + foodHeight + 12
            );
          }
        }

        frame++;
        requestAnimationFrame(animate);
      };
      animate();
    };

  }, [
    selectedDigimon, 
    startNumber, 
    idleFrames, 
    eatFrames, 
    width, 
    height,
    currentAnimation,
    showFood,
    currentFoodIndex,
    foodSprites,
    developerMode,
    feedStep,
    foodSizeScale
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid black", margin: "20px" }}
    />
  );
};

export default Canvas;
