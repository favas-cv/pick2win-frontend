import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { predictionService } from '../../services/predictionService';
import LeaderboardCard from '../../components/leaderboard/LeaderboardCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Award } from 'lucide-react';

export const Leaderboard = () => {
  const { activeClub } = useClub();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!activeClub) return;
      setLoading(true);
      try {
        const ranking = await predictionService.getLeaderboard(activeClub.id);
        setBoard(ranking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeClub]);

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
          <Award className="w-6 h-6 text-sports-green" /> Club Leaderboard
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Review prediction accuracy ranking tables for <span className="font-bold text-slate-200">{activeClub?.name}</span>.
        </p>
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
