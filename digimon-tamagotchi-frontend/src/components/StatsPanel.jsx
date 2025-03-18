import React from 'react';

const StatsPanel = ({ stats }) => {
  return (
    <div className="p-2 border rounded-xl shadow-md w-48 bg-white">
      <h2 className="text-lg font-bold mb-2">Stats</h2>
      <div className="text-sm">
        <p>Stamina: {stats.maxStamina}</p>
        <p>Weight: {stats.minWeight}</p>
        <p>Hunger Timer: {stats.hungerTimer} min</p>
        <p>Strength Timer: {stats.strengthTimer} min</p>
      </div>
    </div>
  );
};

export default StatsPanel;
