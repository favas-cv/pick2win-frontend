import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { useAuth } from '../../context/AuthContext';
import { predictionService } from '../../services/predictionService';
import { matchService } from '../../services/matchService';
import LeaderboardCard from '../../components/leaderboard/LeaderboardCard';
import UserRankCard from '../../components/leaderboard/UserRankCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Award, ShieldAlert } from 'lucide-react';

export const Leaderboard = () => {
  const { user } = useAuth();
  const { activeClub } = useClub();
  const [board, setBoard] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  const isApproved = !!activeClub;

  useEffect(() => {
    const fetchTournamentsAndLeaderboard = async () => {
      setLoading(true);
      try {
        const allTournaments = await matchService.getTournaments();
        setTournaments(allTournaments);

        let tId = selectedTournament;
        if (!tId && allTournaments.length > 0) {
          tId = allTournaments[0].id;
          setSelectedTournament(allTournaments[0].id);
        }

        if (tId && activeClub) {
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
        <div className="h-10 bg-slate-100 border border-slate-200 rounded-xl w-1/4 animate-pulse"></div>
        <div className="h-24 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse"></div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const currentUserStandings = board.find(u => u.userId === user?.id) || {
    rank: '-',
    points: 0,
    accuracy: 100
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" /> Leaderboard Rankings
          </h1>
          <p className="text-xs text-sports-gray mt-1 font-semibold">
            Rank standings inside the <span className="font-bold text-slate-700">{activeClub?.name}</span>.
          </p>
        </div>

        {tournaments.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-650 uppercase tracking-wide">Tournament:</label>
            <select
              value={selectedTournament || ''}
              onChange={(e) => setSelectedTournament(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {board.length > 0 ? (
        <div className="space-y-6">
          <UserRankCard 
            rank={currentUserStandings.rank} 
            points={currentUserStandings.points} 
            accuracy={currentUserStandings.accuracy} 
          />

          <div className="space-y-3">
            <h3 className="text-xs font-black text-sports-gray uppercase tracking-wider pl-1">Ranks</h3>
            <div className="space-y-2.5">
              {board.map((userRank) => (
                <LeaderboardCard
                  key={userRank.rank}
                  userRank={userRank}
                  isCurrentUser={userRank.userId === user?.id}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState 
          icon={Award}
          title="No Standings Yet" 
          description="Submit predictions to record points and rank up!" 
        />
      )}
    </div>
  );
};

export default Leaderboard;
