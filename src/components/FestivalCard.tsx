import React, { useState } from "react";
import { 
  Bell, 
  Calendar, 
  ArrowUpRight, 
  ChevronDown, 
  ChevronUp, 
  Sprout, 
  ClipboardCheck 
} from "lucide-react";
import { FestivalItem, getFastingPreparationTips } from "../festivalsData";
import { RELIGION_LABELS, RELIGION_COLORS } from "../scripturesRegistry";
import { ReligionType } from "../types";

const getReligionBorderAccent = (religion: ReligionType | undefined) => {
  if (!religion) return "border-white/10";
  switch (religion) {
    case "hinduism": return "border-amber-500/20";
    case "islam": return "border-emerald-500/20";
    case "christianity": return "border-indigo-500/20";
    case "judaism": return "border-blue-500/20";
    case "buddhism": return "border-rose-500/20";
    case "jainism": return "border-orange-500/20";
    case "mythology": return "border-violet-500/20";
    case "history": return "border-cyan-500/20";
    case "space": return "border-fuchsia-500/20";
    default: return "border-slate-500/20";
  }
};

const getReligionTextAccent = (religion: ReligionType | undefined) => {
  if (!religion) return "text-slate-200";
  switch (religion) {
    case "hinduism": return "text-amber-400";
    case "islam": return "text-emerald-400";
    case "christianity": return "text-indigo-400";
    case "judaism": return "text-blue-400";
    case "buddhism": return "text-rose-400";
    case "jainism": return "text-orange-400";
    case "mythology": return "text-violet-400";
    case "history": return "text-cyan-400";
    case "space": return "text-fuchsia-400";
    default: return "text-slate-400";
  }
};

interface FestivalCardProps {
  key?: string | number;
  fest: FestivalItem;
  myReminders: string[];
  handleToggleReminder: (id: string) => void | Promise<void>;
  triggerICSDownload: (festivals: FestivalItem[], fileName?: string) => void;
  getGoogleCalendarUrlForFest: (fest: FestivalItem) => string;
  setSelectedFestivalItem: (fest: FestivalItem | null) => void;
}

