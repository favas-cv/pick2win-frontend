import React, { useState, useEffect } from 'react';
import { matchService } from '../../services/matchService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { CheckSquare, Save } from 'lucide-react';

export const Results = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({}); // { [matchId]: { scoreA: '', scoreB: '' } }

  const fetchActiveMatches = async () => {
    setLoading(true);
    try {
      const data = await matchService.getMatches();
      // Show matches that are Upcoming or Live, or even Completed so they can edit
      setMatches(data);
      
      // Initialize scores state
      const initialScores = {};
      data.forEach(m => {
        initialScores[m.id] = {
          scoreA: m.scoreA ?? '',
          scoreB: m.scoreB ?? ''
        };
      });
      setScores(initialScores);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveMatches();
  }, []);

  const handleScoreChange = (matchId, team, val) => {
    setScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: val
      }
    }));
  };

  const handleVerifyScore = async (matchId) => {
    const matchScore = scores[matchId];
    if (matchScore.scoreA === '' || matchScore.scoreB === '') {
      alert('Please fill out both scores.');
      return;
    }

    try {
      await matchService.enterMatchResult(matchId, matchScore.scoreA, matchScore.scoreB);
      // Refresh list to see updated status
      setMatches(prev => prev.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            scoreA: parseInt(matchScore.scoreA),
            scoreB: parseInt(matchScore.scoreB),
            status: 'Completed'
          };
        }
        return m;
      }));
      alert('Match result locked. Points recalculation updated!');
    } catch (err) {
      console.error(err);
    }
  };

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
          <CheckSquare className="w-6 h-6 text-sports-green" /> Result Entry
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Lock official final scores. This recycles and awards prediction points.
        </p>
      </div>

      {/* Matches score entry grid */}
      {matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map((match) => {
            const matchScore = scores[match.id] || { scoreA: '', scoreB: '' };
            
            return (
              <div 
                key={match.id}
                className="glass-card border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-6"
              >
                {/* Match context */}
                <div className="text-center md:text-left flex-1 min-w-0">
                  <span className="text-[9px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-sports-gray font-bold uppercase tracking-wider">
                    {match.tournamentName}
                  </span>
                  <div className="text-sm font-extrabold text-white mt-1.5 flex items-center justify-center md:justify-start gap-1">
                    <span>{match.teamA.name}</span>
                    <span className="text-sports-gray font-normal text-xs">vs</span>
                    <span>{match.teamB.name}</span>
                  </div>
                  <span className="text-[10px] text-sports-gray mt-1 block">
                    Venue: {match.venue} | Kickoff: {new Date(match.kickoffTime).toLocaleDateString()}
                  </span>
                </div>

                {/* Score entry inputs */}
                <div className="flex items-center gap-4 bg-slate-900/60 p-4 border border-slate-850 rounded-xl">
                  {/* Team A score */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-sports-gray uppercase font-bold tracking-wider truncate max-w-[80px]">{match.teamA.name}</span>
                    <input
                      type="number"
                      min="0"
                      value={matchScore.scoreA}
                      onChange={(e) => handleScoreChange(match.id, 'scoreA', e.target.value)}
                      placeholder="0"
                      className="w-12 h-10 text-center text-sm font-extrabold bg-slate-800 border border-slate-700 rounded-xl focus:border-sports-green focus:outline-none text-white"
                    />
                  </div>

                  <span className="font-extrabold text-sports-gray text-base">:</span>

                  {/* Team B score */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-sports-gray uppercase font-bold tracking-wider truncate max-w-[80px]">{match.teamB.name}</span>
                    <input
                      type="number"
                      min="0"
                      value={matchScore.scoreB}
                      onChange={(e) => handleScoreChange(match.id, 'scoreB', e.target.value)}
                      placeholder="0"
                      className="w-12 h-10 text-center text-sm font-extrabold bg-slate-800 border border-slate-700 rounded-xl focus:border-sports-green focus:outline-none text-white"
                    />
                  </div>
                </div>

                {/* Verify Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-extrabold uppercase ${
                    match.status === 'Completed' ? 'text-sports-gray bg-slate-900 border-slate-800' :
                    match.status === 'Live' ? 'text-red-500 bg-red-500/10 border-red-500/20' :
                    'text-sports-green bg-sports-green/10 border-sports-green/20'
                  }`}>
                    {match.status}
                  </span>
                  
                  <button
                    onClick={() => handleVerifyScore(match.id)}
                    className="bg-sports-green hover:bg-sports-greenDark text-black text-xs font-black px-4.5 py-2.5 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-sports-green/5"
                  >
                    <Save className="w-4 h-4" /> Verify Result
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No Matchups active"
          description="There are no matches scheduled inside the database to enter results."
        />
      )}
    </div>
  );
};

export default Results;
