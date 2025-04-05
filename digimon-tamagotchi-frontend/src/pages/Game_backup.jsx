// src/pages/Game.jsx
// 기존 코드 그대로, 아래 ★부분 추가

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Canvas from "../components/Canvas";
import StatsPanel from "../components/StatsPanel";
import StatsPopup from "../components/StatsPopup";
import FeedPopup from "../components/FeedPopup";
import SettingsModal from "../components/SettingsModal";
import MenuIconButtons from "../components/MenuIconButtons";

import digimonAnimations from "../data/digimonAnimations";
import { initializeStats, updateLifespan, updateAge } from "../data/stats";
import { digimonDataVer1 } from "../data/digimondata_digitalmonstercolor25th_ver1";
import { evolutionConditionsVer1 } from "../data/evolution_digitalmonstercolor25th_ver1";

const ver1DigimonList = [
  "Digitama",
  "Botamon",
  "Koromon",
  "Agumon",
  "Betamon",
  "Greymon",
  "Ohakadamon1",
  "Ohakadamon2",
];

const perfectStages = ["Perfect","Ultimate","SuperUltimate"];

function formatTimeToEvolve(sec=0){
  const m = Math.floor(sec/60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}
function formatLifespan(sec=0){
  const d = Math.floor(sec/86400);
  const r = sec %86400;
  const mm= Math.floor(r/60);
  const ss= r%60;
  return `${d} day, ${mm} min, ${ss} sec`;
}

function Game(){
  const { slotId } = useParams();
  const navigate= useNavigate();

  const [selectedDigimon, setSelectedDigimon]= useState("Digitama");
  const [digimonStats, setDigimonStats]= useState(
    initializeStats("Digitama", {}, digimonDataVer1)
  );

  const [showDeathConfirm, setShowDeathConfirm]= useState(false);

  const [slotName, setSlotName]= useState("");
  const [slotCreatedAt, setSlotCreatedAt]= useState("");
  const [slotDevice, setSlotDevice]= useState("");
  const [slotVersion, setSlotVersion]= useState("");

  const [width, setWidth]= useState(300);
  const [height, setHeight]= useState(200);
  const [backgroundNumber, setBackgroundNumber]= useState(162);
  const [currentAnimation, setCurrentAnimation]= useState("idle");

  const [showStatsPopup, setShowStatsPopup]= useState(false);
  const [showFeedPopup, setShowFeedPopup]= useState(false);
  const [showSettingsModal, setShowSettingsModal]= useState(false);
  const [activeMenu, setActiveMenu]= useState(null);

  const [developerMode, setDeveloperMode]= useState(false);

  const [customTime, setCustomTime]= useState(new Date());
  const [timeSpeed, setTimeSpeed]= useState(1);

  // feed
  const [feedType, setFeedType]= useState(null);
  const [showFood, setShowFood]= useState(false);
  const [feedStep, setFeedStep]= useState(0);
  const [foodSizeScale, setFoodSizeScale]= useState(0.31);

  const meatSprites= ["/images/526.png","/images/527.png","/images/528.png","/images/529.png"];
  const proteinSprites= ["/images/530.png","/images/531.png","/images/532.png"];

  // ★ (1) 청소 애니메이션 상태
  const [showPoopCleanAnimation, setShowPoopCleanAnimation]= useState(false);
  const [cleanStep, setCleanStep]= useState(0);

  useEffect(()=>{
    if(!slotId) return;
    const sName= localStorage.getItem(`slot${slotId}_slotName`) || `슬롯${slotId}`;
    const sCreated= localStorage.getItem(`slot${slotId}_createdAt`) || "";
    const sDev= localStorage.getItem(`slot${slotId}_device`) || "";
    const sVer= localStorage.getItem(`slot${slotId}_version`) || "Ver.1";

    setSlotName(sName);
    setSlotCreatedAt(sCreated);
    setSlotDevice(sDev);
    setSlotVersion(sVer);

    const savedName= localStorage.getItem(`slot${slotId}_selectedDigimon`)|| "Digitama";
    const savedStatsStr= localStorage.getItem(`slot${slotId}_digimonStats`);
    if(savedStatsStr){
      const parsed= JSON.parse(savedStatsStr);
      if(Object.keys(parsed).length===0){
        const ns= initializeStats("Digitama", {}, digimonDataVer1);
        setSelectedDigimon("Digitama");
        setDigimonStats(ns);
      } else {
        setSelectedDigimon(savedName);
        setDigimonStats(parsed);
      }
    } else {
      const ns= initializeStats("Digitama", {}, digimonDataVer1);
      setSelectedDigimon("Digitama");
      setDigimonStats(ns);
    }
  },[slotId]);

  useEffect(()=>{
    const timer= setInterval(()=>{
      setDigimonStats(prev=>{
        let s={...prev};
        if(!s.isDead){
          s= updateLifespan(s,1);
          s= updateAge(s);
          if(!prev.isDead && s.isDead){
            setShowDeathConfirm(true);
          }
        }
        if(slotId){
          localStorage.setItem(`slot${slotId}_digimonStats`, JSON.stringify(s));
        }
        return s;
      });
    },1000);

    const clock= setInterval(()=> setCustomTime(new Date()),1000);

    return ()=>{
      clearInterval(timer);
      clearInterval(clock);
    };
  },[slotId]);

  function setDigimonStatsAndSave(newStats){
    setDigimonStats(newStats);
    if(slotId){
      localStorage.setItem(`slot${slotId}_digimonStats`, JSON.stringify(newStats));
    }
  }
  function setSelectedDigimonAndSave(name){
    setSelectedDigimon(name);
    if(slotId){
      localStorage.setItem(`slot${slotId}_selectedDigimon`, name);
    }
  }

  let idleAnimId=1, eatAnimId=2, rejectAnimId=3;
  if(selectedDigimon==="Digitama") idleAnimId=90;
  const idleOff= digimonAnimations[idleAnimId]?.frames||[0];
  const eatOff= digimonAnimations[eatAnimId]?.frames||[0];
  const rejectOff= digimonAnimations[rejectAnimId]?.frames||[14];

  let idleFrames= idleOff.map(n=> `${digimonStats.sprite + n}`);
  let eatFramesArr= eatOff.map(n=> `${digimonStats.sprite + n}`);
  let rejectFramesArr= rejectOff.map(n=> `${digimonStats.sprite + n}`);

  if(digimonStats.isDead){
    idleFrames= [ `${digimonStats.sprite+15}` ];
    eatFramesArr= [ `${digimonStats.sprite+15}` ];
    rejectFramesArr= [ `${digimonStats.sprite+15}` ];
  }

  // evolution
  function canEvolve(){
    if(digimonStats.isDead) return false;
    if(developerMode) return true;
    const evo= evolutionConditionsVer1[selectedDigimon];
    if(!evo) return false;
    for(let e of evo.evolution){
      if(e.condition.check(digimonStats)){
        return true;
      }
    }
    return false;
  }
  function handleEvolutionButton(){
    if(!canEvolve()) return;
    const evo= evolutionConditionsVer1[selectedDigimon];
    if(!evo) return;
    for(let e of evo.evolution){
      let test={...digimonStats};
      if(developerMode){
        test.timeToEvolveSeconds=0;
      }
      if(e.condition.check(test)){
        handleEvolution(e.next);
        return;
      }
    }
  }
  function handleEvolution(newName){
    if(!digimonDataVer1[newName]){
      console.error(`No data for ${newName} in digimonDataVer1! fallback => Digitama`);
      newName="Digitama";
    }
    const old={...digimonStats};
    const nx= initializeStats(newName, old, digimonDataVer1);
    setDigimonStatsAndSave(nx);
    setSelectedDigimonAndSave(newName);
  }

  function handleDeathConfirm(){
    let ohaka="Ohakadamon1";
    if(perfectStages.includes(digimonStats.evolutionStage)){
      ohaka="Ohakadamon2";
    }
    if(!digimonDataVer1[ohaka]){
      console.error(`No data for ${ohaka} in digimonDataVer1!? fallback => Digitama`);
      ohaka="Digitama";
    }
    const old= {...digimonStats};
    const nx= initializeStats(ohaka, old, digimonDataVer1);
    setDigimonStatsAndSave(nx);
    setSelectedDigimonAndSave(ohaka);
    setShowDeathConfirm(false);
  }

  // feed
  function handleFeed(type){
    if(digimonStats.isDead) return;
    const limit= 5+(digimonStats.maxOverfeed||0);
    if(type==="meat"){
      if(digimonStats.fullness>= limit){
        setCurrentAnimation("foodRejectRefuse");
        setShowFood(false);
        setFeedStep(0);
        setTimeout(()=> setCurrentAnimation("idle"),2000);
        return;
      }
    } else {
      if(digimonStats.fullness>=limit && digimonStats.health>=5){
        setCurrentAnimation("foodRejectRefuse");
        setShowFood(false);
        setFeedStep(0);
        setTimeout(()=> setCurrentAnimation("idle"),2000);
        return;
      }
    }
    setFeedType(type);
    setShowFood(true);
    setFeedStep(0);
    eatCycle(0, type);
  }
  function eatCycle(step,type){
    const frameCount= (type==="protein"?3:4);
    if(step>=frameCount){
      setCurrentAnimation("idle");
      setShowFood(false);
      setDigimonStatsAndSave(applyEatResult(digimonStats, type));
      return;
    }
    setCurrentAnimation("eat");
    setFeedStep(step);
    setTimeout(()=> eatCycle(step+1,type),500);
  }
  function applyEatResult(old,type){
    let s={...old};
    const limit=5+(s.maxOverfeed||0);
    if(type==="meat"){
      if(s.fullness<limit){
        s.fullness++;
        s.weight++;
      }
    } else {
      if(s.fullness<5){
        s.fullness= Math.min(limit, s.fullness+2);
      }
      if(s.health<5){
        s.health++;
      }
      s.weight+=2;
    }
    return s;
  }

  // ★ (2) 똥 청소
  function handleCleanPoop(){
    // poopCount=0으로 하기 전, 청소 애니메이션
    if(digimonStats.poopCount<=0){
      // 똥 없으면 그냥 무시
      return;
    }
    setShowPoopCleanAnimation(true);
    setCleanStep(0);
    cleanCycle(0);
  }
  function cleanCycle(step){
    if(step>3){
      // 애니 끝
      setShowPoopCleanAnimation(false);
      setCleanStep(0);
      // poopCount=0, lastMaxPoopTime=null
      setDigimonStats(prev => ({
        ...prev,
        poopCount:0,
        lastMaxPoopTime:null
      }));
      return;
    }
    setCleanStep(step);
    setTimeout(()=> cleanCycle(step+1), 400);
  }

  // (B) reset
  function resetDigimon(){
    if(!window.confirm("정말로 초기화?")) return;
    if(slotId){
      localStorage.removeItem(`slot${slotId}_selectedDigimon`);
      localStorage.removeItem(`slot${slotId}_digimonStats`);
    }
    const ns= initializeStats("Digitama", {}, digimonDataVer1);
    setDigimonStatsAndSave(ns);
    setSelectedDigimonAndSave("Digitama");
    setShowDeathConfirm(false);
  }

  const goSelect= ()=> navigate("/select");

  // evo button
  let isEvoEnabled=false;
  if(!digimonStats.isDead){
    if(developerMode) isEvoEnabled= true;
    else {
      const evo= evolutionConditionsVer1[selectedDigimon];
      if(evo){
        for(let e of evo.evolution){
          if(e.condition.check(digimonStats)){
            isEvoEnabled=true;
            break;
          }
        }
      }
    }
  }

  // ★ (3) 메뉴 클릭에 bathroom 추가
  const handleMenuClick = (menu)=>{
    setActiveMenu(menu);
    switch(menu){
      case "eat":
        setShowFeedPopup(true);
        break;
      case "status":
        setShowStatsPopup(true);
        break;
      case "bathroom":
        handleCleanPoop(); // 청소
        break;
      default:
        console.log("menu:", menu);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-200">
      {/* 상단 */}
      <h2 className="text-lg font-bold mb-2">
        슬롯 {slotId} - {selectedDigimon}
      </h2>
      <p>슬롯 이름: {slotName}</p>
      <p>생성일: {slotCreatedAt}</p>
      <p>기종: {slotDevice} / 버전: {slotVersion}</p>

      <button onClick={goSelect} className="mb-2 px-3 py-1 bg-gray-400 text-white rounded">
        ← Select 화면
      </button>

      {/* Canvas */}
      <div style={{position:"relative", width,height, border:"2px solid #555"}}>
        <img
          src={`/images/${backgroundNumber}.png`}
          alt="bg"
          style={{
            position:"absolute",
            top:0,left:0,
            width:"100%",height:"100%",
            imageRendering:"pixelated",
            zIndex:1
          }}
        />
        <Canvas
          style={{ position:"absolute", top:0,left:0, zIndex:2 }}
          width={width}
          height={height}
          currentAnimation={currentAnimation}
          idleFrames={idleFrames}
          eatFrames={eatFramesArr}
          foodRejectFrames={rejectFramesArr}
          showFood={showFood}
          feedStep={feedStep}
          foodSizeScale={foodSizeScale}
          developerMode={developerMode}
          foodSprites={(feedType==="protein")? proteinSprites: meatSprites}

          // ★ (4) 똥/청소 애니메이션 데이터 전달
          poopCount={digimonStats.poopCount || 0}
          showPoopCleanAnimation={showPoopCleanAnimation}
          cleanStep={cleanStep}
        />
      </div>

      {/* 진화 */}
      <button
        onClick={handleEvolutionButton}
        disabled={!isEvoEnabled}
        className={`mt-2 px-4 py-2 text-white rounded ${isEvoEnabled? "bg-green-500":"bg-gray-500"}`}
      >
        Evolution
      </button>

      {/* 사망 */}
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

      {/* 하단 */}
      <div className="mt-2 text-lg">
        <p>Time to Evolve: {formatTimeToEvolve(digimonStats.timeToEvolveSeconds)}</p>
        <p>Lifespan: {formatLifespan(digimonStats.lifespanSeconds)}</p>
        <p>Current Time: {customTime.toLocaleString()}</p>
      </div>

      <div className="flex space-x-4 mt-4">
        <StatsPanel stats={digimonStats} />
        {/* ★ MenuIconButtons -> bathroom 클릭 => handleMenuClick("bathroom") */}
        <MenuIconButtons
          width={width}
          height={height}
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
        />
      </div>

      {/* Settings btn */}
      <button
        onClick={()=> setShowSettingsModal(true)}
        className="px-4 py-2 bg-yellow-500 text-white rounded mt-4"
      >
        Settings
      </button>

      {/* StatsPopup */}
      {showStatsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <StatsPopup
            stats={digimonStats}
            onClose={()=> setShowStatsPopup(false)}
            devMode={developerMode}
            onChangeStats={(ns)=> setDigimonStatsAndSave(ns)}
          />
        </div>
      )}

      {/* FeedPopup */}
      {showFeedPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <FeedPopup
            onClose={()=> setShowFeedPopup(false)}
            onSelect={(foodType)=>{
              setShowFeedPopup(false);
              handleFeed(foodType);
            }}
          />
        </div>
      )}

      {/* SettingsModal */}
      {showSettingsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <SettingsModal
            onClose={()=> setShowSettingsModal(false)}
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

      {/* Reset */}
      <button
        onClick={resetDigimon}
        className="px-4 py-2 bg-red-500 text-white rounded mt-4"
      >
        Reset Digimon
      </button>

      {/* dev mode => digi select */}
      {developerMode && slotVersion==="Ver.1" && (
        <div className="mt-2 p-2 border">
          <label className="mr-1">Dev Digimon Select:</label>
          <select
            onChange={(e)=>{
              const nm= e.target.value;
              if(!digimonDataVer1[nm]){
                console.error(`No data for ${nm}`);
                const fallback= initializeStats("Digitama", digimonStats, digimonDataVer1);
                setDigimonStatsAndSave(fallback);
                setSelectedDigimonAndSave("Digitama");
                return;
              }
              const old= {...digimonStats};
              const nx= initializeStats(nm, old, digimonDataVer1);
              setDigimonStatsAndSave(nx);
              setSelectedDigimonAndSave(nm);
            }}
            defaultValue={selectedDigimon}
          >
            {ver1DigimonList.map(d=>(
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default Game;