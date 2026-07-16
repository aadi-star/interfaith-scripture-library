import React, { useState, useEffect } from "react";
import {
  Image,
  Trash2,
  RotateCcw,
  Sparkles,
  Search,
  Database,
  Sliders,
  Check,
  AlertCircle,
  HelpCircle,
  BookOpen,
  User,
  ExternalLink,
  Sunset,
  Scroll,
  Globe,
  Shield,
  Lock,
  Unlock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { SCRIPTURE_BOOKS } from "../scripturesRegistry";
import { SACRED_CHARACTERS } from "../charactersRegistry";
import { saveUserCustomImage, deleteUserCustomImage, getAdminAuditLogs, AdminAuditLog, migrateDataToNewDatabase } from "../firebase";

interface MediaSettingsManagerProps {
  customImages: { [key: string]: string };
  onSaveCustomImage: (key: string, type: "scripture" | "character", url: string) => void;
  onResetCustomImage: (key: string) => void;
  onApplyThemeToAll: (themeUrl: string, type: "scripture" | "character" | "both") => void;
  currentUser: any;
  galleryLocked: boolean;
  onToggleGalleryLock: (locked: boolean) => Promise<void>;
}

// Hand-curated gorgeous high-res imagery presets that are multi-faith friendly
const ALTERNATIVE_BACKGROUNDS = [
  {
    name: "Cosmic Nebula",
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
    desc: "Vast celestial galaxies"
  },
  {
    name: "Ancient Bookshelf",
    url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
    desc: "Rustic shelves of scriptures"
  },
  {
    name: "Sacred Altar Candles",
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    desc: "Incense and candlelight"
  },
  {
    name: "Glowing Sacred Fire",
    url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    desc: "Warm light of wisdom"
  },
  {
    name: "Misty Mountaintop",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    desc: "Silent high sanctuary paths"
  },
  {
    name: "Parchment Scroll",
    url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    desc: "Classic sacred calligraphy feel"
  },
  {
    name: "Aetheric Sunlight Glow",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
    desc: "Brilliant celestial rays"
  },
  {
    name: "Mystic Forest Stream",
    url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
    desc: "Calm green foliage & water"
  },
  {
    name: "Vibrant Dawn Harmony",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    desc: "Colorful twilight rising"
  },
  {
    name: "Warm Temple Arches",
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
    desc: "Ancient carved pillars"
  }
];

const PRESET_THEMES = [
  {
    name: "Cosmic Mystic",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    description: "Deep starry cosmic space & celestial nebula imagery, suggesting the infinite scope of scripture."
  },
  {
    name: "Ancient Scriptorium",
    url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    description: "Warm tones of ancient libraries, parchment scrolls, vintage books, and authentic scribe scripts."
  },
  {
    name: "Silent Sanctuary",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Stunning twilight dawn sunrises and soft reflections, evoking a perfect mood for contemplation."
  },
  {
    name: "Temple Flame",
    url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    description: "Rich gold accent structures, glowing candle filaments, and holy embers of spiritual devotion."
  },
  {
    name: "Zen Charcoal Slate",
    url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
    description: "Minimalist slate textures and quiet dark slate stone backgrounds, removing visual distractions."
  }
];

export default function MediaSettingsManager({
  customImages,
  onSaveCustomImage,
  onResetCustomImage,
  onApplyThemeToAll,
  currentUser,
  galleryLocked,
  onToggleGalleryLock
}: MediaSettingsManagerProps) {
  const [activeMode, setActiveMode] = useState<"scriptures" | "characters" | "audit_logs" | "database_migration">("scriptures");
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [migrationRunning, setMigrationRunning] = useState(false);
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const [sourceDbId, setSourceDbId] = useState("ai-studio-b2e32fdd-3ee5-4e14-94e3-fcb48f44bdfa");
  const [useCustomDbId, setUseCustomDbId] = useState(false);
  const [customDbIdInput, setCustomDbIdInput] = useState("");

  const handleStartMigration = async () => {
    if (migrationRunning) return;
    setMigrationRunning(true);
    setMigrationCompleted(false);
    setMigrationLogs(["🔌 Initializing client-authenticated secure migration bridge..."]);
    try {
      const activeSourceId = useCustomDbId ? customDbIdInput.trim() : sourceDbId;
      if (useCustomDbId && !activeSourceId) {
        throw new Error("Custom database ID cannot be empty.");
      }
      await migrateDataToNewDatabase(activeSourceId, (status) => {
        setMigrationLogs((prev) => [...prev, status]);
      });
      setMigrationCompleted(true);
    } catch (err: any) {
      setMigrationLogs((prev) => [...prev, `❌ [ERROR] Migration failed: ${err.message || err}`]);
    } finally {
      setMigrationRunning(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReligion, setSelectedReligion] = useState<string>("all");
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"timestamp" | "userEmail" | "action" | "details">("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [inputUrls, setInputUrls] = useState<{ [key: string]: string }>({});
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: { type: "success" | "error"; msg: string } }>({});
  
  // Security lock states
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [toggleSuccess, setToggleSuccess] = useState<string | null>(null);

  // Administrative System Audit Logs
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);

  const fetchAuditLogs = async () => {
    if (!currentUser || currentUser.email !== "adarshshuklagarg@gmail.com") return;
    setLoadingLogs(true);
    try {
      const logs = await getAdminAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error("Failed to load administrative audit logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Just now";
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }
    if (typeof timestamp === "string") {
      return new Date(timestamp).toLocaleString();
    }
    try {
      if (typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleString();
      }
    } catch (_) {}
    return "Just now";
  };

  useEffect(() => {
    if (currentUser?.email === "adarshshuklagarg@gmail.com") {
      fetchAuditLogs();
    }
  }, [currentUser]);

  const handleToggleLock = async (locked: boolean) => {
    setToggleError(null);
    setToggleSuccess(null);
    try {
      await onToggleGalleryLock(locked);
      setToggleSuccess(`System policy updated successfully. Interactive Art is now ${locked ? "LOCKED" : "UNLOCKED"} for general users.`);
      fetchAuditLogs();
      setTimeout(() => setToggleSuccess(null), 4000);
    } catch (err: any) {
      setToggleError(err.message || "Failed to update security policy.");
    }
  };

  // Quick theme state
  const [targetThemeType, setTargetThemeType] = useState<"scripture" | "character" | "both">("both");
  const [themeStatus, setThemeStatus] = useState<string | null>(null);

  // Sync state loaded info
  useEffect(() => {
    // Sync initial inputs with current custom overrides
    const initialInputs: { [key: string]: string } = {};
    Object.entries(customImages).forEach(([key, val]) => {
      initialInputs[key] = val;
    });
    setInputUrls(initialInputs);
  }, [customImages]);

  // Extract all unique religions for filters
  const religionOptions = activeMode === "scriptures"
    ? Array.from(new Set(SCRIPTURE_BOOKS.map((b) => b.religion)))
    : Array.from(new Set(SACRED_CHARACTERS.map((c) => c.religion)));

  // Filter lists
  const filteredScriptures = SCRIPTURE_BOOKS.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || (b.religion || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReligion = selectedReligion === "all" || b.religion === selectedReligion;
    return matchesSearch && matchesReligion;
  });

  const filteredCharacters = SACRED_CHARACTERS.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.role || "").toLowerCase().includes(searchQuery.toLowerCase()) || (c.religion || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReligion = selectedReligion === "all" || c.religion === selectedReligion;
    return matchesSearch && matchesReligion;
  });

  // Filter and Sort Audit Logs
  const filteredAndSortedLogs = auditLogs
    .filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (log.action || "").toLowerCase().includes(q) ||
        (log.details || "").toLowerCase().includes(q) ||
        (log.userEmail || "").toLowerCase().includes(q);
      const matchesAction = selectedActionFilter === "all" || log.action === selectedActionFilter;
      return matchesSearch && matchesAction;
    })
    .sort((a, b) => {
      let valA: any = "";
      let valB: any = "";

      if (sortField === "timestamp") {
        const getMs = (t: any) => {
          if (!t) return 0;
          if (t.seconds !== undefined) return t.seconds * 1000 + (t.nanoseconds || 0) / 1000000;
          if (t instanceof Date) return t.getTime();
          return new Date(t).getTime();
        };
        valA = getMs(a.timestamp);
        valB = getMs(b.timestamp);
      } else {
        valA = (a[sortField] || "").toLowerCase();
        valB = (b[sortField] || "").toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: "timestamp" | "userEmail" | "action" | "details") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const renderSortIcon = (field: "timestamp" | "userEmail" | "action" | "details") => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
    );
  };

  const handleInputChange = (key: string, value: string) => {
    setInputUrls((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplySingle = async (key: string, type: "scripture" | "character") => {
    const url = (inputUrls[key] || "").trim();
    if (!url) {
      setSaveStatus((prev) => ({ ...prev, [key]: { type: "error", msg: "Please enter a valid URL or select a preset." } }));
      return;
    }

    try {
      setSaveStatus((prev) => ({ ...prev, [key]: { type: "success", msg: "Applying changes..." } }));
      
      // Persist via callback (which updates react state & handles local/cloud sync)
      await onSaveCustomImage(key, type, url);
      fetchAuditLogs();
      
      setSaveStatus((prev) => ({
        ...prev,
        [key]: { type: "success", msg: "Successfully saved!" }
      }));
      
      setTimeout(() => {
        setSaveStatus((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }, 3000);
    } catch (err: any) {
      setSaveStatus((prev) => ({
        ...prev,
        [key]: { type: "error", msg: err.message || "Failed to save to database." }
      }));
    }
  };

  const handleResetSingle = async (key: string) => {
    try {
      await onResetCustomImage(key);
      fetchAuditLogs();
      setInputUrls((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setSaveStatus((prev) => ({
        ...prev,
        [key]: { type: "success", msg: "Reverted to default!" }
      }));
      setTimeout(() => {
        setSaveStatus((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }, 3000);
    } catch (err: any) {
      setSaveStatus((prev) => ({
        ...prev,
        [key]: { type: "error", msg: "Could not reset image." }
      }));
    }
  };

  const handleApplyThemePreset = (themeName: string, themeUrl: string) => {
    onApplyThemeToAll(themeUrl, targetThemeType);
    setThemeStatus(`Successfully applied "${themeName}" preset to all chosen resources!`);
    setTimeout(() => {
      fetchAuditLogs();
    }, 1500);
    setTimeout(() => setThemeStatus(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in text-slate-100" id="media-manager-dashboard">
      
      {/* Top Welcome Title Banner */}
      <div className="bg-gradient-to-r from-amber-600/25 via-slate-800/60 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Image className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white">
              Spiritual Media & Image Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Customize cover arts, visual backgrounds, and sacred figure representations used throughout the app. 
            Paste your own high-fidelity URLs, select religious templates, or map unified ambient landscape themes.
          </p>
        </div>
        
        {/* Sync Status Badge */}
        <div className="shrink-0">
          {currentUser ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 text-center space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-xs text-amber-400 font-bold font-mono">
                <Database className="w-3.5 h-3.5" />
                <span>Cloud Sync Live</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Logged in as <span className="text-slate-200 font-medium">{currentUser.email}</span>
              </p>
            </div>
          ) : (
            <div className="bg-slate-800/80 border border-white/5 rounded-2xl px-4 py-3 text-center space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400 font-bold font-mono">
                <Globe className="w-3.5 h-3.5" />
                <span>Local-Only Storage</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Log in via study hub toolbar to sync overrides with cloud!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* BLOCK: GALLERY ACCESS SECURITY POLICIES */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden" id="admin-security-settings">
        {/* Subtle accent background glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${galleryLocked ? 'bg-red-500/10' : 'bg-emerald-500/10'}`} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-amber-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-tight font-sans">
                Gallery Access Control & Religious Security Policy
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-mono uppercase ${galleryLocked ? 'bg-red-500/10 text-red-400 border border-red-500/25' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'}`}>
                {galleryLocked ? "Locked State Active" : "Unlocked State Active"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              As an administrator, you can toggle this security gate. When <strong className="text-red-400">Locked</strong>, all general (non-admin) users are strictly barred from opening the <em>Sacred Interactive Art</em> gallery or selecting custom desk backdrops to protect clean, quiet devotion and maintain static sacred iconography. When <strong className="text-emerald-400">Unlocked</strong>, general users can freely explore verified masterpieces and select them as background layouts.
            </p>
          </div>

          <div className="relative flex items-center bg-slate-950/60 border border-white/10 rounded-2xl p-1 shrink-0 w-48 sm:w-56 h-11 sm:h-12" id="security-toggle-container">
            {/* Smoothly animated sliding background pill representing lock state */}
            <div 
              className={`absolute top-1 bottom-1 rounded-xl transition-all duration-300 ease-out ${
                galleryLocked 
                  ? "left-[calc(50%+2px)] right-1 bg-red-500 shadow-lg shadow-red-900/30" 
                  : "left-1 right-[calc(50%+2px)] bg-emerald-500 shadow-lg shadow-emerald-900/20"
              }`}
            />
            
            <button
              onClick={() => handleToggleLock(false)}
              className={`relative z-10 flex-1 h-full flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                !galleryLocked ? "text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Unlocked</span>
            </button>
            <button
              onClick={() => handleToggleLock(true)}
              className={`relative z-10 flex-1 h-full flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                galleryLocked ? "text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Locked</span>
            </button>
          </div>
        </div>

        {toggleError && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{toggleError}</span>
          </div>
        )}
        {toggleSuccess && (
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-400 animate-pulse">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toggleSuccess}</span>
          </div>
        )}
      </div>

      {/* BLOCK 1: UNIVERSAL THEME CUSTOMIZER presets */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instant Universal Ambient Theme Presets</span>
            </h2>
            <p className="text-xs text-slate-400">
              Apply a beautiful visual overlay to all contents across the app in one single click.
            </p>
          </div>
          
          {/* Target choice settings */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setTargetThemeType("both")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                targetThemeType === "both" ? "bg-amber-500 text-black font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setTargetThemeType("scripture")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                targetThemeType === "scripture" ? "bg-amber-500 text-black font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              Books only
            </button>
            <button
              onClick={() => setTargetThemeType("character")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                targetThemeType === "character" ? "bg-amber-500 text-black font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              Figures only
            </button>
          </div>
        </div>

        {themeStatus && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center space-x-2 text-xs text-amber-300 animate-slide-up">
            <Check className="w-4 h-4" />
            <span>{themeStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleApplyThemePreset(theme.name, theme.url)}
              className="text-left bg-slate-900/60 border border-white/15 hover:border-amber-400/40 rounded-xl p-3 space-y-2 group transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                <img
                  src={theme.url}
                  alt={theme.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2">
                  <span className="text-xs font-bold text-white tracking-tight">{theme.name}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
                {theme.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* BLOCK 2: THE CORE RESOURCE EXPLORER & SETTING CARD VIEWER */}
      <div className="space-y-4">
        
        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-white/10 p-4 rounded-2xl">
          
          {/* Main selection tab toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveMode("scriptures");
                setSelectedReligion("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                activeMode === "scriptures"
                  ? "bg-amber-500 text-black font-semibold shadow-md shadow-amber-900/20"
                  : "bg-white/5 text-slate-300 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Holy Scripture Books ({SCRIPTURE_BOOKS.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveMode("characters");
                setSelectedReligion("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                activeMode === "characters"
                  ? "bg-amber-500 text-black font-semibold shadow-md shadow-amber-900/20"
                  : "bg-white/5 text-slate-300 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Sacred Figures & Legends ({SACRED_CHARACTERS.length})</span>
            </button>
            {currentUser?.email === "adarshshuklagarg@gmail.com" && (
              <button
                onClick={() => {
                  setActiveMode("audit_logs");
                  fetchAuditLogs();
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                  activeMode === "audit_logs"
                    ? "bg-amber-500 text-black font-semibold shadow-md shadow-amber-900/20"
                    : "bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Admin Audit Logs ({auditLogs.length})</span>
              </button>
            )}
            {currentUser?.email === "adarshshuklagarg@gmail.com" && (
              <button
                onClick={() => {
                  setActiveMode("database_migration");
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                  activeMode === "database_migration"
                    ? "bg-amber-500 text-black font-semibold shadow-md shadow-amber-900/20"
                    : "bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <Database className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Database Sync & Migration</span>
              </button>
            )}
          </div>

          {/* Filtering inputs */}
          {activeMode !== "database_migration" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              
              {/* Search Box */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder={activeMode === "audit_logs" ? "Search audit logs..." : `Search ${activeMode === "scriptures" ? "scriptures" : "figures"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 pl-9 pr-4 py-2 text-xs rounded-xl bg-black border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Filter Dropdown */}
              {activeMode === "audit_logs" ? (
                <select
                  value={selectedActionFilter}
                  onChange={(e) => setSelectedActionFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-amber-500 min-w-[130px]"
                >
                  <option value="all">Every Action</option>
                  <option value="TOGGLE_LOCK">Toggle Lock</option>
                  <option value="UPDATE_IMAGE">Update Image</option>
                  <option value="RESET_IMAGE">Reset Image</option>
                  <option value="APPLY_THEME">Apply Theme</option>
                </select>
              ) : (
                <select
                  value={selectedReligion}
                  onChange={(e) => setSelectedReligion(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-amber-500 min-w-[130px]"
                >
                  <option value="all">Every Religion</option>
                  {religionOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Items Counter */}
        {activeMode !== "database_migration" && (
          <p className="text-xs text-slate-400 px-1">
            {activeMode === "audit_logs"
              ? `Showing ${filteredAndSortedLogs.length} audit logs matching current filters.`
              : `Showing ${activeMode === "scriptures" ? filteredScriptures.length : filteredCharacters.length} entries matching current filters.`
            }
          </p>
        )}

        {/* CARDS GRID LIST OR AUDIT LOGS TABLE */}
        {activeMode === "database_migration" ? (
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in" id="database-migration-view">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-[10px] tracking-widest text-amber-400 font-extrabold uppercase font-mono bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Interfaith Scripture Academy Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight">
                Database Synchronization & Migration Portal
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                As the authenticated administrator (<span className="text-amber-400 font-semibold font-mono">{currentUser?.email}</span>), you can safely copy all bookmarks, reflection notes, public discussion comments, customized collections, system settings, and book images from any legacy database ID to the new <span className="text-amber-400 font-semibold font-mono">interfaith-108</span> database instance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-500" />
                  <span>Instance Mapping & Selector</span>
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                      Legacy Source Database ID:
                    </label>
                    <div className="flex flex-col gap-2">
                      <select
                        value={useCustomDbId ? "custom" : sourceDbId}
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setUseCustomDbId(true);
                          } else {
                            setUseCustomDbId(false);
                            setSourceDbId(e.target.value);
                          }
                        }}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                      >
                        <option value="ai-studio-b2e32fdd-3ee5-4e14-94e3-fcb48f44bdfa">
                          ai-studio-b2e32fdd-3ee5-4e14-94e3-fcb48f44bdfa (Legacy AI Studio)
                        </option>
                        <option value="(default)">
                          (default) (Default database ID)
                        </option>
                        <option value="custom">
                          -- Custom Database ID --
                        </option>
                      </select>

                      {useCustomDbId && (
                        <input
                          type="text"
                          value={customDbIdInput}
                          onChange={(e) => setCustomDbIdInput(e.target.value)}
                          placeholder="Type old database ID (e.g. (default) or custom-id)"
                          className="w-full bg-black/80 border border-amber-500/30 rounded-xl px-3 py-2 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500 placeholder-slate-600 transition-all"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px] text-slate-300 border-t border-white/5 pt-3">
                    <div className="flex justify-between p-2 rounded bg-amber-500/5 border border-amber-500/20">
                      <span className="text-amber-500 font-medium">Destination:</span>
                      <span className="text-green-400 font-bold">interfaith-108 (Active)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Secure Authorization</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
                    This tunnel uses your active client auth state. Since you are the verified admin of both projects, Firebase permits full collection read/writes in real-time.
                  </p>
                </div>
                <button
                  onClick={handleStartMigration}
                  disabled={migrationRunning}
                  className="w-full mt-4 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-950/40 font-sans"
                >
                  {migrationRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Synchronizing Databases...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>Start Database Sync & Migration</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {migrationLogs.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Real-time Tunnel Console Logs
                </h4>
                <div className="bg-black/80 border border-white/10 rounded-2xl p-4 h-64 overflow-y-auto font-mono text-[10px] text-green-400 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
                  {migrationLogs.map((log, index) => (
                    <div key={index} className="leading-relaxed whitespace-pre-wrap">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {migrationCompleted && (
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-start gap-3 animate-fade-in">
                <Check className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold font-sans">Migration & Sync Success</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    All document entities have been copied cleanly into <span className="text-green-400 font-semibold font-mono">interfaith-108</span> database. No existing files were overwritten unless they matched identical IDs. The system has automatically shifted all reads to the new database.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : activeMode === "audit_logs" ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl" id="dedicated-audit-logs-view">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Secure Ledger Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Click column headers to sort ascending or descending. Use filters above to pinpoint actions.
                </p>
              </div>
              <button
                onClick={fetchAuditLogs}
                disabled={loadingLogs}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer self-start sm:self-center"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${loadingLogs ? "animate-spin text-amber-400" : ""}`} />
                <span>{loadingLogs ? "Syncing Logs..." : "Refresh Ledger"}</span>
              </button>
            </div>

            {loadingLogs && filteredAndSortedLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-mono">Querying secure audit trail...</p>
              </div>
            ) : filteredAndSortedLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-mono">
                No matching audit logs found. Try clearing filters or perform some actions to populate the logs.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-mono tracking-wider uppercase text-[10px]">
                      <th 
                        onClick={() => handleSort("timestamp")} 
                        className="p-4 py-3 cursor-pointer select-none hover:bg-slate-900/40 transition-colors"
                      >
                        <div className="flex items-center space-x-1.5">
                          <span>Timestamp</span>
                          {renderSortIcon("timestamp")}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort("action")} 
                        className="p-4 py-3 cursor-pointer select-none hover:bg-slate-900/40 transition-colors"
                      >
                        <div className="flex items-center space-x-1.5">
                          <span>Action</span>
                          {renderSortIcon("action")}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort("details")} 
                        className="p-4 py-3 cursor-pointer select-none hover:bg-slate-900/40 transition-colors"
                      >
                        <div className="flex items-center space-x-1.5">
                          <span>Details</span>
                          {renderSortIcon("details")}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort("userEmail")} 
                        className="p-4 py-3 cursor-pointer select-none hover:bg-slate-900/40 transition-colors"
                      >
                        <div className="flex items-center space-x-1.5">
                          <span>Admin Email</span>
                          {renderSortIcon("userEmail")}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredAndSortedLogs.map((log) => {
                      let actionBadgeColor = "bg-slate-500/10 text-slate-400 border-slate-500/20";
                      if (log.action === "TOGGLE_LOCK") {
                        actionBadgeColor = log.details.includes("LOCKED") 
                          ? "bg-red-500/10 text-red-400 border-red-500/25" 
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
                      } else if (log.action === "UPDATE_IMAGE") {
                        actionBadgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/25";
                      } else if (log.action === "RESET_IMAGE") {
                        actionBadgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/25";
                      } else if (log.action === "APPLY_THEME") {
                        actionBadgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/25";
                      }

                      return (
                        <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4 py-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                            {formatTimestamp(log.timestamp)}
                          </td>
                          <td className="p-4 py-3 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase border ${actionBadgeColor}`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="p-4 py-3 text-slate-200 leading-relaxed max-w-md">
                            {log.details}
                          </td>
                          <td className="p-4 py-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                            {log.userEmail || "system"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMode === "scriptures" ? (
              filteredScriptures.map((book) => {
                const currentOverriddenUrl = customImages[book.key];
                const displayUrl = currentOverriddenUrl || book.imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200";
                const tempUrlValue = inputUrls[book.key] || "";
                const status = saveStatus[book.key];

                return (
                  <div
                    key={book.key}
                    className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 transition-all hover:bg-slate-900/80 hover:border-amber-400/20 shadow-md"
                  >
                    {/* Left Column: Cover Preview Block */}
                    <div className="w-full sm:w-28 h-40 rounded-xl overflow-hidden relative border border-white/5 shrink-0 bg-black flex flex-col justify-between">
                      <img
                        src={tempUrlValue.trim() !== "" ? tempUrlValue : displayUrl}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Fallback source on error
                          e.currentTarget.src = "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=200";
                        }}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-300 scale-100 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      
                      {/* Badge showing if overridden */}
                      {currentOverriddenUrl ? (
                        <span className="absolute top-2 left-2 bg-amber-500 text-black py-0.5 px-2 rounded-md text-[9px] font-bold font-mono shadow-md flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          <span>Customized</span>
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 bg-white/10 backdrop-blur-md text-slate-300 py-0.5 px-2 rounded-md text-[9px] font-mono">
                          Original Cover
                        </span>
                      )}

                      {/* Compact descriptive footer inside image cover */}
                      <div className="absolute bottom-2 left-2 right-2 z-10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                          {book.religion}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Inputs & Customizer Forms */}
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white leading-snug">{book.title}</h3>
                        <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                          {book.imageCaption || "A beautifully curated theological scripture guide cover illustration."}
                        </p>
                      </div>

                      {/* Action form */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            placeholder="Paste absolute HTTPS image URL..."
                            value={tempUrlValue}
                            onChange={(e) => handleInputChange(book.key, e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-black border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                          />
                          {currentOverriddenUrl && (
                            <button
                              title="Revert to original default image"
                              onClick={() => handleResetSingle(book.key)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/20 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Religion-related Quick Suggestions Selector */}
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                            Quick-Pick Aesthetic Presets
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {ALTERNATIVE_BACKGROUNDS.slice(0, 4).map((bg, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleInputChange(book.key, bg.url)}
                                className="text-[10px] bg-white/5 hover:bg-white/10 active:bg-amber-500/20 border border-white/5 px-2 py-0.5 rounded-lg text-slate-300 hover:text-white cursor-pointer transition-colors"
                                title={bg.desc}
                              >
                                {bg.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Save Status Output */}
                        {status && (
                          <p className={`text-[10px] font-mono leading-none ${
                            status.type === "success" ? "text-amber-400" : "text-red-400"
                          }`}>
                            {status.msg}
                          </p>
                        )}

                        {/* Main Apply Button */}
                        <button
                          onClick={() => handleApplySingle(book.key, "scripture")}
                          className="w-full bg-slate-800 hover:bg-amber-500 hover:text-black transition-all border border-white/10 hover:border-transparent py-1.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Image Override</span>
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              filteredCharacters.map((char) => {
                const currentOverriddenUrl = customImages[char.key];
                const displayUrl = currentOverriddenUrl || char.imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200";
                const tempUrlValue = inputUrls[char.key] || "";
                const status = saveStatus[char.key];

                return (
                  <div
                    key={char.key}
                    className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 transition-all hover:bg-slate-900/80 hover:border-amber-400/20 shadow-md"
                  >
                    {/* Left Column: Cover Preview Block */}
                    <div className="w-full sm:w-28 h-40 rounded-xl overflow-hidden relative border border-white/5 shrink-0 bg-black flex flex-col justify-between">
                      <img
                        src={tempUrlValue.trim() !== "" ? tempUrlValue : displayUrl}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=200";
                        }}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-300 scale-100 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      
                      {/* Badge showing if overridden */}
                      {currentOverriddenUrl ? (
                        <span className="absolute top-2 left-2 bg-amber-500 text-black py-0.5 px-2 rounded-md text-[9px] font-bold font-mono shadow-md flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          <span>Customized</span>
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 bg-white/10 backdrop-blur-md text-slate-300 py-0.5 px-2 rounded-md text-[9px] font-mono">
                          Original Cover
                        </span>
                      )}

                      {/* Compact descriptive footer inside image cover */}
                      <div className="absolute bottom-2 left-2 right-2 z-10 space-y-0.5">
                        <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-medium leading-none">
                          {char.role}
                        </span>
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono leading-none">
                          {char.religion}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Inputs & Customizer Forms */}
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white leading-snug">{char.name}</h3>
                        <p className="text-[11px] text-slate-400 leading-normal line-clamp-2 font-mono">
                          {char.summary}
                        </p>
                      </div>

                      {/* Action form */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            placeholder="Paste absolute HTTPS image URL..."
                            value={tempUrlValue}
                            onChange={(e) => handleInputChange(char.key, e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-black border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                          />
                          {currentOverriddenUrl && (
                            <button
                              title="Revert to original default image"
                              onClick={() => handleResetSingle(char.key)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/20 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Religion-related Quick Suggestions Selector */}
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                            Quick-Pick Aesthetic Presets
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {ALTERNATIVE_BACKGROUNDS.slice(4, 8).map((bg, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleInputChange(char.key, bg.url)}
                                className="text-[10px] bg-white/5 hover:bg-white/10 active:bg-amber-500/20 border border-white/5 px-2 py-0.5 rounded-lg text-slate-300 hover:text-white cursor-pointer transition-colors"
                                title={bg.desc}
                              >
                                {bg.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Save Status Output */}
                        {status && (
                          <p className={`text-[10px] font-mono leading-none ${
                            status.type === "success" ? "text-amber-400" : "text-red-400"
                          }`}>
                            {status.msg}
                          </p>
                        )}

                        {/* Main Apply Button */}
                        <button
                          onClick={() => handleApplySingle(char.key, "character")}
                          className="w-full bg-slate-800 hover:bg-amber-500 hover:text-black transition-all border border-white/10 hover:border-transparent py-1.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Image Override</span>
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* EMPTY STATE WARNING */}
        {((activeMode === "scriptures" && filteredScriptures.length === 0) ||
          (activeMode === "characters" && filteredCharacters.length === 0) ||
          (activeMode === "audit_logs" && filteredAndSortedLogs.length === 0)) && (
          <div className="text-center bg-slate-900 border border-white/5 rounded-3xl py-12 p-6 space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Results Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {activeMode === "audit_logs"
                ? `We couldn't find any audit logs matching search query "${searchQuery}" or selected action filter.`
                : `We couldn't find any theological guides or legends matching search query "${searchQuery}". Try typing in another keyword.`
              }
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
