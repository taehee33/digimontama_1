// src/components/Canvas.jsx
import React, { useEffect, useRef } from "react";

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
  developerMode=false
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
    foodSizeScale,foodSprites,developerMode
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

    if(!frames || frames.length===0) frames=["210"];

    const imageSources={};
    frames.forEach((fn,idx)=>{
      imageSources[`digimon${idx}`] = `/images/${fn}.png`;
    });
    // food
    foodSprites.forEach((src,idx)=>{
      imageSources[`food${idx}`] = src;
    });

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
      spriteCache.current[key] = img;
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
          } else if(currentAnimation==="foodRejectRefuse"){
            // shift if needed
          }
          ctx.drawImage(digimonImg,digiX,(height-digiH)/2,digiW,digiH);

          if(developerMode){
            ctx.fillStyle="red";
            ctx.font="12px sans-serif";
            ctx.fillText(`Sprite: ${name}.png`, digiX,(height-digiH)/2 + digiH+12);
          }
        }
      }

      // 음식
      if(showFood && feedStep< foodSprites.length){
        const fKey= `food${feedStep}`;
        const fImg= spriteCache.current[fKey];
        if(fImg && fImg.naturalWidth>0){
          const fw= width*foodSizeScale, fh= height*foodSizeScale;
          const fx= width*0.2 - fw/2, fy= (height-fh)/2;
          ctx.drawImage(fImg, fx,fy,fw,fh);

          if(developerMode){
            ctx.fillStyle="blue";
            ctx.fillText(`Food: ${foodSprites[feedStep]}`, fx, fy+fh+12);
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