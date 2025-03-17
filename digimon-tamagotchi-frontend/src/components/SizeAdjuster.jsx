import React from "react";

const SizeAdjuster = ({ width, height, onWidthChange, onHeightChange, onAspectRatioChange }) => {
  return (
    <div>
      <div>
        <label>
          Width:
          <input
            type="range"
            min="100"
            max="600"
            value={width}
            onChange={onWidthChange}
          />
          <input
            type="number"
            value={width}
            onChange={onWidthChange}
          />
        </label>
      </div>

      <div>
        <label>
          Height:
          <input
            type="range"
            min="100"
            max="400"
            value={height}
            onChange={onHeightChange}
          />
          <input
            type="number"
            value={height}
            onChange={onHeightChange}
          />
        </label>
      </div>

      <div>
        <label>
          Uniform Scale (Width & Height):
          <input
            type="range"
            min="100"
            max="600"
            value={width}  // width와 height는 동일하게 제어
            onChange={onAspectRatioChange}
          />
          <input
            type="number"
            value={width}  // width와 height는 동일하게 제어
            onChange={onAspectRatioChange}
          />
        </label>
      </div>
    </div>
  );
};

export default SizeAdjuster;
