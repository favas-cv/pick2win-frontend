import React, { useState, useEffect } from 'react';
import { useClub } from '../../context/ClubContext';
import { useAuth } from '../../context/AuthContext';
import { matchService } from '../../services/matchService';
import TournamentCard from '../../components/tournament/TournamentCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { ShieldCheck, Trophy, ShieldAlert } from 'lucide-react';

export const Tournaments = () => {
  const { user } = useAuth();
  const { activeClub, memberships } = useClub();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if membership is approved — real members are always Approved
  const activeMembership = memberships.find(m => m.clubId === activeClub?.id);
  const isApproved = !!activeMembership || !!activeClub;

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const allTournaments = await matchService.getTournaments();
        setTournaments(allTournaments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 border border-slate-200 w-1/3 rounded-xl animate-pulse"></div>
        <LoadingSkeleton type="card" count={3} />
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
