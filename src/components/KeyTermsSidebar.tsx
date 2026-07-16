/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  HelpCircle, 
  Play, 
  BookMarked, 
  Volume2, 
  X, 
  AlertCircle, 
  Compass, 
  CornerDownRight, 
  Languages, 
  Info,
  Loader2
} from "lucide-react";
import { CURATED_GLOSSARY, DefinitionResult } from "./GlossaryModal";

interface KeyTermsSidebarProps {
  commentaryText: string;
  verses: any[];
  bookContext: string;
  highThinking: boolean;
  onSpeakText: (text: string, type?: string) => void;
  onClose?: () => void;
  selectedTermOverride?: string | null;
  onClearOverride?: () => void;
}

// Additional high-probability interfaith root keywords to search for in commentary & verses
const SCHOLARLY_KEYWORDS: Record<string, { term: string; explanation: string }> = {
  brahman: {
    term: "Brahman",
    explanation: "The ultimate, unchanging, infinite supreme reality in Hindu Upanishadic philosophy."
  },
  samsara: {
    term: "Samsara",
    explanation: "The endless cycle of birth, death, and rebirth across realms of existence."
  },
  dukkha: {
    term: "Dukkha",
    explanation: "The Buddhist truth of suffering, unsatisfactoriness, and transience in earthly life."
  },
  moksha: {
    term: "Moksha",
    explanation: "The ultimate spiritual liberation and self-realization in Hindu and Jaina thoughts."
  },
  kaivalya: {
    term: "Kaivalya",
    explanation: "The state of absolute freedom, isolation, and spiritual independence in classical Yoga."
  },
  shiva: {
    term: "Shiva",
    explanation: "The Supreme Lord or Destroyer aspect representing cosmic consciousness and regeneration."
  },
  vishnu: {
    term: "Vishnu",
    explanation: "The Preserver of cosmic order, periodically reincarnating as avatars (like Krishna)."
  },
  logos: {
    term: "Logos",
    explanation: "The Greek concept of divine reason, cosmic order, or the Word of God incarnate."
  },
  shema: {
    term: "Shema",
    explanation: "The supreme declarative Jewish confession of the absolute unity of God."
  },
  allah: {
    term: "Allah",
    explanation: "The single, supreme, absolute, and unassociated God in Islamic monotheism."
  },
  yahweh: {
    term: "Yahweh",
    explanation: "The sacred, covenantal Hebrew name of God revealed in the Torah."
  },
  sutra: {
    term: "Sutra / Sutta",
    explanation: "Literally 'thread'; brief aphoristic scriptures or discourses in Indian traditions."
  },
  bhakti: {
    term: "Bhakti",
    explanation: "Deep, devotional surrender and loving adoration of the Divine or chosen deity."
  },
  sharia: {
    term: "Sharia",
    explanation: "The moral code and divine jurisprudential path of Islamic living."
  },
  tirthankara: {
    term: "Tirthankara",
    explanation: "One of the 24 savior-teachers of Jainism who attained absolute omniscience."
  },
  guru: {
    term: "Guru",
    explanation: "A spiritual teacher who dispels darkness; especially the ten historical lights in Sikhism."
  },
  namaste: {
    term: "Namaste",
    explanation: "Sanskrit greeting recognizing the universal divine light in another soul."
  },
  wisdom: {
    term: "Wisdom (Sophia)",
    explanation: "The personified or sought after divine intellect directing spiritual pathways."
  }
};

