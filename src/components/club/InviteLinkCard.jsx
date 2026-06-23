import React, { useState } from 'react';
import { Copy, Check, Link2, Key } from 'lucide-react';

export const InviteLinkCard = ({ inviteCode, regToken }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const inviteLink = `${window.location.origin}/register?invite=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(regToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Invite Link Card */}
      <div className="glass-card border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-sports-green/10 text-sports-green border border-sports-green/20 rounded-xl flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Invite Link</h3>
            <p className="text-xs text-sports-gray mt-0.5 leading-relaxed">
              Users registering through this link are automatically enrolled in your club.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="flex-1 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-[11px] text-sports-gray focus:outline-none truncate"
          />
          <button
            onClick={handleCopyLink}
            className="bg-sports-green hover:bg-sports-greenDark text-black font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1 shrink-0"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Registration Token Card */}
      <div className="glass-card border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-sports-yellow/10 text-sports-yellow border border-sports-yellow/20 rounded-xl flex items-center justify-center shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Registration Token</h3>
            <p className="text-xs text-sports-gray mt-0.5 leading-relaxed">
              Provides direct verification token logic for your invitees.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            readOnly
            value={regToken}
            className="flex-1 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-[11px] font-mono text-slate-300 tracking-wider focus:outline-none"
          />
          <button
            onClick={handleCopyToken}
            className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition border border-slate-705 flex items-center gap-1 shrink-0"
          >
            {copiedToken ? <Check className="w-4 h-4 text-sports-green" /> : <Copy className="w-4 h-4" />}
            <span>{copiedToken ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteLinkCard;
