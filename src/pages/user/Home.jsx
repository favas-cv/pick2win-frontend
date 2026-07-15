import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClub } from '../../context/ClubContext';
import { matchService } from '../../services/matchService';
import { predictionService } from '../../services/predictionService';
import MatchCard from '../../components/match/MatchCard';
import PredictionModal from '../../components/match/PredictionModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';

import { Activity, BarChart2, CalendarDays, History, ShieldAlert, Trophy, AlertCircle } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();
  const { activeClub, memberships } = useClub();

  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('open'); // 'open' | 'predictions' | 'results'

  // Determine membership status for the active club
  const activeMembership = memberships.find(m => m.clubId === activeClub?.id);
  const membershipStatus = activeMembership ? activeMembership.status : 'None';

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [matchesList, predictionsList] = await Promise.all([
          matchService.getMatches(),
          predictionService.getPredictions(),
        ]);
        if (cancelled) return;
        setMatches(matchesList);
        setPredictions(predictionsList);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError('Failed to load dashboard data. Please check your connection.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  const handlePredictClick = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handlePredictionSubmit = async (matchId, scoreA, scoreB) => {
    try {
      const existingPrediction = predictions.find(p => p.matchId === matchId);
      const newPrediction = existingPrediction
        ? await predictionService.updatePrediction(existingPrediction.id, scoreA, scoreB)
        : await predictionService.submitPrediction(matchId, scoreA, scoreB);

      setPredictions(prev => {
        const existingIdx = prev.findIndex(p => p.matchId === matchId);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], ...newPrediction };
          return updated;
        }
        return [...prev, newPrediction];
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ── Loading states ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-20 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse"></div>
        <LoadingSkeleton type="stat" count={4} />
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  // ── Suspended / Rejected ────────────────────────────────────────────────────
  if (membershipStatus === 'Suspended' || membershipStatus === 'Rejected') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Access Denied</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Your membership in <span className="font-bold text-slate-800">{activeClub?.name}</span> has been suspended or rejected.
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Error Loading Data</h2>
          <p className="text-xs text-slate-500 mt-2">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Approved / Active view ──────────────────────────────────────────────────
  const predictionMatchIds = new Set(predictions.map(p => p.matchId));
  const now = new Date();
  const isMatchLockedOrStarted = (match) => {
    const kickoff = match.kickoffTime ? new Date(match.kickoffTime) : null;
    const lockTime = match.predictionLockTime ? new Date(match.predictionLockTime) : kickoff;
    return (
      match.status === 'Completed' ||
      match.status === 'Live' ||
      (lockTime && now >= lockTime) ||
      (kickoff && now >= kickoff)
    );
  };
  const upcomingMatches = matches.filter(
    m => !predictionMatchIds.has(m.id) && m.status === 'Upcoming' && !isMatchLockedOrStarted(m)
  );
  const predictedMatches = predictions
    .map((prediction) => {
      const match = matches.find(m => m.id === prediction.matchId);
      if (match) return { match, prediction };

      const { matchInfo } = prediction;
      return {
        prediction,
        match: {
          id: prediction.matchId,
          tournamentName: prediction.tournamentName,
          teamA: matchInfo.teamA,
          teamB: matchInfo.teamB,
          kickoffTime: matchInfo.kickoffTime,
          predictionLockTime: matchInfo.predictionLockTime || matchInfo.kickoffTime,
          status: matchInfo.status,
          scoreA: matchInfo.scoreA,
          scoreB: matchInfo.scoreB,
        },
      };
    })
    .sort((a, b) => new Date(b.match.kickoffTime) - new Date(a.match.kickoffTime));
  const recentMatches = matches.filter(isMatchLockedOrStarted)
    .sort((a, b) => new Date(b.kickoffTime) - new Date(a.kickoffTime));

  const userTotalPredictions = predictions.length;
  const userTotalPoints = predictions.reduce((sum, p) => sum + (p.pointsEarned || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            Welcome back, <span className="text-black">{user?.name}</span>! 👋
          </h1>
          <p className="text-xs text-sports-gray font-semibold">
            Predicting for <span className="font-bold text-slate-800">{activeClub?.name}</span>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-gradient-to-br from-[#fffdf2] to-white border border-black/10 px-5 py-4 rounded-2xl text-center shrink-0 shadow-sm min-w-[120px]">
            <div className="mx-auto mb-2 w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-md shadow-black/10">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-xl font-black text-black leading-none block">{userTotalPoints}</span>
            <span className="text-[10px] text-slate-500 uppercase block font-extrabold tracking-wider mt-1">Total Points</span>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 px-5 py-4 rounded-2xl text-center shrink-0 shadow-sm min-w-[120px]">
            <div className="mx-auto mb-2 w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/10">
              <BarChart2 className="w-4 h-4" />
            </div>
            <span className="text-xl font-black text-amber-600 leading-none block">{userTotalPredictions}</span>
            <span className="text-[10px] text-slate-500 uppercase block font-extrabold tracking-wider mt-1">Predictions</span>
          </div>
        </div>
      </div>



      {/* Match sections */}
      <div className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-3xl p-2 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('open')}
              className={`flex items-center justify-center gap-2 text-xs sm:text-sm font-black px-3 py-3 rounded-2xl transition-all ${
                activeTab === 'open'
                  ? 'bg-black text-white shadow-md shadow-black/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`flex items-center justify-center gap-2 text-xs sm:text-sm font-black px-3 py-3 rounded-2xl transition-all ${
                activeTab === 'predictions'
                  ? 'bg-black text-white shadow-md shadow-black/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              My Predictions
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center justify-center gap-2 text-xs sm:text-sm font-black px-3 py-3 rounded-2xl transition-all ${
                activeTab === 'results'
                  ? 'bg-black text-white shadow-md shadow-black/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              Recent
            </button>
          </div>
        </div>

        {activeTab === 'open' ? (
          upcomingMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onPredict={handlePredictClick}
                  userPrediction={predictions.find(p => p.matchId === match.id)}
                  roundLabel="Final"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming matches"
              description="There are no open matches available for prediction right now."
            />
          )
        ) : activeTab === 'predictions' ? (
          predictedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictedMatches.map(({ match, prediction }) => (
                <MatchCard
                  key={prediction.id}
                  match={match}
                  onPredict={handlePredictClick}
                  userPrediction={prediction}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="No predictions yet"
              description="Your submitted predictions will appear here."
            />
          )
        ) : (
          recentMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onPredict={handlePredictClick}
                  userPrediction={predictions.find(p => p.matchId === match.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recent matches"
              description="There are no completed or live matches yet."
            />
          )
        )}
      </div>

      {/* Prediction Modal */}
      {selectedMatch && (
        <PredictionModal
          isOpen={isModalOpen}
          match={selectedMatch}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMatch(null);
          }}
          onSubmit={handlePredictionSubmit}
          initialPrediction={predictions.find(p => p.matchId === selectedMatch.id)}
        />
      )}
    </div>
  );
};

export default Home;
