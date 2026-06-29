import React from 'react';
import AnalyticsCard from '../../components/cards/AnalyticsCard';
import StatCard from '../../components/common/StatCard';
import { BarChart2, TrendingUp, Users, Flame, Percent } from 'lucide-react';

export const Analytics = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-sports-green" /> Global Platform Analytics
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Detailed metrics, active user trends, and platform interaction dashboards.
        </p>
      </div>

      {/* Stats panels row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Daily Active Users (DAU)" value="842" icon={Users} color="blue" trend="+14% vs last week" />
        <StatCard title="Submission Rate" value="94.2%" icon={Percent} color="green" trend="+2.4% vs last week" />
        <StatCard title="Global Match Views" value="4,821" icon={Flame} color="yellow" trend="+18% vs last week" />
      </div>

      {/* SVG Analytics grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalyticsCard 
          title="Match Predictions Growth" 
          metric="14,802" 
          description="Total guesses submitted" 
          type="line" 
        />
        
        <AnalyticsCard 
          title="New User Registration Rate" 
          metric="+342" 
          description="Registrants this week" 
          type="bar" 
          data={[40, 55, 60, 65, 80, 85, 98]}
        />
      </div>

      {/* Tabular Analytics Breakdowns */}
      <div className="glass-card border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
          <TrendingUp className="w-5 h-5 text-sports-green" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Top Performing Clubs by Submissions</h2>
        </div>
        <div className="overflow-x-auto text-xs font-semibold">
          <table className="w-full text-left text-slate-900 border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-[10px] text-sports-gray uppercase tracking-widest font-bold">
                <th className="py-3 px-4">Club Name</th>
                <th className="py-3 px-4 text-center">Active Members</th>
                <th className="py-3 px-4 text-center">Avg Predictions / Match</th>
                <th className="py-3 px-4 text-right">Engagement Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 flex items-center gap-2 font-bold">
                  <span>🇧🇷</span> Brazil Fans Club
                </td>
                <td className="py-3.5 px-4 text-center">342</td>
                <td className="py-3.5 px-4 text-center">210</td>
                <td className="py-3.5 px-4 text-right text-sports-green">92.4%</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 flex items-center gap-2 font-bold">
                  <span>🇪🇸</span> Madridistas Hub
                </td>
                <td className="py-3.5 px-4 text-center">890</td>
                <td className="py-3.5 px-4 text-center">540</td>
                <td className="py-3.5 px-4 text-right text-sports-green">89.8%</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 flex items-center gap-2 font-bold">
                  <span>👹</span> Red Devils United
                </td>
                <td className="py-3.5 px-4 text-center">512</td>
                <td className="py-3.5 px-4 text-center">310</td>
                <td className="py-3.5 px-4 text-right text-sports-green">84.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
