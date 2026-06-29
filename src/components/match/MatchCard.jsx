import { useEffect, useMemo, useState } from 'react';
import { Lock, Radio, ShieldCheck } from 'lucide-react';

export const MatchCard = ({ match, onPredict, userPrediction }) => {
  const { tournamentName, teamA, teamB, kickoffTime, predictionLockTime, status } = match;

  const [now, setNow] = useState(() => new Date());
  const kickoffDate = useMemo(() => new Date(kickoffTime), [kickoffTime]);
  const lockDate = useMemo(
    () => new Date(predictionLockTime || kickoffTime),
    [predictionLockTime, kickoffTime]
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const kickoffDiff = kickoffDate.getTime() - now.getTime();
  const lockDiff = lockDate.getTime() - now.getTime();
  const liveWindowMs = 150 * 60 * 1000;
  const isVisualLive = status !== 'Completed' && kickoffDiff <= 0 && now.getTime() - kickoffDate.getTime() <= liveWindowMs;
  const isFinished = status === 'Completed';
  const isLocked = isFinished || lockDiff <= 0;

  const formatCountdown = (diffMs) => {
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatKickoffTime = (date) =>
    date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-xl hover:shadow-black/10 transition duration-300 flex flex-col justify-between relative group overflow-hidden">
      {/* Decorative gradient header */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>

      {/* Header Info */}
      <div className="flex justify-between items-start gap-3 mb-4 text-[11px] font-bold text-slate-500">
        <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl tracking-wide uppercase truncate max-w-[55%] shadow-sm">
          {tournamentName}
        </span>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {isVisualLive ? (
            <span className="flex items-center gap-1 text-red-600 font-extrabold bg-red-50 px-2.5 py-1 rounded-xl border border-red-200 shadow-sm animate-pulse">
              <Radio className="w-3.5 h-3.5" /> LIVE
            </span>
          ) : status === 'Completed' ? (
            <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl text-slate-700">
              FINISHED
            </span>
          ) : (
            null
          )}
          {status !== 'Completed' && (
            isLocked ? (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl">
                <Lock className="w-3.5 h-3.5" /> Time Up
              </span>
            ) : (
              <div className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl text-right shadow-sm ring-1 ring-slate-100">
                <span className="block text-sm font-medium tabular-nums text-slate-800 leading-tight">
                  {formatCountdown(lockDiff)}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Teams Score Section */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 py-5 my-1 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-[#fffdf2] border border-slate-100 shadow-inner">
        {/* Team A */}
        <div className="flex-1 flex flex-col items-center text-center min-w-0">
          <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-white shadow-lg shadow-slate-200/70 ring-1 ring-slate-200/80 flex items-center justify-center">
            <img
              src={teamA.logo}
              alt={teamA.name}
              className="w-12 h-12 object-contain p-1.5"
            />
          </div>
          <span className="text-sm font-black text-slate-900 mt-3 line-clamp-1">{teamA.name}</span>
        </div>

        {/* VS / Score Panel */}
        <div className="flex flex-col items-center justify-center min-w-[68px] sm:min-w-[78px]">
          <div className="flex flex-col items-center justify-center">
            {status === 'Live' || status === 'Completed' ? (
              <div className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl font-extrabold text-xl text-slate-900 shadow-inner">
                <span>{match.scoreA ?? 0}</span>
                <span className="text-sports-gray text-sm font-normal">:</span>
                <span>{match.scoreB ?? 0}</span>
              </div>
            ) : (
              <span className="text-xs font-black text-slate-500 tracking-widest bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm">
                VS
              </span>
            )}
            <div className="mt-2 text-center">
              <span className="block text-[12px] sm:text-sm font-black tabular-nums tracking-[0.14em] text-slate-900">
                {formatKickoffTime(kickoffDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Team B */}
        <div className="flex-1 flex flex-col items-center text-center min-w-0">
          <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-white shadow-lg shadow-slate-200/70 ring-1 ring-slate-200/80 flex items-center justify-center">
            <img
              src={teamB.logo}
              alt={teamB.name}
              className="w-12 h-12 object-contain p-1.5"
            />
          </div>
          <span className="text-sm font-black text-slate-900 mt-3 line-clamp-1">{teamB.name}</span>
        </div>
      </div>

      {/* Prediction Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200/60">
        {userPrediction ? (
          <div className="flex items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Your Prediction</span>
              <span className="text-base font-black text-emerald-600 tracking-wide">
                {userPrediction.predictedScoreA} - {userPrediction.predictedScoreB}
              </span>
            </div>
            {isLocked ? (
              <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <Lock className="w-3 h-3" /> Locked
              </span>
            ) : (
              <button
                onClick={() => onPredict(match)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-xl transition border border-slate-300"
              >
                Edit
              </button>
            )}
          </div>
        ) : isLocked ? (
          <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center shadow-inner">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-black" /> Locked
            </div>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">
              Great predictions begin with great instincts.
            </p>
          </div>
        ) : (
          <button
            onClick={() => onPredict(match)}
            className="w-full bg-black hover:bg-zinc-800 text-white text-sm font-black py-3.5 rounded-2xl transition shadow-lg shadow-black/15 active:scale-[0.98]"
          >
            Predict
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
