import React, { useState } from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import { 
  LayoutDashboard, Users, Link2, Trophy, Award, History, 
  Menu, X, LogOut, ChevronLeft, ChevronRight, Club, ShieldAlert 
} from 'lucide-react';

export const OwnerLayout = () => {
  const { user, logout, loading } = useAuth();
  const { activeClub } = useClub();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login/owner" replace />;
  }

  if (user.role !== 'club_owner') {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/user/home" replace />;
  }

  // 1. "Waiting For Admin Approval" screen block
  if (user.status === 'Pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Waiting for Admin Approval</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Your club owner request is currently pending. You will gain access to the dashboard once an administrator approves your account status.
            </p>
          </div>
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Status: <span className="text-amber-500">Pending Review</span>
          </div>
          <button
            onClick={logout}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl border border-slate-200 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { path: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/owner/members', label: 'Members Directory', icon: Users },
    { path: '/owner/invite', label: 'Invite Settings', icon: Link2 },
    { path: '/owner/tournaments', label: 'Tournament Selection', icon: Trophy },
    { path: '/owner/leaderboard', label: 'Leaderboard Board', icon: Award },
    { path: '/owner/history', label: 'Match History', icon: History }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200 z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <Club className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-sm text-slate-900 truncate max-w-[150px]">
            {activeClub?.name || 'Club Owner'}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-slate-400 hover:text-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-50 z-20 flex flex-col p-4 border-t border-slate-200">
          <div className="flex-1 flex flex-col gap-2">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3.5 mt-auto text-red-500 hover:bg-red-50 rounded-xl font-semibold transition border border-transparent hover:border-red-100"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Desktop Sidebar (Light system) */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 relative z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-850 border border-slate-200 rounded-full p-1 shadow-sm"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        <div className={`p-6 border-b border-slate-200 flex items-center gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <Club className="w-6 h-6 text-blue-600 shrink-0" />
          {!sidebarCollapsed && (
            <div className="truncate">
              <h2 className="font-extrabold text-sm text-slate-900 truncate">{activeClub?.name || 'Club Owner'}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Club Administration</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                } ${sidebarCollapsed ? 'justify-center' : ''}`
              }
              title={label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={`p-4 border-t border-slate-200 flex flex-col gap-2 ${sidebarCollapsed ? 'items-center' : ''}`}>
          {!sidebarCollapsed && user && (
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <img
                src={user.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-slate-200"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[9px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-red-500 rounded-xl text-sm font-semibold transition ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl w-full mx-auto page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OwnerLayout;
