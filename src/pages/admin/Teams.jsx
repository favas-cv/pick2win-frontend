import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Flag, Plus, Save, Globe, Shield, Trash2, AlertCircle } from 'lucide-react';

export const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchTeams = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getTeams();
      setTeams(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load teams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const newTeam = await adminService.createTeam({
        name: data.name,
        logo: data.logo || null,
        countryCode: data.countryCode,
      });
      setTeams((prev) => [...prev, newTeam]);
      setShowForm(false);
      reset();
    } catch (err) {
      console.error(err);
      setError('Failed to create team. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    try {
      await adminService.deleteTeam(id);
      setTeams((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.countryCode || '').toLowerCase().includes(search.toLowerCase())
  );

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
            <Flag className="w-6 h-6 text-sports-green" /> Team Governance
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Manage all registered teams available for match fixtures.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); }}
          className="bg-sports-green hover:bg-sports-greenDark text-white text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Team'}
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
            Register New Team
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team Name */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Team Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Brazil"
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition"
              />
              {errors.name && (
                <span className="text-[9px] text-red-400 block mt-1">{errors.name.message}</span>
              )}
            </div>

            {/* Country Code */}
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Country Code
              </label>
              <input
                type="text"
                placeholder="e.g. BR, ES, EN"
                {...register('countryCode')}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition"
              />
            </div>

            {/* Logo URL */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">
                Logo URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://example.com/logo.png (leave blank for auto-generated)"
                {...register('logo')}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition"
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
                {submitting ? 'Saving…' : 'Save Team'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {teams.length > 0 && (
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by team name or country code…"
            className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition"
          />
        </div>
      )}

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="glass-card border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition duration-300 flex flex-col items-center text-center group relative"
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(team.id)}
                className="absolute top-2 right-2 p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition"
                title="Delete Team"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              <img
                src={team.logo}
                alt={team.name}
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(team.name)}`;
                }}
                className="w-14 h-14 object-contain bg-white p-2 rounded-2xl border border-slate-200 shadow-inner"
              />

              <div className="mt-3">
                <span className="text-xs font-extrabold text-slate-900 block">{team.name}</span>
                {team.countryCode && (
                  <span className="text-[9px] text-sports-gray font-bold tracking-widest uppercase block mt-0.5">
                    {team.countryCode}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Flag}
          title={search ? 'No Teams Match Your Search' : 'No Teams Registered'}
          description={
            search
              ? 'Try a different search term.'
              : 'Register teams so they can be assigned to match fixtures.'
          }
        />
      )}
    </div>
  );
};

export default Teams;
