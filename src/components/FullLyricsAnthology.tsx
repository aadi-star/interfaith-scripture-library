/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  Volume2, 
  Square, 
  Play, 
  Copy, 
  Share2,
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Layers, 
  Music, 
  Heading, 
  Heart,
  Calendar,
  Printer,
  Pause,
  RotateCcw,
  VolumeX,
  Radio,
  Bookmark,
  Flame,
  Sun,
  Highlighter,
  Loader2,
  Globe,
  Trash2,
  X,
  HardDrive,
  Server,
  RefreshCw,
  AlertTriangle
} from "lucide-react";



// Micro wave-form visualization indicator
export function MicroWaveform({ colorClass = "bg-current" }: { colorClass?: string }) {
  return (
    <span className="inline-flex items-end gap-[1.5px] h-3 px-1 shrink-0 overflow-hidden self-center select-none align-middle" style={{ minWidth: "12px" }}>
      <span className={`w-[2px] ${colorClass} rounded-full animate-micro-wave-1 block`} />
      <span className={`w-[2px] ${colorClass} rounded-full animate-micro-wave-2 block`} />
      <span className={`w-[2px] ${colorClass} rounded-full animate-micro-wave-3 block`} />
      <span className={`w-[2px] ${colorClass} rounded-full animate-micro-wave-4 block`} />
    </span>
  );
}

// Types for full lyrics




// Full anthology data
import { ANTHOLOGY_DATA, AARTI_AUDIO_RESOURCES, DevotionalHymn, VerseLine } from "../shared/anthologyData";
import { selectBestVoice } from "../LocaleManager";

// Safe localStorage and sessionStorage shims shadowing standard globals to avoid SecurityError inside iframe sandbox
const localStorage = (typeof window !== "undefined" && (window as any).safeLocalStorage) || {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0
};
const sessionStorage = (typeof window !== "undefined" && (window as any).safeSessionStorage) || {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0
};

interface FullLyricsProps {
  onBackToCanon?: () => void;
  onBookmarkHymn?: (key: string, title: string, originalTitle: string, deity: string, intro: string, religion: string) => void;
  bookmarkedHymnKeys?: string[];
  activeBookKey?: string;
  targetLanguage?: string;
  offlineMode?: boolean;
  offlineAudioMode?: boolean;
  onToggleOfflineAudioMode?: (enabled: boolean) => void;
  validateAudioSource?: (primaryUrl: string, secondaryUrl?: string) => Promise<{ 
    url: string; 
    isFallback: boolean; 
    success: boolean;
    errorType?: "404_ERROR" | "FORMAT_ERROR" | "NETWORK_ERROR" | null;
    message?: string;
  }>;
}

const MATHESON_PRESETS = [
  {
    name: "Hinduism: Shiva Sutras Chant",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-hinduism/sa-hi-shiva-sutras.mp3",
    description: "Sanskrit recitation of the sacred Shiva Sutras, highly revered in Kashmir Shaivism."
  },
  {
    name: "Hinduism: Patanjali Yoga Sutras Chant",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-hinduism/sa-hi-patanjali-yoga-sutras.mp3",
    description: "Classical Sanskrit recitation of the Yoga Sutras of Patanjali, laying the foundation of classical yoga."
  },
  {
    name: "Islam: Surat Ya-Sin Recitation",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-islam/sa-is-abdulbasit-036.mp3",
    description: "Sublime Quranic recitation of Surah Ya-Sin by the legendary Egyptian Qari, Sheikh Abdul Basit Abdul Samad."
  },
  {
    name: "Islam: Sultan Bahu - Alif Allah Sufi Chant",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-islam/sa-is-sultan_bahu-alif_allah.mp3",
    description: "A moving Sufi Shabad poem 'Alif Allah' celebrating divine remembrance and love."
  },
  {
    name: "Christianity: Kyrie Eleison, Ephraim Chant",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-christianity/sa-ch-kyrie-ephraim.mp3",
    description: "Ancient Byzantine chant of Kyrie Eleison (Lord, have mercy) from Saint Ephraim."
  },
  {
    name: "Christianity: Our Father (Greek Recital)",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-christianity/sa-ch-ourfather-greekx3.mp3",
    description: "The Lord's Prayer chanted beautifully in its original biblical Greek."
  },
  {
    name: "Buddhism: Arapacana Chinese Temple Chant",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-buddhism/sa-bu-arapacana-chinese_temple.mp3",
    description: "Continuous Mahayana Buddhist Sanskrit mantra chant of the Arapacana alphabet in a traditional temple style."
  },
  {
    name: "Buddhism: Mukaiji Shakuhachi Meditation",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-buddhism/sa-bu-mukaiji-kurahashi.mp3",
    description: "Zen meditation piece 'Flute of the Single Leaf' played on the shakuhachi flute by master Kurahashi Yodo."
  },
  {
    name: "Judaism: Shema Yisrael (Sefardi Cantorial reading)",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-shema-shmueloff.mp3",
    description: "The absolute pinnacle declaration of Jewish monotheism, recited by the legendary Abraham Shmueloff."
  },
  {
    name: "Judaism: Baqashot: El Mistater (Kabbalistic Hymn)",
    url: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-el-mistater-archives.mp3",
    description: "Ancient kabbalistic poem from the Baqashot (midnight petitions) singing of the hidden divine presence."
  }
];