export default function FestivalCard({
  fest,
  myReminders,
  handleToggleReminder,
  triggerICSDownload,
  getGoogleCalendarUrlForFest,
  setSelectedFestivalItem,
}: FestivalCardProps) {
  const [showTips, setShowTips] = useState<boolean>(false);
  const hasFasting = !!fest.fastingRules;
  const isReminded = myReminders.includes(fest.id);

  // Retrieve proper bullet accent class
  const relColorObj = RELIGION_COLORS[fest.religion];
  const relBulletClass = typeof relColorObj === "object" && relColorObj !== null
    ? (relColorObj.accent ? relColorObj.accent.split(" ")[0] : "bg-slate-400")
    : "bg-slate-400";

  return (
    <div 
      id={`festival-card-${fest.id}`}
      className={`p-5 rounded-2xl bg-[#09090c]/90 border hover:bg-[#0c0c11] transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
        getReligionBorderAccent(fest.religion)
      }`}
    >
      {/* Decorative Corner Glow */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.01] group-hover:bg-amber-300/[0.03] rounded-full blur-xl pointer-events-none transition-all" />

      <div className="space-y-4">
        {/* Religion badge, type flag, and Remind Me Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md border flex items-center space-x-1.5 ${
              getReligionTextAccent(fest.religion)
            } bg-white/[0.02] border-white/5`}>
              <span className={`w-1 h-1 rounded-full ${relBulletClass}`} />
              <span>{RELIGION_LABELS[fest.religion]}</span>
            </span>
            <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-md ${
              fest.type === "fasting"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                : fest.type === "vigil"
                ? "bg-violet-500/10 text-violet-400 border border-violet-500/25"
                : "bg-white/5 text-slate-400 border border-white/5"
            }`}>
              {fest.type}
            </span>
          </div>

          {(fest.type === "fasting" || hasFasting) && (
            <button
              id={`toggle-reminder-btn-${fest.id}`}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleReminder(fest.id);
              }}
              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-lg flex items-center space-x-1 transition-all border cursor-pointer select-none ${
                isReminded
                  ? "bg-amber-500 text-black border-amber-500 animate-fade-in"
                  : "bg-amber-500/5 text-amber-400 border-amber-500/20 hover:border-amber-500 hover:bg-amber-500/10"
              }`}
              title={isReminded ? "Remove from My Reminders" : "Add to My Reminders"}
            >
              <Bell className={`w-3 h-3 ${isReminded ? "animate-pulse" : ""}`} />
              <span>{isReminded ? "Reminded" : "Remind Me"}</span>
            </button>
          )}
        </div>

        {/* Title */}
        <div className="space-y-0.5">
          <h3 className="text-base sm:text-md font-serif font-semibold text-white group-hover:text-amber-300 transition-colors">
            {fest.name}
          </h3>
          {fest.transliteration && (
            <p className="text-[10px] sm:text-xs font-mono text-slate-500">{fest.transliteration}</p>
          )}
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
          {fest.description}
        </p>

        {/* Quick Timing & Fasting info pill */}
        <div className="space-y-1.5 p-3 rounded-xl bg-black/45 border border-white/5">
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>⏰ Timing:</span>
            <span className="text-amber-400 font-medium text-right truncate pl-2 max-w-[170px]">{fest.timing}</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>⚙️ Cycle Mode:</span>
            <span className="text-slate-300 text-right truncate pl-2 max-w-[150px]">{fest.calendarSystem}</span>
          </div>
          {hasFasting && (
            <div className="text-[10px] font-mono text-amber-500 flex items-center justify-between pt-1 border-t border-white/5">
              <span>🍽️ Fast Level:</span>
              <span className="font-bold underline uppercase tracking-wider text-[9px]">{fest.fastingRules?.intensity}</span>
            </div>
          )}
        </div>

        {/* PREPARATION TIPS COLLAPSIBLE SECTION */}
        {(fest.type === "fasting" || hasFasting) && (
          <div className="pt-2">
            <button
              id={`prep-tips-toggle-${fest.id}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTips(!showTips);
              }}
              className="w-full py-1 px-2.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 hover:border-emerald-500/35 transition-colors flex items-center justify-between text-[10px] text-emerald-400 font-mono cursor-pointer"
            >
              <span className="flex items-center space-x-1">
                <Sprout className="w-3.5 h-3.5" />
                <span className="font-bold uppercase tracking-wider">Preparation Tips Checklist</span>
              </span>
              {showTips ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showTips && (
              <div 
                id={`prep-tips-panel-${fest.id}`}
                className="mt-2.5 p-3 rounded-xl bg-black/60 border border-emerald-500/10 animate-fade-in space-y-2 text-left"
              >
                <div className="flex items-center space-x-1.5 text-[9px] uppercase font-mono font-bold text-slate-400 border-b border-white/5 pb-1 select-none">
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Success Guidelines &bull; {RELIGION_LABELS[fest.religion]}</span>
                </div>
                <ul className="space-y-1.5">
                  {getFastingPreparationTips(fest.religion).map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5 text-[11px] text-slate-300 leading-relaxed">
                      <span className="text-emerald-400 font-mono text-[9px] font-extrabold mt-0.5 select-none">&bull;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Action buttons */}
      <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            id={`btn-ics-${fest.id}`}
            onClick={() => triggerICSDownload([fest], `${fest.id}_calendar_2026.ics`)}
            className="px-2.5 py-1.5 rounded-lg text-[10px] uppercase font-bold font-mono bg-white/[0.02] border border-white/5 hover:border-amber-500/20 hover:bg-amber-500/5 text-slate-400 hover:text-amber-400 transition-all cursor-pointer flex items-center justify-center space-x-1"
            title="Download .ics for this holy date"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Export ICS</span>
          </button>
          <a
            id={`btn-gcal-${fest.id}`}
            href={getGoogleCalendarUrlForFest(fest)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg text-[10px] uppercase font-bold font-mono bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-all text-center flex items-center justify-center space-x-1 decoration-transparent"
            title="Add to Google Calendar directly"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Google Cal</span>
          </a>
        </div>
        <button
          id={`btn-inspect-${fest.id}`}
          onClick={() => setSelectedFestivalItem(fest)}
          className="w-full py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs transition-transform transform active:scale-95 cursor-pointer hover:bg-amber-400 flex items-center justify-center space-x-1.5"
        >
          <span>Inspect Customs & Sources</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
