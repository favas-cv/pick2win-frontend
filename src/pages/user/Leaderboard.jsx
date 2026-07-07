import { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { useAuth } from '../../context/AuthContext';
import { predictionService } from '../../services/predictionService';
import { matchService } from '../../services/matchService';
import LeaderboardCard from '../../components/leaderboard/LeaderboardCard';
import UserRankCard from '../../components/leaderboard/UserRankCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Award } from 'lucide-react';

export const Leaderboard = () => {
  const { user } = useAuth();
  const { activeClub } = useClub();
  const [board, setBoard] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect 1: Fetch tournaments on mount
  useEffect(() => {
    let cancelled = false;

    const fetchTournaments = async () => {
      try {
        const allTournaments = await matchService.getTournaments();
        if (cancelled) return;
        setTournaments(allTournaments);
        if (allTournaments.length > 0 && !selectedTournament) {
          setSelectedTournament(allTournaments[0].id);
        } else if (allTournaments.length === 0) {
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setLoading(false);
        }
      }
    };

    fetchTournaments();
    return () => {
      cancelled = true;
    };
  }, []);

  // Effect 2: Fetch leaderboard when activeClub or selectedTournament changes
  useEffect(() => {
    if (!activeClub || !selectedTournament) return;

    let cancelled = false;

    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const ranking = await predictionService.getLeaderboard(activeClub.id, selectedTournament);
        if (!cancelled) {
          setBoard(ranking);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();
    return () => {
      cancelled = true;
    };
  }, [activeClub, selectedTournament]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <div className="h-12 bg-slate-100 border border-slate-200 rounded-2xl w-2/3 animate-pulse"></div>
        <div className="h-20 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse"></div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const currentUserStandings = board.find(u => u.userId === user?.id) || {
    rank: '-',
    points: 0,
    name: user?.name,
    avatar: user?.profile_image || user?.avatar,
  };
  const selectedTournamentName = tournaments.find(t => t.id === selectedTournament)?.name || 'Tournament';
  const topThree = [2, 1, 3]
    .map(rank => board.find(userRank => Number(userRank.rank) === rank))
    .filter(Boolean);
  const remainingStandings = board.filter(userRank => Number(userRank.rank) > 3);

  return (
    <div className="mx-auto max-w-xl space-y-4 px-0 sm:px-2">
      {/* Header */}
      <div className="px-1 pt-1">
        <h1 className="text-2xl font-black leading-tight text-slate-950">Leaderboard</h1>
        <p className="mt-1 truncate text-xs font-medium text-slate-500">{selectedTournamentName}</p>
      </div>

      {board.length > 0 ? (
        <div className="space-y-4">
          <UserRankCard 
            rank={currentUserStandings.rank} 
            points={currentUserStandings.points} 
            name={currentUserStandings.name || user?.name}
            avatar={currentUserStandings.avatar || user?.profile_image || user?.avatar}
          />

          {topThree.length > 0 && (
            <div className="rounded-[28px] border border-slate-200 bg-white px-3 pb-5 pt-7 shadow-lg shadow-slate-900/5">
              <div className="flex items-start justify-center gap-2">
                {topThree.map((userRank) => (
                  <LeaderboardCard
                    key={userRank.rank}
                    userRank={userRank}
                    isCurrentUser={userRank.userId === user?.id}
                    variant="podium"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {remainingStandings.map((userRank) => (
              <LeaderboardCard
                key={userRank.rank}
                userRank={userRank}
                isCurrentUser={userRank.userId === user?.id}
              />
            ))}
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
