import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Info, 
  Sparkles, 
  Filter, 
  Check, 
  Download, 
  AlertCircle,
  Clock,
  Heart,
  ExternalLink,
  BookOpen,
  Bell
} from "lucide-react";
import { 
  SACRED_FESTIVALS_DATA, 
  FESTIVAL_DATES_2026, 
  FestivalItem, 
  calculateMoonPhaseDetails 
} from "../festivalsData";
import { getGoogleCalendarUrl, getGoogleCalendarUrlForFest } from "../festivalsData";
import { RELIGION_LABELS, RELIGION_COLORS } from "../scripturesRegistry";
import { ReligionType } from "../types";

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

export interface DynamicVratType {
  id: string;
  name: string;
  transliteration: string;
  religion: "hinduism" | "buddhism" | "jainism" | "islam" | "judaism" | "christianity";
  type: string;
  description: string;
  keyTargetTithis: number[];
  timingRule: string;
  criteria: string;
  allowedFoods: string[];
  strictlyProhibited: string[];
  spiritualBenefit: string;
}

const DYNAMIC_VRATS_CATALOG: DynamicVratType[] = [
  {
    id: "ekadashi-vrat",
    name: "Ekadashi Vrat (Bi-weekly Lunar Fasts)",
    transliteration: "एकादशी व्रत",
    religion: "hinduism",
    type: "fasting",
    description: "One of the most sacred Hindu fasting rituals, observed on the 11th lunar day (Tithi) of both the bright (Shukla) and dark (Krishna) fortnights. In June 2026, Jyeshtha Krishna Ekadashi lies on June 11th, and Ashadha Shukla Ekadashi lies on June 26th.",
    keyTargetTithis: [11, 26],
    timingRule: "11th day of both Bright (Shukla) and Dark (Krishna) Lunar Fortnights.",
    criteria: "Drik Panchang aligns Ekadashi based on the Tithi prevailing at Arunodaya (pre-sunrise twilight). If Dashami overlaps high, it is observed on Dwadashi.",
    allowedFoods: ["Fruits", "Milk products", "Water", "Buckwheat (Kuttu)", "Waterchestnut flour (Singhara)", "Potatoes", "Sago (Sabudana)", "Nuts"],
    strictlyProhibited: ["All grains (Rice, Wheat, Barley)", "Lentils", "Beans", "Mustard seeds", "Non-satvik foods"],
    spiritualBenefit: "Counteracts high fluid gravitational pressure on tissues, aligning bodily humors (Vata, Pitta, Kapha) and sharpening spiritual intuition."
  },
  {
    id: "pradosh-vrat",
    name: "Pradosh Vrat (Twilight Cleansing Fast)",
    transliteration: "प्रदोष व्रत",
    religion: "hinduism",
    type: "fasting",
    description: "An auspicious fortnightly fast dedicated to Lord Shiva, kept on the 13th lunar day (Trayodashi) of both dark and bright halves. In June 2026, Pradosh Vrat falls on June 13th and June 28th.",
    keyTargetTithis: [13, 28],
    timingRule: "13th lunar day (Trayodashi) coinciding with Twilight (Pradosha Kaal).",
    criteria: "Sunset Vyapini: Observed on the calendar day when the 13th Tithi prevails during the Pradosha Kaal (approximately 45 minutes before to 90 minutes after standard astronomical sunset).",
    allowedFoods: ["Fresh fruits", "Water", "Milk", "Coconut water", "Light single-pot satvik recipe enjoyed after twilight rituals"],
    strictlyProhibited: ["All grains during daytime", "Salt of any kind during fast period", "Heavy spices", "Indulgence"],
    spiritualBenefit: "Pradosha hour coincides with highly sensitive bio-rhythms. Absolute solar fast removes deep karmic blockages and quietens nervous agitation."
  },
  {
    id: "masik-shivratri",
    name: "Masik Shivratri (Monthly Night Vigil)",
    transliteration: "मासिक शिवरात्रि",
    religion: "hinduism",
    type: "vigil",
    description: "A major monthly fasting day dedicated to Lord Shiva, observed on Chaturdashi (14th day) of the Krishna Paksha (dark fortnight). This dark vigil dissolves standard mental noise before the new moon void.",
    keyTargetTithis: [29],
    timingRule: "14th day of Dark Lunar Fortnight (Krishna Chaturdashi) at Midnight.",
    criteria: "Nishita Kaal Vyapini: Calculated based on the 14th Tithi of the dark half prevailing during midnight hours when cosmic Shiva energy is at peak absorption.",
    allowedFoods: ["Dry fruits", "Milk", "Fruits", "Water"],
    strictlyProhibited: ["All grains", "Lentils", "Sleeping during nighttime hours (a continuous vigil/Jagran is kept)"],
    spiritualBenefit: "Assists in the absolute dissolution of the sensory ego-mind, converting core vitality into pure ojas."
  },
  {
    id: "sankashti-chaturthi",
    name: "Sankashti Ganesha Chaturthi Vrat",
    transliteration: "सङ्कष्टी चतुर्थी",
    religion: "hinduism",
    type: "fasting",
    description: "A holy fasting day dedicated to Lord Ganesha, observed on the 4th day of the dark half (Krishna Chaturthi) of every month. Devotees break their fast only after seeing the physical moon rise in the night sky.",
    keyTargetTithis: [19],
    timingRule: "4th Tithi of Krishna Paksha (Waning Crescent phase).",
    criteria: "Moonrise Vyapini: Observed on the day when the Krishna Chaturthi Tithi is active during local moonrise coordinates.",
    allowedFoods: ["Roots & Tubers (Sweet potato, potato)", "Peanuts", "Bananas", "Sabudana dishes", "Sago"],
    strictlyProhibited: ["Regular wheat & rice flour", "Salt during daytime", "Non-vegetarian inputs"],
    spiritualBenefit: "Cultivates extreme physical patience and single-pointed concentration; aids in overcoming persistent life obstacles."
  },
  {
    id: "vinayaka-chaturthi",
    name: "Vinayaka Ganesha Chaturthi Vrat",
    transliteration: "विनायक चतुर्थी",
    religion: "hinduism",
    type: "fasting",
    description: "A monthly fasting day for Ganesha during the bright fortnight (Shukla Chaturthi). Worship is carried out at mid-day (Madhyahna).",
    keyTargetTithis: [4],
    timingRule: "4th Tithi of Shukla Paksha (Waxing Crescent phase).",
    criteria: "Madhyahna Vyapini: Calculated relative to the 4th Shukla Tithi coinciding with solar mid-day (Madhyahna Kaal).",
    allowedFoods: ["Satvik fruits", "Milk treats", "Nuts", "Fasting flour bread"],
    strictlyProhibited: ["All grains", "Lentils", "Heavy spices"],
    spiritualBenefit: "Invokes high cognitive intelligence, sharp memory, and clear perception."
  },
  {
    id: "satyanarayan-purnima",
    name: "Satyanarayan Vrat & Purnima Puja",
    transliteration: "पूर्णिमा व्रत",
    religion: "hinduism",
    type: "celebration",
    description: "A highly popular monthly vows-keeping and worship day kept on every Full Moon day (Purnima). Families recite the Satyanarayan story and hold a full day fast to invoke peace and truth.",
    keyTargetTithis: [15],
    timingRule: "Purnima Tithi (15th Lunar Day of Full Moon brightness).",
    criteria: "Evening Vyapini: Calculated based on Purnima Tithi prevailing at sunset time for ritual evening story recitals and full moon viewing.",
    allowedFoods: ["Panchamrit (milk, yogurt, honey, ghee, sugar)", "Phalahar sweet pudding", "Fresh fruits"],
    strictlyProhibited: ["Standard salt (only rock salt/Saindhava Namak allowed)", "Unholy thoughts", "Dishonesty during the vow periods"],
    spiritualBenefit: "Full moon gravitation causes heightened metabolic and neural actions. Absolute satvik fast prevents emotional extremes, preserving tranquility."
  },
  {
    id: "amavasya-tarpanam",
    name: "Amavasya Ancestor Vow & Fasting",
    transliteration: "अमावस्या",
    religion: "hinduism",
    type: "remembrance",
    description: "The New Moon day when the moon is completely dark. Regarded as highly sacred for honoring and offering peace prayers (Tarpanam) to linear ancestors.",
    keyTargetTithis: [30],
    timingRule: "30th Lunar Day of absolute dark void.",
    criteria: "Aparahna Vyapini: Calculated based on Amavasya Tithi active during solar afternoon (Aparahna Kaal) for performing tarpanam rituals.",
    allowedFoods: ["Strict water fast during morning hours", "Single satvik grain-free meal accepted after performing ancestral offerings at noon"],
    strictlyProhibited: ["Auspicious commercial inaugurations", "Travel or loud festive celebrations", "Sensory indulgence"],
    spiritualBenefit: "Settles genealogical debts, heals mental anxiety associated with genetic inheritance, and grounds deep somatic frequencies."
  }
];

