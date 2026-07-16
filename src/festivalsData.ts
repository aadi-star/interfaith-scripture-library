import { ReligionType } from "./types";

export interface FestivalItem {
  id: string;
  name: string;
  transliteration?: string;
  religion: ReligionType;
  level: "major" | "minor";
  type: "celebration" | "fasting" | "vigil" | "remembrance";
  timing: string; // e.g., "Kartik Amavasya", "Ramadan (1-30)", "10 Tishrei"
  calendarSystem: string; // e.g., "Lunisolar - Purnimanta", "Islamic Lunar (Hijri)", "Gregorian", "Hebrew"
  description: string;
  customs: string[]; // e.g., ["Lighting Diya", "Clay lamps", "Laxmi Puja", "Sweets"]
  spiritualSignificance: string;
  fastingRules?: {
    intensity: "waterless" | "water-only" | "partial-diet" | "abstinence" | "flexible";
    duration: string; // e.g., "Sunrise to Sunset", "25 hours", "24 hours", "None"
    allowedFoods?: string[]; // e.g. ["Fruits", "Milk products", "Buckwheat (Kuttu)", "Sabudana"]
    strictlyProhibited?: string[]; // e.g. ["All grains", "Salt", "Meats", "Water", "Alcohol", "Leavened bread (Chametz)"]
    spiritualIntakeExplanation: string;
  };
  sourcesAndGuides?: {
    primaryGuide: string; // e.g., "Drik Panchang Aligned", "Islamic Fiqh Jurisprudence", "Catholic Liturgical Calendar"
    astronomyCalculations: string; // description of solar-lunar degree coordinates used
  };
}

export interface MoonPhaseDetails {
  age: number;
  percentage: number;
  name: string;
  tithiIndex: number;
  tithiDisplayNum: number;
  tithiName: string;
  paksha: string;
  litPercent: number;
  hijriAge: number;
  HijriSighting: string;
  hebrewAge: number;
}

export function calculateMoonPhaseDetails(date: Date): MoonPhaseDetails {
  // Astronomical reference: New Moon on January 6, 2000 at 18:14:00 UTC
  const refDate = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const synodicMonth = 29.530588853; // synodic cycle length
  
  const diffMs = date.getTime() - refDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  let age = diffDays % synodicMonth;
  if (age < 0) age += synodicMonth;
  
  const percentage = age / synodicMonth;
  
  let name = "New Moon";
  let tithiName = "Amavasya";
  let paksha = "Krishna Paksha";
  
  const tithiRaw = percentage * 30;
  const tithiIndex = Math.floor(tithiRaw) + 1; // 1 to 30
  let tithiDisplayNum = tithiIndex;
  
  if (tithiIndex <= 15) {
    paksha = "Shukla Paksha (Bright)";
    tithiDisplayNum = tithiIndex; // 1 to 15
    if (tithiIndex === 1) tithiName = "Pratipada (1st)";
    else if (tithiIndex === 2) tithiName = "Dwitiya (2nd)";
    else if (tithiIndex === 3) tithiName = "Tritiya (3rd)";
    else if (tithiIndex === 4) tithiName = "Chaturthi (4th)";
    else if (tithiIndex === 5) tithiName = "Panchami (5th)";
    else if (tithiIndex === 8) tithiName = "Ashtami (8th)";
    else if (tithiIndex === 11) tithiName = "Ekadashi (11th)";
    else if (tithiIndex === 14) tithiName = "Chaturdashi (14th)";
    else if (tithiIndex === 15) tithiName = "Purnima (Full Moon)";
    else tithiName = `Shukla ${tithiIndex}`;
  } else {
    paksha = "Krishna Paksha (Dark)";
    tithiDisplayNum = tithiIndex - 15; // 1 to 15
    if (tithiIndex === 16) tithiName = "Krishna Pratipada (1st)";
    else if (tithiIndex === 22) tithiName = "Krishna Ashtami (8th)";
    else if (tithiIndex === 26) tithiName = "Krishna Ekadashi (11th)";
    else if (tithiIndex === 29) tithiName = "Shivratri Chaturdashi (14th)";
    else if (tithiIndex === 30) tithiName = "Amavasya (New Moon)";
    else tithiName = `Krishna ${tithiDisplayNum}`;
  }
  
  const litPercent = Math.round((1 - Math.cos(percentage * 2 * Math.PI)) * 50);
  
  if (percentage < 0.03 || percentage > 0.97) {
    name = "New Moon (Amavasya)";
  } else if (percentage >= 0.03 && percentage < 0.22) {
    name = "Waxing Crescent (Shukla Tithis)";
  } else if (percentage >= 0.22 && percentage < 0.28) {
    name = "First Quarter Moon";
  } else if (percentage >= 0.28 && percentage < 0.47) {
    name = "Waxing Gibbous Moon";
  } else if (percentage >= 0.47 && percentage < 0.53) {
    name = "Full Moon (Purnima)";
  } else if (percentage >= 0.53 && percentage < 0.72) {
    name = "Waning Gibbous Moon";
  } else if (percentage >= 0.72 && percentage < 0.78) {
    name = "Third Quarter Moon";
  } else {
    name = "Waning Crescent (Krishna Tithis)";
  }
  
  const hijriAge = Math.floor(percentage * 29.53) + 1;
  let HijriSighting = "Normal crescent phase";
  if (hijriAge === 1 || hijriAge === 2) HijriSighting = "Hilal (Primary crescent - starts Hijri month)";
  else if (hijriAge === 14 || hijriAge === 15) HijriSighting = "Badr (Fullness)";
  else if (hijriAge >= 28) HijriSighting = "Mahaq (Eclipse-like disappearance)";
  
  const hebrewAge = Math.floor(percentage * 29.53) + 1;
  
  return {
    age,
    percentage,
    name,
    tithiIndex,
    tithiDisplayNum,
    tithiName,
    paksha,
    litPercent,
    hijriAge,
    HijriSighting,
    hebrewAge
  };
}

