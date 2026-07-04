import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, KeyRound, RefreshCw, X } from 'lucide-react';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const getUserField = (request, field) => {
  if (field === 'name' && typeof request.user === 'string') return request.user;
  return request.user?.[field] || request.member?.[field] || request[field] || '';
};

const normalizeStatus = (request) => {
  const rawStatus = request.status || request.state || '';
  return String(rawStatus || 'pending').toLowerCase();
};

const formatDate = (value) => {
  if (!value) return 'Unknown';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const ResetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/club-admin/reset-requests/');
      const data = response.data.results ?? response.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load password reset requests.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchRequests, 0);
    return () => window.clearTimeout(timer);
  }, [fetchRequests]);

  const pendingRequests = useMemo(
    () => requests.filter((request) => normalizeStatus(request) === 'pending'),
    [requests]
  );

  const completedRequests = useMemo(
    () => requests.filter((request) => normalizeStatus(request) !== 'pending'),
    [requests]
  );

  const openActionModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
  };

  const closeActionModal = () => {
    setSelectedRequest(null);
    setActionType('');
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    setActionLoading(true);
    setError('');
    try {
      if (actionType === 'approve') {
        const response = await api.post(`/club-admin/reset-request/${selectedRequest.id}/approve/`);
        setResetLink(response.data?.reset_link || '');
      } else {
        await api.post(`/club-admin/reset-request/${selectedRequest.id}/reject/`);
      }
      setRequests((current) => current.filter((request) => request.id !== selectedRequest.id));
      closeActionModal();
    } catch (err) {
      setError(getApiErrorMessage(err, `Could not ${actionType} this password reset request.`));
    } finally {
      setActionLoading(false);
    }
  };

  const copyResetLink = async () => {
    if (!resetLink) return;
    try {
      await navigator.clipboard.writeText(resetLink);
    } catch {
      setError('Could not copy the reset link. Select the link and copy it manually.');
    }
  };

  const renderRequestCard = (request, allowActions = false) => {
    const status = normalizeStatus(request);
    const name = getUserField(request, 'name') || 'Unknown user';
    const phone = getUserField(request, 'phone') || 'No phone number';
    const createdAt = request.created_at || request.createdAt || request.requested_at;

    return (
      <div key={request.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 truncate">{name}</h4>
            <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border ${
              status === 'approved'
                ? 'text-green-600 bg-green-50 border-green-100'
                : status === 'rejected'
                  ? 'text-red-500 bg-red-50 border-red-100'
                  : 'text-amber-600 bg-amber-50 border-amber-100'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">{phone}</p>
          <p className="text-[10px] text-slate-400 mt-1">Requested: {formatDate(createdAt)}</p>
        </div>

        {allowActions && (
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openActionModal(request, 'approve')}
              className="bg-green-50 hover:bg-green-600 text-green-600 hover:text-white p-2 rounded-xl border border-green-200 transition"
              title="Approve password reset"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openActionModal(request, 'reject')}
              className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white p-2 rounded-xl border border-red-200 transition"
              title="Reject password reset"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-black" /> Password Reset Requests
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Approve or reject members who could not reset their password with Firebase OTP.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchRequests}
          disabled={loading}
          className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {resetLink && (
        <div className="bg-sports-green/10 border border-sports-green/20 text-slate-900 text-xs p-3 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="font-bold block text-sports-green mb-1">Reset link created</span>
            <span className="block truncate">{resetLink}</span>
          </div>
          <button
            type="button"
            onClick={copyResetLink}
            className="bg-sports-green hover:bg-sports-greenDark text-white text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Copy Link
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton count={4} />
      ) : (
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Pending Requests ({pendingRequests.length})
            </h2>
            {pendingRequests.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((request) => renderRequestCard(request, true))}
              </div>
            ) : (
              <EmptyState icon={KeyRound} title="No Pending Requests" description="There are no password reset requests waiting for review." />
            )}
          </section>

          {completedRequests.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Reviewed Requests ({completedRequests.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedRequests.map((request) => renderRequestCard(request))}
              </div>
            </section>
          )}
        </div>
      )}

      {selectedRequest && (
        <ConfirmationModal
          isOpen={Boolean(selectedRequest)}
          title={actionType === 'approve' ? 'Approve Reset Request?' : 'Reject Reset Request?'}
          message={`Are you sure you want to ${actionType} the password reset request for ${getUserField(selectedRequest, 'name') || getUserField(selectedRequest, 'phone') || 'this user'}?`}
          confirmLabel={actionLoading ? 'Working...' : actionType.toUpperCase()}
          isDanger={actionType === 'reject'}
          onConfirm={handleConfirmAction}
          onCancel={closeActionModal}
        />
      )}
    </div>
  );
};

export default ResetRequests;
