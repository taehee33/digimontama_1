import React, { useState } from "react";
import IconButton from "./IconButton";  // 아이콘 버튼 컴포넌트 가져오기
import "../styles/StatusButtons.css";  // 스타일 import

const StatusButtons = ({ width, height }) => {
  const [activeMenu, setActiveMenu] = useState(null); // 현재 활성화된 메뉴 추적

  // 버튼 클릭 시 처리할 함수들
  const handleStatus = () => setActiveMenu("status");
  const handleEat = () => setActiveMenu("eat");
  const handleTrain = () => setActiveMenu("train");
  const handleBattle = () => setActiveMenu("battle");
  const handleBathroom = () => setActiveMenu("bathroom");
  const handleElectric = () => setActiveMenu("electric");
  const handleHeal = () => setActiveMenu("heal");
  const handleCallSign = () => setActiveMenu("callSign");

  // 아이콘 경로 관리 (스프라이트 이미지 번호 사용)
  const iconPath = (iconName) => {
    const iconMap = {
      status: "/images/191.png",  // 191.png는 스프라이트 이미지 경로
      eat: "/images/193.png",
      train: "/images/195.png",
      battle: "/images/197.png",
      bathroom: "/images/199.png",
      electric: "/images/201.png",
      heal: "/images/203.png",
      callSign: "/images/205.png",
    };

    return iconMap[iconName];  // 경로가 정확한지 확인
  };

  return (
    <div className="status-buttons">
      <div className="game-container" style={{ position: "relative", width: `${width}px`, height: `${height}px` }}>
        {/* 상단 아이콘들 (7등분된 화면의 첫 번째 구역) */}
        <div className="top-row" style={{ position: "absolute", top: "0", width: "100%" }}>
          <IconButton
            icon={iconPath("status")}  // 스프라이트 이미지 경로
            onClick={handleStatus}
            isActive={activeMenu === "status"}
            width={40}  // 더 작은 크기 (40px)
            height={40}  // 더 작은 크기 (40px)
            style={{
              position: "absolute",
              left: "10%",  // 7등분에서 1/7 위치
            }}
          />
          <IconButton
            icon={iconPath("eat")}
            onClick={handleEat}
            isActive={activeMenu === "eat"}
            width={40}
            height={40}
            style={{
              position: "absolute",
              left: "30%",  // 7등분에서 3/7 위치
            }}
          />
          <IconButton
            icon={iconPath("train")}
            onClick={handleTrain}
            isActive={activeMenu === "train"}
            width={40}
            height={40}
            style={{
              position: "absolute",
              left: "50%",  // 7등분에서 5/7 위치
            }}
          />
          <IconButton
            icon={iconPath("battle")}
            onClick={handleBattle}
            isActive={activeMenu === "battle"}
            width={40}
            height={40}
            style={{
              position: "absolute",
              left: "70%",  // 7등분에서 7/7 위치
            }}
          />
        </div>

        {/* 하단 아이콘들 */}
        <div className="bottom-row" style={{ position: "absolute", bottom: "0", width: "100%" }}>
          <IconButton
            icon={iconPath("bathroom")}
            onClick={handleBathroom}
            isActive={activeMenu === "bathroom"}
            width={40}
            height={40}
            style={{
              position: "absolute",
              left: "10%",  // 7등분에서 1/7 위치
            }}
          />
          <IconButton
            icon={iconPath("electric")}
            onClick={handleElectric}
            isActive={activeMenu === "electric"}
            width={40}
            height={40}
            style={{
              position: "absolute",
              left: "30%",  // 7등분에서 3/7 위치
            }}
          />
          <IconButton
            icon={iconPath("heal")}
            onClick={handleHeal}
            isActive={activeMenu === "heal"}
            width={40}
            height={40}
            style={{
              position: "absolute",
              left: "50%",  // 7등분에서 5/7 위치
            }}
          />
          <IconButton
            icon={iconPath("callSign")}
            onClick={handleCallSign}
            isActive={activeMenu === "callSign"}
            width={40}
            height={40}
            style={{
              position: "absolute",
              left: "70%",  // 7등분에서 7/7 위치
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusButtons;
