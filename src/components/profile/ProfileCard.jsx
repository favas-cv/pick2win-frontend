import React from 'react';
import { Mail, Shield } from 'lucide-react';

export const ProfileCard = ({ user, activeClub, joinedClubsCount }) => {
  return (
    <div className="glass-card border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sports-green/5 border border-sports-green/10 rounded-full translate-x-12 -translate-y-12"></div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
          alt={user.name}
          className="w-24 h-24 rounded-full border-2 border-sports-green bg-slate-900 object-cover shadow-lg shadow-sports-green/10"
        />

        <div className="text-center sm:text-left space-y-3 flex-1 min-w-0">
          <div>
            <h2 className="text-2xl font-black text-white leading-tight">{user.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sports-gray text-xs mt-1 font-semibold">
              <Mail className="w-4 h-4 text-sports-gray" />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="text-[10px] bg-slate-900 border border-slate-850 px-3 py-1 rounded-xl text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-sports-green" /> {user.role.replace('_', ' ')}
            </span>
            {activeClub && (
              <span className="text-[10px] bg-slate-900 border border-slate-850 px-3 py-1 rounded-xl text-slate-300 font-bold uppercase tracking-wider">
                {activeClub.logo} {activeClub.name}
              </span>
            )}
            <span className="text-[10px] bg-slate-900 border border-slate-850 px-3 py-1 rounded-xl text-slate-300 font-bold uppercase tracking-wider">
              Clubs Joined: {joinedClubsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
