import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  ShieldAlert,
  Loader2,
  Bookmark,
  Compass,
  ArrowRight,
  Info,
  Volume2,
  VolumeX
} from "lucide-react";
import { SACRED_CHARACTERS } from "../charactersRegistry";
import { SCRIPTURE_BOOKS, RELIGION_LABELS } from "../scripturesRegistry";
import { SacredCharacter, ScriptureBook } from "../types";

export function getCharacterImage(char: SacredCharacter): { url: string; caption: string } {
  // Custom curated map for gorgeous Unsplash visuals representing characters (reverent spiritual imagery first)
  switch (char.key) {
    case "odin":
      return {
        url: "https://images.unsplash.com/photo-1608988220025-a74ef43d463e?auto=format&fit=crop&w=600&q=80",
        caption: "Runic stone carvings of ancient mythological deities, representing Odin's sacred sacrifice to acquire cosmic writing codes."
      };
    case "thor":
      return {
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        caption: "A dramatic burst of lightning illuminating ancient mountain ranges, symbolizing Thor's divine lightning and Mjolnir's cosmic thunder."
      };
    case "freya":
      return {
        url: "https://images.unsplash.com/photo-1548625361-155deee223d5?auto=format&fit=crop&w=600&q=80",
        caption: "Glorious stained-glass colors casting radiant light representing Freya, the goddess of beauty, love, and sacred magic."
      };
    case "krishna":
      return {
        url: "https://images.unsplash.com/photo-1615672924033-f111815e9ff0?auto=format&fit=crop&w=600&q=80",
        caption: "Sovereign illustration of Lord Krishna playing his divine reed flute, representing Bhakti and infinite love."
      };
    case "shiva":
      return {
        url: "https://images.unsplash.com/photo-1609137144813-94c632616238?auto=format&fit=crop&w=600&q=80",
        caption: "Sovereign illustration of supreme Lord Shiva meditating in absolute quietude, representing transcendence."
      };
    case "rama":
      return {
        url: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=600&q=80",
        caption: "Gilded visualization of Lord Rama with his bow, representing the path of righteousness."
      };
    case "yeshu":
      return {
        url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80",
        caption: "A beautiful Holy Cross shining with divine rays under starry skies, embodying Jesus Christ's grace and global message of love."
      };
    case "mohammad":
      return {
        url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80",
        caption: "The sacred minarets of the Prophet's Mosque in Medina rising under a starry night sky, reflecting deep Islamic monotheistic devotion."
      };
    case "abraham":
      return {
        url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80",
        caption: "Ancient high stone walls of a historical mountain sanctuary, representing Abraham's covenant under the infinite stars."
      };
    case "buddha":
      return {
        url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=600&q=80",
        caption: "A stunning golden statue of Lord Buddha meditating peacefully, declaring mindfulness and the cessation of suffering."
      };
    case "mahavir_swami":
      return {
        url: "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80",
        caption: "Sovereign, intricately carved marble temple pillars of a sacred Jain temple, invoking absolute non-injury and self-realization."
      };
    case "john_baptist":
      return {
        url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
        caption: "A pristine celestial river flowing under warm sunbeams, bringing clean water for baptism and spiritual repentance."
      };
    case "david":
      return {
        url: "https://images.unsplash.com/photo-1543728770-9d485141012f?auto=format&fit=crop&w=600&q=80",
        caption: "Traditional script and sacred scrolls bearing the Star of David, symbolizing the royal singer of Psalms."
      };
    case "achilles":
      return {
        url: "https://images.unsplash.com/photo-1531572753726-0fd02dd4245c?auto=format&fit=crop&w=600&q=80",
        caption: "An ancient classic marble temple wall with tall columns dedicated to the gods, symbolizing Greek heroic epic legends."
      };
    case "sun_wukong":
      return {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
        caption: "An ancient Buddhist pagoda rising from the mountain forests of China, marking the sacred path of the pilgrims."
      };
    case "alexander":
      return {
        url: "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&w=600&q=80",
        caption: "The majestic Parthenon on the Athenian Acropolis, representing ancient empires and sovereign temples."
      };
    case "caesar":
      return {
        url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
        caption: "The Roman Forum's grand stone arches and ancient temples, recalling classic Roman history and sovereign rulers."
      };
    case "gilgamesh":
      return {
        url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80",
        caption: "Stately temple columns and ancient stone ruins from early Mesopotamian origins, expressing King Gilgamesh's legacy."
      };
    default: {
      if (char.imageUrl) {
        return { url: char.imageUrl, caption: char.imageCaption || "Canonical descriptive visualization." };
      }
      const r = (char.religion || "").toLowerCase();
      if (r === "hinduism") {
        return {
          url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=600&q=80",
          caption: "The Supreme OM (Aum) Resonance, representing Sanatana Dharma."
        };
      }
      return {
        url: "https://www.shutterstock.com/image-photo/open-bible-holy-book-ancient-260nw-1830639521.jpg",
        caption: "An open sacred book reflecting detailed calligraphic texts, representing the shared literary lineage of human wisdom."
      };
    }
  }
}

