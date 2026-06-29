import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { predictionService } from '../../services/predictionService';
import PredictionCard from '../../components/match/PredictionCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Shield, Phone, Award, Calendar, LogOut, History } from 'lucide-react';

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
        <div className="h-44 bg-slate-50 border border-slate-200 rounded-2xl animate-pulse"></div>
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-slate-900 text-center py-10">Failed to load profile.</div>;
  }

  const { club } = profile;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* User Info Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-lg shadow-slate-200/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fffdf2]0/10 via-black/30 to-amber-400/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#fffdf2]/80 rounded-full translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-10 w-24 h-24 bg-amber-50/80 rounded-full translate-y-12"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div className="p-1.5 rounded-3xl bg-gradient-to-br from-blue-100 via-white to-amber-100 shadow-sm shrink-0">
            <div className="w-24 h-24 rounded-2xl border border-white bg-slate-50 flex items-center justify-center text-4xl shadow-inner">
              👤
            </div>
          </div>
          <div className="text-center sm:text-left space-y-4 flex-1 min-w-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight capitalize tracking-tight">{profile.name}</h2>
            </div>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-slate-500 text-xs font-semibold">
              <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                <Phone className="w-3.5 h-3.5 text-black" /> {profile.phone}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {profile.role === 'club_admin' && (
                <Link to="/owner/dashboard" className="text-[10px] bg-sports-green/10 border border-sports-green/20 px-3 py-1.5 rounded-xl text-sports-green font-bold uppercase tracking-wider hover:bg-sports-green/20 transition">
                  Club Admin
                </Link>
              )}
              <span className="text-[10px] bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3" /> {profile.total_points} Points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Club Info Card */}
      {club && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-200/50">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.18em] mb-4 border-b border-slate-100 pb-3">Active Club</h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-[#fffdf2] to-white border border-black/10 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                ⚽
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-950 capitalize leading-tight">{club.name}</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1">{club.place}</p>
              </div>
            </div>
            
            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] bg-[#fffdf2] border border-black/10 text-black px-3 py-1 rounded-xl font-black uppercase tracking-wider block">
                {club.member_role}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold flex items-center sm:justify-end gap-1.5">
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
          <h3 className="text-lg font-black text-slate-900">Prediction History</h3>
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
      <div className="pt-4 border-t border-slate-200">
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
