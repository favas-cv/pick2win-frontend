import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ShieldCheck, Zap, Award, ArrowRight, Play, Compass } from 'lucide-react';

export const LandingPage = () => {
  const tournaments = [
    { name: 'FIFA World Cup', logo: '🏆', sport: 'Football', matches: '64 Matches' },
    { name: 'Champions League', logo: '⭐️', sport: 'Football', matches: '125 Matches' },
    { name: 'IPL (T20)', logo: '🏏', sport: 'Cricket', matches: '74 Matches' },
    { name: 'ISL League', logo: '⚽', sport: 'Football', matches: '110 Matches' }
  ];

  const leaders = [
    { rank: 1, name: 'Lucas Silva', points: 195, accuracy: 78, logo: '🇧🇷' },
    { rank: 2, name: 'Beatriz Costa', points: 182, accuracy: 72, logo: '🇪🇸' },
    { rank: 3, name: 'Thiago Santos', points: 176, accuracy: 68, logo: '👹' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Top Navigation */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 h-16">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-lg text-slate-900">
            <Trophy className="w-5 h-5 text-black fill-black/10" />
            <span className="font-black tracking-tight">
              PRED<span className="text-black">-iT</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/login/user" 
              className="text-xs font-extrabold text-slate-600 hover:text-slate-900 transition px-2.5 py-2"
            >
              User Login
            </Link>
            <Link 
              to="/login/owner" 
              className="text-xs font-extrabold text-slate-600 hover:text-slate-900 transition px-2.5 py-2"
            >
              Owner Login
            </Link>
            <Link 
              to="/register" 
              className="bg-black hover:bg-zinc-800 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-lg shadow-black/10 active:scale-95"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-20 md:py-28 px-4 text-center max-w-4xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fffdf2] border border-black/10 text-[10px] font-black text-black uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 animate-pulse" /> Sports Prediction SaaS
        </span>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-sans text-slate-900 leading-[1.08] tracking-tight">
          Predict Scores.<br />
          <span className="text-black">Compete With Friends.</span><br />
          Climb The Leaderboard.
        </h1>
        
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          Join club leagues, predict exact scorelines, accumulate accuracy points, and rank above your peers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
          <Link
            to="/login/user"
            className="bg-black hover:bg-zinc-800 text-white text-xs font-black px-6 py-3 rounded-xl transition shadow-xl shadow-black/10 flex items-center gap-1.5 active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" /> Start Predicting
          </Link>
          <Link
            to="/register"
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-black px-6 py-3 rounded-xl transition flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" /> Explore Clubs
          </Link>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-slate-900">How It Works</h2>
            <p className="text-xs text-slate-500 mt-1">Start playing and earning score standings in 4 easy steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Join a Club', desc: 'Join using invite links or referral tokens.' },
              { step: '02', title: 'Predict Scores', desc: 'Input scores before the match kickoff lock.' },
              { step: '03', title: 'Earn Points', desc: 'Get points for correct scores and winner outcomes.' },
              { step: '04', title: 'Top Leaderboard', desc: 'Rise to the top of your club rankings.' }
            ].map((item, idx) => (
              <div key={idx} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 relative overflow-hidden">
                <span className="text-3xl font-black text-black/10 absolute right-4 top-2 font-mono">{item.step}</span>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Tournaments Preview */}
      <section className="py-16 max-w-5xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Featured Tournaments</h2>
            <p className="text-xs text-slate-500 mt-1">Predictions active across top leagues.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tournaments.map((tour, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center flex flex-col items-center">
              <span className="text-3xl mb-3 block">{tour.logo}</span>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">{tour.name}</h4>
              <span className="text-[10px] text-slate-400 mt-1.5 block uppercase tracking-wider font-extrabold">{tour.matches}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Leaderboard Preview */}
      <section className="bg-slate-100/50 py-16 border-t border-slate-200">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Leaderboard Rankings</h2>
            <p className="text-xs text-slate-500 mt-1">Review the top predictors on the network.</p>
          </div>

          <div className="space-y-2.5">
            {leaders.map((userRank) => (
              <div 
                key={userRank.rank} 
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-400 w-4 text-center">#{userRank.rank}</span>
                  <span className="text-xl">{userRank.logo}</span>
                  <span className="text-xs font-bold text-slate-900">{userRank.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-black block">{userRank.points} pts</span>
                  <span className="text-[9px] text-slate-400 font-bold block">{userRank.accuracy}% Accuracy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-bold text-base text-slate-900">
              PRED<span className="text-black">-iT</span>
            </div>
            <p className="text-[10px] text-slate-400">© 2026 PRED-iT Inc. All rights reserved.</p>
          </div>

          <div className="flex gap-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
            <Link to="/login/user" className="hover:text-black">User Login</Link>
            <Link to="/login/owner" className="hover:text-black">Owner Login</Link>
            <Link to="/login/admin" className="hover:text-black">Admin Login</Link>
            <Link to="/register" className="hover:text-black">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
