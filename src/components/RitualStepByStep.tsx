import React, { useState, useEffect } from "react";
import { CheckSquare, Square, Award, Clock, Sparkles, BookOpen, Undo } from "lucide-react";
import { FestivalItem } from "../festivalsData";

interface RitualStep {
  title: string;
  time?: string;
  description: string;
  category: "purification" | "vows" | "offering" | "meditation" | "conclusion";
}

interface RitualStepByStepProps {
  festival: FestivalItem;
}

// Complete pre-authored ritual database for major interfaith events
const FESTIVAL_RITUALS_DB: Record<string, RitualStep[]> = {
  "diwali": [
    { title: "Purification Snan", time: "07:00 AM", description: "Cleanse the physical body. Dress in pure, new festive attire to attract positive divine frequencies.", category: "purification" },
    { title: "Altar & Home Preparation", time: "10:00 AM", description: "Clean the home and altar space. Draw colorful Rangoli designs at the entrance to welcome prosperity and auspiciousness.", category: "purification" },
    { title: "Establish Laxmi-Ganesha Kalash", time: "05:30 PM", description: "Place a brass or copper Kalash filled with sacred water, mango leaves, and a coconut on a bed of rice grains. Situate idols of Laxmi and Ganesha.", category: "vows" },
    { title: "Shodashopachara Puja (16 Offerings)", time: "06:15 PM", description: "Offer kumkum, turmeric, fresh flowers, incense, sweet kheer, and fruits to the deities while reciting Lakshmi Ashtakam chants.", category: "offering" },
    { title: "Kindling of 108 Clay Diyas", time: "07:00 PM", description: "Fill clay lamps with pure mustard oil or cow's ghee. Light them starting from the altar and distribute them along doors, windows, and outer boundaries.", category: "offering" },
    { title: "Silent Dhyna & Aarti", time: "07:45 PM", description: "Perform the family Aarti, waving a camphor flame. Sit in silent gratitude, meditating on the inner light of spiritual awakening within.", category: "meditation" },
    { title: "Prasad Distribution", time: "08:15 PM", description: "Share sanctified sweets, dried fruits, and warm meals with family, neighbors, and the underprivileged.", category: "conclusion" }
  ],
  "mahashivratri": [
    { title: "Panchamrit Snan", time: "06:30 AM", description: "Cleanse the Shiva Lingam using pure milk, yogurt, honey, sugar, and ghee while chanting 'Om Namah Shivaya'. Flush with sacred Ganges water.", category: "purification" },
    { title: "Maha Sankalpa", time: "08:00 AM", description: "Sit facing east, hold sacred rice and water in your palm, and declare your fast intensity vow (dry fast, water-only, or partial fruit-diet).", category: "vows" },
    { title: "First Prahar Puja (Evening)", time: "06:00 PM", description: "Offer liquid cow's milk and fresh green Bilva leaves (three-leaf clusters symbolizing the Trinity and three gunas). Chant the Shiva Mahimna Stotra.", category: "offering" },
    { title: "Second Prahar Puja (Night)", time: "09:00 PM", description: "Offer thick curd (yogurt) and lotus stalks to the Shiva Lingam. Sit in motionless silent breathing meditation focusing on the third-eye chakra.", category: "meditation" },
    { title: "Third Prahar Puja (Midnight)", time: "12:00 AM", description: "Offer pure cow's ghee and black sesame seeds. Read the dynamic chapters of Shiva Purana out loud to awaken sleeping Kundalini frequencies.", category: "offering" },
    { title: "Fourth Prahar Puja (Dawn Vigil)", time: "03:00 AM", description: "Offer wild forest honey and wood-apple fruits. Chant 108 repetitions of the Maha Mrityunjaya mantra to conquer internal fear and physical lethargy.", category: "meditation" },
    { title: "Sunrise Parana", time: "06:00 AM", description: "Accept holy Charanamrit (nectar) and break the 24-hour night vigil with a simple warm satvik rice and lentil meal.", category: "conclusion" }
  ],
  "ganesha_chaturthi": [
    { title: "Prana Pratishtha Puja", time: "11:00 AM", description: "Invoke the living cosmic consciousness of Lord Ganesha into the clay idol using Vedic chants and holy water sprinkles.", category: "purification" },
    { title: "Offering of 21 Durva Grass tufts", time: "12:00 PM", description: "Offer exactly 21 blades of sacred Durva grass, which absorb and channel solar-pranic Ganesha energy to the worshiper.", category: "offering" },
    { title: "Modak Naivedya Prasadam", time: "12:30 PM", description: "Offer exactly 21 steamed modaks (Ganesha's favorite sweet representing inner sweet spiritual wisdom) on a fresh banana leaf.", category: "offering" },
    { title: "Ganesha Atharvashirsha Recitation", time: "01:00 PM", description: "Chant the Upanishadic text Ganesha Atharvashirsha to sharpen intellectual capacity and neural circuits.", category: "meditation" },
    { title: "Aarti and Camphor Dissolution", time: "07:00 PM", description: "Sing the primary Aarti, waving camphor lamps, which leaves behind no residue, reminding us of the ultimate formless nature of God.", category: "conclusion" }
  ],
  "krishna_janmashtami": [
    { title: "Pre-fast Purifying Diet", time: "Morning", description: "Consume a purely satvik, light diet before beginning the major fast, cleansing the gastrointestinal tract.", category: "purification" },
    { title: "Ashtami Vow (Sankalpa)", time: "08:00 AM", description: "Formalize your fast dedication to Lord Krishna. Meditate on His cosmic forms.", category: "vows" },
    { title: "Continuous Hare Krishna Kirtan", time: "Afternoon", description: "Sing or listen to the Maha Mantra dynamically to charge the environmental prana.", category: "meditation" },
    { title: "Midnight Abhishekam Snan", time: "11:45 PM", description: "Bathe the baby Krishna (Ladoo Gopal) idol in saffron-infused milk, yogurt, honey, ghee, and rosewater exactly at midnight.", category: "purification" },
    { title: "Maha Aarti and Shringar", time: "12:15 AM", description: "Dress the deity in vibrant yellow silk, offer fresh butter and sugarcandy (Makhan Mishri), and wave the ghee lamps.", category: "offering" }
  ],
  "ramadan": [
    { title: "Suhur (Pre-dawn Nourishment)", time: "04:00 AM", description: "Awaken early for Suhur. Eat complex grains, hydrating cucumbers, and wholesome dates. Drink abundant mineralized water.", category: "purification" },
    { title: "Declaration of Niyyah (Intention)", time: "04:30 AM", description: "Silently assert your conscious intention inside your heart to complete today's fast solely for the sake of the Almighty.", category: "vows" },
    { title: "Fajr Prayer & Early Quran Recitation", time: "05:00 AM", description: "Perform the early Fajr prayer. Sit and recite at least half a Juz (chapter) of the Holy Quran in quiet contemplation.", category: "meditation" },
    { title: "Dhuhr & Asr Mid-day Devotions", time: "01:30 PM", description: "Keep your speech pure. Avoid unnecessary words, gossip, or anger. Complete mid-day prayers in deep humility.", category: "meditation" },
    { title: "Iftar Preparation & Du'a", time: "06:15 PM", description: "Assemble dates, fresh water, fruit, and light soup. Spend the final moments before sunset in intense prayer (Du'a), as this window is highly receptive.", category: "offering" },
    { title: "Breaking the Fast (Maghrib)", time: "06:35 PM", description: "Break the day's fast exactly at sunset with odd numbers of dates (1, 3, or 5) and cool water, reciting the Sunnah breaking prayer.", category: "conclusion" },
    { title: "Tarawih Congregational Prayers", time: "08:30 PM", description: "Perform the special, lengthy nocturnal Tarawih prayers in the mosque or home sanctuary, completing entire cycles of the Holy Quran.", category: "meditation" }
  ],
  "yom_kippur": [
    { title: "Seudah Hamafseket (Pre-fast Feast)", time: "05:30 PM", description: "Eat a hearty, mild, salt-reduced meal. Drink electrolytes to nourish the nervous system for the impending 25-hour absolute dry fast.", category: "purification" },
    { title: "Blessing of children & Candle Lighting", time: "06:00 PM", description: "Parents bless children with hands on their heads. Light the sacred memorial candles (Yahrzeit) and the festival candles.", category: "vows" },
    { title: "Kol Nidre Solemn Service", time: "06:30 PM", description: "Attend the opening evening synagogue service wrapped in a white tallit. Recite the ancient Kol Nidre prayer of spiritual release.", category: "purification" },
    { title: "Shacharit & Torah Service", time: "09:00 AM", description: "Morning liturgy reading. Recite portions from Leviticus and Isaiah focusing on the absolute transformational nature of real fasting.", category: "meditation" },
    { title: "Yizkor (Ancestral Remembrance)", time: "12:00 PM", description: "Recite the highly emotional memorial prayers for deceased parents and linear ancestors, connecting current efforts to biological roots.", category: "conclusion" },
    { title: "Neilah (The Closing of the Gates)", time: "05:30 PM", description: "Stand for Neilah, the final service when the celestial gates of mercy are sealed. Pour your entire soul into the closing prayers.", category: "meditation" },
    { title: "Shofar Blast & Break-Fast", time: "06:45 PM", description: "Listen to the long, single blast of the Shofar (Teki'ah Gedolah) signaling complete absolution. Break the fast with fresh juice and warm cake.", category: "conclusion" }
  ],
  "uposatha": [
    { title: "Arising & Altar Purification", time: "06:00 AM", description: "Arise at dawn. Sweep the meditation space and light fresh jasmine incense at the altar of the Buddha.", category: "purification" },
    { title: "Taking of the Eight Precepts", time: "07:00 AM", description: "Recite the formal refuges and commit to Atha Sila, including no eating after noon, no sleeping on high beds, and absolute celibacy.", category: "vows" },
    { title: "Anapanasati Breath Meditation", time: "08:30 AM", description: "Sit in full lotus posture. Complete 45 minutes of calm, focused mindfulness of inhaling and exhaling to anchor chaotic thoughts.", category: "meditation" },
    { title: "Single Wholesome Noon-Meal", time: "11:30 AM", description: "Take a simple, nourishing plant-based meal. Mindfully chew every bite. No further solid food is consumed until tomorrow's sunrise.", category: "offering" },
    { title: "Dhamma Study & Sutta Analysis", time: "02:00 PM", description: "Read, study, and analyze primary Sutta texts (like the Satipatthana Sutta) to refine intellectual and metaphysical alignment.", category: "meditation" },
    { title: "Metta Bhavana Meditation", time: "07:00 PM", description: "Meditate on radiating limitless loving-kindness and compassion to all living beings in all cardinal directions without boundary.", category: "meditation" },
    { title: "Patimokkha Chant & Self-Reflection", time: "08:30 PM", description: "Assemble with the community/online monastics to hear Patimokkha recitals, auditing your personal ethical purity over the last fortnight.", category: "conclusion" }
  ]
};

