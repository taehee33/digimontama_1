import React from "react";

const TimeSettings = ({
  tempTimeMode, setTempTimeMode,
  tempTimeSpeed, setTempTimeSpeed,
  tempCustomTime, setTempCustomTime
}) => {
  return (
    <div>
      <h3>Time Settings</h3>
      <div>
        <label>Time Mode:</label>
        <select value={tempTimeMode} onChange={(e) => setTempTimeMode(e.target.value)}>
          <option value="KST">KST</option>
          <option value="Custom">Custom</option>
        </select>
      </div>
      {tempTimeMode === "Custom" && (
        <div>
          <label>Custom Time:</label>
          <input type="datetime-local" value={tempCustomTime} onChange={(e) => setTempCustomTime(e.target.value)} />
        </div>
      )}
      <div>
        <label>Time Speed:</label>
        <input type="number" value={tempTimeSpeed} onChange={(e) => setTempTimeSpeed(e.target.value)} />
      </div>
    </div>
  );
};

export default TimeSettings;
