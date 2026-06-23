import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { matchService } from '../../services/matchService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Plus, Save, MapPin } from 'lucide-react';

export const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchesList, tournamentsList, teamsList] = await Promise.all([
        matchService.getMatches(),
        matchService.getTournaments(),
        matchService.getTeams()
      ]);
      setMatches(matchesList);
      setTournaments(tournamentsList);
      setTeams(teamsList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        tournamentId: data.tournamentId,
        teamAId: data.teamAId,
        teamBId: data.teamBId,
        kickoffTime: new Date(data.kickoffTime).toISOString(),
        venue: data.venue
      };
      
      const newMatch = await matchService.createMatch(payload);
      setMatches(prev => [newMatch, ...prev]);
      setShowForm(false);
      reset();
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
      <div className="border-b border-slate-850 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sports-green" /> Match Governance
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Schedule new matches, verify kickoff venues, and manage lineups.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-sports-green hover:bg-sports-greenDark text-black text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Schedule Match'}
        </button>
      </div>

      {/* Creation form */}
      {showForm && (
        <div className="glass-card border-slate-800 rounded-2xl p-6 animate-fadeIn">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">
            Schedule New Matchup
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Select Tournament</label>
              <select
                {...register('tournamentId', { required: 'Tournament is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:border-sports-green focus:outline-none transition"
              >
                {tournaments.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.logo} {t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Venue</label>
              <input
                type="text"
                placeholder="e.g. Maracanã Stadium"
                {...register('venue', { required: 'Venue is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-650 focus:border-sports-green focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Team A (Home)</label>
              <select
                {...register('teamAId', { required: 'Team A is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:border-sports-green focus:outline-none transition"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Team B (Away)</label>
              <select
                {...register('teamBId', { required: 'Team B is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:border-sports-green focus:outline-none transition"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Kickoff Date & Time</label>
              <input
                type="datetime-local"
                required
                {...register('kickoffTime', { required: 'Kickoff time is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:border-sports-green focus:outline-none transition"
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-850 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-sports-green hover:bg-sports-greenDark text-black text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-lg shadow-sports-green/10 active:scale-95"
              >
                <Save className="w-4 h-4" /> Save Matchup
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Matches listing */}
      <div className="space-y-4">
        {matches.map((match) => (
          <div 
            key={match.id}
            className="glass-card border-slate-800 rounded-2xl p-5 hover:border-slate-705 flex items-center justify-between gap-6"
          >
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-sports-gray font-bold uppercase tracking-wider">
                  {match.tournamentName}
                </span>
                <div className="flex items-center gap-2 mt-2 font-extrabold text-sm text-white">
                  <span>{match.teamA.name}</span>
                  <span className="text-sports-gray font-normal text-xs">vs</span>
                  <span>{match.teamB.name}</span>
                </div>
              </div>
              
              <div className="text-left sm:text-right font-semibold text-xs text-sports-gray">
                <span className="flex items-center sm:justify-end gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sports-green" /> {match.venue}
                </span>
                <span className="block mt-1 font-bold text-[10px] text-slate-350">
                  Kickoff: {new Date(match.kickoffTime).toLocaleString()}
                </span>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-extrabold uppercase shrink-0 ${
              match.status === 'Completed' ? 'text-sports-gray bg-slate-900 border-slate-800' :
              match.status === 'Live' ? 'text-red-500 bg-red-500/10 border-red-500/20' :
              'text-sports-green bg-sports-green/10 border-sports-green/20'
            }`}>
              {match.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
