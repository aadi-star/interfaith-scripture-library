import React, { useState, useEffect } from "react";
import { BookOpen, Layers, ChevronDown, Sparkles, Check, AlertCircle } from "lucide-react";

export interface YajurvedaDropdownSelectorProps {
  branch: "shukla" | "krishna";
  onBranchChange: (branch: "shukla" | "krishna") => void;
  selectedLevelId: number | null; // Chapter number (Shukla) or Kanda number (Krishna)
  selectedSubLevelId?: number | null; // Prashana number (Krishna)
  onSelectOption: (levelId: number, subLevelId?: number) => void;
  totalChaptersShukla?: number; // Defaults to 40
  loading?: boolean;
}

// Krishna Yajurveda standard Taittiriya Samhita Kanda & Prashana counts
export const KRISHNA_KANDA_STRUCTURE = [
  { kanda: 1, title: "Kanda 1 (Prapathakas 1-8)", prashanasCount: 8 },
  { kanda: 2, title: "Kanda 2 (Prapathakas 1-6)", prashanasCount: 6 },
  { kanda: 3, title: "Kanda 3 (Prapathakas 1-5)", prashanasCount: 5 },
  { kanda: 4, title: "Kanda 4 (Prapathakas 1-7)", prashanasCount: 7 },
  { kanda: 5, title: "Kanda 5 (Prapathakas 1-7)", prashanasCount: 7 },
  { kanda: 6, title: "Kanda 6 (Prapathakas 1-6)", prashanasCount: 6 },
  { kanda: 7, title: "Kanda 7 (Prapathakas 1-5)", prashanasCount: 5 }
];

