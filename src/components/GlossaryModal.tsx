/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookOpen, Search, Sparkles, Loader2, Info, Compass, HelpCircle, X } from "lucide-react";

export interface DefinitionResult {
  term: string;
  origin: string;
  pronunciation: string;
  definition: string;
  usage: string;
  interfaithComparative: string;
}

// Curated dictionary for instant lookup of core scriptural/theological terms
export const CURATED_GLOSSARY: Record<string, DefinitionResult> = {
  atman: {
    term: "Atman",
    origin: "Sanskrit (Hinduism)",
    pronunciation: "[ˈɑːtmən]",
    definition: "The true, eternal, and innermost self or soul of an individual, distinct from the physical body, sensory mind, and transient ego.",
    usage: "Governs Vedantic scriptures (the Upanishads and Bhagavad Gita), where realizing Atman as identical to the supreme cosmic reality (Brahman) forms the path to spiritual liberation (Moksha).",
    interfaithComparative: "Philosophically matches the concept of the 'Divine Spark' within Christian mysticism or the 'Divine Breath' (Ruh) mentioned in Sufi traditions."
  },
  dharma: {
    term: "Dharma",
    origin: "Sanskrit & Pali (Hinduism, Buddhism, Jainism, Sikhism)",
    pronunciation: "[ˈdʱʌrmʌ]",
    definition: "A foundational cosmic principle signifying moral duty, natural law, universal order, righteous conduct, and ultimate truth.",
    usage: "In Hinduism (Bhagavad Gita), it dictates moral duties based on cosmic justice. In Buddhism (Dhammapada), it designates the eternal law and the absolute teachings declared by the Buddha.",
    interfaithComparative: "Strongly aligns with the Hebrew concept of 'Torah' (divine teaching/path) or the classical Taoist principle of 'Tao' (the flowing way of cosmic truth)."
  },
  surah: {
    term: "Surah",
    origin: "Arabic (Islam)",
    pronunciation: "[ˈsuːrə]",
    definition: "A designated chapter within the Holy Quran. The Quran is structured into 114 Surahs, each comprised of divine verses called Ayahs.",
    usage: "Serves as the canonical division of Islamic scripture, ranging from thematic laws, prophecies, and poetic moral meditations. Recited sequentially in daily prayers.",
    interfaithComparative: "Athematically mirrors the divisions of Biblical chapters or classical Cantos, but carries unique, sacred role as direct, unmediated divine speech."
  },
  karma: {
    term: "Karma",
    origin: "Sanskrit (Hinduism, Buddhism, Jainism)",
    pronunciation: "[ˈkɑːrmə]",
    definition: "The cosmic law of moral causation, stipulating that every voluntary action, intent, or mental thought carries an inevitable moral reaction in this or future lives.",
    usage: "In the Bhagavad Gita, the doctrine of 'Nishkama Karma' (selfless action without desire for fruits) is prescribed. In Buddhism (Dhammapada), it establishes moral sovereignty without needing a judge.",
    interfaithComparative: "Shares immediate ethical parallel with the Christian scriptural decree in Galatians 6:7: 'Whatever a man sows, that he will also reap.'"
  },
  nirvana: {
    term: "Nirvana",
    origin: "Pali & Sanskrit (Buddhism, Hinduism)",
    pronunciation: "[nɪərˈvɑːnə]",
    definition: "The ultimate state of spiritual liberation, characterized by the absolute extinguishing of greed, hatred, delusion, and the suffering of the ego.",
    usage: "Celebrated in Buddhist scriptures as the absolute transcendence, supreme peace, and permanent cessation of the cycles of rebirth.",
    interfaithComparative: "Corresponds to Vedantic Hinduism's 'Moksha' (liberation), or the 'Unitive Ascent' and beatific state of divine union described by Christian desert fathers."
  },
  ahimsa: {
    term: "Ahimsa",
    origin: "Sanskrit (Jainism, Hinduism, Buddhism)",
    pronunciation: "[ʌˈɦɪmsɑː]",
    definition: "The ethical mandate of absolute non-injury, harmlessness, and universal compassion toward all living consciousnesses (humans, animals, and nature).",
    usage: "Lies as the premier absolute vow in the Jaina Tattvartha Sutra, demanding extreme care in physical conduct, speech, and thought.",
    interfaithComparative: "Strongly resonates with Jesus' teachings in the Sermon on the Mount regarding complete non-retaliation and loving one's adversaries."
  },
  tao: {
    term: "Tao",
    origin: "Chinese (Taoism, Confucianism)",
    pronunciation: "[daʊ]",
    definition: "Literally translating to 'The Way' or 'Path'. It represents the ineffable, primordial cosmic source and absolute natural order organizing the universe.",
    usage: "Formulated in the Tao Te Ching by Lao Tzu, urging spiritual seekers to live in harmony with the natural flow through effortless action (Wu Wei).",
    interfaithComparative: "Linguistically and philosophically mirrors the Greek theological concept of 'Logos' (cosmic reason) which coordinates the order of creation."
  },
  grace: {
    term: "Grace",
    origin: "Latin (Christianity)",
    pronunciation: "[ɡreɪs]",
    definition: "The unmerited, free favor and spiritual love bestowed by God upon human beings to enable moral healing, salvation, and sanctification.",
    usage: "The central spiritual axis of the New Testament (Letters of Paul), emphasizing that salvation is a gratuitous gift of divine mercy, not earned through mere legalism.",
    interfaithComparative: "Bears strong similarities to the Hindu Bhakti concept of 'Kripa' (divine indulgence) and the Islamic concept of 'Rahmah' (universal mercy)."
  },
  torah: {
    term: "Torah",
    origin: "Hebrew (Judaism)",
    pronunciation: "[ˈtɔːrə]",
    definition: "Literally translating to 'Instruction', 'Teaching', or 'Law'. Refers specifically to the first five books of the Hebrew Bible containing divine covenants.",
    usage: "The central ethical, legal, and theological core of the Jewish faith, guiding the community in moral righteousness, temple history, and covenantal commands.",
    interfaithComparative: "Intersects with the Islamic concept of the 'Sharia' (jurisprudential pathway) and the Hindu concept of 'Dharma' as a template of sacred moral life."
  },
  covenant: {
    term: "Covenant",
    origin: "Hebrew & Latin (Judaism, Christianity)",
    pronunciation: "[ˈkʌvənənt]",
    definition: "A solemn, binding, and eternal sacred treaty or relationship forged between the Creator and a human group, based on mutual commitments.",
    usage: "Dominates the Hebrew Tanakh (agreements with Noah, Abraham, Moses, and David) and the New Testament, which denotes a 'New Covenant' instituted by faith.",
    interfaithComparative: "Symmetrically reflected in pre-Islamic tribal protection packs, or the solemn spiritual vows ('Vrata') undertaken in Vedic scripture."
  }
};

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
  bookContext?: string;
  highThinking?: boolean;
}

