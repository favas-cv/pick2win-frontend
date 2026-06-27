import React, { useState } from 'react';
import { useClub } from '../../context/ClubContext';
import { clubService } from '../../services/clubService';
import InviteLinkCard from '../../components/club/InviteLinkCard';
import { Link2, RefreshCw } from 'lucide-react';

export const InviteLink = () => {
  const { activeClub } = useClub();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateLink = async () => {
    if (!activeClub) return;
    setLoading(true);
    try {
      const response = await clubService.generateInviteLink(activeClub.id);
      const inviteLink = response.invite_link || response.token;
      let token = response.token;
      if (inviteLink && inviteLink.includes('token=')) {
        token = inviteLink.split('token=')[1];
      }
      setData({
        inviteCode: token || inviteLink, // Map backend token to inviteCode/regToken for UI
        registrationToken: token || inviteLink,
      });
    } catch (err) {
      console.error('Failed to generate invite link:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-850 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <Link2 className="w-6 h-6 text-sports-green" /> Invite Settings
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Distribute codes and links to verify new registrants inside <span className="font-bold text-slate-200">{activeClub?.name}</span>.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleGenerateLink}
          disabled={loading}
          className="bg-sports-green hover:bg-sports-greenDark text-black font-extrabold text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Generating...' : 'Generate New Link'}</span>
        </button>
      </div>

      {data && (
        <div className="w-full mt-6 animate-fadeIn">
          <InviteLinkCard inviteCode={data.inviteCode} regToken={data.registrationToken} />
        </div>
      )}
    </div>
  );
};

export default InviteLink;
