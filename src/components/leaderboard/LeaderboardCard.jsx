import React from 'react';
import { Award, Zap } from 'lucide-react';

export const LeaderboardCard = ({ userRank, isCurrentUser }) => {
  const { rank, name, avatar, points, accuracy } = userRank;

  const getRankBadge = () => {
    if (rank === 1) {
      return (
        <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center text-xs font-black shadow-lg shadow-yellow-500/20">
          🏆
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-6 h-6 rounded-full bg-slate-300 text-black flex items-center justify-center text-xs font-black shadow-lg shadow-slate-300/20">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-amber-600/20">
          🥉
        </div>
      );
    }
    return (
      <span className="text-xs font-extrabold text-sports-gray w-6 text-center">
        {rank}
      </span>
    );
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition duration-200 ${
      isCurrentUser 
        ? 'bg-sports-green/10 border-sports-green/30 shadow-lg shadow-sports-green/5' 
        : 'glass-card border-slate-800/80 hover:border-slate-700/80'
    }`}>
      {/* Rank and User Details */}
      <div className="flex items-center gap-3">
        <div className="w-8 flex justify-center items-center shrink-0">
          {getRankBadge()}
        </div>
        <img
          src={avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
          alt={name}
          className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 object-cover shrink-0"
        />
        <div className="truncate">
          <span className={`text-sm font-bold block truncate max-w-[150px] ${
            isCurrentUser ? 'text-sports-green' : 'text-slate-200'
          }`}>
            {name}
            {isCurrentUser && <span className="text-[9px] bg-sports-green/20 text-sports-green px-1.5 py-0.5 rounded-md ml-1.5">You</span>}
          </span>
          <span className="text-[10px] text-sports-gray flex items-center gap-1 font-semibold">
            <Zap className="w-3 h-3 text-sports-yellow" /> {accuracy}% Accuracy
          </span>
        </div>
      </div>

      {/* Points */}
      <div className="text-right shrink-0">
        <span className="text-base font-black text-white">{points}</span>
        <span className="text-[9px] text-sports-gray uppercase font-bold tracking-wider block">Points</span>
      </div>
    </div>
  );
};

export default LeaderboardCard;
