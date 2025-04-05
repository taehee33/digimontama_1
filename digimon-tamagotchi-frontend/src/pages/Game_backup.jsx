// src/pages/Game.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import digimonAnimations from "../data/digimonAnimations";
import Canvas from "../components/Canvas";
import MenuIconButtons from "../components/MenuIconButtons";
import StatsPanel from "../components/StatsPanel";
import StatsPopup from "../components/StatsPopup";
import FeedPopup from "../components/FeedPopup";
import SettingsModal from "../components/SettingsModal";
import { initializeStats, updateLifespan } from "../data/stats";

const ver1DigimonList= ["Digitama","Botamon","Koromon","Agumon","Betamon"];
const perfectStages= ["Perfect","Ultimate","SuperUltimate"];

function Game(){
  const { slotId }= useParams();
  const navigate= useNavigate();

  const [mod, setMod]= useState(null);

  const [selectedDigimon, setSelectedDigimon]= useState("Digitama");
  const [digimonStats, setDigimonStats]= useState(initializeStats("Digitama"));

  // 사망 확인
  const [showDeathConfirm, setShowDeathConfirm]= useState(false);

  // slot info
  const [slotName, setSlotName]= useState("");
  const [slotCreatedAt, setSlotCreatedAt]= useState("");
  const [slotDevice, setSlotDevice]= useState("");
  const [slotVersion, setSlotVersion]= useState("");

  const [width, setWidth]= useState(300);
  const [height, setHeight]= useState(200);
  const [currentAnimation, setCurrentAnimation]= useState("idle");
  const [backgroundNumber, setBackgroundNumber]= useState(162);

  const [showStatsPopup, setShowStatsPopup]= useState(false);
  const [showFeedPopup, setShowFeedPopup]= useState(false);
  const [showSettingsModal, setShowSettingsModal]= useState(false);
  const [activeMenu, setActiveMenu]= useState(null);

  const [developerMode, setDeveloperMode]= useState(false);

  const [customTime, setCustomTime]= useState(new Date());
  const [timeSpeed, setTimeSpeed]= useState(1);

  const [feedType, setFeedType]= useState(null);
  const [showFood, setShowFood]= useState(false);
  const [feedStep, setFeedStep]= useState(0);
  const [foodSizeScale, setFoodSizeScale]= useState(0.31);

  const meatSprites= ["/images/526.png","/images/527.png","/images/528.png","/images/529.png"];
  const proteinSprites= ["/images/530.png","/images/531.png","/images/532.png"];

  // 1) load
  useEffect(()=>{
    if(!slotId) return;
    const sName= localStorage.getItem(`slot${slotId}_slotName`)||`슬롯${slotId}`;
    const sCreated= localStorage.getItem(`slot${slotId}_createdAt`)||"";
    const sDev= localStorage.getItem(`slot${slotId}_device`)||"";
    const sVer= localStorage.getItem(`slot${slotId}_version`)||"Ver.1";
    setSlotName(sName);setSlotCreatedAt(sCreated);
    setSlotDevice(sDev);setSlotVersion(sVer);

    loadVersionModule(sVer).then(module=>{
      setMod(module);
      const savedName= localStorage.getItem(`slot${slotId}_selectedDigimon`)||"Digitama";
      const savedStatsStr= localStorage.getItem(`slot${slotId}_digimonStats`);
      if(savedStatsStr){
        const parsed= JSON.parse(savedStatsStr);
        if(Object.keys(parsed).length===0){
          const ns= module.initializeStats("Digitama");
          setSelectedDigimon("Digitama");
          setDigimonStats(ns);
        } else {
          setSelectedDigimon(savedName);
          setDigimonStats(parsed);
        }
      } else {
        const ns= module.initializeStats("Digitama");
        setSelectedDigimon("Digitama");
        setDigimonStats(ns);
      }
    });
  },[slotId]);

  async function loadVersionModule(ver){
    if(ver==="Ver.1"){
      return await import("../data/digimondata_digitalmonstercolor25th_ver1.js");
    }
    return await import("../data/digimondata_digitalmonstercolor25th_ver1.js");
  }

  // 2) 매초 update
  useEffect(()=>{
    if(!mod) return;
    const timer= setInterval(()=>{
      setDigimonStats(prev=>{
        if(prev.isDead) return prev;
        const updated= updateLifespan(prev,1);
        // 사망 => showDeathConfirm
        if(!prev.isDead && updated.isDead){
          setShowDeathConfirm(true);
        }
        return updated;
      });
    },1000);

    const clockT= setInterval(()=>{
      setCustomTime(new Date());
    },1000);

    return ()=>{
      clearInterval(timer);
      clearInterval(clockT);
    };
  },[mod]);

  // 3) 저장
  useEffect(()=>{
    if(!slotId||!mod) return;
    localStorage.setItem(`slot${slotId}_selectedDigimon`, selectedDigimon);
    localStorage.setItem(`slot${slotId}_digimonStats`, JSON.stringify(digimonStats));
  },[slotId, mod, selectedDigimon, digimonStats]);

  // (A) frames
  let idleAnimId=1; 
  let eatAnimId=2;
  if(selectedDigimon==="Digitama") idleAnimId=90;

  const idleOffset= digimonAnimations[idleAnimId]?.frames||[0];
  const eatOffset= digimonAnimations[eatAnimId]?.frames||[0];

  let idleFrames= idleOffset.map(off=> `${digimonStats.sprite+off}.png`);
  let eatFrames= eatOffset.map(off=> `${digimonStats.sprite+off}.png`);

  // 사망 => sprite+15
  if(digimonStats.isDead){
    idleFrames= [`${digimonStats.sprite+15}.png`];
    eatFrames= [`${digimonStats.sprite+15}.png`];
  }

  // (B) evolution
  function canEvolve(){
    if(!mod) return false;
    if(digimonStats.isDead) return false;
    if(!mod.evolutionConditions) return false;
    if(developerMode) return true;
    const evo= mod.evolutionConditions[selectedDigimon];
    if(!evo) return false;
    for(let e of evo.evolution){
      if(e.condition.check(digimonStats)) return true;
    }
    return false;
  }

  function handleEvolutionButton(){
    if(!mod) return;
    if(!canEvolve()) return;
    const arr= mod.evolutionConditions[selectedDigimon]?.evolution||[];
    if(developerMode && arr.length>0){
      handleEvolution(arr[0].next);
    } else {
      for(let e of arr){
        if(e.condition.check(digimonStats)){
          handleEvolution(e.next);
          break;
        }
      }
    }
  }

  function handleEvolution(newName){
    if(!mod) return;
    const old= {...digimonStats};
    const next= mod.initializeStats(newName);
    // lifespan carry over
    next.lifespanSeconds= old.lifespanSeconds;
    setSelectedDigimon(newName);
    setDigimonStats(next);
  }

  // (C) 사망확인
  function handleDeathConfirm(){
    // stage => if Perfect/Ultimate => ohakadamon2, else ohakadamon1
    let ohakaName= "Ohakadamon1";
    if(perfectStages.includes(digimonStats.evolutionStage)){
      ohakaName= "Ohakadamon2";
    }
    if(mod){
      const old= {...digimonStats};
      const next= mod.initializeStats(ohakaName);
      next.lifespanSeconds= old.lifespanSeconds;
      setSelectedDigimon(ohakaName);
      setDigimonStats(next);
    }
    setShowDeathConfirm(false);
  }

  // (D) feed
  function handleFeed(type){
    if(digimonStats.isDead){
      console.log("사망 => 먹이 불가");
      return;
    }
    setFeedType(type);
    setFeedStep(0);
    setShowFood(true);
    feedCycle(0,type);
  }

  function feedCycle(step,type){
    const maxFrame = (type==="protein"? 3:4);
    if(step>=maxFrame){
      setCurrentAnimation("idle");
      setShowFood(false);
      setDigimonStats(prev=>{
        // 오버피드?
        let newStats={ ...prev };
        let over=0;
        if(newStats.fullness>5){
          over=newStats.fullness-5;
        }
        if(over>= newStats.maxOverfeed){
          setCurrentAnimation("overfeed"); // => animId=3 => frames=[10]
          return newStats; // no changes
        }
        if(type==="meat"){
          newStats.fullness++;
          newStats.weight++;
        } else {
          // protein
          newStats.fullness +=2;
          newStats.health++;
          newStats.weight +=2;
        }
        return newStats;
      });
      return;
    }
    setCurrentAnimation("eat");
    setFeedStep(step);
    setTimeout(()=> feedCycle(step+1,type), 500);
  }

  // (E) reset
  function resetDigimon(){
    if(!slotId) return;
    if(window.confirm("정말로 초기화?")){
      localStorage.removeItem(`slot${slotId}_selectedDigimon`);
      localStorage.removeItem(`slot${slotId}_digimonStats`);
      if(mod){
        const ns= mod.initializeStats("Digitama");
        setSelectedDigimon("Digitama");
        setDigimonStats(ns);
      } else {
        setSelectedDigimon("Digitama");
        setDigimonStats({});
      }
      setShowDeathConfirm(false);
    }
  }

  // helpers
  const goSelect=()=> navigate("/select");
  const isEvoEnabled= canEvolve();

  function formatTimeToEvolveSec(sec=0){
    const m= Math.floor(sec/60);
    const s= sec%60;
    return `${m}m ${s}s`;
  }
  function formatLifespan(sec=0){
    const d= Math.floor(sec/86400);
    const remainder= sec%86400;
    const mm= Math.floor(remainder/60);
    const ss= remainder%60;
    return `${d} day, ${mm} min, ${ss} sec`;
  }

  // dev => change stats from StatsPopup
  function handleChangeStats(newStats){
    setDigimonStats(newStats);
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-200">
      <h2 className="text-lg font-bold mb-2">슬롯 {slotId} - {selectedDigimon}</h2>
      <p>슬롯 이름: {slotName}</p>
      <p>생성일: {slotCreatedAt}</p>
      <p>기종: {slotDevice} / 버전: {slotVersion}</p>

      <button onClick={goSelect} className="mb-2 px-3 py-1 bg-gray-400 text-white rounded">
        ← Select 화면
      </button>

      <div style={{position:"relative", width, height, border:"2px solid #555"}}>
        <img
          src={`/images/${backgroundNumber}.png`}
          alt="bg"
          style={{
            position:"absolute", top:0,left:0,
            width:"100%",height:"100%", zIndex:1, imageRendering:"pixelated"
          }}
        />
        <Canvas
          style={{position:"absolute", top:0,left:0,zIndex:2}}
          width={width}
          height={height}
          currentAnimation={currentAnimation}
          idleFrames={idleFrames}
          eatFrames={eatFrames}
          showFood={showFood}
          feedStep={feedStep}
          foodSizeScale={foodSizeScale}
          foodSprites={(feedType==="protein")? proteinSprites: meatSprites}
        />
      </div>

      {/* Evolution btn */}
      <button
        onClick={handleEvolutionButton}
        disabled={!isEvoEnabled}
        className={`mt-2 px-4 py-2 text-white rounded ${isEvoEnabled? "bg-green-500":"bg-gray-500"}`}
      >
        Evolution
      </button>

      {/* 사망 확인 */}
      {showDeathConfirm && (
        <div className="mt-4 bg-red-100 p-2 rounded">
          <p className="text-red-600 font-bold">디지몬이 사망했습니다! 사망 확인?</p>
          <button
            onClick={handleDeathConfirm}
            className="px-3 py-1 bg-gray-700 text-white rounded"
          >
            사망 확인
          </button>
        </div>
      )}

      <div className="mt-2 text-lg">
        <p>Time to Evolve: {formatTimeToEvolveSec(digimonStats.timeToEvolveSeconds)}</p>
      </div>
      <div className="text-lg">
        <p>Lifespan: {formatLifespan(digimonStats.lifespanSeconds)}</p>
      </div>
      <div className="mt-2 text-lg">
        <p>Current Time: {customTime.toLocaleString()}</p>
      </div>

      <div className="flex space-x-4 mt-4">
        <StatsPanel stats={digimonStats}/>
        <MenuIconButtons
          width={width}
          height={height}
          activeMenu={activeMenu}
          onMenuClick={(menu)=>{
            setActiveMenu(menu);
            if(menu==="eat"){
              setShowFeedPopup(true);
            } else if(menu==="status"){
              setShowStatsPopup(true);
            }
          }}
        />
      </div>

      <button
        onClick={()=>setShowSettingsModal(true)}
        className="px-4 py-2 bg-yellow-500 text-white rounded mt-4"
      >
        Settings
      </button>

      {/* StatsPopup (devMode => onChangeStats) */}
      {showStatsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <StatsPopup
            stats={digimonStats}
            onClose={()=>setShowStatsPopup(false)}
            devMode={developerMode}
            onChangeStats={(ns)=> setDigimonStats(ns)}
          />
        </div>
      )}

      {showFeedPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <FeedPopup
            onClose={()=>setShowFeedPopup(false)}
            onSelect={(type)=>{
              setShowFeedPopup(false);
              handleFeed(type);
            }}
          />
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <SettingsModal
            onClose={()=>setShowSettingsModal(false)}
            developerMode={developerMode}
            setDeveloperMode={setDeveloperMode}
            width={width}
            height={height}
            setWidth={setWidth}
            setHeight={setHeight}
            backgroundNumber={backgroundNumber}
            setBackgroundNumber={setBackgroundNumber}
            timeSpeed={timeSpeed}
            setTimeSpeed={setTimeSpeed}
            customTime={customTime}
            setCustomTime={setCustomTime}
            foodSizeScale={foodSizeScale}
            setFoodSizeScale={setFoodSizeScale}
          />
        </div>
      )}

      <button
        onClick={resetDigimon}
        className="px-4 py-2 bg-red-500 text-white rounded mt-4"
      >
        Reset Digimon
      </button>

      {developerMode && slotVersion==="Ver.1" && (
        <div className="mt-2 p-2 border">
          <label>Dev Digimon Select:</label>
          <select
            onChange={(e)=>{
              const name=e.target.value;
              const old={...digimonStats};
              const nxt= mod.initializeStats(name);
              nxt.lifespanSeconds= old.lifespanSeconds;
              setSelectedDigimon(name);
              setDigimonStats(nxt);
            }}
            defaultValue={selectedDigimon}
          >
            {ver1DigimonList.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

export default Game;