export const KeyTermsSidebar: React.FC<KeyTermsSidebarProps> = ({
  commentaryText,
  verses,
  bookContext,
  highThinking,
  onSpeakText,
  onClose,
  selectedTermOverride,
  onClearOverride
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<DefinitionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // Compile full text of current chapter for keyword matching
  const chapterFullText = useMemo(() => {
    let text = commentaryText || "";
    if (verses && verses.length > 0) {
      verses.forEach(v => {
        text += " " + (v.translation || "");
        text += " " + (v.originalText || "");
        text += " " + (v.transliteration || "");
      });
    }
    return text.toLowerCase();
  }, [commentaryText, verses]);

  // Scan text for occurrences of keywords & select matching terms
  const matchedTerms = useMemo(() => {
    const list: Array<{ id: string; term: string; source: "curated" | "scholarly"; explanation?: string }> = [];

    // 1. Scan curated terms
    Object.keys(CURATED_GLOSSARY).forEach(key => {
      const entry = CURATED_GLOSSARY[key];
      const termRegex = new RegExp(`\\b${entry.term.toLowerCase()}\\b`, "i");
      if (termRegex.test(chapterFullText) || chapterFullText.includes(entry.term.toLowerCase())) {
        list.push({
          id: key,
          term: entry.term,
          source: "curated"
        });
      }
    });

    // 2. Scan supplementary keywords
    Object.keys(SCHOLARLY_KEYWORDS).forEach(key => {
      // Avoid duplication with curated terms
      if (list.some(el => el.term.toLowerCase() === key)) return;

      const entry = SCHOLARLY_KEYWORDS[key];
      const termRegex = new RegExp(`\\b${entry.term.toLowerCase()}\\b`, "i");
      if (termRegex.test(chapterFullText) || chapterFullText.includes(key)) {
        list.push({
          id: key,
          term: entry.term,
          source: "scholarly",
          explanation: entry.explanation
        });
      }
    });

    return list;
  }, [chapterFullText]);

  // Handle custom dynamic lookup from server
  const handleDefineTerm = async (termToSearch: string) => {
    if (!termToSearch.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedTerm(null);

    // Check if it's already in the local curated glossary
    const lowerKey = termToSearch.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (CURATED_GLOSSARY[lowerKey]) {
      setSelectedTerm(CURATED_GLOSSARY[lowerKey]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/glossary/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: termToSearch.trim(),
          bookContext,
          highThinking
        })
      });

      if (!response.ok) {
        throw new Error("Unable to contact theological translation server.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setSelectedTerm({
        term: data.term || termToSearch,
        origin: data.origin || "Unknown Tradition",
        pronunciation: data.pronunciation || "Phonetics unavailable",
        definition: data.definition || "No definition returned.",
        usage: data.usage || "No usage guide found.",
        interfaithComparative: data.interfaithComparative || "No comparative parallel calculated."
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to translate and define term. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  // Preview local curated term instantly
  const handleSelectCuratedTerm = (key: string) => {
    setSelectedTerm(CURATED_GLOSSARY[key]);
    setError(null);
  };

  // Trigger default selection if matched terms exist and none is chosen
  useEffect(() => {
    if (matchedTerms.length > 0 && !selectedTerm) {
      const firstCurated = matchedTerms.find(t => t.source === "curated");
      if (firstCurated) {
        handleSelectCuratedTerm(firstCurated.id);
      } else {
        // Look up first scholarly
        handleDefineTerm(matchedTerms[0].term);
      }
    }
  }, [matchedTerms, selectedTerm]);

  // Handle external requested selection overrides
  useEffect(() => {
    if (selectedTermOverride) {
      handleDefineTerm(selectedTermOverride);
      if (onClearOverride) {
        onClearOverride();
      }
    }
  }, [selectedTermOverride, onClearOverride]);

  return (
    <div 
      id="key-terms-sidebar-root"
      className="w-full xl:w-96 shrink-0 flex flex-col gap-4 self-start"
    >
      <div className="bg-[#0f0f15]/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-md relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-500"></div>

        {/* Header */}
        <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs uppercase font-mono tracking-widest text-slate-200 font-bold">
              Contextual Key Terms
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono leading-none font-medium">
              {matchedTerms.length} Discovered
            </span>
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Hide sidebar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 space-y-4">
          <p className="text-[11px] text-slate-400 font-serif italic leading-relaxed">
            These theological, linguistic, and philosophical terms were detected in the current passage or can be defined dynamically.
          </p>

          {/* DETECTED TERMS PILLS */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">
              Terms in this Passage:
            </span>
            {matchedTerms.length === 0 ? (
              <div className="p-3 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-xl text-slate-500 text-[11px] font-serif italic">
                No standard terms matched. Search any word below!
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {matchedTerms.map((termItem) => {
                  const isCurrent = selectedTerm?.term.toLowerCase() === termItem.term.toLowerCase();
                  return (
                    <button
                      key={`${termItem.source}-${termItem.id}`}
                      onClick={() => {
                        if (termItem.source === "curated") {
                          handleSelectCuratedTerm(termItem.id);
                        } else {
                          handleDefineTerm(termItem.term);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer select-none flex items-center gap-1 ${
                        isCurrent
                          ? "bg-amber-500 text-black border-amber-500/30 font-semibold"
                          : "bg-white/5 text-slate-300 border-white/5 hover:border-amber-500/25 hover:bg-amber-500/5 text-slate-300"
                      }`}
                    >
                      <span>{termItem.term}</span>
                      <Sparkles className={`w-2.5 h-2.5 ${isCurrent ? "text-black" : "text-amber-400/60"}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* DYNAMIC DEFINE BOX */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">
              Define Custom Term:
            </span>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDefineTerm(searchTerm)}
                  placeholder="e.g. Samsara, Grace, Torah..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-8 text-xs focus:outline-none focus:border-cyan-500/60 text-slate-200 placeholder-slate-600 font-sans"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                disabled={loading || !searchTerm.trim()}
                onClick={() => handleDefineTerm(searchTerm)}
                className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-semibold rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Define"}
              </button>
            </div>
          </div>

          {/* TERM DEFINITION RESULTS */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {loading && (
              <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Defining via AI Scholar...</p>
              </div>
            )}

            {!loading && selectedTerm && (
              <motion.div
                key={selectedTerm.term}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3.5"
              >
                {/* Word, Voice, Sub */}
                <div className="flex items-start justify-between border-b border-white/5 pb-2.5">
                  <div>
                    <h4 className="text-base font-serif font-bold text-amber-200">
                      {selectedTerm.term}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5 block flex items-center gap-1.5">
                      <span className="px-1 bg-white/5 border border-white/5 rounded">{selectedTerm.pronunciation}</span>
                      <span>•</span>
                      <span>{selectedTerm.origin}</span>
                    </span>
                  </div>
                  
                  <button
                    onClick={() => onSpeakText(`${selectedTerm.term}. Pronounced: ${selectedTerm.pronunciation}. Definition: ${selectedTerm.definition}`, "term")}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title={`Pronounce ${selectedTerm.term}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Definition Body */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider font-mono text-amber-400/60 block mb-1">
                      Philosophical Meaning:
                    </span>
                    <p className="text-slate-300 font-serif leading-relaxed">
                      {selectedTerm.definition}
                    </p>
                  </div>

                  {selectedTerm.usage && (
                    <div className="pt-2 border-t border-white/[0.03]">
                      <span className="text-[8px] uppercase tracking-wider font-mono text-cyan-400/60 block mb-1">
                        Scriptural Appellations:
                      </span>
                      <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
                        {selectedTerm.usage}
                      </p>
                    </div>
                  )}

                  {selectedTerm.interfaithComparative && (
                    <div className="pt-2.5 border-t border-white/[0.04] bg-indigo-950/[0.12] p-2 rounded-xl border border-indigo-500/10">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Compass className="w-3 h-3 text-indigo-400" />
                        <span className="text-[8px] uppercase tracking-widest font-mono text-indigo-400 font-bold">
                          Comparative Interfaith Parallel:
                        </span>
                      </div>
                      <p className="text-indigo-200 font-serif leading-normal italic text-[11px]">
                        &ldquo;{selectedTerm.interfaithComparative}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
