import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { clubService } from '../../services/clubService';
import StatCard from '../../components/common/StatCard';
import InviteLinkCard from '../../components/club/InviteLinkCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { 
  Users, Trophy, FileSpreadsheet, Medal, Link2, 
  UserCheck, ShieldAlert, UserX, UserPlus 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { activeClub, memberships } = useClub();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!activeClub) return;
      setLoading(true);
      try {
        const data = await clubService.getClubOwnerDashboard(activeClub.id);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [activeClub]);

  // Compute members stats dynamically from memberships context
  const clubMemberships = memberships.filter(m => m.clubId === activeClub?.id);
  const approvedCount = clubMemberships.filter(m => m.status === 'Approved').length;
  const pendingCount = clubMemberships.filter(m => m.status === 'Pending').length;
  const suspendedOrRejectedCount = clubMemberships.filter(m => m.status === 'Suspended' || m.status === 'Rejected').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 border border-slate-200 w-1/3 rounded-xl animate-pulse"></div>
        <LoadingSkeleton type="stat" count={4} />
        <div className="h-48 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900">
          Welcome, Club Owner
        </h1>
        <p className="text-xs text-sports-gray mt-1 font-semibold">
          Managing listings, member approvals and configuration profiles for <span className="font-bold text-blue-600">{activeClub?.name}</span>.
        </p>
      </div>

      {/* Roster stats row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Approved Members" value={approvedCount} icon={UserCheck} color="green" />
          <StatCard title="Pending Requests" value={pendingCount} icon={UserPlus} color="yellow" />
          <StatCard title="Suspended / Rejected" value={suspendedOrRejectedCount} icon={UserX} color="red" />
          <StatCard title="Active Tournaments" value={stats.activeTournaments} icon={Trophy} color="blue" />
        </div>
      )}

      {/* Pending requests highlight */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 border border-amber-200 rounded-xl flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">Pending Membership Requests</h4>
              <p className="text-xs text-slate-500">You have {pendingCount} user(s) requesting approval to join your club.</p>
            </div>
          </div>
          <Link
            to="/owner/members"
            className="bg-amber-500 hover:bg-amber-650 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-sm active:scale-95 shrink-0"
          >
            Review Requests
          </Link>
        </div>
      )}

      {/* Invite links */}
      {stats && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-sports-gray uppercase tracking-wider pl-1">Join Invitations</h3>
          <InviteLinkCard inviteCode={stats.inviteCode} regToken={stats.registrationToken} />
        </div>
      )}

      {/* Directory tabs shortcuts */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-sports-gray uppercase tracking-wider pl-1">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/owner/members"
            className="glass-card border-slate-200 hover:border-slate-300 p-5 rounded-2xl flex items-center gap-3 transition"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Members Approval</span>
              <span className="text-[10px] text-sports-gray">Review and verify applications</span>
            </div>
          </Link>

          <Link
            to="/owner/tournaments"
            className="glass-card border-slate-200 hover:border-slate-300 p-5 rounded-2xl flex items-center gap-3 transition"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Manage Tournaments</span>
              <span className="text-[10px] text-sports-gray">Toggle active prediction events</span>
            </div>
          </Link>

          <Link
            to="/owner/leaderboard"
            className="glass-card border-slate-200 hover:border-slate-300 p-5 rounded-2xl flex items-center gap-3 transition"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Medal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Leaderboard Board</span>
              <span className="text-[10px] text-sports-gray">Review ranking accuracy tables</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
