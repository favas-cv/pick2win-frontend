import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClub } from '../../context/ClubContext';
import { predictionService } from '../../services/predictionService';
import ProfileCard from '../../components/profile/ProfileCard';
import PredictionCard from '../../components/match/PredictionCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { User, History, Settings, Key, ShieldCheck, Mail, LogOut, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const { activeClub, clubs } = useClub();
  
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'history' | 'settings'

  // Settings mock state
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyMatchClose, setNotifyMatchClose] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const history = await predictionService.getUserPredictionsHistory(user.id);
        setPredictions(history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"></div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      {user && (
        <ProfileCard 
          user={user} 
          activeClub={activeClub} 
          joinedClubsCount={user.role === 'user' ? user.joinedClubs?.length || 1 : 1} 
        />
      )}

      {/* Tabs */}
      <div className="border-b border-slate-850 flex gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition relative flex items-center gap-1.5 ${
            activeTab === 'profile' ? 'text-sports-green' : 'text-sports-gray hover:text-white'
          }`}
        >
          <User className="w-4 h-4" /> Profile Info
          {activeTab === 'profile' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-sports-green"></span>}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 transition relative flex items-center gap-1.5 ${
            activeTab === 'history' ? 'text-sports-green' : 'text-sports-gray hover:text-white'
          }`}
        >
          <History className="w-4 h-4" /> Prediction History ({predictions.length})
          {activeTab === 'history' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-sports-green"></span>}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 transition relative flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'text-sports-green' : 'text-sports-gray hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" /> Settings
          {activeTab === 'settings' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-sports-green"></span>}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {activeTab === 'profile' && (
          <div className="glass-card border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-850 pb-2">Clubs Enrolled</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clubs.map((club) => (
                <div key={club.id} className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{club.logo}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{club.name}</h4>
                      <span className="text-[10px] text-sports-gray block">{club.membersCount} Members</span>
                    </div>
                  </div>
                  {activeClub?.id === club.id && (
                    <span className="text-[9px] bg-sports-green/10 text-sports-green px-2 py-0.5 border border-sports-green/20 rounded-md font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          predictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
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
          )
        )}

        {activeTab === 'settings' && (
          <div className="glass-card border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white border-b border-slate-850 pb-2">Notification Settings</h3>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-slate-250 block">Email Newsletters</label>
                    <span className="text-xs text-sports-gray">Receive updates on club leaderboards and standings.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="w-4 h-4 rounded text-sports-green accent-sports-green focus:ring-0 focus:outline-none"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-slate-250 block">Match Kickoff Alerts</label>
                    <span className="text-xs text-sports-gray">Notify me 30 minutes before predictions lock.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyMatchClose}
                    onChange={(e) => setNotifyMatchClose(e.target.checked)}
                    className="w-4 h-4 rounded text-sports-green accent-sports-green focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white border-b border-slate-850 pb-2">Account Actions</h3>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={logout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-500/20 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Sign Out of Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
