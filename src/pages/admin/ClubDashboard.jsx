import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import clubService from '../../services/clubService';
import predictionService from '../../services/predictionService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Shield, Users, Link as LinkIcon, Trophy } from 'lucide-react';

export const ClubDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [members, setMembers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (e) {
        console.error(e);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Fetch club members and leaderboard when profile loaded
  useEffect(() => {
    if (profile && profile.club) {
      const clubId = profile.club.id;
      clubService.getClubMembers(clubId).then(setMembers).catch(err => console.error(err));
      // Assuming tournamentId=0 fetch overall club leaderboard
      predictionService.getLeaderboard(clubId, 0).then(setLeaderboard).catch(err => console.error(err));
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (!profile || !profile.club) {
    return (
      <EmptyState
        icon={Shield}
        title="No Club Assigned"
        description="You are not assigned to a club."
      />
    );
  }

  const { club } = profile;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-sports-green" /> Club Admin Dashboard
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Manage your club, view members, generate invite links and see the club leaderboard.
        </p>
      </div>

      {/* Club Info */}
      <div className="glass-card border-slate-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">{club.name}</h2>
        <p className="text-sports-gray">Club ID: {club.id}</p>
        <p className="text-sports-gray">Location: {club.place || '—'}</p>
      </div>

      {/* Invite Link */}
      <div className="glass-card border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-sports-green" /> Invite Link
        </h2>
        <p className="text-sports-gray break-all">
          {`${window.location.origin}/invite/${club.id}`}
        </p>
      </div>

      {/* Members list */}
      <div className="glass-card border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-sports-green" /> Members
        </h2>
        {members && members.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-sports-gray">
              <thead className="text-xs uppercase bg-slate-100/50 text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3 rounded-tr-lg rounded-br-lg">Role</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} className="border-b border-slate-200/50 last:border-0 hover:bg-slate-100/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 capitalize">{member.name}</td>
                    <td className="px-4 py-3 font-mono">{member.phone}</td>
                    <td className="px-4 py-3 capitalize">{member.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sports-gray text-sm">No members found.</p>
        )}
      </div>

      {/* Club Leaderboard */}
      <div className="glass-card border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-sports-yellow" /> Club Leaderboard
        </h2>
        {leaderboard && leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-sports-gray">
              <thead className="text-xs uppercase bg-slate-100/50 text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg w-16">Rank</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg rounded-br-lg">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.user || index} className="border-b border-slate-200/50 last:border-0 hover:bg-slate-100/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                        index === 1 ? 'bg-slate-300/20 text-slate-700' : 
                        index === 2 ? 'bg-amber-700/20 text-amber-500' : 
                        'bg-slate-100 text-slate-400'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{entry.username}</td>
                    <td className="px-4 py-3 text-right font-bold text-sports-green">{entry.total_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sports-gray text-sm">No leaderboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default ClubDashboard;
