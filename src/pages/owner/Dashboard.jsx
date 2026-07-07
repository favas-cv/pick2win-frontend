import React, { useState } from 'react';
import { useClub } from '../../context/ClubContext';
import { clubService } from '../../services/clubService';
import InviteLinkCard from '../../components/club/InviteLinkCard';
import { Users, Link2, RefreshCw, Trophy, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { activeClub } = useClub();


  const [inviteData, setInviteData] = useState(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [linkError, setLinkError] = useState(null);

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
