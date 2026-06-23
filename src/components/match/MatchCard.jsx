import React from 'react';
import { Calendar, Clock, Lock, CheckCircle } from 'lucide-react';

export const MatchCard = ({ match, onPredict, userPrediction }) => {
  const { id, tournamentName, teamA, teamB, kickoffTime, venue, status } = match;

  const kickoffDate = new Date(kickoffTime);
  const now = new Date();
  const timeDiff = kickoffDate.getTime() - now.getTime();
  const minutesToKickoff = timeDiff / (1000 * 60);
  
  // Prediction closes exactly 5 minutes before kickoff
  const isLocked = minutesToKickoff <= 5 || status === 'Live' || status === 'Completed';

  const formatKickoff = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="glass-card border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition duration-300 flex flex-col justify-between relative group overflow-hidden">
      {/* Decorative gradient header */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sports-green/30 to-transparent"></div>

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4 text-[11px] font-bold text-sports-gray">
        <span className="bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-lg tracking-wide uppercase">
          {tournamentName}
        </span>
        <div className="flex items-center gap-1.5">
          {status === 'Live' ? (
            <span className="flex items-center gap-1 text-red-500 font-extrabold bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20 animate-pulse">
              ● LIVE
            </span>
          ) : status === 'Completed' ? (
            <span className="bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-lg">
              FINISHED
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatKickoff(kickoffTime)}
            </span>
          )}
        </div>
      </div>

      {/* Teams Score Section */}
      <div className="flex items-center justify-between gap-4 py-3 my-1">
        {/* Team A */}
        <div className="flex-1 flex flex-col items-center text-center">
          <img 
            src={teamA.logo} 
            alt={teamA.name} 
            className="w-12 h-12 object-contain bg-slate-900/60 p-2 rounded-2xl border border-slate-850 shadow-inner"
          />
          <span className="text-xs font-bold text-slate-200 mt-2 line-clamp-1">{teamA.name}</span>
        </div>

        {/* VS / Score Panel */}
        <div className="flex flex-col items-center justify-center min-w-[60px]">
          {status === 'Live' || status === 'Completed' ? (
            <div className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl font-extrabold text-xl text-white shadow-inner">
              <span>{match.scoreA ?? 0}</span>
              <span className="text-sports-gray text-sm font-normal">:</span>
              <span>{match.scoreB ?? 0}</span>
            </div>
          ) : (
            <span className="text-xs font-bold text-sports-gray tracking-widest bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-850">
              VS
            </span>
          )}
          <span className="text-[9px] text-sports-gray mt-1.5 truncate max-w-[80px]">{venue}</span>
        </div>

        {/* Team B */}
        <div className="flex-1 flex flex-col items-center text-center">
          <img 
            src={teamB.logo} 
            alt={teamB.name} 
            className="w-12 h-12 object-contain bg-slate-900/60 p-2 rounded-2xl border border-slate-850 shadow-inner"
          />
          <span className="text-xs font-bold text-slate-200 mt-2 line-clamp-1">{teamB.name}</span>
        </div>
      </div>

      {/* Prediction Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-850/60">
        {userPrediction ? (
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-sports-gray font-bold uppercase tracking-wider block">Your Prediction</span>
              <span className="text-sm font-black text-sports-green tracking-wide">
                {userPrediction.predictedScoreA} - {userPrediction.predictedScoreB}
              </span>
            </div>
            {isLocked ? (
              <span className="text-[10px] text-sports-gray font-bold flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-850">
                <Lock className="w-3 h-3" /> Locked
              </span>
            ) : (
              <button
                onClick={() => onPredict(match)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl transition border border-slate-700"
              >
                Edit
              </button>
            )}
          </div>
        ) : isLocked ? (
          <div className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-sports-gray bg-slate-900 border border-slate-850 rounded-xl">
            <Lock className="w-3.5 h-3.5" /> Predictions Closed
          </div>
        ) : (
          <button
            onClick={() => onPredict(match)}
            className="w-full bg-sports-green hover:bg-sports-greenDark text-black text-xs font-black py-2.5 rounded-xl transition shadow-lg shadow-sports-green/5 active:scale-[0.98]"
          >
            Predict Score
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
