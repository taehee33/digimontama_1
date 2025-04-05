// src/components/Canvas.jsx
import React, { useEffect, useRef } from "react";

const Canvas = ({
  style={},
  width=300,
  height=200,
  // animation frames
  idleFrames=[],
  eatFrames=[],
  overfeedFrames=[],
  currentAnimation="idle", 
  showFood=false,
  feedStep=0,
  foodSizeScale=0.31,
  foodSprites=[],
  developerMode=false
}) => {
  const canvasRef= useRef(null);
  const spriteCache= useRef({});
  const animationID= useRef(null);

  useEffect(()=>{
    // clean up old anim
    if(animationID.current){
      cancelAnimationFrame(animationID.current);
      animationID.current= null;
    }
    initImages();
    return ()=>{
      if(animationID.current){
        cancelAnimationFrame(animationID.current);
      }
    };
  },[
    width,height,
    idleFrames,eatFrames,overfeedFrames,
    currentAnimation,showFood,feedStep,
    foodSizeScale,foodSprites,developerMode
  ]);

  function initImages(){
    const canvas= canvasRef.current;
    if(!canvas) return;
    const ctx= canvas.getContext("2d");
    canvas.style.imageRendering= "pixelated";

    // frames 결정
    let frames=[];
    if(currentAnimation==="eat"){
      frames= eatFrames;
    } else if(currentAnimation==="overfeed"){
      frames= overfeedFrames.length>0? overfeedFrames: eatFrames; 
    } else {
      frames= idleFrames;
    }
    if(!frames||frames.length===0) frames=["210.png"];

    // 로드할 이미지
    const imageSources= {};
    frames.forEach((fileName, idx)=>{
      imageSources[`digimon${idx}`]= `/images/${fileName}`;
    });
    // 음식
    foodSprites.forEach((src,idx)=>{
      imageSources[`food${idx}`]= src;
    });

    let loadedCount=0;
    const total= Object.keys(imageSources).length;
    if(total===0){
      // no images => 그냥 start anim
      startAnimation(ctx, frames);
      return;
    }

    Object.keys(imageSources).forEach(key=>{
      const img= new Image();
      img.src= imageSources[key];
      img.onload= ()=>{
        loadedCount++;
        if(loadedCount===total){
          startAnimation(ctx, frames);
        }
      };
      spriteCache.current[key]= img;
    });
  }

  function startAnimation(ctx, frames){
    let frame=0;
    const speed=25;

    function animate(){
      ctx.clearRect(0,0,width,height);

      // 디지몬
      if(frames.length>0){
        const frameIndex= Math.floor(frame/speed)% frames.length;
        const digimonKey= `digimon${frameIndex}`;
        const digimonImg= spriteCache.current[digimonKey];
        if(digimonImg){
          const digiW= width*0.4;
          const digiH= height*0.4;
          let digiX= (width-digiW)/2;
          if(currentAnimation==="eat"){
            digiX= width*0.6 - digiW/2;
          } else if(currentAnimation==="overfeed"){
            // 위치 같아도 됨
            // digiX= ...;
          }
          ctx.drawImage(digimonImg, digiX,(height-digiH)/2,digiW,digiH);

          if(developerMode){
            ctx.fillStyle="red";
            ctx.font="12px sans-serif";
            ctx.fillText(`Sprite: ${frames[frameIndex]}`, digiX,(height-digiH)/2+digiH+12);
          }
        }
      }

      // 음식
      if(showFood && feedStep< foodSprites.length){
        const foodKey= `food${feedStep}`;
        const foodImg= spriteCache.current[foodKey];
        if(foodImg){
          const foodW= width*foodSizeScale;
          const foodH= height*foodSizeScale;
          const foodX= width*0.2 - foodW/2;
          const foodY= (height-foodH)/2;
          ctx.drawImage(foodImg, foodX,foodY,foodW,foodH);

          if(developerMode){
            ctx.fillStyle="blue";
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
        position:"absolute",
        top:0,left:0,
        backgroundColor:"transparent",
        ...style
      }}
    />
  );
};

export default Canvas;