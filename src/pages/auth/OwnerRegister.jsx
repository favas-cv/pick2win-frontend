import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, User, Lock, Key, Home, Compass, MapPin, AlignLeft, UserPlus, AlertCircle } from 'lucide-react';
import PhoneInput from '../../components/common/PhoneInput';
import { stripPhoneSpaces } from '../../utils/phone';

export const OwnerRegister = () => {
  const { registerClubOwner } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await registerClubOwner({
        name: data.name,
        phone: stripPhoneSpaces(data.phone),
        password: data.password,
        password2: data.password2,
        club_name: data.club_name,
        slug: data.slug,
        place: data.place,
        description: data.description
      });
      navigate('/login/owner');
    } catch (err) {
      setError(
        err.response?.data
          ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(', ')
          : 'Registration failed. Please check inputs and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Club Register</h2>
        <p className="text-xs text-sports-gray mt-1 font-semibold">Register to start managing your club and predicting leagues.</p>
      </div>

      {error && (
        <div className="bg-red-50/80 border border-red-200 text-red-600 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Full Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Carlos Silva"
              {...register('name', { required: 'Name is required' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
          </div>
          {errors.name && <span className="text-[10px] text-red-500 block mt-1">{errors.name.message}</span>}
        </div>

        <PhoneInput register={register} errors={errors} />

        {/* Password */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="8 character password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' }
              })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sports-gray hover:text-slate-900"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <span className="text-[10px] text-red-500 block mt-1">{errors.password.message}</span>}
        </div>

        {/* Password 2 */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Confirm Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repeat 8 character password"
              {...register('password2', { required: 'Please confirm password' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sports-gray hover:text-slate-900"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password2 && <span className="text-[10px] text-red-500 block mt-1">{errors.password2.message}</span>}
        </div>

        {/* Club Name */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Club Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Home className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="CHASE ARTS AND SPORTS CLUB"
              {...register('club_name', { required: 'Club name is required' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
          </div>
          {errors.club_name && <span className="text-[10px] text-red-500 block mt-1">{errors.club_name.message}</span>}
        </div>

        {/* Slug */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Club Slug</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Compass className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="chase-sideeqabad"
              {...register('slug', { required: 'Slug is required' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
          </div>
          {errors.slug && <span className="text-[10px] text-red-500 block mt-1">{errors.slug.message}</span>}
        </div>

        {/* Place */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Location / Place</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <MapPin className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Sideeqabad"
              {...register('place', { required: 'Place/Location is required' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
          </div>
          {errors.place && <span className="text-[10px] text-red-500 block mt-1">{errors.place.message}</span>}
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Club Description</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 pt-3 text-sports-gray align-top">
              <AlignLeft className="w-4 h-4" />
            </span>
            <textarea
              placeholder="Tell us about the club..."
              rows={3}
              {...register('description', { required: 'Description is required' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
          </div>
          {errors.description && <span className="text-[10px] text-red-500 block mt-1">{errors.description.message}</span>}
        </div>

        <div className="bg-[#fffdf2] border border-black/10 text-[11px] text-black p-3 rounded-xl flex items-start gap-2 leading-relaxed">
          <Key className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> Upon registration, your owner account and club registration will be created instantly.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-zinc-800 disabled:opacity-50 text-white text-sm font-black py-3 rounded-xl transition shadow-lg shadow-black/10 flex items-center justify-center gap-1.5 active:scale-98"
        >
          <UserPlus className="w-4 h-4" /> Register Club
        </button>
      </form>

      <p className="text-xs text-sports-gray text-center font-semibold">
        Already have a club account?{' '}
        <Link to="/login/owner" className="text-black hover:underline font-bold">Club login</Link>
      </p>
    </div>
  );
};

export default OwnerRegister;