export function calculateMoonPhaseDetailsFromAge(age: number): MoonPhaseDetails {
  const percentage = age / 29.530588853;
  
  let name = "New Moon";
  let tithiName = "Amavasya";
  let paksha = "Krishna Paksha";
  
  const tithiRaw = percentage * 30;
  const tithiIndex = Math.max(1, Math.min(30, Math.floor(tithiRaw) + 1)); // 1 to 30
  let tithiDisplayNum = tithiIndex;

  const VEDIC_TITHI_NAMES = [
    "", // 0 index unused
    "Pratipada",
    "Dwitiya",
    "Tritiya",
    "Chaturthi",
    "Panchami",
    "Shashti",
    "Saptami",
    "Ashtami",
    "Navami",
    "Dashami",
    "Ekadashi",
    "Dwadashi",
    "Trayodashi",
    "Chaturdashi",
    "Purnima" // 15
  ];
  
  if (tithiIndex <= 15) {
    paksha = "Shukla Paksha (Bright Fortnight)";
    tithiDisplayNum = tithiIndex; // 1 to 15
    const baseName = VEDIC_TITHI_NAMES[tithiIndex];
    if (tithiIndex === 15) {
      tithiName = "Purnima (Full Moon)";
    } else {
      tithiName = `Shukla ${baseName} (${tithiIndex}${getOrdinalSuffix(tithiIndex)})`;
    }
  } else {
    paksha = "Krishna Paksha (Dark Fortnight)";
    tithiDisplayNum = tithiIndex - 15; // 1 to 15
    const baseName = VEDIC_TITHI_NAMES[tithiDisplayNum];
    if (tithiIndex === 30 || tithiDisplayNum === 15) {
      tithiName = "Amavasya (New Moon)";
    } else {
      tithiName = `Krishna ${baseName} (${tithiDisplayNum}${getOrdinalSuffix(tithiDisplayNum)})`;
    }
  }
  
  const litPercent = Math.round((1 - Math.cos(percentage * 2 * Math.PI)) * 50);
  
  if (percentage < 0.03 || percentage > 0.97) {
    name = "New Moon (Amavasya)";
  } else if (percentage >= 0.03 && percentage < 0.22) {
    name = "Waxing Crescent (Shukla Tithis)";
  } else if (percentage >= 0.22 && percentage < 0.28) {
    name = "First Quarter Moon";
  } else if (percentage >= 0.28 && percentage < 0.47) {
    name = "Waxing Gibbous Moon";
  } else if (percentage >= 0.47 && percentage < 0.53) {
    name = "Full Moon (Purnima)";
  } else if (percentage >= 0.53 && percentage < 0.72) {
    name = "Waning Gibbous Moon";
  } else if (percentage >= 0.72 && percentage < 0.78) {
    name = "Third Quarter Moon";
  } else {
    name = "Waning Crescent (Krishna Tithis)";
  }
  
  const hijriAge = Math.max(1, Math.min(30, Math.floor(percentage * 29.53) + 1));
  let HijriSighting = "Normal crescent phase";
  if (hijriAge === 1 || hijriAge === 2) HijriSighting = "Hilal (New Crescent - starts Hijri month!)";
  else if (hijriAge === 14 || hijriAge === 15) HijriSighting = "Badr (Full brightness)";
  else if (hijriAge >= 28) HijriSighting = "Mahaq (Hidden Moon phase)";
  
  const hebrewAge = Math.max(1, Math.min(30, Math.floor(percentage * 29.53) + 1));
  
  return {
    age,
    percentage,
    name,
    tithiIndex,
    tithiDisplayNum,
    tithiName,
    paksha,
    litPercent,
    hijriAge,
    HijriSighting,
    hebrewAge
  };
}

function getOrdinalSuffix(num: number): string {
  if (num === 1) return "st";
  if (num === 2) return "nd";
  if (num === 3) return "rd";
  return "th";
}

export const RELIGIOUS_CALENDARS_INFO = [
  {
    religion: "hinduism" as ReligionType,
    name: "Hindu Shalivahana Shaka & Vikrama Samvat Calendars",
    description: "Lunisolar calendar based on lunar phases (Tithis), solar entry (Sankranti), and constellations (Nakshatras). Calculated using ancient treatises (Surya Siddhanta) and modern local alignments found in traditional almanacs (Panchangs) like Drik Panchang.",
    keyComputation: "A Tithi represents the precise period in which the angular distance between the Moon and the Sun increases by 12 degrees. Days are divided into 30 Tithis per month."
  },
  {
    religion: "islam" as ReligionType,
    name: "Islamic Hijri Calendar (Taqwim)",
    description: "Strictly observational and astronomical lunar calendar tracking the visual sighting of the crescent moon (Hilal). It drifts approximately 11 days backward relative to the Gregorian solar calendar yearly.",
    keyComputation: "Months last exactly 29 or 30 days pending official moon sighting testimonies, keeping fast schedules in rotation across all four natural seasons over a 33-year cycle."
  },
  {
    religion: "christianity" as ReligionType,
    name: "Gregorian & Julian Liturgical Cycles",
    description: "Solar calendar containing fixed-date feasts (like Christmas) alongside variable lunar computed feasts (like Easter and Lent) calculated via the Computus formula.",
    keyComputation: "Easter is universally computed as the first Sunday after the first ecclesiastical full moon occurring on or after the vernal equinox (March 21)."
  },
  {
    religion: "judaism" as ReligionType,
    name: "Hebrew Lunisolar Metonic Calendar",
    description: "Highly sophisticated lunisolar astronomical calendar that balances lunar months with solar agricultural cycles using a 19-year Metonic cycle (including 7 leap months called Adar II).",
    keyComputation: "Ensures seasonal holidays (like Passover in spring) never drift indefinitely, aligning with scripture demanding agriculture of biblical harvest months."
  },
  {
    religion: "jainism" as ReligionType,
    name: "Jain Vira Nirvana Samvat Calendar",
    description: "Used to determine Paryushana, Das Lakshana, and fasting days. Aligns structurally with the Indian national lunisolar grid but centered historically on Lord Mahavira's liberation (Nirvana) in 527 BCE.",
    keyComputation: "Fasting dates are closely connected to the lunar fortnights (Ashtami - 8th, and Chaturdashi - 14th day of moon phases)."
  },
  {
    religion: "buddhism" as ReligionType,
    name: "Buddhist Lunar Calendar (Sasana)",
    description: "Used in Theravada, Mahayana, and Tibetan schools. Synchronized with the phases of the moon, specifically celebrating holy assemblies and retreats during full moons.",
    keyComputation: "Days are calculated as Uposatha days (the four monthly phases: Full Moon, New Moon, and the two Quarter Moons), indicating strict monastic study and laity fasting periods."
  }
];

