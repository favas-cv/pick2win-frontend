import React, { useState, useRef, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { ChevronDown, Check } from 'lucide-react';

export const ClubSelector = () => {
  const { clubs, activeClub, switchClub } = useClub();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeClub) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white hover:bg-slate-50 transition px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-semibold max-w-[200px]"
      >
        <span className="truncate max-w-[140px] text-slate-900">{activeClub.name}</span>
        <ChevronDown className={`w-4 h-4 text-sports-gray transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden py-1">
          <div className="px-4 py-2 text-xs text-sports-gray border-b border-slate-200 font-medium">
            Switch Active Club
          </div>
          <div className="max-h-48 overflow-y-auto">
            {clubs.map((club) => (
              <button
                key={club.id}
                onClick={() => {
                  switchClub(club.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-100/40 text-sm text-left transition"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${activeClub.id === club.id ? 'text-sports-green' : 'text-slate-700'}`}>
                    {club.name}
                  </span>
                </div>
                {activeClub.id === club.id && (
                  <Check className="w-4 h-4 text-sports-green" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubSelector;
