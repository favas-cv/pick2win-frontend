import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(data.email, data.password);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'club_owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/user/home');
      }
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick login helper
  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setValue('email', 'admin@predictionpro.com');
      setValue('password', 'admin123');
    } else if (role === 'owner') {
      setValue('email', 'owner@brazilfans.com');
      setValue('password', 'owner123');
    } else {
      setValue('email', 'john.doe@gmail.com');
      setValue('password', 'user123');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Welcome back</h2>
        <p className="text-xs text-sports-gray mt-1">Sign in to your account to predict and track scores.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              placeholder="example@mail.com"
              {...register('email', { required: 'Email is required' })}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:border-sports-green focus:outline-none transition"
            />
          </div>
          {errors.email && <span className="text-[10px] text-red-500 block mt-1">{errors.email.message}</span>}
        </div>

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
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:border-sports-green focus:outline-none transition"
            />
          </div>
          {errors.password && <span className="text-[10px] text-red-500 block mt-1">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sports-green hover:bg-sports-greenDark disabled:opacity-50 text-black text-sm font-black py-3 rounded-xl transition shadow-lg shadow-sports-green/10 flex items-center justify-center gap-1.5 active:scale-98"
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

      {/* Quick Login Section */}
      <div className="border-t border-slate-850 pt-4">
        <span className="text-[9px] font-black text-sports-gray uppercase tracking-wider block text-center mb-2.5">
          Or Quick Test Accounts
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickLogin('user')}
            className="bg-slate-900 hover:bg-slate-850 text-slate-300 text-[10px] font-bold py-2 rounded-xl border border-slate-800 transition"
          >
            User
          </button>
          <button
            onClick={() => handleQuickLogin('owner')}
            className="bg-slate-900 hover:bg-slate-855 text-slate-300 text-[10px] font-bold py-2 rounded-xl border border-slate-800 transition"
          >
            Owner
          </button>
          <button
            onClick={() => handleQuickLogin('admin')}
            className="bg-slate-900 hover:bg-slate-855 text-slate-300 text-[10px] font-bold py-2 rounded-xl border border-slate-800 transition"
          >
            Admin
          </button>
        </div>
      </div>

      <p className="text-xs text-sports-gray text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-sports-green hover:underline font-bold">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
