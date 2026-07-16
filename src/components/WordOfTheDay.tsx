/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Languages, 
  Compass, 
  HelpCircle, 
  ArrowRight, 
  Shuffle, 
  Copy, 
  Check, 
  Lightbulb,
  ArrowLeftRight
} from "lucide-react";
import { ReligionType } from "../types";
import { RELIGION_LABELS, RELIGION_COLORS } from "../scripturesRegistry";

export interface WordOfTheDay {
  term: string;
  nativeScript: string;
  language: string;
  pronunciation: string;
  religion: ReligionType | "interfaith" | "classical";
  literalMeaning: string;
  etymologicalRoot: string;
  contextExplanation: string;
  scriptureRef: string;
  interfaithEcho: {
    tradition: string;
    concept: string;
    description: string;
  };
}

export const WORD_OF_THE_DAY_REGISTRY: WordOfTheDay[] = [
  {
    term: "Dharma",
    nativeScript: "धर्म",
    language: "Sanskrit",
    pronunciation: "dhuh-rmuh",
    religion: "hinduism",
    literalMeaning: "That which sustains, upholds, or supports.",
    etymologicalRoot: "Derived from the Sanskrit root 'dhṛ' (धृ), meaning 'to hold fast', 'preserve', or 'maintain'.",
    contextExplanation: "In Hindu and Vedic scripture (like the Bhagavad Gita and Upanishads), Dharma denotes the cosmic order, moral righteousness, sacred duty, and the essential nature of reality. It represents the path that keeps individuals and society in harmony with the cosmos.",
    scriptureRef: "Bhagavad Gita 2.31, 4.7-8",
    interfaithEcho: {
      tradition: "Classical Greek / Christian",
      concept: "Logos (Λόγος)",
      description: "Just as Dharma is the cosmic order sustaining creation, Logos represents the divine cosmic reason and truth that underlies and orders the universe."
    }
  },
  {
    term: "Logos",
    nativeScript: "Λόγος",
    language: "Ancient Greek",
    pronunciation: "loh-gohs",
    religion: "christianity",
    literalMeaning: "Word, speech, reason, or cosmic principle.",
    etymologicalRoot: "From the Greek verb 'legō' (λέγω), meaning 'to gather', 'speak', or 'lay out in order'.",
    contextExplanation: "In the New Testament (primarily the Prologue of the Gospel of John), Logos represents the divine Word and creative order of God made manifest. It bridges ancient Greek philosophical concepts of cosmic reason with early theological scripture.",
    scriptureRef: "Gospel of John 1:1-14",
    interfaithEcho: {
      tradition: "Hinduism / Buddhist",
      concept: "Dharma / Rta",
      description: "Logos serves as the fundamental ordering principle of all existence, echoing the ancient Indian concept of Rta (cosmic rhythm) and Dharma (universal law)."
    }
  },
  {
    term: "Teshuvah",
    nativeScript: "תְּשׁוּבָה",
    language: "Biblical Hebrew",
    pronunciation: "teh-shoo-vah",
    religion: "judaism",
    literalMeaning: "To return, to turn back.",
    etymologicalRoot: "From the Hebrew root 'shuv' (שוב), meaning 'to return', 'revert', or 'turn toward'.",
    contextExplanation: "Often translated as 'repentance', Teshuvah in the Torah and Jewish scriptures represents a holistic return to God, to one's moral self, and to communal harmony. Rather than mere passive guilt, it is an active recalibration of one's actions, habits, and spirit.",
    scriptureRef: "Torah (Deuteronomy 30:2), Prophets (Hosea 14:1)",
    interfaithEcho: {
      tradition: "Islamic",
      concept: "Tawbah (توبة)",
      description: "Both terms share Semitic etymological roots denoting a 'turning back' or returning to the divine path after wandering, highlighting active behavioral reform."
    }
  },
  {
    term: "Taqwa",
    nativeScript: "تقوى",
    language: "Classical Arabic",
    pronunciation: "tuhq-wah",
    religion: "islam",
    literalMeaning: "To shield, protect, or guard.",
    etymologicalRoot: "Derived from the Arabic root 'w-q-y' (و ق ي), meaning 'to protect against harm', 'shield', or 'preserve'.",
    contextExplanation: "In the Quran, Taqwa represents a state of conscious, loving mindfulness of God. It is often translated as 'piety', 'god-consciousness', or 'self-restraint'. It acts as an inner moral compass that shields the soul from spiritual and ethical decay.",
    scriptureRef: "Quran 2:2-5, 49:13",
    interfaithEcho: {
      tradition: "Christian / Jewish",
      concept: "Yir'at Shamayim (יראת שמים)",
      description: "Translates as 'Awe or Reverence of Heaven'—representing an omnipresent, respectful awareness of the Divine that naturally inspires moral rectitude."
    }
  },
  {
    term: "Ahimsa",
    nativeScript: "अहिंसा",
    language: "Sanskrit",
    pronunciation: "uh-him-sah",
    religion: "jainism",
    literalMeaning: "Non-injury, complete non-violence.",
    etymologicalRoot: "Formed by the negative prefix 'a-' (non) and 'hiṃsā' (harm, slaughter), from the desiderative form of the root 'han' (to strike or kill).",
    contextExplanation: "Found in Jain, Buddhist, and Hindu scriptures (including Upanishadic texts), Ahimsa is the supreme ethical absolute of practicing complete harmlessness in action, speech, and inner thought toward all living entities, recognizing the sacred spark of consciousness in everything.",
    scriptureRef: "Jain Acharanga Sutra, Yoga Sutras of Patanjali 2.30",
    interfaithEcho: {
      tradition: "Christian / Sermon on the Mount",
      concept: "Peacemaking / Pacifism",
      description: "Mirroring Jesus's sermon to turn the other cheek and love one's enemies, Ahimsa is a highly proactive force of unconditional goodwill and active defense of life."
    }
  },
  {
    term: "Metta",
    nativeScript: "मेत्ता",
    language: "Pali",
    pronunciation: "met-tah",
    religion: "buddhism",
    literalMeaning: "Loving-kindness, friendliness, benevolence.",
    etymologicalRoot: "Derived from 'mitra' (Sanskrit मित्र), meaning 'friend' or 'companion'.",
    contextExplanation: "In the Buddhist Pali Canon, Metta is the cultivation of boundless, unconditional loving-kindness toward all sentient beings in the universe. It is the first of the four 'Brahma-viharas' (Sublime Abodes) and is practiced to purify the mind of anger, ill-will, and sensory bias.",
    scriptureRef: "Karaniya Metta Sutta (Sutta Nipata 1.8)",
    interfaithEcho: {
      tradition: "Christian / Classical Greek",
      concept: "Agape (Ἀγάπη)",
      description: "Agape represents the highest form of selfless, universal, and non-possessive love, echoing the Buddhist ideal of radiating Metta to all creatures without bias."
    }
  },
  {
    term: "Hesed",
    nativeScript: "חֶסֶד",
    language: "Biblical Hebrew",
    pronunciation: "kheh-sed",
    religion: "judaism",
    literalMeaning: "Loyal love, covenantal kindness, mercy.",
    etymologicalRoot: "Derived from a Semitic root suggesting 'firm commitment', 'bending down to show kindness', or 'devotion'.",
    contextExplanation: "A cornerstone concept in the Hebrew Bible, Hesed is not just a passive feeling but an active, committed love. It describes God's absolute faithfulness to the covenantal relationship with humanity, and the reciprocating loving-kindness that humans are commanded to show one another.",
    scriptureRef: "Psalms 136 (repeatedly), Micah 6:8",
    interfaithEcho: {
      tradition: "Islamic",
      concept: "Rahmah (رحمة)",
      description: "Rahmah represents the boundless, encompassing mercy and grace of God, flowing into creation and calling humans to act with loving-mercy toward one another."
    }
  },
  {
    term: "Sophia",
    nativeScript: "Σοφία",
    language: "Ancient Greek",
    pronunciation: "soh-fee-uh",
    religion: "christianity",
    literalMeaning: "Wisdom, skill, insight.",
    etymologicalRoot: "Greek noun associated with clarity, mental refinement, and mastery of arts or divine principles.",
    contextExplanation: "In biblical wisdom literature, Sophia is the personification of Divine Wisdom. Representing the light by which God structured creation, she invites seekers to live with temperance, foresight, and ethical alignment. It bridges philosophical research with mystical contemplation.",
    scriptureRef: "Proverbs 8:22-31, Book of Wisdom (Apocrypha)",
    interfaithEcho: {
      tradition: "Hindu / Buddhist",
      concept: "Prajna / Saraswati",
      description: "Prajna (intuitive transcendental wisdom) and Saraswati (the divine personification of wisdom, learning, and fine arts) mirror the sublime attributes of Sophia."
    }
  },
  {
    term: "Shunyata",
    nativeScript: "शून्यता",
    language: "Sanskrit",
    pronunciation: "shoon-yah-tah",
    religion: "buddhism",
    literalMeaning: "Emptiness, voidness, spaciousness.",
    etymologicalRoot: "From 'śūnya' (zero, empty) combined with the abstract noun suffix '-tā' (ness).",
    contextExplanation: "A crucial Mahayana Buddhist doctrine, Shunyata asserts that all things are 'empty' of a separate, permanent, independent essence. Instead, everything exists in deep interdependent co-arising (Pratītyasamutpāda). It is the source of boundless potential and the ultimate basis of inter-being.",
    scriptureRef: "Heart Sutra (Prajnaparamita Hridaya)",
    interfaithEcho: {
      tradition: "Christian Mysticism",
      concept: "Kenosis (Kένωσις)",
      description: "Kenosis refers to the 'self-emptying' of one's ego or personal will to become completely receptive to the divine, mirroring how realizing emptiness dissolves ego-clinging."
    }
  },
  {
    term: "Shalom",
    nativeScript: "שָׁלוֹם",
    language: "Biblical Hebrew",
    pronunciation: "shah-lohm",
    religion: "judaism",
    literalMeaning: "Peace, wholeness, completeness, safety.",
    etymologicalRoot: "From the Hebrew root 'sh-l-m' (שלם), meaning 'to be complete', 'make whole', or 'restore'.",
    contextExplanation: "In Jewish scriptures, Shalom is far more than the simple absence of conflict or war. It is a state of active harmony, physical security, moral completeness, spiritual wholeness, and collective prosperity under divine blessing. It is both a human duty and a divine name.",
    scriptureRef: "Numbers 6:24-26, Isaiah 9:6",
    interfaithEcho: {
      tradition: "Islamic",
      concept: "Salam (سلام)",
      description: "Sharing the identical Semitic root, Salam is a cornerstone Quranic greeting and a Name of Allah, representing the ultimate peace of surrender and dynamic harmony."
    }
  }
];

