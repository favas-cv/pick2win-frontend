import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Lock, Key, UserPlus, AlertCircle } from 'lucide-react';

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

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
        phone: data.phone,
        password1: data.password1,
        password2: data.password2,
        token: data.token
      });
      navigate('/login/user');
    } catch (err) {
      setError(err.response?.data?.token || err.response?.data?.non_field_errors || 'Registration failed. Please check inputs and try again.');
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
        <div className="bg-red-50/80 border border-red-200 text-red-650 text-xs p-3 rounded-xl flex items-center gap-2">
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
            />
          </div>
          {errors.name && <span className="text-[10px] text-red-500 block mt-1">{errors.name.message}</span>}
        </div>

        {/* Phone */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Phone Number</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Phone className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="+1234567890"
              {...register('phone', { required: 'Phone number is required' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
            />
          </div>
          {errors.phone && <span className="text-[10px] text-red-500 block mt-1">{errors.phone.message}</span>}
        </div>

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
              {...register('password1', { 
                required: 'Password is required', 
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
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
              placeholder="••••••••"
              {...register('password2', { 
                required: 'Please confirm password'
              })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
            />
          </div>
          {errors.token && <span className="text-[10px] text-red-500 block mt-1">{errors.token.message}</span>}
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
              <UserPlus className="w-4 h-4" /> Sign Up
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs space-y-2 font-semibold">
        <p className="text-sports-gray">
          Already have a user account?{' '}
          <Link to="/login/user" className="text-blue-600 hover:underline font-bold">Sign in here</Link>
        </p>
        <p className="text-sports-gray">
          Are you a club owner?{' '}
          <Link to="/register/owner" className="text-blue-600 hover:underline font-bold">Owner registration</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
