/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Clock, 
  Plus, 
  Trash2, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  Info, 
  CheckCircle2, 
  X, 
  AlertTriangle,
  Calendar,
  Filter,
  Check,
  Settings,
  Flame,
  HelpCircle,
  CalendarDays,
  Apple
} from "lucide-react";
import { SACRED_FESTIVALS_DATA, FESTIVAL_DATES_2026, FestivalItem } from "../festivalsData";
import { RELIGION_LABELS, RELIGION_COLORS } from "../scripturesRegistry";

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

export interface ReminderItem {
  id: string;
  time: string; // "HH:MM" 24 hour format
  tradition: string; // "Hinduism" | "Islam" | "Christianity" | "Buddhism" | "Judaism" | "Jainism" | "Taoism" | "Interfaith"
  label: string; // "Study Session" | "Prayer" | "Contemplation" | "Sacred Chronicles"
  active: boolean;
}

// Subscribed Predefined Fast Reminder
export interface SubscribedFast {
  id: string; // Matches FestivalItem id
  notifyTime: string; // "HH:MM" e.g., "05:00"
  notifyDayMode: "dayOf" | "eveBefore"; // morning of, or evening before
  active: boolean;
}

// User Created Custom Fast Reminder
export interface CustomFast {
  id: string;
  name: string;
  religion: string;
  date: string; // "YYYY-MM-DD" or similar, we'll store as YYYYMMDD internally
  duration: string;
  intensity: "waterless" | "water-only" | "partial-diet" | "abstinence" | "flexible";
  allowedFoods: string;
  strictlyProhibited: string;
  spiritualSignificance: string;
  notifyTime: string; // "HH:MM"
  notifyDayMode: "dayOf" | "eveBefore";
  active: boolean;
}

interface StudyReminderProps {
  onSpeakText?: (text: string, title?: string) => void;
  myReminders?: string[];
  setMyReminders?: React.Dispatch<React.SetStateAction<string[]>>;
}

const TRADITIONS = [
  { value: "Interfaith", label: "Interfaith / Scholar" },
  { value: "Christianity", label: "Christianity" },
  { value: "Islam", label: "Islam" },
  { value: "Hinduism", label: "Hinduism" },
  { value: "Buddhism", label: "Buddhism" },
  { value: "Judaism", label: "Judaism" },
  { value: "Jainism", label: "Jainism" },
  { value: "Taoism", label: "Taoism" }
];

const LABELS = [
  { value: "Study Session", label: "Study & Research" },
  { value: "Prayer", label: "Sacred Prayer" },
  { value: "Contemplation", label: "Silent Contemplation" },
  { value: "Sacred Chronicles", label: "Legend Chronicles" }
];

// Curated holy texts / quotes for each tradition to trigger during study notification
const DAILY_INSPIRATIONS: Record<string, string[]> = {
  Christianity: [
    "Thy word is a lamp unto my feet, and a light unto my path. (Psalm 119:105)",
    "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. (Joshua 1:9)",
    "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. (John 14:27)"
  ],
  Islam: [
    "Indeed, with hardship [will be] ease. (Quran 94:6)",
    "And speak to people good words. (Quran 2:83)",
    "O Lord, increase me in knowledge. (Quran 20:114)"
  ],
  Hinduism: [
    "Perform your duty with absolute equanimity, O Arjuna, abandoning attachment to success or failure. (Bhagavad Gita 2.48)",
    "Lead me from the unreal to the real, from darkness to light, from death to immortality. (Brihadaranyaka Upanishad)",
    "Truth alone triumphs, not untruth. By truth is laid out the divine path. (Mundaka Upanishad)"
  ],
  Buddhism: [
    "All that we are is the result of what we have thought. The mind is everything. (The Dhammapada 1.1)",
    "In whom there is no sympathy for living beings: know him as an outcast. (Vasala Sutta)",
    "Conquer anger by non-anger. Conquer evil by good. Conquer meanness by generosity. conquer liar by truth. (The Dhammapada)"
  ],
  Judaism: [
    "Behold, how good and how pleasant it is for brethren to dwell together in unity! (Psalm 133:1)",
    "The Lord is my shepherd; I shall not want. (Psalm 23:1)",
    "Love your fellow as yourself. (Leviticus 19:18)"
  ],
  Jainism: [
    "Parasparopagraho Jivanama - Souls render service to one another. (Tattvartha Sutra 5.21)",
    "In happiness and suffering, in joy and grief, we should regard all creatures as we regard our own self. (Lord Mahavira)",
    "Non-injury (Ahimsa) is the highest religion. (Acaranga Sutra)"
  ],
  Taoism: [
    "Nature does not hurry, yet everything is accomplished. (Lao Tzu)",
    "To the mind that is still, the entire universe surrenders. (Chuang Tzu)",
    "Knowing others is intelligence; knowing yourself is true wisdom. (Tao Te Ching)"
  ],
  Interfaith: [
    "Truth is one; the wise speak of it in many ways. (Rig Veda / Universal Scholar)",
    "The world is my country, all mankind are my brethren, and to do good is my religion. (Thomas Paine)",
    "Where there is love, there is life. (Mahatma Gandhi)"
  ]
};

// Filter global festivals to match fasting or vigil items or those with fastingRules
const GLOBAL_FASTS: FestivalItem[] = SACRED_FESTIVALS_DATA.filter(
  (fest) => fest.type === "fasting" || fest.type === "vigil" || !!fest.fastingRules
);

