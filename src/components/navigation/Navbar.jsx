import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ClubSelector from '../club/ClubSelector';
import { Trophy, LogOut, LayoutDashboard, Home, Award, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  const getNavLinks = () => {
    if (user?.role === 'user' || user?.role === 'club_admin') {
      return [
        { path: '/user/home', label: 'Home', icon: Home },
        { path: '/user/tournaments', label: 'Tournaments', icon: Trophy },
        { path: '/user/leaderboard', label: 'Leaderboard', icon: Award },
        { path: '/user/profile', label: 'Profile', icon: User }
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 h-16">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Left Side: PRED-iT Logo & Club Selector */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 font-bold text-lg text-slate-900">
            <Trophy className="w-5 h-5 text-blue-600 fill-blue-600/10" />
            <span className="font-black tracking-tight">
              PRED<span className="text-blue-600">-iT</span>
            </span>
          </Link>

          {user && (user.role === 'user' || user.role === 'club_owner' || user.role === 'club_admin') && (
            <div className="border-l border-slate-200 pl-4">
              <ClubSelector />
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation */}
        {user && (user.role === 'user' || user.role === 'club_admin') && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `text-sm font-extrabold tracking-wide transition-colors py-2 px-1 border-b-2 ${
                    isActive
                      ? 'text-blue-600 border-blue-600'
                      : 'text-slate-500 border-transparent hover:text-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right Side: Account and Logout */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Profile info */}
              <div className="flex items-center gap-2">
                <Link to={user.role === 'user' ? '/user/profile' : '#'} className="flex items-center gap-2">
                  <img
                    src={user.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-250 bg-slate-100 object-cover"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">{user.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize font-bold leading-none">{user.role.replace('_', ' ')}</div>
                  </div>
                </Link>
              </div>

              {/* Quick links to dashboards */}
              {user.role === 'club_owner' && (
                <Link
                  to="/owner/dashboard"
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 p-1.5 rounded-xl border border-slate-200 transition"
                  title="Owner Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 p-1.5 rounded-xl border border-slate-200 transition"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
              )}

              <button
                onClick={logout}
                className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-50 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login/user"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
