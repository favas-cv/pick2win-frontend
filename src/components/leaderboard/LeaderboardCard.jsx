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
        ? 'bg-blue-50 border-blue-200 shadow-md shadow-blue-500/10' 
        : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
    }`}>
      {/* Rank and User Details */}
      <div className="flex items-center gap-3">
        <div className="w-8 flex justify-center items-center shrink-0">
          {getRankBadge()}
        </div>
        <img
          src={avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
          alt={name}
          className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 object-cover shrink-0"
        />
        <div className="truncate">
          <span className={`text-sm font-bold block truncate max-w-[150px] ${
            isCurrentUser ? 'text-blue-700' : 'text-slate-900'
          }`}>
            {name}
            {isCurrentUser && <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md ml-1.5 shadow-sm">You</span>}
          </span>
          <span className="text-[10px] text-sports-gray flex items-center gap-1 font-semibold">
            <Zap className="w-3 h-3 text-amber-500" /> {accuracy}% Accuracy
          </span>
        </div>
      </div>

      {/* Points */}
      <div className="text-right shrink-0">
        <span className={`text-base font-black ${isCurrentUser ? 'text-blue-700' : 'text-slate-900'}`}>{points}</span>
        <span className="text-[9px] text-sports-gray uppercase font-bold tracking-wider block">Points</span>
      </div>
    </div>
  );
};

export default LeaderboardCard;
