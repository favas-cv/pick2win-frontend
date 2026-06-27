import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClub } from '../../context/ClubContext';
import { useAuth } from '../../context/AuthContext';
import { matchService } from '../../services/matchService';
import { predictionService } from '../../services/predictionService';
import MatchCard from '../../components/match/MatchCard';
import PredictionCard from '../../components/match/PredictionCard';
import PredictionModal from '../../components/match/PredictionModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { ChevronLeft, Calendar, AlignLeft, ShieldAlert } from 'lucide-react';

export const TournamentDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { activeClub, memberships } = useClub();
  
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matches'); 

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Real members are always Approved
  const activeMembership = memberships.find(m => m.clubId === activeClub?.id);
  const isApproved = !!activeMembership || !!activeClub;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [details, allMatches, allPredictions] = await Promise.all([
          matchService.getTournamentDetails(id),
          matchService.getMatches({ tournamentId: id }),
          predictionService.getPredictions()
        ]);
        
        setTournament(details);
        setMatches(allMatches);
        
        const filteredPreds = allPredictions.filter(p =>
          allMatches.some(m => m.id === p.matchId)
        );
        setPredictions(filteredPreds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePredictClick = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handlePredictionSubmit = async (matchId, scoreA, scoreB) => {
    if (!activeClub) return;
    try {
      const newPrediction = await predictionService.submitPrediction(matchId, scoreA, scoreB, activeClub.id);
      setPredictions(prev => {
        const existingIdx = prev.findIndex(p => p.matchId === matchId);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], ...newPrediction };
          return updated;
        }
        return [...prev, newPrediction];
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 border border-slate-200 rounded-xl w-1/4 animate-pulse"></div>
        <div className="h-44 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse"></div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-slate-900">Tournament not found</h3>
        <Link to="/user/tournaments" className="text-blue-600 mt-2 inline-block font-semibold">Back to list</Link>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <div>
        <Link 
          to="/user/tournaments" 
          className="inline-flex items-center gap-1 text-xs font-bold text-sports-gray hover:text-slate-900 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Tournaments
        </Link>
      </div>

      <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6">
        <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
          {tournament.logo}
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900">{tournament.name}</h1>
            <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-600 px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider">
              {tournament.status}
            </span>
          </div>
          <p className="text-xs text-sports-gray leading-relaxed max-w-2xl font-semibold">{tournament.description}</p>
          <div className="flex items-center gap-4 text-[10px] text-sports-gray font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" /> 
              {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 flex gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-3 transition relative ${
            activeTab === 'matches' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
          }`}
        >
          Matches
          {activeTab === 'matches' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600"></span>}
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`pb-3 transition relative ${
            activeTab === 'predictions' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
          }`}
        >
          My Predictions ({predictions.length})
          {activeTab === 'predictions' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600"></span>}
        </button>

      </div>

      <div className="space-y-4">
        {activeTab === 'matches' && (
          matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onPredict={handlePredictClick}
                  userPrediction={predictions.find(p => p.matchId === match.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No matches scheduled" description="There are no active matches scheduled inside this tournament." />
          )
        )}

        {activeTab === 'predictions' && (
          predictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {predictions.map(pred => (
                <PredictionCard key={pred.id} prediction={pred} />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={AlignLeft}
              title="No predictions submitted" 
              description="You have not predicted any matchups for this tournament yet. Submit score guesses." 
            />
          )
        )}


      </div>

      {/* Prediction Modal */}
      {selectedMatch && (
        <PredictionModal
          isOpen={isModalOpen}
          match={selectedMatch}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMatch(null);
          }}
          onSubmit={handlePredictionSubmit}
          initialPrediction={predictions.find(p => p.matchId === selectedMatch.id)}
        />
      )}
    </div>
  );
};

export default TournamentDetails;
