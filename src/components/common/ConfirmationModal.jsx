import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-2xl border-slate-200 p-6 relative shadow-2xl animate-fadeIn">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-sports-gray hover:text-slate-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-xl shrink-0 ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-sports-green/10 text-sports-green'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-sports-gray leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition shadow-lg ${
              isDanger 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/10' 
                : 'bg-sports-green hover:bg-sports-greenDark text-white shadow-sports-green/10'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
