// src/components/StatsPanel.jsx
import React from "react";

/**
 * fullnessDisplay:
 *  - fullness≥5시 5까지만 표시 + (나머지 오버피드)
 *  - 예) fullness=7 => "5(+2)"
 */
function fullnessDisplay(fullness=0, maxOverfeed=0){
  const base = Math.min(5, fullness);
  let over = 0;
  if(fullness > 5){
    over = fullness - 5;
  }
  return `${base}${over>0 ? "(+"+over+")" : ""}`;
}

const StatsPanel = ({ stats }) => {
  return (
    <div className="border p-2 bg-white shadow-md text-sm w-48">
      <p>Age: {stats.age}</p>
      <p>Weight: {stats.weight}</p>
      <p>Strength: {stats.strength}</p>
      <p>Stamina: {stats.stamina}</p>
      <p>WinRate: {stats.winRate}</p>
      <p>Effort: {stats.effort}</p>
      <p>CareMistakes: {stats.careMistakes}</p>

      {/* Fullness 표기: e.g. 5(+2) */}
      <p>Fullness: {fullnessDisplay(stats.fullness, stats.maxOverfeed)}</p>

      <p>Health: {stats.health}</p>
    </div>
  );
};

export default StatsPanel;

