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
                  roundLabel={match.id === 15 ? "Final" : match.id === 16 ? "Third-Place Play-off" : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="relative w-full max-w-[360px] mx-auto bg-[#f6faf1] rounded-[2.5rem] overflow-hidden shadow-sm border border-[#e2efe1] flex flex-col items-center">
              {/* Confetti background wrapper */}
              <div className="absolute inset-0 opacity-60 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(255,255,255,0.9) 0%, transparent 70%)' }}>
                <div className="absolute top-12 left-12 w-1.5 h-3 bg-green-300 rotate-45 rounded-sm"></div>
                <div className="absolute top-24 right-16 w-2 h-2 bg-yellow-400 rotate-12 rounded-sm"></div>
                <div className="absolute top-44 left-8 w-2 h-2 bg-yellow-300 -rotate-45 rounded-sm"></div>
                <div className="absolute top-36 right-12 w-2 h-3 bg-green-400 -rotate-12 rounded-sm"></div>
                <div className="absolute top-[300px] left-6 w-1.5 h-3 bg-yellow-200 rotate-[30deg] rounded-sm"></div>
                <div className="absolute top-[400px] right-6 w-2 h-3 bg-green-300 -rotate-45 rounded-sm"></div>
              </div>

              {/* Main Card */}
              <div className="relative z-10 bg-white w-[90%] mt-6 mb-[4.5rem] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col items-center text-center font-sans">
                
                {/* Trophy Circle */}
                <div className="w-[120px] h-[120px] rounded-full bg-[#f1f8ed] flex items-center justify-center mb-6 relative">
                   <div className="absolute inset-0 rounded-full border border-white/50 shadow-[inset_0_0_15px_rgba(200,230,200,0.4)] m-2"></div>
                   <span className="text-7xl drop-shadow-xl relative z-10 -mt-2">🏆</span>
                </div>

                {/* Heading */}
                <h2 className="text-[2.25rem] font-bold text-[#1f2937] mb-6 tracking-tight">
                  Thank <span className="text-[#3b822d]">You!</span>
                </h2>

                {/* Divider 1 */}
                <div className="flex items-center w-full mb-6">
                  <div className="flex-1 h-[1px] bg-[#f1f5f0]"></div>
                  <div className="px-3 text-[#3b822d]">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                  <div className="flex-1 h-[1px] bg-[#f1f5f0]"></div>
                </div>

                {/* Subheading */}
                <h3 className="text-[17px] font-bold text-[#1f2937] leading-[1.3] mb-4 px-1">
                  Thank you for <span className="text-[#3b822d]">participating</span> in our prediction challenge.
                </h3>
                
                {/* Text 1 */}
                <p className="text-[13px] text-[#6b7280] font-medium leading-relaxed mb-6 px-1">
                  Every prediction, every point, and every match made this season more exciting.
                </p>

                {/* Divider 2 */}
                <div className="flex items-center w-full mb-6">
                  <div className="flex-1 h-[1px] bg-[#f1f5f0]"></div>
                  <div className="px-3 text-[#3b822d]">
                    <svg className="w-[18px] h-[18px] fill-none stroke-current stroke-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 12l3-2.5-1-4-4 1.5-2 3.5 2 2.5z"></path><path d="M12 12l-3 4-2-1.5 1-4 4-2.5"></path></svg>
                  </div>
                  <div className="flex-1 h-[1px] bg-[#f1f5f0]"></div>
                </div>

                {/* Journey */}
                <div className="flex items-center justify-center gap-2.5 mb-2.5 text-[#3b822d]">
                  <CalendarDays className="w-5 h-5 stroke-[2]" />
                  <span className="font-bold text-[15px]">Your journey doesn't end here.</span>
                </div>
                <p className="text-[13px] text-[#6b7280] font-medium leading-relaxed mb-6 px-2">
                  We'll be back with new tournaments, new matches, and bigger rewards.
                </p>

                {/* Divider 3 */}
                <div className="flex items-center w-full mb-6">
                  <div className="flex-1 h-[1px] bg-[#f1f5f0]"></div>
                  <div className="px-3 text-[#3b822d]">
                    <svg className="w-[15px] h-[15px] fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <div className="flex-1 h-[1px] bg-[#f1f5f0]"></div>
                </div>

                {/* Bottom Box */}
                <div className="w-full bg-[#f7fcf4] rounded-[1.25rem] py-5 px-4 flex flex-col items-center">
                  <div className="w-[42px] h-[42px] rounded-full border-[1.5px] border-[#d8ecd6] bg-white text-[#3b822d] flex items-center justify-center mb-3">
                    <svg className="w-[22px] h-[22px] fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <p className="text-[#1f2937] font-bold text-[15px] mb-1.5">See you in the next competition!</p>
                  <p className="text-[13px] font-medium text-[#6b7280] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 fill-[#3b822d]" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    Team <span className="font-bold text-[#3b822d]">Pick2Win</span>
                  </p>
                </div>
              </div>

              {/* Bottom Soccer Ball */}
              <div className="absolute bottom-[-15px] z-20 pointer-events-none flex flex-col items-center">
                <span className="text-[5rem] drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)] leading-none">⚽</span>
                <div className="w-16 h-3 bg-green-900/10 rounded-[100%] blur-[4px] -mt-1"></div>
              </div>
            </div>
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