export default function GlossaryModal({
  isOpen,
  onClose,
  initialTerm = "",
  bookContext = "Interfaith Scriptures",
  highThinking = false
}: GlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [definition, setDefinition] = useState<DefinitionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customLookup, setCustomLookup] = useState(false);

  // Trigger search on mount/update when initial word changes
  useEffect(() => {
    if (isOpen) {
      if (initialTerm.trim()) {
        const cleanText = initialTerm.trim();
        setSearchTerm(cleanText);
        handleLookup(cleanText);
      } else {
        // Default lookup for Atman to show something beautiful
        setDefinition(CURATED_GLOSSARY.atman);
        setSearchTerm("");
        setCustomLookup(false);
        setError(null);
      }
    }
  }, [isOpen, initialTerm]);

  const handleLookup = async (textToSearch: string) => {
    if (!textToSearch.trim()) return;
    const lowerKey = textToSearch.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Check local lookup first
    if (CURATED_GLOSSARY[lowerKey]) {
      setDefinition(CURATED_GLOSSARY[lowerKey]);
      setCustomLookup(false);
      setError(null);
      return;
    }

    // Try finding close matches locally
    const foundKey = Object.keys(CURATED_GLOSSARY).find(k => k.includes(lowerKey) || lowerKey.includes(k));
    if (foundKey) {
      setDefinition(CURATED_GLOSSARY[foundKey]);
      setCustomLookup(false);
      setError(null);
      return;
    }

    // Fall back to live Gemini AI definition proxy
    setLoading(true);
    setError(null);
    setDefinition(null);
    setCustomLookup(true);

    try {
      const response = await fetch("/api/glossary/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: textToSearch,
          bookContext,
          highThinking
        })
      });

      if (!response.ok) {
        throw new Error("API failed to generate scholarly definition.");
      }

      const data = await response.json();
      if (data && data.definition) {
        setDefinition(data);
      } else {
        throw new Error("Response was empty or invalid.");
      }
    } catch (err: any) {
      console.error(err);
      setError(`Unable to dynamically define "${textToSearch}". Please check API key configuration or try another word.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in shadow-2xl">
      <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <Compass className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest text-amber-400 font-bold block">
                Theological Key Terms Glossary
              </h2>
              <span className="text-[10px] text-slate-400 font-sans block">
                Comparative definitions, linguistic history, and parallels
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer outline-none border border-transparent hover:border-white/10"
            title="Close Glossary Panel"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search Header panel */}
        <div className="p-4 bg-white/[0.02] border-b border-white/5 flex gap-2.5 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search or type ANY term (e.g. Dharma, Surah, Covenant...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLookup(searchTerm);
              }}
              className="w-full bg-[#141419] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>
          <button
            onClick={() => handleLookup(searchTerm)}
            disabled={loading || !searchTerm.trim()}
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed outline-none select-none shrink-0"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Lookup</span>
          </button>
        </div>

        {/* Modal Main Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Lookup Output */}
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-mono text-amber-200/85">Consulting Interfaith Scholar system...</p>
                <p className="text-[10px] text-slate-400 font-serif italic">Synthesizing linguistic origins, scripture usages, and global parallels...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-center space-y-2">
              <p className="text-xs text-red-300 font-sans">{error}</p>
              <button
                onClick={() => handleLookup(searchTerm)}
                className="bg-white/5 border border-white/10 text-white font-mono text-[10px] rounded px-3 py-1 hover:bg-white/10 cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          ) : definition ? (
            <div className="space-y-5 animate-fade-in">
              {/* Head Header Card */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold font-mono">
                    {definition.origin}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                    {definition.term}
                  </h3>
                </div>
                {definition.pronunciation && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Pronunciation</span>
                    <p className="text-xs font-mono text-amber-100/70">{definition.pronunciation}</p>
                  </div>
                )}
              </div>

              {/* Dynamic Tag indicator if AI Generated */}
              {customLookup && (
                <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 p-2 px-3 rounded-lg font-mono">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>AI Scholar Live Synthesis: Personalized scholarly lookup from comparative theological indices.</span>
                </div>
              )}

              {/* Core Definition block */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase font-mono tracking-widest text-amber-400/90 font-bold">
                  Scholarly Definition
                </h4>
                <p className="text-sm font-serif leading-relaxed text-slate-200 bg-black/25 p-4 rounded-xl border border-white/5">
                  {definition.definition}
                </p>
              </div>

              {/* Scriptural Usage */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">
                  Canonical Occurrence & Usage
                </h4>
                <p className="text-xs sm:text-sm font-serif leading-relaxed text-slate-300">
                  {definition.usage}
                </p>
              </div>

              {/* Comparative Parallel */}
              <div className="bg-gradient-to-br from-stone-900/40 to-black border border-amber-500/15 rounded-xl p-4.5 space-y-1.5">
                <h4 className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> Interfaith Parallel & Resonance
                </h4>
                <p className="text-xs sm:text-sm font-serif leading-relaxed text-slate-300 italic">
                  &ldquo;{definition.interfaithComparative}&rdquo;
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Type or highlight a theological term to display academic definitions.
            </div>
          )}

          {/* Curated list recommendation links */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold block">
              Suggested High-Frequency Terms
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(CURATED_GLOSSARY).map((wordKey) => {
                const isSelected = definition && definition.term.toLowerCase() === wordKey;
                return (
                  <button
                    key={wordKey}
                    onClick={() => {
                      setSearchTerm(CURATED_GLOSSARY[wordKey].term);
                      handleLookup(CURATED_GLOSSARY[wordKey].term);
                    }}
                    className={`text-[10px] font-mono font-medium rounded-lg px-2.5 py-1 text-xs border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500 text-black border-transparent shadow shadow-amber-500/15 scale-105"
                        : "bg-[#121217] text-slate-400 border-white/5 hover:border-white/15 hover:text-white"
                    }`}
                  >
                    {CURATED_GLOSSARY[wordKey].term}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer / Tips */}
        <div className="bg-[#09090b] p-3.5 border-t border-white/5 text-center text-[10px] text-slate-500 font-sans flex items-center justify-center gap-1.5 shrink-0">
          <Info className="w-3.5 h-3.5 text-amber-500/70" />
          <span>Tip: Highlight any complex term inside the scripture text at any time to define it instantly!</span>
        </div>

      </div>
    </div>
  );
}
