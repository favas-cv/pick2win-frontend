import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { clubService } from '../../services/clubService';
import InviteLinkCard from '../../components/club/InviteLinkCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Link2 } from 'lucide-react';

export const InviteLink = () => {
  const { activeClub } = useClub();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      if (!activeClub) return;
      setLoading(true);
      try {
        const stats = await clubService.getClubOwnerDashboard(activeClub.id);
        setData(stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, [activeClub]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-900 border border-slate-800 w-1/3 rounded-xl animate-pulse"></div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

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

      {data && (
        <div className="w-full">
          <InviteLinkCard inviteCode={data.inviteCode} regToken={data.registrationToken} />
        </div>
      )}
    </div>
  );
};

export default InviteLink;
