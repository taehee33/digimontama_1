// src/pages/SelectScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MAX_SLOTS = 10; // 10개로 늘림

function SelectScreen() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);

  // 새 다마고치 만들 때 선택할 기종/버전
  const [device, setDevice] = useState("Digital Monster Color 25th");
  const [version, setVersion] = useState("Ver.1");

  // 슬롯 목록 재로드
  const loadSlots = () => {
    const arr = [];
    for (let i = 1; i <= MAX_SLOTS; i++) {
      const digimonName = localStorage.getItem(`slot${i}_selectedDigimon`);
      if (digimonName) {
        const slotName = localStorage.getItem(`slot${i}_slotName`) || `슬롯${i}`;
        const createdAt = localStorage.getItem(`slot${i}_createdAt`) || "";
        const dev = localStorage.getItem(`slot${i}_device`) || "";
        const ver = localStorage.getItem(`slot${i}_version`) || "";
        arr.push({
          id: i,
          slotName,
          selectedDigimon: digimonName,
          createdAt,
          device: dev,
          version: ver,
        });
      }
    }
    setSlots(arr);
  };

  // 마운트 시
  useEffect(() => {
    loadSlots();
  }, []);

  // 새 다마고치 시작
  const handleNewTama = () => {
    // 빈 슬롯 찾기
    let slotId = null;
    for (let i = 1; i <= MAX_SLOTS; i++) {
      const existing = localStorage.getItem(`slot${i}_selectedDigimon`);
      if (!existing) {
        slotId = i;
        break;
      }
    }
    if (!slotId) {
      alert("슬롯이 모두 찼습니다!");
      return;
    }

    // Digitama로 시작
    localStorage.setItem(`slot${slotId}_selectedDigimon`, "Digitama");
    localStorage.setItem(`slot${slotId}_digimonStats`, JSON.stringify({}));
    localStorage.setItem(`slot${slotId}_device`, device);
    localStorage.setItem(`slot${slotId}_version`, version);

    const slotName = `슬롯${slotId}`;
    localStorage.setItem(`slot${slotId}_slotName`, slotName);

    // 생성일 저장
    const now = new Date();
    const createdAtStr = now.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    localStorage.setItem(`slot${slotId}_createdAt`, createdAtStr);

    navigate(`/game/${slotId}`);
  };

  // 이어하기
  const handleContinue = (slotId) => {
    navigate(`/game/${slotId}`);
  };

  // 슬롯 삭제
  const handleDeleteSlot = (slotId) => {
    if (window.confirm(`슬롯 ${slotId}을 정말 삭제하시겠습니까?`)) {
      localStorage.removeItem(`slot${slotId}_selectedDigimon`);
      localStorage.removeItem(`slot${slotId}_digimonStats`);
      localStorage.removeItem(`slot${slotId}_device`);
      localStorage.removeItem(`slot${slotId}_version`);
      localStorage.removeItem(`slot${slotId}_slotName`);
      localStorage.removeItem(`slot${slotId}_createdAt`);
      loadSlots();
    }
  };

  // 슬롯 이름 변경
  // 각 슬롯별로 input value 관리 -> local state
  const [slotNameEdits, setSlotNameEdits] = useState({}); 

  // 입력 변화 시
  const handleNameChange = (slotId, newName) => {
    setSlotNameEdits((prev) => ({
      ...prev,
      [slotId]: newName,
    }));
  };

  // "수정" 버튼
  const handleSaveName = (slotId) => {
    const newName = slotNameEdits[slotId] || "";
    if (!newName.trim()) {
      alert("이름이 비어있습니다.");
      return;
    }
    localStorage.setItem(`slot${slotId}_slotName`, newName);
    loadSlots();
    alert(`슬롯 ${slotId} 이름을 "${newName}" 로 변경했습니다.`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Select Tamagotchi</h1>

      {/* 기종/버전 */}
      <div className="mb-4">
        <label className="block mb-1">기종(Device):</label>
        <select
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          className="border p-2"
        >
          <option value="Digital Monster Color 25th">
            Digital Monster Color 25th
          </option>
          <option value="기타기종">기타기종</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1">버전(Version):</label>
        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="border p-2"
        >
          <option value="Ver.1">Ver.1</option>
          <option value="Ver.2">Ver.2</option>
          <option value="Ver.3">Ver.3</option>
          <option value="Ver.4">Ver.4</option>
          <option value="Ver.5">Ver.5</option>
        </select>
      </div>

      <button
        onClick={handleNewTama}
        className="px-4 py-2 bg-green-500 text-white rounded mb-4"
      >
        새 다마고치 시작
      </button>

      <h2 className="font-semibold mb-2">슬롯 목록 (최대 {MAX_SLOTS}개)</h2>
      {slots.length === 0 && <p>등록된 다마고치가 없습니다.</p>}

      {slots.map((slot) => (
        <div key={slot.id} className="border p-2 mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleContinue(slot.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              이어하기
            </button>
            <button
              onClick={() => handleDeleteSlot(slot.id)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              삭제
            </button>
          </div>

          <div className="mt-2">
            <p className="font-bold">
              슬롯 {slot.id} - {slot.selectedDigimon}
            </p>
            <p>생성일: {slot.createdAt}</p>
            <p>
              기종: {slot.device} / 버전: {slot.version}
            </p>
          </div>

          <div className="mt-2">
            <label>슬롯 이름: </label>
            <input
              type="text"
              defaultValue={slot.slotName}
              onChange={(e) => handleNameChange(slot.id, e.target.value)}
              className="border p-1 mr-2"
            />
            <button
              onClick={() => handleSaveName(slot.id)}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              수정
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SelectScreen;