export default function StudyReminder({ onSpeakText, myReminders, setMyReminders }: StudyReminderProps) {
  // Active Navigation Tab
  const [activeTab, setActiveTab ] = useState<"alarms" | "fasts">("alarms");

  // Local backup for standalone or fallback sync if state is not passed
  const [localMyReminders, setLocalMyReminders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("my_sacred_fast_reminders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem("my_sacred_fast_reminders");
        if (saved) {
          setLocalMyReminders(JSON.parse(saved));
        }
      } catch (e) {
        console.warn("Storage sync back failed in StudyReminder", e);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const remindersList = myReminders !== undefined ? myReminders : localMyReminders;
  const updateRemindersList = (newList: string[]) => {
    if (setMyReminders) {
      setMyReminders(newList);
    } else {
      setLocalMyReminders(newList);
      localStorage.setItem("my_sacred_fast_reminders", JSON.stringify(newList));
    }
    window.dispatchEvent(new Event("storage"));
  };

  // Study alarm reminders state
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem("interfaith_academy_reminders");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load study reminders", e);
    }
    return [
      {
        id: "default-scholar",
        time: "09:00",
        tradition: "Interfaith",
        label: "Study Session",
        active: true
      }
    ];
  });

  // Fasting Alerts subscriptions state
  const [subscribedFasts, setSubscribedFasts] = useState<SubscribedFast[]>(() => {
    try {
      const saved = localStorage.getItem("sacred_fast_alerts_subscribed");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load subscribed fasts", e);
    }
    // Pre-populate with standard major fasts by default: Yom Kippur and Eco-cycle Ekadashi and Ramadan Fast
    return [
      { id: "ekadashi-vrat", notifyTime: "06:00", notifyDayMode: "dayOf", active: true },
      { id: "ramadan-sawm", notifyTime: "05:00", notifyDayMode: "dayOf", active: true },
      { id: "yom-kippur", notifyTime: "18:00", notifyDayMode: "eveBefore", active: true }
    ];
  });

  // Custom User Fasts reminders state
  const [customFasts, setCustomFasts] = useState<CustomFast[]>(() => {
    try {
      const saved = localStorage.getItem("custom_sacred_fasts");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load custom fasts", e);
    }
    return [];
  });

  // Selected Fast religion filters
  const [fastFilterReligion, setFastFilterReligion] = useState<string>("all");

  // State values for creating a standard study reminder alarm
  const [newTime, setNewTime] = useState("09:00");
  const [newTradition, setNewTradition] = useState("Interfaith");
  const [newLabel, setNewLabel] = useState("Study Session");
  
  // State values for creating a custom fast alert reminder
  const [showCustomFastForm, setShowCustomFastForm] = useState(false);
  const [custName, setCustName] = useState("");
  const [custReligion, setCustReligion] = useState("hinduism");
  const [custDate, setCustDate] = useState("2026-06-11");
  const [custDuration, setCustDuration] = useState("Sunrise to Sunset");
  const [custIntensity, setCustIntensity] = useState<CustomFast["intensity"]>("partial-diet");
  const [custAllowed, setCustAllowed] = useState("Fruits, milk, water, roots");
  const [custProhibited, setCustProhibited] = useState("Grains, cereals, meats, onions");
  const [custSignificance, setCustSignificance] = useState("Clears energy pathways for deep scripture contemplation and mindfulness.");
  const [custNotifyTime, setCustNotifyTime] = useState("06:00");
  const [custNotifyDayMode, setCustNotifyDayMode] = useState<CustomFast["notifyDayMode"]>("dayOf");

  // Notification auth status and notices
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [showSandboxNotice, setShowSandboxNotice] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // In-app alert overlays
  const [activeAlert, setActiveAlert] = useState<{
    title: string;
    body: string;
    tradition: string;
  } | null>(null);

  const [activeFastingAlert, setActiveFastingAlert] = useState<{
    name: string;
    religion: string;
    type: string;
    duration: string;
    intensity: string;
    allowedFoods: string[];
    prohibitedFoods: string[];
    spiritualSignificance: string;
    isPredefined: boolean;
  } | null>(null);

  // Avoid duplicate notifications in same minute slot
  const [lastFired, setLastFired] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        setPermission(Notification.permission);
      } catch (e) {
        console.warn("Notification permission check blocked by iframe sandboxing policy:", e);
        setPermission("default");
      }
    }
  }, []);

  // Synchronise state values with localStorage
  useEffect(() => {
    localStorage.setItem("interfaith_academy_reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("sacred_fast_alerts_subscribed", JSON.stringify(subscribedFasts));
  }, [subscribedFasts]);

  useEffect(() => {
    localStorage.setItem("custom_sacred_fasts", JSON.stringify(customFasts));
  }, [customFasts]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support standard Push Notifications.");
      return;
    }

    try {
      let result: NotificationPermission = "default";
      try {
        result = await Notification.requestPermission();
      } catch (err) {
        console.warn("requestPermission failed in sandbox", err);
      }
      setPermission(result);
      if (result === "denied") {
        setShowSandboxNotice(true);
      } else if (result === "granted") {
        try {
          new Notification("Interfaith Scripture & Fasting Academy", {
            body: "Push alerts active! You will now receive alerts for sacred fasting days and scripture study sessions.",
            icon: "/favicon.ico"
          });
        } catch (err) {
          console.warn("Blocked standard native popup delivery:", err);
        }
      }
    } catch (e) {
      console.warn("Notification permission error", e);
      setShowSandboxNotice(true);
    }
  };

  // Sound generator (Sacred Singing Bowl resonance chord)
  const playBowlChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // Fundamental mystical pitch (C5, G5, C3)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime); // G5 (Perfect 5th)
      gain2.gain.setValueAtTime(0.12, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = "triangle";
      osc3.frequency.setValueAtTime(130.81, ctx.currentTime); // C3 deep resonance drone
      gain3.gain.setValueAtTime(0.08, ctx.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();

      osc1.stop(ctx.currentTime + 3.5);
      osc2.stop(ctx.currentTime + 3.5);
      osc3.stop(ctx.currentTime + 3.5);
    } catch (err) {
      console.warn("Singing bowl ring skipped.", err);
    }
  };

  // Create standard study reminder
  const handleAddReminder = () => {
    const item: ReminderItem = {
      id: "reminder_" + Date.now(),
      time: newTime,
      tradition: newTradition,
      label: newLabel,
      active: true
    };
    setReminders([...reminders, item]);
    setSuccessToast(`Created ${newLabel} reminder at ${newTime}!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  // Predefined fast sub-toggle triggers
  const handleToggleSubscribedFast = (id: string) => {
    const isSubscribed = subscribedFasts.some(s => s.id === id);
    if (isSubscribed) {
      setSubscribedFasts(subscribedFasts.filter(s => s.id !== id));
      setSuccessToast("Removed sacred fast notification subscription.");
    } else {
      setSubscribedFasts([...subscribedFasts, {
        id,
        notifyTime: "06:00",
        notifyDayMode: "dayOf",
        active: true
      }]);
      setSuccessToast("Subscribed to sacred fast notification alert!");
    }
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleUpdateSubTiming = (id: string, notifyDayMode: SubscribedFast["notifyDayMode"], notifyTime: string) => {
    setSubscribedFasts(subscribedFasts.map(s => {
      if (s.id === id) {
        return { ...s, notifyTime, notifyDayMode };
      }
      return s;
    }));
    setSuccessToast("Updated fasting alert timing parameters!");
    setTimeout(() => setSuccessToast(null), 2000);
  };

  const handleToggleSubActive = (id: string) => {
    setSubscribedFasts(subscribedFasts.map(s => {
      if (s.id === id) {
        return { ...s, active: !s.active };
      }
      return s;
    }));
  };

  // Custom User Fast Alerts
  const handleCreateCustomFast = () => {
    if (!custName.trim()) {
      alert("Please provide a name for your custom sacred fast.");
      return;
    }
    const cleanDateStamp = custDate.replace(/-/g, ""); // "2026-06-11" -> "20260611"
    const item: CustomFast = {
      id: "custom_fast_" + Date.now(),
      name: custName,
      religion: custReligion,
      date: cleanDateStamp,
      duration: custDuration,
      intensity: custIntensity,
      allowedFoods: custAllowed,
      strictlyProhibited: custProhibited,
      spiritualSignificance: custSignificance,
      notifyTime: custNotifyTime,
      notifyDayMode: custNotifyDayMode,
      active: true
    };
    setCustomFasts([...customFasts, item]);
    setShowCustomFastForm(false);
    // Reset Form fields
    setCustName("");
    setSuccessToast(`Sacred Fast "${item.name}" registered successfully!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDeleteCustomFast = (id: string) => {
    setCustomFasts(customFasts.filter(c => c.id !== id));
  };

  const handleToggleCustomFastActive = (id: string) => {
    setCustomFasts(customFasts.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  // Helper date calculation relative to 2026
  function getDaysUntil(dateStr: string): number {
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

  // Periodic alarm dispatcher & scanner loop (runs every 10 seconds)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const todayYYYY = now.getFullYear();
      const todayMM = String(now.getMonth() + 1).padStart(2, "0");
      const todayDD = String(now.getDate()).padStart(2, "0");
      const todayStr = `${todayYYYY}${todayMM}${todayDD}`; // e.g., "20260608"

      const tomorrowDate = new Date(now);
      tomorrowDate.setDate(now.getDate() + 1);
      const tomYYYY = tomorrowDate.getFullYear();
      const tomMM = String(tomorrowDate.getMonth() + 1).padStart(2, "0");
      const tomDD = String(tomorrowDate.getDate()).padStart(2, "0");
      const tomorrowStr = `${tomYYYY}${tomMM}${tomDD}`; // e.g., "20260609"

      const curHour = String(now.getHours()).padStart(2, "0");
      const curMin = String(now.getMinutes()).padStart(2, "0");
      const curTimeStr = `${curHour}:${curMin}`;

      // 1. SCAN AND DISPATCH STANDARD STUDY ALARMS
      reminders.forEach((reminder) => {
        if (!reminder.active) return;
        if (reminder.time === curTimeStr) {
          const fireKey = `study-${reminder.id}-${todayStr}-${reminder.time}`;
          if (lastFired[reminder.id] === fireKey) return;

          setLastFired(prev => ({ ...prev, [reminder.id]: fireKey }));
          playBowlChime();

          const quotePool = DAILY_INSPIRATIONS[reminder.tradition] || DAILY_INSPIRATIONS["Interfaith"];
          const selectedQuote = quotePool[Math.floor(Math.random() * quotePool.length)];

          const title = `📖 Study Session: ${reminder.tradition}`;
          const body = `It's time for your sacred ${reminder.tradition} study session.\n\n"${selectedQuote}"`;

          if (permission === "granted") {
            try {
              new Notification(title, { body, icon: "/favicon.ico", silent: false });
            } catch (e) {
              console.warn("Fallback to in-app notifier inside sandbox", e);
            }
          }

          setActiveAlert({
            title: title,
            body: selectedQuote,
            tradition: reminder.tradition
          });
        }
      });

      // 2. SCAN AND DISPATCH PREDEFINED SACRED FAST REMINDERS
      subscribedFasts.forEach((sub) => {
        if (!sub.active) return;
        
        const dates = FESTIVAL_DATES_2026[sub.id];
        if (!dates) return;

        const festivalItem = GLOBAL_FASTS.find(g => g.id === sub.id);
        if (!festivalItem) return;

        // Determine if alert is supposed to trigger today
        let matchesDay = false;
        if (sub.notifyDayMode === "dayOf" && todayStr >= dates.start && todayStr <= dates.end) {
          matchesDay = true;
        } else if (sub.notifyDayMode === "eveBefore" && tomorrowStr >= dates.start && tomorrowStr <= dates.end) {
          matchesDay = true;
        }

        if (matchesDay && curTimeStr === sub.notifyTime) {
          const fireKey = `fast-${sub.id}-${todayStr}-${sub.notifyTime}`;
          if (lastFired[sub.id] === fireKey) return;

          setLastFired(prev => ({ ...prev, [sub.id]: fireKey }));
          playBowlChime();

          const title = `🌅 Sacred Fast Day: ${festivalItem.name} 🍽️`;
          const body = `Notification for ${festivalItem.name}. Spiritual Guidance: ${festivalItem.fastingRules?.duration || "Whole day observations"}. Significance: ${festivalItem.spiritualSignificance}`;

          if (permission === "granted") {
            try {
              new Notification(title, { body, icon: "/favicon.ico" });
            } catch (e) {
              console.warn("Iframe notification blocked", e);
            }
          }

          setActiveFastingAlert({
            name: festivalItem.name,
            religion: festivalItem.religion,
            type: festivalItem.type,
            duration: festivalItem.fastingRules?.duration || "Varies",
            intensity: festivalItem.fastingRules?.intensity || "abstinence",
            allowedFoods: festivalItem.fastingRules?.allowedFoods || ["Varies based on family guidance"],
            prohibitedFoods: festivalItem.fastingRules?.strictlyProhibited || ["Meats, luxury oils"],
            spiritualSignificance: festivalItem.spiritualSignificance,
            isPredefined: true
          });
        }
      });

      // 3. SCAN AND DISPATCH CUSTOM USER FAST REMINDERS
      customFasts.forEach((cust) => {
        if (!cust.active) return;

        let matchesDay = false;
        if (cust.notifyDayMode === "dayOf" && todayStr === cust.date) {
          matchesDay = true;
        } else if (cust.notifyDayMode === "eveBefore" && tomorrowStr === cust.date) {
          matchesDay = true;
        }

        if (matchesDay && curTimeStr === cust.notifyTime) {
          const fireKey = `customfast-${cust.id}-${todayStr}-${cust.notifyTime}`;
          if (lastFired[cust.id] === fireKey) return;

          setLastFired(prev => ({ ...prev, [cust.id]: fireKey }));
          playBowlChime();

          const title = `🌌 Custom Fast Alert: ${cust.name}`;
          const body = `Prepare for your registered ${cust.name} fast (${cust.religion}). Duration: ${cust.duration}. Significance: ${cust.spiritualSignificance}`;

          if (permission === "granted") {
            try {
              new Notification(title, { body, icon: "/favicon.ico" });
            } catch (e) {
              console.warn("Iframe notification fail", e);
            }
          }

          setActiveFastingAlert({
            name: cust.name,
            religion: cust.religion,
            type: "fasting",
            duration: cust.duration,
            intensity: cust.intensity,
            allowedFoods: cust.allowedFoods.split(",").map(f => f.trim()),
            prohibitedFoods: cust.strictlyProhibited.split(",").map(f => f.trim()),
            spiritualSignificance: cust.spiritualSignificance,
            isPredefined: false
          });
        }
      });

    }, 10000); // scans every 10 seconds for high precision checks

    return () => clearInterval(checkInterval);
  }, [reminders, subscribedFasts, customFasts, permission, lastFired]);

  // Filtering fasts for representation
  const filteredPredefinedFasts = GLOBAL_FASTS.filter((fast) => {
    if (fastFilterReligion === "all") return true;
    return fast.religion === fastFilterReligion;
  });

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-4 shadow-xl text-left select-none animate-fade-in relative">
      
      {/* Title with Action Icons */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500/10 border border-amber-500/30 p-1.5 rounded-lg text-amber-400">
            <Bell className="w-4 h-4 animate-swing" />
          </div>
          <div>
            <h3 className="text-xs uppercase font-mono tracking-widest text-slate-200 font-extrabold block">
              Sacred Liturgical Reminders
            </h3>
            <span className="text-[9px] text-slate-400 font-sans block">
              Manage study logs and sacred fast days
            </span>
          </div>
        </div>

        {/* Enable Notification click */}
        {permission !== "granted" ? (
          <button
            onClick={requestNotificationPermission}
            className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/25 transition-all text-amber-400 cursor-pointer text-center font-bold"
            title="Enable Browser Push Notifications"
          >
            Enable Push
          </button>
        ) : (
          <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15">
            Push: Authorized
          </span>
        )}
      </div>

      {/* Tabs Selector */}
      <div className="bg-black/40 p-1 rounded-xl grid grid-cols-2 gap-1 text-center font-mono border border-white/5">
        <button
          onClick={() => setActiveTab("alarms")}
          className={`py-1.5 text-[10px] uppercase font-bold rounded-lg cursor-pointer transition-all ${
            activeTab === "alarms" 
              ? "bg-[#181822] text-amber-400 shadow-sm border border-white/5" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          ⏰ Study Session Alarms ({reminders.length})
        </button>
        <button
          onClick={() => setActiveTab("fasts")}
          className={`py-1.5 text-[10px] uppercase font-bold rounded-lg cursor-pointer transition-all relative ${
            activeTab === "fasts" 
              ? "bg-[#181822] text-amber-400 shadow-sm border border-white/5" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🍽️ Sacred Fast Alerts ({subscribedFasts.filter(sf => sf.active).length + customFasts.filter(cf => cf.active).length})
          {(subscribedFasts.length > 0 || customFasts.length > 0) && (
            <span className="absolute -top-1 right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
          )}
        </button>
      </div>

      {/* Sandbox iframe alert notice */}
      {showSandboxNotice && (
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-2.5 space-y-1 block animate-fade-in text-[9px] leading-normal font-sans text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Info className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="font-bold text-amber-400 uppercase font-mono">Sandbox Notification Alert</span>
          </div>
          <p>
            Browsers block direct Push alerts inside sandboxed iframes. For real push alerts, click <strong className="text-white">"Open in new tab"</strong>, or rely on our active in-app sound alert layout below!
          </p>
          <button 
            onClick={() => setShowSandboxNotice(false)}
            className="font-mono hover:underline text-slate-300 cursor-pointer block mt-1"
          >
            Acknowledge & Close
          </button>
        </div>
      )}

      {/* TAB 1: STUDY SESSION ALARMS */}
      {activeTab === "alarms" && (
        <div className="space-y-3 animate-fade-in">
          
          {/* Create alarm inputs */}
          <div className="space-y-3 bg-white/[0.01] border border-white/5 rounded-xl p-3">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              Register New Study Timer
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[8px] font-mono text-slate-400 uppercase block">Hour/Minute</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-[#0e0e13] border border-white/10 text-xs text-white rounded p-1.5 focus:border-amber-500 font-mono outline-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono text-slate-400 uppercase block">Vibe Label</label>
                <select
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-[#0e0e13] border border-white/10 text-xs text-white rounded p-1.5 focus:border-amber-500 font-sans outline-none cursor-pointer"
                >
                  {LABELS.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-mono text-slate-400 uppercase block">Scriptural Context</label>
              <select
                value={newTradition}
                onChange={(e) => setNewTradition(e.target.value)}
                className="w-full bg-[#0e0e13] border border-white/10 text-xs text-slate-200 rounded p-1.5 focus:border-amber-500 font-sans outline-none cursor-pointer"
              >
                {TRADITIONS.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddReminder}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer outline-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Daily Study Alarm</span>
            </button>
          </div>

          {/* Alarm list */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              Active Alarm Schedules ({reminders.length})
            </span>

            {reminders.length === 0 ? (
              <p className="text-[10px] text-slate-500 font-serif italic text-center py-2">
                No active scripture study alarms.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar-none">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`p-2 rounded bg-black/40 border transition-all duration-200 flex items-center justify-between gap-1.5 ${
                      reminder.active ? "border-white/10" : "border-white/5 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 max-w-[150px]">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div className="truncate">
                        <span className="text-[11px] font-mono text-white block">{reminder.time}</span>
                        <span className="text-[9px] text-[#dacb43] font-sans font-medium block">
                          {reminder.label} • <span className="font-mono text-[8px] text-slate-400 bg-white/5 px-1 py-0.2 rounded">{reminder.tradition}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleActive(reminder.id)}
                        className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border cursor-pointer select-none ${
                          reminder.active 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25" 
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20"
                        }`}
                      >
                        {reminder.active ? "Active" : "Paused"}
                      </button>

                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded transition-all cursor-pointer"
                        title="Delete alarm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: SACRED WORLD FASTING ALERTS & REMINDERS */}
      {activeTab === "fasts" && (
        <div className="space-y-3 animate-fade-in">
          
          {/* Quick Stats: Subscriptions Count and Next Occurrence */}
          <div className="bg-gradient-to-r from-amber-500/10 to-[#1e1310] border border-amber-500/15 rounded-xl p-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-amber-500 font-extrabold tracking-wider block">
                Fasting Calendar Alert Engine
              </span>
              <p className="text-[10px] text-slate-300 font-sans leading-snug">
                Never miss a holy fast or spiritual purification day. Preconfigured and fully customizable alerts.
              </p>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/40 px-2 py-1.5 rounded-lg text-center shrink-0">
              <span className="text-amber-400 text-lg font-bold font-mono block leading-none">
                {subscribedFasts.length + customFasts.length + remindersList.length}
              </span>
              <span className="text-[8px] text-slate-400 font-mono">Alerts Active</span>
            </div>
          </div>

          {/* MY REMINDERS SECTION */}
          <div className="space-y-2 bg-[#1b1912]/80 border border-amber-500/15 rounded-xl p-3 animate-fade-in text-[10px]">
            <span className="text-[9.5px] font-mono text-amber-400 font-bold block uppercase border-b border-amber-500/10 pb-1 flex items-center justify-between">
              <span>🔔 My Fasting Reminders ({remindersList.length})</span>
              {remindersList.length > 0 && (
                <span className="text-[8px] font-normal text-slate-400 font-sans capitalize">Triggering 24h before</span>
              )}
            </span>

            {remindersList.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic font-serif leading-snug py-1">
                No reminders are set yet. Click "Remind Me" on any fasting festival card to add it to this list.
              </p>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-none pt-1">
                {remindersList.map((id) => {
                  const fast = SACRED_FESTIVALS_DATA.find((f) => f.id === id);
                  if (!fast) return null;
                  const dates = FESTIVAL_DATES_2026[id];
                  const daysUntil = dates ? getDaysUntil(dates.start) : 999;
                  return (
                    <div
                      key={id}
                      className="p-2 rounded bg-black/45 border border-white/5 flex items-center justify-between gap-1.5 transition-all hover:bg-black/60"
                    >
                      <div className="flex-1 min-w-0 pr-1.5">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${RELIGION_COLORS[fast.religion] || "bg-amber-400"}`} />
                          <span className="font-bold text-white truncate block">{fast.name}</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-400 block pt-0.5">
                          Starts: {dates ? `${dates.start.substring(0, 4)}-${dates.start.substring(4, 6)}-${dates.start.substring(6, 8)}` : "Varies"} ({RELIGION_LABELS[fast.religion]})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[9px] shrink-0 font-mono">
                        {daysUntil === 0 && (
                          <span className="bg-red-500 text-white font-bold px-1.5 py-0.5 rounded animate-pulse text-[8px]">🔴 Today</span>
                        )}
                        {daysUntil === 1 && (
                          <span className="bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded text-[8px]">🟡 Tomorrow</span>
                        )}
                        {daysUntil > 1 && daysUntil <= 30 && (
                          <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[8px]">🟢 In {daysUntil}d</span>
                        )}
                        {(daysUntil > 30 || daysUntil < 0) && (
                          <span className="text-slate-500 pr-1 text-[8px]">{daysUntil < 0 ? "Observed" : `In ${daysUntil}d`}</span>
                        )}

                        <button
                          onClick={() => updateRemindersList(remindersList.filter((item) => item !== id))}
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded cursor-pointer"
                          title="Untoggle reminder"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation action buttons: "Create Custom Fast" */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center space-x-1 text-slate-400">
              <Filter className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-mono uppercase font-bold">Filter Religion:</span>
            </div>
            <button
              onClick={() => setShowCustomFastForm(!showCustomFastForm)}
              className="px-2 py-1 rounded bg-[#1f1715] hover:bg-amber-500 border border-amber-500/20 hover:border-amber-500 text-amber-400 hover:text-black hover:font-bold transition-all text-[9.5px] font-mono cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3 h-3" />
              <span>{showCustomFastForm ? "Close Form" : "Custom Fast Alert"}</span>
            </button>
          </div>

          {/* Religion mini tabs */}
          <div className="flex flex-wrap gap-1 border-b border-white/5 pb-2">
            {["all", "hinduism", "islam", "christianity", "judaism", "jainism"].map(r => (
              <button
                key={r}
                onClick={() => setFastFilterReligion(r)}
                className={`px-2 py-0.5 rounded text-[8px] uppercase font-mono border transition-all cursor-pointer ${
                  fastFilterReligion === r
                    ? "bg-amber-500 text-black font-bold border-amber-500"
                    : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
                }`}
              >
                {r === "all" ? "All" : r}
              </button>
            ))}
          </div>

          {/* Custom Sacred Fast Creation Panel */}
          {showCustomFastForm && (
            <div className="space-y-2.5 bg-[#151111] border border-amber-500/15 rounded-xl p-3 animate-fade-in text-[10px]">
              <span className="text-[9.5px] font-mono text-amber-400 font-bold block uppercase border-b border-amber-500/10 pb-1">
                ⚙️ Define Custom Fast Alert
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-400 uppercase block font-mono">Fast Name</label>
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Nirjala Ekadashi Fast"
                    className="w-full bg-black/40 border border-white/10 text-slate-200 rounded p-1 outline-none text-[10px] focus:border-amber-500 placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-400 uppercase block font-mono">Tradition</label>
                  <select
                    value={custReligion}
                    onChange={(e) => setCustReligion(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-slate-200 rounded p-1 outline-none text-[10px] focus:border-amber-500 cursor-pointer"
                  >
                    <option value="hinduism">Hinduism</option>
                    <option value="islam">Islam</option>
                    <option value="christianity">Christianity</option>
                    <option value="judaism">Judaism</option>
                    <option value="jainism">Jainism</option>
                    <option value="buddhism">Buddhism</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-400 uppercase block font-mono">Specific Date</label>
                  <input
                    type="date"
                    value={custDate}
                    onChange={(e) => setCustDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-slate-200 rounded p-1 outline-none text-[10px] focus:border-amber-500 font-mono cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-400 uppercase block font-mono">Fast Duration</label>
                  <input
                    type="text"
                    value={custDuration}
                    onChange={(e) => setCustDuration(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-slate-200 rounded p-1 outline-none text-[10px] focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] text-slate-400 uppercase block font-mono">Fasting Intensity Level</label>
                <div className="grid grid-cols-3 gap-1">
                  {["waterless", "water-only", "partial-diet"].map((intensityOpt) => (
                    <button
                      key={intensityOpt}
                      type="button"
                      onClick={() => setCustIntensity(intensityOpt as CustomFast["intensity"])}
                      className={`px-1.5 py-0.5 text-[8px] uppercase font-mono text-center border rounded transition-all cursor-pointer ${
                        custIntensity === intensityOpt
                          ? "bg-amber-500 border-amber-500 text-black font-bold"
                          : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {intensityOpt.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-400 uppercase block font-mono">Allowed Foods/Liquids</label>
                  <input
                    type="text"
                    value={custAllowed}
                    onChange={(e) => setCustAllowed(e.target.value)}
                    placeholder="e.g. Fluids, fruits"
                    className="w-full bg-black/40 border border-white/10 text-slate-200 rounded p-1 outline-none text-[10px] focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-400 uppercase block font-mono">Strict Prohibitions</label>
                  <input
                    type="text"
                    value={custProhibited}
                    onChange={(e) => setCustProhibited(e.target.value)}
                    placeholder="e.g. Grains, starches"
                    className="w-full bg-black/40 border border-white/10 text-slate-200 rounded p-1 outline-none text-[10px] focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] text-slate-400 uppercase block font-mono">Spiritual Reason & Purpose</label>
                <textarea
                  value={custSignificance}
                  onChange={(e) => setCustSignificance(e.target.value)}
                  className="w-full h-10 bg-black/40 border border-white/10 text-slate-200 rounded p-1 outline-none text-[10px] focus:border-amber-500 resize-none"
                  placeholder="Spiritual details or scriptures referenced"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-400 uppercase block font-mono">Alert Schedule Time</label>
                  <input
                    type="time"
                    value={custNotifyTime}
                    onChange={(e) => setCustNotifyTime(e.target.value)}
                    className="w-full bg-[#0e0e13] border border-white/10 text-[10px] text-white rounded p-1 focus:border-amber-500 font-mono cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-400 uppercase block font-mono">Push Timing Mode</label>
                  <select
                    value={custNotifyDayMode}
                    onChange={(e) => setCustNotifyDayMode(e.target.value as CustomFast["notifyDayMode"])}
                    className="w-full bg-[#0e0e13] border border-white/10 text-[10px] text-white rounded p-1 focus:border-amber-500 cursor-pointer"
                  >
                    <option value="dayOf">Morning of Fast</option>
                    <option value="eveBefore">Evening Before fast</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreateCustomFast}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black py-1 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Custom Fast Alert</span>
              </button>
            </div>
          )}

          {/* Combined list of custom and predefined sacred fast reminders */}
          <div className="space-y-2">
            <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              Subscribed Sacred Fasts & Notifications
            </span>

            {/* Custom fasts list render */}
            {customFasts.map((cust) => {
              const daysUntil = getDaysUntil(cust.date);
              return (
                <div 
                  key={cust.id} 
                  className={`p-2.5 rounded-xl bg-[#191414] border hover:border-amber-500/20 transition-all text-[10px] space-y-2 ${
                    cust.active ? "border-amber-500/10" : "border-white/5 opacity-55"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <h4 className="font-serif font-bold text-slate-100">{cust.name}</h4>
                      </div>
                      <span className="text-[8px] px-1 py-0.2 rounded font-mono uppercase bg-amber-500/10 text-amber-400">
                        {cust.religion} • Custom Fast
                      </span>
                    </div>

                    {/* Quick Countdown Alert Pills */}
                    <div>
                      {daysUntil === 0 && (
                        <span className="text-[8px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded animate-pulse">
                          🔴 TODAY
                        </span>
                      )}
                      {daysUntil === 1 && (
                        <span className="text-[8px] bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded">
                          🟡 TOMORROW
                        </span>
                      )}
                      {daysUntil > 1 && daysUntil <= 7 && (
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-mono px-1.5 py-0.5 rounded">
                          🟢 In {daysUntil} Days
                        </span>
                      )}
                      {daysUntil < 0 && (
                        <span className="text-[8px] bg-slate-500/10 text-slate-400 font-mono px-1.5 py-0.5 rounded">
                          ⚪ Observed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Intensity specifications */}
                  <p className="text-[9.5px] text-slate-400 font-sans italic leading-normal">
                    {cust.spiritualSignificance}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[8.5px] bg-black/30 p-1.5 rounded-lg border border-white/5 text-slate-300 font-mono">
                    <div>
                      <strong className="text-amber-500 block">Allowed:</strong> {cust.allowedFoods}
                    </div>
                    <div>
                      <strong className="text-red-400 block">Prohibited:</strong> {cust.strictlyProhibited}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-[8px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500/80" />
                      Alert: <span className="text-white font-bold">{cust.notifyTime}</span> ({cust.notifyDayMode === "dayOf" ? "Morning" : "Eve before"})
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleCustomFastActive(cust.id)}
                        className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded cursor-pointer select-none ${
                          cust.active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25"
                            : "bg-stone-500/10 text-stone-400 border border-stone-500/20 hover:bg-stone-500/20"
                        }`}
                      >
                        {cust.active ? "Enabled" : "Paused"}
                      </button>

                      <button
                        onClick={() => handleDeleteCustomFast(cust.id)}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded transition-all cursor-pointer"
                        title="Delete custom fast alarm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Predefined global Fasts list render */}
            {filteredPredefinedFasts.map((fast) => {
              const dates = FESTIVAL_DATES_2026[fast.id];
              const daysUntil = dates ? getDaysUntil(dates.start) : 999;
              const subObj = subscribedFasts.find(s => s.id === fast.id);
              const isSubscribed = !!subObj;

              return (
                <div 
                  key={fast.id} 
                  className={`p-2.5 rounded-xl bg-black/45 border transition-all text-[10px] space-y-2 ${
                    isSubscribed ? "border-amber-500/20 shadow-md shadow-amber-500/5" : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="space-y-0.5">
                      <h4 className="font-serif font-bold text-slate-100 flex items-center gap-1 leading-snug">
                        {fast.name}
                        {fast.transliteration && (
                          <span className="text-[8.5px] font-normal text-slate-500">({fast.transliteration})</span>
                        )}
                      </h4>
                      <div className="flex items-center space-x-1 whitespace-nowrap">
                        <span className="text-[8px] px-1.5 py-0.2 rounded font-mono uppercase bg-white/5 text-slate-400 border border-white/5">
                          {RELIGION_LABELS[fast.religion]}
                        </span>
                        <span className="text-[8.5px] text-amber-500/80 font-mono">
                          📅 {fast.timing.replace(/\(.*\)/, "").substring(0, 32)}
                        </span>
                      </div>
                    </div>

                    {/* Countdowns */}
                    <div>
                      {daysUntil === 0 && (
                        <span className="text-[8px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded animate-pulse shrink-0">
                          🔴 TODAY
                        </span>
                      )}
                      {daysUntil === 1 && (
                        <span className="text-[8px] bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded shrink-0">
                          🟡 TOMORROW
                        </span>
                      )}
                      {daysUntil > 1 && daysUntil <= 7 && (
                        <span className="text-[8px] bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.5 rounded shrink-0">
                          🟢 In {daysUntil} Days
                        </span>
                      )}
                      {daysUntil < 0 && (
                        <span className="text-[8px] bg-stone-500/10 text-stone-500 font-mono px-1.5 py-0.5 rounded shrink-0">
                          Observed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fasting specific rules */}
                  {fast.fastingRules && (
                    <div className="text-[8.5px] bg-[#111116] border border-white/5 p-1.5 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-slate-400 font-serif">
                        <span>🍽️ Level: <strong className="text-amber-500 uppercase">{fast.fastingRules.intensity}</strong></span>
                        <span>{fast.fastingRules.duration}</span>
                      </div>
                      <p className="text-slate-400 italic font-sans leading-tight">
                        &ldquo;{fast.fastingRules.spiritualIntakeExplanation}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Actions & Timings details */}
                  <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
                    {isSubscribed ? (
                      <div className="space-y-1.5 bg-amber-500/5 p-2 rounded-lg border border-amber-500/15">
                        <div className="flex items-center justify-between text-[8px] font-mono text-slate-300">
                          <span className="flex items-center gap-1 font-bold text-amber-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ACTIVE REMINDER
                          </span>
                          
                          <button
                            onClick={() => handleToggleSubActive(fast.id)}
                            className={`px-1 py-0.2 rounded font-bold cursor-pointer transition-all uppercase border ${
                              subObj.active 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                : "bg-stone-500/10 text-stone-400 border-stone-500/20"
                            }`}
                          >
                            {subObj.active ? "Mute alert" : "Activate"}
                          </button>
                        </div>

                        {/* Inline Alert Schedule parameters settings */}
                        <div className="grid grid-cols-2 gap-1.5 text-[8.5px] font-mono text-slate-400">
                          <div className="space-y-0.5">
                            <span>Reminder Schedule Hour:</span>
                            <input
                              type="time"
                              value={subObj.notifyTime}
                              onChange={(e) => handleUpdateSubTiming(fast.id, subObj.notifyDayMode, e.target.value)}
                              className="w-full bg-[#08080a] border border-white/10 text-white rounded px-1.5 py-0.5 font-mono cursor-pointer"
                            />
                          </div>

                          <div className="space-y-0.5">
                            <span>Warning Schedule Date:</span>
                            <select
                              value={subObj.notifyDayMode}
                              onChange={(e) => handleUpdateSubTiming(fast.id, e.target.value as SubscribedFast["notifyDayMode"], subObj.notifyTime)}
                              className="w-full bg-[#08080a] border border-white/10 text-white rounded px-1.5 py-0.5 font-mono cursor-pointer"
                            >
                              <option value="dayOf">Morning of Fast</option>
                              <option value="eveBefore">Evening Before</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[8.5px] text-slate-500 italic font-sans leading-tight">
                        Reminders are currently inactive. Click subscribe to schedule automatic alarms.
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-sans text-slate-400">
                        {fast.sourcesAndGuides?.primaryGuide || "Traditional guidance"}
                      </span>

                      <button
                        onClick={() => handleToggleSubscribedFast(fast.id)}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded cursor-pointer transition-all ${
                          isSubscribed
                            ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                            : "bg-amber-500 hover:bg-amber-400 text-black font-bold"
                        }`}
                      >
                        {isSubscribed ? "Unsubscribe" : "⏰ Subscribe Alert"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preset test chimer trigger */}
      <button
        onClick={playBowlChime}
        className="w-full text-center py-1 rounded bg-[#111116] border border-white/5 hover:border-amber-500/15 text-slate-400 hover:text-slate-300 transition-all font-mono text-[9px] cursor-pointer"
        title="Trigger manual premium synthesized Tibetan singing bowl chiming tone"
      >
        🔔 Manual Bowl Chime Test
      </button>

      {/* MODAL OVERLAY 1: STUDY SESSION ALERT */}
      {activeAlert && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0c0c10] border border-amber-500/30 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="bg-amber-500 text-black p-1.5 rounded-lg shrink-0">
                  <Clock className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-widest text-amber-400 font-extrabold block">
                    {activeAlert.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-sans block">
                    Contemplation Scripture Alarm Triggered
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveAlert(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg border border-transparent transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inspiration Content */}
            <div className="p-6 space-y-4">
              <span className="text-[9.5px] font-mono text-amber-500 uppercase font-black bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/15">
                {activeAlert.tradition} Tradition
              </span>

              <blockquote className="text-base sm:text-lg leading-relaxed text-stone-100 font-serif border-l-2 border-amber-500 pl-4 italic whitespace-pre-line">
                &ldquo;{activeAlert.body}&rdquo;
              </blockquote>

              <p className="text-xs text-slate-400 leading-normal font-sans">
                Sit standard, settle your physical breath, and let this scriptural wisdom resonate in your consciousness. Happy reading.
              </p>
            </div>

            {/* Options footer */}
            <div className="bg-[#050507] border-t border-white/5 p-4 flex items-center justify-end gap-2.5">
              {onSpeakText && (
                <button
                  onClick={() => {
                    onSpeakText(activeAlert.body, `Alarm Note`);
                    setActiveAlert(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Narrate Aloud</span>
                </button>
              )}
              <button
                onClick={() => setActiveAlert(null)}
                className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-white/5"
              >
                Mute & Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY 2: SACRED FESTIVAL FAST ALERTS DISPLAY */}
      {activeFastingAlert && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#09090b] border border-amber-500/30 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            {/* Elegant Header with Fast Icon */}
            <div className="bg-gradient-to-r from-[#2a1b14] to-transparent p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="bg-amber-500 text-black p-2 rounded-xl shrink-0 animate-pulse">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-widest text-amber-400 font-extrabold block">
                    🌅 Sacred Fast Active
                  </h4>
                  <span className="text-[9.5px] text-slate-400 font-semibold block uppercase">
                    Sacred fast day has commenced
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveFastingAlert(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In-depth content card detailing Allowed, Prohibited Foods, and Autophagy suggestions */}
            <div className="p-6 space-y-4 text-left font-sans">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white font-serif tracking-tight">{activeFastingAlert.name}</h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase bg-amber-500/10 text-amber-500 border border-amber-500/15">
                  {activeFastingAlert.religion}
                </span>
              </div>

              {/* Fast level and duration metrics */}
              <div className="grid grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 p-3 rounded-xl font-mono text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block font-light uppercase">Fast Intensity</span>
                  <strong className="text-amber-500 uppercase block mt-0.5">{activeFastingAlert.intensity}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-light uppercase">Duration Rules</span>
                  <strong className="text-white block mt-0.5">{activeFastingAlert.duration}</strong>
                </div>
              </div>

              {/* Allowed vs Prohibited grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-[10.5px] uppercase font-mono font-bold">
                    <Apple className="w-3.5 h-3.5" />
                    <span>Permitted / Allowed</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 leading-normal pl-1">
                    {activeFastingAlert.allowedFoods.map((food, i) => (
                      <li key={i}>{food}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-red-400 text-[10.5px] uppercase font-mono font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Strictly Prohibited</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 leading-normal pl-1">
                    {activeFastingAlert.prohibitedFoods.map((food, i) => (
                      <li key={i}>{food}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Spiritual significance details */}
              <div className="space-y-1 bg-black/40 border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] text-amber-500 font-mono uppercase block font-semibold">🌌 Spiritual Significance & Biology:</span>
                <p className="text-xs text-slate-200 font-serif leading-relaxed italic">
                  &ldquo;{activeFastingAlert.spiritualSignificance}&rdquo;
                </p>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Fasting allows your body to activate natural cellular autophagy and clears mental and metabolic toxins. This biological resting state is a beautiful preparation for studying scriptures.
              </p>
            </div>

            {/* Action panel */}
            <div className="bg-[#050507] border-t border-white/5 p-4 flex items-center justify-end gap-2.5">
              {onSpeakText && (
                <button
                  onClick={() => {
                    const textToVocalize = `${activeFastingAlert.name} fast from the ${activeFastingAlert.religion} tradition. Intensity: ${activeFastingAlert.intensity}. Duration: ${activeFastingAlert.duration}. Recommended foods include: ${activeFastingAlert.allowedFoods.join(", ")}. Prohibited foods include: ${activeFastingAlert.prohibitedFoods.join(", ")}. Spiritual significance: ${activeFastingAlert.spiritualSignificance}`;
                    onSpeakText(textToVocalize, `Sacred Fast Details`);
                    setActiveFastingAlert(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Read Rules Out Loud</span>
                </button>
              )}
              <button
                onClick={() => setActiveFastingAlert(null)}
                className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-white/5"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
