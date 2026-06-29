import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Users, Phone, Trophy, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const ClubOwners = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').includes(search)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-50 border border-slate-200 w-1/3 rounded-xl animate-pulse" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-sports-green" /> Users
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            View all platform users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-sports-green/10 border border-sports-green/20 text-sports-green">
            {activeCount} Active
          </span>
          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {inactiveCount} Inactive
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Search */}
      {users.length > 0 && (
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone number…"
            className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition"
          />
        </div>
      )}

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="glass-card border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-[10px] text-sports-gray uppercase tracking-widest font-bold">
                    <th className="py-3.5 px-5">Name</th>
                    <th className="py-3.5 px-5">Phone</th>
                    <th className="py-3.5 px-5">Points</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition">
                    {/* Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center shrink-0 text-xs font-black text-sports-green">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="font-extrabold text-sm text-sports-green block truncate">{user.name}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-5 text-sports-gray font-semibold">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.phone || '—'}
                      </span>
                    </td>

                    {/* Total Points */}
                    <td className="py-4 px-5 text-center">
                      <span className="flex items-center justify-center gap-1 font-extrabold text-slate-900">
                        <Trophy className="w-3.5 h-3.5 text-sports-yellow" />
                        {user.totalPoints ?? 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[9px] font-extrabold uppercase ${
                          user.isActive
                            ? 'text-sports-green bg-sports-green/10 border-sports-green/20'
                            : 'text-red-400 bg-red-500/10 border-red-500/20'
                        }`}
                      >
                        {user.isActive ? (
                          <><CheckCircle className="w-3 h-3" /> Active</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Inactive</>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={search ? 'No Users Match Your Search' : 'No Users Found'}
          description={
            search ? 'Try a different search term.' : 'No users have registered on the platform yet.'
          }
        />
      )}
    </div>
  );
};

export default ClubOwners;
