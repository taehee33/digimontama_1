import { useState, useEffect } from "react";
import digimonData from "../data/digimonData";
import animationDefinitions from "../data/digimonAnimations";
import Canvas from "../components/Canvas";
import DigimonSelector from "../components/DigimonSelector";
import EvolutionSelector from "../components/EvolutionSelector";
import MenuIconButtons from "../components/MenuIconButtons";
import StatsPanel from "../components/StatsPanel";
import StatsPopup from "../components/StatsPopup";
import SettingsModal from "../components/SettingsModal";
import { initializeStats, updateLifespan } from "../data/stats";
import { evolutionConditions } from "../data/evolutionConditions";
import FeedPopup from "../components/FeedPopup";

const Game = () => {
  // 로컬 스토리지에서 이전 데이터 불러오기
  const savedDigimon = localStorage.getItem('selectedDigimon') || "Botamon";
  const savedStats = JSON.parse(localStorage.getItem('digimonStats')) || initializeStats(savedDigimon);

  // 기본 디지몬
  const [selectedDigimon, setSelectedDigimon] = useState(savedDigimon);
  const { startNumber } = digimonData[selectedDigimon] || {};

  // Canvas 사이즈
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);

  // 스탯 초기화
  const [digimonStats, setDigimonStats] = useState(savedStats);

  // 상태/메뉴/팝업
  const [showStatsPopup, setShowStatsPopup] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // 먹이 팝업 상태
  const [showFeedPopup, setShowFeedPopup] = useState(false);
  const [feedType, setFeedType] = useState(null);
  const [showFood, setShowFood] = useState(false);
  const [feedStep, setFeedStep] = useState(0);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);

  // 먹이 스프라이트(고기, 비타민)
  const meatSprites = [
    "/images/526.png",
    "/images/527.png",
    "/images/528.png",
    "/images/529.png",
  ];
  const vitaminSprites = [
    "/images/530.png",
    "/images/531.png",
    "/images/532.png",
  ];

  // UI/기타
  const [foodSizeScale, setFoodSizeScale] = useState(0.31);
  const [developerMode, setDeveloperMode] = useState(false);

  // 시간 관련
  const [timeMode, setTimeMode] = useState("KST");
  const [customTime, setCustomTime] = useState(new Date());
  const [timeSpeed, setTimeSpeed] = useState(1);

  // 애니메이션: idle, eat
  const idleFrames =
    animationDefinitions[1]?.frames?.map((offset) => `${startNumber + offset}.png`) || [];
  const eatFrames =
    animationDefinitions[2]?.frames?.map((offset) => `${startNumber + offset}.png`) || [];

  const [currentAnimation, setCurrentAnimation] = useState("idle");

  // 진화 로직
  const handleEvolution = (newDigimon) => {
    if (newDigimon) {
      setSelectedDigimon(newDigimon);
      const updatedStats = initializeStats(newDigimon);
      setDigimonStats(updatedStats);

      // 진화 후에도 이전 lifespan 유지
      updatedStats.lifespanSeconds = digimonStats.lifespanSeconds;
      localStorage.setItem('digimonStats', JSON.stringify(updatedStats));
    }
  };

  const checkEvolutionCondition = () => {
    const conditions = evolutionConditions[selectedDigimon]?.evolution || [];
    for (let condition of conditions) {
      if (digimonStats.lifespanSeconds / 60 >= condition.condition.lifespanMinutes) {
        return true;
      }
    }
    return false;
  };

  const handleEvolutionButton = () => {
    if (checkEvolutionCondition() || developerMode) {
      const nextDigimon = "Koromon"; // 예시
      handleEvolution(nextDigimon);
    }
  };

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
        console.log(`Clicked: ${menu}`);
    }
  };

  const getKSTTime = () => {
    return new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  };

  const formatTimeToEvolve = (timeInMinutes) => {
    const wholeMinutes = Math.floor(timeInMinutes);
    const fraction = timeInMinutes - wholeMinutes;
    const seconds = Math.floor(fraction * 60);
    return `${wholeMinutes} min, ${seconds} sec`;
  };

  const formatLifespan = (lifeSec) => {
    const days = Math.floor(lifeSec / 86400);
    const remainder = lifeSec % 86400;
    const minutes = Math.floor(remainder / 60);
    const seconds = remainder % 60;
    return `${days} day, ${minutes} min, ${seconds} sec`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDigimonStats((prevStats) => updateLifespan(prevStats, 1));
    }, 1000);

    const kstTimer = setInterval(() => {
      setCustomTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(kstTimer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedDigimon', selectedDigimon);
    localStorage.setItem('digimonStats', JSON.stringify(digimonStats));
  }, [selectedDigimon, digimonStats]);

  // FeedPopup에서 선택한 먹이 종류에 따른 스프라이트 설정
  let currentFoodSprites = [];
  if (feedType === "meat") {
    currentFoodSprites = meatSprites;
  } else if (feedType === "vitamin") {
    currentFoodSprites = vitaminSprites;
  }

  const openSettings = () => setShowSettingsModal(true);
  const closeSettings = () => setShowSettingsModal(false);

  const resetDigimon = () => {
    if (window.confirm("정말로 모든 진행 데이터를 초기화하시겠습니까?")) {
      localStorage.removeItem('selectedDigimon');
      localStorage.removeItem('digimonStats');
      setSelectedDigimon("Botamon");
      setDigimonStats(initializeStats("Botamon"));
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center overflow-y-auto max-h-screen p-4">
      {/* 디지몬 선택 */}
      <DigimonSelector
        selectedDigimon={selectedDigimon}
        setSelectedDigimon={setSelectedDigimon}
        digimonNames={Object.keys(digimonData)}
      />

      {/* Canvas */}
      <Canvas
        selectedDigimon={selectedDigimon}
        startNumber={startNumber}
        idleFrames={idleFrames}
        eatFrames={eatFrames}
        width={width}
        height={height}
        currentAnimation={currentAnimation}
        showFood={showFood}
        currentFoodIndex={currentFoodIndex}
        foodSprites={currentFoodSprites}
        developerMode={developerMode}
        feedStep={feedStep}
        foodSizeScale={foodSizeScale}
      />

      {/* 진화 셀렉터 */}
      <EvolutionSelector
        selectedDigimon={selectedDigimon}
        onEvolve={handleEvolution}
      />

      {/* 진화 버튼 */}
      <button
        onClick={handleEvolutionButton}
        disabled={!checkEvolutionCondition() && !developerMode}
        className={`mt-4 px-4 py-2 text-white rounded ${
          checkEvolutionCondition() || developerMode ? "bg-green-500" : "bg-gray-500"
        }`}
      >
        Evolution
      </button>

      {/* 진화까지 남은 시간 */}
      <div className="mt-2 text-lg">
        <p>Time to Evolve: {formatTimeToEvolve(digimonStats.timeToEvolve)}</p>
      </div>

      {/* 라이프스팬(day/min/sec) */}
      <div className="text-lg">
        <p>Lifespan: {formatLifespan(digimonStats.lifespanSeconds)}</p>
      </div>

      {/* 현재 KST 시간 */}
      <div className="mt-2 text-lg">
        <p>Current Time (KST): {getKSTTime()}</p>
      </div>

      {/* 스탯 패널 & 메뉴 */}
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
        className="px-4 py-2 bg-yellow-500 text-white rounded mt-4"
        onClick={openSettings}
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

      {/* (팝업) 먹이 선택 */}
      {showFeedPopup && (
        <FeedPopup
          onClose={() => setShowFeedPopup(false)}
          onSelect={(type) => {
            setShowFeedPopup(false);
            handleFeed(type);
          }}
        />
      )}

      {/* Settings 모달 */}
      {showSettingsModal && (
        <SettingsModal
          onClose={closeSettings}
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
          timeMode={timeMode}
          setTimeMode={setTimeMode}
          timeSpeed={timeSpeed}
          setTimeSpeed={setTimeSpeed}
          customTime={customTime}
          setCustomTime={setCustomTime}
        />
      )}

      {/* Reset Digimon 버튼 */}
      <button
        onClick={resetDigimon}
        className="px-4 py-2 bg-red-500 text-white rounded mt-4"
      >
        Reset Digimon
      </button>
    </div>
  );
};

export default Game;