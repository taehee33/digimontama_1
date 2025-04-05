// src/components/Canvas.jsx
import React, { useEffect, useRef } from "react";

const poopSprite= "/images/533.png";  // 똥 스프라이트
const cleanSprite= "/images/534.png"; // 청소(빗자루 등) 스프라이트

// 배치 (8,6,4,2)위치가 top row, (7,5,3,1)이 bottom row
// #1 => bottom-right
// #2 => top-right
// #3 => bottom-2 from right
// #4 => top-2 from right
// ...
// 여기서는 xRatio(오른쪽->왼쪽), yRatio(아래->위)
const poopPositions = [
  { xRatio:0.75, yRatio:0.75 }, // #1 bottom-right
  { xRatio:0.75, yRatio:0.25 }, // #2 top-right
  { xRatio:0.55, yRatio:0.75 }, // #3
  { xRatio:0.55, yRatio:0.25 }, // #4
  { xRatio:0.35, yRatio:0.75 }, // #5
  { xRatio:0.35, yRatio:0.25 }, // #6
  { xRatio:0.15, yRatio:0.75 }, // #7
  { xRatio:0.15, yRatio:0.25 }, // #8
];

const Canvas = ({
  style={},
  width=300,
  height=200,
  // frames
  idleFrames=[],
  eatFrames=[],
  foodRejectFrames=[],
  currentAnimation="idle",
  showFood=false,
  feedStep=0,
  foodSizeScale=0.31,
  foodSprites=[],
  developerMode=false,

  // ★ (1) poop
  poopCount=0,
  // ★ (2) 청소 애니메이션
  showPoopCleanAnimation=false,
  cleanStep=0,
}) => {
  const canvasRef= useRef(null);
  const spriteCache= useRef({});
  const animationID= useRef(null);

  useEffect(()=>{
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
    idleFrames,eatFrames,foodRejectFrames,
    currentAnimation,showFood,feedStep,
    foodSizeScale,foodSprites,developerMode,
    poopCount,showPoopCleanAnimation,cleanStep
  ]);

  function initImages(){
    const canvas= canvasRef.current;
    if(!canvas) return;
    const ctx= canvas.getContext("2d");
    canvas.style.imageRendering= "pixelated";

    let frames=[];
    if(currentAnimation==="eat"){
      frames= eatFrames;
    } else if(currentAnimation==="foodRejectRefuse"){
      frames= foodRejectFrames.length>0 ? foodRejectFrames : ["14"];
    } else {
      frames= idleFrames;
    }
    if(!frames || frames.length===0) frames=["210"]; // fallback

    // ★ (3) 로드할 이미지들
    const imageSources={};
    frames.forEach((fn,idx)=>{
      imageSources[`digimon${idx}`] = `/images/${fn}.png`;
    });
    foodSprites.forEach((src,idx)=>{
      imageSources[`food${idx}`]= src;
    });

    // poop, clean
    imageSources["poop"]= poopSprite;    // "/images/533.png"
    imageSources["clean"]= cleanSprite;  // "/images/534.png"

    let loaded=0;
    const total= Object.keys(imageSources).length;
    if(total===0){
      startAnimation(ctx, frames);
      return;
    }

    Object.keys(imageSources).forEach(key=>{
      const img= new Image();
      img.src= imageSources[key];
      img.onload= ()=>{
        loaded++;
        if(loaded=== total){
          startAnimation(ctx, frames);
        }
      };
      img.onerror= ()=>{
        console.warn("Fail to load:", imageSources[key]);
        loaded++;
        if(loaded=== total){
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
        const idx= Math.floor(frame/speed)% frames.length;
        const name= frames[idx];
        const key= `digimon${idx}`;
        const digimonImg= spriteCache.current[key];
        if(digimonImg && digimonImg.naturalWidth>0){
          const digiW= width*0.4;
          const digiH= height*0.4;
          let digiX= (width-digiW)/2;
          if(currentAnimation==="eat"){
            digiX= width*0.6 - digiW/2;
          }
          ctx.drawImage(digimonImg, digiX,(height-digiH)/2,digiW,digiH);

          if(developerMode){
            ctx.fillStyle="red";
            ctx.font="12px sans-serif";
            ctx.fillText(`Sprite: ${name}.png`, digiX,(height-digiH)/2 + digiH+12);
          }
        }
      }

      // 음식
      if(showFood && feedStep<foodSprites.length){
        const fKey= `food${feedStep}`;
        const fImg= spriteCache.current[fKey];
        if(fImg && fImg.naturalWidth>0){
          const fw= width*foodSizeScale;
          const fh= height*foodSizeScale;
          const fx= width*0.2 - fw/2;
          const fy= (height-fh)/2;
          ctx.drawImage(fImg, fx,fy,fw,fh);

          if(developerMode){
            ctx.fillStyle="blue";
            ctx.fillText(`Food: ${foodSprites[feedStep]}`, fx, fy+fh+12);
          }
        }
      }

      // ★ (4) 똥 표시
      const poopImg= spriteCache.current["poop"];
      if(poopImg && poopImg.naturalWidth>0){
        // poopCount => 0..8
        // 예) i=0 => #1 => poopPositions[0], ...
        // i<poopCount => 1..poopCount
        for(let i=0; i<poopCount; i++){
          const pos= poopPositions[i];
          const px= pos.xRatio*width;
          const py= pos.yRatio*height;
          const pw= width*0.2; // 똥 크기 (임의)
          const ph= height*0.2;
          ctx.drawImage(poopImg, px - pw/2, py - ph/2, pw,ph);

          if(developerMode){
            ctx.fillStyle="purple";
            ctx.fillText(`Poop#${i+1}`, px - pw/2, (py - ph/2)-2);
          }
        }
      }

      // ★ (5) 청소 애니메이션
      
      if(showPoopCleanAnimation){
        // cleanStep: 0..3
        // ex) step=0 => x=width => step=3 => x=width*0.1
        const cImg= spriteCache.current["clean"];
        if(cImg && cImg.naturalWidth>0){
          const sw= width*0.3, sh= height*0.25;
          // 예) step=0 => x= width => step=3 => x= ~width*0.1
          const steps=4;
          const ratio= (cleanStep/(steps-1));
          const xPos= width*(1 - 0.9* ratio);
          const yPos= height*0.4;

          ctx.drawImage(cImg,xPos,yPos, sw,sh);

          if(developerMode){
            ctx.fillStyle="orange";
            ctx.fillText(`CleanStep=${cleanStep}`, xPos,yPos-5);
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