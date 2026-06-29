import React from 'react';
import { Mail, Shield, Trophy } from 'lucide-react';

export const ProfileCard = ({ user, activeClub, joinedClubsCount }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-lg shadow-slate-200/60">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fffdf2]0/10 via-black/30 to-amber-400/20"></div>
      <div className="absolute right-0 top-0 w-40 h-40 bg-[#fffdf2]/70 rounded-full translate-x-16 -translate-y-16"></div>
      <div className="absolute right-8 bottom-0 w-24 h-24 bg-amber-50/80 rounded-full translate-y-12"></div>

      <div className="relative flex flex-col sm:flex-row items-center gap-6">
        <div className="p-1.5 rounded-3xl bg-gradient-to-br from-blue-100 via-white to-amber-100 shadow-sm">
          <img
            src={user.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
            alt={user.name}
            className="w-24 h-24 rounded-2xl border border-white bg-slate-50 object-cover shadow-inner"
          />
        </div>

        <div className="text-center sm:text-left space-y-4 flex-1 min-w-0">
          <div>
            <p className="text-[10px] text-black font-black uppercase tracking-[0.18em] mb-1">Player Profile</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight tracking-tight">{user.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 text-xs mt-2 font-semibold">
              <Mail className="w-4 h-4 text-sports-gray" />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="text-[10px] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-sports-green" /> {user.role.replace('_', ' ')}
            </span>
            {activeClub && (
              <span className="text-[10px] bg-[#fffdf2] border border-black/10 px-3 py-1.5 rounded-xl text-black font-bold uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {activeClub.logo} {activeClub.name}
              </span>
            )}
            <span className="text-[10px] bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl text-amber-700 font-bold uppercase tracking-wider">
              Clubs Joined: {joinedClubsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
