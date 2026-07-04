import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import pick2winLogo from '../assets/pick2winlogo.jpeg';

export const AuthLayout = () => {
  const { user } = useAuth();

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'club_owner') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/user/home" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle sports pitch layout outlines in light grey */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-200/50 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-slate-200/50 rounded-full pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-slate-200/50 pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-3 mb-3">
            <img
              src={pick2winLogo}
              alt="Pick2Win"
              className="h-14 w-auto rounded-xl border border-black/10 bg-white object-contain shadow-sm"
            />
            <img
              src="/favicon.png"
              alt="Chase sideeqabad"
              className="h-14 w-auto rounded-xl border border-black/10 bg-white object-contain shadow-sm"
            />
          </Link>
          <span className="font-black tracking-tight text-2xl text-slate-900">
            Pick2Win
          </span>
          <p className="text-sports-gray text-xs font-semibold mt-1">
            Associated with Chase sideeqabad
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
