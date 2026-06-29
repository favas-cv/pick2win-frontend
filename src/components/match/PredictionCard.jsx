export const PredictionCard = ({ prediction }) => {
  const { matchInfo, predictedScoreA, predictedScoreB, submittedAt, pointsEarned, tournamentName } = prediction;

  const getPointsColor = () => {
    if (pointsEarned === 5) return 'text-black bg-[#fffdf2] border-black/10';
    if (pointsEarned === 3) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    return 'text-sports-gray bg-slate-50 border-slate-200';
  };

  return (
    <div className="glass-card border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition duration-300">
      <div className="flex items-center mb-3">
        <span className="text-[10px] font-bold text-sports-gray bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 truncate max-w-[150px]">
          {tournamentName || 'Tournament'}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 py-2">
        {/* Team A */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img 
            src={matchInfo.teamA.logo} 
            alt={matchInfo.teamA.name} 
            className="w-8 h-8 object-contain bg-white p-1 rounded-xl" 
          />
          <span className="text-xs font-bold text-slate-900 truncate">{matchInfo.teamA.name}</span>
        </div>

        {/* Prediction Display */}
        <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center">
          <span className="text-[9px] text-sports-gray font-bold uppercase tracking-wider">PREDICTED</span>
          <span className="text-sm font-extrabold text-slate-900">{predictedScoreA} - {predictedScoreB}</span>
          {matchInfo.status === 'Completed' && (
            <div className="mt-1 pt-1 border-t border-slate-200/80">
              <span className="text-[8px] text-sports-gray uppercase block font-bold">ACTUAL</span>
              <span className="text-[11px] font-extrabold text-sports-gray">{matchInfo.scoreA} - {matchInfo.scoreB}</span>
            </div>
          )}
        </div>

        {/* Team B */}
        <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
          <span className="text-xs font-bold text-slate-900 truncate text-right">{matchInfo.teamB.name}</span>
          <img 
            src={matchInfo.teamB.logo} 
            alt={matchInfo.teamB.name} 
            className="w-8 h-8 object-contain bg-white p-1 rounded-xl" 
          />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-sports-gray font-bold">
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
