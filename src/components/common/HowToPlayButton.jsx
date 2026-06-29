import { BookOpen, MessageCircle, Sparkles, Trophy, X } from 'lucide-react';
import { useState } from 'react';

export const HowToPlayButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-2xl border border-black/20 bg-black text-white shadow-xl shadow-black/20 transition active:scale-95 md:bottom-8"
        aria-label="How to play"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-w-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fffdf2] text-black">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-950">How to Play</h2>
                  <p className="text-xs font-medium text-slate-500">Pick scores. Win points.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Close guide"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-1 flex items-center gap-2 text-sm font-black text-slate-950">
                  <Sparkles className="h-4 w-4 text-black" /> About
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  Predict match scores before kickoff, compete with players in your club, and climb the leaderboard as results come in. Every match is a chance to show your football sense and earn points.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="mb-1 flex items-center gap-2 text-sm font-black text-slate-950">
                  <Trophy className="h-4 w-4 text-amber-500" /> Points
                </div>
                <p className="mb-3 text-xs leading-relaxed text-slate-600">
                  Score points based on how close your prediction is to the final result.
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-[#fffdf2] px-2 py-2">
                    <span className="block text-base font-black text-black">5</span>
                    <span className="text-[10px] font-bold text-slate-500">Exact score</span>
                  </div>
                  <div className="rounded-xl bg-emerald-50 px-2 py-2">
                    <span className="block text-base font-black text-emerald-700">3</span>
                    <span className="text-[10px] font-bold text-slate-500">Correct result</span>
                  </div>
                  <div className="rounded-xl bg-slate-100 px-2 py-2">
                    <span className="block text-base font-black text-slate-700">0</span>
                    <span className="text-[10px] font-bold text-slate-500">Wrong pick</span>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 text-[11px] font-medium leading-relaxed text-slate-500">
                  <p><span className="font-black text-slate-700">Exact score:</span> predict the full score correctly.</p>
                  <p><span className="font-black text-slate-700">Correct result:</span> predict win, draw, or loss correctly.</p>
                  <p><span className="font-black text-slate-700">Wrong pick:</span> no points.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HowToPlayButton;
