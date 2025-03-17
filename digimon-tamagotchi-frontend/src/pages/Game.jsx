import { useState } from "react";
import digimonData from "../data/digimonData";
import animationDefinitions from "../data/digimonAnimations";
import Canvas from "../components/Canvas";
import DigimonSelector from "../components/DigimonSelector";
import EvolutionSelector from "../components/EvolutionSelector"; 
import SizeAdjuster from "../components/SizeAdjuster"; 
import StatusButtons from "../components/StatusButtons";  // 아이콘 버튼을 관리하는 컴포넌트 추가

const Game = () => {
  const [selectedDigimon, setSelectedDigimon] = useState("Botamon");
  const [width, setWidth] = useState(300);  // 초기 가로 크기
  const [height, setHeight] = useState(200); // 초기 세로 크기
  const { startNumber } = digimonData[selectedDigimon];

  const idleFrames = animationDefinitions[1].frames.map(
    (offset) => `${startNumber + offset}.png`
  );

  // 진화 함수
  const handleEvolution = (newDigimon) => {
    if (newDigimon) {
      setSelectedDigimon(newDigimon);
    }
  };

  // 슬라이더 값 변경 핸들러
  const handleWidthChange = (e) => {
    setWidth(e.target.value);
  };

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
  };

  // 동일한 배율로 width와 height를 변경하는 핸들러
  const handleAspectRatioChange = (e) => {
    const newSize = e.target.value;
    setWidth(newSize);
    setHeight(newSize);
  };

  return (
    <div>
      <DigimonSelector
        selectedDigimon={selectedDigimon}
        setSelectedDigimon={setSelectedDigimon}
        digimonNames={Object.keys(digimonData)}
      />
      
      <Canvas
        selectedDigimon={selectedDigimon}
        startNumber={startNumber}
        idleFrames={idleFrames}
        width={width}
        height={height}
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

      {/* 아이콘 버튼을 관리하는 컴포넌트 */}
      <StatusButtons width={width} height={height} /> {/* 슬라이더 값 전달 */}
    </div>
  );
};

export default Game;
