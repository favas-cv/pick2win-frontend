import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { predictionService } from '../../services/predictionService';
import { matchService } from '../../services/matchService';
import PredictionCard from '../../components/match/PredictionCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Phone, Award, Calendar, LogOut, History, Camera, Edit3, Save, X, Star, AlertCircle } from 'lucide-react';
import { getApiErrorMessage } from '../../utils/apiError';

export const Profile = () => {
  const { user, logout } = useAuth();
  const logoSrc = '/favicon.png';
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [predictionPage, setPredictionPage] = useState(1);
  const fileInputRef = useRef(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const predictionsPerPage = 5;

  useEffect(() => {
    const fetchProfileAndHistory = async () => {
      setLoading(true);
      try {
        const [profileData, historyData] = await Promise.all([
          authService.getProfile(),
          predictionService.getUserPredictionsHistory()
        ]);
        setProfile(profileData);
        reset({
          name: profileData.name || '',
          bio: profileData.bio || '',
          favorite_team: profileData.favorite_team?.id || '',
        });
        setPredictions(historyData);
        setPredictionPage(1);
        matchService.getTeams().then(setTeams).catch(() => setTeams([]));
      } catch (err) {
        console.error(err);
        setError(getApiErrorMessage(err, 'Failed to load profile.'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndHistory();
  }, [reset]);

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
  const profileImage = profile.profile_image || user?.profile_image || 'https://api.dicebear.com/7.x/pixel-art/svg';
  const favoriteTeamLogo = profile.favorite_team?.logo;
  const predictionPageCount = Math.max(1, Math.ceil(predictions.length / predictionsPerPage));
  const safePredictionPage = Math.min(predictionPage, predictionPageCount);
  const paginatedPredictions = predictions.slice(
    (safePredictionPage - 1) * predictionsPerPage,
    safePredictionPage * predictionsPerPage
  );

  const onEdit = () => {
    reset({
      name: profile.name || '',
      bio: profile.bio || '',
      favorite_team: profile.favorite_team?.id || '',
    });
    setError('');
    setEditing(true);
  };

  const onSave = async (data) => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: data.name,
        bio: data.bio || '',
        favorite_team: data.favorite_team ? Number(data.favorite_team) : null,
      };
      const updatedProfile = await authService.updateProfile(payload);
      setProfile(updatedProfile);
      reset({
        name: updatedProfile.name || '',
        bio: updatedProfile.bio || '',
        favorite_team: updatedProfile.favorite_team?.id || '',
      });
      setEditing(false);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Profile update failed.'));
    } finally {
      setSaving(false);
    }
  };

  const onUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Requirement 3 & 4: Log file details to browser console before uploading
    const fileSizeBytes = file.size;
    const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
    console.log("Selected File Debugging Info:");
    console.log(`- Name: ${file.name}`);
    console.log(`- Type: ${file.type}`);
    console.log(`- Size: ${fileSizeBytes} bytes (${fileSizeMB} MB)`);
    console.log(`- Last Modified: ${file.lastModified} (${new Date(file.lastModified).toISOString()})`);

    // Requirement 5: Detect unsupported image formats (such as image/heic or image/heif)
    const fileType = (file.type || '').toLowerCase();
    const fileName = (file.name || '').toLowerCase();
    const isUnsupported = fileType === 'image/heic' || 
                          fileType === 'image/heif' || 
                          fileName.endsWith('.heic') || 
                          fileName.endsWith('.heif');
    
    if (isUnsupported) {
      const unsupportedMsg = "The selected image format (HEIC/HEIF) is not supported. Please convert it to a standard format (like JPEG, PNG, or WebP) and try again.";
      setError(unsupportedMsg);
      console.warn("Upload prevented: Unsupported image format (HEIC/HEIF).");
      event.target.value = '';
      return;
    }

    // Validate file size: hard block only if > 10 MB, but display 5 MB limit in user-facing error.
    const maxSizeBytes = 10 * 1024 * 1024; // 10 MB
    if (fileSizeBytes > maxSizeBytes) {
      const sizeMsg = `The selected file is too large (${fileSizeMB} MB). The maximum allowed size is 5 MB.`;
      setError(sizeMsg);
      console.warn(`Upload prevented: File size (${fileSizeMB} MB) exceeds the 10 MB hard limit (displayed 5 MB to user).`);
      event.target.value = '';
      return;
    }

    setUploading(true);
    setError('');
    try {
      const data = await authService.uploadProfileImage(file);
      setProfile((current) => ({
        ...current,
        profile_image: data.profile_image,
      }));
    } catch (err) {
      // Requirement 7: Improve error handling by logging full error, response body, and status code
      console.error("Complete Axios/fetch error during image upload:", err);
      if (err.response) {
        console.error("Server response body:", err.response.data);
        console.error("HTTP status code:", err.response.status);
      } else {
        console.error("No server response received (network/CORS/request setup error).");
      }
      setError(getApiErrorMessage(err, 'Image upload failed.'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* User Info Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-lg shadow-slate-200/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fffdf2]0/10 via-black/30 to-amber-400/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#fffdf2]/80 rounded-full translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-10 w-24 h-24 bg-amber-50/80 rounded-full translate-y-12"></div>

        {error && (
          <div className="relative mb-4 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs font-semibold text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div className="relative p-1.5 rounded-3xl bg-gradient-to-br from-blue-100 via-white to-amber-100 shadow-sm shrink-0">
            <img
              src={profileImage}
              alt={profile.name}
              className="w-24 h-24 rounded-2xl border border-white bg-slate-50 object-cover shadow-inner"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onUploadImage}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-lg shadow-black/20 disabled:opacity-60"
              title="Upload profile image"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center sm:text-left space-y-4 flex-1 min-w-0">
            {editing ? (
              <form onSubmit={handleSubmit(onSave)} className="space-y-3">
                <div>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-black"
                  />
                  {errors.name && <span className="mt-1 block text-[10px] text-red-500">{errors.name.message}</span>}
                </div>
                <textarea
                  rows={3}
                  placeholder="Short bio"
                  {...register('bio')}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-black"
                />
                <select
                  {...register('favorite_team')}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-black"
                >
                  <option value="">No favorite team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <div className="flex justify-center sm:justify-start gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight capitalize tracking-tight">{profile.name}</h2>
                    {profile.bio && <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{profile.bio}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
                  >
                    <Edit3 className="h-4 w-4" /> Edit
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-slate-500 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                    <Phone className="w-3.5 h-3.5 text-black" /> {profile.phone}
                  </span>
                  {profile.favorite_team && (
                    <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                      {favoriteTeamLogo ? (
                        <img
                          src={favoriteTeamLogo}
                          alt={profile.favorite_team.name}
                          className="h-4 w-4 rounded-full object-cover"
                        />
                      ) : (
                        <Star className="w-3.5 h-3.5 text-black" />
                      )}
                      {profile.favorite_team.name}
                    </span>
                  )}
                </div>
              </>
            )}

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
              <div className="w-14 h-14 bg-white border border-black/10 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <img
                  src={logoSrc}
                  alt="Club logo"
                  className="h-10 w-10 object-contain"
                />
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
          <>
            <div className="grid grid-cols-1 gap-4">
              {paginatedPredictions.map((pred) => (
                <PredictionCard key={pred.id} prediction={pred} />
              ))}
            </div>
            {predictionPageCount > 1 && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <button
                  type="button"
                  onClick={() => setPredictionPage((page) => Math.max(1, page - 1))}
                  disabled={safePredictionPage === 1}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs font-black text-slate-500">
                  Page {safePredictionPage} of {predictionPageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPredictionPage((page) => Math.min(predictionPageCount, page + 1))}
                  disabled={safePredictionPage === predictionPageCount}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
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
