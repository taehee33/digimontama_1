// src/components/StatsPopup.jsx
import React from "react";

// lifespan format
function formatTime(sec=0){
  const d= Math.floor(sec/86400);
  const r= sec%86400;
  const m= Math.floor(r/60);
  const s= r%60;
  return `${d} day ${m} min ${s} sec`;
}

export default function StatsPopup({ stats, onClose }){
  // 오버피드 => fullness>5 ? fullness-5 : 0
  const overfeed = stats.fullness>5 ? stats.fullness-5 : 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-xl w-80">
        <h2 className="text-lg font-bold mb-2">디지몬 상태</h2>
        <ul className="text-sm space-y-1">
          <li>Age: {stats.age}</li>
          <li>Sprite: {stats.sprite}</li>
          <li>Stage: {stats.evolutionStage}</li>
          <li>Lifespan: {formatTime(stats.lifespanSeconds)}</li>
          <li>TimeToEvolve: {stats.timeToEvolveSeconds} sec</li>
          <li>Fullness: {stats.fullness} (오버피드: {overfeed})</li>
          <li>Health: {stats.health}</li>
          <li>Weight: {stats.weight}</li>
          <li>MaxOverfeed: {stats.maxOverfeed}</li>
          <li>isDead: {stats.isDead? "Yes":"No"}</li>

          <li>HungerTimer: {stats.hungerTimer} min</li>
          <li>StrengthTimer: {stats.strengthTimer} min</li>
          <li>PoopTimer: {stats.poopTimer}</li>

          <li>MaxStamina: {stats.maxStamina}</li>
          <li>MinWeight: {stats.minWeight}</li>
          {/* etc... */}
        </ul>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}