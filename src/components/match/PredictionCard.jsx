import React from 'react';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const PredictionCard = ({ prediction }) => {
  const { matchInfo, predictedScoreA, predictedScoreB, submittedAt, pointsEarned, status, tournamentName } = prediction;

  const getPointsColor = () => {
    if (pointsEarned === 3) return 'text-sports-green bg-sports-green/10 border-sports-green/20';
    if (pointsEarned === 1) return 'text-sports-blue bg-sports-blue/10 border-sports-blue/20';
    return 'text-sports-gray bg-slate-900 border-slate-800';
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'Correct Score':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-sports-green bg-sports-green/10 border border-sports-green/20 px-2.5 py-0.5 rounded-lg">
            <CheckCircle2 className="w-3 h-3" /> Exact Score (+3 pts)
          </span>
        );
      case 'Correct Outcome':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-sports-blue bg-sports-blue/10 border border-sports-blue/20 px-2.5 py-0.5 rounded-lg">
            <CheckCircle2 className="w-3 h-3" /> Outcome (+1 pt)
          </span>
        );
      case 'Active':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-sports-yellow bg-sports-yellow/10 border border-sports-yellow/20 px-2.5 py-0.5 rounded-lg">
            <Clock className="w-3 h-3 animate-spin" /> Pending Result
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-sports-gray bg-slate-900 border border-slate-850 px-2.5 py-0.5 rounded-lg">
            <AlertCircle className="w-3 h-3" /> Incorrect (0 pts)
          </span>
        );
    }
  };

  return (
    <div className="glass-card border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition duration-300">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold text-sports-gray bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-850 truncate max-w-[150px]">
          {tournamentName || 'Tournament'}
        </span>
        {getStatusBadge()}
      </div>

      <div className="flex items-center justify-between gap-4 py-2">
        {/* Team A */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img 
            src={matchInfo.teamA.logo} 
            alt={matchInfo.teamA.name} 
            className="w-8 h-8 object-contain bg-slate-900/60 p-1 rounded-xl" 
          />
          <span className="text-xs font-bold text-slate-200 truncate">{matchInfo.teamA.name}</span>
        </div>

        {/* Prediction Display */}
        <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-850 px-4 py-2 rounded-xl text-center">
          <span className="text-[9px] text-sports-gray font-bold uppercase tracking-wider">PREDICTED</span>
          <span className="text-sm font-extrabold text-white">{predictedScoreA} - {predictedScoreB}</span>
          {matchInfo.status === 'Completed' && (
            <div className="mt-1 pt-1 border-t border-slate-800/80">
              <span className="text-[8px] text-sports-gray uppercase block font-bold">ACTUAL</span>
              <span className="text-[11px] font-extrabold text-sports-gray">{matchInfo.scoreA} - {matchInfo.scoreB}</span>
            </div>
          )}
        </div>

        {/* Team B */}
        <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
          <span className="text-xs font-bold text-slate-200 truncate text-right">{matchInfo.teamB.name}</span>
          <img 
            src={matchInfo.teamB.logo} 
            alt={matchInfo.teamB.name} 
            className="w-8 h-8 object-contain bg-slate-900/60 p-1 rounded-xl" 
          />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-850/60 flex items-center justify-between text-[10px] text-sports-gray font-bold">
        <span>Submitted: {new Date(submittedAt).toLocaleDateString()}</span>
        {matchInfo.status === 'Completed' && (
          <span className={`px-2 py-0.5 rounded-lg border font-extrabold ${getPointsColor()}`}>
            +{pointsEarned} PTS
          </span>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
