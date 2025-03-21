// FeedPopup.jsx
import React from "react";

const FeedPopup = ({ onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Choose Feed Type</h2>

        {/* 버튼들 간에 공간을 주기 위해 space-y-4 사용 (Tailwind) */}
        <div className="flex flex-col space-y-4">
          <button
            className="px-4 py-2 bg-red-400 text-white rounded"
            onClick={() => onSelect("meat")}
          >
            고기 먹이기
          </button>

          <button
            className="px-4 py-2 bg-blue-400 text-white rounded"
            onClick={() => onSelect("vitamin")}
          >
            비타민 먹이기
          </button>

          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedPopup;