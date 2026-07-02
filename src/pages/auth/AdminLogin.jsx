import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import PhoneInput from '../../components/common/PhoneInput';
import { stripPhoneSpaces } from '../../utils/phone';
import { getApiErrorMessage } from '../../utils/apiError';

export const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await login(stripPhoneSpaces(data.phone), data.password, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid admin credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setValue('phone', '7306656998');
    setValue('password', 'admin123');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Admin Login</h2>
        <p className="text-xs text-sports-gray mt-1">Access the central system dashboard to verify scores and approve clubs.</p>
      </div>

      {error && (
        <div className="bg-red-50/80 border border-red-200 text-red-600 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
            />
          </div>
          {errors.password && <span className="text-[10px] text-red-500 block mt-1">{errors.password.message}</span>}
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
              <LogIn className="w-4 h-4" /> Sign In
            </>
          )}
        </button>
      </form>

      <div className="border-t border-slate-200 pt-4">
        <button
          onClick={handleQuickLogin}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition border border-slate-200"
        >
          Use Mock Admin Account
        </button>
      </div>

      <div className="text-center text-xs">
        <Link to="/" className="text-black hover:underline font-bold">Back to Landing Page</Link>
      </div>
    </div>
  );
};

export default AdminLogin;
