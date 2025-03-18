import { useEffect, useRef } from "react";

const Canvas = ({ 
  selectedDigimon, 
  startNumber, 
  idleFrames, 
  eatFrames, 
  width = 300, 
  height = 200,
  currentAnimation,
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

    const imageSources = {
      background: "/images/162.png",
    };

    // Digimon 프레임 로드
    const frames = currentAnimation === "eat" ? eatFrames : idleFrames;
    frames.forEach((fileName, idx) => {
      imageSources[`digimon${idx}`] = `/images/${fileName}`;
    });

    // 음식 이미지 로드
    foodSprites.forEach((src, idx) => {
      imageSources[`food${idx}`] = src;
    });

    let loadedCount = 0;
    const totalImages = Object.keys(imageSources).length;

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

    const initGame = () => {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 테두리
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, width, height);

        // 배경
        ctx.drawImage(spriteImages.current.background, 0, 0, width, height);

        // Digimon
        const currentFrameIndex = Math.floor(frame / speed) % frames.length;
        const currentFrame = spriteImages.current[`digimon${currentFrameIndex}`];

        const digimonWidth = width * 0.4;
        const digimonHeight = height * 0.4;

        const digimonX = (currentAnimation === "eat")
          ? (width * 0.6 - digimonWidth / 2) // 먹기 모션 때 오른쪽
          : (width - digimonWidth) / 2; // 평상시 중앙

        ctx.drawImage(
          currentFrame,
          digimonX,
          (height - digimonHeight) / 2,
          digimonWidth,
          digimonHeight
        );

        // 스프라이트 번호 표시
        if (developerMode) {
          ctx.fillStyle = "red";
          ctx.font = "12px Arial";
          ctx.fillText(`${frames[currentFrameIndex]}`, digimonX, (height - digimonHeight) / 2 + digimonHeight + 12);
        }

        // 음식
        if (showFood && feedStep < 4) {
          const foodImage = spriteImages.current[`food${feedStep}`];
          const foodWidth = width * foodSizeScale;
          const foodHeight = height * foodSizeScale;
          ctx.drawImage(
            foodImage,
            (width * 0.2 - foodWidth / 2),
            (height - foodHeight) / 2,
            foodWidth,
            foodHeight
          );

          // 음식 스프라이트 번호
          if (developerMode) {
            ctx.fillStyle = "blue";
            ctx.font = "12px Arial";
            ctx.fillText(`Food: ${foodSprites[feedStep]}`, width * 0.2 - 30, (height - foodHeight) / 2 + foodHeight + 12);
          }
        }

        frame++;
        requestAnimationFrame(animate);
      };
      animate();
    };

  }, [selectedDigimon, startNumber, idleFrames, eatFrames, width, height, currentAnimation, showFood, currentFoodIndex, foodSprites, developerMode, feedStep, foodSizeScale]);

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
