import { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { clubService } from '../../services/clubService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Users, Check, X } from 'lucide-react';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export const Members = () => {
  const { activeClub, updateMembershipStatus } = useClub();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'suspended'
  const [clubMembers, setClubMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMember, setSelectedMember] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' | 'reject' | 'suspend' | 'activate'
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeClub) return;
      setLoading(true);
      try {
        const data = await clubService.getClubMembers(activeClub.id);
        setClubMembers(Array.isArray(data) ? data : data.members || []);
      } catch (err) {
        console.error('Failed to fetch members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [activeClub]);

  // Map API members to their respective status (if the API doesn't provide status, we assume 'Approved' for now, or match on 'role')
  // We'll map them all to 'Approved' since getClubMembers returns joined members
  const pendingRequests = []; 
  const approvedMembers = clubMembers; 
  const suspendedMembers = [];

  const openActionModal = (member, type) => {
    setSelectedMember(member);
    setActionType(type);
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedMember) return;

    let targetStatus = 'Pending';
    if (actionType === 'approve' || actionType === 'activate') targetStatus = 'Approved';
    else if (actionType === 'suspend') targetStatus = 'Suspended';
    else if (actionType === 'reject') targetStatus = 'Rejected';

    updateMembershipStatus(selectedMember.id, targetStatus);
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const formatJoined = (dateStr) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMemberName = (member) => member.user_name || member.name || 'Unknown Member';
  const getMemberPhone = (member) => member.phone || member.email || 'No phone number';
  const getMemberJoinedAt = (member) => member.joined_at || member.joinedDate;
  const getMemberAvatar = (member) =>
    member.profile_image || member.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(getMemberName(member))}`;
  const formatRole = (role) => {
    if (!role) return 'Member';
    return role.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-black" /> Club Member Directories
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Approve pending requests, review active members, or manage suspensions.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 transition relative flex items-center gap-1.5 ${
            activeTab === 'pending' ? 'text-black' : 'text-slate-400 hover:text-slate-800'
          }`}
        >
          Pending Requests ({pendingRequests.length})
          {activeTab === 'pending' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>}
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 transition relative flex items-center gap-1.5 ${
            activeTab === 'approved' ? 'text-black' : 'text-slate-400 hover:text-slate-800'
          }`}
        >
          Approved Members ({approvedMembers.length})
          {activeTab === 'approved' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>}
        </button>
        <button
          onClick={() => setActiveTab('suspended')}
          className={`pb-3 transition relative flex items-center gap-1.5 ${
            activeTab === 'suspended' ? 'text-black' : 'text-slate-400 hover:text-slate-800'
          }`}
        >
          Rejected & Suspended ({suspendedMembers.length})
          {activeTab === 'suspended' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>}
        </button>
      </div>

      {/* Roster list */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <>
        {activeTab === 'pending' && (
          pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((member) => (
                <div key={member.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <img src={getMemberAvatar(member)} alt={getMemberName(member)} className="w-11 h-11 rounded-full border border-slate-200" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{getMemberName(member)}</h4>
                      <span className="text-[10px] text-slate-400 block font-semibold">{getMemberPhone(member)}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Requested: {formatJoined(getMemberJoinedAt(member))}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openActionModal(member, 'approve')}
                      className="bg-green-50 hover:bg-green-600 text-green-600 hover:text-white p-2 rounded-xl border border-green-200 transition"
                      title="Approve Member"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openActionModal(member, 'reject')}
                      className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white p-2 rounded-xl border border-red-200 transition"
                      title="Reject Request"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Users} title="No Pending Requests" description="There are no pending user requests to join your club right now." />
          )
        )}

        {activeTab === 'approved' && (
          approvedMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedMembers.map((member) => (
                <div key={member.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <img src={getMemberAvatar(member)} alt={getMemberName(member)} className="w-11 h-11 rounded-full border border-slate-200" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{getMemberName(member)}</h4>
                      <span className="text-[10px] text-slate-400 block font-semibold">{getMemberPhone(member)}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-600">
                          {formatRole(member.role)}
                        </span>
                        <span className="text-[9px] bg-[#fffdf2] border border-black/10 px-2 py-0.5 rounded font-bold text-black">
                          Joined {formatJoined(getMemberJoinedAt(member))}
                        </span>
                      </div>
                    </div>
                  </div>
                  {member.role !== 'club_admin' && (
                    <button
                      onClick={() => openActionModal(member, 'suspend')}
                      className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-3 py-2 border border-red-200 rounded-xl text-[10px] font-extrabold uppercase tracking-wide transition shrink-0"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Users} title="No Approved Members" description="You do not have any active approved members inside your club directories." />
          )
        )}

        {activeTab === 'suspended' && (
          suspendedMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suspendedMembers.map((member) => (
                <div key={member.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <img src={getMemberAvatar(member)} alt={getMemberName(member)} className="w-11 h-11 rounded-full border border-slate-200" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{getMemberName(member)}</h4>
                      <span className="text-[10px] text-slate-400 block font-semibold">{getMemberPhone(member)}</span>
                      <span className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border inline-block mt-1 ${
                        member.status === 'Suspended' ? 'text-red-500 bg-red-50 border-red-100' : 'text-slate-400 bg-slate-50 border-slate-200'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openActionModal(member, 'activate')}
                    className="bg-green-50 hover:bg-green-600 text-green-600 hover:text-white px-3 py-2 border border-green-200 rounded-xl text-[10px] font-extrabold uppercase tracking-wide transition shrink-0"
                  >
                    Activate
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Users} title="No Suspended Accounts" description="You have not suspended or rejected any user request logs." />
          )
        )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedMember && (
        <ConfirmationModal
          isOpen={isModalOpen}
          title={
            actionType === 'approve' ? 'Approve Member?' :
            actionType === 'reject' ? 'Reject Membership Request?' :
            actionType === 'suspend' ? 'Suspend Member?' : 'Re-Activate Member?'
          }
          message={`Are you sure you want to ${actionType} the club membership for ${getMemberName(selectedMember)}?`}
          confirmLabel={actionType.toUpperCase()}
          isDanger={actionType === 'reject' || actionType === 'suspend'}
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
};

export default Members;
