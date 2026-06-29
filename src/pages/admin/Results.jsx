import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { CheckSquare, Save, AlertCircle, CheckCircle } from 'lucide-react';

const statusStyle = (status) => {
  switch (status) {
    case 'Completed':
      return 'text-sports-gray bg-slate-50 border-slate-200';
    case 'Live':
      return 'text-red-400 bg-red-500/10 border-red-500/20';
    default:
      return 'text-sports-green bg-sports-green/10 border-sports-green/20';
  }
};

export const Results = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getMatches();
      setMatches(data);
      // Initialise scores state from existing DB values
      const initial = {};
      data.forEach((m) => {
        initial[m.id] = {
          homeScore: m.homeScore ?? '',
          awayScore: m.awayScore ?? '',
        };
      });
      setScores(initial);
    } catch (err) {
      console.error(err);
      setError('Failed to load matches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleScoreChange = (matchId, field, val) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: val,
      },
    }));
  };

  const handleVerify = async (matchId) => {
    const s = scores[matchId];
    if (s.homeScore === '' || s.awayScore === '') {
      setError('Please fill out both scores before verifying.');
      return;
    }
    setSaving((prev) => ({ ...prev, [matchId]: true }));
    setError('');
    try {
      await adminService.updateMatchScore(matchId, s.homeScore, s.awayScore);
      // Update local state
      setMatches((prev) =>
        prev.map((m) => {
          if (m.id === matchId) {
            return {
              ...m,
              homeScore: parseInt(s.homeScore),
              awayScore: parseInt(s.awayScore),
              isFinished: true,
              status: 'Completed',
            };
          }
          return m;
        })
      );
      setToast(`Result saved! Points have been recalculated.`);
      setTimeout(() => setToast(''), 3500);
    } catch (err) {
      console.error(err);
      setError('Failed to save result. Please try again.');
    } finally {
      setSaving((prev) => ({ ...prev, [matchId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-50 border border-slate-200 w-1/3 rounded-xl animate-pulse" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-sports-green" /> Result Entry
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Lock official final scores. This triggers automatic point recalculation for all predictions.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Success Toast */}
      {toast && (
        <div className="flex items-center gap-2 bg-sports-green/10 border border-sports-green/20 rounded-xl px-4 py-3 text-xs text-sports-green font-semibold animate-fadeIn">
          <CheckCircle className="w-4 h-4 shrink-0" /> {toast}
        </div>
      )}

      {/* Match score entry */}
      {matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map((match) => {
            const s = scores[match.id] || { homeScore: '', awayScore: '' };
            const isSaving = saving[match.id] || false;

            return (
              <div
                key={match.id}
                className="glass-card border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-6"
              >
                {/* Match context */}
                <div className="text-center md:text-left flex-1 min-w-0">
                  {match.tournament && (
                    <span className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-sports-gray font-bold uppercase tracking-wider">
                      {match.tournament.name}
                    </span>
                  )}
                  <div className="text-sm font-extrabold text-slate-900 mt-1.5 flex items-center justify-center md:justify-start gap-2">
                    <span>{match.homeTeam?.name ?? '—'}</span>
                    <span className="text-sports-gray font-normal text-xs">vs</span>
                    <span>{match.awayTeam?.name ?? '—'}</span>
                  </div>
                  <span className="text-[10px] text-sports-gray mt-1 block">
                    Kickoff:{' '}
                    {match.kickoff
                      ? new Date(match.kickoff).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </span>
                </div>

                {/* Score inputs */}
                <div className="flex items-center gap-4 bg-white p-4 border border-slate-200 rounded-xl">
                  {/* Home team */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-sports-gray uppercase font-bold tracking-wider truncate max-w-[72px]">
                      {match.homeTeam?.name ?? 'Home'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={s.homeScore}
                      onChange={(e) => handleScoreChange(match.id, 'homeScore', e.target.value)}
                      placeholder="0"
                      disabled={match.isFinished}
                      className="w-12 h-10 text-center text-sm font-extrabold bg-slate-100 border border-slate-300 rounded-xl focus:border-sports-green focus:outline-none text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <span className="font-extrabold text-sports-gray text-base">:</span>

                  {/* Away team */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-sports-gray uppercase font-bold tracking-wider truncate max-w-[72px]">
                      {match.awayTeam?.name ?? 'Away'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={s.awayScore}
                      onChange={(e) => handleScoreChange(match.id, 'awayScore', e.target.value)}
                      placeholder="0"
                      disabled={match.isFinished}
                      className="w-12 h-10 text-center text-sm font-extrabold bg-slate-100 border border-slate-300 rounded-xl focus:border-sports-green focus:outline-none text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Status + action */}
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-extrabold uppercase ${statusStyle(match.status)}`}
                  >
                    {match.status}
                  </span>

                  {!match.isFinished && (
                    <button
                      onClick={() => handleVerify(match.id)}
                      disabled={isSaving}
                      className="bg-sports-green hover:bg-sports-greenDark disabled:opacity-60 text-white text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-sports-green/5"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving…' : 'Verify Result'}
                    </button>
                  )}

                  {match.isFinished && (
                    <span className="flex items-center gap-1 text-[10px] text-sports-gray font-bold">
                      <CheckCircle className="w-3.5 h-3.5 text-sports-green" /> Verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No Matches Found"
          description="No matches have been scheduled yet. Create fixtures in the Match Governance page first."
        />
      )}
    </div>
  );
};

export default Results;
