import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Check, X } from 'lucide-react';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export const ClubOwners = () => {
  // Bind directly to global AuthContext state for real-time approvals!
  const { owners, updateOwnerStatus } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' | 'suspend' | 'reject'

  const openActionModal = (owner, type) => {
    setSelectedOwner(owner);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedOwner) return;

    let targetStatus = 'Pending';
    if (actionType === 'approve') targetStatus = 'Approved';
    else if (actionType === 'suspend') targetStatus = 'Suspended';
    else if (actionType === 'reject') targetStatus = 'Rejected';

    updateOwnerStatus(selectedOwner.id, targetStatus);
    setModalOpen(false);
    setSelectedOwner(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Suspended':
        return 'text-red-500 bg-red-50 border-red-100';
      case 'Pending':
      default:
        return 'text-amber-500 bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" /> Owner Registrations
        </h1>
        <p className="text-xs text-sports-gray mt-1">
          Review and approve pending club owner request logs or suspend existing administrator credentials.
        </p>
      </div>

      {/* Owners Table */}
      <div className="glass-card border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sports-gray font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Requested Club</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-700">
              {owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-bold text-slate-900">{owner.name}</td>
                  <td className="py-4 px-6 text-sports-gray">{owner.email}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg shrink-0">{owner.logo}</span>
                      <span>{owner.clubName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-extrabold ${getStatusStyle(owner.status)}`}>
                      {owner.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {owner.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => openActionModal(owner, 'approve')}
                            className="bg-green-50 hover:bg-green-600 text-green-600 hover:text-white p-1.5 rounded-lg border border-green-200 transition cursor-pointer"
                            title="Approve Owner"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openActionModal(owner, 'reject')}
                            className="bg-red-50 hover:bg-red-650 text-red-650 hover:text-white p-1.5 rounded-lg border border-red-200 transition cursor-pointer"
                            title="Reject Request"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {owner.status === 'Approved' && (
                        <button
                          onClick={() => openActionModal(owner, 'suspend')}
                          className="bg-red-50 hover:bg-red-600 hover:text-white text-red-500 px-3 py-1 rounded-lg border border-red-200 transition text-[10px] font-extrabold uppercase tracking-wide cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}
                      {owner.status === 'Suspended' && (
                        <button
                          onClick={() => openActionModal(owner, 'approve')}
                          className="bg-green-50 hover:bg-green-600 hover:text-white text-green-600 px-3 py-1 rounded-lg border border-green-200 transition text-[10px] font-extrabold uppercase tracking-wide cursor-pointer"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedOwner && (
        <ConfirmationModal
          isOpen={modalOpen}
          title={
            actionType === 'approve' ? 'Approve Club Owner?' :
            actionType === 'suspend' ? 'Suspend Club Owner?' : 'Reject Owner Request?'
          }
          message={`Are you sure you want to ${actionType} the club owner request for ${selectedOwner.name}?`}
          confirmLabel={actionType.toUpperCase()}
          isDanger={actionType !== 'approve'}
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setModalOpen(false);
            setSelectedOwner(null);
          }}
        />
      )}
    </div>
  );
};

export default ClubOwners;
