import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ClubSelector from '../club/ClubSelector';
import pick2winLogo from '../../assets/pick2winlogo.jpeg';
import { Trophy, LayoutDashboard, Home, Award, User } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuth();
  const logoSrc = '/favicon.png';

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
        {/* Left Side: Pick2Win Logo & Club Selector */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 shrink-0">
            <img
              src={pick2winLogo}
              alt="Pick2Win"
              className="h-10 w-auto max-w-[132px] rounded-xl border border-black/10 bg-white object-contain shadow-sm"
            />
          </Link>

          {user && (user.role === 'user' || user.role === 'club_owner' || user.role === 'club_admin') && (
            <div className="border-l border-slate-200 pl-3 md:pl-4 min-w-0">
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
                      ? 'text-black border-blue-600'
                      : 'text-slate-500 border-transparent hover:text-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right Side: Utilities */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
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

            </>
          ) : (
            <Link
              to="/login/user"
              className="bg-black hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Sign In
            </Link>
          )}
          <img
            src={logoSrc}
            alt="Pick2Win logo"
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white object-contain p-1 shadow-sm"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