export const SACRED_FESTIVALS_DATA: FestivalItem[] = [
  // HINDUISM
  {
    id: "diwali",
    name: "Diwali (Deepavali)",
    transliteration: "दीपावली",
    religion: "hinduism",
    level: "major",
    type: "celebration",
    timing: "Kartika Amavasya (New Moon in October/November)",
    calendarSystem: "Lunisolar - Amanta & Purnimanta Panchangs",
    description: "The magnificent Hindu festival of lights symbolizing the ultimate triumph of spiritual light over darkness, wisdom over ignorance, and righteous truth over evil. Commemorates Lord Rama's return to Ayodhya and Goddess Lakshmi's birth during Samudra Manthan.",
    customs: ["Lighting hundreds of oil-filled clay lamps (diyas)", "Auspicious Rangoli floor artwork", "Goddess Lakshmi worship rituals", "Exchanging premium sweets and gifts"],
    spiritualSignificance: "Illumine the inner sanctuary of the heart with loving kindness. Kindle the spark of divinity within and dissolve negative tendencies.",
    fastingRules: {
      intensity: "partial-diet",
      duration: "Daytime until evening Lakshmi Puja",
      allowedFoods: ["Milk based treats", "Fresh fruits", "Vrat flour savories"],
      strictlyProhibited: ["Grains", "Garlic and onion (Tamasic foods)", "Non-vegetarian dishes", "Alcohol"],
      spiritualIntakeExplanation: "Pradosh time fasting purifies physical tissues, tuning biological vibrations to invite abundance, peace, and cognitive stability."
    },
    sourcesAndGuides: {
      primaryGuide: "Drik Panchang Aligned - Calculated when Amavasya Tithi prevails during Pradosh Vyapini timings.",
      astronomyCalculations: "Moon is at 0 degrees angular separation from Sun in the zodiac house of Libra (Tula Rashi)."
    }
  },
  {
    id: "maha-shivratri",
    name: "Maha Shivratri",
    transliteration: "महाशिवरात्रि",
    religion: "hinduism",
    level: "major",
    type: "vigil",
    timing: "Phalguna Krishna Chaturdashi (February/March)",
    calendarSystem: "Lunisolar - Traditional Lunar Months",
    description: "The Great Night of Shiva. Commemorates the cosmic dance of creation, preservation, and dissolution (Tandava) and Shiva's union with Goddess Parwati. Devotees participate in a powerful overnight vigil with continuous chanting and offerings.",
    customs: ["Overnight temple sensory chanting ('Om Namah Shivaya')", "Pouring milk, honey, bael leaves, and water on the Shiva Lingam", "Sitting in stationary meditation circles"],
    spiritualSignificance: "Represents transcending the physical desires (Kama) and worldly ties (Moha) to submerge the individual ego into pure consciousness (Shiva).",
    fastingRules: {
      intensity: "waterless",
      duration: "36 hours (From sunrise of Chaturdashi until sunrise of Amavasya)",
      allowedFoods: ["Boiled water (if partial)", "Fresh raw fruits (if partial)", "Bael-infused liquids"],
      strictlyProhibited: ["All rice and wheat grains", "Lentils", "Spiced items", "Salt"],
      spiritualIntakeExplanation: "The combination of strict fasting (Upavasa) and staying awake (Jagran) breaks down physical inertia (Tamas) and converts standard energy into spiritual ojas."
    },
    sourcesAndGuides: {
      primaryGuide: "Drik Panchang Aligned - Calculated when Chaturdashi Tithi overlaps with Nishita Kaal (midnight temple devotion cycle).",
      astronomyCalculations: "Sun enters Aquarius (Kumbha) with moon in Capricorn/Aquarius transitions."
    }
  },
  {
    id: "karwa-chauth",
    name: "Karwa Chauth",
    transliteration: "करवा चौथ",
    religion: "hinduism",
    level: "minor",
    type: "fasting",
    timing: "Kartika Krishna Chaturthi (October)",
    calendarSystem: "Lunisolar - North Indian Purnimanta Panchang",
    description: "An intensive single-day fasting ritual observed with unmatched devotion by married Hindu women for the safety, health, and academic prosperity of their husbands. It concludes only upon sighting the physical moon in the night sky.",
    customs: ["Receiving early dawn Pre-Fast meal (Sargi)", "Dressing in bridal red refinery", "Worshipping Shiva, Parvati, and Kartikeya", "Filtering the physical moon through a sieve"],
    spiritualSignificance: "Symbolizes absolute loyalty, cosmic sacrifice, and the interactive energetic bonding of husband and wife on a higher planes of conscious shared existence.",
    fastingRules: {
      intensity: "waterless",
      duration: "From sunrise until moonrise sighting (approximately 14-16 hours)",
      allowedFoods: ["Sargi fruits/dry fruits at 4:30 AM before sunrise", "Pure sacred water offered by husband after moon rise"],
      strictlyProhibited: ["Every drop of water during daytime", "All grains", "Any food particles"],
      spiritualIntakeExplanation: "A rigorous Nirjala (waterless) standard that strengthens will-power, physical endurance, and redirects sensory focus inward."
    },
    sourcesAndGuides: {
      primaryGuide: "Drik Panchang Aligned - Synchronized precisely when Chaturthi Tithi is active in the evening hours.",
      astronomyCalculations: "Moon arises in the Rohini or Krittika Nakshatras."
    }
  },
  {
    id: "ekadashi-vrat",
    name: "Ekadashi Vrat (Bi-weekly Lunar Fasts)",
    transliteration: "एकादशी व्रत",
    religion: "hinduism",
    level: "minor",
    type: "fasting",
    timing: "11th day of both Bright (Shukla) & Dark (Krishna) Lunar Fortnights",
    calendarSystem: "Lunisolar - Bi-weekly Tithi system",
    description: "A recurring inter-month fasting day occurring twice per lunar loop, highly revered by Vaishnavas and yogis. These 24 Ekadashis per year (such as Nirjala, Devutthana, and Putrada) clear the subtle channels (nadis) of the biological system.",
    customs: ["Reciting scripture studies (Bhagavad Gita)", "Chanting Maha-Mantra", "Giving charities and grains to the needy"],
    spiritualSignificance: "An ancient biological detox alignment. Cleanses planetary gravitational pull effects on bodily fluids, allowing deep meditative alignment.",
    fastingRules: {
      intensity: "partial-diet",
      duration: "24 hours (From Sunrise of Ekadashi Tithi until Dwadashi Hari Vasara exclusion)",
      allowedFoods: ["Root vegetables (potatoes, sweet potatoes)", "Buckwheat (Kuttu)", "Waterchestnut flour (Singhara)", "Bananas", "Milk & Yogurt"],
      strictlyProhibited: ["All rice", "Wheat", "Lentils", "Beans", "Mustard seeds", "Asafetida (Hing)"],
      spiritualIntakeExplanation: "Grains accumulate dense psychological impressions (karma) on this celestial alignment; abstaining lightens physical and astral heavy vibrations."
    },
    sourcesAndGuides: {
      primaryGuide: "Drik Panchang and Smartha/Vaishnava rules. Never break before Arunodaya timings.",
      astronomyCalculations: "Angle of Moon separation is precisely 120-132 degrees (Bright phase) or 300-312 degrees (Dark phase) from the Sun."
    }
  },
  {
    id: "janmashtami",
    name: "Krishna Janmashtami",
    transliteration: "कृष्ण जन्माष्टमी",
    religion: "hinduism",
    level: "major",
    type: "celebration",
    timing: "Bhadrapada Krishna Ashtami (August/September)",
    calendarSystem: "Lunisolar - Lunar Month cycle",
    description: "The joyful celebration of the divine descent of Lord Krishna, the eighth avatar of Vishnu. Celebrated worldwide with devotional singing, dancing, the swinging of baby Krishna's cradles (Jhulan), and midnight birth chants.",
    customs: ["Dahi Handi human pyramids breaking buttermilk pots", "Decorating elegant baby Krishna idols", "Singing sweet Krishna continuous bhajans"],
    spiritualSignificance: "Awakening playfulness (Lila), pure divine love (Bhakti), and natural non-attachment as declared in the Bhagavad Gita.",
    fastingRules: {
      intensity: "partial-diet",
      duration: "Sunrise until midnight (Lord Krishna's birth moment)",
      allowedFoods: ["Phalahar (fruits, nuts, sago)", "Charnamrit (yogurt and honey mixture)", "Devotional milk drinks"],
      strictlyProhibited: ["Grains", "Garlic", "Non-vegetarian dishes"],
      spiritualIntakeExplanation: "Helps to establish self-restraint and mental concentration, channeling spiritual energies to receive midnight descent blessings."
    },
    sourcesAndGuides: {
      primaryGuide: "Drik Panchang - Ashtami Tithi and Rohini Nakshatra overlap calculation during midnight.",
      astronomyCalculations: "Moon is positioned in Taurus (Vrishabha) closest to Rohini constellation."
    }
  },

  // ISLAM
  {
    id: "ramadan-sawm",
    name: "Ramadan sawm (Holy Fasting Month)",
    transliteration: "صوم رمضان",
    religion: "islam",
    level: "major",
    type: "fasting",
    timing: "Lailatul Qadr-containing 9th month of Hijri Calendar",
    calendarSystem: "Islamic Lunar Astronomical Sighting",
    description: "The most sacred month in Islam, dedicated to spiritual introspection, prayers, communal bonding, charitableness, and mandatory fasting (Sawm) from dawn (Fajr) to sunset (Maghrib). It commemorates the initial descent of the Holy Qur'an.",
    customs: ["Predawn robust meal (Suhoor)", "Breaking fast with premium dates (Iftar)", "Reciting the complete Qur'an", "Special nightly prayers (Tarawih)"],
    spiritualSignificance: "Represents absolute submission (Taqwa), purification of the soul, learning empathy for the impoverished, and cultivating extreme self-control.",
    fastingRules: {
      intensity: "waterless",
      duration: "From Fajr (true dawn) call of prayer until Maghrib (sunset) - about 12-18 hours depending on location",
      allowedFoods: ["Pure water and nutritious dates (highly recommended for post-sunset Iftar)", "Balanced halal grains and poultry during nocturnal windows"],
      strictlyProhibited: ["Water and beverages during daytime", "Any physical food intake", "Smoking", "Gossiping", "Engaging in intimate relations during fasting hours"],
      spiritualIntakeExplanation: "Teaches self-control and forces the body to feed on stored reserves, fostering full physical cell autophagy and spiritual purification."
    },
    sourcesAndGuides: {
      primaryGuide: "Islamic Fiqh Jurisprudence of Moon Sightings & Local Prayer calendars.",
      astronomyCalculations: "Determined strictly by visual verification of the Waxing Crescent Moon (Hilal) marking Ramadan 1st."
    }
  },
  {
    id: "eid-al-fitr",
    name: "Eid al-Fitr",
    transliteration: "عيد الفطر",
    religion: "islam",
    level: "major",
    type: "celebration",
    timing: "1st of Shawwal (Month after Ramadan)",
    calendarSystem: "Islamic Lunar Astronomical Sighting",
    description: "The blissful Festival of Breaking the Fast. It marks the successful completion of the month-long spiritual training camp of Ramadan. Devotees gather in vast open grounds for special morning prayers, hug in brotherhood, and celebrate.",
    customs: ["Delivering religious wealth-charity (Zakat al-Fitr) to poor before prayers", "Feasting on sweet milk vermicelli (Sheer Khurma)", "Wearing new elegant clothes"],
    spiritualSignificance: "A celebration of spiritual victory, peace, reconciliation, forgiveness, and immense communal solidarity.",
    fastingRules: {
      intensity: "flexible",
      duration: "Fasting on this specific day is strictly FORBIDDEN (Haram) in Islamic Law",
      allowedFoods: ["Abundant wholesome foods, sweets, and non-alcoholic drinks"],
      strictlyProhibited: ["Observing any fast on the Eid day"],
      spiritualIntakeExplanation: "The prohibition of fasting on Eid symbolises the total joy of receiving Allah's hospitality after a month of sustained devotion."
    },
    sourcesAndGuides: {
      primaryGuide: "Official Shariah Scholars committees confirming Shawwal 1st Moon rise.",
      astronomyCalculations: "Sighting of the subsequent Hilal after Ramadan conclusion."
    }
  },
  {
    id: "ashura-fast",
    name: "Day of Ashura (Muharram Fast)",
    transliteration: "عاشوراء",
    religion: "islam",
    level: "minor",
    type: "remembrance",
    timing: "10th Day of Muharram (1st Islamic month)",
    calendarSystem: "Islamic Lunar Astronomical Sighting",
    description: "Highly revered historical day. Commemorates Prophet Moses (Musa) parting the Red Sea and liberating the Israelites. In Shia Islam, it also marks the profound martyrdom of Imam Hussain (grandson of Prophet Muhammad) at the Battle of Karbala.",
    customs: ["Reflective study gatherings", "Donating blood and providing charity", "Fasting to expiate sins of the previous year"],
    spiritualSignificance: "Sticking firm to justice against oppression, finding ultimate courage in faith, and expressing gratitude for historic divine deliverance.",
    fastingRules: {
      intensity: "partial-diet",
      duration: "Dawn until Sunset (Fasting the 9th and 10th, or 10th and 11th together is recommended)",
      allowedFoods: ["Water and dates for Iftar"],
      strictlyProhibited: ["Foods during daylight hours"],
      spiritualIntakeExplanation: "Sunni Muslims observe it with fasting as an act of gratitude; Shia Muslims often observe symbolic grief abstention (Faqa) until late afternoon."
    },
    sourcesAndGuides: {
      primaryGuide: "Sahih al-Bukhari & Shia Liturgical records.",
      astronomyCalculations: "Lunar calculation relative to Islamic New Year."
    }
  },

  // CHRISTIANITY
  {
    id: "good-friday-lent",
    name: "Good Friday & Holy Week Lenten Fast",
    transliteration: "Good Friday Lent",
    religion: "christianity",
    level: "major",
    type: "remembrance",
    timing: "Friday preceding Easter Sunday (March/April)",
    calendarSystem: "Gregorian Solar / Eastern Julian Ecclesiastical Lunar",
    description: "A deeply solemn day of mourning, prayer, and penance commemorating the crucifixion and death of Jesus Christ on the cross at Calvary. Part of Holy Week and the broader 40-day Lenten season of reflection.",
    customs: ["Walking the Stations of the Cross", "Venerating the wooden Holy Cross", "Wearing dark reflective clothes", "Keeping absolute silence between noon and 3:00 PM"],
    spiritualSignificance: "Reflecting on Jesus' sacrifice to redeem humanity, contemplating suffering, and dying to one's personal selfish instincts to born anew.",
    fastingRules: {
      intensity: "partial-diet",
      duration: "Complete day with restriction on full meals (One full meal, two smaller snacks, total abstinence from meat)",
      allowedFoods: ["Fish", "Vegetables", "Legumes", "Nuts", "Plain water"],
      strictlyProhibited: ["All avian and warm-blooded mammal meats", "Overindulging in rich foods", "Sweets"],
      spiritualIntakeExplanation: "Abstaining from dense red meat honors the physical flesh sacrificed by Jesus, slowing down gastric metabolism to keep the mind focused on prayer."
    },
    sourcesAndGuides: {
      primaryGuide: "Catholic Code of Canon Law (Canons 1250-1253) / Orthodoxy Liturgical Fasting.",
      astronomyCalculations: "Linked directly to the Easter Computus calculation (Passover-based lunar calculations)."
    }
  },
  {
    id: "lent-season",
    name: "The Season of Lent (40-Day Fast)",
    transliteration: "Lent",
    religion: "christianity",
    level: "major",
    type: "fasting",
    timing: "40 days leading to Easter, starting Ash Wednesday",
    calendarSystem: "Gregorian Grid with Solilunar adjustment",
    description: "The premier penitential season of 40 days resembling Christ's fasting in the Judean wilderness. Devotees focus intensely on prayer (conversing with God), fasting (self-denial), and almsgiving (sacrificing wealth for the poor).",
    customs: ["Signing of the forehead with grey ash", "Giving up a beloved luxury (e.g., sugar, secular media)", "Attending weekly Friday fish fry dinners"],
    spiritualSignificance: "Repentance, systemic spiritual rewiring, cleaning psychological debt, and aligning with the life of Christ before the Resurrection.",
    fastingRules: {
      intensity: "abstinence",
      duration: "40 Days (excluding Sundays, which are weekly celebrations of the resurrection)",
      allowedFoods: ["Plant-based whole grains", "Herbs and pulses", "Seafood (varies)"],
      strictlyProhibited: ["Meats (on fast days & Fridays)", "Selected sweet treats", "Unnecessary material luxuries"],
      spiritualIntakeExplanation: "Disciplines the biological appetite, demonstrating that 'man does not live by bread alone, but by every word that proceedeth out of the mouth of God.'"
    },
    sourcesAndGuides: {
      primaryGuide: "Western Catholic Lent & Eastern Orthodox Great Lent (Great Fast).",
      astronomyCalculations: "Determined backward from Easter Sunday which tracks lunar tides."
    }
  },

  // JUDAISM
  {
    id: "yom-kippur",
    name: "Yom Kippur (Day of Atonement)",
    transliteration: "יום כיפור",
    religion: "judaism",
    level: "major",
    type: "fasting",
    timing: "10th Day of Tishrei (September/October)",
    calendarSystem: "Hebrew Lunisolar Calendar",
    description: "The absolute holiest and most solemn day of the Jewish year. It is a day dedicated entirely to expiation, soul-searching, and ultimate repentance (Teshuvah) to reconcile relationships with God and fellow humans.",
    customs: ["Wearing white clothing (resembling angels/purity)", "Chanting the Kol Nidre prayer", "Continuous prayer at synagogue", "Blowing the Shofar (ram's horn) at fast's end"],
    spiritualSignificance: "A total suspension of biological earthly desires to elevate human consciousness to the angelic realm. Cleansing all transgressions.",
    fastingRules: {
      intensity: "waterless",
      duration: "25 continuous hours (From sunset before Yom Kippur until nightfall on Yom Kippur)",
      allowedFoods: ["Strictly NO food or liquid allowed", "Medicinal drops only under severe clinical emergencies"],
      strictlyProhibited: ["Every single drop of water", "All foods", "Wearing leather leather shoes (sign of comfort)", "Bathing or washing body parts for luxury", "Using perfumes or scented oils"],
      spiritualIntakeExplanation: "A total physical sensory detox that humbles the bodily systems before the divine presence, showing that our ultimate sustenance originates from spirit."
    },
    sourcesAndGuides: {
      primaryGuide: "Halakha - Biblical Commandment in Leviticus 23:27 ('Afflict your souls').",
      astronomyCalculations: "Set on the tenth day of Tishrei which is aligned with the Hebrew Metonic lunar grid."
    }
  },
  {
    id: "pesach",
    name: "Passover (Pesach)",
    transliteration: "פסח",
    religion: "judaism",
    level: "major",
    type: "celebration",
    timing: "15th of Nisan (March/April)",
    calendarSystem: "Hebrew Lunisolar Calendar",
    description: "A major festival celebrating the liberation of the Israelites from Egyptian slavery under Pharaoh. Highlighting the 'passing over' of Hebrew households by the messenger of death, and the birth of Hebrew freedom.",
    customs: ["Removing all leavened bread (Chametz) from the home", "Auspicious Seder symbolic dinner", "Eating Matzo (unleavened flatbread)", "Reading the Passover Haggadah out loud"],
    spiritualSignificance: "Breaking away from physical and mental slavery; finding courage to leave comfort zones; recognizing divine miracles in history.",
    fastingRules: {
      intensity: "abstinence",
      duration: "8 Days of strict dietary rules",
      allowedFoods: ["Matzah (flat waterless bread)", "Bitter herbs", "Halakhic Kosher Passover certified foods"],
      strictlyProhibited: ["All Chametz: Wheat, barley, rye, oats, or spelt that has risen", "Any processed foods with leavening agents"],
      spiritualIntakeExplanation: "Eating humble unleavened bread represents spiritual humility ('the bread of affliction') and leaving egotistic inflation behind."
    },
    sourcesAndGuides: {
      primaryGuide: "Biblical Torah specifications & Rabbinical Kosher guidelines.",
      astronomyCalculations: "Nisan is calculated as the first month of spring when full moon occurs."
    }
  },
  {
    id: "tisha-bav",
    name: "Tisha B'Av",
    transliteration: "תשעה באב",
    religion: "judaism",
    level: "minor",
    type: "remembrance",
    timing: "9th of the Hebrew Month of Av (July/August)",
    calendarSystem: "Hebrew Lunisolar Calendar",
    description: "An annual fast day in Judaism that mourns the destruction of both the First Temple by the Babylonians and the Second Temple by the Roman Empire in Jerusalem. A day characterized by genuine communal sorrow.",
    customs: ["Sitting on low mourning stools", "Reading the Book of Lamentations (Eicha) in dim light", "Refraining from greetings or smiles"],
    spiritualSignificance: "Recognizing that cosmic exile and suffering result from groundless hatred and moral decline; praying for rebuilding and global peace.",
    fastingRules: {
      intensity: "waterless",
      duration: "25 continuous hours (From sunset to the next star sighting)",
      allowedFoods: ["None during fast windows"],
      strictlyProhibited: ["All foods and liquids", "Bathing", "Marital relations", "Applying skin lotions"],
      spiritualIntakeExplanation: "A full dry fast modeled on Yom Kippur to experience the physical shock and humility of loss, allowing hearts to mend and reform."
    },
    sourcesAndGuides: {
      primaryGuide: "Mishnah Taanit records & Rabbinical consensus.",
      astronomyCalculations: "Corresponding to summer heat zenith in the Middle East."
    }
  },

  // JAINISM
  {
    id: "paryushana-parva",
    name: "Paryushana Parva (8-Day Fasting cycle)",
    transliteration: "पर्युषण पर्व",
    religion: "jainism",
    level: "major",
    type: "fasting",
    timing: "Bhadrapada Shukla Panchami transition (August/September)",
    calendarSystem: "Jain Vira Nirvana Samvat Lunar",
    description: "The most important annual holy festival of Jains (observed by Svetambaras for 8 days and Digambaras for 10 days as Das Lakshana). Devotees practice intense self-discipline, study scriptures, ask for absolute forgiveness from all living beings, and fast.",
    customs: ["Chanting the sacred Navkar Mantra", "Seeking forgiveness using phrase 'Micchami Dukkadam'", "Boiling all drinking water and consuming it before sunset", "Listening to the Kalpa Sutra scriptures"],
    spiritualSignificance: "Paryushana means 'coming together' or 'staying within.' It is a period to look into one's soul, burn accumulated karmas (nirjara), and resolve to harm no creature.",
    fastingRules: {
      intensity: "water-only",
      duration: "8 Days continuous (Often observing total fasts 'Athai' or individual single-day fasts 'Upvas')",
      allowedFoods: ["Strictly boiled water consumed only between sunrise and sunset", "No foods whatsoever during Upvas days", "One simple grain meal per day under 'Ekasana' vows"],
      strictlyProhibited: ["All root vegetables (potatoes, onions, garlic, carrots) to protect microscopic soil organisms", "Green leafy vegetables (during festival days)", "Eating after sunset (Chauvihar)", "Unboiled water"],
      spiritualIntakeExplanation: "Upvas in Jainism is a complete mental and physical restraint. Denying the physical body food burns the karmic dust binding the absolute soul."
    },
    sourcesAndGuides: {
      primaryGuide: "Traditional Jain Shastras and Shrimad Rajchandra instructions.",
      astronomyCalculations: "Calculated from astronomical shifts in the Bhadrapada lunar cycle."
    }
  },
  {
    id: "ayambil-oli",
    name: "Ayambil Oli (Spiritual Taste Conquest Fast)",
    transliteration: "आयंबिल ओली",
    religion: "jainism",
    level: "minor",
    type: "fasting",
    timing: "Twice a year (Chaitra & Ashwin months - April & October)",
    calendarSystem: "Jain Lunar Calendar",
    description: "A unique 9-day fast observed twice a year, focused on conquering the sense of taste (Ras-Tyag). Devotees eat only once a day, consuming simple dry food cooked with absolutely no spices, oils, ghee, or flavorings.",
    customs: ["Worshipping the Navpad (nine supreme entities)", "Eating solitary plain single grain meal in an Ayambil hall", "Meditating on non-attachment"],
    spiritualSignificance: "Conquering the tongue's greed, developing physical detachment, and checking taste cravings which feed base earthly passions.",
    fastingRules: {
      intensity: "partial-diet",
      duration: "9 consecutive days (Eating only one meal per day)",
      allowedFoods: ["Dry boiled single-grains (such as wheat, rice, green gram or chickpeas)", "Warm boiled water"],
      strictlyProhibited: ["All oils, butter, and ghee (Vigai)", "All sugar, honey, and jaggery", "All milk, curd, and yogurt", "All spices (no salt, pepper, turmeric, etc.)", "All fruits and fresh vegetables"],
      spiritualIntakeExplanation: "By stripping food of all sensory pleasure, eating returns to a purely survival purpose, completely freeing up neurological capacity for high-state yoga."
    },
    sourcesAndGuides: {
      primaryGuide: "Determined via Jain Panchang for the bright phases of Chaitra and Ashwin.",
      astronomyCalculations: "Starts on the Shukla Saptami and ends on the Purnima (Full moon)."
    }
  },

  // BUDDHISM
  {
    id: "vesak",
    name: "Vesak (Buddha Purnima)",
    transliteration: "Visakah Puja",
    religion: "buddhism",
    level: "major",
    type: "celebration",
    timing: "Full Moon of the Vaisakha Monsoonal month (May)",
    calendarSystem: "Buddhist Synodic Lunar Calendar",
    description: "The holiest day in Buddhism, commemorating three crucial events in the life of Gautama Buddha: his miraculous birth, his cosmic enlightenment (Nirvana) under the Bodhi tree, and his final passing (Parinirvana).",
    customs: ["Bathing the Buddha statue with flower-scented water", "Laying lanterns and oil lamps at pagodas", "Releasing caged birds and animals (saving lives)", "Assembling in silent walk processions"],
    spiritualSignificance: "Cultivating non-violence (Ahimsa), practicing loving-kindness (Metta), and contemplating the impermanence of all compound phenomena.",
    fastingRules: {
      intensity: "partial-diet",
      duration: "Noon until the next sunrise (Adhering to the 8 Precepts - Uposatha standard)",
      allowedFoods: ["Nutritious herbal teas", "Sustaining clear fruit juices", "Pure water"],
      strictlyProhibited: ["All solid foods of any kind after 12:00 PM (noon)", "Meats & intoxicating substances", "Luxurious foods"],
      spiritualIntakeExplanation: "Abstaining from solid food in the afternoon and evening is a monastic discipline that reduces digestive drowsiness, allowing clear overnight vipassana meditation."
    },
    sourcesAndGuides: {
      primaryGuide: "Laity guidelines in Pali Canon (Sutta Pitaka).",
      astronomyCalculations: "Calculated based on Vaisakha Purnima (the 15th lunar day of the waxing moon)."
    }
  },
  {
    id: "uposatha",
    name: "Uposatha Days (Lunar Observance Fasts)",
    transliteration: "ଉପୋସଥ",
    religion: "buddhism",
    level: "minor",
    type: "fasting",
    timing: "Four times a month (Full moon, New moon, and two Quarter moon days)",
    calendarSystem: "Buddhist Synodic Lunar Calendar",
    description: "Regular weekly or biweekly days of intensified spiritual practice for Buddhist lay practitioners. Laity visit temples, listen to Dhamma teachings, and resolve to follow the Eight Precepts instead of the standard Five.",
    customs: ["Taking refuge in Triple Gem", "Meditating in serene groups", "Chanting suttas"],
    spiritualSignificance: "Periodically living like a monastic for a single day to practice simplicity, restraint, mindfulness, and sensory moderation.",
    fastingRules: {
      intensity: "partial-diet",
      duration: "From solar midday (12:00 PM) until the following dawn",
      allowedFoods: ["Clear liquids", "Honey or tea (strictly if medicinal energy is required)"],
      strictlyProhibited: ["Any chewing or ingestion of solid food after noon", "Perfumes, cosmetics, and entertainment", "High elevated luxurious beds"],
      spiritualIntakeExplanation: "Forces a psychological separation from sensory consumerism, allowing practitioners to observe how physical cravings arise and pass away naturally."
    },
    sourcesAndGuides: {
      primaryGuide: "Theravada Buddhist Vinaya and Sutta resources.",
      astronomyCalculations: "Determined directly by the Moon's phase alignments (0, 90, 180, and 270 degrees angular orbit)."
    }
  }
];

