// src/components/Canvas.jsx
import { useEffect, useRef } from "react";

const Canvas = ({
  style={},
  width=300,
  height=200,
  backgroundNumber=162,
  idleFrames=[],
  eatFrames=[],
  currentAnimation="idle",
  showFood=false,
  feedStep=0,
  foodSizeScale=0.31,
  foodSprites=[],
  developerMode=false
}) => {
  const canvasRef = useRef(null);
  const spriteCache = useRef({});
  const animationID = useRef(null);

  // 이 로직은 deps(여러 props) 변화 시마다 다시 실행 -> 이전 애니 루프 취소 + 새로 로드
  useEffect(() => {
    if(animationID.current){
      cancelAnimationFrame(animationID.current);
      animationID.current= null;
    }
    initImages(); // re-init
    return ()=>{
      if(animationID.current){
        cancelAnimationFrame(animationID.current);
      }
    };
  },[
    width, height, idleFrames, eatFrames,
    currentAnimation, showFood, feedStep,
    foodSizeScale, foodSprites, developerMode
  ]);

  function initImages(){
    const canvas= canvasRef.current;
    if(!canvas) return;
    const ctx= canvas.getContext("2d");
    canvas.style.imageRendering="pixelated";

    // frames
    const frames = (currentAnimation==="eat")? eatFrames: idleFrames;
    const imageSources = {};

    frames.forEach((fileName, idx)=>{
      imageSources[`digimon${idx}`] = `/images/${fileName}`;
    });
    foodSprites.forEach((src, idx)=>{
      imageSources[`food${idx}`] = src;
    });

    let loadedCount=0;
    const total= Object.keys(imageSources).length;

    Object.keys(imageSources).forEach(key=>{
      const img = new Image();
      img.src= imageSources[key];
      img.onload=()=>{
        loadedCount++;
        if(loadedCount===total){
          // start anim
          startAnimation(ctx, frames);
        }
      };
      spriteCache.current[key]= img;
    });
  }

  function startAnimation(ctx, frames){
    let frame=0;
    const speed=25; // bigger => slower

    function animate(){
      ctx.clearRect(0,0,width,height);

      // (A) 디지몬
      if(frames.length>0){
        const frameIndex= Math.floor(frame/speed)% frames.length;
        const key = `digimon${frameIndex}`;
        const img = spriteCache.current[key];
        if(img){
          const digiW= width*0.4;
          const digiH= height*0.4;
          let digiX= (width-digiW)/2;
          if(currentAnimation==="eat"){
            digiX= width*0.6 - digiW/2;
          }
          ctx.drawImage(img, digiX,(height-digiH)/2, digiW,digiH);

          if(developerMode){
            ctx.fillStyle="red";
            ctx.font="12px sans-serif";
            ctx.fillText(`Sprite: ${frames[frameIndex]}`, digiX,(height-digiH)/2 + digiH+12);
          }
        }
      }

      // (B) 음식
      if(showFood && feedStep<4){
        const foodKey= `food${feedStep}`;
        const foodImg= spriteCache.current[foodKey];
        if(foodImg){
          const foodW= width*foodSizeScale;
          const foodH= height*foodSizeScale;
          const foodX= width*0.2 - foodW/2;
          const foodY= (height-foodH)/2;
          ctx.drawImage(foodImg, foodX,foodY, foodW,foodH);

          if(developerMode){
            ctx.fillStyle="blue";
            ctx.font="12px sans-serif";
            ctx.fillText(`Food: ${foodSprites[feedStep]}`, foodX, foodY+foodH+12);
          }
        }
      }

      frame++;
      animationID.current= requestAnimationFrame(animate);
    }
    animate();
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        backgroundColor:"transparent",
        position:"absolute",
        top:0,
        left:0,
        ...style
      }}
    />
  );
};

export default Canvas;