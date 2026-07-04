import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Plus, Save, Lock, Clock, AlertCircle, Pencil, Trash2 } from 'lucide-react';

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

export const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingMatch, setEditingMatch] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const toDateTimeLocalValue = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [matchesList, tournamentsList, teamsList] = await Promise.all([
        adminService.getMatches(),
        adminService.getTournaments(),
        adminService.getTeams(),
      ]);
      setMatches(matchesList);
      setTournaments(tournamentsList);
      setTeams(teamsList);
    } catch (err) {
      console.error(err);
      setError('Failed to load match data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchData, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        tournamentId: parseInt(data.tournamentId),
        homeTeamId: parseInt(data.homeTeamId),
        awayTeamId: parseInt(data.awayTeamId),
        kickoff: new Date(data.kickoff).toISOString(),
        predictionLockTime: data.predictionLockTime
          ? new Date(data.predictionLockTime).toISOString()
          : new Date(data.kickoff).toISOString(),
      };
      if (editingMatch) {
        const updatedMatch = await adminService.updateMatch(editingMatch.id, payload);
        setMatches((prev) => prev.map((match) => (match.id === updatedMatch.id ? updatedMatch : match)));
      } else {
        const newMatch = await adminService.createMatch(payload);
        setMatches((prev) => [newMatch, ...prev]);
      }
      setShowForm(false);
      setEditingMatch(null);
      reset();
    } catch (err) {
      console.error(err);
      setError(
        editingMatch
          ? 'Failed to update match. Please check your inputs.'
          : 'Failed to schedule match. Please check your inputs.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startCreate = () => {
    setEditingMatch(null);
    setShowForm((prev) => !prev);
    setError('');
    reset();
  };

  const startEdit = (match) => {
    setEditingMatch(match);
    setShowForm(true);
    setError('');
    reset({
      tournamentId: match.tournament?.id ?? '',
      homeTeamId: match.homeTeam?.id ?? '',
      awayTeamId: match.awayTeam?.id ?? '',
      kickoff: toDateTimeLocalValue(match.kickoff),
      predictionLockTime: toDateTimeLocalValue(match.predictionLockTime),
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMatch(null);
    reset();
  };

  const handleDelete = async (match) => {
    const label = `${match.homeTeam?.name ?? 'Home team'} vs ${match.awayTeam?.name ?? 'Away team'}`;
    if (!window.confirm(`Delete ${label}?`)) return;
    setError('');
    try {
      await adminService.deleteMatch(match.id);
      setMatches((prev) => prev.filter((item) => item.id !== match.id));
      if (editingMatch?.id === match.id) {
        closeForm();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete match.');
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
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sports-green" /> Match Governance
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Schedule new matches and manage fixture listings.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="bg-sports-green hover:bg-sports-greenDark text-white text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Schedule Match'}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Creation Form */}
      {showForm && (
        <div className="glass-card border-slate-200 rounded-2xl p-6 animate-fadeIn">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
            {editingMatch ? 'Edit Matchup' : 'Schedule New Matchup'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tournament */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Tournament *
              </label>
              <select
                {...register('tournamentId', { required: 'Tournament is required' })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:border-sports-green focus:outline-none transition"
              >
                <option value="" className="bg-slate-50">— Select Tournament —</option>
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-50">
                    {t.name}
                  </option>
                ))}
              </select>
              {errors.tournamentId && (
                <span className="text-[9px] text-red-400 block mt-1">{errors.tournamentId.message}</span>
              )}
            </div>

            {/* Kickoff */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Kickoff Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('kickoff', { required: 'Kickoff time is required' })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 focus:border-sports-green focus:outline-none transition"
              />
              {errors.kickoff && (
                <span className="text-[9px] text-red-400 block mt-1">{errors.kickoff.message}</span>
              )}
            </div>

            {/* Home Team */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Home Team *
              </label>
              <select
                {...register('homeTeamId', { required: 'Home team is required' })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:border-sports-green focus:outline-none transition"
              >
                <option value="" className="bg-slate-50">— Select Home Team —</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-50">
                    {t.name} {t.countryCode ? `(${t.countryCode})` : ''}
                  </option>
                ))}
              </select>
              {errors.homeTeamId && (
                <span className="text-[9px] text-red-400 block mt-1">{errors.homeTeamId.message}</span>
              )}
            </div>

            {/* Away Team */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Away Team *
              </label>
              <select
                {...register('awayTeamId', { required: 'Away team is required' })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:border-sports-green focus:outline-none transition"
              >
                <option value="" className="bg-slate-50">— Select Away Team —</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-50">
                    {t.name} {t.countryCode ? `(${t.countryCode})` : ''}
                  </option>
                ))}
              </select>
              {errors.awayTeamId && (
                <span className="text-[9px] text-red-400 block mt-1">{errors.awayTeamId.message}</span>
              )}
            </div>

            {/* Prediction Lock Time */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Prediction Lock Time{' '}
                <span className="normal-case text-slate-500 font-normal">(defaults to kickoff time)</span>
              </label>
              <input
                type="datetime-local"
                {...register('predictionLockTime')}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 focus:border-sports-green focus:outline-none transition"
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-sports-green hover:bg-sports-greenDark disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-lg shadow-sports-green/10 active:scale-95"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Saving…' : editingMatch ? 'Update Match' : 'Save Match'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Matches List */}
      {matches.length > 0 ? (
        <div className="space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="glass-card border-slate-200 rounded-2xl p-5 hover:border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition duration-200"
            >
              {/* Left: tournament + teams */}
              <div className="flex-1 min-w-0">
                {match.tournament && (
                  <span className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-sports-gray font-bold uppercase tracking-wider">
                    {match.tournament.name}
                  </span>
                )}
                <div className="flex items-center gap-2 mt-2 font-extrabold text-sm text-slate-900">
                  <span>{match.homeTeam?.name ?? '—'}</span>
                  <span className="text-sports-gray font-normal text-xs">vs</span>
                  <span>{match.awayTeam?.name ?? '—'}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-sports-gray font-semibold">
                    <Clock className="w-3 h-3" />
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
                  {match.predictionLockTime && (
                    <span className="flex items-center gap-1 text-[10px] text-sports-gray font-semibold">
                      <Lock className="w-3 h-3" />
                      Lock:{' '}
                      {new Date(match.predictionLockTime).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: score + status + actions */}
              <div className="flex items-center gap-3 shrink-0">
                {match.isFinished && match.homeScore !== null && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center">
                    <span className="text-base font-black text-slate-900">
                      {match.homeScore} – {match.awayScore}
                    </span>
                    <span className="text-[9px] text-sports-gray block mt-0.5 font-bold uppercase">Final</span>
                  </div>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-extrabold uppercase ${statusStyle(match.status)}`}
                >
                  {match.status}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(match)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition active:scale-95"
                    title="Edit Match"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(match)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition active:scale-95"
                    title="Delete Match"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No Matches Scheduled"
          description="No matches have been created yet. Schedule the first fixture!"
        />
      )}
    </div>
  );
};

export default Matches;
