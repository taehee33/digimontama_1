import { useEffect, useRef } from "react";

const Canvas = ({ selectedDigimon, startNumber, idleFrames, width = 300, height = 200 }) => {
  const canvasRef = useRef(null);
  const spriteImages = useRef({});
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 픽셀 깨짐 방지
    canvas.style.imageRendering = "pixelated";

    const imageSources = {
      background: "/images/162.png",
    };

    idleFrames.forEach((fileName, idx) => {
      imageSources[`idle${idx}`] = `/images/${fileName}`;
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
    const speed = 50; // 속도 조정

    const initGame = () => {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 게임 화면 테두리 그리기
        ctx.strokeStyle = "#000000";  // 테두리 색상 (검정)
        ctx.lineWidth = 5;  // 테두리 두께
        ctx.strokeRect(0, 0, width, height);  // 게임 화면 테두리

        // 배경 이미지 그리기
        ctx.drawImage(spriteImages.current.background, 0, 0, canvas.width, canvas.height);

        const currentFrameIndex = Math.floor(frame / speed) % idleFrames.length;
        const currentFrame = spriteImages.current[`idle${currentFrameIndex}`];

        // 디지몬 크기를 canvas 크기의 40%로 비율 조정
        const digimonWidth = width * 0.4;
        const digimonHeight = height * 0.4;

        ctx.drawImage(
          currentFrame,
          (width - digimonWidth) / 2, // 가운데 정렬
          (height - digimonHeight) / 2,
          digimonWidth,
          digimonHeight
        );

        frame++;
        requestAnimationFrame(animate);
      };
      animate();
    };

    // 게임 화면을 7등분 하기
    const divideScreen = () => {
      const verticalSections = 7;
      const sectionHeight = height / verticalSections;

      // 7등분된 구역에 구분선 그리기
      ctx.strokeStyle = "#FF0000";  // 구분선 색상 (빨강)
      ctx.lineWidth = 2;  // 구분선 두께
      for (let i = 1; i < verticalSections; i++) {
        const yPosition = sectionHeight * i;
        ctx.beginPath();
        ctx.moveTo(-10, yPosition);  // 화면 왼쪽 끝 (테두리 밖으로 나오게 함)
        ctx.lineTo(width + 10, yPosition);  // 화면 오른쪽 끝 (테두리 밖으로 나오게 함)
        ctx.stroke();
      }
    };

    // 구분선 그리기
    divideScreen();

  }, [selectedDigimon, startNumber, idleFrames, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid black", margin: "20px" }}  // 테두리 및 여백 설정
    />
  );
};

export default Canvas;
