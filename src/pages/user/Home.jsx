import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClub } from '../../context/ClubContext';
import { matchService } from '../../services/matchService';
import { predictionService } from '../../services/predictionService';
import StatCard from '../../components/common/StatCard';
import MatchCard from '../../components/match/MatchCard';
import PredictionModal from '../../components/match/PredictionModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Trophy, Flame, CheckCircle, BarChart2, Star, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();
  const { activeClub, memberships, loadingClubs } = useClub();

  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('open'); // 'open' | 'results'

  // Determine membership status for the active club
  const activeMembership = memberships.find(m => m.clubId === activeClub?.id);
  const membershipStatus = activeMembership ? activeMembership.status : 'None';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [matchesList, predictionsList] = await Promise.all([
          matchService.getMatches(),
          predictionService.getPredictions(),
        ]);
        setMatches(matchesList);
        setPredictions(predictionsList);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePredictClick = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handlePredictionSubmit = async (matchId, scoreA, scoreB) => {
    try {
      const newPrediction = await predictionService.submitPrediction(matchId, scoreA, scoreB);
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
          className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Approved / Active view ──────────────────────────────────────────────────
  const upcomingMatches = matches.filter(m => m.status === 'Upcoming');
  const completedMatches = matches.filter(m => m.status === 'Completed' || m.status === 'Live');

  const userTotalPredictions = predictions.length;
  const userCorrectScores = predictions.filter(p => p.pointsEarned >= 3).length;
  const userTotalPoints = predictions.reduce((sum, p) => sum + (p.pointsEarned || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            Welcome back, <span className="text-blue-600">{user?.name}</span>! 👋
          </h1>
          <p className="text-xs text-sports-gray font-semibold">
            Predicting for <span className="font-bold text-slate-800">{activeClub?.name}</span>.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center shrink-0">
            <span className="text-[9px] text-sports-gray uppercase block font-bold tracking-wider">Total Points</span>
            <span className="text-sm font-black text-blue-600">{userTotalPoints} pts</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center shrink-0">
            <span className="text-[9px] text-sports-gray uppercase block font-bold tracking-wider">Predictions</span>
            <span className="text-sm font-black text-amber-500">{userTotalPredictions}</span>
          </div>
        </div>
      </div>



      {/* Prediction Arena tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-extrabold text-slate-900">Prediction Arena</h2>
          </div>

          <div className="bg-slate-100 border border-slate-200 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab('open')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'open'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-sports-gray hover:text-slate-950'
              }`}
            >
              Upcoming Matches
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'results'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-sports-gray hover:text-slate-950'
              }`}
            >
              Recent Results
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
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming matches"
              description="There are no active matches scheduled. Check back later for new sporting events."
            />
          )
        ) : (
          completedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedMatches.map(match => (
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
              title="No recent results"
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
