import { useState } from "react";
import digimonData from "../data/digimonData";
import animationDefinitions from "../data/digimonAnimations";
import Canvas from "../components/Canvas";
import DigimonSelector from "../components/DigimonSelector";
import EvolutionSelector from "../components/EvolutionSelector"; 
import SizeAdjuster from "../components/SizeAdjuster"; 
import MenuIconButtons from "../components/MenuIconButtons";
import StatsPanel from "../components/StatsPanel";
import StatsPopup from "../components/StatsPopup";
import { initializeStats } from "../data/stats";

const Game = () => {
  const [selectedDigimon, setSelectedDigimon] = useState("Botamon");
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const { startNumber } = digimonData[selectedDigimon];

  const [digimonStats, setDigimonStats] = useState(initializeStats());
  const [showStatsPopup, setShowStatsPopup] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [activeMenu, setActiveMenu] = useState(null);

  // 음식 관련 상태
  const foodSprites = [
    "/images/526.png",
    "/images/527.png",
    "/images/528.png",
    "/images/529.png"
  ];
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [showFood, setShowFood] = useState(false);
  const [feedStep, setFeedStep] = useState(0); // 0~3, 먹기 단계 카운트
  const [foodSizeScale, setFoodSizeScale] = useState(0.31); // 🟢 기본값 수정

  // 개발자 모드
  const [developerMode, setDeveloperMode] = useState(false);

  const idleFrames = animationDefinitions[1].frames.map(
    (offset) => `${startNumber + offset}.png`
  );

  const eatFrames = animationDefinitions[2].frames.map(
    (offset) => `${startNumber + offset}.png`
  );

  // 진화 함수
  const handleEvolution = (newDigimon) => {
    if (newDigimon) {
      setSelectedDigimon(newDigimon);
    }
  };

  // Feed 기능 (한 사이클 4번)
  const handleFeed = () => {
    setFeedStep(0); // 초기화
    setShowFood(true);
    feedCycle(0);
  };

  const feedCycle = (step) => {
    if (step >= 4) {
      // 끝나면 idle
      setCurrentAnimation("idle");
      setShowFood(false);

      // 스탯 변화
      setDigimonStats(prev => ({
        ...prev,
        hungerTimer: Math.max(0, prev.hungerTimer - 1),
        minWeight: prev.minWeight + 1
      }));

      return;
    }

    setCurrentAnimation("eat");
    setCurrentFoodIndex(step);
    setFeedStep(step);

    // 다음 단계로 넘어가기
    setTimeout(() => {
      feedCycle(step + 1);
    }, 500); // 0.5초 간격으로 먹기
  };

  // 메뉴 클릭 핸들러
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    switch (menu) {
      case "eat":
        handleFeed();
        break;
      case "status":
        setShowStatsPopup(true);
        break;
      default:
        console.log(`Clicked: ${menu}`);
    }
  };

  // 사이즈 핸들러
  const handleWidthChange = (e) => setWidth(e.target.value);
  const handleHeightChange = (e) => setHeight(e.target.value);
  const handleAspectRatioChange = (e) => {
    const newSize = e.target.value;
    setWidth(newSize);
    setHeight(newSize);
  };

  return (
    <div className="flex flex-col items-center">
      <DigimonSelector
        selectedDigimon={selectedDigimon}
        setSelectedDigimon={setSelectedDigimon}
        digimonNames={Object.keys(digimonData)}
      />

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
        foodSprites={foodSprites}
        developerMode={developerMode}
        feedStep={feedStep}
        foodSizeScale={foodSizeScale}
      />

      <EvolutionSelector
        selectedDigimon={selectedDigimon}
        onEvolve={handleEvolution}
      />

      <SizeAdjuster
        width={width}
        height={height}
        onWidthChange={handleWidthChange}
        onHeightChange={handleHeightChange}
        onAspectRatioChange={handleAspectRatioChange}
      />

      <div className="flex space-x-4 mt-4">
        <StatsPanel stats={digimonStats} />
        <MenuIconButtons
          width={width}
          height={height}
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
        />
      </div>

      {/* 음식 크기 조절 슬라이더 */}
      <div className="mt-4 flex items-center space-x-2">
        <label>Food Size:</label>
        <input
          type="range"
          min="0.1"
          max="0.5"
          step="0.05"
          value={foodSizeScale}
          onChange={(e) => setFoodSizeScale(parseFloat(e.target.value))}
        />
      </div>

      {/* 개발자 모드 토글 */}
      <button
        className="px-2 py-1 bg-gray-500 text-white rounded mt-2"
        onClick={() => setDeveloperMode(!developerMode)}
      >
        {developerMode ? "Dev Mode: ON" : "Dev Mode: OFF"}
      </button>

      {showStatsPopup && (
        <StatsPopup
          stats={digimonStats}
          onClose={() => setShowStatsPopup(false)}
        />
      )}
    </div>
  );
};

export default Game;
