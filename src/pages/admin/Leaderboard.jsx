import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Award, Trophy, Medal } from 'lucide-react';

const rankIcon = (rank) => {
  if (rank === 1) return <Trophy className="w-4 h-4 text-sports-yellow" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-700" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
  return null;
};

const rankBadgeStyle = (rank) => {
  if (rank === 1) return 'bg-sports-yellow/10 border-sports-yellow/20 text-sports-yellow';
  if (rank === 2) return 'bg-slate-300/10 border-slate-300/20 text-slate-700';
  if (rank === 3) return 'bg-amber-600/10 border-amber-600/20 text-amber-500';
  return 'bg-slate-50 border-slate-200 text-sports-gray';
};

export const Leaderboard = () => {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await adminService.getGlobalLeaderboard();
        setBoard(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load leaderboard.');
        setBoard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-sports-green" /> Global Leaderboard
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Platform-wide rankings based on total prediction points earned.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 font-semibold">
          {error}
        </div>
      )}

      {/* Rankings */}
      {loading ? (
        <LoadingSkeleton type="table" />
      ) : board.length > 0 ? (
        <div className="space-y-2">
          {board.map((entry) => (
            <div
              key={entry.rank}
              className={`glass-card border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-slate-300 transition duration-200 ${
                entry.rank <= 3 ? 'border-slate-300' : ''
              }`}
            >
              {/* Rank Badge */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border font-black text-sm ${rankBadgeStyle(entry.rank)}`}
              >
                {entry.rank <= 3 ? rankIcon(entry.rank) : `#${entry.rank}`}
              </div>

              {/* Avatar initial */}
              <div className="w-9 h-9 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center shrink-0 text-xs font-black text-sports-green">
                {entry.name ? entry.name.charAt(0).toUpperCase() : '?'}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <span className="font-extrabold text-sm text-sports-green block truncate">{entry.name}</span>
              </div>

              {/* Points */}
              <div className="text-right shrink-0">
                <span className="flex items-center gap-1.5 font-black text-base text-slate-900">
                  <Trophy className="w-4 h-4 text-sports-yellow" />
                  {entry.points}
                </span>
                <span className="text-[9px] text-sports-gray uppercase font-bold tracking-wider">
                  Points
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No Standings Yet"
          description="No predictions have been scored yet. Leaderboard will populate after match results are verified."
        />
      )}
    </div>
  );
};

export default Leaderboard;
