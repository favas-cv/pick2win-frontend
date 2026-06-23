import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { matchService } from '../../services/matchService';
import { clubService } from '../../services/clubService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Trophy, Check, ToggleLeft, ToggleRight } from 'lucide-react';

export const TournamentSelection = () => {
  const { activeClub } = useClub();
  const [allTournaments, setAllTournaments] = useState([]);
  const [enabledIds, setEnabledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeClub) return;
      setLoading(true);
      try {
        const [tournamentsList, activeIds] = await Promise.all([
          matchService.getTournaments(),
          clubService.getEnabledTournaments(activeClub.id)
        ]);
        setAllTournaments(tournamentsList);
        setEnabledIds(activeIds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeClub]);

  const handleToggleTournament = async (tournamentId) => {
    if (!activeClub) return;
    setUpdatingId(tournamentId);
    
    let updatedIds;
    if (enabledIds.includes(tournamentId)) {
      updatedIds = enabledIds.filter(id => id !== tournamentId);
    } else {
      updatedIds = [...enabledIds, tournamentId];
    }

    try {
      await clubService.updateClubTournaments(activeClub.id, updatedIds);
      setEnabledIds(updatedIds);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-900 border border-slate-800 w-1/3 rounded-xl animate-pulse"></div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-850 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-sports-green" /> Tournament Selection
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Select which global tournaments are active for prediction by members of <span className="font-bold text-slate-200">{activeClub?.name}</span>.
        </p>
      </div>

      {/* Tournaments selection list */}
      <div className="space-y-4">
        {allTournaments.map((tournament) => {
          const isEnabled = enabledIds.includes(tournament.id);
          const isToggling = updatingId === tournament.id;
          
          return (
            <div 
              key={tournament.id}
              className={`glass-card border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition flex items-center justify-between gap-4 ${
                isEnabled ? 'bg-sports-green/[0.02] border-sports-green/10' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {tournament.logo}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-snug">{tournament.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-sports-gray font-bold tracking-wider uppercase">
                      {tournament.sportType}
                    </span>
                    <span className="text-[9px] text-sports-gray font-bold">
                      ● {tournament.matchCount} Matches
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle switch action */}
              <button
                onClick={() => handleToggleTournament(tournament.id)}
                disabled={isToggling}
                className="focus:outline-none transition-opacity hover:opacity-90 shrink-0"
              >
                {isToggling ? (
                  <div className="w-6 h-6 border-2 border-sports-green border-t-transparent rounded-full animate-spin"></div>
                ) : isEnabled ? (
                  <ToggleRight className="w-10 h-10 text-sports-green" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-sports-gray" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentSelection;
