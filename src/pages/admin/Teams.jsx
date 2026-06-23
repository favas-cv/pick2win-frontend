import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { matchService } from '../../services/matchService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Flag, Plus, Save, Info, Globe, Shield } from 'lucide-react';

export const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'global' | 'local'

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      isGlobal: 'true',
      status: 'Active',
      sportType: 'Football'
    }
  });

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await matchService.getTeams();
      setTeams(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        logo: data.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${data.name}`,
        sportType: data.sportType,
        isGlobal: data.isGlobal === 'true',
        status: data.status
      };
      
      const newTeam = await matchService.createTeam(payload);
      setTeams(prev => [...prev, newTeam]);
      setShowForm(false);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTeams = teams.filter(team => {
    if (filterType === 'global') return team.isGlobal;
    if (filterType === 'local') return !team.isGlobal;
    return true;
  });

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
            <Flag className="w-6 h-6 text-sports-green" /> Team Governance
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Create global national teams or local club squads.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-sports-green hover:bg-sports-greenDark text-black text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Team'}
        </button>
      </div>

      {/* Creation Form popup */}
      {showForm && (
        <div className="glass-card border-slate-800 rounded-2xl p-6 animate-fadeIn">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">
            Create New Team
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Team Name</label>
              <input
                type="text"
                placeholder="e.g. Portugal"
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-650 focus:border-sports-green focus:outline-none transition"
              />
              {errors.name && <span className="text-[9px] text-red-500 block mt-1">{errors.name.message}</span>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Logo URL (Optional)</label>
              <input
                type="text"
                placeholder="https://..."
                {...register('logo')}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-650 focus:border-sports-green focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Scope</label>
              <select
                {...register('isGlobal')}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:border-sports-green focus:outline-none transition"
              >
                <option value="true">Global Team (e.g. National Squads)</option>
                <option value="false">Local Team (e.g. Club Squads)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1">Sport Type</label>
              <select
                {...register('sportType')}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:border-sports-green focus:outline-none transition"
              >
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Cricket">Cricket</option>
              </select>
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
                <Save className="w-4 h-4" /> Save Team
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-850 pb-2">
        {['all', 'global', 'local'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-lg border uppercase tracking-wider transition ${
              filterType === type 
                ? 'bg-sports-green text-black border-sports-green' 
                : 'bg-slate-900 text-sports-gray border-slate-800 hover:text-white'
            }`}
          >
            {type} Teams
          </button>
        ))}
      </div>

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {filteredTeams.map((team) => (
            <div 
              key={team.id}
              className="glass-card border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition duration-300 flex flex-col items-center justify-between text-center relative group"
            >
              <span className={`absolute top-3 left-3 text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                team.isGlobal 
                  ? 'text-sports-green bg-sports-green/10 border-sports-green/20' 
                  : 'text-sports-blue bg-sports-blue/10 border-sports-blue/20'
              }`}>
                {team.isGlobal ? 'Global' : 'Local'}
              </span>
              <img 
                src={team.logo} 
                alt={team.name} 
                className="w-16 h-16 object-contain bg-slate-900/60 p-2 rounded-2xl border border-slate-850 mt-4 shadow-inner"
              />
              <div className="mt-4">
                <span className="text-sm font-extrabold text-white block">{team.name}</span>
                <span className="text-[9px] text-sports-gray font-bold tracking-widest uppercase block mt-0.5">{team.sportType}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Flag}
          title="No Teams Listed"
          description="There are no teams listed under this category filter. Create a squad to populate matchups!"
        />
      )}
    </div>
  );
};

export default Teams;
