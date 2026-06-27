import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Shield, MapPin, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const fetchClubs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getClubs();
      setClubs(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load clubs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleToggleStatus = async (club) => {
    setTogglingId(club.id);
    try {
      const updated = await adminService.toggleClubStatus(club.id, !club.isActive);
      setClubs((prev) => prev.map((c) => (c.id === club.id ? { ...c, isActive: updated.isActive } : c)));
    } catch (err) {
      console.error(err);
      setError('Failed to update club status.');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-900 border border-slate-800 w-1/3 rounded-xl animate-pulse" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const activeClubs = clubs.filter((c) => c.isActive);
  const inactiveClubs = clubs.filter((c) => !c.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-850 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-sports-green" /> Registered Clubs
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Browse and manage all fan clubs registered across the platform.
          </p>
        </div>
        {/* Quick summary pills */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-sports-green/10 border border-sports-green/20 text-sports-green">
            {activeClubs.length} Active
          </span>
          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {inactiveClubs.length} Inactive
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Clubs table */}
      {clubs.length > 0 ? (
        <div className="glass-card border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] text-sports-gray uppercase tracking-widest font-bold">
                  <th className="py-3.5 px-5">Club Name</th>
                  <th className="py-3.5 px-5">Location</th>
                  <th className="py-3.5 px-5">Points</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {clubs.map((club) => (
                  <tr key={club.id} className="hover:bg-slate-900/30 transition">
                    {/* Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-center shrink-0">
                          <Shield className="w-4 h-4 text-sports-green" />
                        </div>
                        <span className="font-extrabold text-sm text-white">{club.name}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-5 text-sports-gray font-semibold">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {club.place || '—'}
                      </span>
                    </td>
                    {/* Points */}
                    <td className="py-4 px-5 text-center">
                      <span className="font-extrabold text-white">{club.totalPoints ?? 0}</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-extrabold uppercase ${
                          club.isActive
                            ? 'text-sports-green bg-sports-green/10 border-sports-green/20'
                            : 'text-red-400 bg-red-500/10 border-red-500/20'
                        }`}
                      >
                        {club.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Toggle Action */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleToggleStatus(club)}
                        disabled={togglingId === club.id}
                        className={`text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-xl border transition active:scale-95 disabled:opacity-60 flex items-center gap-1.5 ml-auto ${
                          club.isActive
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                            : 'bg-sports-green/10 hover:bg-sports-green/20 text-sports-green border-sports-green/20'
                        }`}
                      >
                        {club.isActive ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            {togglingId === club.id ? 'Updating…' : 'Deactivate'}
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            {togglingId === club.id ? 'Updating…' : 'Activate'}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Shield}
          title="No Clubs Registered"
          description="No fan clubs have been created on the platform yet."
        />
      )}
    </div>
  );
};

export default Clubs;
