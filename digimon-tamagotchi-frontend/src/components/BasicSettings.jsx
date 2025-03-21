import React from "react";

const BasicSettings = ({
  tempFoodSize, setTempFoodSize,
  tempWidth, setTempWidth,
  tempHeight, setTempHeight,
  tempDevMode, setTempDevMode,
  handleReset
}) => {
  return (
    <div>
      <h3>Basic Settings</h3>
      <div>
        <label>Food Size:</label>
        <input type="range" min="0.1" max="1" step="0.05" value={tempFoodSize} onChange={(e) => setTempFoodSize(e.target.value)} />
      </div>
      <div>
        <label>Width:</label>
        <input type="number" value={tempWidth} onChange={(e) => setTempWidth(e.target.value)} />
      </div>
      <div>
        <label>Height:</label>
        <input type="number" value={tempHeight} onChange={(e) => setTempHeight(e.target.value)} />
      </div>
      <div>
        <label>Developer Mode:</label>
        <input type="checkbox" checked={tempDevMode} onChange={() => setTempDevMode(!tempDevMode)} />
      </div>
      <button onClick={() => handleReset("food")}>Reset Food Settings</button>
      <button onClick={() => handleReset("widthHeight")}>Reset Size</button>
      <button onClick={() => handleReset("developerMode")}>Reset Developer Mode</button>
    </div>
  );
};

export default BasicSettings;
