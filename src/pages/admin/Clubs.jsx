import React from 'react';
import { Shield, Plus } from 'lucide-react';
import { MOCK_CLUBS } from '../../context/ClubContext';

export const Clubs = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-sports-green" /> Registered Clubs
          </h1>
          <p className="text-xs text-sports-gray mt-1">
            Browse and monitor active fan clubs across the platform.
          </p>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_CLUBS.map((club) => (
          <div 
            key={club.id} 
            className="glass-card border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition duration-350 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
                {club.logo}
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">{club.name}</h3>
                <span className="text-[9px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-sports-gray font-bold tracking-wider block mt-1 w-max">
                  ID: {club.id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-4 text-xs font-semibold">
              <div>
                <span className="text-[9px] text-sports-gray uppercase block font-bold">Members</span>
                <span className="text-sm font-extrabold text-white">{club.membersCount} Players</span>
              </div>
              <div>
                <span className="text-[9px] text-sports-gray uppercase block font-bold">Tournaments</span>
                <span className="text-sm font-extrabold text-white">{club.activeTournamentsCount} Enabled</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-850/50 flex justify-between items-center text-[10px]">
                <span className="text-sports-gray font-bold">INVITE CODE:</span>
                <span className="font-mono font-extrabold text-sports-green bg-slate-900 px-2 py-0.5 rounded border border-slate-800 tracking-wider">
                  {club.inviteCode}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clubs;
