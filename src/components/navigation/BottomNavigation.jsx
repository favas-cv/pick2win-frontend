import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, Award, User } from 'lucide-react';

export const BottomNavigation = () => {
  const tabs = [
    { path: '/user/home', label: 'Home', icon: Home },
    { path: '/user/tournaments', label: 'Tournaments', icon: Trophy },
    { path: '/user/leaderboard', label: 'Leaderboard', icon: Award },
    { path: '/user/profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 pb-safe shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                isActive
                  ? 'text-black'
                  : 'text-slate-400 hover:text-slate-700'
              }`
            }
          >
            <Icon className="w-5.5 h-5.5 transition-transform duration-150 active:scale-90" />
            <span className="text-[10px] font-bold tracking-wider">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