// INTERFAITH WISE COMPARISONS DATA
export interface InterfaithFastComparison {
  theme: string;
  similarities: string[];
  psychologicalImpact: string;
  medicalAutophagySignificance: string;
}

export const INTERFAITH_FAST_COMPARIONS: InterfaithFastComparison[] = [
  {
    theme: "Absolute Dry Fasting (Yom Kippur & Karwa Chauth & Chauvihar Upvas)",
    similarities: [
      "No food or water is allowed to cross the lips for the entire duration.",
      "Requires immense mental willpower and complete temporary withdrawal from physical chores.",
      "Focus is completely redirected to higher cosmic parameters (the Divine, the Husband's longevity, or Soul purification)."
    ],
    psychologicalImpact: "Breaks the primary illusion of immediate survival dependency on material intake. Demonstrates that human willpower is capable of absolute control over primal urges.",
    medicalAutophagySignificance: "Intense dry fasting triggers deep cellular autophagy, forcing cells to consume damaged organelles, waste proteins, and old senescent cells, resulting in clean cellular rejuvenation."
  },
  {
    theme: "Nocturnal / Intermittent Fasting Cycle (Ramadan sawm & Buddhist Afternoon Uposatha)",
    similarities: [
      "Fasting is bounded by strict sun coordinates (no food during hot sunlit hours or no food in the dark evening hours close to sleep).",
      "Suppresses continuous digestive workload, freeing up bio-energetic circulation for brain focus.",
      "Tightly tied to lunar cycles and calendar calculations."
    ],
    psychologicalImpact: "Instills a structured, daily rhythm of patience. Restricts 'mindless snacking', turning food consumption into a highly intentional, communal, and grateful ritual.",
    medicalAutophagySignificance: "Extending the gap between meals to 14-16 hours stabilizes blood glucose, reverses insulin resistance, reduces systemic inflammation markers, and improves gut microbiome diversity."
  },
  {
    theme: "Dietary Restriction and Abstinence (Christian Lent & Hindu Ekadashi & Jain root exclusion)",
    similarities: [
      "Solid foods are permitted, but major biological categories are strictly omitted (e.g., meat during Lent, grains during Ekadashi, root tubers during Jain fasts).",
      "Forces a deep awareness of ecological ties. Eating becomes a conscious reminder of spiritual vows.",
      "Saves valuable resources (grains, livestock) which are traditionally donated to the impoverished."
    ],
    psychologicalImpact: "Encourages human empathy for the earth and all sentient life. Teaches that one can thrive in peak clarity on simple, basic, non-violent, plant-based nutrition.",
    medicalAutophagySignificance: "Restricting refined grains and animal proteins down-regulates the mTOR pathway, mimicking calorie restriction benefits, reducing cardiovascular stresses, and helping detoxify hepatic tissues."
  }
];

