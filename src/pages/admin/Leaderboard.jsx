import React, { useState, useEffect } from 'react';
import { predictionService } from '../../services/predictionService';
import { MOCK_CLUBS } from '../../context/ClubContext';
import LeaderboardCard from '../../components/leaderboard/LeaderboardCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Award, ShieldAlert } from 'lucide-react';

export const Leaderboard = () => {
  const [selectedClubId, setSelectedClubId] = useState('c-brazil');
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const ranking = await predictionService.getLeaderboard(selectedClubId);
        setBoard(ranking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedClubId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-850 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-sports-green" /> Leaderboard Governance
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Monitor scores and accuracy rankings for registered user clubs.
          </p>
        </div>

        {/* Club Selector Dropdown */}
        <select
          value={selectedClubId}
          onChange={(e) => setSelectedClubId(e.target.value)}
          className="bg-slate-900 border border-slate-850 py-2 px-4 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-sports-green transition shrink-0"
        >
          {MOCK_CLUBS.map(club => (
            <option key={club.id} value={club.id} className="bg-slate-900">
              {club.logo} {club.name}
            </option>
          ))}
        </select>
      </div>

      {/* Rankings List */}
      {loading ? (
        <LoadingSkeleton type="table" />
      ) : board.length > 0 ? (
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
          title="No Standings Found"
          description="Members have not accumulated prediction points inside this club yet."
        />
      )}
    </div>
  );
};

export default Leaderboard;