export function FullLyricsAnthology({ 
  onBackToCanon, 
  onBookmarkHymn, 
  bookmarkedHymnKeys = [], 
  activeBookKey, 
  targetLanguage, 
  offlineMode = false,
  offlineAudioMode = false,
  onToggleOfflineAudioMode,
  validateAudioSource
}: FullLyricsProps) {
  const [selectedHymnKey, setSelectedHymnKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sharedHymnKey = params.get("hymn");
      if (sharedHymnKey && ANTHOLOGY_DATA[sharedHymnKey]) {
        return sharedHymnKey;
      }
    }
    if (activeBookKey) {
      if (activeBookKey === "islam_prayers") return "ayat_al_kursi";
      if (activeBookKey === "christian_prayers") return "amazing_grace";
      if (activeBookKey === "jewish_prayers") return "shema_yisrael";
      if (activeBookKey === "buddhist_prayers") return "tashi_gyatpa";
      if (activeBookKey === "jain_prayers") return "navkar_mantra";
      if (activeBookKey === "sikh_prayers") return "japji_sahib";
    }
    return "hanuman_chalisa";
  });

  const isJewishPrayer = [
    "shema_yisrael",
    "modeh_ani",
    "birkat_kohanim",
    "hamotzi",
    "borei_pri_hagafen",
    "tefilat_haderech",
    "el_mistater",
    "kol_nidrei",
    "psalm_23_hebrew",
    "nigunim_hasidic",
    "yedid_nefesh",
    "bereshit_genesis",
    "shir_ha_shirim"
  ].includes(selectedHymnKey);
  const [viewMode, setViewMode] = useState<"devanagari" | "translit" | "meaning" | "split">("split");
  const [hymnAudioLoading, setHymnAudioLoading] = useState(false);

  // Recent Playback of hymns/prayers state
  const [recentHymns, setRecentHymns] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("scripture_recent_hymns");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (!selectedHymnKey) return;
    setRecentHymns((prev) => {
      const filtered = prev.filter((k) => k !== selectedHymnKey);
      const updated = [selectedHymnKey, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("scripture_recent_hymns", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [selectedHymnKey]);

  const [hymnLanguage, setHymnLanguage] = useState<string>(targetLanguage || "English");

  useEffect(() => {
    if (targetLanguage) {
      setHymnLanguage(targetLanguage);
    }
  }, [targetLanguage]);

  // Local persistent state for highlighting hymn verses
  const [hymnHighlights, setHymnHighlights] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("hymn_verse_highlights");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [activeHymnHighlightPicker, setActiveHymnHighlightPicker] = useState<number | string | null>(null);

  const handleToggleHymnHighlight = (hymnKey: string, verseNum: number | string, color: string) => {
    const key = `${hymnKey}_${verseNum}`;
    setHymnHighlights(prev => {
      const next = { ...prev };
      if (!color) {
        delete next[key];
      } else {
        next[key] = color;
      }
      try {
        localStorage.setItem("hymn_verse_highlights", JSON.stringify(next));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
      return next;
    });
  };
  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | "mantras" | "aartis" | "slokas" | "islamic" | "christian" | "judaism" | "buddhism" | "jainism" | "sikhism">(() => {
    if (activeBookKey) {
      if (activeBookKey === "islam_prayers") return "islamic";
      if (activeBookKey === "christian_prayers") return "christian";
      if (activeBookKey === "jewish_prayers") return "judaism";
      if (activeBookKey === "buddhist_prayers") return "buddhism";
      if (activeBookKey === "jain_prayers") return "jainism";
      if (activeBookKey === "sikh_prayers") return "sikhism";
    }
    return "all";
  });

  const getFilteredChants = (): DevotionalHymn[] => {
    switch (activeCategoryTab) {
      case "mantras":
        return [
          ANTHOLOGY_DATA.ganesha_mantra,
          ANTHOLOGY_DATA.gayatri_mantra,
          ANTHOLOGY_DATA.maha_mrityunjaya,
          ANTHOLOGY_DATA.buddhist_compassion_mantra,
        ].filter(Boolean);
      case "aartis":
        return [
          ANTHOLOGY_DATA.ganesh_aarti,
          ANTHOLOGY_DATA.goddess_aartis,
          ANTHOLOGY_DATA.lord_vishnu_aarti,
          ANTHOLOGY_DATA.kunj_bihari_aarti,
        ].filter(Boolean);
      case "slokas":
        return [
          ANTHOLOGY_DATA.shiv_tandav,
          ANTHOLOGY_DATA.shiv_panchakshara,
          ANTHOLOGY_DATA.lakshmi_ashtakam,
          ANTHOLOGY_DATA.sankat_nashan_ganesh_stotra,
          ANTHOLOGY_DATA.kanakadhara_stotram,
          ANTHOLOGY_DATA.aditya_hrudaya_stotra,
          ANTHOLOGY_DATA.madhurashtakam,
          ANTHOLOGY_DATA.hanuman_chalisa,
          ANTHOLOGY_DATA.bajrang_baan,
          ANTHOLOGY_DATA.peace_prayer_st_francis,
        ].filter(Boolean);
      case "islamic":
        return [
          ANTHOLOGY_DATA.ayat_al_kursi,
          ANTHOLOGY_DATA.sayyidul_istighfar,
          ANTHOLOGY_DATA.rabbana_duas,
          ANTHOLOGY_DATA.prophet_yunus_dua,
          ANTHOLOGY_DATA.rabbi_zidni_ilman,
        ].filter(Boolean);
      case "christian":
        return [
          ANTHOLOGY_DATA.amazing_grace,
          ANTHOLOGY_DATA.be_thou_my_vision,
          ANTHOLOGY_DATA.holy_holy_holy,
          ANTHOLOGY_DATA.the_lords_prayer,
          ANTHOLOGY_DATA.how_great_thou_art,
          ANTHOLOGY_DATA.peace_prayer_st_francis,
        ].filter(Boolean);
      case "judaism":
        return [
          ANTHOLOGY_DATA.shema_yisrael,
          ANTHOLOGY_DATA.modeh_ani,
          ANTHOLOGY_DATA.birkat_kohanim,
          ANTHOLOGY_DATA.hamotzi,
          ANTHOLOGY_DATA.borei_pri_hagafen,
          ANTHOLOGY_DATA.tefilat_haderech,
          ANTHOLOGY_DATA.el_mistater,
          ANTHOLOGY_DATA.kol_nidrei,
          ANTHOLOGY_DATA.psalm_23_hebrew,
          ANTHOLOGY_DATA.nigunim_hasidic,
          ANTHOLOGY_DATA.yedid_nefesh,
          ANTHOLOGY_DATA.bereshit_genesis,
          ANTHOLOGY_DATA.shir_ha_shirim,
        ].filter(Boolean);
      case "buddhism":
        return [
          ANTHOLOGY_DATA.tashi_gyatpa,
          ANTHOLOGY_DATA.kyabdro_semkye,
          ANTHOLOGY_DATA.shakyamuni_praise,
          ANTHOLOGY_DATA.green_tara_praise,
          ANTHOLOGY_DATA.heart_sutra_mantra,
          ANTHOLOGY_DATA.medicine_buddha,
        ].filter(Boolean);
      case "jainism":
        return [
          ANTHOLOGY_DATA.navkar_mantra,
          ANTHOLOGY_DATA.chattari_mangalam,
          ANTHOLOGY_DATA.uvasaggaharam_stotra,
          ANTHOLOGY_DATA.kshamapana_sutra,
          ANTHOLOGY_DATA.bhaktamar_stotra,
          ANTHOLOGY_DATA.logassa_sutra,
        ].filter(Boolean);
      case "sikhism":
        return [
          ANTHOLOGY_DATA.japji_sahib,
          ANTHOLOGY_DATA.tav_prasad_saviye,
          ANTHOLOGY_DATA.ardas,
          ANTHOLOGY_DATA.chaupai_sahib,
        ].filter(Boolean);
      default:
        return [];
    }
  };
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(16);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [bookmarkNotification, setBookmarkNotification] = useState<string | null>(null);
  
  // TTS State
  const [speakingIdx, _setSpeakingIdx] = useState<number | null>(null);
  const speakingIdxRef = useRef<number | null>(null);
  const setSpeakingIdx = (val: number | null) => {
    speakingIdxRef.current = val;
    _setSpeakingIdx(val);
  };
  const [synth, setSynth] = useState<SpeechSynthesis | null>(() => {
    if (typeof window !== "undefined") {
      try {
        if ("speechSynthesis" in window) {
          return window.speechSynthesis;
        }
      } catch (e) {
        console.warn("SpeechSynthesis access was blocked or restricted in this browser frame:", e);
      }
    }
    return null;
  });
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const activeSpeechAudioRef = useRef<HTMLAudioElement | null>(null);

  // Professional Audio Engine State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("scripture_audio_volume");
      return saved ? parseFloat(saved) : 0.8;
    } catch (e) {
      return 0.8;
    }
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [useBackup, setUseBackup] = useState<boolean>(false);
  const [isSourceOffline, setIsSourceOffline] = useState<boolean>(false);
  const [isSourceChecking, setIsSourceChecking] = useState<boolean>(false);
  const [audioRetryCount, setAudioRetryCount] = useState<number>(0);
  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);
  const [validationResultDetail, setValidationResultDetail] = useState<{
    errorType?: "404_ERROR" | "FORMAT_ERROR" | "NETWORK_ERROR" | null;
    message?: string;
  } | null>(null);

  const [bypassProxy, setBypassProxy] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("hymn_bypass_proxy");
      return saved === "true";
    } catch (e) {
      return false;
    }
  });

  const handleToggleBypassProxy = (val: boolean) => {
    setBypassProxy(val);
    try {
      localStorage.setItem("hymn_bypass_proxy", val ? "true" : "false");
    } catch (e) {}
  };
  const [playbackRate, setPlaybackRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("scripture_audio_playback_rate");
      return saved ? parseFloat(saved) : 1.0;
    } catch (e) {
      return 1.0;
    }
  });

  const [audioSource, setAudioSource] = useState<"professional" | "ai">( () => {
    try {
      const saved = localStorage.getItem("scripture_audio_source");
      return (saved === "professional" || saved === "ai") ? saved : "professional";
    } catch (e) {
      return "professional";
    }
  });

  // Synchronize FullLyricsAnthology preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("scripture_audio_volume", String(volume));
    } catch (e) {}
  }, [volume]);

  useEffect(() => {
    try {
      localStorage.setItem("scripture_audio_playback_rate", String(playbackRate));
    } catch (e) {}
  }, [playbackRate]);

  useEffect(() => {
    try {
      localStorage.setItem("scripture_audio_source", audioSource);
    } catch (e) {}
  }, [audioSource]);

  const [audioPitch, setAudioPitch] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("scripture_audio_pitch");
      return saved ? parseFloat(saved) : 1.0;
    } catch (e) {
      return 1.0;
    }
  });

  const handleUpdatePitch = (val: number) => {
    setAudioPitch(val);
    try {
      localStorage.setItem("scripture_audio_pitch", String(val));
    } catch (e) {}
  };

  const [aiNarratorCurrentIndex, setAiNarratorCurrentIndex] = useState<number>(0);
  const [isAiSequencePlaying, setIsAiSequencePlaying] = useState<boolean>(false);
  const aiSequenceCancelRef = useRef<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeCleanupRef = useRef<(() => void) | null>(null);
  const isFadingRef = useRef<boolean>(false);

  const fadeAudioVolume = (
    audio: HTMLAudioElement,
    targetVolume: number,
    duration: number,
    onComplete?: () => void
  ): (() => void) => {
    const startVolume = audio.volume;
    const volumeDiff = targetVolume - startVolume;
    if (volumeDiff === 0) {
      if (onComplete) onComplete();
      return () => {};
    }

    const startTime = performance.now();
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.max(0, Math.min(elapsed / duration, 1));
      
      try {
        audio.volume = Math.max(0, Math.min(1, startVolume + volumeDiff * progress));
      } catch (e) {
        console.warn("Error setting audio volume during fade:", e);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        try {
          audio.volume = targetVolume;
        } catch (e) {}
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  };

  // Alternative Custom Audio State configuration
  const [customAudioUrls, setCustomAudioUrls] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("devotional_custom_audio_urls");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [useCustomAudio, setUseCustomAudio] = useState<boolean>(false);

  useEffect(() => {
    try {
      const customUrl = customAudioUrls[selectedHymnKey];
      if (customUrl && customUrl.trim() !== "") {
        setUseCustomAudio(true);
      } else {
        const saved = localStorage.getItem(`use_custom_audio_${selectedHymnKey}`);
        setUseCustomAudio(saved === "true");
      }
    } catch (e) {
      setUseCustomAudio(false);
    }
  }, [selectedHymnKey, customAudioUrls]);

  const handleToggleUseCustomAudio = (val: boolean) => {
    setUseCustomAudio(val);
    try {
      localStorage.setItem(`use_custom_audio_${selectedHymnKey}`, val ? "true" : "false");
    } catch (e) {}
  };

  const handleUpdateCustomAudioUrl = (url: string) => {
    const updated = { ...customAudioUrls, [selectedHymnKey]: url };
    setCustomAudioUrls(updated);
    try {
      localStorage.setItem("devotional_custom_audio_urls", JSON.stringify(updated));
    } catch (e) {}
    if (url && url.trim() !== "") {
      handleToggleUseCustomAudio(true);
    }
  };

  // --- Audio Caching Local States & Handlers ---
  const [isCurrentlyCached, setIsCurrentlyCached] = useState<boolean>(false);
  const [isCachingInProgress, setIsCachingInProgress] = useState<boolean>(false);
  const [cachingProgressPercent, setCachingProgressPercent] = useState<number>(0);
  const [autoCacheNewStreams, setAutoCacheNewStreams] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("scripture_auto_cache_new_streams");
      return saved === "true";
    } catch (e) {
      return false;
    }
  });

  const handleToggleAutoCacheNewStreams = (enabled: boolean) => {
    setAutoCacheNewStreams(enabled);
    try {
      localStorage.setItem("scripture_auto_cache_new_streams", String(enabled));
    } catch (e) {}
  };

  useEffect(() => {
    let active = true;
    const checkCache = async () => {
      if (typeof window !== "undefined" && (window as any).audioCache) {
        const cached = await (window as any).audioCache.isAudioStreamCached(selectedHymnKey);
        if (active) {
          setIsCurrentlyCached(cached);
        }
      }
    };
    checkCache();
    return () => {
      active = false;
    };
  }, [selectedHymnKey]);

  const handleCacheActiveAudio = async () => {
    const resource = AARTI_AUDIO_RESOURCES[selectedHymnKey];
    if (!resource) {
      setAudioError("No professional audio resource defined for this hymn.");
      return;
    }

    const customUrl = customAudioUrls[selectedHymnKey];
    let trackUrl = (useCustomAudio || (customUrl && customUrl.trim() !== ""))
      ? customUrl || ""
      : (useBackup ? resource.backupUrl : resource.url);
    if (!trackUrl) {
      setAudioError("No audio URL available for caching.");
      return;
    }

    setIsCachingInProgress(true);
    setCachingProgressPercent(10);

    const backupUrlParam = useBackup ? resource.url : resource.backupUrl;
    const audioUrl = bypassProxy
      ? trackUrl 
      : `/api/audio-proxy?url=${encodeURIComponent(trackUrl)}&backup=${encodeURIComponent(backupUrlParam || "")}`;
    const absoluteAudioUrl = new URL(audioUrl, window.location.origin).href;

    try {
      setCachingProgressPercent(30);
      const response = await fetch(absoluteAudioUrl);
      if (!response.ok) {
        throw new Error(`vocal fetch failed: ${response.statusText}`);
      }
      setCachingProgressPercent(60);
      const blob = await response.blob();
      
      setCachingProgressPercent(85);
      if (typeof window !== "undefined" && (window as any).audioCache) {
        await (window as any).audioCache.cacheAudioStream(selectedHymnKey, blob);
        setIsCurrentlyCached(true);
        setAudioError(null);
      }
      setCachingProgressPercent(100);
    } catch (e: any) {
      console.error("Caching error:", e);
      setAudioError(`Failed to cache audio for offline mode: ${e.message || e}`);
    } finally {
      setTimeout(() => {
        setIsCachingInProgress(false);
        setCachingProgressPercent(0);
      }, 500);
    }
  };

  const handleDeleteCache = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).audioCache) {
        await (window as any).audioCache.deleteCachedAudioStream(selectedHymnKey);
        setIsCurrentlyCached(false);
      }
    } catch (e) {
      console.error("Error deleting cache:", e);
    }
  };

  // --- Manage Cached Audio Storage states and handlers ---
  const [showCacheManager, setShowCacheManager] = useState<boolean>(false);
  const [cachedItems, setCachedItems] = useState<Array<{ key: string; title: string; size: string }>>([]);
  const [totalCacheSize, setTotalCacheSize] = useState<string>("0.00 MB");

  const loadCachedItemsList = async () => {
    if (typeof window !== "undefined" && (window as any).audioCache) {
      try {
        const keys = await (window as any).audioCache.getAllCachedAudioKeys();
        let metadata: Record<string, { timestamp: number; size: number }> = {};
        if ((window as any).audioCache.getAudioCacheMetadata) {
          metadata = (window as any).audioCache.getAudioCacheMetadata();
        }
        
        let totalBytes = 0;
        const items = await Promise.all(
          keys.map(async (k: string) => {
            let title = ANTHOLOGY_DATA[k]?.title;
            if (!title) {
              const words = k.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1));
              title = words.join(" ");
            }
            let sizeStr = "Unknown size";
            const metaEntry = metadata[k];
            if (metaEntry && metaEntry.size > 0) {
              totalBytes += metaEntry.size;
              sizeStr = `${(metaEntry.size / (1024 * 1024)).toFixed(2)} MB`;
            } else {
              try {
                const blob = await (window as any).audioCache.getCachedAudioStream(k);
                if (blob) {
                  totalBytes += blob.size;
                  sizeStr = `${(blob.size / (1024 * 1024)).toFixed(2)} MB`;
                }
              } catch (e) {}
            }
            return { key: k, title, size: sizeStr };
          })
        );
        setCachedItems(items);
        setTotalCacheSize(`${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
      } catch (e) {
        console.error("Failed to load cached items list", e);
      }
    }
  };

  useEffect(() => {
    if (showCacheManager) {
      loadCachedItemsList();
    }
  }, [showCacheManager, isCurrentlyCached]);

  const handleDeleteCachedItem = async (keyToDel: string) => {
    try {
      if (typeof window !== "undefined" && (window as any).audioCache) {
        await (window as any).audioCache.deleteCachedAudioStream(keyToDel);
        if (keyToDel === selectedHymnKey) {
          setIsCurrentlyCached(false);
        }
        await loadCachedItemsList();
      }
    } catch (e) {
      console.error("Failed to delete cached item", e);
    }
  };

  // --- OFFLINE LIBRARY DRAWER STATE & HANDLERS ---
  const [showOfflineLibrary, setShowOfflineLibrary] = useState<boolean>(false);
  const [serverCachedFiles, setServerCachedFiles] = useState<Array<{ hash: string; size: number; mtime: number }>>([]);
  const [isPurgingAll, setIsPurgingAll] = useState<boolean>(false);
  const [isPurgingItem, setIsPurgingItem] = useState<string | null>(null);

  // Pure JavaScript MD5 function to match backend's crypto hashing for URLs
  const getMD5Hash = (str: string): string => {
    function rotateLeft(lValue: number, iShiftBits: number) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function addUnsigned(lX: number, lY: number) {
      const lX4 = lX & 0x40000000;
      const lY4 = lY & 0x40000000;
      const lX8 = lX & 0x80000000;
      const lY8 = lY & 0x80000000;
      const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
      if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
        else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      } else return lResult ^ lX8 ^ lY8;
    }
    function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
    function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
    function H(x: number, y: number, z: number) { return x ^ y ^ z; }
    function I(x: number, y: number, z: number) { return y ^ (x | ~z); }
    function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function convertToWordArray(string: string) {
      let lWordCount;
      const lMessageLength = string.length;
      const lNumberOfWords_temp1 = lMessageLength + 8;
      const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      const lWordArray = Array(lNumberOfWords);
      let lBytePosition = 0;
      let lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }
    function wordToHex(lValue: number) {
      let WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    }
    function utf8Encode(string: string) {
      string = string.replace(/\r\n/g, "\n");
      let utftext = "";
      for (let n = 0; n < string.length; n++) {
        const c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    }
    let x = convertToWordArray(utf8Encode(str));
    let a = 0x67452301; let b = 0xefcdab89; let c = 0x98badcfe; let d = 0x10325476;
    const s11 = 7; const s12 = 12; const s13 = 17; const s14 = 22;
    const s21 = 5; const s22 = 9; const s23 = 14; const s24 = 20;
    const s31 = 4; const s32 = 11; const s33 = 16; const s34 = 23;
    const s41 = 6; const s42 = 10; const s43 = 15; const s44 = 21;
    for (let k = 0; k < x.length; k += 16) {
      let AA = a; let BB = b; let CC = c; let DD = d;
      a = FF(a, b, c, d, x[k + 0], s11, 0xd76aa478); d = FF(d, a, b, c, x[k + 1], s12, 0xe8c7b756);
      c = FF(c, d, a, b, x[k + 2], s13, 0x242070db); b = FF(b, c, d, a, x[k + 3], s14, 0xc1bdceee);
      a = FF(a, b, c, d, x[k + 4], s11, 0xf57c0faf); d = FF(d, a, b, c, x[k + 5], s12, 0x4787c62a);
      c = FF(c, d, a, b, x[k + 6], s13, 0xa8304613); b = FF(b, c, d, a, x[k + 7], s14, 0xfd469501);
      a = FF(a, b, c, d, x[k + 8], s11, 0x698098d8); d = FF(d, a, b, c, x[k + 9], s12, 0x8b44f7af);
      c = FF(c, d, a, b, x[k + 10], s13, 0xffff5bb1); b = FF(b, c, d, a, x[k + 11], s14, 0x895cd7be);
      a = FF(a, b, c, d, x[k + 12], s11, 0x6b901122); d = FF(d, a, b, c, x[k + 13], s12, 0xfd987193);
      c = FF(c, d, a, b, x[k + 14], s13, 0xa679438e); b = FF(b, c, d, a, x[k + 15], s14, 0x49b40821);
      a = GG(a, b, c, d, x[k + 1], s21, 0xf61e2562); d = GG(d, a, b, c, x[k + 6], s22, 0xc040b340);
      c = GG(c, d, a, b, x[k + 11], s23, 0x265e5a51); b = GG(b, c, d, a, x[k + 0], s24, 0xe9b6c7aa);
      a = GG(a, b, c, d, x[k + 5], s21, 0xd62f105d); d = GG(d, a, b, c, x[k + 10], s22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], s23, 0xd8a1e681); b = GG(b, c, d, a, x[k + 4], s24, 0xe7d3fbc8);
      a = GG(a, b, c, d, x[k + 9], s21, 0x21e1cde6); d = GG(d, a, b, c, x[k + 14], s22, 0xc33707d6);
      c = GG(c, d, a, b, x[k + 3], s23, 0xf4d50d87); b = GG(b, c, d, a, x[k + 8], s24, 0x455a14ed);
      a = GG(a, b, c, d, x[k + 13], s21, 0xa9e3e905); d = GG(d, a, b, c, x[k + 2], s22, 0xfcefa3f8);
      c = GG(c, d, a, b, x[k + 7], s23, 0x676f02d9); b = GG(b, c, d, a, x[k + 12], s24, 0x8d2a4c8a);
      a = HH(a, b, c, d, x[k + 5], s31, 0xfffa3942); d = HH(d, a, b, c, x[k + 8], s32, 0x8771f681);
      c = HH(c, d, a, b, x[k + 11], s33, 0x6d9d6122); b = HH(b, c, d, a, x[k + 14], s34, 0xfde5380c);
      a = HH(a, b, c, d, x[k + 1], s31, 0xa4beea44); d = HH(d, a, b, c, x[k + 4], s32, 0x4bdecfa9);
      c = HH(c, d, a, b, x[k + 7], s33, 0xf6bb4b60); b = HH(b, c, d, a, x[k + 10], s34, 0xbebfbc70);
      a = HH(a, b, c, d, x[k + 13], s31, 0x289b7ec6); d = HH(d, a, b, c, x[k + 0], s32, 0xeaa127fa);
      c = HH(c, d, a, b, x[k + 3], s33, 0xd4ef3085); b = HH(b, c, d, a, x[k + 6], s34, 0x4881d05);
      a = HH(a, b, c, d, x[k + 9], s31, 0xd9d4d039); d = HH(d, a, b, c, x[k + 12], s32, 0xe6db99e5);
      c = HH(c, d, a, b, x[k + 15], s33, 0x1fa27cf8); b = HH(b, c, d, a, x[k + 2], s34, 0xc4ac5665);
      a = II(a, b, c, d, x[k + 0], s41, 0xf4292244); d = II(d, a, b, c, x[k + 7], s42, 0x432aff97);
      c = II(c, d, a, b, x[k + 14], s43, 0xab9423a7); b = II(b, c, d, a, x[k + 5], s44, 0xfc93a039);
      a = II(a, b, c, d, x[k + 12], s41, 0x655b59c3); d = II(d, a, b, c, x[k + 3], s42, 0x8f0ccc92);
      c = II(c, d, a, b, x[k + 10], s43, 0xffeff47d); b = II(b, c, d, a, x[k + 1], s44, 0x85845dd1);
      a = II(a, b, c, d, x[k + 8], s41, 0x6fa87e4f); d = II(d, a, b, c, x[k + 15], s42, 0xfe2ce6e0);
      c = II(c, d, a, b, x[k + 6], s43, 0xa3014314); b = II(b, c, d, a, x[k + 13], s44, 0x4e0811a1);
      a = II(a, b, c, d, x[k + 4], s41, 0xf7537e82); d = II(d, a, b, c, x[k + 11], s42, 0xbd3af235);
      c = II(c, d, a, b, x[k + 2], s43, 0x2ad7d2bb); b = II(b, c, d, a, x[k + 9], s44, 0xeb86d391);
      a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD);
    }
    return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  };

  const fetchServerCachedFiles = async () => {
    try {
      const res = await fetch("/api/audio-cache/list");
      if (res.ok) {
        const data = await res.json();
        setServerCachedFiles(data.cachedFiles || []);
      }
    } catch (e) {
      console.error("Failed to fetch server cached files:", e);
    }
  };

  const loadOfflineLibraryData = async () => {
    await loadCachedItemsList();
    await fetchServerCachedFiles();
  };

  useEffect(() => {
    if (showOfflineLibrary) {
      loadOfflineLibraryData();
    }
  }, [showOfflineLibrary, isCurrentlyCached]);

  const handlePurgeAllCaches = async () => {
    if (!window.confirm("Are you sure you want to completely clear ALL offline audio caches (both local device storage and cloud server storage)? This action cannot be undone.")) {
      return;
    }
    setIsPurgingAll(true);
    try {
      if (typeof window !== "undefined" && (window as any).audioCache) {
        const keys = await (window as any).audioCache.getAllCachedAudioKeys();
        for (const k of keys) {
          await (window as any).audioCache.deleteCachedAudioStream(k);
        }
      }
      await fetch("/api/audio-cache/purge-all", { method: "POST" });
      setIsCurrentlyCached(false);
      await loadOfflineLibraryData();
    } catch (e) {
      console.error("Failed to purge all caches:", e);
    } finally {
      setIsPurgingAll(false);
    }
  };

  const handlePurgeSingleScripture = async (key: string) => {
    setIsPurgingItem(key);
    try {
      if (typeof window !== "undefined" && (window as any).audioCache) {
        await (window as any).audioCache.deleteCachedAudioStream(key);
      }
      const resource = AARTI_AUDIO_RESOURCES[key];
      if (resource) {
        if (resource.url) {
          const hashVal = getMD5Hash(resource.url);
          await fetch("/api/audio-cache/purge-item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hash: hashVal })
          });
        }
        if (resource.backupUrl) {
          const hashVal = getMD5Hash(resource.backupUrl);
          await fetch("/api/audio-cache/purge-item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hash: hashVal })
          });
        }
      }
      if (key === selectedHymnKey) {
        setIsCurrentlyCached(false);
      }
      await loadOfflineLibraryData();
    } catch (e) {
      console.error(`Failed to purge cache for ${key}:`, e);
    } finally {
      setIsPurgingItem(null);
    }
  };

  const handlePlayOfflineItem = (key: string) => {
    setSelectedHymnKey(key);
    if (onToggleOfflineAudioMode) {
      onToggleOfflineAudioMode(true);
    }
    setIsPlaying(true);
    setShowOfflineLibrary(false);
  };

  const getCategoryName = (key: string): string => {
    if (["hanuman_chalisa", "bajrang_baan", "shiva_tandava", "jai_ganesh", "bhor_bhai", "om_jai_jagdish", "gayatri_mantra", "mahamrityunjaya", "ganesha_pancharatnam", "shiva_panchakshara", "mahalakshmi_ashtakam", "kanakadhara", "aditya_hrudayam", "madhurashtakam", "kunj_bihari"].includes(key)) {
      return "Hinduism";
    }
    if (["ayat_al_kursi", "sayyidul_istighfar", "rabbana_duas", "yunus_dua", "rabbi_zidni_ilma"].includes(key)) {
      return "Islam";
    }
    if (["amazing_grace", "be_thou_my_vision", "holy_holy_holy", "lords_prayer", "how_great_thou_art"].includes(key)) {
      return "Christianity";
    }
    if (["shema_yisrael", "modeh_ani", "birkat_kohanim", "hamotzi", "borei_pri_hagafen", "tefilat_haderech", "el_mistater", "kol_nidrei", "psalm_23_hebrew", "nigunim_hasidic", "yedid_nefesh", "bereshit_genesis", "shir_ha_shirim"].includes(key)) {
      return "Judaism";
    }
    if (["tashi_gyatpa", "refuge_bodhicitta", "shakyamuni_mantra", "green_tara_mantra", "heart_sutra", "medicine_buddha"].includes(key)) {
      return "Buddhism";
    }
    if (["navkar_mantra", "chattari_mangalam", "uvasaggaharam", "khamemi_savve", "bhaktamar_stotra", "logassa_sutra"].includes(key)) {
      return "Jainism";
    }
    if (["japji_sahib", "tav_prasad", "ardas", "chaupai_sahib"].includes(key)) {
      return "Sikhism";
    }
    return "Scripture";
  };

  const getOfflineLibraryItems = () => {
    const items: Array<{
      key: string;
      title: string;
      category: string;
      durationLabel: string;
      singer: string;
      isLocal: boolean;
      isServer: boolean;
      sizeLabel: string;
    }> = [];

    Object.keys(AARTI_AUDIO_RESOURCES).forEach((k) => {
      const resource = AARTI_AUDIO_RESOURCES[k];
      const details = ANTHOLOGY_DATA[k];
      if (!resource || !details) return;

      const isLocal = cachedItems.some((item) => item.key === k);
      
      const hashUrl = getMD5Hash(resource.url);
      const hashBackup = resource.backupUrl ? getMD5Hash(resource.backupUrl) : "";
      
      const serverEntry = serverCachedFiles.find(
        (f) => f.hash === hashUrl || (hashBackup && f.hash === hashBackup)
      );
      const isServer = !!serverEntry;

      if (isLocal || isServer) {
        let sizeLabel = "Unknown size";
        if (isLocal) {
          const matchedItem = cachedItems.find((item) => item.key === k);
          if (matchedItem) sizeLabel = matchedItem.size;
        } else if (serverEntry) {
          sizeLabel = `${(serverEntry.size / (1024 * 1024)).toFixed(2)} MB`;
        }

        items.push({
          key: k,
          title: details.title,
          category: getCategoryName(k),
          durationLabel: resource.durationLabel,
          singer: resource.singer,
          isLocal,
          isServer,
          sizeLabel
        });
      }
    });

    return items;
  };


  // Dynamic Translation System & Cache for Selected Hymns
  const originalHymn = ANTHOLOGY_DATA[selectedHymnKey] || ANTHOLOGY_DATA["hanuman_chalisa"];
  const [translatedHymn, setTranslatedHymn] = useState<DevotionalHymn | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const translationCacheRef = useRef<Record<string, DevotionalHymn>>({});

  useEffect(() => {
    setTranslatedHymn(null);

    if (!hymnLanguage || hymnLanguage.toLowerCase() === "english") {
      return;
    }

    const cacheKey = `${selectedHymnKey}:${hymnLanguage}`;
    if (translationCacheRef.current[cacheKey]) {
      setTranslatedHymn(translationCacheRef.current[cacheKey]);
      return;
    }

    setIsTranslating(true);
    fetch("/api/translate-hymn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: originalHymn.key,
        title: originalHymn.title,
        deity: originalHymn.deity,
        intro: originalHymn.intro,
        commentary: originalHymn.commentary,
        verses: originalHymn.verses,
        targetLanguage: hymnLanguage
      })
    })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Unable to retrieve translation from server.");
      }
      const data = await res.json();
      translationCacheRef.current[cacheKey] = data;
      setTranslatedHymn(data);
    })
    .catch((err) => {
      console.warn("[Hymn Translation Status] (Defaulting to English):", err.message || err);
      setTranslatedHymn(null);
    })
    .finally(() => {
      setIsTranslating(false);
    });
  }, [selectedHymnKey, hymnLanguage]);

  const activeHymn = translatedHymn && translatedHymn.key === selectedHymnKey ? translatedHymn : originalHymn;
  const hymn = activeHymn;

  const WORLD_LANGUAGES = [
    { key: "English", label: "English", code: "en-US" },
    { key: "Hindi", label: "हिन्दी (Hindi)", code: "hi-IN" },
    { key: "Spanish", label: "Español (Spanish)", code: "es-ES" },
    { key: "French", label: "Français (French)", code: "fr-FR" },
    { key: "German", label: "Deutsch (German)", code: "de-DE" },
    { key: "Japanese", label: "日本語 (Japanese)", code: "ja-JP" },
    { key: "Chinese", label: "中文 (Chinese)", code: "zh-CN" },
    { key: "Arabic", label: "العربية (Arabic)", code: "ar-SA" },
    { key: "Portuguese", label: "Português (Portuguese)", code: "pt-PT" },
    { key: "Russian", label: "Русский (Russian)", code: "ru-RU" },
    { key: "Marathi", label: "मराठी (Marathi)", code: "mr-IN" },
    { key: "Sanskrit", label: "संस्कृत (Sanskrit)", code: "sa-IN" },
    { key: "Tamil", label: "தமிழ் (Tamil)", code: "ta-IN" },
    { key: "Telugu", label: "తెలుగు (Telugu)", code: "te-IN" }
  ];

  const handleBookmarkClick = () => {
    if (onBookmarkHymn) {
      const isSaved = bookmarkedHymnKeys.includes(selectedHymnKey);
      const isIslamic = ["ayat_al_kursi", "sayyidul_istighfar", "rabbana_duas", "prophet_yunus_dua", "rabbi_zidni_ilman"].includes(selectedHymnKey);
      const isChristian = ["amazing_grace", "be_thou_my_vision", "holy_holy_holy", "the_lords_prayer", "how_great_thou_art", "peace_prayer_st_francis"].includes(selectedHymnKey);
      const isJewish = ["shema_yisrael", "modeh_ani", "birkat_kohanim", "hamotzi", "borei_pri_hagafen", "tefilat_haderech", "el_mistater", "kol_nidrei", "psalm_23_hebrew", "nigunim_hasidic", "yedid_nefesh", "bereshit_genesis", "shir_ha_shirim"].includes(selectedHymnKey);
      const isBuddhist = ["tashi_gyatpa", "kyabdro_semkye", "shakyamuni_praise", "green_tara_praise", "heart_sutra_mantra", "medicine_buddha"].includes(selectedHymnKey);
      const isJain = ["navkar_mantra", "chattari_mangalam", "uvasaggaharam_stotra", "kshamapana_sutra", "bhaktamar_stotra", "logassa_sutra"].includes(selectedHymnKey);
      const isSikh = ["japji_sahib", "tav_prasad_saviye", "ardas", "chaupai_sahib"].includes(selectedHymnKey);
      const religionVal = isIslamic ? "islam" : isChristian ? "christianity" : isJewish ? "judaism" : isBuddhist ? "buddhism" : isJain ? "jainism" : isSikh ? "sikhism" : "hinduism";
      
      onBookmarkHymn(
        selectedHymnKey,
        hymn.title,
        hymn.originalTitle,
        hymn.deity,
        hymn.intro,
        religionVal
      );
      setBookmarkNotification(isSaved ? "Hymn removed from personal study journal." : "Hymn saved to personal study journal!");
    }
  };

  // Recovery / fallback refs to avoid stale scoping or duplicate race conditions
  const lastFailedUrlRef = useRef<string>("");
  const expectedUrlRef = useRef<string>("");
  const handleStreamFailureRef = useRef<(failedUrl: string) => void>(() => {});
  const onEndedRef = useRef<() => void>(() => {});

  const handleStreamFailure = (failedUrl: string) => {
    if (!failedUrl) return;

    let absoluteFailed = failedUrl;
    try {
      absoluteFailed = new URL(failedUrl, window.location.origin).href;
    } catch (e) {}

    // Only process the failure if it matches the active expected URL to prevent transient/interrupted request cascades
    if (expectedUrlRef.current) {
      let absoluteExpected = expectedUrlRef.current;
      try {
        absoluteExpected = new URL(expectedUrlRef.current, window.location.origin).href;
      } catch (e) {}

      if (absoluteFailed !== absoluteExpected) {
        console.warn("[Auto-Recovery] Ignoring stale/interrupted stream failure event for:", failedUrl);
        return;
      }
    }

    if (lastFailedUrlRef.current === absoluteFailed) {
      return; // Already processed this failure
    }
    lastFailedUrlRef.current = absoluteFailed;

    const resource = AARTI_AUDIO_RESOURCES[selectedHymnKey];
    if (!resource) return;

    const customUrl = customAudioUrls[selectedHymnKey];
    if (useCustomAudio || (customUrl && customUrl.trim() !== "")) {
      console.log("[Auto-Recovery] Custom stream failed.");
      setAudioError("The custom audio URL could not be loaded. Please ensure the link is a direct public MP3 file and check your network or try toggling 'Direct Stream' mode.");
      setIsPlaying(false);
      setIsAudioLoading(false);
      return;
    }

    // Determine the original URL that failed
    let originalUrl = failedUrl;
    if (failedUrl.includes("/api/audio-proxy")) {
      try {
        const parsed = new URL(failedUrl, window.location.origin);
        originalUrl = parsed.searchParams.get("url") || failedUrl;
      } catch (e) {}
    }

    const triggerCachePurge = () => {
      console.log(`[Auto-Recovery] Triggering backend cache purge for original URL: ${originalUrl}`);
      fetch("/api/audio-cache/purge-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: originalUrl })
      })
        .then((r) => r.json())
        .then((data) => console.log("[Auto-Recovery] Cache purge response:", data))
        .catch((e) => console.warn("[Auto-Recovery] Cache purge failed:", e));
    };

    // Determine next configuration in the redundant stream cycle
    let nextBypass = bypassProxy;
    let nextBackup = useBackup;
    let currentModeName = "";
    let nextModeName = "";

    if (!useBackup && !bypassProxy) {
      // Primary Proxy failed -> try Primary Direct
      nextBypass = true;
      nextBackup = false;
      currentModeName = "Primary Proxy Node";
      nextModeName = "Primary Direct CDN";
    } else if (!useBackup && bypassProxy) {
      // Primary Direct failed -> try Backup Proxy
      nextBypass = false;
      nextBackup = true;
      currentModeName = "Primary Direct CDN";
      nextModeName = "Backup Proxy Node";
    } else if (useBackup && !bypassProxy) {
      // Backup Proxy failed -> try Backup Direct
      nextBypass = true;
      nextBackup = true;
      currentModeName = "Backup Proxy Node";
      nextModeName = "Backup Direct CDN";
    } else {
      // All configurations failed! Let's finalize.
      console.log("[Auto-Recovery] Checked all available stream configurations.");
      setAudioError("All redundant streams are currently offline. Please try again shortly or toggle the 'AI Reciter' to hear high-fidelity synthesized chant.");
      setIsPlaying(false);
      setIsAudioLoading(false);
      setAudioRetryCount(0); // Reset
      return;
    }

    const backoffSeconds = Math.pow(2, audioRetryCount + 1);
    const backoffMs = backoffSeconds * 1000;

    console.log(`[Auto-Recovery] ${currentModeName} failed (demuxer or format mismatch). Retrying via ${nextModeName} in ${backoffSeconds} seconds (Backoff step ${audioRetryCount + 1})...`);
    
    setAudioError(`Stream Decoupling: ${currentModeName} demux/load failure. Switching to ${nextModeName} via exponential backoff in ${backoffSeconds} seconds (Attempt ${audioRetryCount + 1})...`);
    setIsAudioLoading(true);

    triggerCachePurge();

    setTimeout(() => {
      setAudioRetryCount(prev => prev + 1);
      setBypassProxy(nextBypass);
      setUseBackup(nextBackup);
      
      // Re-load the audio source
      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.load();
        audio.play()
          .then(() => {
            setAudioError(null);
            setIsAudioLoading(false);
          })
          .catch(e => {
            console.warn("[Auto-Recovery] Playback retry failed, cascading to next node:", e);
          });
      }
    }, backoffMs);
  };

  handleStreamFailureRef.current = handleStreamFailure;

  onEndedRef.current = () => {
    setIsPlaying(false);
    setCurrentTime(0);

    if (autoCacheNewStreams && !isCurrentlyCached) {
      console.log(`[Playback End] Automatically caching stream for: ${selectedHymnKey}`);
      handleCacheActiveAudio();
    }
  };

  const forcePlayWithSettings = (newBypass: boolean, newUseBackup: boolean) => {
    setBypassProxy(newBypass);
    setUseBackup(newUseBackup);
    setAudioError(null);
    lastFailedUrlRef.current = ""; // Reset since user made dynamic settings choice
    setIsPlaying(true);
  };

  // Initialize Audio Element and Event Listeners
  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsAudioLoading(false);
    };

    const handleEnded = () => {
      onEndedRef.current();
    };

    const handleCanPlay = () => {
      setIsAudioLoading(false);
    };

    const handleWaiting = () => {
      setIsAudioLoading(true);
    };

    const handleError = () => {
      console.log("[Audio Engine Status] Stream resolution status:", audio.error ? audio.error.message : "interrupted");
      
      // Ignore MEDIA_ERR_ABORTED (code 1) which is fired when we deliberately cancel or switch streams.
      if (audio.error && audio.error.code === 1) {
        console.warn("[Auto-Recovery] Ignoring aborted/interrupted stream event.");
        return;
      }

      // Check the exact active payload URL configured to load at the time of the error.
      const activeSrc = audio.getAttribute("data-active-src") || audio.src;
      if (activeSrc) {
        handleStreamFailureRef.current(activeSrc);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Sync volume & mute state
  useEffect(() => {
    if (audioRef.current) {
      if (isFadingRef.current) {
        if (fadeCleanupRef.current) {
          fadeCleanupRef.current();
          fadeCleanupRef.current = null;
        }
        isFadingRef.current = false;
      }
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Safely auto-stop and reset audio properties whenever the user switches hymns
  useEffect(() => {
    setIsAiSequencePlaying(false);
    setAiNarratorCurrentIndex(0);
    handleStopAllTTS();

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudioError(null);
      setIsAudioLoading(false);
      setUseBackup(false);
      lastFailedUrlRef.current = ""; // Reset failure tracker on track switch
    }
  }, [selectedHymnKey]);

  // AI Sequence Recitation Loop
  useEffect(() => {
    if (!isAiSequencePlaying) {
      aiSequenceCancelRef.current = true;
      handleStopAllTTS();
      return;
    }

    aiSequenceCancelRef.current = false;
    let cancelled = false;

    async function runSequence() {
      const verses = activeHymn.verses;
      for (let i = aiNarratorCurrentIndex; i < verses.length; i++) {
        if (cancelled || aiSequenceCancelRef.current) break;
        setAiNarratorCurrentIndex(i);
        setSpeakingIdx(i);

        // Prepare speech queue for this verse
        const verse = verses[i];
        const isIslamic = ["ayat_al_kursi", "sayyidul_istighfar", "rabbana_duas", "prophet_yunus_dua", "rabbi_zidni_ilman"].includes(selectedHymnKey);
        const isJewish = ["shema_yisrael", "modeh_ani", "birkat_kohanim", "hamotzi", "borei_pri_hagafen", "tefilat_haderech", "el_mistater", "kol_nidrei", "psalm_23_hebrew", "nigunim_hasidic", "yedid_nefesh", "bereshit_genesis", "shir_ha_shirim"].includes(selectedHymnKey);
        const isSikh = ["japji_sahib", "tav_prasad_saviye", "ardas", "chaupai_sahib"].includes(selectedHymnKey);
        const isBuddhistTibetan = ["tashi_gyatpa", "kyabdro_semkye", "shakyamuni_praise", "green_tara_praise"].includes(selectedHymnKey);
        
        let nativeLangCode = "hi-IN";
        let nativeLangName = "Sanskrit";
        if (isIslamic) {
          nativeLangCode = "ar-SA";
          nativeLangName = "Arabic";
        } else if (isJewish) {
          nativeLangCode = "he-IL";
          nativeLangName = "Hebrew";
        } else if (isSikh) {
          nativeLangCode = "pa-IN";
          nativeLangName = "Punjabi";
        } else if (isBuddhistTibetan) {
          nativeLangCode = "bo-CN";
          nativeLangName = "Tibetan";
        } else if (["amazing_grace", "be_thou_my_vision", "holy_holy_holy", "the_lords_prayer", "how_great_thou_art", "peace_prayer_st_francis"].includes(selectedHymnKey)) {
          nativeLangCode = "en-US";
          nativeLangName = "English";
        }

        const isActuallyTranslated = translatedHymn && translatedHymn.key === selectedHymnKey;
        const activeLangConfig = isActuallyTranslated 
          ? (WORLD_LANGUAGES.find(l => l.key === hymnLanguage) || { key: "English", code: "en-US" })
          : { key: "English", code: "en-US" };
        const speechQueue: { text: string; language: string; bcp: string }[] = [];

        const isEnglish = activeLangConfig.key.toLowerCase() === "english";
        const localizedVersePrefix = isEnglish 
          ? `Verse ${verse.number}. ` 
          : ["Hindi", "Sanskrit", "Marathi"].includes(activeLangConfig.key)
            ? `${verse.number}. `
            : ["Spanish", "Portuguese"].includes(activeLangConfig.key)
              ? `Verso ${verse.number}. `
              : ["French"].includes(activeLangConfig.key)
                ? `Verset ${verse.number}. `
                : ["German"].includes(activeLangConfig.key)
                  ? `Vers ${verse.number}. `
                  : `${verse.number}. `;

        const verseSpeechText = `${localizedVersePrefix}${verse.translation}`;
        const originalTxt = verse.original || verse.originalText;

        if (viewMode === "devanagari" && originalTxt) {
          speechQueue.push({ text: originalTxt, language: nativeLangName, bcp: nativeLangCode });
        } else if (viewMode === "translit" && verse.transliteration) {
          speechQueue.push({ text: verse.transliteration, language: "English", bcp: "en-US" });
        } else if (viewMode === "meaning") {
          speechQueue.push({ text: verseSpeechText, language: activeLangConfig.key, bcp: activeLangConfig.code });
        } else {
          if (originalTxt) {
            speechQueue.push({ text: originalTxt, language: nativeLangName, bcp: nativeLangCode });
          }
          speechQueue.push({ text: verseSpeechText, language: activeLangConfig.key, bcp: activeLangConfig.code });
        }

        try {
          for (const item of speechQueue) {
            if (cancelled || aiSequenceCancelRef.current) break;
            await playTextSnippet(item.text, item.language, item.bcp);
          }
        } catch (e) {
          console.warn("AI sequence verse playback error", e);
        }
      }

      if (!cancelled && !aiSequenceCancelRef.current) {
        setIsAiSequencePlaying(false);
        setSpeakingIdx(null);
        setAiNarratorCurrentIndex(0);
      }
    }

    runSequence();

    return () => {
      cancelled = true;
      aiSequenceCancelRef.current = true;
    };
  }, [isAiSequencePlaying, selectedHymnKey, viewMode, hymnLanguage]);

  // Clear bookmark notification after 3 seconds
  useEffect(() => {
    if (bookmarkNotification) {
      const timer = setTimeout(() => {
        setBookmarkNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookmarkNotification]);

  // Declaratively load and play audio when states change
  useEffect(() => {
    if (!audioRef.current) return;

    if (!isPlaying || audioSource !== "professional") {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        if (fadeCleanupRef.current) fadeCleanupRef.current();
        isFadingRef.current = true;
        fadeCleanupRef.current = fadeAudioVolume(audio, 0, 500, () => {
          audio.pause();
          isFadingRef.current = false;
        });
      } else {
        audioRef.current.pause();
      }
      return;
    }

    const resource = AARTI_AUDIO_RESOURCES[selectedHymnKey];
    if (!resource) return;

    let trackUrl = "";
    let backupUrlParam = "";

    const customUrl = customAudioUrls[selectedHymnKey];
    if (useCustomAudio || (customUrl && customUrl.trim() !== "")) {
      trackUrl = customUrl || "";
      backupUrlParam = "";
    } else {
      trackUrl = useBackup ? resource.backupUrl : resource.url;
      backupUrlParam = useBackup ? resource.url : resource.backupUrl;
    }

    if (!trackUrl) {
      if (useCustomAudio || (customUrl && customUrl.trim() !== "")) {
        setAudioError("Please paste a valid Custom MP3 Audio URL below to stream.");
        setIsPlaying(false);
        setIsAudioLoading(false);
      }
      return;
    }

    const loadAudioSource = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      let validatedTrackUrl = trackUrl;
      let validatedBackupUrl = backupUrlParam;

      if (validateAudioSource && !offlineAudioMode) {
        setIsAudioLoading(true);
        try {
          const validationResult = await validateAudioSource(trackUrl, backupUrlParam || undefined);
          if (validationResult.isFallback) {
            console.log(`[Audio Engine] Automatically switched to backup URL due to validation failure of primary:`, trackUrl);
            validatedTrackUrl = validationResult.url;
            validatedBackupUrl = trackUrl;
          }
        } catch (e) {
          console.warn("[Audio Engine] Source validation error:", e);
        }
      }

      const audioUrl = bypassProxy
        ? validatedTrackUrl 
        : `/api/audio-proxy?url=${encodeURIComponent(validatedTrackUrl)}&backup=${encodeURIComponent(validatedBackupUrl || "")}`;
      const absoluteAudioUrl = new URL(audioUrl, window.location.origin).href;

      expectedUrlRef.current = absoluteAudioUrl;

      let srcToLoad = absoluteAudioUrl;
      let usingCached = false;

      if (offlineAudioMode) {
        if (typeof window !== "undefined" && (window as any).audioCache) {
          const cachedBlob = await (window as any).audioCache.getCachedAudioStream(selectedHymnKey);
          if (cachedBlob) {
            srcToLoad = URL.createObjectURL(cachedBlob);
            usingCached = true;
          } else {
            setAudioError("Offline Audio Mode is enabled, but this prayer's audio has not been cached yet.");
            setIsPlaying(false);
            setIsAudioLoading(false);
            return;
          }
        }
      }

      if (audio.src !== srcToLoad) {
        setIsAudioLoading(true);
        audio.setAttribute("data-active-src", absoluteAudioUrl);
        
        // Revoke previous blob url if it was a blob to free memory
        if (audio.src.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(audio.src);
          } catch (e) {}
        }

        audio.src = srcToLoad;
        audio.dataset.trackUrl = validatedTrackUrl;
        audio.dataset.bypassProxy = String(bypassProxy);
        audio.load();
      }

      if (audio.paused) {
        audio.volume = 0;
      }

      audio.play()
        .then(() => {
          setIsAudioLoading(false);
          setAudioError(null);
          
          const targetVol = isMuted ? 0 : volume;
          if (fadeCleanupRef.current) fadeCleanupRef.current();
          isFadingRef.current = true;
          fadeCleanupRef.current = fadeAudioVolume(audio, targetVol, 500, () => {
            isFadingRef.current = false;
          });
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.warn("[Audio Engine] Playback aborted to load new source.");
            return;
          }
          console.warn(`[Audio Engine] Playback failed for: ${srcToLoad}`, err);
          handleStreamFailure(srcToLoad);
        });
    };

    loadAudioSource();
  }, [selectedHymnKey, useBackup, bypassProxy, isPlaying, audioSource, useCustomAudio, customAudioUrls, offlineAudioMode, isCurrentlyCached, validateAudioSource]);

  // Proactive validation check when the active hymn/track changes or settings change, before playing
  useEffect(() => {
    let active = true;
    const resource = AARTI_AUDIO_RESOURCES[selectedHymnKey];
    if (!resource || offlineAudioMode) {
      setIsSourceOffline(false);
      setIsSourceChecking(false);
      return;
    }

    let trackUrl = "";
    let backupUrlParam = "";

    const customUrl = customAudioUrls[selectedHymnKey];
    if (useCustomAudio || (customUrl && customUrl.trim() !== "")) {
      trackUrl = customUrl || "";
      backupUrlParam = "";
    } else {
      trackUrl = useBackup ? resource.backupUrl : resource.url;
      backupUrlParam = useBackup ? resource.url : resource.backupUrl;
    }

    if (!trackUrl) {
      setIsSourceOffline(false);
      setIsSourceChecking(false);
      return;
    }

    if (validateAudioSource) {
      setIsSourceChecking(true);
      validateAudioSource(trackUrl, backupUrlParam || undefined)
        .then((result) => {
          if (active) {
            setIsSourceOffline(!result.success);
            setIsSourceChecking(false);
            if (!result.success) {
              setValidationResultDetail({
                errorType: result.errorType || null,
                message: result.message || "The selected audio source is currently offline or unreachable."
              });
              setAudioError(`Warning: ${result.message || "The selected audio source is offline."}`);
            } else {
              setValidationResultDetail(null);
              setAudioError(null);
            }
          }
        })
        .catch((err) => {
          if (active) {
            console.warn("[Proactive Validation Warning]", err);
            setIsSourceChecking(false);
          }
        });
    }

    return () => {
      active = false;
    };
  }, [selectedHymnKey, useBackup, useCustomAudio, customAudioUrls, validateAudioSource, offlineAudioMode]);

  const handleTogglePlayAudio = () => {
    setAudioError(null);
    if (audioSource === "professional") {
      if (!audioRef.current) return;
      if (isPlaying) {
        setIsPlaying(false);
      } else {
        // Force shutdown any active Text-To-Speech before launching professional audio
        if (synth) {
          try {
            synth.cancel();
          } catch (e) {
            console.warn("synth.cancel failed:", e);
          }
          setSpeakingIdx(null);
        }
        lastFailedUrlRef.current = ""; // Reset on manual click of play button
        setIsPlaying(true);
      }
    } else {
      if (isAiSequencePlaying) {
        setIsAiSequencePlaying(false);
      } else {
        lastFailedUrlRef.current = "";
        setIsAiSequencePlaying(true);
      }
    }
  };

  const handleManualRevalidate = async () => {
    const resource = AARTI_AUDIO_RESOURCES[selectedHymnKey];
    if (!resource || !validateAudioSource) return;
    
    setIsRevalidating(true);
    setAudioError("Manual Re-validation: Performing optimized stream check...");
    
    const customUrl = customAudioUrls[selectedHymnKey];
    let trackUrl = "";
    let backupUrlParam = "";
    if (useCustomAudio || (customUrl && customUrl.trim() !== "")) {
      trackUrl = customUrl || "";
    } else {
      trackUrl = useBackup ? resource.backupUrl : resource.url;
      backupUrlParam = useBackup ? resource.url : resource.backupUrl;
    }

    try {
      const result = await validateAudioSource(trackUrl, backupUrlParam || undefined);
      if (result.success) {
        setIsSourceOffline(false);
        setAudioError(null);
        setAudioRetryCount(0);
        setValidationResultDetail(null);
        
        if (result.isFallback) {
          setUseBackup(true);
        } else {
          setUseBackup(false);
        }
        
        setAudioError("Validation Succeeded: Stream is active and valid! Autoplay initiated.");
        setTimeout(() => setAudioError(null), 4000);
        
        // Autoplay
        setIsPlaying(true);
      } else {
        setIsSourceOffline(true);
        setValidationResultDetail({
          errorType: result.errorType || null,
          message: result.message || "The selected audio source is currently offline or has format errors."
        });
        setAudioError(`Validation Failed: ${result.message || "The audio file is offline."}`);
      }
    } catch (e) {
      setAudioError("Re-validation encountered an unexpected network error.");
    } finally {
      setIsRevalidating(false);
    }
  };

  // Support Autoplay query param for shared deep links on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const autoPlayParam = params.get("autoplay");
    if (autoPlayParam === "true") {
      const timer = setTimeout(() => {
        handleTogglePlayAudio();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleShareAudio = () => {
    const hymnToChapterMap: Record<string, number> = {
      hanuman_chalisa: 2,
      bajrang_baan: 3,
      shiv_tandav: 4,
      ganesh_aarti: 5,
      goddess_aartis: 6,
      lord_vishnu_aarti: 7,
      gayatri_mantra: 1,
      maha_mrityunjaya: 8,
      buddhist_compassion_mantra: 8,
      peace_prayer_st_francis: 8,
      ganesha_mantra: 5,
      shiv_panchakshara: 4,
      lakshmi_ashtakam: 6,
      kunj_bihari_aarti: 7,
    };
    const chapterNum = hymnToChapterMap[selectedHymnKey] || 2;
    const shareUrl = `${window.location.origin}${window.location.pathname}?book=hindu_prayers&chapter=${chapterNum}&lyrics_anthology=true&hymn=${selectedHymnKey}&autoplay=true`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2500);
        })
        .catch((e) => {
          console.error("Clipboard copy failed, falling back", e);
        });
    } else {
      const text_area = document.createElement("textarea");
      text_area.value = shareUrl;
      text_area.style.position = "fixed";
      document.body.appendChild(text_area);
      text_area.focus();
      text_area.select();
      try {
        document.execCommand("copy");
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      } catch (err) {
        console.error("Fallback copy failed", err);
      }
      document.body.removeChild(text_area);
    }
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (newValue: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const formatAudioTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Filter verses based on query
  const filteredVerses = hymn.verses.filter(v => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const originalContent = (v.original || v.originalText || "");
    return v.number.toLowerCase().includes(q) ||
           originalContent.toLowerCase().includes(q) ||
           v.transliteration.toLowerCase().includes(q) ||
           v.translation.toLowerCase().includes(q);
  });

  const handleCopy = (text: string, idx: number) => {
     if (navigator.clipboard && navigator.clipboard.writeText) {
       navigator.clipboard.writeText(text);
     }
     setCopiedIndex(idx);
     setTimeout(() => setCopiedIndex(null), 2000);
  };

  const playTextSnippet = async (text: string, languageName: string, bcpCode: string): Promise<void> => {
    setHymnAudioLoading(true);
    return new Promise(async (resolve, reject) => {
      if (offlineMode) {
        console.log("[Offline Mode] playTextSnippet active. Routing directly to runLocalTTSFallback.");
        setHymnAudioLoading(false);
        runLocalTTSFallback(text, bcpCode).then(resolve).catch(reject);
        return;
      }
      try {
        console.log(`[Proxy TTS] Querying server proxy for "${languageName}" with text: "${text.substring(0, 40)}"`);
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            text: text, 
            voice: "Kore",
            language: languageName 
          })
        });

        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }

        const data = await response.json();
        setHymnAudioLoading(false);
        if (data.audio) {
          const mime = data.mimeType || "audio/mpeg";
          const audioUrl = `data:${mime};base64,${data.audio}`;
          const audio = new Audio(audioUrl);
          activeSpeechAudioRef.current = audio;
          audio.onended = () => {
            resolve();
          };
          audio.onerror = (e) => {
            console.warn("[Proxy TTS Playback Error] Decoding failed, falling back to local SpeechSynthesis:", e);
            runLocalTTSFallback(text, bcpCode).then(resolve).catch(reject);
          };
          await audio.play();
        } else {
          throw new Error("No audio payload returned from API proxy.");
        }
      } catch (err) {
        setHymnAudioLoading(false);
        console.warn("[Proxy TTS Failed] Swerving to local SpeechSynthesis:", err);
        runLocalTTSFallback(text, bcpCode).then(resolve).catch(reject);
      }
    });
  };

  const runLocalTTSFallback = (text: string, bcpCode: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synth) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bcpCode;
      utterance.rate = playbackRate || 0.95;
      utterance.pitch = audioPitch || 1.0;
      
      try {
        const voices = synth.getVoices();
        const found = selectBestVoice(bcpCode, voices);
        if (found) {
          utterance.voice = found;
        }
      } catch (e) {}

      utterance.onend = () => {
        resolve();
      };
      utterance.onerror = () => {
        resolve();
      };
      try {
        synth.speak(utterance);
      } catch (err) {
        console.warn("synth.speak failed:", err);
        resolve();
      }
    });
  };

  const handleSpeakVerse = async (verse: VerseLine, idx: number) => {
    if (speakingIdx === idx) {
      handleStopAllTTS();
      return;
    }

    handleStopAllTTS();
    setSpeakingIdx(idx);

    const isIslamic = ["ayat_al_kursi", "sayyidul_istighfar", "rabbana_duas", "prophet_yunus_dua", "rabbi_zidni_ilman"].includes(selectedHymnKey);
    const isJewish = ["shema_yisrael", "modeh_ani", "birkat_kohanim", "hamotzi", "borei_pri_hagafen", "tefilat_haderech", "el_mistater", "kol_nidrei", "psalm_23_hebrew", "nigunim_hasidic", "yedid_nefesh", "bereshit_genesis", "shir_ha_shirim"].includes(selectedHymnKey);
    const isSikh = ["japji_sahib", "tav_prasad_saviye", "ardas", "chaupai_sahib"].includes(selectedHymnKey);
    const isBuddhistTibetan = ["tashi_gyatpa", "kyabdro_semkye", "shakyamuni_praise", "green_tara_praise"].includes(selectedHymnKey);
    
    let nativeLangCode = "hi-IN"; // Default for Hindu, Jain, and Buddhist Devanagari texts
    let nativeLangName = "Sanskrit";
    if (isIslamic) {
      nativeLangCode = "ar-SA";
      nativeLangName = "Arabic";
    } else if (isJewish) {
      nativeLangCode = "he-IL";
      nativeLangName = "Hebrew";
    } else if (isSikh) {
      nativeLangCode = "pa-IN";
      nativeLangName = "Punjabi";
    } else if (isBuddhistTibetan) {
      nativeLangCode = "bo-CN";
      nativeLangName = "Tibetan";
    } else if (["amazing_grace", "be_thou_my_vision", "holy_holy_holy", "the_lords_prayer", "how_great_thou_art", "peace_prayer_st_francis"].includes(selectedHymnKey)) {
      nativeLangCode = "en-US";
      nativeLangName = "English";
    }

    const isActuallyTranslated = translatedHymn && translatedHymn.key === selectedHymnKey;
    const activeLangConfig = isActuallyTranslated 
      ? (WORLD_LANGUAGES.find(l => l.key === hymnLanguage) || { key: "English", code: "en-US" })
      : { key: "English", code: "en-US" };

    const speechQueue: { text: string; language: string; bcp: string }[] = [];

    const isEnglish = activeLangConfig.key.toLowerCase() === "english";
    const isTrans = !isEnglish;
    const localizedVersePrefix = isEnglish 
      ? `Verse ${verse.number}. ` 
      : ["Hindi", "Sanskrit", "Marathi"].includes(activeLangConfig.key)
        ? `${verse.number}. `
        : ["Spanish", "Portuguese"].includes(activeLangConfig.key)
          ? `Verso ${verse.number}. `
          : ["French"].includes(activeLangConfig.key)
            ? `Verset ${verse.number}. `
            : ["German"].includes(activeLangConfig.key)
              ? `Vers ${verse.number}. `
              : `${verse.number}. `;

    const verseSpeechText = `${localizedVersePrefix}${verse.translation}`;

    const originalTxt = verse.original || verse.originalText;

    if (viewMode === "devanagari" && originalTxt) {
      speechQueue.push({ 
        text: originalTxt, 
        language: nativeLangName, 
        bcp: nativeLangCode 
      });
    } else if (viewMode === "translit" && verse.transliteration) {
      speechQueue.push({ 
        text: verse.transliteration, 
        language: "English", 
        bcp: "en-US" 
      });
    } else if (viewMode === "meaning") {
      speechQueue.push({ 
        text: verseSpeechText, 
        language: activeLangConfig.key, 
        bcp: activeLangConfig.code 
      });
    } else { // split mode
      if (originalTxt) {
        speechQueue.push({ 
          text: originalTxt, 
          language: nativeLangName, 
          bcp: nativeLangCode 
        });
      }
      speechQueue.push({ 
        text: verseSpeechText, 
        language: activeLangConfig.key, 
        bcp: activeLangConfig.code 
      });
    }

    try {
      for (const item of speechQueue) {
        if (speakingIdxRef.current !== idx) {
          break;
        }
        await playTextSnippet(item.text, item.language, item.bcp);
      }
    } catch (e) {
      console.error("Error in lyrics audio sequence player:", e);
    } finally {
      if (speakingIdxRef.current === idx) {
        setSpeakingIdx(null);
      }
    }
  };

  const handleStopAllTTS = () => {
    if (synth) {
      try {
        synth.cancel();
      } catch (e) {
        console.warn("synth.cancel failed:", e);
      }
    }
    if (activeSpeechAudioRef.current) {
      activeSpeechAudioRef.current.pause();
      activeSpeechAudioRef.current = null;
    }
    setSpeakingIdx(null);
  };

  const triggerPrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn("Printing is restricted in this sandboxed iframe environment:", e);
      alert("Printing is restricted or blocked in this browser tab's framed sandboxing context. Please open the applet in a new tab first.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-stone-900/40 to-[#0b0b0e] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-6 shadow-xl animate-fade-in text-slate-200 relative">
      
      {/* Toast Notification */}
      {bookmarkNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f0f14] border border-amber-500/35 text-amber-300 font-sans text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-pulse">
          <Bookmark className="w-4 h-4 fill-amber-300" />
          <span>{bookmarkNotification}</span>
        </div>
      )}
      
      {/* Block Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Traditional Hindu Prayer Library
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
            Complete Devotional Lyrics & Aartis Anthology
          </h2>
          <p className="text-xs text-slate-400 italic font-serif leading-relaxed">
            Beautifully curated authentic stotras, mantras, chalisa and multi-form temple aartis with full transliteration and profound sentence-by-sentence parallel translation.
          </p>
        </div>
        
        {onBackToCanon && (
          <button 
            onClick={onBackToCanon}
            className="self-start sm:self-center px-4 py-2 bg-amber-500 text-black hover:bg-amber-400 font-sans font-bold text-xs rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            &larr; Back to Main Canon View
          </button>
        )}
      </div>

      {/* Selector Row Grouped by Categories */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-2">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-amber-400 block font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              Step 1: Select Prayer / Devotional Hymn (Structured Categories)
            </label>
            <p className="text-[10px] text-slate-400">Choose a category tab below to easily browse specific divine chants</p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">51 Authenticated Chants</span>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-2xl" id="anthology-category-tabs">
          {[
            { id: "all", label: "All Chants", icon: Layers, count: 51 },
            { id: "mantras", label: "Hindu Mantras", icon: Sparkles, count: 4 },
            { id: "aartis", label: "Aartis", icon: Play, count: 4 },
            { id: "slokas", label: "Slokas & Chalisas", icon: BookOpen, count: 10 },
            { id: "islamic", label: "Islamic Duas", icon: Heart, count: 5 },
            { id: "christian", label: "Christian Hymns", icon: BookOpen, count: 6 },
            { id: "judaism", label: "Jewish Blessings", icon: Heart, count: 6 },
            { id: "buddhism", label: "Buddhist Prayers", icon: Flame, count: 6 },
            { id: "jainism", label: "Jain Prayers", icon: Sun, count: 6 },
            { id: "sikhism", label: "Sikh Prayers", icon: Sparkles, count: 4 }
          ].map((tab) => {
            const IconComp = tab.id === "judaism" ? Heart : tab.id === "buddhism" ? Flame : tab.id === "jainism" ? Sun : tab.id === "sikhism" ? Sparkles : tab.icon;
            const isActive = activeCategoryTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveCategoryTab(tab.id as any)}
                className={`flex-1 min-w-[110px] px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-950/20 scale-[1.01]"
                    : "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-black" : "text-amber-500"}`} />
                <span>{tab.label}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${isActive ? "bg-black/10 text-amber-950 font-extrabold" : "bg-white/5 text-slate-500"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        
        {activeCategoryTab === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-9 gap-4">
            {/* Category 1: Chalisas & Protective Shields */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-orange-500/10 text-orange-400 shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Chalisas & Hymns</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Power, courage, and protection shields</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[ANTHOLOGY_DATA.hanuman_chalisa, ANTHOLOGY_DATA.bajrang_baan].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category 2: Divine Temple Aartis */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-amber-500/10 text-amber-400 shrink-0">
                    <Play className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Holy Temple Aartis</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Light worship, gratitude, and chorus songs</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[
                    ANTHOLOGY_DATA.ganesh_aarti, 
                    ANTHOLOGY_DATA.goddess_aartis, 
                    ANTHOLOGY_DATA.lord_vishnu_aarti,
                    ANTHOLOGY_DATA.kunj_bihari_aarti
                  ].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category 3: Stotrams & Cosmic Slokas */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Stotrams & Meditations</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Deep cosmic stotras & Sanskrit rhythms</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[
                    ANTHOLOGY_DATA.shiv_tandav, 
                    ANTHOLOGY_DATA.ganesha_mantra,
                    ANTHOLOGY_DATA.gayatri_mantra, 
                    ANTHOLOGY_DATA.maha_mrityunjaya,
                    ANTHOLOGY_DATA.shiv_panchakshara,
                    ANTHOLOGY_DATA.lakshmi_ashtakam,
                    ANTHOLOGY_DATA.sankat_nashan_ganesh_stotra,
                    ANTHOLOGY_DATA.kanakadhara_stotram,
                    ANTHOLOGY_DATA.aditya_hrudaya_stotra,
                    ANTHOLOGY_DATA.madhurashtakam
                  ].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-bold shadow-lg shadow-amber-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category 4: Multifaith Peace Prayers */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-rose-500/10 text-rose-400 shrink-0">
                    <Heart className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Multifaith Peace Hymns</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Compassion chants & global prayers of light</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[ANTHOLOGY_DATA.buddhist_compassion_mantra, ANTHOLOGY_DATA.peace_prayer_st_francis].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-bold shadow-lg shadow-amber-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category 5: Islamic Duas & Prayers */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Heart className="w-3.5 h-3.5 fill-emerald-500/20" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Islamic Duas</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Quranic petitions, forgiveness & peace</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[
                    ANTHOLOGY_DATA.ayat_al_kursi,
                    ANTHOLOGY_DATA.sayyidul_istighfar,
                    ANTHOLOGY_DATA.rabbana_duas,
                    ANTHOLOGY_DATA.prophet_yunus_dua,
                    ANTHOLOGY_DATA.rabbi_zidni_ilman
                  ].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-black border-emerald-500 font-extrabold shadow-lg shadow-emerald-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-emerald-950 fill-emerald-950" : "text-emerald-500 fill-emerald-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-emerald-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-emerald-950 text-emerald-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category 6: Christian Prayers & Hymns */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between" id="christian-prayers-hymns-section">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-blue-500/10 text-blue-400 shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Christian Hymns</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Redemption, grace & adoration</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[
                    ANTHOLOGY_DATA.amazing_grace,
                    ANTHOLOGY_DATA.be_thou_my_vision,
                    ANTHOLOGY_DATA.holy_holy_holy,
                    ANTHOLOGY_DATA.the_lords_prayer,
                    ANTHOLOGY_DATA.how_great_thou_art,
                    ANTHOLOGY_DATA.peace_prayer_st_francis
                  ].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category 7: Jewish Devotions & Blessings */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between" id="judaism-prayers-blessings-section">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-blue-500/10 text-blue-400 shrink-0">
                    <Heart className="w-3.5 h-3.5 fill-blue-500/20" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Jewish Prayers</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Absolute unity, gratitude & blessings</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[
                    ANTHOLOGY_DATA.shema_yisrael,
                    ANTHOLOGY_DATA.el_mistater,
                    ANTHOLOGY_DATA.nigun_joy
                  ].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category 8: Buddhist Prayers & Blessings */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between" id="buddhism-prayers-blessings-section">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-amber-500/10 text-amber-400 shrink-0">
                    <Flame className="w-3.5 h-3.5 fill-amber-500/20" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Buddhist Prayers</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Compassion, ultimate reality & wisdom</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[
                    ANTHOLOGY_DATA.tashi_gyatpa,
                    ANTHOLOGY_DATA.kyabdro_semkye,
                    ANTHOLOGY_DATA.shakyamuni_praise,
                    ANTHOLOGY_DATA.green_tara_praise,
                    ANTHOLOGY_DATA.heart_sutra_mantra,
                    ANTHOLOGY_DATA.medicine_buddha
                  ].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category 9: Jain Prayers & Blessings */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between" id="jainism-prayers-blessings-section">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-yellow-500/10 text-yellow-400 shrink-0">
                    <Sun className="w-3.5 h-3.5 animate-pulse" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Jain Prayers</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Equanimity, cosmic homage & forgiveness</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[
                    ANTHOLOGY_DATA.navkar_mantra,
                    ANTHOLOGY_DATA.chattari_mangalam,
                    ANTHOLOGY_DATA.uvasaggaharam_stotra,
                    ANTHOLOGY_DATA.kshamapana_sutra,
                    ANTHOLOGY_DATA.bhaktamar_stotra,
                    ANTHOLOGY_DATA.logassa_sutra
                  ].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category 10: Sikh Prayers & Nitnem */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between" id="sikhism-prayers-nitnem-section">
              <div className="space-y-1">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="p-1.5 rounded bg-orange-500/10 text-orange-400 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Sikh Nitnem</h4>
                    <p className="text-[9px] text-slate-400 font-serif">Absolute Divine Unity, love & moral character</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 font-sans">
                  {[
                    ANTHOLOGY_DATA.japji_sahib,
                    ANTHOLOGY_DATA.tav_prasad_saviye,
                    ANTHOLOGY_DATA.ardas,
                    ANTHOLOGY_DATA.chaupai_sahib
                  ].map((item) => {
                    if (!item) return null;
                    const isSelected = selectedHymnKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`anthology-btn-${item.key}`}
                        onClick={() => {
                          setSelectedHymnKey(item.key);
                          handleStopAllTTS();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-950/20 scale-[1.01]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="truncate pr-1">
                          <div className="font-serif leading-none font-bold truncate flex items-center gap-1">
                            <span>{item.title}</span>
                            {bookmarkedHymnKeys.includes(item.key) && (
                              <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                            )}
                          </div>
                          <div className={`text-[9px] font-mono mt-1 ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                            {item.originalTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <span className={`p-2 rounded-xl shrink-0 ${
                activeCategoryTab === "mantras" ? "bg-cyan-500/10 text-cyan-400" :
                activeCategoryTab === "aartis" ? "bg-amber-500/10 text-amber-400" :
                activeCategoryTab === "islamic" ? "bg-emerald-500/10 text-emerald-400" :
                activeCategoryTab === "christian" ? "bg-blue-500/10 text-blue-400" :
                activeCategoryTab === "judaism" ? "bg-indigo-500/10 text-indigo-400" :
                activeCategoryTab === "buddhism" ? "bg-amber-500/10 text-amber-500" : 
                activeCategoryTab === "jainism" ? "bg-yellow-500/10 text-yellow-400" : 
                activeCategoryTab === "sikhism" ? "bg-orange-500/10 text-orange-400" : "bg-orange-500/10 text-orange-400"
              }`}>
                {activeCategoryTab === "mantras" ? <Sparkles className="w-4 h-4" /> :
                 activeCategoryTab === "aartis" ? <Play className="w-4 h-4" /> :
                 activeCategoryTab === "islamic" ? <Heart className="w-4 h-4 fill-emerald-500/20" /> :
                 activeCategoryTab === "christian" ? <BookOpen className="w-4 h-4" /> :
                 activeCategoryTab === "judaism" ? <Heart className="w-4 h-4 fill-indigo-500/20" /> :
                 activeCategoryTab === "buddhism" ? <Flame className="w-4 h-4 fill-amber-550/20" /> : 
                 activeCategoryTab === "jainism" ? <Sun className="w-4 h-4 animate-pulse" /> : 
                 activeCategoryTab === "sikhism" ? <Sparkles className="w-4 h-4 animate-pulse" /> : <BookOpen className="w-4 h-4" />}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {activeCategoryTab === "mantras" ? "Sacred Hindu Mantras" :
                   activeCategoryTab === "aartis" ? "Auspicious Temple Aartis" :
                   activeCategoryTab === "islamic" ? "Islamic Duas & Prayers" :
                   activeCategoryTab === "christian" ? "Christian Hymns & Devotions" :
                   activeCategoryTab === "judaism" ? "Jewish Prayers & Blessings" :
                   activeCategoryTab === "buddhism" ? "Buddhist Prayers & Blessings" : 
                   activeCategoryTab === "jainism" ? "Jain Prayers & Blessings" : 
                   activeCategoryTab === "sikhism" ? "Sikh Sacred Nitnem & Sabads" : "Powerful Slokas & Chalisas"}
                </h4>
                <p className="text-[10px] text-slate-400 font-serif font-sans">
                  {activeCategoryTab === "mantras" ? "Vedic sound vibrations and smart transcendental chants" :
                   activeCategoryTab === "aartis" ? "Traditional waving of lamps, sweet rhythmic chorus songs" :
                   activeCategoryTab === "islamic" ? "Holy Quranic petitions and Prophetic supplications from MyIslam.org" :
                   activeCategoryTab === "christian" ? "Classic congregational hymns, prayers of salvation, and grace retrieved via Hymnary.org" :
                   activeCategoryTab === "judaism" ? "Fundamental declarations of absolute monotheism, morning gratitude, and ritual table blessings retrieved via themathesontrust.org" :
                   activeCategoryTab === "buddhism" ? "Dharmic verses of protection, great refuge, historical Buddha Shakyamuni praises, and swift energy mantras retrieved from Lotsawa House & FPMT" : 
                   activeCategoryTab === "jainism" ? "Sovereign formulas of supreme equanimity (Samatva), fivefold cosmic homage (Navkar), universal amity (Kshamapana), and protective shielding retrieved from JainWorld.com" : 
                   activeCategoryTab === "sikhism" ? "Divine Nitnem morning meditations, universal petitions (Ardas), and defensive shield recitations (Chaupai Sahib) retrieved from SriGuruGranthSahib.org" : "Divine stotrams, verses of armor, and protective hymns"}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-sans">
              {getFilteredChants().map((item) => {
                if (!item) return null;
                const isSelected = selectedHymnKey === item.key;
                return (
                  <button
                    key={item.key}
                    id={`anthology-btn-${item.key}`}
                    onClick={() => {
                      setSelectedHymnKey(item.key);
                      handleStopAllTTS();
                    }}
                    className={`w-full px-4 py-3.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-950/20 scale-[1.01]"
                        : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className="font-serif text-sm leading-none font-bold truncate mb-1 flex items-center gap-1">
                        <span>{item.title}</span>
                        {bookmarkedHymnKeys.includes(item.key) && (
                          <Bookmark className={`w-2.5 h-2.5 shrink-0 ${isSelected ? "text-amber-950 fill-amber-950" : "text-amber-500 fill-amber-500/30"}`} />
                        )}
                      </div>
                      <div className={`text-[10px] font-mono ${isSelected ? "text-amber-950 font-bold" : "text-slate-500"} truncate`}>
                        {item.originalTitle}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono shrink-0">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Deity & Description Card Banner */}
      <div className="bg-[#101014] border border-white/5 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row gap-5 items-start justify-between">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/25 rounded-md text-[10px] text-amber-300 font-bold uppercase font-mono">
              Dedicated to: {hymn.deity}
            </span>
            {isTranslating ? (
              <span className="px-2.5 py-0.5 bg-cyan-500/20 border border-cyan-500/40 rounded-md text-[10px] text-cyan-300 font-bold uppercase font-mono animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0 animate-spin" />
                Translating to {hymnLanguage}...
              </span>
            ) : hymnLanguage && hymnLanguage !== "English" ? (
              <span className="px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-md text-[10px] text-emerald-300 font-bold uppercase font-mono flex items-center gap-1.5 shadow-sm">
                <Check className="w-3 h-3 text-emerald-450 shrink-0" />
                Translated script ({hymnLanguage})
              </span>
            ) : null}
          </div>
          <h3 className="text-xl font-serif font-bold text-white leading-tight">
            {hymn.title} <span className="text-sm font-sans text-slate-400 ml-1">({hymn.originalTitle})</span>
          </h3>
          <p className="text-xs sm:text-sm font-serif text-slate-300 leading-relaxed">
            {hymn.intro}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 md:justify-end items-center">
          {/* Save to Journal/Bookmark Button */}
          {onBookmarkHymn && (
            <button
              onClick={handleBookmarkClick}
              className={`p-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-md ${
                bookmarkedHymnKeys.includes(selectedHymnKey)
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                  : "bg-white/5 border-white/10 hover:border-white/20 text-slate-300 hover:text-white"
              }`}
              title={bookmarkedHymnKeys.includes(selectedHymnKey) ? "Remove from study journal" : "Save to personal study journal"}
              id="bookmark-hymn-btn"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedHymnKeys.includes(selectedHymnKey) ? "fill-amber-400 text-amber-400" : ""}`} />
              <span>{bookmarkedHymnKeys.includes(selectedHymnKey) ? "Saved to Journal" : "Save to Journal"}</span>
            </button>
          )}

          {/* Play Audio Button Next to Lyrics */}
          {AARTI_AUDIO_RESOURCES[selectedHymnKey] && (
            <button
              onClick={handleTogglePlayAudio}
              disabled={isSourceOffline || isSourceChecking}
              className={`p-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-md ${
                isSourceOffline
                  ? "bg-stone-800 border-stone-700 text-stone-500 cursor-not-allowed opacity-50"
                  : isSourceChecking
                  ? "bg-amber-500/5 border-amber-500/20 text-amber-300 cursor-wait opacity-80 animate-pulse"
                  : isPlaying 
                  ? "bg-amber-500 border-amber-500 text-black font-extrabold animate-pulse ring-2 ring-amber-500/30" 
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              }`}
              title={isSourceOffline ? "Audio is Offline/Unavailable" : isSourceChecking ? "Validating Audio Source..." : isPlaying ? "Pause professional recording" : "Play professional recording"}
            >
              {isSourceChecking ? (
                <span className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
              ) : isAudioLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isSourceOffline ? "Offline" : isSourceChecking ? "Validating..." : isPlaying ? "Pause Audio" : "Play Audio"}</span>
            </button>
          )}

          {/* Universal Translation Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-[10px] font-mono text-slate-400 hidden lg:inline">Translate:</span>
            <select
              value={hymnLanguage}
              onChange={(e) => setHymnLanguage(e.target.value)}
              className="bg-transparent text-[#e2e8f0] text-xs font-semibold focus:outline-none cursor-pointer pr-1 border-none"
              id="hymn-language-selector"
            >
              {WORLD_LANGUAGES.map((l) => (
                <option key={l.key} value={l.key} className="bg-stone-900 text-slate-300">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Print button */}
          <button
            onClick={triggerPrint}
            className="p-2 bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-lg flex items-center justify-center gap-1.5 text-xs font-mono cursor-pointer"
            title="Open printable sheet layout of lyrics"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Verses</span>
          </button>

          {/* Font Size slider */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg text-slate-300">
            <span className="text-[10px] font-mono text-slate-400">Size:</span>
            <input
              type="range"
              min="12"
              max="28"
              step="2"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16 h-1 rounded cursor-pointer accent-amber-500 outline-none"
            />
            <span className="text-[10px] font-mono text-amber-300">{fontSize}px</span>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL DEVOTIONAL AUDIO STREAMING CONSOLE */}
      {AARTI_AUDIO_RESOURCES[selectedHymnKey] && (
        <div id="audio-sanctuary-player" className="bg-gradient-to-r from-amber-950/25 via-stone-900/60 to-stone-950 border border-amber-500/15 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl relative overflow-hidden animate-fade-in">
          {/* Subtle glowing background aura */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Play Button & Artist Info */}
            <div className="flex items-center gap-4">
              {/* Main Play Circle */}
              <button
                id="play-professional-audio-btn"
                onClick={handleTogglePlayAudio}
                disabled={audioSource === "professional" && (isSourceOffline || isSourceChecking)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all bg-amber-500 text-black hover:bg-amber-400 active:scale-95 cursor-pointer shadow-lg shadow-amber-500/10 shrink-0 ${
                  audioSource === "professional" && isSourceOffline
                    ? "bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-50 shadow-none"
                    : audioSource === "professional" && isSourceChecking
                    ? "bg-amber-500/20 text-amber-300 cursor-wait opacity-80"
                    : (audioSource === "professional" ? isPlaying : isAiSequencePlaying) ? "animate-pulse ring-4 ring-amber-500/20" : ""
                }`}
                title={audioSource === "professional" && isSourceOffline ? "Audio is Offline" : audioSource === "professional" && isSourceChecking ? "Validating Source..." : (audioSource === "professional" ? isPlaying : isAiSequencePlaying) ? "Pause" : "Play"}
              >
                {audioSource === "professional" && isSourceChecking ? (
                  <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                ) : audioSource === "professional" && isAudioLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (audioSource === "professional" ? isPlaying : isAiSequencePlaying) ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Source Selector tabs */}
                  <div className="flex items-center bg-black/45 p-0.5 rounded-lg border border-white/5">
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setIsAiSequencePlaying(false);
                        handleStopAllTTS();
                        setAudioSource("professional");
                        setAudioError(null);
                      }}
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-colors cursor-pointer ${
                        audioSource === "professional" 
                          ? "bg-amber-500 text-black font-extrabold shadow" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🎵 Professional Stream
                    </button>
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setIsAiSequencePlaying(false);
                        handleStopAllTTS();
                        setAudioSource("ai");
                        setAudioError(null);
                      }}
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-colors cursor-pointer ${
                        audioSource === "ai" 
                          ? "bg-amber-500 text-black font-extrabold shadow" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🎙️ AI Voice Reciter
                    </button>
                  </div>

                  {/* Recent Playback dropdown */}
                  {recentHymns.length > 0 && (
                    <div className="relative inline-block text-left">
                      <select
                        value={selectedHymnKey}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && val !== selectedHymnKey) {
                            setSelectedHymnKey(val);
                          }
                        }}
                        className="bg-black/60 hover:bg-stone-900 text-slate-300 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 rounded-lg px-2 py-0.5 text-[10px] font-mono font-bold cursor-pointer transition-all outline-none max-w-[150px] truncate"
                        title="Quickly switch to a recently played prayer"
                      >
                        <option value="" disabled className="text-slate-500">⏳ Recent Playback...</option>
                        {recentHymns.map((k) => {
                          const h = ANTHOLOGY_DATA[k];
                          return (
                            <option key={k} value={k} className="bg-stone-950 text-slate-300 py-1 font-sans">
                              {h ? h.title : k}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {(audioSource === "professional" ? isPlaying : isAiSequencePlaying) && (
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                      {audioSource === "professional" && isAudioLoading ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin text-emerald-400" />
                      ) : (
                        <MicroWaveform colorClass="bg-emerald-400" />
                      )}
                      <span>{audioSource === "professional" ? "Now Streaming" : "Now Reciting"}</span>
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-sans font-bold text-white line-clamp-1">
                  {hymn.title} <span className="text-xs font-normal text-slate-400">{audioSource === "professional" ? (isJewishPrayer ? "Restored High-Fidelity" : "Professional Recording") : "AI Voice Narration"}</span>
                </h4>

                {/* Restored Jewish Prayer High-Fidelity / Fallback Indicator */}
                {isJewishPrayer && (
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    {audioSource === "professional" ? (
                      <span className="text-[10px] font-semibold text-amber-300 font-sans flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-amber-600/5 px-2.5 py-1 rounded-full border border-amber-500/25 shadow-sm animate-pulse">
                        <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: "4s" }} />
                        <span>High-Fidelity Restored Source (themathesontrust.org)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 font-sans flex items-center gap-1.5 bg-stone-900/50 px-2.5 py-1 rounded-full border border-white/5">
                        <Volume2 className="w-3 h-3 text-slate-500" />
                        <span>Using Fallback AI Voice. Switch to <strong>Professional Stream</strong> for high-fidelity restoration.</span>
                      </span>
                    )}
                  </div>
                )}

                {audioSource === "professional" ? (
                  <p className="text-xs text-slate-400 font-serif flex items-center gap-1 mt-1">
                    <Music className="w-3 h-3 text-amber-500/70 shrink-0" />
                    {(useCustomAudio || (customAudioUrls[selectedHymnKey] && customAudioUrls[selectedHymnKey].trim() !== "")) ? (
                      <span>Source: <strong className="text-amber-400">{(() => {
                        try {
                          const url = customAudioUrls[selectedHymnKey] || "";
                          if (url) {
                            const hostname = new URL(url).hostname;
                            const preset = MATHESON_PRESETS.find(p => p.url === url);
                            if (preset) return "The Matheson Trust Library";
                            return hostname;
                          }
                        } catch (e) {}
                        return "Custom Audio Stream";
                      })()}</strong></span>
                    ) : (
                      <span>Singer/Source: <strong className="text-slate-300">{isJewishPrayer ? "The Matheson Trust Library" : AARTI_AUDIO_RESOURCES[selectedHymnKey].singer}</strong></span>
                    )}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 font-serif flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Reader: <strong className="text-slate-300">Holy Sanctuary AI Voice (Tone Adjustable)</strong></span>
                  </p>
                )}
              </div>
            </div>

            {/* Middle Audio Wave Visualizer Panel (Hidden on small screens) */}
            <div className="hidden md:flex items-center gap-1 bg-black/40 px-3 py-2 rounded-lg border border-white/5 h-12 self-stretch shrink-0">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mr-2 select-none">Aura Wave</span>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar, i) => {
                const animationDelay = `${i * 100}ms`;
                return (
                  <div
                    key={i}
                    className={`w-0.5 bg-amber-500/80 rounded-full transition-all duration-300 ${
                      (audioSource === "professional" ? isPlaying : isAiSequencePlaying) ? `animate-[bounce_1.2s_infinite_ease-in-out]` : "h-1 bg-white/20"
                    }`}
                    style={{
                      animationDelay: (audioSource === "professional" ? isPlaying : isAiSequencePlaying) ? animationDelay : "0ms",
                      height: (audioSource === "professional" ? isPlaying : isAiSequencePlaying) ? "100%" : "4px"
                    }}
                  />
                );
              })}
            </div>

            {/* Volume & Speed Controls */}
            <div className="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/5 lg:self-stretch shrink-0 justify-between sm:justify-start">
              {/* Playback rate speed buttons */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                {[1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    id={`rate-${rate}`}
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded cursor-pointer transition-all ${
                      playbackRate === rate 
                        ? "bg-amber-500 text-black shadow-md" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Speaker Volume Block */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 hover:bg-white/5 rounded-md text-slate-400 hover:text-white cursor-pointer transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-14 sm:w-16 h-1 rounded cursor-pointer accent-amber-500 outline-none"
                  title={`Volume: ${Math.round(volume * 100)}%`}
                />
              </div>

              {/* Dedicated Speech Pitch Block */}
              <div className="flex items-center gap-1.5 border-l border-white/10 pl-2.5" title="Speech Pitch: Adjust from Deep (0.5x) to High (2.0x)">
                <span className="text-[10px] font-mono text-amber-400 whitespace-nowrap font-semibold">Speech Pitch:</span>
                <input
                  id="anthology-pitch-slider"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={audioPitch}
                  onChange={(e) => handleUpdatePitch(parseFloat(e.target.value))}
                  className="w-16 h-1 rounded cursor-pointer accent-amber-500 outline-none"
                  title="Adjust vocal pitch from Deep (0.5x) to High (2.0x)"
                />
                <span className="text-[10px] font-mono text-amber-500 min-w-[50px] text-right font-bold">
                  {audioPitch === 1.0 ? "1.0x" : audioPitch < 1.0 ? `${audioPitch.toFixed(1)}x (Deep)` : `${audioPitch.toFixed(1)}x (High)`}
                </span>
              </div>

              {/* Vertical Divider line */}
              <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

              {/* Share Audio Button */}
              <button
                id="share-professional-audio-btn"
                onClick={handleShareAudio}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                  shareCopied
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                    : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/25 hover:border-amber-500/50"
                }`}
                title="Copy deep link to this audio chapter with autoplay"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Audio</span>
                  </>
                )}
              </button>

            </div>

          </div>

          {/* ALTERNATIVE AUDIO SOURCE CONFIGURATION */}
          {audioSource === "professional" && (
            <div className="bg-black/35 p-3 rounded-xl border border-white/5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    Devotional Audio Server Mode
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Choose standard Archive.org storage node (optimized self-healing) or paste a custom MP3 source.
                  </span>
                </div>
                
                <div className="flex items-center bg-stone-900 p-0.5 rounded-lg border border-white/10 self-start sm:self-center">
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      handleToggleUseCustomAudio(false);
                      setAudioError(null);
                    }}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-colors cursor-pointer ${
                      !useCustomAudio
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🏛️ Archive.org (Standard)
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      handleToggleUseCustomAudio(true);
                      setAudioError(null);
                    }}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-colors cursor-pointer ${
                      useCustomAudio
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🔗 Custom Audio URL
                  </button>
                </div>
              </div>

              {useCustomAudio && (
                <div className="space-y-2 pt-1 border-t border-white/5 animate-fade-in">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customAudioUrls[selectedHymnKey] || ""}
                      onChange={(e) => handleUpdateCustomAudioUrl(e.target.value)}
                      placeholder="Paste public direct MP3 URL here (e.g., https://example.com/audio.mp3)"
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    {customAudioUrls[selectedHymnKey] && (
                      <button
                        onClick={() => {
                          handleUpdateCustomAudioUrl("");
                          setIsPlaying(false);
                          setAudioError(null);
                        }}
                        className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 hover:border-rose-500/40 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                        title="Clear custom URL"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <div className="bg-stone-900/40 p-2.5 rounded-lg border border-white/5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      <span>🕌</span>
                      <span>The Matheson Trust Audio Library Presets:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {MATHESON_PRESETS.map((preset) => {
                        const isSelected = customAudioUrls[selectedHymnKey] === preset.url;
                        return (
                          <button
                            key={preset.name}
                            onClick={() => {
                              handleUpdateCustomAudioUrl(preset.url);
                              setIsPlaying(false);
                              setAudioError(null);
                            }}
                            className={`text-[10px] p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-full ${
                              isSelected
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                : "bg-black/30 border-white/5 hover:border-white/10 text-slate-300 hover:text-white"
                            }`}
                          >
                            <div>
                              <span className="font-bold block line-clamp-1 text-[10px]">{preset.name}</span>
                              <span className="text-[9px] text-slate-400 block line-clamp-1 mt-0.5">{preset.description}</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between w-full">
                              <span className="text-[8px] font-mono opacity-60">themathesontrust.org</span>
                              {isSelected && (
                                <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/35 font-semibold">Active</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 space-y-1.5 text-[10px] text-slate-300">
                    <p className="font-semibold text-amber-400">💡 Custom MP3 Resource Guide:</p>
                    <p>
                      You can replace the 503-prone archive.org server links with high-speed direct MP3 links from online libraries like <strong className="text-white font-mono">themathesontrust.org</strong>, or other reliable spiritual and cultural mp3 directories.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-slate-400">Try these popular resources:</span>
                      <a
                        href="https://www.themathesontrust.org/publications-resources/sound-recordings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:underline flex items-center gap-0.5"
                      >
                        The Matheson Trust Audio Library ↗
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OFFLINE AUDIO CACHING AND TOGGLE CONTROL */}
          {audioSource === "professional" && (
            <div className="bg-gradient-to-r from-stone-900 via-black/40 to-stone-900 p-3 rounded-xl border border-white/5 space-y-3">
              <div className="flex flex-col md:flex-row justify-between gap-3 items-start md:items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1">
                    💾 Offline Audio Settings & Storage
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Save vocal prayer audio directly to your local browser storage (IndexedDB) for seamless internet-free listening.
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Offline Mode Toggle */}
                  <div className="flex items-center gap-1.5 bg-white/5 p-1 px-2 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-300 font-mono">Offline Mode:</span>
                    <button
                      onClick={() => {
                        if (onToggleOfflineAudioMode) {
                          onToggleOfflineAudioMode(!offlineAudioMode);
                        }
                      }}
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md transition-all border cursor-pointer ${
                        offlineAudioMode
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-extrabold"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                      }`}
                      title={offlineAudioMode ? "Disable Offline Audio Mode" : "Enable Offline Audio Mode"}
                    >
                      {offlineAudioMode ? "🟢 ON" : "⚪ OFF"}
                    </button>
                  </div>

                  {/* Auto-Cache Toggle */}
                  <div className="flex items-center gap-1.5 bg-white/5 p-1 px-2 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-300 font-mono">Auto-Cache New:</span>
                    <button
                      onClick={() => handleToggleAutoCacheNewStreams(!autoCacheNewStreams)}
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md transition-all border cursor-pointer ${
                        autoCacheNewStreams
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-400 font-extrabold"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                      }`}
                      title="Automatically cache streams to IndexedDB upon the first successful full playback completion"
                    >
                      {autoCacheNewStreams ? "⚡ ON" : "⚪ OFF"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2.5 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono text-[10px]">Current Prayer Cache Status:</span>
                  {isCurrentlyCached ? (
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-sm">
                      ✓ Offline Ready (Cached)
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-amber-500/5 text-amber-300 border border-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      ⚠ Remote Only (Not Cached)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => setShowOfflineLibrary(!showOfflineLibrary)}
                    className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      showOfflineLibrary 
                        ? "bg-amber-500/25 text-amber-300 border border-amber-500/50" 
                        : "bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-500/35 hover:border-amber-500/50 shadow-md"
                    }`}
                    title="Open Offline Library Drawer"
                  >
                    📚 Offline Library
                  </button>

                  <button
                    onClick={() => setShowCacheManager(!showCacheManager)}
                    className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      showCacheManager 
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                        : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-white/20"
                    }`}
                    title="Manage all cached audio and storage"
                  >
                    ⚙ {showCacheManager ? "Close Manager" : "Manage Storage"}
                  </button>

                  {isCachingInProgress ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                      <span className="w-2.5 h-2.5 rounded-full border border-amber-500 border-t-transparent animate-spin inline-block" />
                      <span className="text-[10px] font-mono text-amber-400">
                        Downloading stream: {cachingProgressPercent}%
                      </span>
                    </div>
                  ) : (
                    <>
                      {!isCurrentlyCached ? (
                        <button
                          onClick={handleCacheActiveAudio}
                          className="w-full sm:w-auto bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/20 hover:border-amber-500/50 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          title="Fetch and download this prayer's audio stream so you can listen completely offline"
                        >
                          📥 Cache for Offline
                        </button>
                      ) : (
                        <button
                          onClick={handleDeleteCache}
                          className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/15 hover:border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          title="Delete downloaded audio stream to clear space"
                        >
                          🗑 Delete Cached Audio
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* EXPANDED CACHED AUDIO MANAGER SECTION */}
              {showCacheManager && (
                <div className="pt-3 mt-3 border-t border-white/10 space-y-2 animate-fade-in bg-black/50 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      📂 IndexedDB Audio Cache Storage
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      Total items: {cachedItems.length}
                    </span>
                  </div>

                  {/* Auto-Pruning Banner & Total Storage Size Meter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[9px] font-mono bg-amber-500/5 hover:bg-amber-500/10 p-2 rounded-md border border-amber-500/20 transition-all text-amber-300">
                    <span className="flex items-center gap-1">
                      ⚡ <span className="font-extrabold uppercase">Auto-Pruning Active</span> (Oldest First)
                    </span>
                    <span className="font-semibold">
                      Used: <span className="font-bold text-white">{totalCacheSize}</span> / 500.00 MB
                    </span>
                  </div>

                  {cachedItems.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500 italic font-mono bg-stone-900/45 rounded-md border border-white/5">
                      No prayers or audio streams are currently cached locally.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {cachedItems.map((item) => (
                        <div 
                          key={item.key} 
                          className={`flex items-center justify-between p-2 rounded-md border text-xs font-mono transition-all ${
                            item.key === selectedHymnKey 
                              ? "bg-amber-500/5 border-amber-500/20 text-white" 
                              : "bg-stone-900/60 border-white/5 text-slate-300 hover:border-white/10"
                          }`}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="font-bold truncate text-slate-200">
                              {item.title} {item.key === selectedHymnKey && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-extrabold ml-1 uppercase">Active</span>}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                              Size: {item.size}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteCachedItem(item.key)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded border border-rose-500/20 hover:border-rose-500/40 cursor-pointer font-bold transition-all shrink-0 active:scale-95"
                            title={`Delete cached audio for ${item.title}`}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Time Scrubber / Verses Scroller Row */}
          <div className="space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-amber-400 font-semibold select-none shrink-0 min-w-[32px]">
                {audioSource === "professional" ? formatAudioTime(currentTime) : `V. ${aiNarratorCurrentIndex + 1}`}
              </span>
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max={audioSource === "professional" ? (duration || 100) : (activeHymn.verses.length - 1)}
                  step={audioSource === "professional" ? "0.1" : "1"}
                  value={audioSource === "professional" ? currentTime : aiNarratorCurrentIndex}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (audioSource === "professional") {
                      handleSeek(val);
                    } else {
                      setAiNarratorCurrentIndex(val);
                      if (isAiSequencePlaying) {
                        setIsAiSequencePlaying(false);
                        setTimeout(() => setIsAiSequencePlaying(true), 50);
                      }
                    }
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-amber-500 outline-none transition-all hover:h-1.5"
                />
              </div>
              <span className="text-[11px] font-mono text-slate-400 select-none shrink-0 min-w-[32px]">
                {audioSource === "professional" 
                  ? formatAudioTime(duration || (AARTI_AUDIO_RESOURCES[selectedHymnKey] ? parseFloat(AARTI_AUDIO_RESOURCES[selectedHymnKey].durationLabel.split(":")[0]) * 60 + parseFloat(AARTI_AUDIO_RESOURCES[selectedHymnKey].durationLabel.split(":")[1]) : 0))
                  : `${activeHymn.verses.length} Verses`}
              </span>
            </div>

            {(audioError || isSourceOffline) && (
              <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-3.5 mt-2.5 space-y-3 shadow-xl shadow-black/60 backdrop-blur-md animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                      {validationResultDetail?.errorType === "404_ERROR" 
                        ? "Stream Missing (404 Error)" 
                        : validationResultDetail?.errorType === "FORMAT_ERROR"
                        ? "Mismatched Audio Format"
                        : "Stream Server Offline / Transient Load Error"}
                    </p>
                    <p className="text-[10px] text-slate-300 leading-relaxed mt-1">
                      {validationResultDetail?.message || audioError || "The selected audio stream is offline or experiencing server load limits."}
                    </p>
                    {audioRetryCount > 0 && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping shrink-0" />
                        <p className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wide">
                          Cascading Failover active: Auto-retrying via redundant nodes (Attempt {audioRetryCount}/4)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2.5 border-t border-white/5">
                  <button
                    onClick={handleManualRevalidate}
                    disabled={isRevalidating || isSourceChecking}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    {isRevalidating || isSourceChecking ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        Force Re-Validate
                      </>
                    )}
                  </button>

                  <button 
                    onClick={() => {
                      setAudioSource("ai");
                      setAudioError(null);
                      setIsAiSequencePlaying(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono font-extrabold uppercase bg-amber-500 text-black hover:bg-amber-400 transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    🎙️ Use AI Reciter
                  </button>

                  <button 
                    onClick={() => {
                      const targetBypass = !bypassProxy;
                      handleToggleBypassProxy(targetBypass);
                      forcePlayWithSettings(targetBypass, useBackup);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-mono font-extrabold uppercase transition-all border cursor-pointer active:scale-95 ${
                      bypassProxy 
                        ? "bg-amber-500/20 border-amber-500/30 text-amber-300" 
                        : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                    title="Stream audio directly in the browser to bypass server-side proxy constraints"
                  >
                    🌐 {bypassProxy ? "Direct Mode: ON" : "Turn ON Direct"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode Switches & Verses Search */}
      <div className="bg-[#121216] p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Style selection buttons */}
        <div className="space-y-1.5 w-full md:w-auto">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
            Step 2: Choose Reading Style Format
          </label>
          {(() => {
            const isIslamic = ["ayat_al_kursi", "sayyidul_istighfar", "rabbana_duas", "prophet_yunus_dua", "rabbi_zidni_ilman"].includes(selectedHymnKey);
            const isChristian = ["amazing_grace", "be_thou_my_vision", "holy_holy_holy", "the_lords_prayer", "how_great_thou_art", "peace_prayer_st_francis"].includes(selectedHymnKey);
            const isJewish = ["shema_yisrael", "modeh_ani", "birkat_kohanim", "hamotzi", "borei_pri_hagafen", "tefilat_haderech", "el_mistater", "kol_nidrei", "psalm_23_hebrew", "nigunim_hasidic", "yedid_nefesh", "bereshit_genesis", "shir_ha_shirim"].includes(selectedHymnKey);
            const isBuddhist = ["tashi_gyatpa", "kyabdro_semkye", "shakyamuni_praise", "green_tara_praise", "heart_sutra_mantra", "medicine_buddha", "buddhist_compassion_mantra"].includes(selectedHymnKey);
            const isJain = ["navkar_mantra", "chattari_mangalam", "uvasaggaharam_stotra", "kshamapana_sutra", "bhaktamar_stotra", "logassa_sutra"].includes(selectedHymnKey);
            const isSikh = ["japji_sahib", "tav_prasad_saviye", "ardas", "chaupai_sahib"].includes(selectedHymnKey);
            
            const originalScriptLabel = isIslamic ? "Original Arabic" :
                                       isJewish ? "Original Hebrew" :
                                       isSikh ? "Original Gurmukhi" :
                                       isBuddhist ? "Original Tibetan/Sanskrit" :
                                       isChristian ? "Original Text" :
                                       isJain ? "Original Prakrit" : "Original Sanskrit";

            return (
              <div className="flex flex-wrap gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setViewMode("devanagari")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    viewMode === "devanagari" ? "bg-amber-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {originalScriptLabel}
                </button>
                <button
                  onClick={() => setViewMode("translit")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    viewMode === "translit" ? "bg-amber-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Transliteration
                </button>
                <button
                  onClick={() => setViewMode("meaning")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    viewMode === "meaning" ? "bg-amber-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {hymnLanguage === "English" ? "English meaning" : `${hymnLanguage} Translation`}
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    viewMode === "split" ? "bg-amber-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Line-by-Line Parallel
                </button>
              </div>
            );
          })()}
        </div>
        
        {/* Verse Search Field */}
        <div className="w-full md:w-64 space-y-1 bg-transparent">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold leading-none">
            Filter Verses / Search Terms
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words (e.g. Ram, Gauri, bhajan)..."
              className="w-full bg-black/30 border border-white/10 rounded-lg py-1.5 pl-8 pr-7 text-xs focus:outline-none focus:border-amber-500/50 text-slate-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Printable Area - Render lyrics sheets */}
      <div id="anthology-printable-content" className="space-y-5">
        {filteredVerses.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/5 rounded-xl">
            <p className="text-sm font-sans text-slate-400">No verses found containing &ldquo;{searchQuery}&rdquo;.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2.5 text-xs text-amber-400 hover:underline hover:text-amber-300"
            >
              Clear Filter Query
            </button>
          </div>
        ) : (
          filteredVerses.map((verse, idx) => {
            const isSpeakingThis = speakingIdx === idx;
            
            const hColor = hymnHighlights[`${selectedHymnKey}_${verse.number}`];
            let bgBorderClass = "bg-white/[0.01] border-white/5";
            if (hColor === "yellow") {
              bgBorderClass = "bg-amber-500/[0.08] border-amber-500/25 shadow-[inset_0_1px_1px_rgba(245,158,11,0.05)]";
            } else if (hColor === "green") {
              bgBorderClass = "bg-emerald-500/[0.08] border-emerald-500/25 shadow-[inset_0_1px_1px_rgba(16,185,129,0.05)]";
            } else if (hColor === "blue") {
              bgBorderClass = "bg-sky-500/[0.08] border-sky-500/25 shadow-[inset_0_1px_1px_rgba(14,165,233,0.05)]";
            } else if (hColor === "pink") {
              bgBorderClass = "bg-rose-500/[0.08] border-rose-500/25 shadow-[inset_0_1px_1px_rgba(244,63,94,0.05)]";
            } else if (hColor === "purple") {
              bgBorderClass = "bg-purple-500/[0.08] border-purple-500/25 shadow-[inset_0_1px_1px_rgba(168,85,247,0.05)]";
            }

            return (
              <div
                key={idx}
                id={`anthology-stanza-${verse.number}`}
                className={`border rounded-xl p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all duration-300 hover:bg-white/[0.03] hover:border-amber-500/10 group relative ${bgBorderClass}`}
              >
                {/* Verse Content Pane */}
                <div className="flex-1 space-y-3">
                  {/* Number tag */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded text-amber-300 font-bold">
                      {verse.number}
                    </span>
                  </div>

                  {/* Rendering based on ViewMode */}
                  <div className="space-y-2 leading-relaxed">
                    
                    {/* 1. ORIGINAL HINDI/SANSKRIT */}
                    {(viewMode === "devanagari" || viewMode === "split") && (
                      (() => {
                        const originalTextStr = verse.original || verse.originalText || "";
                        const isHindi = /[\u0900-\u097F]/.test(originalTextStr);
                        return (
                          <p 
                            className={`text-white py-1.5 ${
                              isHindi 
                                ? "font-hindi leading-[1.95] tracking-normal" 
                                : "font-serif leading-loose tracking-wide"
                            }`}
                            style={{ fontSize: `${fontSize + 2}px` }}
                          >
                            {originalTextStr.split('\n').map((line, i) => (
                              <span key={i} className="block">{line}</span>
                            ))}
                          </p>
                        );
                      })()
                    )}

                    {/* 2. ROMANIZED TRANSLITERATION */}
                    {(viewMode === "translit" || viewMode === "split") && (
                      <p 
                        className="font-sans italic text-amber-200/80 leading-relaxed font-light"
                        style={{ fontSize: `${fontSize - 1}px` }}
                      >
                        {(verse.transliteration || "").split('\n').map((line, i) => (
                          <span key={i} className="block">{line}</span>
                        ))}
                      </p>
                    )}

                    {/* 3. ENGLISH TRANSLATION */}
                    {(viewMode === "meaning" || viewMode === "split") && (
                      (() => {
                        const isTranslHindi = /[\u0900-\u097F]/.test(verse.translation || "");
                        return (
                          <p 
                            className={`text-slate-300 ${
                              isTranslHindi 
                                ? "font-hindi !leading-[1.9] !tracking-normal py-1" 
                                : "font-serif leading-relaxed"
                            }`}
                            style={{ fontSize: `${fontSize}px` }}
                          >
                            {verse.translation}
                          </p>
                        );
                      })()
                    )}

                  </div>
                </div>

                {/* Instant Actions Toolbar per Stanza */}
                <div className="flex items-center gap-1.5 self-end md:self-start opacity-75 group-hover:opacity-100 transition-opacity bg-black/40 md:bg-transparent px-2.5 py-1.5 md:p-0 rounded-lg">
                  {/* Speech button */}
                  <button
                    onClick={() => handleSpeakVerse(verse, idx)}
                    className={`p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer ${
                      isSpeakingThis ? "bg-amber-500 text-black hover:bg-amber-400 font-semibold" : ""
                    }`}
                    title={isSpeakingThis ? (hymnAudioLoading ? "Synthesizing AI audio..." : "Stop speaking verse") : `Listen aloud in ${hymnLanguage}`}
                  >
                    {isSpeakingThis ? (
                      hymnAudioLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                      ) : (
                        <MicroWaveform colorClass="bg-black" />
                      )
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(`${verse.original || verse.originalText || ""}\n\n${verse.transliteration}\n\n${verse.translation}`, idx)}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                    title="Copy full verse text and metadata"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Highlight Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHymnHighlightPicker(activeHymnHighlightPicker === verse.number ? null : verse.number);
                      }}
                      className={`p-1.5 rounded-md hover:bg-white/10 transition-all cursor-pointer ${
                        hymnHighlights[`${selectedHymnKey}_${verse.number}`]
                          ? "text-amber-300 bg-amber-500/15"
                          : "text-slate-400 hover:text-white"
                      }`}
                      title="Highlight stanza with a background color"
                    >
                      <Highlighter className="w-3.5 h-3.5" />
                    </button>

                    {activeHymnHighlightPicker === verse.number && (
                      <div 
                        className="absolute right-0 bottom-full mb-2 z-50 bg-slate-900 border border-white/15 rounded-xl p-2 shadow-xl flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {[
                          { name: "yellow", bg: "bg-amber-500" },
                          { name: "green", bg: "bg-emerald-500" },
                          { name: "blue", bg: "bg-sky-500" },
                          { name: "pink", bg: "bg-rose-500" },
                          { name: "purple", bg: "bg-purple-500" }
                        ].map((colorObj) => {
                          const isSelected = hymnHighlights[`${selectedHymnKey}_${verse.number}`] === colorObj.name;
                          return (
                            <button
                              key={colorObj.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleHymnHighlight(selectedHymnKey, verse.number, colorObj.name);
                                setActiveHymnHighlightPicker(null);
                              }}
                              className={`w-4 h-4 rounded-full ${colorObj.bg} relative hover:scale-110 transition-transform cursor-pointer border ${
                                isSelected ? "ring-2 ring-white border-slate-900" : "border-white/10"
                              }`}
                              title={`Highlight ${colorObj.name}`}
                            >
                              {isSelected && <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">✓</span>}
                            </button>
                          );
                        })}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleHymnHighlight(selectedHymnKey, verse.number, "");
                            setActiveHymnHighlightPicker(null);
                          }}
                          className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[8px] text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                          title="Clear highlight"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Commentary card at the very bottom */}
      <div className="bg-amber-500/5 border border-amber-500/15 p-5 rounded-2xl space-y-2">
        <h4 className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-500" /> Academic & Spiritual Commentary
        </h4>
        <p className="text-xs sm:text-sm font-serif leading-relaxed text-slate-200">
          {hymn.commentary}
        </p>
      </div>

      {/* OFFLINE LIBRARY DRAWER OVERLAY */}
      {showOfflineLibrary && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="offline-library-drawer-container">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer animate-fade-in"
            onClick={() => setShowOfflineLibrary(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#0f0f13] border-l border-amber-500/10 shadow-2xl flex flex-col justify-between text-slate-100 animate-slide-in">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/5 space-y-1 bg-[#141419]">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-sans text-amber-300 flex items-center gap-2">
                    <span>📚 Offline Audio Library</span>
                  </h3>
                  <button 
                    onClick={() => setShowOfflineLibrary(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  List of successfully cached scriptures. Play or delete files stored locally on your device or in the cloud cache without requiring active internet requests.
                </p>
              </div>

              {/* Action and Metrics Bar */}
              <div className="p-4 bg-stone-900/50 border-b border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    Storage Occupied
                  </div>
                  <div className="font-semibold text-amber-200 font-mono">
                    {totalCacheSize} used
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadOfflineLibraryData}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-all border border-white/5 flex items-center gap-1 text-[10px] font-mono font-bold uppercase"
                    title="Refresh status of cached files"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                  <button
                    onClick={handlePurgeAllCaches}
                    disabled={isPurgingAll}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer transition-all border border-rose-500/15 flex items-center gap-1 text-[10px] font-mono font-bold uppercase disabled:opacity-50"
                  >
                    {isPurgingAll ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin animate-spin-slow" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Purge All
                  </button>
                </div>
              </div>

              {/* Drawer Content - Lists Cached Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {(() => {
                  const items = getOfflineLibraryItems();
                  if (items.length === 0) {
                    return (
                      <div className="text-center py-16 space-y-3 bg-[#131317]/50 rounded-xl border border-dashed border-white/5 p-5">
                        <div className="text-3xl">💾</div>
                        <p className="text-xs text-slate-400 italic">
                          No scriptures are currently cached.
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                          To save audio offline, enable "Offline Mode" or click "Cache for Offline" inside any active chapter's professional audio settings.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        <span>Successfully Cached ({items.length})</span>
                        <span>Size</span>
                      </div>

                      {items.map((item) => {
                        const isActive = item.key === selectedHymnKey;
                        return (
                          <div 
                            key={item.key} 
                            className={`p-3.5 rounded-xl border transition-all ${
                              isActive 
                                ? "bg-amber-500/[0.04] border-amber-500/30 ring-1 ring-amber-500/25" 
                                : "bg-[#131317] border-white/5 hover:border-white/10"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs text-slate-100">{item.title}</span>
                                  {isActive && (
                                    <span className="text-[8px] bg-amber-500/10 text-amber-300 border border-amber-500/25 px-1 py-0.5 rounded font-bold uppercase tracking-wider">
                                      Active Playing
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                                  <span className="px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-[9px] font-mono text-slate-300">
                                    {item.category}
                                  </span>
                                  <span>Singer: {item.singer}</span>
                                  <span>•</span>
                                  <span>{item.durationLabel}</span>
                                </div>
                              </div>
                              <span className="text-xs font-mono font-bold text-slate-300">{item.sizeLabel}</span>
                            </div>

                            {/* Storage Location Badges */}
                            <div className="flex items-center gap-2 mt-3 text-[9px] font-mono">
                              <span className="text-slate-500">Storage:</span>
                              {item.isLocal && (
                                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                                  <HardDrive className="w-2.5 h-2.5" /> Browser
                                </span>
                              )}
                              {item.isServer && (
                                <span className="flex items-center gap-1 text-amber-400 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10">
                                  <Server className="w-2.5 h-2.5" /> Cloud Server
                                </span>
                              )}
                            </div>

                            {/* Item Action Buttons */}
                            <div className="flex gap-2 mt-3.5 pt-2.5 border-t border-white/5">
                              <button
                                onClick={() => handlePlayOfflineItem(item.key)}
                                className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" /> Play Offline
                              </button>
                              <button
                                onClick={() => handlePurgeSingleScripture(item.key)}
                                disabled={isPurgingItem === item.key}
                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold border border-rose-500/10 transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                                title="Delete cached audio files for this scripture"
                              >
                                {isPurgingItem === item.key ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/5 bg-[#141419] text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>Vocal Caching v2.0</span>
                <span>Active Sync Mode</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
