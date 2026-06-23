import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { useAuth } from '../../context/AuthContext';
import { matchService } from '../../services/matchService';
import { clubService } from '../../services/clubService';
import TournamentCard from '../../components/tournament/TournamentCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { ShieldCheck, Trophy, ShieldAlert } from 'lucide-react';

export const Tournaments = () => {
  const { user } = useAuth();
  const { activeClub, memberships } = useClub();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if membership is approved
  const activeMembership = memberships.find(m => m.clubId === activeClub?.id && m.email === user?.email);
  const isApproved = activeMembership?.status === 'Approved';

  useEffect(() => {
    const fetchTournaments = async () => {
      if (!activeClub || !isApproved) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [allTournaments, enabledIds] = await Promise.all([
          matchService.getTournaments(),
          clubService.getEnabledTournaments(activeClub.id)
        ]);
        
        const filtered = allTournaments.filter(t => enabledIds.includes(t.id));
        setTournaments(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [activeClub, isApproved]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 border border-slate-200 w-1/3 rounded-xl animate-pulse"></div>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 border border-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Awaiting Club Approval</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            You must be approved by the club owner in <span className="font-bold text-slate-800">{activeClub?.name}</span> to browse tournaments and matches.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-blue-600" /> Enabled Tournaments
        </h1>
        <p className="text-xs text-sports-gray mt-1 flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-4 h-4 text-green-600 font-bold" /> 
          Showing competitions activated by your club owner for <span className="font-bold text-slate-700">{activeClub?.name}</span>.
        </p>
      </div>

      {tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map(tournament => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No Tournaments Active"
          description="Your club owner has not enabled any tournaments for this club yet. Please check back later."
        />
      )}
    </div>
  );
};

export default Tournaments;
