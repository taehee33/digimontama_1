import React, { useState, useEffect } from "react";

const SettingsModal = ({
  onClose,
  // 기본 상태들
  foodSizeScale, setFoodSizeScale,
  developerMode, setDeveloperMode,
  width, height, setWidth, setHeight,
  backgroundNumber, setBackgroundNumber,
  digimonSizeScale, setDigimonSizeScale,
  timeMode, setTimeMode,
  timeSpeed, setTimeSpeed,
  customTime, setCustomTime
}) => {
  // 로컬 상태
  const [localWidth, setLocalWidth] = useState(width);
  const [localHeight, setLocalHeight] = useState(height);
  const [localUniform, setLocalUniform] = useState(Math.min(width, height));
  const [localDevMode, setLocalDevMode] = useState(developerMode);

  // 초기값
  useEffect(() => {
    setLocalWidth(width);
    setLocalHeight(height);
    setLocalUniform(Math.min(width, height));
    setLocalDevMode(developerMode);
  }, [width, height, developerMode]);

  // Width/Height 변경
  const handleLocalWidthChange = (e) => {
    const val = parseInt(e.target.value);
    setLocalWidth(val);
  };
  const handleLocalHeightChange = (e) => {
    const val = parseInt(e.target.value);
    setLocalHeight(val);
  };

  // Uniform scale 변경
  const handleUniformChange = (e) => {
    const val = parseInt(e.target.value);
    setLocalUniform(val);
    // Uniform → Width, Height 함께 변경
    setLocalWidth(val);
    setLocalHeight(val);
  };

  // Dev Mode toggle
  const toggleDevMode = () => {
    setLocalDevMode(!localDevMode);
  };

  // Reset functions for each setting
  const resetWidth = () => setLocalWidth(300);  // Reset to default width
  const resetHeight = () => setLocalHeight(200);  // Reset to default height
  const resetUniform = () => {
    setLocalUniform(Math.min(300, 200));  // Reset to the smaller of the default width and height
    setLocalWidth(300);  // Reset width to default
    setLocalHeight(200);  // Reset height to default
  };
  const resetDevMode = () => setLocalDevMode(false);  // Reset to default developer mode (off)

  // Save
  const handleSave = () => {
    setWidth(localWidth);
    setHeight(localHeight);
    setDeveloperMode(localDevMode);
    // TODO: timeMode, timeSpeed, customTime 등도 저장 로직
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl mb-4">Settings</h2>

        {/* Dev Mode */}
        <div className="mb-4">
          <label className="block font-semibold">Developer Mode</label>
          <button
            className={`px-3 py-1 rounded mt-1 ${localDevMode ? "bg-green-500" : "bg-gray-500"} text-white`}
            onClick={toggleDevMode}
          >
            {localDevMode ? "ON" : "OFF"}
          </button>
          <button onClick={resetDevMode} className="ml-2 px-3 py-1 bg-red-500 text-white rounded">
            Reset
          </button>
        </div>

        {/* Size Settings */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Size Settings</h3>
          <div>
            <label>Width: {localWidth}px</label>
            <input
              type="range"
              min="100"
              max="600"
              value={localWidth}
              onChange={handleLocalWidthChange}
              className="w-full"
            />
            <input
              type="number"
              value={localWidth}
              onChange={handleLocalWidthChange}
              className="w-full p-1 border rounded mt-1"
            />
            <button onClick={resetWidth} className="mt-2 px-3 py-1 bg-red-500 text-white rounded">
              Reset
            </button>
          </div>
          <div className="mt-2">
            <label>Height: {localHeight}px</label>
            <input
              type="range"
              min="100"
              max="600"
              value={localHeight}
              onChange={handleLocalHeightChange}
              className="w-full"
            />
            <input
              type="number"
              value={localHeight}
              onChange={handleLocalHeightChange}
              className="w-full p-1 border rounded mt-1"
            />
            <button onClick={resetHeight} className="mt-2 px-3 py-1 bg-red-500 text-white rounded">
              Reset
            </button>
          </div>
          <div className="mt-2">
            <label>Uniform Scale: {localUniform}px</label>
            <input
              type="range"
              min="100"
              max="600"
              value={localUniform}
              onChange={handleUniformChange}
              className="w-full"
            />
            <input
              type="number"
              value={localUniform}
              onChange={handleUniformChange}
              className="w-full p-1 border rounded mt-1"
            />
            <button onClick={resetUniform} className="mt-2 px-3 py-1 bg-red-500 text-white rounded">
              Reset
            </button>
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;