export interface LunarInsight {
  traditionalContext: string;
  fastingSuggestion: string;
  spiritualAction: string;
  astronomicalSightingInfo: string;
}

export function getLunarSpiritualInsight(age: number): LunarInsight {
  const percentage = age / 29.530588853;
  const tithiRaw = percentage * 30;
  const tithiIndex = Math.max(1, Math.min(30, Math.floor(tithiRaw) + 1));
  const isWaxing = tithiIndex <= 15;
  const displayNum = isWaxing ? tithiIndex : tithiIndex - 15;
  const litPercent = Math.round((1 - Math.cos(percentage * 2 * Math.PI)) * 50);

  const VEDIC_TITHI_NAMES = [
    "", // 0 index unused
    "Pratipada",
    "Dwitiya",
    "Tritiya",
    "Chaturthi",
    "Panchami",
    "Shashti",
    "Saptami",
    "Ashtami",
    "Navami",
    "Dashami",
    "Ekadashi",
    "Dwadashi",
    "Trayodashi",
    "Chaturdashi",
    "Purnima" // 15
  ];

  let traditionalContext = "";
  let fastingSuggestion = "";
  let spiritualAction = "";
  let astronomicalSightingInfo = "";

  if (tithiIndex === 1 || tithiIndex === 2) {
    traditionalContext = "Shukla Pratipada & Dwitiya (New Beginnings). In Islamic tradition, this marks the Hilal sighting, defining the start of a new month. In Vedic astrology, standard rites for Navratri and initial monthly offerings are inaugurated.";
    fastingSuggestion = "Gentle calibration. Excellent for preparing the digestive tract with raw fruits and lightly cooked vegetables.";
    spiritualAction = "Set explicit clean intentions for the waxing lunar fortnight. Chant protective verses.";
    astronomicalSightingInfo = "The moon is an extremely thin, gorgeous crescent low in the western horizon briefly after sunset. Sight this carefully to witness the commencement of lunar calendars.";
  } else if (tithiIndex === 4) {
    traditionalContext = "Chaturthi (Ganesha's day of intelligence and overcoming obstacles). In Hindu tradition, Ganesha is worshiped with special mantras and modaks.";
    fastingSuggestion = "Sankashti Ganesha Chaturthi Vrat standard. Some observe partial fasts, eating only non-grain root crops or fruits.";
    spiritualAction = "Meditate on overcoming mental rigidity, personal biases, and intellectual obstacles.";
    astronomicalSightingInfo = "A sharp crescent moon high in the evening sky, setting a few hours after the sun.";
  } else if (tithiIndex === 5) {
    traditionalContext = "Panchami (Day of Wisdom, Saraswati, and Serpentine bio-energies). Associated with learning, knowledge, and artistic expression.";
    fastingSuggestion = "Saraswati light dietary regimen: yellow organic lentils, milk, saffron, and high-quality light seeds.";
    spiritualAction = "Dedicate time to read holy texts, write down scriptural analyses, or play search devotional instruments.";
    astronomicalSightingInfo = "The moon crescent is thickening rapidly, illuminating 25-35% of the surface.";
  } else if (tithiIndex === 8) {
    traditionalContext = "Ashtami (Durga's fierce protective energy and peak Quarter Moon checkpoint). Celebrated as Uposatha in Buddhist custom, and Durga Ashtami in Hindu cycles.";
    fastingSuggestion = "Moderate dietary restriction. Refrain from heavy fried foods & grains to prevent sluggish blood circulation.";
    spiritualAction = "Confront personal fears, shadow elements, and ego impulses. Reflect on the Eight Precepts.";
    astronomicalSightingInfo = "First Quarter Moon. The terminator line is straight, dividing the visible face into equal bright and dark halves.";
  } else if (tithiIndex === 10 || tithiIndex === 11 || tithiIndex === 12) {
    traditionalContext = `Ekadashi (Day ${displayNum} of Waxing Fortnight - Supreme Fast Block). This represents the ultimate alignment for internal bio-cleansing. Water in our bodies responds to gravitational tides; fasting on this day protects cell integrity.`;
    fastingSuggestion = "Ekadashi Vrat: Ideal for complete dry fasting, wet fasting (just water), or phalahar (only fresh seasonal fruits). Strictly avoid grains, rice, wheat, and pulses.";
    spiritualAction = "Intense scripture studying. Silence your digestive system to allow cognitive focus on deep philosophies.";
    astronomicalSightingInfo = "Waxing Gibbous phase. Brightness is dominating the night, casting soft, rich shadows.";
  } else if (tithiIndex === 13) {
    traditionalContext = "Pradosha (Twilight worship of Shiva). This hour signifies the cleansing of accumulated karmic blockages.";
    fastingSuggestion = "Hold a partial fast until twilight time. Dinner should consist of light vegetable broth after evening prayers.";
    spiritualAction = "Breathe in rhythmic pranayama during the sunset hour. Offer deep gratitude.";
    astronomicalSightingInfo = "The moon is nearly spherical, shining with intense, silver luster throughout the night.";
  } else if (tithiIndex === 14 || tithiIndex === 15 || tithiIndex === 16) {
    traditionalContext = "Purnima (The radiant peak of Full Moon. Celebrated as Holi, Vesak, and major Uposatha assemblies). Maximum energetic expansion.";
    fastingSuggestion = "Consume ultra-light, easily digestible liquids or raw organic foods. Avoid heavy, fermentable foods to maintain calm mental stability.";
    spiritualAction = "Sit in quiet meditation under the direct moonlight. Recite the highest teachings on the soul or Vipassana.";
    astronomicalSightingInfo = "The Moon is 100% illuminated, opposite the Sun, rising exactly at sunset and remaining visible all night.";
  } else if (tithiIndex >= 22 && tithiIndex <= 24) {
    traditionalContext = `Krishna Ashtami (The Third Quarter checkpoints). This includes Janmashtami. Deep reflective energies of the dark fortnight.`;
    fastingSuggestion = "Moderate fasting. Clean organic light soups or nourishing herbal recipes are best.";
    spiritualAction = "Focus on turning your senses inward (Pratyahara) as outer sensory light withdraws.";
    astronomicalSightingInfo = "Third Quarter Moon, rising high at midnight and remaining visible in the blue morning sky.";
  } else if (tithiIndex === 25 || tithiIndex === 26 || tithiIndex === 27) {
    traditionalContext = `Krishna Ekadashi (Day ${displayNum} of Dark Fortnight - Internal Detoxing). Fasting on this day removes stagnant bio-materials.`;
    fastingSuggestion = "Krishna Ekadashi standard: No grains, rice, or heavy proteins. Prefer coconut water, herbal teas, or pure water fast.";
    spiritualAction = "Perform quiet meditation, reading, and self-restraint. Perfect time for deep research.";
    astronomicalSightingInfo = "Thinning sickle-shaped crescent in the pre-dawn sky, indicating a quietening sky.";
  } else if (tithiIndex === 28 || tithiIndex === 29) {
    traditionalContext = "Maha Shivratri / Shivaratri Chaturdashi (The dark vigil). The night before the dark moon is dedicated to extreme mental dissolution.";
    fastingSuggestion = "Complete partial or total fast. Stay awake throughout the night if participating in traditional vigils.";
    spiritualAction = "Join in night-long silent meditation or scripture singing. The absolute silent gap before new creation.";
    astronomicalSightingInfo = "A sliver-thin waning crescent rising shortly before dawn, disappearing rapidly into solar rays.";
  } else {
    // Falls to Amavasya or standard Shukla/Krishna tithis
    if (tithiIndex === 30) {
      traditionalContext = "Amavasya (The dark void of the New Moon). Introspection, ancestral reflections, and deep spiritual silence.";
      fastingSuggestion = "Light cleansing diet or salt-free water fasting. It helps ground mental frequencies.";
      spiritualAction = "Honor your ancestors (Tarpanam) or sit in complete darkness, meditating on the unmanifest cosmos.";
      astronomicalSightingInfo = "The Moon is aligned directly between Earth and Sun, rendering it completely invisible.";
    } else {
      traditionalContext = `${isWaxing ? "Shukla" : "Krishna"} ${VEDIC_TITHI_NAMES[displayNum]} (${displayNum}${getOrdinalSuffix(displayNum)} lunar day). Part of the continuous astronomical cycle.`;
      fastingSuggestion = "Follow an organic, moderate diet suited to your biochemical prakriti. Restraint is always recommended.";
      spiritualAction = "Incorporate short pauses throughout your day to read a verse or check scriptural commentaries.";
      astronomicalSightingInfo = `The moon phase is ${isWaxing ? "waxing" : "waning"} with approximately ${litPercent}% light visibility.`;
    }
  }

  return {
    traditionalContext,
    fastingSuggestion,
    spiritualAction,
    astronomicalSightingInfo
  };
}