// Fallback dynamic rituals if festival is not explicitly pre-authored
const generateGenericRituals = (fest: FestivalItem): RitualStep[] => {
  const steps: RitualStep[] = [
    { title: "Atmospheric & Altar Purification", time: "Morning", description: `Cleanse your home sanctuary. Light fresh natural incense or essential oils matching the ${fest.religion} tradition. Dress in clean, comfortable natural fibers.`, category: "purification" },
    { title: "Intentional Dedication (Sankalpa / Niyyah)", time: "Morning", description: `Sit in silence. Declare your sacred personal vows, dedicating the day's fasting energy and restrictions to self-refinement and absolute spiritual focus.`, category: "vows" },
    { title: "Sacred Text Reading & Scriptural Immersion", time: "Afternoon", description: `Read relevant passages, verses, or records from the canon associated with this day. Contemplate the historical and cosmic alignments of ${fest.name}.`, category: "meditation" }
  ];

  if (fest.fastingRules) {
    steps.push({
      title: `${fest.fastingRules.intensity.toUpperCase()} Calorie Fast Gate`,
      time: "Daylong",
      description: `Maintain the fast of ${fest.fastingRules.duration}. Stick strictly to allowed inputs: ${fest.fastingRules.allowedFoods?.join(", ") || "Nothing"}. Strictly avoid: ${fest.fastingRules.strictlyProhibited?.join(", ") || "None"}.`,
      category: "offering"
    });
  }

  // Add custom ritual elements
  if (fest.customs.length > 0) {
    steps.push({
      title: "Traditional Observance Customs",
      time: "Evening",
      description: `Engage with traditional core customs: ${fest.customs.join(", ")}. Experience these symbols as tools to channel mindfulness and somatic resonance.`,
      category: "offering"
    });
  }

  steps.push({
    title: "Conscious Conclusion & Self-Inquiry",
    time: "Sunset / Auspicious hour",
    description: `Conclude the day in quiet reflection. Absorb the physical light-headedness and metabolic rest of fasting, channeling it into profound gratitude and self-examination.`,
    category: "conclusion"
  });

  return steps;
};