export function MonthlyCalendarView({ onGoToReadDesk }: { onGoToReadDesk?: () => void }) {
  const [currentMonth, setCurrentMonth] = useState<number>(5); // Default to June (0-indexed 5)
  const [selectedDay, setSelectedDay] = useState<number>(8); // Highlight June 8, 2026 initially
  const [filterReligion, setFilterReligion] = useState<ReligionType | "all">("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Sync family of myReminders across tabs via storage events
  const [myReminders, setMyReminders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("my_sacred_fast_reminders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("my_sacred_fast_reminders");
        if (saved) {
          setMyReminders(JSON.parse(saved));
        }
      } catch (e) {
        console.warn("Storage sync failed in MonthlyCalendarView", e);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleToggleReminder = (id: string) => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        if (Notification.permission === "default") {
          Notification.requestPermission().catch(console.warn);
        }
      } catch (e) {
        console.warn("Notification permission check blocked by iframe sandboxing policy:", e);
      }
    }

    setMyReminders((prev) => {
      const isAlready = prev.includes(id);
      const updated = isAlready ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("my_sacred_fast_reminders", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      return updated;
    });
  };

  const year = 2026;
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Total days in selected month of 2026
  const totalDays = new Date(year, currentMonth + 1, 0).getDate();
  // Day of week of the 1st of selected month (0: Sun, 1: Mon, etc.)
  const firstDayIndex = new Date(year, currentMonth, 1).getDay();

  // Handle month selection bounds
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setSelectedDay(1); // Reset selected day to 1st of month
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setSelectedDay(1); // Reset selected day to 1st of month
  };

  // Color mapper helper for dots
  const getDotColorClass = (religion: string) => {
    switch (religion) {
      case "hinduism": return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]";
      case "islam": return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
      case "christianity": return "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]";
      case "judaism": return "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]";
      case "buddhism": return "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]";
      case "jainism": return "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]";
      default: return "bg-slate-400";
    }
  };

  // Border hover class
  const getBorderColorHover = (religion: string) => {
    switch (religion) {
      case "hinduism": return "hover:border-amber-400/55";
      case "islam": return "hover:border-emerald-400/55";
      case "christianity": return "hover:border-indigo-400/55";
      case "judaism": return "hover:border-blue-400/55";
      case "buddhism": return "hover:border-rose-400/55";
      case "jainism": return "hover:border-orange-400/55";
      default: return "hover:border-white/20";
    }
  };

  // Get events on a specific day of the currentMonth, 2026
  const getEventsForDay = (day: number) => {
    const dateObj = new Date(year, currentMonth, day, 12, 0, 0);
    const dateStr = `${year}${String(currentMonth + 1).padStart(2, "0")}${String(day).padStart(2, "0")}`;
    const dayEvents: any[] = [];

    // 1. Static festivals from canonical list
    SACRED_FESTIVALS_DATA.forEach((fest) => {
      const dates = FESTIVAL_DATES_2026[fest.id];
      if (dates) {
        if (dateStr >= dates.start && dateStr <= dates.end) {
          dayEvents.push({
            id: `static-${fest.id}-${day}`,
            idPrefix: fest.id,
            name: fest.name,
            transliteration: fest.transliteration,
            religion: fest.religion,
            type: fest.type,
            item: fest,
            isDynamic: false,
            timing: fest.timing,
            description: fest.description,
            fastingRules: fest.fastingRules,
            source: fest.sourcesAndGuides?.primaryGuide || "Observational Traditional Canon"
          });
        }
      }
    });

    // 2. Dynamic Drik Panchang lunar vrats
    const tithiDetails = calculateMoonPhaseDetails(dateObj);
    DYNAMIC_VRATS_CATALOG.forEach((vrat) => {
      if (vrat.keyTargetTithis.includes(tithiDetails.tithiIndex)) {
        dayEvents.push({
          id: `dynamic-${vrat.id}-${day}`,
          idPrefix: vrat.id,
          name: vrat.name,
          transliteration: vrat.transliteration,
          religion: vrat.religion,
          type: vrat.type,
          vrat: vrat,
          isDynamic: true,
          timing: vrat.timingRule,
          description: vrat.description,
          fastingRules: {
            intensity: vrat.type === "fasting" ? "moderate" : "none",
            allowedFoods: vrat.allowedFoods,
            strictlyProhibited: vrat.strictlyProhibited,
            spiritualIntakeExplanation: vrat.spiritualBenefit,
          },
          source: "Drik Panchang Dynamic Calculation"
        });
      }
    });

    // Filter events according to user filters
    return dayEvents.filter(ev => {
      const matchRel = filterReligion === "all" || ev.religion === filterReligion;
      const matchType = filterType === "all" || ev.type === filterType;
      return matchRel && matchType;
    });
  };

  // Get unique religions with events on a specific day
  const getReligionDotsForDay = (day: number) => {
    const events = getEventsForDay(day);
    const uniqueReligions = Array.from(new Set(events.map(e => e.religion)));
    return uniqueReligions;
  };

  // Current calculated moon phase details for selected point
  const selectedDateObj = new Date(year, currentMonth, selectedDay, 12, 0, 0);
  const selectedMoonDetails = calculateMoonPhaseDetails(selectedDateObj);
  const selectedDayEvents = getEventsForDay(selectedDay);

  // Download ICS files
  const triggerDynamicICSDownload = (vratName: string, dateStr: string, description: string) => {
    const parts = dateStr.match(/([A-Za-z]+)\s+(\d+)/);
    if (!parts) return;
    const mName = parts[1];
    const dName = parts[2];
    
    const monthsMap: Record<string, string> = {
      "January": "01", "February": "02", "March": "03", "April": "04", "May": "05", "June": "06",
      "July": "07", "August": "08", "September": "09", "October": "10", "November": "11", "December": "12"
    };
    const mVal = monthsMap[mName] || "01";
    const dVal = dName.padStart(2, "0");
    
    const formattedStart = `2026${mVal}${dVal}`;
    const endD = new Date(2026, parseInt(mVal) - 1, parseInt(dVal) + 1);
    const formattedEnd = `${endD.getFullYear()}${String(endD.getMonth() + 1).padStart(2, "0")}${String(endD.getDate()).padStart(2, "0")}`;

    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Scripture & Fasting Compute//NONSGML Liturgical Calendar v1.0//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:uid_dynamic_${vratName.replace(/\s+/g, "_")}_${formattedStart}@scripturefasttracker.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;VALUE=DATE:${formattedStart}`,
      `DTEND;VALUE=DATE:${formattedEnd}`,
      `SUMMARY:${vratName}`,
      `DESCRIPTION:${description.replace(/[\r\n]+/g, " ").replace(/[,;]/g, "\\$&")}`,
      `LOCATION:Temples\\, Sacred Altars\\, & Contemplation Spaces`,
      "END:VEVENT",
      "END:VCALENDAR"
    ];

    const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${vratName.replace(/\s+/g, "_")}_2026_${mVal}_${dVal}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerStaticICSDownload = (fest: FestivalItem) => {
    const dates = FESTIVAL_DATES_2026[fest.id];
    if (!dates) return;
    
    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Scripture & Fasting Compute//NONSGML Liturgical Calendar v1.0//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:uid_${fest.id}_2026@scripturefasttracker.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;VALUE=DATE:${dates.start}`,
      `DTEND;VALUE=DATE:${dates.end}`,
      `SUMMARY:${fest.name}`,
      `DESCRIPTION:${fest.description.replace(/[\r\n]+/g, " ").replace(/[,;]/g, "\\$&")}`,
      `LOCATION:Temples\\, Sacred Altars\\, & Contemplation Spaces`,
      "END:VEVENT",
      "END:VCALENDAR"
    ];

    const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fest.id}_calendar_2026.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getDynamicGoogleCalUrl = (vratName: string, dateStr: string, description: string, timing?: string) => {
    const parts = dateStr.match(/([A-Za-z]+)\s+(\d+)/);
    if (!parts) return "#";
    const mName = parts[1];
    const dName = parts[2];
    
    const monthsMap: Record<string, string> = {
      "January": "01", "February": "02", "March": "03", "April": "04", "May": "05", "June": "06",
      "July": "07", "August": "08", "September": "09", "October": "10", "November": "11", "December": "12"
    };
    const mVal = monthsMap[mName] || "01";
    const dVal = dName.padStart(2, "0");
    
    const formattedStart = `2026${mVal}${dVal}`;
    const endD = new Date(2026, parseInt(mVal) - 1, parseInt(dVal) + 1);
    const formattedEnd = `${endD.getFullYear()}${String(endD.getMonth() + 1).padStart(2, "0")}${String(endD.getDate()).padStart(2, "0")}`;
    
    return getGoogleCalendarUrl(vratName, formattedStart, formattedEnd, description, timing);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200" id="interfaith-monthly-calendar">
      
      {/* Calendar Header with Controls */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-semibold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>Lunisolar Interfaith Monthly Calendar</span>
            </h3>
            <p className="text-xs text-slate-400">
              Synchronized 2026 visual index rendering sacred holy fasts, solar-lunar high vigils, and ancient spiritual festivals. Click any date to load dynamic Panchang coordinates and detailed dietary rules.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 bg-black/30 border border-white/5 rounded-xl p-1 text-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold px-2">Religion:</span>
              <button 
                onClick={() => setFilterReligion("all")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${filterReligion === "all" ? "bg-amber-500 text-black font-semibold" : "text-slate-400 hover:text-white"}`}
              >
                All
              </button>
              {["hinduism", "islam", "christianity", "judaism", "buddhism", "jainism"].map((rel) => (
                <button
                  key={rel}
                  onClick={() => setFilterReligion(rel as ReligionType)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center space-x-1 ${filterReligion === rel ? "bg-white/10 text-white border border-white/10 font-medium" : "text-slate-400 hover:text-white"}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${getDotColorClass(rel)}`} />
                  <span className="capitalize">{rel.substring(0, 3)}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1 bg-black/30 border border-white/5 rounded-xl p-1 text-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold px-2">Type:</span>
              <button 
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${filterType === "all" ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/20" : "text-slate-400 hover:text-white"}`}
              >
                All
              </button>
              {["fasting", "vigil", "celebration", "remembrance"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all capitalize ${filterType === t ? "bg-[#1f1b2e] text-violet-300 border border-violet-500/20" : "text-slate-400 hover:text-white"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid (Left: Calendar, Right: Details Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: The Interactive calendar Board (col-span-7) */}
        <div className="lg:col-span-7 bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
          
          <div className="space-y-4">
            
            {/* Calendar Month Selector Topbar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 transition-all cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="p-1 px-2 text-[10px] bg-amber-500/10 text-amber-400 font-mono tracking-widest rounded border border-amber-500/20 uppercase font-bold">
                  2026 Liturgy Grid
                </span>
                <span className="text-lg font-serif font-semibold text-white tracking-wide">
                  {MONTHS[currentMonth]} {year}
                </span>
              </div>

              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 transition-all cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekdays row */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-mono font-bold uppercase tracking-wider text-slate-500 py-1">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-xs">
              
              {/* Empty spacers for alignment */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div 
                  key={`empty-${idx}`} 
                  className="aspect-square bg-transparent border border-transparent"
                />
              ))}

              {/* Day cells */}
              {Array.from({ length: totalDays }).map((_, idx) => {
                const dayNum = idx + 1;
                const events = getEventsForDay(dayNum);
                const isSelected = selectedDay === dayNum;
                const isToday = currentMonth === 5 && dayNum === 8; // Highlight current metadata date June 8, 2026
                const dots = getReligionDotsForDay(dayNum);

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`aspect-square sm:p-2 p-1.5 rounded-xl border transition-all relative flex flex-col justify-between items-center group cursor-pointer ${
                      isSelected
                        ? "bg-amber-450/15 border-amber-400/90 shadow-[0_0_12px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/25"
                        : isToday
                        ? "bg-indigo-950/40 border-indigo-500/60 shadow-[0_0_8px_rgba(99,102,241,0.1)] hover:border-indigo-400"
                        : events.length > 0
                        ? "bg-[#11121a]/95 border-white/5 hover:bg-[#151724]"
                        : "bg-[#08090d] border-transparent hover:border-white/10 hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Day number */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-mono text-xs sm:text-sm font-semibold transition-colors ${
                        isSelected 
                          ? "text-amber-300 font-extrabold" 
                          : isToday 
                          ? "text-indigo-400 font-bold underline decoration-solid decoration-2" 
                          : events.length > 0
                          ? "text-white"
                          : "text-slate-500 group-hover:text-slate-350"
                      }`}>
                        {dayNum}
                      </span>

                      {/* Display counting integer badge if more than 3 events */}
                      {events.length > 0 && (
                        <span className="text-[8px] font-mono text-slate-500 font-bold hidden sm:inline opacity-70">
                          {events.length}
                        </span>
                      )}
                    </div>

                    {/* Color-coded dots for religions */}
                    <div className="flex flex-wrap justify-center gap-1 w-full min-h-[6px] mt-1 relative z-10">
                      {dots.slice(0, 4).map((rel) => (
                        <span 
                          key={rel} 
                          className={`w-1.5 h-1.5 rounded-full ${getDotColorClass(rel)}`}
                          title={RELIGION_LABELS[rel] || rel}
                        />
                      ))}
                      {dots.length > 4 && (
                        <span className="text-[7px] font-mono text-slate-500 font-bold leading-none">
                          +
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

            </div>

          </div>

          {/* Quick Stats Footer inside Left Panel */}
          <div className="pt-6 mt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Current date indicator context: <strong>June 8, 2026</strong></span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Hindu</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Islam</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Christian</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Jewish</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Details Panel for selected Day (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden flex-1 flex flex-col">
            
            {/* Panel Title */}
            <div className="border-b border-white/5 pb-4 space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 font-bold">
                  Day Focus Panel
                </span>
                <span className="text-[10px] font-mono text-indigo-400">
                  {WEEKDAYS[selectedDateObj.getDay()]}, {MONTHS[currentMonth]} {selectedDay}, {year}
                </span>
              </div>
              <h4 className="text-md sm:text-base font-serif font-semibold text-white flex items-center space-x-2">
                <span>Astronomical Lunisolar Coordinates</span>
              </h4>
            </div>

            {/* Astronomical / Ephemerides Card */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Lunisolar Tithi Phase</span>
                <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Day {selectedMoonDetails.tithiIndex}/30
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Vedic Tithi:</span>
                  <span className="text-slate-300 text-xs font-mono font-medium">{selectedMoonDetails.tithiName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Lunar Half:</span>
                  <span className="text-slate-300 text-xs font-mono font-medium">{selectedMoonDetails.paksha}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Synodic Age:</span>
                  <span className="text-slate-300 text-xs font-mono font-medium">{selectedMoonDetails.age.toFixed(2)} days</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Illumination:</span>
                  <span className="text-slate-300 text-xs font-mono font-medium">{selectedMoonDetails.litPercent}% ({selectedMoonDetails.name})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.04] grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Islamic Moon Sighting:</span>
                  <span className="text-slate-400 text-xs font-mono">{selectedMoonDetails.HijriSighting} ({selectedMoonDetails.hijriAge}d)</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Hebrew Moon Sighting:</span>
                  <span className="text-slate-400 text-xs font-mono">Metonic day {selectedMoonDetails.hebrewAge}</span>
                </div>
              </div>
            </div>

            {/* List of Occasions */}
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-1 scrollbar-thin">
              <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                Occasions Grid ({selectedDayEvents.length})
              </h5>

              {selectedDayEvents.length === 0 ? (
                <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-xl space-y-2 mt-2">
                  <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400 font-serif">
                    No active fasting rituals or major celebrations mapped to this date matching your filters.
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Try clearing or toggling filters to see all available entries.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map((ev) => {
                    const isFasting = ev.type === "fasting";
                    const isVigil = ev.type === "vigil";
                    const allowedFoods = ev.fastingRules?.allowedFoods || [];
                    const prohibitedFoods = ev.fastingRules?.strictlyProhibited || [];
                    const spiritualIntakeExplanation = ev.fastingRules?.spiritualIntakeExplanation || "";

                    return (
                      <div 
                        key={ev.id}
                        className="p-4 rounded-xl bg-black/50 border border-white/5 hover:border-white/10 transition-colors space-y-3 relative group"
                      >
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/10 to-transparent opacity-50" />
                        
                        {/* Title and badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <h6 className="text-sm font-sans font-semibold text-white group-hover:text-amber-300 transition-colors">
                              {ev.name}
                            </h6>
                            {ev.transliteration && (
                              <p className="text-[10px] font-mono text-slate-500">{ev.transliteration}</p>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-300 font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                              {RELIGION_LABELS[ev.religion]}
                            </span>
                            {isFasting && (
                              <span className="text-[8px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Fast
                              </span>
                            )}
                            {isVigil && (
                              <span className="text-[8px] uppercase font-mono px-1.5 py-0.2 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                Vigil
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-300 leading-relaxed font-serif">
                          {ev.description}
                        </p>

                        {/* Quick fields */}
                        <div className="text-[10px] font-mono text-slate-400 grid grid-cols-2 gap-2 p-2 bg-[#0c0d12]/60 rounded-lg">
                          <div>
                            <span className="text-slate-500 block">⏰ Timing:</span>
                            <span className="text-amber-400 truncate block font-medium" title={ev.timing}>
                              {ev.timing}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">⚙️ Source:</span>
                            <span className="text-slate-300 truncate block" title={ev.source}>
                              {ev.source}
                            </span>
                          </div>
                        </div>

                        {/* Fasting Details (Allowed/Prohibited/Somatic justification) */}
                        {ev.fastingRules && (
                          <div className="space-y-2 border-t border-white/5 pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                              {/* Allowed list */}
                              <div className="p-2 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-lg space-y-1">
                                <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-400 font-extrabold block">Allowed / Recommended:</span>
                                {allowedFoods.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {allowedFoods.slice(0, 4).map((f: string) => (
                                      <span key={f} className="text-[8px] font-mono text-emerald-300 bg-emerald-500/5 px-1.5 py-0.2 rounded">
                                        {f}
                                      </span>
                                    ))}
                                    {allowedFoods.length > 4 && <span className="text-[8px] font-mono text-slate-500">+{allowedFoods.length - 4} more</span>}
                                  </div>
                                ) : (
                                  <span className="text-[9px] text-slate-500 italic block">Strict Dry Nirjala Fasting</span>
                                )}
                              </div>

                              {/* Prohibited list */}
                              <div className="p-2 bg-red-500/[0.02] border border-red-500/10 rounded-lg space-y-1">
                                <span className="text-[8px] font-mono uppercase tracking-widest text-red-400 font-extrabold block">Strictly Prohibited:</span>
                                {prohibitedFoods.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {prohibitedFoods.slice(0, 4).map((f: string) => (
                                      <span key={f} className="text-[8px] font-mono text-red-300 bg-red-500/5 px-1.5 py-0.2 rounded line-through">
                                        {f}
                                      </span>
                                    ))}
                                    {prohibitedFoods.length > 4 && <span className="text-[8px] font-mono text-slate-500">+{prohibitedFoods.length - 4} more</span>}
                                  </div>
                                ) : (
                                  <span className="text-[9px] text-slate-500 italic block">None specifically barred</span>
                                )}
                              </div>
                            </div>

                            {/* Rationale quotes */}
                            {spiritualIntakeExplanation && (
                              <div className="p-2.5 rounded bg-black/25 border-l border-amber-500/30 text-[10px] text-slate-450 leading-relaxed italic">
                                "{spiritualIntakeExplanation}"
                              </div>
                            )}

                          </div>
                        )}

                        {/* Export to ICS and Google Calendar buttons */}
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                          {(ev.type === "fasting" || !!ev.fastingRules) && (
                            <button
                              onClick={() => handleToggleReminder(ev.idPrefix)}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-all border cursor-pointer flex items-center space-x-1 ${
                                myReminders.includes(ev.idPrefix)
                                  ? "bg-amber-500 text-black border-amber-500 font-bold"
                                  : "bg-white/[0.02] hover:bg-amber-500/5 text-slate-400 hover:text-amber-400 border border-white/5 hover:border-amber-500/20"
                              }`}
                              title={myReminders.includes(ev.idPrefix) ? "Remove from My Reminders" : "Add to My Reminders"}
                            >
                              <Bell className={`w-3 h-3 ${myReminders.includes(ev.idPrefix) ? "animate-pulse text-black" : ""}`} />
                              <span>{myReminders.includes(ev.idPrefix) ? "Reminded" : "Remind Me"}</span>
                            </button>
                          )}
                          <button
                            onClick={() => ev.isDynamic 
                              ? triggerDynamicICSDownload(ev.name, `${ev.timing} ${MONTHS[currentMonth]} ${selectedDay}`, ev.description)
                              : triggerStaticICSDownload(ev.item)
                            }
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-slate-400 hover:text-amber-400 bg-white/[0.02] hover:bg-amber-500/5 border border-white/5 hover:border-amber-500/20 transition-all cursor-pointer flex items-center space-x-1"
                            title="Export standard RFC calendar event to .ics"
                          >
                            <Download className="w-3 h-3" />
                            <span>Export ICS</span>
                          </button>
                          <a
                            href={ev.isDynamic
                              ? getDynamicGoogleCalUrl(ev.name, `${ev.timing} ${MONTHS[currentMonth]} ${selectedDay}`, ev.description, ev.timing)
                              : getGoogleCalendarUrlForFest(ev.item)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-[#22c55e] hover:text-black bg-emerald-500/10 hover:bg-[#22c55e] border border-emerald-500/20 hover:border-emerald-500 transition-all cursor-pointer flex items-center space-x-1 decoration-transparent font-semibold"
                            title="Sync directly to Google Calendar"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Sync Google Cal</span>
                          </a>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

          {/* Autophagy Education Info Panel */}
          {onGoToReadDesk && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/10 to-[#0e0f14] border border-white/5 space-y-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h6 className="text-xs font-sans font-semibold text-emerald-300">Autophagy & Scripture Study</h6>
              </div>
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                Physiological restraint during fasting (such as Ekadashi or Ramadan) rests the digestive system and frees metabolic reserves, heightening synaptic sensitivity and clearing the mind. This renders fasted states ideal for deep reading.
              </p>
              <button
                onClick={onGoToReadDesk}
                className="mt-1 pl-0 text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center space-x-1 transition-all cursor-pointer bg-transparent border-0"
              >
                <BookOpen className="w-3 h-3" />
                <span>Go to Scripture Desk &rarr;</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
