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
import { evolutionConditions } from "../data/evolutionConditions";  // 진화 조건 임포트

const Game = () => {
  // 기본 디지몬 설정
  const [selectedDigimon, setSelectedDigimon] = useState("Botamon");
  const { startNumber, stage } = digimonData[selectedDigimon];

  // Canvas 사이즈
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);

  // 스탯 관리
  const [digimonStats, setDigimonStats] = useState(initializeStats("Botamon"));

  // 상태 팝업
  const [showStatsPopup, setShowStatsPopup] = useState(false);

  // 현재 애니메이션
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  // 메뉴 상태
  const [activeMenu, setActiveMenu] = useState(null);

  // 음식 / 먹이주기 상태
  const foodSprites = [
    "/images/526.png",
    "/images/527.png",
    "/images/528.png",
    "/images/529.png"
  ];
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [showFood, setShowFood] = useState(false);
  const [feedStep, setFeedStep] = useState(0);
  const [foodSizeScale, setFoodSizeScale] = useState(0.31);

  // 개발자 모드
  const [developerMode, setDeveloperMode] = useState(false);

  // 시간 관련 (추후 구현)
  const [timeMode, setTimeMode] = useState("KST");
  const [customTime, setCustomTime] = useState(new Date());
  const [timeSpeed, setTimeSpeed] = useState(1);

  // SettingsModal (팝업)
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // 애니메이션 프레임 (idle, eat)
  const idleFrames = animationDefinitions[1]?.frames?.map(
    (offset) => `${startNumber + offset}.png`
  ) || [];
  const eatFrames = animationDefinitions[2]?.frames?.map(
    (offset) => `${startNumber + offset}.png`
  ) || [];

  // 진화 함수
  const handleEvolution = (newDigimon) => {
    if (newDigimon) {
      setSelectedDigimon(newDigimon);
    }
  };

  // 먹이주기
  const handleFeed = () => {
    setFeedStep(0);
    setShowFood(true);
    feedCycle(0);
  };

  const feedCycle = (step) => {
    if (step >= 4) {
      setCurrentAnimation("idle");
      setShowFood(false);
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
    setTimeout(() => {
      feedCycle(step + 1);
    }, 500);
  };

  // 진화 조건 체크
  const checkEvolutionCondition = () => {
    const conditions = evolutionConditions[selectedDigimon]?.evolution || [];
    for (let condition of conditions) {
      if (digimonStats.lifespanMinutes >= condition.condition.lifespanMinutes) {
        return true;  // 진화 조건 충족
      }
    }
    return false;
  };

  const handleEvolutionButton = () => {
    if (checkEvolutionCondition() || developerMode) {
      // 진화 조건을 만족하면 진화 버튼 활성화
      const nextDigimon = "Koromon"; // 예시: Botamon -> Koromon
      handleEvolution(nextDigimon);
    }
  };

  // 메뉴 클릭
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

  // SettingsModal 열고/닫기
  const openSettings = () => setShowSettingsModal(true);
  const closeSettings = () => setShowSettingsModal(false);

  // KST 시간 계산
  const getKSTTime = () => {
    const now = new Date();
    const offset = 9 * 60; // KST는 UTC +9
    const kstTime = new Date(now.getTime() + offset * 60000);
    return kstTime.toLocaleString(); // 한국 표준시로 포맷팅
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDigimonStats(prevStats => updateLifespan(prevStats, 1));  // 1분마다 수명 증가
    }, 60000); // 1분마다 실행

    const kstTimer = setInterval(() => {
      setCustomTime(new Date()); // 1초마다 KST 시간을 갱신
    }, 1000); // 1초마다 KST 시간 갱신

    return () => {
      clearInterval(timer);
      clearInterval(kstTimer);  // 컴포넌트가 unmount될 때 타이머 제거
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
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
        foodSprites={foodSprites}
        developerMode={developerMode}
        feedStep={feedStep}
        foodSizeScale={foodSizeScale}
      />

      {/* 진화 */}
      <EvolutionSelector
        selectedDigimon={selectedDigimon}
        onEvolve={handleEvolution}
      />

      {/* 진화 가능 버튼 */}
      <button
        onClick={handleEvolutionButton}
        disabled={!checkEvolutionCondition() && !developerMode}
        className={`mt-4 px-4 py-2 text-white rounded ${checkEvolutionCondition() || developerMode ? 'bg-green-500' : 'bg-gray-500'}`}
      >
        Evolution
      </button>

      {/* 진화까지 남은 시간 표시 */}
      <div className="mt-2 text-lg">
        <p>Time to Evolve: {digimonStats.timeToEvolve} minutes</p>
        <p>Time to Evolve: {digimonStats.timeToEvolveSeconds} seconds</p>
      </div>

      {/* 현재 KST 시간 표시 */}
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
          backgroundNumber={162}        // 추후 업데이트
          setBackgroundNumber={() => {}}
          digimonSizeScale={0.4}        // 추후 업데이트
          setDigimonSizeScale={() => {}}
          timeMode={timeMode}
          setTimeMode={setTimeMode}
          timeSpeed={timeSpeed}
          setTimeSpeed={setTimeSpeed}
          customTime={customTime}
          setCustomTime={setCustomTime}
        />
      )}
    </div>
  );
};

export default Game;