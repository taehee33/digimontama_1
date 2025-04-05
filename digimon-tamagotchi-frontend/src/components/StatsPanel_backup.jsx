// StatsPanel.jsx (예시)
import React from "react";

const StatsPanel = ({ stats }) => {
  return (
    <div className="border p-2 bg-white shadow-md">
      <p>Age: {stats.age}</p>
      <p>Weight: {stats.weight}</p>
      <p>Strength: {stats.strength}</p>
      <p>Stamina: {stats.stamina}</p>
      <p>WinRate: {stats.winRate}</p>
      <p>Effort: {stats.effort}</p>
      <p>CareMistakes: {stats.careMistakes}</p>
      <p>Fullness: {stats.fullness}</p>
      <p>Health: {stats.health}</p>
    </div>
  );
};

export default StatsPanel;