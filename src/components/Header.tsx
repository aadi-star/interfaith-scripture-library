/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookOpen, HelpCircle, Loader2, Key, Info, Library, LogIn, Sun, Moon, Flame, Wifi, WifiOff, Highlighter, Target, Trophy, CheckCircle2, Settings, Plus, Minus, BookOpenCheck, Palette, ChevronDown } from "lucide-react";
import { User } from "firebase/auth";
import { SACRED_FESTIVALS_DATA, FESTIVAL_DATES_2026 } from "../festivalsData";

interface HeaderProps {
  onShowHelp: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  paperColor: "cream" | "sepia" | "slate";
  onPaperColorChange: (color: "cream" | "sepia" | "slate") => void;
  myReminders?: string[];
  onSelectActiveFast?: (id: string) => void;
  offlineMode: boolean;
  onToggleOfflineMode: (enabled: boolean) => void;
  activeHighlightColor: string;
  onActiveHighlightColorChange: (color: string) => void;
  studyGoalType: "minutes" | "chapters";
  studyGoalTarget: number;
  todayMinutesStudied: number;
  todayChaptersStudied: number;
  onUpdateStudyGoal: (type: "minutes" | "chapters", target: number) => void;
  onLogManualStudy: (type: "minutes" | "chapters", value: number) => void;
  readingPreset?: "mystic-dark" | "midnight-monastic" | "morning-sun" | "parchment" | "cosmic-mono";
  onPresetChange?: (preset: "mystic-dark" | "midnight-monastic" | "morning-sun" | "parchment" | "cosmic-mono") => void;
  isZenReader?: boolean;
  onToggleZenReader?: (enabled: boolean) => void;
}

// Helper date calculation relative to 2026
function getDaysUntilToday(dateStr: string): number {
  if (!dateStr || dateStr.length !== 8) return 999;
  try {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    
    const targetDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 999;
  }
}


