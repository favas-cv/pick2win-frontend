import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Key, UserPlus, AlertCircle } from 'lucide-react';
import PhoneInput from '../../components/common/PhoneInput';
import { stripPhoneSpaces } from '../../utils/phone';
import { getApiErrorMessage } from '../../utils/apiError';

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ mode: 'onChange' });

  useEffect(() => {
    const inviteParam = searchParams.get('invite') || searchParams.get('token');
    if (inviteParam) {
      setValue('token', inviteParam);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await registerUser({
        name: data.name,
        phone: stripPhoneSpaces(data.phone),
        password: data.password1,
        token: data.token
      });
      navigate('/user/home');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed. Please check inputs and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">User Registration</h2>
        <p className="text-xs text-sports-gray mt-1 font-semibold">Join PRED-iT and start predicting match scores.</p>
      </div>

      {error && (
        <div className="bg-red-50/80 border border-red-200 text-red-600 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{typeof error === 'object' ? JSON.stringify(error) : error}</span>
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
              placeholder="John Doe"
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
              type="password"
              placeholder="8 character simple password"
              {...register('password1', { 
                required: 'Password is required', 
                minLength: { value: 8, message: 'Password must be at least 8 characters' }
              })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
          </div>
          {errors.password1 && <span className="text-[10px] text-red-500 block mt-1">{errors.password1.message}</span>}
        </div>

        {/* Password 2 */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Confirm Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              placeholder="Repeat the 8 character password"
              {...register('password2', { 
                required: 'Please confirm password',
                validate: (value) => value === watch('password1') || 'Passwords do not match'
              })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
          </div>
          {errors.password2 && <span className="text-[10px] text-red-500 block mt-1">{errors.password2.message}</span>}
        </div>

        {/* Invite Token */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">
            Club Invite Code / Registration Token
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Key className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="e.g. BRAZIL10"
              {...register('token', { required: 'Invite Token is required to register' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
          </div>
          {errors.token && <span className="text-[10px] text-red-500 block mt-1">{errors.token.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-zinc-800 disabled:opacity-50 text-white text-sm font-black py-3 rounded-xl transition shadow-lg shadow-black/10 flex items-center justify-center gap-1.5 active:scale-98"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Sign Up
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs space-y-2 font-semibold">
        <p className="text-sports-gray">
          Already have a user account?{' '}
          <Link to="/login/user" className="text-black hover:underline font-bold">Sign in here</Link>
        </p>
        <p className="text-sports-gray">
          Are you a club owner?{' '}
          <Link to="/register/owner" className="text-black hover:underline font-bold">Owner registration</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
