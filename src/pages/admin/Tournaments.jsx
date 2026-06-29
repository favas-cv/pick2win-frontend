import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Trophy, Plus, Save, Calendar, Trash2, AlertCircle } from 'lucide-react';

const STATUS_OPTIONS = ['Upcoming', 'Active', 'Completed'];

const statusStyle = (status) => {
  switch (status) {
    case 'Active':
      return 'text-sports-green bg-sports-green/10 border-sports-green/20';
    case 'Completed':
      return 'text-sports-gray bg-slate-50 border-slate-200';
    default: // Upcoming
      return 'text-sports-yellow bg-sports-yellow/10 border-sports-yellow/20';
  }
};

export const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { status: 'Upcoming' } });

  const fetchTournaments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getTournaments();
      setTournaments(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tournaments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const newT = await adminService.createTournament({
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      });
      setTournaments((prev) => [newT, ...prev]);
      setShowForm(false);
      reset();
    } catch (err) {
      console.error(err);
      setError('Failed to create tournament. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tournament?')) return;
    try {
      await adminService.deleteTournament(id);
      setTournaments((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
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
            <Trophy className="w-6 h-6 text-sports-green" /> Tournament Governance
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Create and manage global championship tournaments and leagues.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); }}
          className="bg-sports-green hover:bg-sports-greenDark text-white text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Tournament'}
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
            Create Tournament
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Tournament Name *
              </label>
              <input
                type="text"
                placeholder="e.g. FIFA World Cup 2026"
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition"
              />
              {errors.name && (
                <span className="text-[9px] text-red-400 block mt-1">{errors.name.message}</span>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:border-sports-green focus:outline-none transition"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-slate-50">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Start Date *
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 focus:border-sports-green focus:outline-none transition"
              />
              {errors.startDate && (
                <span className="text-[9px] text-red-400 block mt-1">{errors.startDate.message}</span>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                End Date *
              </label>
              <input
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 focus:border-sports-green focus:outline-none transition"
              />
              {errors.endDate && (
                <span className="text-[9px] text-red-400 block mt-1">{errors.endDate.message}</span>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Description
              </label>
              <textarea
                placeholder="Describe the tournament..."
                {...register('description')}
                rows="3"
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition resize-none"
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
                {submitting ? 'Saving…' : 'Save Tournament'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tournament List */}
      {tournaments.length > 0 ? (
        <div className="space-y-3">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="glass-card border-slate-200 rounded-2xl p-5 hover:border-slate-300 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition duration-200"
            >
              {/* Left: icon + info */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-sports-green" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{t.name}</h3>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${statusStyle(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                  {t.description && (
                    <p className="text-xs text-sports-gray mt-0.5 leading-snug line-clamp-1">{t.description}</p>
                  )}
                </div>
              </div>

              {/* Right: dates + actions */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[9px] text-sports-gray uppercase font-bold flex items-center justify-end gap-1">
                    <Calendar className="w-3 h-3" /> Duration
                  </span>
                  <span className="text-xs text-slate-900 font-semibold">
                    {t.startDate ? new Date(t.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    {' → '}
                    {t.endDate ? new Date(t.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition active:scale-95"
                  title="Delete Tournament"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No Tournaments Yet"
          description="No tournaments have been created. Add one to get started!"
        />
      )}
    </div>
  );
};

export default Tournaments;
