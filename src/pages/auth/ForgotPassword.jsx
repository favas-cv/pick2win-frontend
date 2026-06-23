import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ChevronLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Reset password</h2>
        <p className="text-xs text-sports-gray mt-1 font-semibold">We will send instructions to restore your account access.</p>
      </div>

      {success ? (
        <div className="space-y-4">
          <div className="bg-sports-green/10 border border-sports-green/20 text-sports-green text-xs p-4 rounded-xl flex items-start gap-2.5 leading-relaxed">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold block text-sm">Reset link sent!</span>
              We have emailed you instructions to reset your password. Please check your inbox.
            </div>
          </div>
          <Link
            to="/login"
            className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sports-green hover:bg-sports-greenDark disabled:opacity-50 text-black text-sm font-black py-3 rounded-xl transition shadow-lg shadow-sports-green/10 flex items-center justify-center gap-1.5 active:scale-98"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <Link
            to="/login"
            className="w-full border border-slate-800 hover:bg-slate-900 text-sports-gray hover:text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
