import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { predictionService } from '../../services/predictionService';
import PredictionCard from '../../components/match/PredictionCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { User, Shield, Phone, Hash, Award, Calendar, LogOut, History } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndHistory = async () => {
      setLoading(true);
      try {
        const [profileData, historyData] = await Promise.all([
          authService.getProfile(),
          predictionService.getUserPredictionsHistory()
        ]);
        setProfile(profileData);
        setPredictions(historyData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"></div>
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-white text-center py-10">Failed to load profile.</div>;
  }

  const { club } = profile;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* User Info Card */}
      <div className="glass-card border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sports-green/5 border border-sports-green/10 rounded-full translate-x-12 -translate-y-12"></div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full border-2 border-sports-green bg-slate-900 flex items-center justify-center text-4xl shadow-lg shadow-sports-green/10 shrink-0">
            👤
          </div>
          <div className="text-center sm:text-left space-y-2 flex-1">
            <h2 className="text-2xl font-black text-white leading-tight capitalize">{profile.name}</h2>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sports-gray text-xs font-semibold">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {profile.phone}</span>
              <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" /> {profile.username}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="text-[10px] bg-slate-900 border border-slate-850 px-3 py-1 rounded-xl text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3 text-sports-green" /> {profile.role}
              </span>
              {profile.role === 'club_admin' && (
                <Link to="/owner/dashboard" className="text-[10px] bg-sports-green/10 border border-sports-green/20 px-3 py-1 rounded-xl text-sports-green font-bold uppercase tracking-wider hover:bg-sports-green/20 transition">
                  Club Admin
                </Link>
              )}
              <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3" /> {profile.total_points} Points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Club Info Card */}
      {club && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Active Club</h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-xl">
                ⚽
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 capitalize">{club.name}</h4>
                <p className="text-xs text-sports-gray font-semibold">{club.place}</p>
              </div>
            </div>
            
            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider block">
                {club.member_role}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center sm:justify-end gap-1">
                <Calendar className="w-3 h-3" /> Joined {new Date(club.joined_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Prediction History Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-sports-gray" />
          <h3 className="text-lg font-black text-white">Prediction History</h3>
        </div>
        
        {predictions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {predictions.map((pred) => (
              <PredictionCard key={pred.id} prediction={pred} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={History}
            title="No predictions yet" 
            description="You have not submitted any matchup predictions. Go to the Home dashboard to make predictions!" 
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-850">
        <button
          onClick={logout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold px-4 py-3 rounded-xl border border-red-500/20 transition flex items-center justify-center gap-1.5 w-full sm:w-auto"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
