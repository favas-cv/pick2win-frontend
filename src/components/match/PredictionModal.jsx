import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';

export const PredictionModal = ({ isOpen, match, onClose, onSubmit, initialPrediction }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      scoreA: initialPrediction?.predictedScoreA ?? '',
      scoreB: initialPrediction?.predictedScoreB ?? ''
    }
  });

  if (!isOpen || !match) return null;

  const handleFormSubmit = (data) => {
    onSubmit(match.id, data.scoreA, data.scoreB);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-2xl border-slate-800 p-6 relative shadow-2xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-sports-gray hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[10px] font-bold text-sports-green bg-sports-green/10 border border-sports-green/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">
            {match.tournamentName}
          </span>
          <h3 className="text-lg font-bold text-white mt-2">Submit Prediction</h3>
          <p className="text-xs text-sports-gray mt-1">Predict the score after full time (90 minutes).</p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-850">
            {/* Team A Input */}
            <div className="flex flex-col items-center flex-1 gap-2">
              <img 
                src={match.teamA.logo} 
                alt={match.teamA.name} 
                className="w-12 h-12 object-contain bg-slate-800 p-1.5 rounded-xl" 
              />
              <label className="text-xs font-bold text-slate-350 truncate max-w-[100px]">{match.teamA.name}</label>
              <input
                type="number"
                min="0"
                max="99"
                required
                {...register('scoreA', { required: true, min: 0 })}
                className="w-16 h-12 text-center text-xl font-extrabold bg-slate-800 border border-slate-700 rounded-xl focus:border-sports-green focus:outline-none text-white shadow-inner"
              />
            </div>

            <div className="text-xl font-extrabold text-sports-gray">:</div>

            {/* Team B Input */}
            <div className="flex flex-col items-center flex-1 gap-2">
              <img 
                src={match.teamB.logo} 
                alt={match.teamB.name} 
                className="w-12 h-12 object-contain bg-slate-800 p-1.5 rounded-xl" 
              />
              <label className="text-xs font-bold text-slate-350 truncate max-w-[100px]">{match.teamB.name}</label>
              <input
                type="number"
                min="0"
                max="99"
                required
                {...register('scoreB', { required: true, min: 0 })}
                className="w-16 h-12 text-center text-xl font-extrabold bg-slate-800 border border-slate-700 rounded-xl focus:border-sports-green focus:outline-none text-white shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-850 hover:bg-slate-850 text-white text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sports-green hover:bg-sports-greenDark text-black text-xs font-bold rounded-xl transition shadow-lg shadow-sports-green/10 flex items-center gap-1.5 active:scale-95"
            >
              <Save className="w-4 h-4" /> Save Prediction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PredictionModal;
