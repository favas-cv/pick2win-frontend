import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { matchService } from '../../services/matchService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Trophy, Plus, Save, Calendar, Info } from 'lucide-react';

export const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      status: 'Active',
      sportType: 'Football'
    }
  });

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const data = await matchService.getTournaments();
      setTournaments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        logo: data.logo || '⚽',
        sportType: data.sportType,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status
      };
      
      const newTournament = await matchService.createTournament(payload);
      setTournaments(prev => [...prev, newTournament]);
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
            <Trophy className="w-6 h-6 text-sports-green" /> Tournament Governance
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Create global championship tournaments and leagues.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-sports-green hover:bg-sports-greenDark text-black text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Tournament'}
        </button>
      </div>

      {/* Creation form */}
      {showForm && (
        <div className="glass-card border-slate-800 rounded-2xl p-6 animate-fadeIn">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">
            Create Tournament
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Tournament Name</label>
              <input
                type="text"
                placeholder="e.g. FIFA World Cup 2026"
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-650 focus:border-sports-green focus:outline-none transition"
              />
              {errors.name && <span className="text-[9px] text-red-500 block mt-1">{errors.name.message}</span>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Emoji Logo (Optional)</label>
              <input
                type="text"
                placeholder="🏆, ⭐️, 🦁, etc."
                {...register('logo')}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-650 focus:border-sports-green focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Start Date</label>
              <input
                type="date"
                required
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:border-sports-green focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">End Date</label>
              <input
                type="date"
                required
                {...register('endDate', { required: 'End date is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:border-sports-green focus:outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Description</label>
              <textarea
                placeholder="Describe the tournament events..."
                {...register('description')}
                rows="3"
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-650 focus:border-sports-green focus:outline-none transition"
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
                <Save className="w-4 h-4" /> Save Tournament
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tournaments List */}
      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <div 
            key={tournament.id}
            className="glass-card border-slate-800 rounded-2xl p-5 hover:border-slate-705 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {tournament.logo}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-extrabold text-white leading-snug">{tournament.name}</h3>
                  <span className="text-[8px] font-black uppercase text-sports-green bg-sports-green/10 border border-sports-green/20 px-2 py-0.5 rounded">
                    {tournament.status}
                  </span>
                </div>
                <p className="text-xs text-sports-gray mt-1 leading-snug">{tournament.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-right shrink-0">
              <div className="px-2">
                <span className="text-[9px] text-sports-gray uppercase block font-bold">Matches</span>
                <span className="text-sm font-extrabold text-white">{tournament.matchCount} Matches</span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-[9px] text-sports-gray uppercase block font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Duration
                </span>
                <span className="text-xs text-slate-200">
                  {new Date(tournament.startDate).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tournaments;
