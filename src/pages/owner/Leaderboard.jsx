import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { predictionService } from '../../services/predictionService';
import { matchService } from '../../services/matchService';
import LeaderboardCard from '../../components/leaderboard/LeaderboardCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Award } from 'lucide-react';

export const Leaderboard = () => {
  const { activeClub } = useClub();
  const [board, setBoard] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournamentsAndLeaderboard = async () => {
      if (!activeClub) return;
      setLoading(true);
      try {
        const allTournaments = await matchService.getTournaments();
        setTournaments(allTournaments);

        let tId = selectedTournament;
        if (!tId && allTournaments.length > 0) {
          tId = allTournaments[0].id;
          setSelectedTournament(allTournaments[0].id);
        }

        if (tId) {
          const ranking = await predictionService.getLeaderboard(activeClub.id, tId);
          setBoard(ranking);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentsAndLeaderboard();
  }, [activeClub, selectedTournament]);

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
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-sports-green" /> Club Leaderboard
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Review prediction accuracy ranking tables for <span className="font-bold text-slate-900">{activeClub?.name}</span>.
          </p>
        </div>

        {tournaments.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-sports-gray uppercase tracking-wide">Tournament:</label>
            <select
              value={selectedTournament || ''}
              onChange={(e) => setSelectedTournament(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-sports-green transition"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-50">
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {board.length > 0 ? (
        <div className="space-y-2.5">
          {board.map((userRank) => (
            <LeaderboardCard
              key={userRank.rank}
              userRank={userRank}
              isCurrentUser={false}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No Standings Available"
          description="Members have not accumulated prediction points inside this club yet."
        />
      )}
    </div>
  );
};

export default Leaderboard;