export const YajurvedaDropdownSelector: React.FC<YajurvedaDropdownSelectorProps> = ({
  branch,
  onBranchChange,
  selectedLevelId,
  selectedSubLevelId,
  onSelectOption,
  totalChaptersShukla = 40,
  loading = false
}) => {
  const isKrishna = branch === "krishna";

  // State for active Kanda and Prashana
  const [activeKanda, setActiveKanda] = useState<number>(selectedLevelId || 1);
  const [activePrashana, setActivePrashana] = useState<number>(selectedSubLevelId || 1);

  // Sync state if props change
  useEffect(() => {
    if (selectedLevelId) setActiveKanda(selectedLevelId);
    if (selectedSubLevelId) setActivePrashana(selectedSubLevelId);
  }, [selectedLevelId, selectedSubLevelId]);

  // Unified master dropdown selection e.g. "krishna_1_2" or "shukla_5"
  const handleMasterDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;

    if (val.startsWith("krishna_")) {
      const parts = val.replace("krishna_", "").split("_");
      const k = Number(parts[0]);
      const p = Number(parts[1] || 1);
      if (!isNaN(k) && !isNaN(p)) {
        if (!isKrishna) {
          onBranchChange("krishna");
        }
        setActiveKanda(k);
        setActivePrashana(p);
        onSelectOption(k, p);
      }
    } else if (val.startsWith("shukla_")) {
      const c = Number(val.replace("shukla_", ""));
      if (!isNaN(c)) {
        if (isKrishna) {
          onBranchChange("shukla");
        }
        onSelectOption(c);
      }
    }
  };

  const handleKandaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const k = Number(e.target.value);
    if (!isNaN(k)) {
      if (!isKrishna) onBranchChange("krishna");
      setActiveKanda(k);
      setActivePrashana(1);
      onSelectOption(k, 1);
    }
  };

  const handlePrashanaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = Number(e.target.value);
    if (!isNaN(p)) {
      if (!isKrishna) onBranchChange("krishna");
      setActivePrashana(p);
      onSelectOption(activeKanda, p);
    }
  };

  const currentKandaObj = KRISHNA_KANDA_STRUCTURE.find(k => k.kanda === activeKanda) || KRISHNA_KANDA_STRUCTURE[0];

  const currentDropdownValue = isKrishna 
    ? `krishna_${activeKanda}_${activePrashana}` 
    : `shukla_${selectedLevelId || 1}`;

  return (
    <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl text-stone-100 space-y-5 max-w-3xl mx-auto my-4">
      {/* 1. Header & Branch Toggle Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-stone-100">Yajurveda (यजुर्वेदः) Canon</h3>
            <p className="text-[11px] text-stone-400 font-mono">
              Current Branch: <span className="text-amber-400 font-bold">{isKrishna ? "Krishna Yajurveda (Kandas 1-7)" : "Shukla Yajurveda (Chapters 1-40)"}</span>
            </p>
          </div>
        </div>

        {/* Branch Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            type="button"
            onClick={() => {
              onBranchChange("krishna");
              setActiveKanda(1);
              setActivePrashana(1);
              onSelectOption(1, 1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isKrishna
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Krishna Yajurveda (Kandas 1-7)
          </button>
          <button
            type="button"
            onClick={() => {
              onBranchChange("shukla");
              onSelectOption(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isKrishna
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Shukla Yajurveda (Ch 1-40)
          </button>
        </div>
      </div>

      {/* 2. Unified Master Dropdown Selector (Krishna Kandas 1-7 + Shukla Chapters 1-40) */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase text-amber-400 tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Complete Yajurveda Canon Dropdown:
          </span>
          <span className="text-[10px] text-stone-400 font-normal">
            {isKrishna ? `Selected: Kanda ${activeKanda}, Prashana ${activePrashana}` : `Selected: Shukla Chapter ${selectedLevelId || 1}`}
          </span>
        </label>
        
        <div className="relative">
          <select
            value={currentDropdownValue}
            onChange={handleMasterDropdownChange}
            disabled={loading}
            className="w-full bg-stone-950 border border-amber-500/40 text-amber-300 font-serif text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer disabled:opacity-50"
          >
            {/* KRISHNA YAJURVEDA KANDAS (1 TO 7) */}
            {KRISHNA_KANDA_STRUCTURE.map((kandaObj) => (
              <optgroup key={`kg_${kandaObj.kanda}`} label={`Krishna Yajurveda — Kanda ${kandaObj.kanda} (Prapathakas 1-${kandaObj.prashanasCount})`} className="bg-stone-900 text-amber-300 font-semibold">
                {Array.from({ length: kandaObj.prashanasCount }, (_, i) => i + 1).map((pNum) => (
                  <option
                    key={`krishna_opt_${kandaObj.kanda}_${pNum}`}
                    value={`krishna_${kandaObj.kanda}_${pNum}`}
                    className="bg-stone-950 text-stone-100 font-normal py-1"
                  >
                    Krishna Yajurveda — Kanda {kandaObj.kanda}, Prashana {pNum}
                  </option>
                ))}
              </optgroup>
            ))}

            {/* SHUKLA YAJURVEDA (CHAPTERS 1 TO 40) */}
            <optgroup label="--- SHUKLA YAJURVEDA (Adhyayas / Chapters 1 to 40) ---" className="bg-stone-950 text-amber-400 font-bold">
              {Array.from({ length: totalChaptersShukla }, (_, i) => i + 1).map((chNum) => (
                <option
                  key={`shukla_opt_${chNum}`}
                  value={`shukla_${chNum}`}
                  className="bg-stone-950 text-stone-100 font-normal py-1"
                >
                  Shukla Yajurveda — Chapter {chNum} (अध्याय {chNum})
                </option>
              ))}
            </optgroup>
          </select>
          <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 3. Dedicated Step-by-Step Dropdowns */}
      {isKrishna ? (
        <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-stone-300 tracking-wider font-semibold">
              Krishna Yajurveda 2-Step Kanda & Prashana Selection
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
              Kandas 1 to 7 Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Kanda Selector (1-7) */}
            <div>
              <label className="block text-[11px] font-mono text-amber-400 uppercase mb-1 font-semibold">
                1. Select Kanda (Kanda 1 to 7):
              </label>
              <div className="relative">
                <select
                  value={activeKanda}
                  onChange={handleKandaChange}
                  disabled={loading}
                  className="w-full bg-stone-900 border border-amber-500/30 text-amber-200 text-xs rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:border-amber-500 cursor-pointer font-serif"
                >
                  {KRISHNA_KANDA_STRUCTURE.map((k) => (
                    <option key={`k_sel_${k.kanda}`} value={k.kanda} className="bg-stone-950 text-stone-100">
                      Kanda {k.kanda} ({k.prashanasCount} Prashanas)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Prashana Selector */}
            <div>
              <label className="block text-[11px] font-mono text-amber-400 uppercase mb-1 font-semibold">
                2. Select Prashana (Sub-division):
              </label>
              <div className="relative">
                <select
                  value={activePrashana}
                  onChange={handlePrashanaChange}
                  disabled={loading}
                  className="w-full bg-stone-900 border border-amber-500/30 text-amber-200 text-xs rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:border-amber-500 cursor-pointer font-serif"
                >
                  {Array.from({ length: currentKandaObj.prashanasCount }, (_, i) => i + 1).map((pNum) => (
                    <option key={`p_sel_${pNum}`} value={pNum} className="bg-stone-950 text-stone-100">
                      Prashana {pNum} (Kanda {activeKanda}.{pNum})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800">
          <label className="block text-[11px] font-mono text-stone-400 uppercase mb-1">
            Shukla Yajurveda Direct Chapter Navigation (1 to 40)
          </label>
          <div className="relative">
            <select
              value={selectedLevelId || 1}
              onChange={(e) => {
                const c = Number(e.target.value);
                if (!isNaN(c)) onSelectOption(c);
              }}
              disabled={loading}
              className="w-full bg-stone-900 border border-amber-500/30 text-amber-200 text-xs rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:border-amber-500 cursor-pointer font-serif"
            >
              {Array.from({ length: totalChaptersShukla }, (_, i) => i + 1).map((chNum) => (
                <option key={`shukla_direct_${chNum}`} value={chNum} className="bg-stone-950 text-stone-100">
                  Chapter {chNum} (अध्याय {chNum})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
};

