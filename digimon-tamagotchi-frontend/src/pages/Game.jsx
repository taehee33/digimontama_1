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

// 예시: Ver1 디지몬
const ver1DigimonList = [
  "Digitama","Botamon","Koromon","Agumon","Betamon"
];

function Game() {
  const { slotId } = useParams();
  const navigate = useNavigate();

  // (A) 동적 import 모듈
  const [mod, setMod] = useState(null);

  // 디지몬
  const [selectedDigimon, setSelectedDigimon] = useState("Digitama");
  const [digimonStats, setDigimonStats] = useState({ sprite:133 });

  // 슬롯 정보
  const [slotName, setSlotName] = useState("");
  const [slotCreatedAt, setSlotCreatedAt] = useState("");
  const [slotDevice, setSlotDevice] = useState("");
  const [slotVersion, setSlotVersion] = useState("");

  // Canvas 크기
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);

  // Animation
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  // 배경 (162~188)
  const [backgroundNumber, setBackgroundNumber] = useState(162);

  // Popups
  const [showStatsPopup, setShowStatsPopup] = useState(false);
  const [showFeedPopup, setShowFeedPopup] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // Dev Mode
  const [developerMode, setDeveloperMode] = useState(false);

  // Time
  const [customTime, setCustomTime] = useState(new Date());
  const [timeSpeed, setTimeSpeed] = useState(1);

  // Food
  const [feedType, setFeedType] = useState(null);
  const [showFood, setShowFood] = useState(false);
  const [feedStep, setFeedStep] = useState(0);
  const [foodSizeScale, setFoodSizeScale] = useState(0.31);

  const meatSprites = ["/images/526.png","/images/527.png","/images/528.png","/images/529.png"];
  const vitaminSprites = ["/images/530.png","/images/531.png","/images/532.png"];

  // 1) 로컬 load
  useEffect(() => {
    if(!slotId) return;
    const sName = localStorage.getItem(`slot${slotId}_slotName`) || `슬롯${slotId}`;
    const sCreated = localStorage.getItem(`slot${slotId}_createdAt`) || "";
    const sDev = localStorage.getItem(`slot${slotId}_device`) || "";
    const sVer = localStorage.getItem(`slot${slotId}_version`) || "Ver.1";

    setSlotName(sName);
    setSlotCreatedAt(sCreated);
    setSlotDevice(sDev);
    setSlotVersion(sVer);

    loadVersionModule(sVer).then(module=>{
      setMod(module);

      const savedName = localStorage.getItem(`slot${slotId}_selectedDigimon`) || "Digitama";
      const savedStatsStr = localStorage.getItem(`slot${slotId}_digimonStats`);
      if(savedStatsStr){
        const parsed= JSON.parse(savedStatsStr);
        if(Object.keys(parsed).length===0){
          const newStats= module.initializeStats("Digitama");
          setSelectedDigimon("Digitama");
          setDigimonStats(newStats);
        } else {
          setSelectedDigimon(savedName);
          setDigimonStats(parsed);
        }
      } else {
        const newStats= module.initializeStats("Digitama");
        setSelectedDigimon("Digitama");
        setDigimonStats(newStats);
      }
    });
  },[slotId]);

  async function loadVersionModule(ver){
    if(ver==="Ver.1"){
      return await import("../data/digimondata_digitalmonstercolor25th_ver1.js");
    }
    return await import("../data/digimondata_digitalmonstercolor25th_ver1.js"); // default
  }

  // 2) 매초 update
  useEffect(() => {
    if(!mod) return;
    const t=setInterval(() => {
      setDigimonStats(prev=> mod.updateLifespan(prev,1));
    },1000);

    const clock= setInterval(()=>{
      setCustomTime(new Date());
    },1000);

    return ()=>{
      clearInterval(t);
      clearInterval(clock);
    };
  },[mod]);

  // 3) 저장
  useEffect(()=>{
    if(!slotId||!mod) return;
    localStorage.setItem(`slot${slotId}_selectedDigimon`, selectedDigimon);
    localStorage.setItem(`slot${slotId}_digimonStats`, JSON.stringify(digimonStats));
  },[slotId, mod, selectedDigimon, digimonStats]);

  // 4) frames from digimonAnimations
  let idleAnimId=1;
  if(selectedDigimon==="Digitama"){
    idleAnimId=90;
  }
  let eatAnimId=2;

  // offsets
  const idleOffset = digimonAnimations[idleAnimId]?.frames||[0];
  const eatOffset  = digimonAnimations[eatAnimId]?.frames||[0];

  const idleFrames= idleOffset.map(off=> `${digimonStats.sprite+off}.png`);
  const eatFrames= eatOffset.map(off=> `${digimonStats.sprite+off}.png`);

  // Evolution
  function canEvolve(){
    if(!mod) return false;
    if(developerMode) return true; // DevMode => always evolve
    if(!mod.evolutionConditions) return false;
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
      // 강제 첫번째
      handleEvolution(arr[0].next);
      return;
    } else {
      // 실제 조건
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
    next.lifespanSeconds= old.lifespanSeconds;
    next.lifespanMinutes= old.lifespanMinutes;
    setSelectedDigimon(newName);
    setDigimonStats(next);
  }

  // Feed
  function handleFeed(type){
    setFeedType(type);
    setFeedStep(0);
    setShowFood(true);
    feedCycle(0,type);
  }
  function feedCycle(step,type){
    const max= (type==="vitamin"?3:4);
    if(step>=max){
      setCurrentAnimation("idle");
      setShowFood(false);
      setDigimonStats(prev=>{
        const newW= prev.weight+1;
        if(type==="meat"){
          return { ...prev, weight:newW, fullness:Math.min(5,prev.fullness+1) };
        } else {
          return { ...prev, weight:newW, health:Math.min(5,prev.health+1) };
        }
      });
      return;
    }
    setCurrentAnimation("eat");
    setFeedStep(step);
    setTimeout(()=> feedCycle(step+1,type), 500);
  }

  // Reset
  function resetDigimon(){
    if(!slotId) return;
    if(window.confirm("정말로 초기화?")){
      localStorage.removeItem(`slot${slotId}_selectedDigimon`);
      localStorage.removeItem(`slot${slotId}_digimonStats`);
      if(mod){
        const newStats= mod.initializeStats("Digitama");
        setSelectedDigimon("Digitama");
        setDigimonStats(newStats);
      } else {
        setSelectedDigimon("Digitama");
        setDigimonStats({});
      }
    }
  }

  // UI
  const goSelect=()=> navigate("/select");
  const isEvoEnabled= canEvolve();

  function formatTimeToEvolveSec(sec=0){
    const m=Math.floor(sec/60);
    const s= sec%60;
    return `${m}m ${s}s`;
  }
  function formatLifespan(sec=0){
    const days=Math.floor(sec/86400);
    const remainder= sec%86400;
    const minutes= Math.floor(remainder/60);
    const seconds= remainder%60;
    return `${days} day, ${minutes} min, ${seconds} sec`;
  }

  // Developer Mode => show a select of digimon
  function handleDevSelectDigimon(e){
    if(!mod) return;
    const name= e.target.value;
    if(!name) return;
    // init
    const old= {...digimonStats};
    const next= mod.initializeStats(name);
    next.lifespanSeconds= old.lifespanSeconds;
    next.lifespanMinutes= old.lifespanMinutes;
    setSelectedDigimon(name);
    setDigimonStats(next);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-200 relative">
      {/* 상단 정보 */}
      <h2 className="text-lg font-bold mb-2">
        슬롯 {slotId} - {selectedDigimon}
      </h2>
      <p>슬롯 이름: {slotName}</p>
      <p>생성일: {slotCreatedAt}</p>
      <p>기종: {slotDevice} / 버전: {slotVersion}</p>

      <button onClick={goSelect} className="mb-2 px-3 py-1 bg-gray-400 text-white rounded">
        ← Select 화면
      </button>

      {/* (A) 배경 + Canvas */}
      <div
        className="relative"
        style={{
          width:`${width}px`,
          height:`${height}px`,
          margin:'0 auto',
          border:'2px solid #555'
        }}
      >
        {/* 배경(img) */}
        <img
          src={`/images/${backgroundNumber}.png`}
          alt="background"
          style={{
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            objectFit:'cover',
            imageRendering:'pixelated',
            zIndex:1
          }}
        />

        {/* Canvas (디지몬) */}
        <Canvas
          style={{ position:'absolute', top:0, left:0, zIndex:2 }}
          width={width}
          height={height}
          backgroundNumber={backgroundNumber}
          idleFrames={idleFrames}
          eatFrames={eatFrames}
          currentAnimation={currentAnimation}
          showFood={showFood}
          feedStep={feedStep}
          foodSizeScale={foodSizeScale}
          // Dev mode => show sprite name in Canvas => let's do it
          developerMode={developerMode}
          foodSprites={(feedType==="vitamin")? vitaminSprites: meatSprites}
        />
      </div>

      {/* Evolution 버튼 */}
      <button
        onClick={handleEvolutionButton}
        disabled={!isEvoEnabled}
        className={`mt-2 px-4 py-2 text-white rounded ${
          isEvoEnabled?"bg-green-500":"bg-gray-500"
        }`}
      >
        Evolution
      </button>

      <div className="mt-2 text-lg">
        <p>Time to Evolve: {formatTimeToEvolveSec(digimonStats.timeToEvolveSeconds)}</p>
      </div>
      <div className="text-lg">
        <p>Lifespan: {formatLifespan(digimonStats.lifespanSeconds)}</p>
      </div>

      <div className="mt-2 text-lg">
        <p>Current Time: {new Date().toLocaleString()}</p>
      </div>

      {/* StatsPanel + Menu */}
      <div className="flex space-x-4 mt-4">
        <StatsPanel stats={digimonStats} />
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

      {/* Settings btn */}
      <button
        onClick={()=>setShowSettingsModal(true)}
        className="px-4 py-2 bg-yellow-500 text-white rounded mt-4"
      >
        Settings
      </button>

      {/* Dev mode => 디지몬 목록 select */}
      {developerMode && slotVersion==="Ver.1" && (
        <div className="mt-2 p-2 border rounded">
          <label className="mr-2">[Dev Mode] 디지몬 변경:</label>
          <select
            onChange={handleDevSelectDigimon}
            defaultValue={selectedDigimon}
            className="border p-1"
          >
            {ver1DigimonList.map(name => (
              <option value={name} key={name}>{name}</option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={resetDigimon}
        className="px-4 py-2 bg-red-500 text-white rounded mt-4"
      >
        Reset Digimon
      </button>

      {/* StatsPopup */}
      {showStatsPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex:9999, background:"rgba(0,0,0,0.5)" }}
        >
          <StatsPopup
            stats={digimonStats}
            onClose={()=>setShowStatsPopup(false)}
          />
        </div>
      )}

      {/* FeedPopup */}
      {showFeedPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex:9999, background:"rgba(0,0,0,0.5)" }}
        >
          <FeedPopup
            onClose={()=>setShowFeedPopup(false)}
            onSelect={(type)=>{
              setShowFeedPopup(false);
              handleFeed(type);
            }}
          />
        </div>
      )}

      {/* SettingsModal */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex:9999, background:"rgba(0,0,0,0.5)" }}
        >
          <SettingsModal
            onClose={()=>setShowSettingsModal(false)}
            foodSizeScale={foodSizeScale}
            setFoodSizeScale={setFoodSizeScale}
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
          />
        </div>
      )}
    </div>
  );
}

export default Game;