export const FESTIVAL_DATES_2026: Record<string, { start: string; end: string }> = {
  "diwali": { start: "20261108", end: "20261109" },
  "maha-shivratri": { start: "20260215", end: "20260216" },
  "karwa-chauth": { start: "20261028", end: "20261029" },
  "ekadashi-vrat": { start: "20260611", end: "20260612" }, // Represented by major June Nirjala Fasting
  "janmashtami": { start: "20260904", end: "20260905" },
  "ramadan-sawm": { start: "20260218", end: "20260320" },
  "eid-al-fitr": { start: "20260320", end: "20260321" },
  "ashura-fast": { start: "20260725", end: "20260726" },
  "good-friday-lent": { start: "20260403", end: "20260404" },
  "lent-season": { start: "20260218", end: "20260405" },
  "yom-kippur": { start: "20261020", end: "20261022" }, // Yom Kippur spans sunset 20th to 21st sundown
  "pesach": { start: "20260402", end: "20260411" }, // April 2 to 10th (sunset to sunset)
  "tisha-bav": { start: "20260721", end: "20260723" }, // July 21 to 22nd
  "paryushana-parva": { start: "20260906", end: "20260914" },
  "ayambil-oli": { start: "20261016", end: "20261025" },
  "vesak": { start: "20260501", end: "20260502" },
  "uposatha": { start: "20260630", end: "20260701" }
};

