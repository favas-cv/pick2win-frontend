import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Key, UserPlus, AlertCircle } from 'lucide-react';

export const OwnerRegister = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password, 'club_owner');
      navigate('/owner/dashboard');
    } catch (err) {
      setError('Registration failed. Please check inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Owner Registration</h2>
        <p className="text-xs text-sports-gray mt-1">Register to start managing your own club and predicting leagues.</p>
      </div>

      {error && (
        <div className="bg-red-50/80 border border-red-200 text-red-650 text-xs p-3 rounded-xl flex items-center gap-2">
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
            />
          </div>
          {errors.name && <span className="text-[10px] text-red-500 block mt-1">{errors.name.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              placeholder="owner@brazilfans.com"
              {...register('email', { required: 'Email is required' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
            />
          </div>
          {errors.email && <span className="text-[10px] text-red-500 block mt-1">{errors.email.message}</span>}
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
              {...register('password', { 
                required: 'Password is required', 
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition"
            />
          </div>
          {errors.password && <span className="text-[10px] text-red-500 block mt-1">{errors.password.message}</span>}
        </div>

        <div className="bg-blue-50 border border-blue-100 text-[11px] text-blue-600 p-3 rounded-xl flex items-start gap-2 leading-relaxed">
          <Key className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> Upon registration, your owner account is set to **Pending Approval**. You must be approved by a system administrator to manage tournaments.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-750 disabled:opacity-50 text-white text-sm font-black py-3 rounded-xl transition shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 active:scale-98"
        >
          <UserPlus className="w-4 h-4" /> Request Club Ownership
        </button>
      </form>

      <p className="text-xs text-sports-gray text-center font-semibold">
        Already have an owner account?{' '}
        <Link to="/login/owner" className="text-blue-600 hover:underline font-bold">Sign in here</Link>
      </p>
    </div>
  );
};

export default OwnerRegister;