interface CharactersExploreProps {
  onSelectBook: (book: ScriptureBook, portionRef?: string) => void;
  highThinking?: boolean;
  onSpeakText?: (text: string, title?: string) => void;
  isSpeakingGlobal?: boolean;
  targetLanguage?: string;
  customImages?: { [key: string]: string };
}

export default function CharactersExplore({ 
  onSelectBook, 
  highThinking,
  onSpeakText,
  isSpeakingGlobal,
  targetLanguage = "English",
  customImages = {}
}: CharactersExploreProps) {
  const resolveCharImage = (char: SacredCharacter) => {
    if (customImages && customImages[char.key]) {
      return {
        url: customImages[char.key],
        caption: char.imageCaption || `Customized illustration for ${char.name}.`
      };
    }
    return getCharacterImage(char);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReligion, setSelectedReligion] = useState<string>("all");
  const [selectedChar, setSelectedChar] = useState<SacredCharacter | null>(SACRED_CHARACTERS[3]); // Default to Lord Krishna
  const [lightboxChar, setLightboxChar] = useState<SacredCharacter | null>(null);

  // Multilingual Translated Profile States
  const [translatedProfile, setTranslatedProfile] = useState<{
    role: string;
    summary: string;
    detailedEthos: string;
    story: string;
    interfaithEcho: string;
  } | null>(null);
  const [isTranslatingProfile, setIsTranslatingProfile] = useState(false);

  useEffect(() => {
    if (!selectedChar) {
      setTranslatedProfile(null);
      return;
    }

    if (!targetLanguage || targetLanguage === "English") {
      setTranslatedProfile(null);
      return;
    }

    let isSubscribed = true;
    setIsTranslatingProfile(true);

    fetch("/api/characters/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterKey: selectedChar.key,
        characterName: selectedChar.name,
        role: selectedChar.role,
        summary: selectedChar.summary,
        detailedEthos: selectedChar.detailedEthos,
        story: selectedChar.story,
        interfaithEcho: selectedChar.interfaithEcho,
        translateProfile: true,
        targetLanguageKey: targetLanguage,
        highThinking
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Translation failed");
      return res.json();
    })
    .then(data => {
      if (isSubscribed) {
        setTranslatedProfile(data);
        setIsTranslatingProfile(false);
      }
    })
    .catch(err => {
      console.warn("Error translating character profile on-the-fly:", err);
      if (isSubscribed) {
        setIsTranslatingProfile(false);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [selectedChar, targetLanguage, highThinking]);

  const currentRole = translatedProfile?.role || selectedChar?.role || "";
  const currentSummary = translatedProfile?.summary || selectedChar?.summary || "";
  const currentDetailedEthos = translatedProfile?.detailedEthos || selectedChar?.detailedEthos || "";
  const currentStory = translatedProfile?.story || selectedChar?.story || "";
  const currentInterfaithEcho = translatedProfile?.interfaithEcho || selectedChar?.interfaithEcho || "";

  // AI Story Weaver States
  const [aiStory, setAiStory] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [weaverPrompt, setWeaverPrompt] = useState("");
  const [weaverSuccess, setWeaverSuccess] = useState(false);

  // Filter Characters
  const filteredCharList = SACRED_CHARACTERS.filter((char) => {
    const matchesQuery =
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.attributes.some((attr) => attr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      char.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesReligion = selectedReligion === "all" || char.religion === selectedReligion;

    return matchesQuery && matchesReligion;
  });

  // Handle jump to reader
  const handleJumpToScripture = (refBook: { bookKey: string }) => {
    const matchedBook = SCRIPTURE_BOOKS.find((b) => b.key === refBook.bookKey);
    if (matchedBook) {
      onSelectBook(matchedBook, "1");
    }
  };

  // Run AI Story Weaver
  const handleLaunchWeaver = async (customPrompt?: string) => {
    if (!selectedChar) return;
    const finalPrompt = customPrompt || weaverPrompt || `Tell me a detailed theological and comparative story about ${selectedChar.name}.`;
    
    setAiLoading(true);
    setAiError(null);
    setAiStory(null);
    setWeaverSuccess(false);

    try {
      const response = await fetch("/api/characters/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterKey: selectedChar.key,
          characterName: selectedChar.name,
          role: selectedChar.role,
          prompt: finalPrompt,
          highThinking // Passed directly to AI models!
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error status (${response.status})`);
      }

      const data = await response.json();
      setAiStory(data.story || "Failed to generate story content.");
      setWeaverSuccess(true);
    } catch (err: any) {
      console.warn("AI Story Weaver failed, loading comprehensive backup narrative comparison.", err);
      // Beautiful offline alternative comparing their ethos
      setTimeout(() => {
        setAiStory(
          `## Comparative Chronicle: ${selectedChar.name} & The Cosmic Fabric\n\n` +
          `Throughout human epics, figures like **${selectedChar.name}** serve as vital mirrors for our deepest spiritual values. ` +
          `In this study of *${selectedChar.role}*, we observe how their key traits of **${selectedChar.attributes.join(", ")}** ` +
          `harmonize across human boundaries.\n\n` +
          `### 1. The Core Legend Refined\n` +
          `During antiquity, the tales surrounding ${selectedChar.name} were chanted to inspire courage and moral discipline. ` +
          `Whether navigating absolute exile, drinking cosmic poison, or seeking runic wisdom, they illustrate that real leadership ` +
          `requires dissolving self-absorbed pride in favor of cosmic duty (Dharma) or charity (Agape).\n\n` +
          `### 2. Universal Interfaith Parallelisms\n` +
          `- **Selfless Surrender:** The absolute submission displayed in this narrative matches the Hebrew devotion of Abraham (Ibrahim) welcoming travelers or Jesus praying in Gethsemane.\n` +
          `- **Ethical Integrity:** Facing extreme trials with complete inner equanimity perfectly balances the non-violence (Ahimsa) taught by Mahavira and the psychological mindfulness of Gautam Buddha.\n\n` +
          `*Note: To unleash unlimited, personalized live AI Chronicles covering original manuscript analyses, configure your Gemini API Key in the Settings panel.*`
        );
        setWeaverSuccess(true);
      }, 1000);
    } finally {
      setAiLoading(false);
    }
  };

  // Relgion tags with labels
  const religionOptions = [
    { key: "all", label: "All Traditions" },
    { key: "hinduism", label: "Hinduism" },
    { key: "christianity", label: "Christianity" },
    { key: "judaism", label: "Judaism" },
    { key: "buddhism", label: "Buddhism" },
    { key: "jainism", label: "Jainism" },
    { key: "mythology", label: "Mythology & Lore" },
    { key: "history", label: "Historical Epics" }
  ];

  // Specific color helper
  const getCharAccentColor = (rel: string) => {
    switch (rel) {
      case "hinduism": return "border-amber-500/20 text-amber-400 bg-amber-500/10";
      case "christianity": return "border-indigo-500/20 text-indigo-400 bg-indigo-500/10";
      case "judaism": return "border-blue-500/20 text-blue-400 bg-blue-500/10";
      case "buddhism": return "border-rose-500/20 text-rose-400 bg-rose-500/10";
      case "jainism": return "border-orange-500/20 text-orange-400 bg-orange-500/10";
      case "mythology": return "border-violet-500/20 text-violet-400 bg-violet-500/10";
      case "history": return "border-cyan-500/20 text-cyan-400 bg-cyan-500/10";
      default: return "border-slate-500/20 text-slate-400 bg-slate-500/10";
    }
  };

  const getCharBannerGradient = (rel: string) => {
    switch (rel) {
      case "hinduism": return "from-amber-600/20 via-amber-950/10 to-transparent border-amber-500/20";
      case "christianity": return "from-indigo-600/20 via-indigo-950/10 to-transparent border-indigo-500/20";
      case "judaism": return "from-blue-600/20 via-blue-950/10 to-transparent border-blue-500/20";
      case "buddhism": return "from-rose-600/20 via-rose-950/10 to-transparent border-rose-500/20";
      case "jainism": return "from-orange-600/20 via-orange-950/10 to-transparent border-orange-500/20";
      case "mythology": return "from-violet-600/20 via-violet-950/10 to-transparent border-violet-500/20";
      case "history": return "from-cyan-600/20 via-cyan-950/10 to-transparent border-cyan-500/20";
      default: return "from-slate-600/20 via-slate-950/10 to-transparent border-slate-500/20";
    }
  };

  const getCharGlowIndicator = (rel: string) => {
    switch (rel) {
      case "hinduism": return "bg-amber-500 shadow-amber-500/50";
      case "christianity": return "bg-indigo-500 shadow-indigo-500/50";
      case "judaism": return "bg-blue-500 shadow-blue-500/50";
      case "buddhism": return "bg-rose-500 shadow-rose-500/50";
      case "jainism": return "bg-orange-500 shadow-orange-500/50";
      case "mythology": return "bg-violet-500 shadow-violet-500/50";
      case "history": return "bg-cyan-500 shadow-cyan-500/50";
      default: return "bg-slate-500 shadow-slate-500/50";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* Introduction Banner header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 p-1 px-2.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Divine Pantheons & Classical Epics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display text-white">Sacred Characters & Divine Stories</h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-serif max-w-3xl">
          Explore the epic legends of celebrated figures including Hindu avatars, Norse deities, Abrahamic covenants, and legendary sages. Analyze their stories, moral roles, and interfaith connections.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters, stories, or virtues..."
            className="w-full bg-[#0d0d12] border border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-slate-200"
          />
        </div>

        {/* Filters chips */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-start md:justify-end overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {religionOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelectedReligion(opt.key)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap cursor-pointer transition-all ${
                selectedReligion === opt.key
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/55"
                  : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

      </div>

      {/* Layout Split: Cards Grid (Left) & Deep Dive Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIST of FIGURE CARDS */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              Figures Found ({filteredCharList.length})
            </span>
          </div>

          {filteredCharList.length === 0 ? (
            <div className="py-12 text-center p-6 bg-white/[0.01] border border-dashed border-white/10 rounded-xl">
              <p className="text-sm font-serif text-slate-400">No characters matching query.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedReligion("all");
                }}
                className="text-xs text-amber-500 hover:underline mt-2 font-mono"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredCharList.map((char) => {
              const isSelected = selectedChar?.key === char.key;
              const charImg = resolveCharImage(char);
              return (
                <div
                  id={`char-card-${char.key}`}
                  key={char.key}
                  onClick={() => {
                    setSelectedChar(char);
                    setAiStory(null);
                    setWeaverPrompt("");
                    setAiError(null);
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-2.5 relative overflow-hidden group ${
                    isSelected
                      ? "bg-white/[0.04] border-amber-500/50 shadow-md shadow-black/40"
                      : "bg-[#0b0b0f] border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
                  }`}
                >
                  {/* Glowing background hint on selected */}
                  {isSelected && (
                    <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div className="flex items-start gap-3 relative z-10">
                    {/* AVATAR IMAGE */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 group-hover:border-amber-400/40 transition-colors shadow-lg">
                      <img 
                        src={charImg.url} 
                        alt={char.name} 
                        className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>
                    {/* CHARACTER TEXT DETAILS */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-amber-300 transition-colors truncate">
                            {char.name}
                          </h3>
                        </div>
                        <span className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${getCharAccentColor(char.religion)}`}>
                          {RELIGION_LABELS[char.religion] || char.religion}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        {char.role}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-serif pl-1">
                    {char.summary}
                  </p>

                  {/* Attributes chips */}
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {char.attributes.map((attr) => (
                      <span
                        key={attr}
                        className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>

                  {/* Active selector light */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
                    isSelected ? "bg-amber-500" : "bg-transparent"
                  }`} />
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: DETAILED VIEW PANEL */}
        <div className="lg:col-span-7 space-y-5">
          {selectedChar ? (
            <div className={`border border-white/10 rounded-2xl overflow-hidden bg-[#0d0d12] shadow-xl p-0 space-y-6 relative`}>
              
              {/* MAGNIFICENT 16:9 HEADER BANNER */}
              <div className="relative h-60 sm:h-72 overflow-hidden group">
                <img 
                  src={resolveCharImage(selectedChar).url} 
                  alt={selectedChar.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                {/* Visual shadow gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/40 to-transparent"></div>
                
                {/* Floating Content over the Banner */}
                <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 z-10">
                  <div className="space-y-1 bg-black/75 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 max-w-full sm:max-w-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${getCharGlowIndicator(selectedChar.religion)} shadow-lg animate-pulse`}></span>
                      <h2 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight truncate">
                        {selectedChar.name}
                      </h2>
                    </div>
                    <p className="text-[11px] text-amber-300 font-mono truncate">
                      {selectedChar.role}
                    </p>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 bg-black/75 backdrop-blur-sm p-2 px-3.5 rounded-lg border border-white/5">
                    <span className={`text-[10px] font-mono px-3 py-0.5 rounded-full uppercase font-bold ${getCharAccentColor(selectedChar.religion)}`}>
                      {RELIGION_LABELS[selectedChar.religion]}
                    </span>
                    {selectedChar.originalName && (
                      <span className="text-[11px] font-serif font-bold text-amber-200/80 tracking-wider">
                        {selectedChar.originalName}
                      </span>
                    )}
                  </div>
                </div>

                {/* View Art details indicator button click action */}
                <button
                  id="view-artwork-detail-btn"
                  onClick={() => setLightboxChar(selectedChar)}
                  className="absolute top-4 right-4 bg-black/80 hover:bg-black text-[10px] text-amber-300 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 font-mono shadow-lg cursor-pointer transition-colors z-10"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Art Details</span>
                </button>
              </div>

              {/* Rest of padding wrapper */}
              <div className="px-5 sm:px-6 pb-6 space-y-6">
                {/* Attributes & Key info block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.01] p-4 rounded-xl border border-white/5">
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block font-bold">
                    Primary Cosmic Virtues
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedChar.attributes.map((attr) => (
                      <span
                        key={attr}
                        className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedChar.scriptureRef && (
                  <div className="space-y-1 sm:border-l border-white/5 sm:pl-4">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block font-bold">
                      Canonical Scripture
                    </span>
                    <button
                      id={`jump-scripture-btn-${selectedChar.key}`}
                      onClick={() => handleJumpToScripture(selectedChar.scriptureRef!)}
                      className="text-xs text-amber-400 font-semibold hover:text-amber-300 flex items-center space-x-1 hover:underline text-left cursor-pointer outline-none pt-0.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedChar.scriptureRef.bookTitle}</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-500 shrink-0" />
                    </button>
                  </div>
                )}
              </div>

              {/* Detailed Ethos Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-extrabold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-500" /> Sacred Ethos & Ethical Concept
                </h4>
                <p className="text-sm font-serif leading-relaxed text-slate-300 pb-2">
                  {selectedChar.detailedEthos}
                </p>
              </div>

              {/* Story Narrative Box */}
              <div className="p-5 bg-stone-950/40 border border-white/5 rounded-2xl space-y-3.5 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/[0.01] rounded-full blur-2xl pointer-events-none border border-transparent" />
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-extrabold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-500" /> The Legendary Chronicle
                  </h4>
                  {onSpeakText && (
                    <button
                      onClick={() => onSpeakText(selectedChar.story, `${selectedChar.name} Chronicle`)}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-400 font-black transition-all flex items-center gap-1 cursor-pointer border border-amber-500/30"
                      title="Read Legendary Story Aloud with AI"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Narrate Story</span>
                    </button>
                  )}
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-stone-100 font-serif border-l border-amber-500/20 pl-4 whitespace-pre-line italic">
                  &ldquo;{selectedChar.story}&rdquo;
                </p>
              </div>

              {/* Interfaith Echo Section */}
              <div className="p-4 bg-gradient-to-r from-blue-950/10 to-indigo-950/10 border border-indigo-500/10 rounded-xl space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-extrabold">
                  Cross-Cultural & Interfaith Echo
                </h4>
                <p className="text-xs sm:text-sm font-serif leading-relaxed text-slate-300">
                  {selectedChar.interfaithEcho}
                </p>
              </div>

              {/* AI STORY WEAVER SECTION */}
              <div className="p-5 border border-amber-500/15 rounded-2xl bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h4 className="text-xs font-mono text-amber-300 uppercase tracking-widest font-bold">
                    Divine AI Story Weaver
                  </h4>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 font-serif leading-relaxed">
                  Generate beautiful custom tales, compare this character's virtues with other traditions, or study original linguistic terms associated with them.
                </p>

                {/* Suggested chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    `Detail the origin of ${selectedChar.name}'s virtues`,
                    `Compare ${selectedChar.name} with other world guardians`,
                    `Explain a story highlighting ${selectedChar.name}'s ultimate challenge`,
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setWeaverPrompt(chip);
                        handleLaunchWeaver(chip);
                      }}
                      className="text-[10px] font-mono text-slate-300 bg-white/5 hover:text-white hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/5 transition-all text-left max-w-xs truncate cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Custom text Area */}
                <div className="flex gap-2.5 items-center">
                  <input
                    type="text"
                    value={weaverPrompt}
                    onChange={(e) => setWeaverPrompt(e.target.value)}
                    placeholder="Enter custom comparative prompt (e.g., 'Compare Odin and Shiva's cosmic eye sacrifice')..."
                    className="flex-1 bg-[#09090d] border border-white/10 p-2 text-xs rounded-xl focus:outline-none focus:border-amber-500 text-slate-200 font-serif"
                  />
                  <button
                    id="trigger-weaver-btn"
                    onClick={() => handleLaunchWeaver()}
                    disabled={aiLoading}
                    className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Weave</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Render Weaver Result */}
                {aiLoading && (
                  <div className="py-8 text-center space-y-2">
                    <Loader2 className="w-7 h-7 text-amber-500 animate-spin mx-auto" />
                    <p className="text-xs font-mono text-slate-400">Chronicle scribe consulting ancient texts... please wait.</p>
                  </div>
                )}

                {!aiLoading && weaverSuccess && aiStory && (
                  <div className="p-4 sm:p-5 bg-black/60 border border-white/15 rounded-xl space-y-3 shadow-inner">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                          Retrieved Legendary Chronicles
                        </span>
                        {onSpeakText && (
                          <button
                            onClick={() => onSpeakText(aiStory, "Custom Woven Tale")}
                            className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 font-bold transition-all flex items-center gap-1 cursor-pointer border border-amber-500/20"
                            title="Speak Woven Tale Aloud"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Read Out loud</span>
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setAiStory(null);
                          setWeaverSuccess(false);
                          setWeaverPrompt("");
                        }}
                        className="text-[9px] font-mono text-slate-500 hover:text-white"
                      >
                        Dismiss
                      </button>
                    </div>

                    <div className="markdown-body font-serif text-slate-200 text-xs sm:text-sm space-y-3 leading-relaxed whitespace-pre-wrap">
                      {aiStory}
                    </div>

                    <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 font-mono text-right">
                      Source: Academic Interfaith AI Chronicles
                    </div>
                  </div>
                )}
              </div>

              </div> {/* Close px-5 sm:px-6 padding container */}
            </div>
          ) : (
            <div className="py-24 text-center p-8 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-2">
              <Compass className="w-8 h-8 text-slate-500 animate-bounce" />
              <p className="text-sm font-serif text-slate-400">Select a sacred character profile from the left list to begin studying their epic narrative legacy.</p>
            </div>
          )}
        </div>

      </div>

      {/* CHARACTER LIGHTBOX MODAL */}
      {lightboxChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0c0c10] border border-amber-500/30 max-w-2xl w-full rounded-2xl overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Full-width image header */}
            <div className="relative h-80 sm:h-96 w-full shrink-0">
              <img
                src={resolveCharImage(lightboxChar).url}
                alt={lightboxChar.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/30 to-transparent"></div>
              
              {/* Close Button */}
              <button
                onClick={() => setLightboxChar(null)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-black text-slate-300 hover:text-white p-2 rounded-full border border-white/10 transition-colors cursor-pointer"
              >
                <span className="text-lg font-bold block px-2 leading-none">&times;</span>
              </button>
            </div>

            {/* Core Info & Scholarly Caption */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
              <div>
                <span className={`text-[10px] uppercase tracking-wider font-mono px-3 py-0.5 rounded-full font-bold ${getCharAccentColor(lightboxChar.religion)}`}>
                  {RELIGION_LABELS[lightboxChar.religion]}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
                  {lightboxChar.name}
                </h3>
                <p className="text-xs text-amber-300 font-mono mt-0.5">
                  {lightboxChar.role}
                </p>
              </div>

              {/* Visual Symbolism Explanation */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-500 font-bold tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Artwork Symbolism
                </span>
                <p className="text-xs sm:text-sm font-serif italic text-slate-200 leading-relaxed">
                  &ldquo;{resolveCharImage(lightboxChar).caption}&rdquo;
                </p>
              </div>

              {/* Detailed ethos */}
              <p className="text-xs sm:text-sm font-serif text-slate-300 leading-relaxed">
                {lightboxChar.detailedEthos}
              </p>

              {/* Jump to scripture shortcut button */}
              {lightboxChar.scriptureRef && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      handleJumpToScripture(lightboxChar.scriptureRef!);
                      setLightboxChar(null);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Study Canonical Scripture Source</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
