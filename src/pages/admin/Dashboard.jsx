import React from 'react';
import StatCard from '../../components/common/StatCard';
import AnalyticsCard from '../../components/cards/AnalyticsCard';
import { 
  Users, Shield, Calendar, FileText, Trophy, 
  Activity, ArrowUpRight, Plus, CheckCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  // Mock activity logs
  const activities = [
    { id: 1, type: 'registration', desc: 'New club owner Carlos Silva registered Brazil Fans Club', time: '10 mins ago' },
    { id: 2, type: 'prediction', desc: 'John Doe predicted score 2-1 for Brazil vs Argentina', time: '25 mins ago' },
    { id: 3, type: 'tournament', desc: 'Admin created FIFA World Cup 2026 tournament', time: '2 hours ago' },
    { id: 4, type: 'result', desc: 'Result verified: Old Trafford (Man Utd 1 - 3 Real Madrid)', time: '1 day ago' },
    { id: 5, type: 'club', desc: 'Madridistas Hub approved by system governance', time: '2 days ago' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Quick actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">System Governance</h1>
          <p className="text-xs text-sports-gray mt-1">
            Global administrative panel for multi-club prediction software.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link
            to="/admin/matches"
            className="bg-sports-green hover:bg-sports-greenDark text-black text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create Match
          </Link>
          <Link
            to="/admin/results"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-black px-4 py-2.5 border border-slate-700 rounded-xl transition flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" /> Enter Scores
          </Link>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Users" value="1,842" icon={Users} color="blue" />
        <StatCard title="Total Clubs" value="38" icon={Shield} color="green" />
        <StatCard title="Total Matches" value="156" icon={Calendar} color="yellow" />
        <StatCard title="Predictions" value="14,802" icon={FileText} color="blue" />
        <StatCard title="Tournaments" value="5" icon={Trophy} color="green" />
      </div>

      {/* SVG Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard 
          title="Prediction Growth" 
          metric="14.8k" 
          description="predictions made" 
          type="line" 
        />
        <AnalyticsCard 
          title="User Growth" 
          metric="+342" 
          description="registrants this week" 
          type="bar" 
          data={[30, 45, 60, 50, 75, 80, 95]}
        />
        <AnalyticsCard 
          title="Club Registrations" 
          metric="38" 
          description="approved networks" 
          type="bar" 
          data={[40, 20, 50, 30, 80, 60, 70]}
        />
      </div>

      {/* Recent Activity Log */}
      <div className="glass-card border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-850 pb-3">
          <Activity className="w-5 h-5 text-sports-green" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">System Activity Feed</h2>
        </div>
        <div className="divide-y divide-slate-850">
          {activities.map((act) => (
            <div key={act.id} className="py-3.5 flex items-center justify-between text-xs font-semibold gap-4">
              <div className="flex items-center gap-2 truncate">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  act.type === 'registration' ? 'bg-sports-blue' :
                  act.type === 'result' ? 'bg-sports-green' :
                  act.type === 'tournament' ? 'bg-sports-yellow' : 'bg-sports-gray'
                }`} />
                <span className="text-slate-200 truncate">{act.desc}</span>
              </div>
              <span className="text-[10px] text-sports-gray shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