export const RitualStepByStep: React.FC<RitualStepByStepProps> = ({ festival }) => {
  // Try to match exact pre-authored or generate generic
  const lookupKey = festival.id.toLowerCase().replace(/_vrat|_vows|_assembly/g, "");
  const baseSteps = FESTIVAL_RITUALS_DB[lookupKey] || FESTIVAL_RITUALS_DB[festival.id] || generateGenericRituals(festival);

  // Load check/checked state from localStorage
  const storageKey = `festival_ritual_state:${festival.id}`;
  const [checkedIndices, setCheckedIndices] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedIndices));
    } catch (e) {
      console.warn("Storage write blocked", e);
    }
  }, [checkedIndices, festival.id]);

  const toggleStep = (idx: number) => {
    if (checkedIndices.includes(idx)) {
      setCheckedIndices(prev => prev.filter(i => i !== idx));
    } else {
      setCheckedIndices(prev => [...prev, idx]);
    }
  };

  const resetAll = () => {
    setCheckedIndices([]);
  };

  const completedCount = checkedIndices.filter(idx => idx < baseSteps.length).length;
  const totalCount = baseSteps.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "purification": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "vows": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "offering": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "meditation": return "text-violet-400 bg-violet-500/10 border-violet-500/20";
      case "conclusion": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-slate-400 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#09090d] border border-white/15 space-y-5 relative overflow-hidden shadow-xl">
      {/* Glow top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600/30 via-amber-500/20 to-transparent" />

      {/* Header section with metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-0.5 px-2 rounded-full bg-violet-500/10 text-violet-400 font-mono text-[9px] tracking-widest uppercase border border-violet-500/20">
              Interactive Guide
            </span>
            <span className="flex items-center text-[10px] font-mono text-slate-500">
              <Clock className="w-3 h-3 mr-1" />
              Somatic Timing
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ritual Step-by-Step Observance</span>
          </h4>
        </div>

        {/* Progress Tracker Widget */}
        <div className="flex items-center space-x-3.5 bg-black/40 border border-white/5 p-2 px-3.5 rounded-xl">
          <div className="space-y-1 text-right">
            <span className="text-[10px] font-mono text-slate-500 block">COMPLETION</span>
            <span className="text-xs font-mono font-bold text-amber-400 block leading-none">
              {completedCount} / {totalCount} Steps ({progressPct}%)
            </span>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center relative overflow-hidden shrink-0">
            {/* Dynamic circle filling */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-600 to-indigo-500 transition-all duration-500"
              style={{ height: `${progressPct}%` }}
            />
            <span className="text-[10px] font-mono font-extrabold text-white relative z-10">
              {progressPct}%
            </span>
          </div>
        </div>
      </div>

      {/* List of interactive items */}
      <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar">
        {baseSteps.map((step, idx) => {
          const isCompleted = checkedIndices.includes(idx);
          return (
            <div 
              key={idx}
              className={`p-3.5 rounded-xl transition-all duration-300 border flex gap-3.5 cursor-pointer select-none group relative ${
                isCompleted 
                  ? "bg-[#0c0f17] border-indigo-500/30 text-slate-400" 
                  : "bg-black/25 border-white/5 hover:border-white/15 text-slate-200"
              }`}
              onClick={() => toggleStep(idx)}
            >
              {/* Checkbox button box */}
              <div className="shrink-0 pt-0.5">
                {isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-indigo-400 group-hover:scale-105 transition-transform" />
                ) : (
                  <Square className="w-5 h-5 text-slate-600 group-hover:text-amber-400 group-hover:scale-105 transition-all" />
                )}
              </div>

              {/* Step Text Details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className={`text-xs sm:text-sm font-sans font-semibold transition-colors ${
                    isCompleted ? "text-slate-500 line-through font-normal" : "text-white"
                  }`}>
                    {step.title}
                  </h5>
                  
                  {/* Category Pill */}
                  <div className="flex items-center space-x-1.5 font-mono text-[9px]">
                    {step.time && (
                      <span className="text-slate-500 font-mono flex items-center">
                        <Clock className="w-2.5 h-2.5 mr-0.5" />
                        {step.time}
                      </span>
                    )}
                    <span className={`px-1.5 py-0.2 rounded uppercase tracking-wider border font-bold ${getCategoryColor(step.category)}`}>
                      {step.category}
                    </span>
                  </div>
                </div>
                
                <p className={`text-[11px] sm:text-xs leading-relaxed font-serif ${
                  isCompleted ? "text-slate-600" : "text-slate-350"
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-slate-600" />
          <span>Keep mental presence active during each step.</span>
        </span>
        
        {checkedIndices.length > 0 && (
          <button 
            onClick={resetAll}
            className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/5"
          >
            <Undo className="w-3 h-3" />
            <span>Reset Progress</span>
          </button>
        )}
      </div>

      {/* Completion Trophy Announcement if 100% complete */}
      {progressPct === 100 && totalCount > 0 && (
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-3.5 animate-pulse">
          <Award className="w-6 h-6 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block">Observance Rituals Completed!</span>
            <span className="text-slate-400">May this traditional discipline guide your intellect, calm your heart, and cleanse your physical container.</span>
          </div>
        </div>
      )}
    </div>
  );
};