export function generateICSContent(festivals: FestivalItem[]): string {
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Scripture & Fasting Compute//NONSGML Liturgical Calendar v1.0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  const nowStr = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  festivals.forEach((fest) => {
    const dates = FESTIVAL_DATES_2026[fest.id] || { start: "20260604", end: "20260605" };
    
    // Clean fields and prevent raw line break errors or unescaped values
    const cleanDesc = `${fest.description} | Spiritual Significance: ${fest.spiritualSignificance || "N/A"}`
      .replace(/[\r\n]+/g, " ")
      .replace(/[,;]/g, "\\$&"); // Escape for ICS spec compatibility
      
    icsLines.push("BEGIN:VEVENT");
    icsLines.push(`UID:uid_${fest.id}_2026@scripturefasttracker.com`);
    icsLines.push(`DTSTAMP:${nowStr}`);
    icsLines.push(`DTSTART;VALUE=DATE:${dates.start}`);
    icsLines.push(`DTEND;VALUE=DATE:${dates.end}`);
    icsLines.push(`SUMMARY:${fest.name.replace(/[,;]/g, "\\$&")}`);
    icsLines.push(`DESCRIPTION:${cleanDesc}`);
    icsLines.push(`LOCATION:Temples\\, Sacred Altars\\, & Contemplation Spaces`);
    icsLines.push("END:VEVENT");
  });

  icsLines.push("END:VCALENDAR");
  return icsLines.join("\r\n");
}

