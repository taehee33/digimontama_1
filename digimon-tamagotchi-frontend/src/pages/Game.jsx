// src/pages/Game.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import animationDefinitions from "../data/digimonAnimations"; // rename
import Canvas from "../components/Canvas";
import DigimonSelector from "../components/DigimonSelector";
import EvolutionSelector from "../components/EvolutionSelector";
import MenuIconButtons from "../components/MenuIconButtons";
import StatsPanel from "../components/StatsPanel";
import StatsPopup from "../components/StatsPopup";
import SettingsModal from "../components/SettingsModal";
import FeedPopup from "../components/FeedPopup";

/**
 * Game.jsx:
 *  - 동적 import로 선택 버전 모듈 로드
 *  - LocalStorage: slotName, createdAt, device, version + digimonStats
 *  - 디지타마 -> 수동 진화(버튼 누르면 timeToEvolveSeconds <=0?) => 조건 만족 시
 */

function Game() {
  const { slotId } = useParams();
  const navigate = useNavigate();

  // 모듈(동적 import) { initializeStats, updateLifespan, evolutionConditions }
  const [mod, setMod] = useState(null);

  // 디지몬 상태
  const [selectedDigimon, setSelectedDigimon] = useState("Digitama");
  const [digimonStats, setDigimonStats] = useState({});

  // 슬롯 정보 (이름, 생성일, 기종, 버전)
  const [slotName, setSlotName] = useState("");
  const [slotCreatedAt, setSlotCreatedAt] = useState("");
  const [slotDevice, setSlotDevice] = useState("");
  const [slotVersion, setSlotVersion] = useState("");

  // Canvas 등
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);

  const [showStatsPopup, setShowStatsPopup] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // 먹이 팝업
  const [showFeedPopup, setShowFeedPopup] = useState(false);
  const [feedType, setFeedType] = useState(null);
  const [showFood, setShowFood] = useState(false);
  const [feedStep, setFeedStep] = useState(0);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);

  const meatSprites = ["/images/526.png","/images/527.png","/images/528.png","/images/529.png"];
  const vitaminSprites = ["/images/530.png","/images/531.png","/images/532.png"];

  // UI
  const [foodSizeScale, setFoodSizeScale] = useState(0.31);
  const [developerMode, setDeveloperMode] = useState(false);

  // 시간
  const [customTime, setCustomTime] = useState(new Date());
  const [timeSpeed, setTimeSpeed] = useState(1);

  // 애니메이션
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  // 동적 import
  async function loadVersionModule(ver) {
    if (ver === "Ver.1") {
      return await import("../data/digimondata_digitalmonstercolor25th_ver1.js");
    } else if (ver === "Ver.2") {
      return await import("../data/digimondata_digitalmonstercolor25th_ver2.js");
    }
    // 기타 버전 => default = ver.1
    return await import("../data/digimondata_digitalmonstercolor25th_ver1.js");
  }

  // (1) 마운트 시
  useEffect(() => {
    if (!slotId) return; // 단일 모드?

    // 슬롯 정보(이름/생성일/기종/버전)
    const sName = localStorage.getItem(`slot${slotId}_slotName`) || `슬롯${slotId}`;
    const sCreatedAt = localStorage.getItem(`slot${slotId}_createdAt`) || "";
    const sDevice = localStorage.getItem(`slot${slotId}_device`) || "";
    const sVersion = localStorage.getItem(`slot${slotId}_version`) || "Ver.1";

    setSlotName(sName);
    setSlotCreatedAt(sCreatedAt);
    setSlotDevice(sDevice);
    setSlotVersion(sVersion);

    // 동적 import
    loadVersionModule(sVersion).then((module) => {
      setMod(module); 
      // 로드된 모듈 사용해서 stats 불러옴
      const savedName = localStorage.getItem(`slot${slotId}_selectedDigimon`) || "Digitama";
      const savedJson = localStorage.getItem(`slot${slotId}_digimonStats`);
      if (savedJson) {
        const parsed = JSON.parse(savedJson);
        if (Object.keys(parsed).length === 0) {
          // empty => Digitama init
          const newStats = module.initializeStats("Digitama");
          setDigimonStats(newStats);
          setSelectedDigimon("Digitama");
        } else {
          setDigimonStats(parsed);
          setSelectedDigimon(savedName);
        }
      } else {
        // no stats => Digitama
        const newStats = module.initializeStats("Digitama");
        setDigimonStats(newStats);
        setSelectedDigimon("Digitama");
      }
    });
  }, [slotId]);

  // (2) 매초 update
  useEffect(() => {
    const timer = setInterval(() => {
      if (!mod) return;
      setDigimonStats((prev) => mod.updateLifespan(prev, 1));
    }, 1000);

    const clockTimer = setInterval(() => {
      setCustomTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(clockTimer);
    };
  }, [mod]);

  // (3) 저장
  useEffect(() => {
    if (!slotId || !mod) return;
    localStorage.setItem(`slot${slotId}_selectedDigimon`, selectedDigimon);
    localStorage.setItem(`slot${slotId}_digimonStats`, JSON.stringify(digimonStats));
  }, [slotId, mod, selectedDigimon, digimonStats]);

  // (4) 수동 진화 버튼만
  const canEvolve = () => {
    if (!mod) return false;
    if (!mod.evolutionConditions) return false;
    const evoInfo = mod.evolutionConditions[selectedDigimon];
    if (!evoInfo) return false;
    for (let e of evoInfo.evolution) {
      // timeToEvolveSeconds<=0 etc
      if (e.condition.check(digimonStats)) {
        return true;
      }
    }
    return false;
  };

  const handleEvolutionButton = () => {
    if (!mod) return;
    if (developerMode) {
      // 강제 첫 진화
      const evoInfo = mod.evolutionConditions[selectedDigimon]?.evolution || [];
      if (evoInfo.length > 0) {
        handleEvolution(evoInfo[0].next);
      }
      return;
    }
    // normal
    if (canEvolve()) {
      const evoInfo = mod.evolutionConditions[selectedDigimon]?.evolution || [];
      for (let e of evoInfo) {
        if (e.condition.check(digimonStats)) {
          handleEvolution(e.next);
          break;
        }
      }
    }
  };

  const handleEvolution = (newName) => {
    if (!mod) return;
    const old = { ...digimonStats };
    const next = mod.initializeStats(newName);
    // 수명 유지
    next.lifespanSeconds = old.lifespanSeconds;
    next.lifespanMinutes = old.lifespanMinutes;
    setSelectedDigimon(newName);
    setDigimonStats(next);
  };

  // (5) 먹이
  const handleFeed = (type) => {
    setFeedType(type);
    setFeedStep(0);
    setShowFood(true);
    feedCycle(0, type);
  };

  const feedCycle = (step, type) => {
    const maxFrame = type === "vitamin" ? 3 : 4;
    if (step >= maxFrame) {
      setCurrentAnimation("idle");
      setShowFood(false);
      setDigimonStats((prev) => {
        const newWeight = prev.weight + 1;
        if (type === "meat") {
          return {
            ...prev,
            weight: newWeight,
            fullness: Math.min(5, prev.fullness + 1),
          };
        } else {
          return {
            ...prev,
            weight: newWeight,
            health: Math.min(5, prev.health + 1),
          };
        }
      });
      return;
    }
    setCurrentAnimation("eat");
    setCurrentFoodIndex(step);
    setFeedStep(step);
    setTimeout(() => {
      feedCycle(step + 1, type);
    }, 500);
  };

  // (6) Menu
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    switch (menu) {
      case "eat":
        setShowFeedPopup(true);
        break;
      case "status":
        setShowStatsPopup(true);
        break;
      default:
        console.log(`menu: ${menu}`);
    }
  };

  // (7) Reset
  const resetDigimon = () => {
    if (!slotId) return;
    if (window.confirm("정말로 모든 진행 데이터를 초기화하시겠습니까?")) {
      localStorage.removeItem(`slot${slotId}_selectedDigimon`);
      localStorage.removeItem(`slot${slotId}_digimonStats`);
      if (mod) {
        const newStats = mod.initializeStats("Digitama");
        setDigimonStats(newStats);
        setSelectedDigimon("Digitama");
      } else {
        setDigimonStats({});
        setSelectedDigimon("Digitama");
      }
    }
  };

  // 돌아가기
  const goSelect = () => {
    navigate("/select");
  };

  // 애니메이션 frames
  let idleAnimId = 1;
  if (selectedDigimon === "Digitama") {
    idleAnimId = 90; // digitamaidle
  }
  const idleOffset = animationDefinitions[idleAnimId]?.frames || [];
  const eatOffset  = animationDefinitions[2]?.frames || [];
  const idleFrames = idleOffset.map((off) => `${digimonStats.sprite || 133 + off}.png`);
  const eatFrames  = eatOffset.map((off) => `${digimonStats.sprite || 133 + off}.png`);

  // Evolution 버튼
  const isEvoEnabled = developerMode || canEvolve();

  const formatTimeToEvolveSec = (sec = 0) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const formatLifespan = (sec = 0) => {
    const days = Math.floor(sec / 86400);
    const remainder = sec % 86400;
    const minutes = Math.floor(remainder / 60);
    const seconds = remainder % 60;
    return `${days} day, ${minutes} min, ${seconds} sec`;
  };

  return (
    <div className="flex flex-col items-center overflow-y-auto max-h-screen p-4">
      <h2 className="text-lg font-bold mb-2">슬롯 {slotId} - {selectedDigimon}</h2>

      {/* 슬롯 정보 표시 */}
      <p>슬롯 이름: {slotName}</p>
      <p>생성일: {slotCreatedAt}</p>
      <p>기종: {slotDevice} / 버전: {slotVersion}</p>

      <button onClick={goSelect} className="mb-2 px-3 py-1 bg-gray-400 text-white rounded">
        ← Select 화면으로
      </button>

      {/* Canvas */}
      <Canvas
        selectedDigimon={selectedDigimon}
        startNumber={digimonStats.sprite || 133}
        idleFrames={idleFrames}
        eatFrames={eatFrames}
        width={width}
        height={height}
        currentAnimation={currentAnimation}
        showFood={showFood}
        currentFoodIndex={currentFoodIndex}
        foodSprites={feedType === "vitamin" ? vitaminSprites : meatSprites}
        developerMode={developerMode}
        feedStep={feedStep}
        foodSizeScale={foodSizeScale}
      />

      {/* Evolution 버튼 (수동) */}
      <button
        onClick={handleEvolutionButton}
        disabled={!isEvoEnabled}
        className={`mt-2 px-4 py-2 text-white rounded ${
          isEvoEnabled ? "bg-green-500" : "bg-gray-500"
        }`}
      >
        Evolution
      </button>

      {/* timeToEvolveSeconds */}
      <div className="mt-2 text-lg">
        <p>Time to Evolve: {formatTimeToEvolveSec(digimonStats.timeToEvolveSeconds)}</p>
      </div>
      {/* Lifespan */}
      <div className="text-lg">
        <p>Lifespan: {formatLifespan(digimonStats.lifespanSeconds)}</p>
      </div>
      {/* 현재 시간 */}
      <div className="mt-2 text-lg">
        <p>Current Time: {customTime.toLocaleString()}</p>
      </div>

      {/* StatsPanel & MenuIconButtons */}
      <div className="flex space-x-4 mt-4">
        <StatsPanel stats={digimonStats} />
        <MenuIconButtons
          width={width}
          height={height}
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
        />
      </div>

      {/* Settings 버튼 */}
      <button
        onClick={() => setShowSettingsModal(true)}
        className="px-4 py-2 bg-yellow-500 text-white rounded mt-4"
      >
        Settings
      </button>

      {/* Stats 팝업 */}
      {showStatsPopup && (
        <StatsPopup
          stats={digimonStats}
          onClose={() => setShowStatsPopup(false)}
        />
      )}

      {/* Feed 팝업 */}
      {showFeedPopup && (
        <FeedPopup
          onClose={() => setShowFeedPopup(false)}
          onSelect={(type) => {
            setShowFeedPopup(false);
            handleFeed(type);
          }}
        />
      )}

      {/* SettingsModal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          foodSizeScale={foodSizeScale}
          setFoodSizeScale={setFoodSizeScale}
          developerMode={developerMode}
          setDeveloperMode={setDeveloperMode}
          width={width}
          height={height}
          setWidth={setWidth}
          setHeight={setHeight}
          backgroundNumber={162}
          setBackgroundNumber={() => {}}
          digimonSizeScale={0.4}
          setDigimonSizeScale={() => {}}
          timeMode={"KST"}
          setTimeMode={() => {}}
          timeSpeed={timeSpeed}
          setTimeSpeed={setTimeSpeed}
          customTime={customTime}
          setCustomTime={setCustomTime}
        />
      )}

      {/* Reset */}
      <button
        onClick={resetDigimon}
        className="px-4 py-2 bg-red-500 text-white rounded mt-4"
      >
        Reset Digimon
      </button>
    </div>
  );
}

export default Game;