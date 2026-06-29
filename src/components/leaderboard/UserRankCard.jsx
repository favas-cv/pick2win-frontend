export const UserRankCard = ({ rank, points, name, avatar }) => {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-lg shadow-black/10">
      <div className="flex items-center gap-3">
        <img
          src={avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
          alt={name || 'You'}
          className="h-11 w-11 shrink-0 rounded-full border border-black/10 bg-slate-100 object-cover shadow-sm"
        />

        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-black uppercase tracking-wider text-black">My Rank</span>
          <span className="block truncate text-sm font-black leading-tight text-slate-950">{name || 'You'}</span>
        </div>

        <div className="shrink-0 rounded-2xl bg-[#fffdf2] px-3 py-2 text-center">
          <span className="block text-[9px] font-black uppercase tracking-wider text-black">Rank</span>
          <span className="block text-base font-black leading-tight text-black">{rank}</span>
        </div>

        <div className="shrink-0 rounded-full bg-black px-3 py-1.5 text-xs font-black tabular-nums text-white shadow-sm shadow-black/15">
          {points} pts
        </div>
      </div>
    </div>
  );
};

export default UserRankCard;