export default function Header({ 
  onShowHelp, 
  user, 
  onLogin, 
  onLogout,
  theme,
  onToggleTheme,
  paperColor,
  onPaperColorChange,
  myReminders = [],
  onSelectActiveFast,
  offlineMode,
  onToggleOfflineMode,
  activeHighlightColor,
  onActiveHighlightColorChange,
  studyGoalType,
  studyGoalTarget,
  todayMinutesStudied,
  todayChaptersStudied,
  onUpdateStudyGoal,
  onLogManualStudy,
  readingPreset = "mystic-dark",
  onPresetChange,
  isZenReader = false,
  onToggleZenReader
}: HeaderProps) {
  const [configStatus, setConfigStatus] = useState<{ hasApiKey: boolean; appUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  const activeFasts = myReminders.map(id => {
    const dates = FESTIVAL_DATES_2026[id];
    const fast = SACRED_FESTIVALS_DATA.find(f => f.id === id);
    if (!dates || !fast) return null;
    const daysUntil = getDaysUntilToday(dates.start);
    return { fast, daysUntil };
  }).filter((item): item is { fast: any; daysUntil: number } => item !== null && item.daysUntil === 0);


  useEffect(() => {
    let active = true;
    const fetchWithRetry = async (retries = 4, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch("/api/config");
          if (!res.ok) throw new Error(`HTTP status ${res.status}`);
          const data = await res.json();
          if (active) {
            setConfigStatus(data);
            setLoading(false);
          }
          return;
        } catch (err) {
          if (i === retries - 1) {
            console.error("Failed to load config status:", err);
            if (active) {
              setLoading(false);
            }
          } else {
            // Wait with backoff before next attempt
            await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
          }
        }
      }
    };
    fetchWithRetry();
    return () => {
      active = false;
    };
  }, []);

  const currentProgress = studyGoalType === "minutes" ? todayMinutesStudied : todayChaptersStudied;
  const target = studyGoalTarget;
  const percent = Math.min(100, Math.round((currentProgress / (target || 1)) * 100));
  const isCompleted = currentProgress >= target;

  return (
    <header className="border-b border-white/10 bg-[#08080a]/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-amber-600 to-amber-400 text-black p-2 rounded-lg shadow-lg shadow-amber-900/10">
              <Library className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-display font-bold tracking-tight text-white leading-none">
                Interfaith Scripture Academy
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-500/85 font-mono mt-0.5 tracking-wide">
                Dynamic Academic Scripture Reader & Comparison Index
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Active Fast Status Widget */}
            {activeFasts.length > 0 && (
              <button
                id="active-fast-header-widget"
                onClick={() => onSelectActiveFast && onSelectActiveFast(activeFasts[0].fast.id)}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/5 hover:from-amber-500/25 border border-amber-500/30 hover:border-amber-500/50 px-2.5 py-1 sm:py-1.5 rounded-xl transition-all duration-300 animate-fade-in cursor-pointer select-none"
                title={`${activeFasts[0].fast.name} is active today! Click to inspect customs, scripture, and preparation tips.`}
              >
                <span className="relative flex h-2 w-2 min-w-[8px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[8px] uppercase font-mono tracking-wider text-amber-400 font-extrabold leading-none">
                    Fast Today
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold text-white truncate max-w-[84px] sm:max-w-[130px] leading-tight">
                    {activeFasts[0].fast.name}
                  </span>
                </div>
              </button>
            )}

            {/* API Status Badge */}
            <div className="hidden md:flex items-center">
              {loading ? (
                <span className="flex items-center space-x-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking Core...</span>
                </span>
              ) : configStatus?.hasApiKey ? (
                <span className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full animate-fade-in">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span>AI Scholar: Ready</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                  <Key className="w-3.5 h-3.5" />
                  <span>Demo Mode</span>
                </span>
              )}
            </div>

            {/* Daily Study Goal Tracker Widget */}
            <div className="relative z-50" id="daily-study-goal-widget">
              <button
                onClick={() => setShowGoalDropdown(!showGoalDropdown)}
                className={`flex items-center space-x-2 bg-gradient-to-r ${
                  isCompleted 
                    ? "from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border-emerald-500/40 hover:from-emerald-500/25" 
                    : "from-amber-500/15 via-yellow-500/10 to-amber-500/5 hover:from-amber-500/25 border-amber-500/20 hover:border-amber-500/40"
                } border px-2.5 py-1 sm:py-1.5 rounded-xl transition-all duration-300 animate-fade-in cursor-pointer select-none outline-none`}
                title={`Daily study goal progress: ${currentProgress}/${target} ${studyGoalType}. Click to configure or manually log progress.`}
              >
                {isCompleted ? (
                  <Trophy className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-bounce" />
                ) : (
                  <Target className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                )}
                <div className="flex flex-col text-left">
                  <span className={`text-[8px] uppercase font-mono tracking-wider ${isCompleted ? "text-emerald-400 font-extrabold" : "text-amber-400 font-bold"} leading-none`}>
                    {isCompleted ? "Goal Completed!" : "Daily Study Goal"}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold text-white leading-tight flex items-center space-x-1">
                    <span>
                      {currentProgress} / {target} {studyGoalType === "minutes" ? "mins" : "ch"}
                    </span>
                    <span className="text-slate-400 text-[9px] font-normal font-mono">
                      ({percent}%)
                    </span>
                  </span>
                </div>
                {/* Micro Mini circular progress indicator */}
                <div className="w-4 h-4 relative shrink-0 hidden xs:block">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      className="stroke-white/10"
                      strokeWidth="2"
                      fill="transparent"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      className={`${isCompleted ? "stroke-emerald-400" : "stroke-amber-400"} transition-all duration-500`}
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={38}
                      strokeDashoffset={38 - (38 * percent) / 100}
                    />
                  </svg>
                </div>
              </button>

              {/* Goal customizer dropdown */}
              {showGoalDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowGoalDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-[#0e0e12]/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl z-50 animate-slide-up space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <Target className="w-4 h-4 text-amber-500" />
                        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Configure Target</h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                        Daily Goal
                      </span>
                    </div>

                    {/* Choose Goal Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Goal Metric</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            onUpdateStudyGoal("minutes", studyGoalType === "chapters" ? 15 : studyGoalTarget);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                            studyGoalType === "minutes"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold"
                              : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          <Target className="w-3.5 h-3.5" />
                          <span>Minutes</span>
                        </button>
                        <button
                          onClick={() => {
                            onUpdateStudyGoal("chapters", studyGoalType === "minutes" ? 2 : studyGoalTarget);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                            studyGoalType === "chapters"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold"
                              : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          <BookOpenCheck className="w-3.5 h-3.5" />
                          <span>Chapters</span>
                        </button>
                      </div>
                    </div>

                    {/* Target Count Customizer */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Target Value</label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateStudyGoal(studyGoalType, Math.max(1, studyGoalTarget - (studyGoalType === "minutes" ? 5 : 1)))}
                          className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 rounded-lg active:scale-95 transition-all cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-center text-sm font-bold text-white font-mono">
                          {studyGoalTarget} {studyGoalType === "minutes" ? "mins" : "chapters"}
                        </div>
                        <button
                          onClick={() => onUpdateStudyGoal(studyGoalType, studyGoalTarget + (studyGoalType === "minutes" ? 5 : 1))}
                          className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 rounded-lg active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Manual Study Log Widget */}
                    <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Log Offline Study</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500/70" />
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal">Studied offline or with physical books today? Add manual progress:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onLogManualStudy("minutes", 5)}
                          className="py-1 px-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-500/35 text-emerald-400 rounded-lg text-[9px] font-mono font-bold tracking-wide cursor-pointer transition-all flex items-center justify-center space-x-1"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>+5 Mins</span>
                        </button>
                        <button
                          onClick={() => onLogManualStudy("chapters", 1)}
                          className="py-1 px-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-500/35 text-emerald-400 rounded-lg text-[9px] font-mono font-bold tracking-wide cursor-pointer transition-all flex items-center justify-center space-x-1"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>+1 Ch</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-500 text-center font-mono pt-1 leading-normal">
                      {isCompleted 
                        ? "🌟 Divine study commitment met! Beautiful job!" 
                        : "📖 Your daily wisdom journey continues."}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Google Authentication Control */}
            {user ? (
              <div className="flex items-center space-x-2.5 bg-white/[0.04] border border-white/10 px-2.5 py-1.5 rounded-xl">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg pointer-events-none"
                  />
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-bold text-xs rounded-lg uppercase">
                    {(user.displayName || user.email || "U").substring(0, 1)}
                  </div>
                )}
                <span className="hidden sm:inline text-xs text-white/90 max-w-[100px] truncate">
                  {user.displayName || "Scholar"}
                </span>
                <button
                  onClick={onLogout}
                  className="text-[10px] uppercase font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer border border-transparent outline-none hover:underline"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-black px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-900/10 cursor-pointer outline-none select-none border-none shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Sign In</span>
              </button>
            )}

            {/* Paper Selection (only in light mode) */}
            {theme === "light" && (
              <div className="flex items-center gap-1.5 bg-[#f1ede1] border border-[#d2c9b4] p-1 rounded-lg animate-fade-in select-none">
                <button
                  onClick={() => onPaperColorChange("cream")}
                  className={`w-3.5 h-3.5 rounded-full bg-[#fbf9f4] border transition-all cursor-pointer ${
                    paperColor === "cream" ? "ring-2 ring-amber-600 scale-110 border-amber-600" : "border-slate-300"
                  }`}
                  title="Cream Paper"
                />
                <button
                  onClick={() => onPaperColorChange("sepia")}
                  className={`w-3.5 h-3.5 rounded-full bg-[#f2e6c9] border transition-all cursor-pointer ${
                    paperColor === "sepia" ? "ring-2 ring-amber-700 scale-110 border-amber-700" : "border-slate-300"
                  }`}
                  title="Sepia Parchment"
                />
                <button
                  onClick={() => onPaperColorChange("slate")}
                  className={`w-3.5 h-3.5 rounded-full bg-[#e5e9f0] border transition-all cursor-pointer ${
                    paperColor === "slate" ? "ring-2 ring-slate-600 scale-110 border-slate-600" : "border-slate-300"
                  }`}
                  title="Slate/Silver Paper"
                />
              </div>
            )}

            {/* Offline Mode Toggle and Indicator */}
            <button
              id="offline-mode-toggle"
              onClick={() => onToggleOfflineMode(!offlineMode)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors border outline-none shrink-0 flex items-center gap-1.5 cursor-pointer text-xs font-mono font-bold ${
                offlineMode
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20"
              }`}
              title={offlineMode ? "Offline Mode is active. Click to go online." : "Go offline to disable server calls and save bandwidth."}
            >
              {offlineMode ? (
                <>
                  <WifiOff className="w-4 h-4 text-rose-400" />
                  <span className="hidden xs:inline">Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="hidden xs:inline text-slate-300">Online</span>
                </>
              )}
            </button>

            {/* Custom Highlight Color Control */}
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl text-xs shrink-0 select-none" id="header-highlight-customizer">
              <Highlighter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="hidden lg:inline text-slate-400 font-mono text-[10px] uppercase tracking-wide">
                Highlight:
              </span>
              <div className="flex items-center space-x-1.5 animate-fade-in">
                {[
                  { name: "Gold", hex: "#f59e0b" },
                  { name: "Emerald", hex: "#10b981" },
                  { name: "Sky", hex: "#0ea5e9" },
                  { name: "Amethyst", hex: "#a855f7" },
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => onActiveHighlightColorChange(preset.hex)}
                    className={`w-3.5 h-3.5 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer border ${
                      activeHighlightColor.toLowerCase() === preset.hex.toLowerCase() 
                        ? "ring-2 ring-white border-black" 
                        : "border-white/10"
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={`Set active highlight to ${preset.name}`}
                  />
                ))}
                
                {/* Custom Color Picker input wrapper */}
                <div className="relative flex items-center justify-center w-5 h-5 rounded-md hover:bg-white/5 transition-all">
                  <input
                    type="color"
                    value={activeHighlightColor}
                    onChange={(e) => onActiveHighlightColorChange(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Choose a custom active highlight color"
                  />
                  <div 
                    className={`w-3.5 h-3.5 rounded-full border hover:scale-110 transition-all ${
                      ![
                        "#f59e0b", 
                        "#10b981", 
                        "#0ea5e9", 
                        "#a855f7"
                      ].includes(activeHighlightColor.toLowerCase())
                        ? "ring-2 ring-white border-black" 
                        : "border-white/20"
                    }`}
                    style={{ backgroundColor: activeHighlightColor }}
                  />
                </div>
              </div>
            </div>

            {/* Reading Presets Dropdown */}
            <div className="relative shrink-0 select-none" id="reading-presets-menu">
              <button
                id="reading-presets-trigger"
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-200 outline-none active:scale-95"
                title="Select Reading Preset & Theme"
              >
                <Palette className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="hidden sm:inline font-medium capitalize">
                  {readingPreset === "mystic-dark" ? "Mystic Dark" :
                   readingPreset === "midnight-monastic" ? "Midnight Monastic" :
                   readingPreset === "morning-sun" ? "Morning Sun" :
                   readingPreset === "parchment" ? "Parchment" :
                   readingPreset === "cosmic-mono" ? "Cosmic Mono" : readingPreset}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showPresetDropdown ? "rotate-180" : ""}`} />
              </button>

              {showPresetDropdown && (
                <>
                  {/* Backdrop click closer */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowPresetDropdown(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0e1017] border border-white/10 shadow-2xl p-2 z-50 animate-fade-in divide-y divide-white/5">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-500">
                      Reading Presets
                    </div>
                    
                    <div className="py-1 space-y-0.5">
                      {[
                        { id: "mystic-dark", label: "Mystic Dark", desc: "Sleek academic default" },
                        { id: "midnight-monastic", label: "Midnight Monastic", desc: "Golden medieval text" },
                        { id: "morning-sun", label: "Morning Sun", desc: "Sunlit light mode" },
                        { id: "parchment", label: "Parchment", desc: "Aged leather book look" },
                        { id: "cosmic-mono", label: "Cosmic Monospace", desc: "Sleek research console" }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            if (onPresetChange) onPresetChange(p.id as any);
                            setShowPresetDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col hover:bg-white/5 ${
                            readingPreset === p.id 
                              ? "bg-white/10 ring-1 ring-amber-500/30" 
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${p.id.includes("dark") || p.id === "cosmic-mono" || p.id === "midnight-monastic" ? "bg-slate-500" : "bg-amber-400"}`} />
                            <span className={`text-xs font-semibold ${p.id === "cosmic-mono" ? "font-mono" : p.id === "parchment" || p.id === "midnight-monastic" ? "font-serif" : "font-sans"} ${
                              readingPreset === p.id ? "text-amber-400" : "text-slate-200"
                            }`}>
                              {p.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 ml-3.5">
                            {p.desc}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Zen Reader Toggle */}
                    <div className="pt-2 pb-1 px-2.5 mt-1 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">Zen Reader</span>
                        <button
                          id="zen-reader-toggle"
                          onClick={() => {
                            if (onToggleZenReader) {
                              onToggleZenReader(!isZenReader);
                            }
                          }}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isZenReader ? "bg-amber-500" : "bg-white/10"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isZenReader ? "translate-x-4 bg-black" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-1 leading-normal">
                        Hides sidebars, headers, and progress bars when reading scripture.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 outline-none shrink-0"
              title={theme === "dark" ? "Switch to Aura Light Theme" : "Switch to Mystic Dark Theme"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-700 font-extrabold" />
              )}
            </button>

            {/* Help Button */}
            <button
              id="help-btn"
              onClick={onShowHelp}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 outline-none shrink-0"
              title="About this Tool"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Warning banner if API key is not set */}
      {!loading && configStatus && !configStatus.hasApiKey && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs text-amber-300">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Academic Notice:</strong> No <strong>GEMINI_API_KEY</strong> found in environment. For smart scripture translation, commentary, and semantic comparisons, input your key in the <strong>Settings &gt; Secrets</strong> panel.
              </span>
            </div>
            <span className="text-[10px] font-mono bg-amber-600/10 px-2 py-0.5 rounded text-amber-200">
              LocalStorage Fallback Enabled
            </span>
          </div>
        </div>
      )}
    </header>
  );
}

