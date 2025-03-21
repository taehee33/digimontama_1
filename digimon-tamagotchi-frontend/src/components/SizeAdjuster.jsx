import React from "react";

const SizeAdjuster = ({ width, height, onWidthChange, onHeightChange, onAspectRatioChange }) => {
  return (
    <div className="space-y-4 p-4 border rounded">
      <div>
        <label className="block font-semibold">
          Width:
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="100"
              max="600"
              value={width}
              onChange={onWidthChange}
              className="flex-1"
            />
            <input
              type="number"
              value={width}
              onChange={onWidthChange}
              className="w-20 p-1 border rounded"
            />
          </div>
        </label>
      </div>

      <div>
        <label className="block font-semibold">
          Height:
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="100"
              max="600"
              value={height}
              onChange={onHeightChange}
              className="flex-1"
            />
            <input
              type="number"
              value={height}
              onChange={onHeightChange}
              className="w-20 p-1 border rounded"
            />
          </div>
        </label>
      </div>

      <div>
        <label className="block font-semibold">
          Uniform Scale (Width & Height):
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="100"
              max="600"
              value={width}  // 부모 onAspectRatioChange에서 width와 height를 동시에 설정
              onChange={onAspectRatioChange}
              className="flex-1"
            />
            <input
              type="number"
              value={width}  // 동일하게 관리
              onChange={onAspectRatioChange}
              className="w-20 p-1 border rounded"
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default SizeAdjuster;
