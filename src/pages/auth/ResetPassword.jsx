import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, KeyRound, RotateCw } from 'lucide-react';
import authService from '../../services/authService';
import { getApiErrorMessage } from '../../utils/apiError';

export const ResetPassword = () => {
  const { token: urlToken } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: {
      token: urlToken || '',
      password: '',
      passwordConfirm: '',
    }
  });

  // Sync urlToken with form state when URL parameter changes
  useEffect(() => {
    if (urlToken) {
      setValue('token', urlToken);
    }
  }, [urlToken, setValue]);

  const onSubmit = async (data) => {
    setApiError('');
    setLoading(true);

    try {
      await authService.resetPassword({
        token: data.token,
        password: data.password,
      });
      setSuccess(true);
      window.setTimeout(() => navigate('/login/user'), 2000);
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Could not reset your password. The token may be invalid, expired, or already used.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Reset password</h2>
        <p className="text-xs text-sports-gray mt-1 font-semibold">Enter your token and new password below.</p>
      </div>

      {apiError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {success ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password reset successfully!</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Your password has been updated. Redirecting to the login page...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Reset Token</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Enter password reset token"
                disabled={loading}
                {...register('token', {
                  required: 'Reset token is required'
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
              />
            </div>
            {errors.token && (
              <span className="text-[10px] text-red-500 font-semibold">{errors.token.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                disabled={loading}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
              />
              <button
                type="button"
                tabIndex="-1"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[10px] text-red-500 font-semibold">{errors.password.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                disabled={loading}
                {...register('passwordConfirm', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match'
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none transition"
              />
              <button
                type="button"
                tabIndex="-1"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.passwordConfirm && (
              <span className="text-[10px] text-red-500 font-semibold">{errors.passwordConfirm.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white text-xs font-bold py-3.5 rounded-xl hover:bg-slate-900 transition flex items-center justify-center gap-1.5 shadow-md shadow-black/10 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Resetting...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-slate-100">
        <Link to="/login/user" className="text-xs text-slate-500 hover:text-black font-bold inline-flex items-center gap-1">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
