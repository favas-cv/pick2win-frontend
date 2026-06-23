import React from 'react';
import { Award } from 'lucide-react';

export const UserRankCard = ({ rank, points, accuracy }) => {
  return (
    <div className="bg-gradient-to-r from-sports-green/20 via-sports-green/10 to-transparent border border-sports-green/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-sports-green/5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-sports-green text-black rounded-xl flex items-center justify-center font-extrabold shadow-lg shadow-sports-green/20">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-tight">Your Club Rank</h4>
          <p className="text-xs text-sports-gray">Predict scores correctly to rise on the leaderboard!</p>
        </div>
      </div>

      <div className="flex items-center gap-6 divide-x divide-slate-800">
        <div className="text-center px-4">
          <span className="text-[10px] text-sports-gray font-bold uppercase tracking-wider block">Rank</span>
          <span className="text-xl font-black text-white">#{rank}</span>
        </div>
        <div className="text-center px-4">
          <span className="text-[10px] text-sports-gray font-bold uppercase tracking-wider block">Points</span>
          <span className="text-xl font-black text-sports-green">{points}</span>
        </div>
        <div className="text-center px-4">
          <span className="text-[10px] text-sports-gray font-bold uppercase tracking-wider block">Accuracy</span>
          <span className="text-xl font-black text-sports-yellow">{accuracy}%</span>
        </div>
      </div>
    </div>
  );
};

export default UserRankCard;
