export const LeaderboardCard = ({ userRank, isCurrentUser, variant = 'row' }) => {
  const { rank, name, avatar, points } = userRank;
  const numericRank = Number(rank);
  const rankMeta = {
    1: {
      badge: '🥇',
      badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
      cardClass: 'bg-amber-50/70 border-amber-200 shadow-amber-500/10',
      pillClass: 'bg-amber-500 text-white',
    },
    2: {
      badge: '🥈',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      cardClass: 'bg-slate-50 border-slate-200 shadow-slate-500/10',
      pillClass: 'bg-slate-700 text-white',
    },
    3: {
      badge: '🥉',
      badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
      cardClass: 'bg-orange-50/70 border-orange-200 shadow-orange-500/10',
      pillClass: 'bg-orange-500 text-white',
    },
  };
  const meta = rankMeta[numericRank] || {
    badge: rank,
    badgeClass: isCurrentUser
      ? 'bg-black text-white border-blue-600'
      : 'bg-slate-100 text-slate-700 border-slate-200',
    cardClass: isCurrentUser
      ? 'bg-[#fffdf2] border-black/20 shadow-black/10'
      : 'bg-white border-slate-200 shadow-slate-900/5',
    pillClass: isCurrentUser
      ? 'bg-black text-white'
      : 'bg-slate-100 text-slate-900',
  };

  if (variant === 'podium') {
    const isFirst = numericRank === 1;

    return (
      <div className={`flex min-w-0 flex-1 flex-col items-center text-center ${isFirst ? '-mt-4' : 'mt-7'}`}>
        <div className={`relative rounded-full p-1 shadow-lg ${numericRank === 1 ? 'bg-amber-100 shadow-amber-500/15' : numericRank === 2 ? 'bg-slate-100 shadow-slate-500/10' : 'bg-orange-100 shadow-orange-500/10'}`}>
          <img
            src={avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
            alt={name}
            className={`${isFirst ? 'h-20 w-20' : 'h-16 w-16'} rounded-full border-4 border-white bg-slate-100 object-cover`}
          />
          <span className={`absolute -bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white text-sm shadow-sm ${meta.badgeClass}`}>
            {meta.badge}
          </span>
        </div>

        <span className={`mt-4 max-w-[92px] truncate text-sm font-black leading-tight ${isCurrentUser ? 'text-black' : 'text-slate-950'}`}>
          {name}
        </span>
        <span className={`mt-1 rounded-full px-2.5 py-1 text-[10px] font-black tabular-nums ${meta.pillClass}`}>
          {points} pts
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 shadow-sm transition duration-200 active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:shadow-md ${meta.cardClass}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black tabular-nums ${meta.badgeClass}`}>
        {meta.badge}
      </div>

      <img
        src={avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
        alt={name}
        className="h-9 w-9 shrink-0 rounded-full border border-white bg-slate-100 object-cover shadow-sm ring-1 ring-slate-200"
      />

      <div className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-bold leading-tight ${isCurrentUser ? 'text-black' : 'text-slate-950'}`}>
          {name}
        </span>
        {isCurrentUser && (
          <span className="mt-0.5 inline-flex rounded-full bg-black px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
            You
          </span>
        )}
      </div>

      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black tabular-nums ${meta.pillClass}`}>
        {points} pts
      </span>
    </div>
  );
};

export default LeaderboardCard;
