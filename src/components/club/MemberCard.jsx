import React from 'react';
import { Calendar } from 'lucide-react';

export const MemberCard = ({ member }) => {
  const { name, email, joinedDate, predictions, points, avatar } = member;

  return (
    <div className="glass-card border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition duration-300 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img
          src={avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
          alt={name}
          className="w-11 h-11 rounded-full border border-slate-700 bg-slate-900 object-cover shrink-0"
        />
        <div className="truncate">
          <h4 className="text-sm font-bold text-white truncate max-w-[150px]">{name}</h4>
          <span className="text-[10px] text-sports-gray block truncate max-w-[150px]">{email}</span>
          <span className="text-[9px] text-sports-gray flex items-center gap-1 mt-1 font-semibold">
            <Calendar className="w-3 h-3 text-sports-green" /> Joined: {new Date(joinedDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right shrink-0">
        <div className="px-2">
          <span className="text-[9px] text-sports-gray uppercase block font-bold">Predictions</span>
          <span className="text-sm font-extrabold text-white">{predictions}</span>
        </div>
        <div className="border-l border-slate-800 pl-4">
          <span className="text-[9px] text-sports-gray uppercase block font-bold">Points</span>
          <span className="text-sm font-black text-sports-green">{points}</span>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