export function getGoogleCalendarUrl(
  title: string,
  start: string,
  end: string,
  description: string,
  timing?: string,
  calendarSystem?: string
): string {
  const baseUrl = "https://calendar.google.com/calendar/render";
  const detailsParts = [description];
  if (timing) detailsParts.push(`Timing: ${timing}`);
  if (calendarSystem) detailsParts.push(`Calendar System: ${calendarSystem}`);
  
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: detailsParts.join("\n\n"),
    location: "Temples, Sacred Altars, & Contemplation Spaces"
  });
  return `${baseUrl}?${params.toString()}`;
}

export function getGoogleCalendarUrlForFest(fest: FestivalItem): string {
  const dates = FESTIVAL_DATES_2026[fest.id] || { start: "20260604", end: "20260605" };
  return getGoogleCalendarUrl(
    fest.name,
    dates.start,
    dates.end,
    fest.description,
    fest.timing,
    fest.calendarSystem
  );
}

export function triggerICSDownload(festivals: FestivalItem[], fileName = "sacred_festivals_calendar.ics") {
  const content = generateICSContent(festivals);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  if ("download" in link) {
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  URL.revokeObjectURL(url);
}

export function getFastingPreparationTips(religion: ReligionType): string[] {
  switch (religion) {
    case "hinduism":
      return [
        "Hydrate thoroughly 24 hours prior with water, fresh milk, and tender coconut water.",
        "Eat a light, grain-free pre-fast meal (Sattvik diet) containing fruits, root vegetables, and nuts.",
        "Prepare herbal ginger-basil tea to settle the stomach and boost natural stamina before beginning.",
        "Gradually break the fast with diluted fruit juice, sweet yogurt, or water before taking cooked grain-free foods."
      ];
    case "islam":
      return [
        "Include complex carbohydrates (oats, barley, whole grains) and high-fiber foods in your pre-dawn Suhoor meal.",
        "Incorporate lean proteins, eggs, and healthy fats to guarantee sustained, slow-release physical energy.",
        "Drink generous water between Iftar (breaking fast) and Suhoor to avoid cellular dehydration.",
        "Conclude fasting by breaking with 2-3 traditional dates and water to immediately restore glucose stores."
      ];
    case "christianity":
      return [
        "Adopt a gradual plant-based diet beforehand by decreasing meat and dairy intake a few days prior.",
        "Prepare simple, modest ingredients (soups, legumes, and bread) to maintain low sensory distraction.",
        "Dedicate time for quiet contemplation, silent prayer, or scripture reading to enrich the fast's spiritual focus.",
        "Break the fast with a mild, warm broth or simple vegetables to avoid excessive digestive strain."
      ];
    case "judaism":
      return [
        "Maximize fluid and electrolyte consumption the entire day before to prevent severe dehydration.",
        "Eat a hearty, high-protein, low-sodium pre-fast meal (Seudah Hamafseket) to sustain hunger without promoting thirst.",
        "Coordinate a period of complete rest and avoid unnecessary physical exertion during the full 25-hour vigil.",
        "Gently break your fast with light herbal tea, fresh water, and a slice of sponge cake or plain bread."
      ];
    case "buddhism":
    case "jainism":
      return [
        "Strictly minimize evening caloric volume starting from sunset the day before.",
        "Engage in mindful, deep-breathing exercises or walking meditation to calm physical hunger waves.",
        "Consume only dynamic liquids or warm water if thirst increases during the high quiet hours.",
        "Break the fast mindfully, showing pure gratitude, and consuming highly digestible non-spicy foods."
      ];
    default:
      return [
        "Hydrate properly with ample clean water before beginning any dietary restrictions.",
        "Keep pre-fasting meals light, rich in fiber, and low in sodium to minimize hunger and thirst loops.",
        "Avoid intense physical training and high hot temperatures during the fasting windows.",
        "Listen carefully to your physical state and break the fast with easily digestible nutrient-rich foods."
      ];
  }
}
