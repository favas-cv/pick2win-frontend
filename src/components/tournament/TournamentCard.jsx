import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const TournamentCard = ({ tournament, showAction = true, actionButton }) => {
  const { id, name, logo, sportType, matchCount } = tournament;

  return (
    <div className="glass-card border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition duration-300 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0">
          {logo}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-snug">{name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-slate-850 text-sports-gray font-bold uppercase tracking-wider">
              {sportType}
            </span>
            <span className="text-[9px] text-sports-gray flex items-center gap-1 font-semibold">
              ● {matchCount} Matches
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {actionButton ? (
          actionButton
        ) : showAction ? (
          <Link
            to={`/user/tournaments/${id}`}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center justify-center text-sports-gray hover:text-white transition"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default TournamentCard;
