import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { useAuth } from '../../context/AuthContext';
import { predictionService } from '../../services/predictionService';
import LeaderboardCard from '../../components/leaderboard/LeaderboardCard';
import UserRankCard from '../../components/leaderboard/UserRankCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Award, ShieldAlert } from 'lucide-react';

export const Leaderboard = () => {
  const { user } = useAuth();
  const { activeClub, memberships } = useClub();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check membership status
  const activeMembership = memberships.find(m => m.clubId === activeClub?.id && m.email === user?.email);
  const isApproved = activeMembership?.status === 'Approved';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!activeClub || !isApproved) {
        setLoading(false);
        return;
      }
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
  }, [activeClub, isApproved]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 border border-slate-200 rounded-xl w-1/4 animate-pulse"></div>
        <div className="h-24 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse"></div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 border border-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Awaiting Club Approval</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            You must be approved by the club owner in <span className="font-bold text-slate-800">{activeClub?.name}</span> to view rankings.
          </p>
        </div>
      </div>
    );
  }

  const currentUserStandings = board.find(u => u.name === user?.name) || {
    rank: 4,
    points: 98,
    accuracy: 55
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" /> Leaderboard Rankings
        </h1>
        <p className="text-xs text-sports-gray mt-1 font-semibold">
          Rank standings inside the <span className="font-bold text-slate-700">{activeClub?.name}</span>.
        </p>
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
                  isCurrentUser={userRank.name === user?.name || userRank.name === 'John Doe'}
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
