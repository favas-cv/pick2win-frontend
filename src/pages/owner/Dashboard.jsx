import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { clubService } from '../../services/clubService';
import InviteLinkCard from '../../components/club/InviteLinkCard';
import { Users, Link2, RefreshCw, Trophy, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { activeClub } = useClub();

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);

  const [inviteData, setInviteData] = useState(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [linkError, setLinkError] = useState(null);

  // ── Fetch members on mount ──────────────────────────────────────────
  useEffect(() => {
    setMembersLoading(true);
    setMembersError(null);
    api_getMembers();
  }, []);   // runs once on mount, no dependency on activeClub needed since backend uses token

  const api_getMembers = () => {
    clubService.getClubMembers()
      .then(result => {
        console.log('Members response:', result);
        setMembers(Array.isArray(result) ? result : []);
      })
      .catch(err => {
        console.error('Members error:', err?.response?.data || err.message);
        setMembersError('Failed to load members.');
      })
      .finally(() => setMembersLoading(false));
  };

  // ── Generate invite link ────────────────────────────────────────────
 const handleGenerateLink = () => {
    if (!activeClub?.id) {
      alert('No active club found. Please refresh.');
      return;
    }
    setGeneratingLink(true);
    setLinkError(null);
    clubService.generateInviteLink(activeClub.id)
      .then(response => {
        const token = response.token;
        setInviteData({
          inviteCode: token,
          registrationToken: token,
        });
      })
      .catch(err => {
        console.error('Generate link error:', err?.response?.data || err.message);
        setLinkError('Failed to generate link.');
      })
      .finally(() => setGeneratingLink(false));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900">Club Owner Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Club: <span className="font-bold text-black">{activeClub?.name || 'Loading...'}</span>
          {' · '}Club ID: <span className="font-mono text-slate-700">{activeClub?.id || '?'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Invite Link Generator ─────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-green-500" /> Invite Settings
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Calls <code className="bg-slate-100 px-1 rounded">POST /api/club-admin/generate-link/</code>
          </p>
          <button
            onClick={handleGenerateLink}
            disabled={generatingLink}
            className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${generatingLink ? 'animate-spin' : ''}`} />
            <span>{generatingLink ? 'Generating...' : 'Generate New Link'}</span>
          </button>
          {linkError && <p className="text-red-500 text-xs mt-2">{linkError}</p>}
          {inviteData && (
            <div className="mt-4">
              <InviteLinkCard inviteCode={inviteData.inviteCode} regToken={inviteData.registrationToken} />
            </div>
          )}
        </div>

        {/* ── Club Members ──────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-black" /> Club Members
            </h2>
            <span className="bg-[#fffdf2] text-black text-xs font-bold px-2.5 py-1 rounded-full">
              {members.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Calls <code className="bg-slate-100 px-1 rounded">GET /api/club-admin/members/</code>
          </p>
          {membersLoading && (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          )}
          {membersError && <p className="text-red-500 text-sm">{membersError}</p>}
          {!membersLoading && !membersError && members.length === 0 && (
            <p className="text-slate-400 text-sm">No members found.</p>
          )}
          {!membersLoading && members.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {members.map((member, idx) => (
                <div key={member.id || idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 bg-[#fffdf2] border border-black/10 rounded-full flex items-center justify-center shrink-0 text-base">👤</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 capitalize">
                      {member.name || member.username || member.user?.name || member.user?.username || 'Member'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {member.role || member.user?.role || 'Member'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Links ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/owner/members" className="bg-white border border-slate-200 hover:border-black/30 p-4 rounded-2xl flex items-center gap-3 transition shadow-sm">
          <div className="w-9 h-9 bg-[#fffdf2] text-black rounded-xl flex items-center justify-center shrink-0"><Users className="w-4 h-4" /></div>
          <span className="text-sm font-bold text-slate-800">Members Directory</span>
        </Link>
        <Link to="/owner/leaderboard" className="bg-white border border-slate-200 hover:border-amber-300 p-4 rounded-2xl flex items-center gap-3 transition shadow-sm">
          <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0"><Medal className="w-4 h-4" /></div>
          <span className="text-sm font-bold text-slate-800">Leaderboard</span>
        </Link>
        <Link to="/owner/tournaments" className="bg-white border border-slate-200 hover:border-green-300 p-4 rounded-2xl flex items-center gap-3 transition shadow-sm">
          <div className="w-9 h-9 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0"><Trophy className="w-4 h-4" /></div>
          <span className="text-sm font-bold text-slate-800">Tournaments</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