export default function WordOfTheDayComponent() {
  const [dayIndex, setDayIndex] = useState(0);
  const [isDeepened, setIsDeepened] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate deterministic index based on today's date
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const stableHash = (day * 3 + month * 7 + year) % WORD_OF_THE_DAY_REGISTRY.length;
    setDayIndex(stableHash);
  }, []);

  const activeWord = WORD_OF_THE_DAY_REGISTRY[dayIndex];

  const handleShuffle = () => {
    let nextIndex = dayIndex;
    while (nextIndex === dayIndex) {
      nextIndex = Math.floor(Math.random() * WORD_OF_THE_DAY_REGISTRY.length);
    }
    setDayIndex(nextIndex);
    setIsDeepened(false);
    setCopied(false);
  };

  const handleCopy = () => {
    const shareText = `Scripture Word of the Day:
📖 Term: ${activeWord.term} (${activeWord.nativeScript})
🗣️ Pronunciation: /${activeWord.pronunciation}/
🌐 Language: ${activeWord.language} | Tradition: ${activeWord.religion.toUpperCase()}
💡 Literal Meaning: ${activeWord.literalMeaning}
📜 Root: ${activeWord.etymologicalRoot}
📝 Context: ${activeWord.contextExplanation}
📍 Reference: ${activeWord.scriptureRef}`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get matching religion styling details
  const getReligionBadgeStyle = (religion: string) => {
    switch (religion) {
      case "hinduism":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "christianity":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "judaism":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "islam":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "jainism":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "buddhism":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div 
      id="scripture-word-of-the-day-card"
      className="bg-gradient-to-br from-[#12131a] via-[#0e0f15] to-[#0b0c10] border border-amber-500/15 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-amber-500/30"
    >
      {/* Absolute Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/[0.01] rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400 shadow-inner">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">
              Daily Wisdom Highlight
            </span>
            <h3 id="wod-title" className="text-sm font-sans font-semibold text-slate-200 flex items-center gap-1.5">
              Scripture Word of the Day
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-500/60" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Main Term Display */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeWord.term}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="py-5 space-y-4 relative z-10"
        >
          {/* Main word line */}
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h2 id="wod-term" className="text-3xl sm:text-4xl font-display font-light text-white tracking-tight">
              {activeWord.term}
            </h2>
            <span id="wod-nativescript" className="text-xl sm:text-2xl font-serif text-amber-500/80 font-light px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/5">
              {activeWord.nativeScript}
            </span>
            <span id="wod-pronunciation" className="text-xs font-mono text-slate-400 tracking-wide">
              /{activeWord.pronunciation}/
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span id="wod-language-badge" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium font-mono bg-white/5 text-slate-300 border border-white/10">
              <Languages className="w-3 h-3 text-slate-400" />
              <span>{activeWord.language}</span>
            </span>

            <span 
              id="wod-tradition-badge" 
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium font-mono border ${getReligionBadgeStyle(activeWord.religion)}`}
            >
              <Compass className="w-3 h-3" />
              <span className="capitalize">{activeWord.religion === "interfaith" ? "Interfaith Echo" : RELIGION_LABELS[activeWord.religion as ReligionType] || activeWord.religion}</span>
            </span>

            <span id="wod-ref-badge" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium font-mono bg-amber-500/[0.04] text-amber-300/90 border border-amber-500/10">
              <BookOpen className="w-3 h-3 text-amber-500/50" />
              <span>{activeWord.scriptureRef}</span>
            </span>
          </div>

          {/* Meaning Section */}
          <div className="space-y-3 bg-white/[0.01] border border-white/5 rounded-xl p-3.5">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-0.5">
                Literal Meaning
              </span>
              <p id="wod-literal" className="text-sm text-slate-100 font-sans font-medium">
                {activeWord.literalMeaning}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-amber-500/50" />
                <span>Etymological Root</span>
              </span>
              <p id="wod-root" className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed italic">
                {activeWord.etymologicalRoot}
              </p>
            </div>
          </div>

          {/* Contextual Explanation */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Scriptural Context & Theological Depth
            </span>
            <p id="wod-explanation" className="text-sm text-slate-300 font-serif leading-relaxed">
              {activeWord.contextExplanation}
            </p>
          </div>

          {/* Collapsible Interfaith Echo Section */}
          <AnimatePresence>
            {isDeepened && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div id="wod-echo-panel" className="mt-2 bg-gradient-to-r from-amber-950/20 to-stone-900/30 border border-amber-500/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-bold tracking-wider uppercase text-[10px]">Interfaith Reflection & Echo</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-serif">
                    The profound spiritual essence of <strong className="text-slate-100">{activeWord.term}</strong> ripples beautiful parallels into other sacred traditions. In the <strong className="text-amber-300">{activeWord.interfaithEcho.tradition}</strong> tradition, it mirrors the concept of <strong className="text-slate-100 font-sans">{activeWord.interfaithEcho.concept}</strong>:
                  </p>
                  <p className="text-xs text-amber-200/90 leading-relaxed font-serif italic border-l-2 border-amber-500/20 pl-2.5 py-0.5">
                    &ldquo;{activeWord.interfaithEcho.description}&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Card Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <button
            id="wod-deepen-btn"
            onClick={() => setIsDeepened(!isDeepened)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 border ${
              isDeepened 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-inner" 
                : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
            }`}
            title="Expand to read comparative interfaith wisdom parallels"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{isDeepened ? "Hide Interfaith Parallel" : "Compare Interfaith Parallel"}</span>
          </button>

          <button
            id="wod-copy-btn"
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 cursor-pointer transition-all duration-200 flex items-center gap-1.5"
            title="Copy this term with its root and explanation"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400 animate-scale-in" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-xs font-medium hidden sm:inline">{copied ? "Copied" : "Copy Meaning"}</span>
          </button>
        </div>

        <button
          id="wod-shuffle-btn"
          onClick={handleShuffle}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black border border-transparent shadow-md shadow-amber-950/20 flex items-center gap-1.5 transition-all cursor-pointer font-sans"
          title="Study another ancient scripture key term"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Explore Next Term</span>
        </button>
      </div>
    </div>
  );
}
