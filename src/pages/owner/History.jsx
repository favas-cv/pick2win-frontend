import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { matchService } from '../../services/matchService';
import MatchCard from '../../components/match/MatchCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { History } from 'lucide-react';

export const HistoryPage = () => {
  const { activeClub } = useClub();
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const matchesList = await matchService.getMatches({ status: 'Completed' });
        setCompletedMatches(matchesList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [activeClub]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-900 border border-slate-800 w-1/3 rounded-xl animate-pulse"></div>
        <LoadingSkeleton type="card" count={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-850 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <History className="w-6 h-6 text-sports-green" /> Match History
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Log of all completed matches and official scores.
        </p>
      </div>

      {completedMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onPredict={() => {}}
              userPrediction={null}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="No Match History"
          description="There are no completed matches recorded in the database yet."
        />
      )}
    </div>
  );
};

export default HistoryPage;
