import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import PhoneInput from '../../components/common/PhoneInput';
import { stripPhoneSpaces } from '../../utils/phone';
import { getApiErrorMessage } from '../../utils/apiError';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(stripPhoneSpaces(data.phone), data.password);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'club_owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/user/home');
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid phone or password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-xs text-sports-gray mt-1 font-semibold">Sign in to your Pick2Win account to pick and track scores.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PhoneInput
          register={register}
          errors={errors}
          inputClassName="bg-white border-slate-200 focus:border-sports-green"
        />

        {/* Password Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block">Password</label>
            <Link to="/forgot-password" className="text-[10px] text-sports-green hover:underline font-bold">Forgot password?</Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition"
            />
          </div>
          {errors.password && <span className="text-[10px] text-red-500 block mt-1">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sports-green hover:bg-sports-greenDark disabled:opacity-50 text-white text-sm font-black py-3 rounded-xl transition shadow-lg shadow-sports-green/10 flex items-center justify-center gap-1.5 active:scale-98"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <LogIn className="w-4 h-4" /> Sign In
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-sports-gray text-center font-semibold">
        Don't have an account?{' '}
        <Link to="/register" className="text-sports-green hover:underline font-bold">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
