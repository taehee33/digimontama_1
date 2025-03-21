import React from "react";

const BackgroundSettings = ({
  tempBackground, setTempBackground,
  handleReset
}) => {
  return (
    <div>
      <h3>Background Settings</h3>
      <div>
        <label>Background Number:</label>
        <input type="number" value={tempBackground} onChange={(e) => setTempBackground(e.target.value)} />
      </div>
      <button onClick={() => handleReset("background")}>Reset Background</button>
    </div>
  );
};

export default BackgroundSettings;
