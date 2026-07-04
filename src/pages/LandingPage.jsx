import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Compass, Play, Phone, Linkedin, Instagram, Code2, Terminal } from 'lucide-react';
import pick2winLogo from '../assets/pick2winlogo.jpeg';

export const LandingPage = () => {
  const tournaments = [
    { name: 'FIFA World Cup', logo: '🏆', sport: 'Football', matches: '64 Matches' },
    { name: 'Champions League', logo: '⭐️', sport: 'Football', matches: '125 Matches' },
    { name: 'IPL (T20)', logo: '🏏', sport: 'Cricket', matches: '74 Matches' },
    { name: 'ISL League', logo: '⚽', sport: 'Football', matches: '110 Matches' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 h-16">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <img
              src={pick2winLogo}
              alt="Pick2Win Logo"
              className="h-10 w-auto rounded-xl border border-black/10 bg-white object-contain shadow-sm"
            />
            <span className="font-black tracking-tight">Pick2Win</span>
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

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-4 text-center max-w-4xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fffdf2] border border-black/10 text-[10px] font-black text-black uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 animate-pulse" /> Sports Prediction Platform
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

      {/* How It Works */}
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

      {/* Upcoming Tournaments */}
      <section className="py-16 max-w-5xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Upcoming Tournaments</h2>
            <p className="text-xs text-slate-500 mt-1">Predictions active across upcoming leagues.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tournaments.map((tour, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center flex flex-col items-center hover:shadow-md transition">
              <span className="text-3xl mb-3 block">{tour.logo}</span>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">{tour.name}</h4>
              <span className="text-[10px] text-slate-400 mt-1.5 block uppercase tracking-wider font-extrabold">{tour.matches}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 mt-auto font-sans border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side: Logo & SaaS Tagline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={pick2winLogo}
                  alt="Pick2Win Logo"
                  className="h-9 w-auto rounded-xl border border-white/10 bg-white object-contain shadow-sm"
                />
                <span className="font-black text-base tracking-tight text-white">Pick2Win</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                A Premium Multi-Club Sports Prediction SaaS
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                © {new Date().getFullYear()} Pick2Win. All rights reserved.
              </p>
            </div>

            {/* Right side: Developer Setup card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:max-w-sm md:ml-auto w-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-green-400" /> developer_environment
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-400" />
                  <span className="text-white font-bold text-sm">Muhammed Favas CV</span>
                </div>
                <div className="text-xs text-slate-455 font-mono pl-6 text-slate-400">
                  ~ python_fullstack_developer
                </div>
                
                <div className="pt-3 border-t border-slate-850 flex flex-col gap-2 pl-6 text-xs font-mono">
                  <a href="tel:7306656998" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> 7306656998
                  </a>
                  <div className="flex gap-4 mt-1">
                    <a 
                      href="https://in.linkedin.com/in/muhammed-favas-cv-3a397336a" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-slate-400" /> LinkedIn
                    </a>
                    <a 
                      href="https://www.instagram.com/fawaz__muhd?igsh=MWNzMGtjcHBxaWlzaQ%3D%3D&utm_source=qr" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                    >
                      <Instagram className="w-3.5 h-3.5 text-slate-400" /> Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
