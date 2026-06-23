import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const UserLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await login(data.email, data.password, 'user');
      navigate('/user/home');
    } catch (err) {
      setError('Invalid user credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setValue('email', 'john.doe@gmail.com');
    setValue('password', 'user123');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">User Login</h2>
        <p className="text-xs text-sports-gray mt-1">Sign in to predict scores and track standup ratings.</p>
      </div>

      {error && (
        <div className="bg-red-50/80 border border-red-200 text-red-650 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
            />
          </div>
          {errors.email && <span className="text-[10px] text-red-500 block mt-1">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block">Password</label>
            <Link to="/forgot-password" className="text-[10px] text-blue-600 hover:underline font-bold">Forgot password?</Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
            />
          </div>
          {errors.password && <span className="text-[10px] text-red-500 block mt-1">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-750 disabled:opacity-50 text-white text-sm font-black py-3 rounded-xl transition shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 active:scale-98"
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

      {/* Quick login */}
      <div className="border-t border-slate-200 pt-4">
        <button
          onClick={handleQuickLogin}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition border border-slate-200"
        >
          Use Mock User Account
        </button>
      </div>

      <div className="text-center text-xs space-y-2">
        <p className="text-sports-gray">
          Are you a club owner?{' '}
          <Link to="/login/owner" className="text-blue-600 hover:underline font-bold">Owner login</Link>
        </p>
        <p className="text-sports-gray">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-bold">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
