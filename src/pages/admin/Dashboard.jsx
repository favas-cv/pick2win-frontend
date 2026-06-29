import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import AnalyticsCard from '../../components/cards/AnalyticsCard';
import { adminService } from '../../services/adminService';
import {
  Users, Shield, Calendar, Trophy,
  Activity, Plus, CheckCircle, Flag, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [dashStats, matches] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getMatches(),
        ]);
        setStats(dashStats);
        // Show the 5 most recent matches
        setRecentMatches(matches.slice(0, 5));
      } catch (err) {
        console.error(err);
        setError('Could not load some dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const matchStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-slate-100 text-sports-gray';
      case 'Live': return 'bg-red-500/10 text-red-400';
      default: return 'bg-sports-green/10 text-sports-green';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Quick actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">System Governance</h1>
          <p className="text-xs text-sports-gray mt-1">
            Global administrative panel for multi-club prediction software.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link
            to="/admin/matches"
            className="bg-sports-green hover:bg-sports-greenDark text-white text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create Match
          </Link>
          <Link
            to="/admin/results"
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black px-4 py-2.5 border border-slate-300 rounded-xl transition flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" /> Enter Scores
          </Link>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={loading ? '…' : stats?.users ?? '—'}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Clubs"
          value={loading ? '…' : stats?.clubs ?? '—'}
          icon={Shield}
          color="green"
        />
        <StatCard
          title="Total Matches"
          value={loading ? '…' : stats?.matches ?? '—'}
          icon={Calendar}
          color="yellow"
        />
        <StatCard
          title="Teams"
          value={loading ? '…' : stats?.teams ?? '—'}
          icon={Flag}
          color="blue"
        />
        <StatCard
          title="Tournaments"
          value={loading ? '…' : stats?.tournaments ?? '—'}
          icon={Trophy}
          color="green"
        />
      </div>

      {/* Analytics charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Prediction Growth"
          metric="—"
          description="predictions made"
          type="line"
        />
        <AnalyticsCard
          title="User Growth"
          metric={loading ? '…' : `${stats?.users ?? 0}`}
          description="registered users"
          type="bar"
          data={[30, 45, 60, 50, 75, 80, 95]}
        />
        <AnalyticsCard
          title="Club Registrations"
          metric={loading ? '…' : `${stats?.clubs ?? 0}`}
          description="approved clubs"
          type="bar"
          data={[40, 20, 50, 30, 80, 60, 70]}
        />
      </div>

      {/* Recent Matches Feed */}
      <div className="glass-card border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sports-green" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Matches</h2>
          </div>
          <Link
            to="/admin/matches"
            className="text-[10px] font-bold text-sports-green hover:text-sports-greenDark uppercase tracking-wider transition"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentMatches.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {recentMatches.map((match) => (
              <div key={match.id} className="py-3.5 flex items-center justify-between gap-4 text-xs font-semibold">
                <div className="flex items-center gap-3 min-w-0 truncate">
                  {/* Tournament pill */}
                  {match.tournament && (
                    <span className="shrink-0 text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-sports-gray font-bold uppercase tracking-wider hidden sm:inline">
                      {match.tournament.name}
                    </span>
                  )}
                  <span className="text-slate-900 truncate">
                    <span className="font-extrabold text-slate-900">{match.homeTeam?.name ?? '—'}</span>
                    <span className="text-sports-gray font-normal mx-1.5">vs</span>
                    <span className="font-extrabold text-slate-900">{match.awayTeam?.name ?? '—'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {match.isFinished && match.homeScore !== null && (
                    <span className="font-black text-slate-900 text-sm">
                      {match.homeScore}–{match.awayScore}
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${matchStatusStyle(match.status)}`}
                  >
                    {match.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-sports-gray text-center py-6">
            No matches scheduled yet.{' '}
            <Link to="/admin/matches" className="text-sports-green hover:underline">
              Create one
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
