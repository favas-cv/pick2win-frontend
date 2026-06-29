import React, { useState, useEffect } from 'react';
import { matchService } from '../../services/matchService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Trophy } from 'lucide-react';

export const TournamentSelection = () => {
  const [allTournaments, setAllTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchService.getTournaments()
      .then(list => setAllTournaments(Array.isArray(list) ? list : []))
      .catch(() => setAllTournaments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-50 border border-slate-200 w-1/3 rounded-xl animate-pulse"></div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-sports-green" /> Tournaments
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          All active tournaments available for your club members.
        </p>
      </div>

      {/* Tournaments list */}
      <div className="space-y-4">
        {allTournaments.length === 0 && (
          <p className="text-sports-gray text-sm">No tournaments found.</p>
        )}
        {allTournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="glass-card border-slate-200 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-2xl shrink-0">
              {tournament.logo || '🏆'}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{tournament.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-sports-gray font-bold tracking-wider uppercase">
                  {tournament.sportType || 'Football'}
                </span>
                <span className="text-[9px] text-sports-gray font-bold">
                  ● {tournament.matchCount || 0} Matches
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentSelection;
