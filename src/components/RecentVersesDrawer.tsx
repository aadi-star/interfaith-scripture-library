import React from "react";
import { X, Trash2, History, ArrowRight } from "lucide-react";
import { RecentVerseItem, ReligionType } from "../types";

interface RecentVersesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recentVerses: RecentVerseItem[];
  onNavigateToVerse: (item: RecentVerseItem) => void;
  onClearHistory: () => void;
}

export const RecentVersesDrawer: React.FC<RecentVersesDrawerProps> = ({
  isOpen,
  onClose,
  recentVerses,
  onNavigateToVerse,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const getTraditionColorClass = (religion: ReligionType) => {
    switch (religion) {
      case "hinduism": return "from-amber-500 to-amber-400 text-amber-400 border-amber-500/20";
      case "islam": return "from-emerald-500 to-emerald-400 text-emerald-400 border-emerald-500/20";
      case "christianity": return "from-indigo-500 to-indigo-400 text-indigo-400 border-indigo-500/20";
      case "judaism": return "from-blue-500 to-blue-400 text-blue-400 border-blue-500/20";
      case "buddhism": return "from-rose-500 to-rose-400 text-rose-400 border-rose-500/20";
      case "jainism": return "from-orange-500 to-orange-400 text-orange-400 border-orange-500/20";
      case "mythology": return "from-violet-500 to-fuchsia-400 text-violet-400 border-violet-500/20";
      case "history": return "from-cyan-500 to-teal-400 text-cyan-400 border-cyan-500/20";
      case "space": return "from-fuchsia-500 to-pink-400 text-fuchsia-400 border-fuchsia-500/20";
      default: return "from-slate-500 to-slate-400 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div id="recent-verses-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        id="recent-verses-drawer-backdrop"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Sliding sheet */}
        <div
          id="recent-verses-drawer-content"
          className="w-screen max-w-md bg-[#0f0f13] border-l border-white/10 text-slate-200 flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#141419]">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold font-serif text-white tracking-wide">
                Recent Verses History
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader info & Clear history */}
          <div className="px-6 py-3 border-b border-white/5 bg-[#17171e] flex items-center justify-between text-xs text-slate-400">
            <span>Tracking the last 10 verses</span>
            {recentVerses.length > 0 && (
              <button
                id="clear-all-history-btn"
                onClick={onClearHistory}
                className="flex items-center space-x-1.5 text-red-400 hover:text-red-300 transition-colors font-mono cursor-pointer outline-none active:scale-95 px-2 py-1 rounded bg-red-500/5 hover:bg-red-500/10 border border-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Verses List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {recentVerses.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-500">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-slate-300 font-semibold text-sm">
                    No recent history yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                    Start exploring scripture verses, listening to audio, or taking notes in the Reader to populate your history.
                  </p>
                </div>
              </div>
            ) : (
              recentVerses.map((item, index) => {
                const colorConfig = getTraditionColorClass(item.religion);
                const colorBadgeBg = colorConfig.split(" ")[2]; // class index 2 is text-xxx
                const colorGradient = colorConfig.split(" ").slice(0, 2).join(" "); // first two classes

                return (
                  <div
                    id={`recent-item-${index}`}
                    key={`${item.bookKey}-${item.divisionNum}-${item.verseNumber}-${item.timestamp}`}
                    onClick={() => onNavigateToVerse(item)}
                    className="p-4 bg-white/[0.02] border border-white/5 hover:border-[#ffffff10] hover:bg-white/[0.04] rounded-xl transition-all duration-150 cursor-pointer group flex flex-col justify-between hover:shadow-lg shadow-black/10 active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className={`text-[10px] font-bold font-mono tracking-wider uppercase bg-${colorBadgeBg}-500/10 ${colorBadgeBg} px-2 py-0.5 rounded border border-${colorBadgeBg}-500/20`}>
                            {item.religion}
                          </span>
                          <span className="text-xs font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                            {item.bookTitle} {item.divisionNum}.{item.verseNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-1">
                          {item.divisionName} {item.divisionNum} &bull; Verse {item.verseNumber}
                        </p>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-black hover:scale-105 transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {(() => {
                      const isTranslHindi = /[\u0900-\u097F]/.test(item.translation || "");
                      return (
                        <p className={`text-xs text-slate-300 line-clamp-2 mt-2 border-t border-white/5 pt-2 ${
                          isTranslHindi 
                            ? "font-hindi !leading-[1.8] !tracking-normal py-0.5" 
                            : "font-serif italic leading-relaxed"
                        }`}>
                          &ldquo;{item.translation}&rdquo;
                        </p>
                      );
                    })()}

                    <div className="text-[9px] text-slate-500 font-mono text-right mt-2 mt-auto">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
