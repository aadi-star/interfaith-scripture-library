import React, { useState, useEffect, useRef } from "react";
import { ScriptureBook } from "../types";

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

import { 
  Sparkles, 
  Compass, 
  Maximize2, 
  Search, 
  Filter, 
  Info, 
  Eye, 
  BookOpen,
  Heart, 
  Bookmark, 
  HelpCircle,
  Clock,
  MapPin,
  ChevronRight,
  BookmarkCheck,
  Award,
  History,
  ArrowLeft,
  ArrowRight,
  Plus,
  Image,
  ShieldAlert
} from "lucide-react";

// Timeline meta helper to support historical sorting and epochs representation
export interface TimelineMeta {
  year: number;
  label: string;
  period: string;
  epochColor: string;
}

export function getTimelineMeta(id: string): TimelineMeta {
  switch (id) {
    case "hindu-krishna":
      return { year: -3102, label: "c. 3102 BCE", period: "Dwapar Yuga Legends", epochColor: "from-orange-500/30 to-amber-500/10" };
    case "hindu-yajna":
      return { year: -1500, label: "c. 1500 BCE", period: "Vedic Fire Rigveda", epochColor: "from-red-500/30 to-amber-500/10" };
    case "hindu-om":
      return { year: -1000, label: "c. 1000 BCE", period: "Upanishadic Core", epochColor: "from-amber-500/30 to-yellow-500/10" };
    case "judaism-western-wall":
      return { year: -516, label: "c. 516 BCE", period: "Second Temple Era", epochColor: "from-stone-500/30 to-yellow-600/10" };
    case "classical-parthenon":
      return { year: -450, label: "c. 450 BCE", period: "Classical Athenian", epochColor: "from-teal-500/30 to-blue-500/10" };
    case "buddhism-buddha":
      return { year: -250, label: "c. 250 BCE", period: "Sarnath Maurya", epochColor: "from-yellow-600/30 to-amber-700/10" };
    case "christian-cross":
      return { year: 33, label: "c. 33 CE", period: "Apostolic Horizon", epochColor: "from-blue-600/30 to-indigo-600/10" };
    case "hindu-temple":
      return { year: 200, label: "c. 200 CE", period: "Early Shaiva", epochColor: "from-orange-600/30 to-red-600/10" };
    case "christian-jesus":
      return { year: 300, label: "c. 300 CE", period: "Early Patristic", epochColor: "from-emerald-500/30 to-teal-600/10" };
    case "islam-mecca":
      return { year: 610, label: "c. 610 CE", period: "Islamic Foundation", epochColor: "from-emerald-600/30 to-green-600/10" };
    case "islam-medina":
      return { year: 622, label: "c. 622 CE", period: "Medina Sanctuary", epochColor: "from-green-500/30 to-emerald-500/10" };
    case "christian-cathedral":
      return { year: 1163, label: "1163 CE", period: "High Gothic Era", epochColor: "from-violet-500/30 to-fuchsia-500/10" };
    case "jainism-temple":
      return { year: 1200, label: "c. 1200 CE", period: "Medieval Mount Abu", epochColor: "from-pink-500/30 to-stone-400/10" };
    case "sikhism-golden-temple":
      return { year: 1589, label: "1589 CE", period: "Harmandir Sahib Founder", epochColor: "from-amber-400/30 to-yellow-300/10" };
    case "islam-blue-mosque":
      return { year: 1616, label: "1616 CE", period: "Ottoman Golden Age", epochColor: "from-cyan-500/30 to-blue-500/10" };
    case "theme-holy-books":
      return { year: 9995, label: "Timeless", period: "Holy Books Dimension", epochColor: "from-rose-500/30 to-amber-500/10" };
    case "theme-spiritual-stories":
      return { year: 9996, label: "Timeless", period: "Stories Dimension", epochColor: "from-indigo-500/30 to-fuchsia-500/10" };
    case "theme-sacred-prayers":
      return { year: 9997, label: "Timeless", period: "Prayers Dimension", epochColor: "from-amber-400/30 to-orange-500/10" };
    default:
      if (id.startsWith("dynamic-")) {
        return { year: 9999, label: "Active Study", period: "Custom Real-time Context", epochColor: "from-amber-500/40 to-indigo-500/15" };
      }
      return { year: 5000, label: "Ancient Era", period: "Grounded Wisdom", epochColor: "from-slate-500/30 to-slate-900/10" };
  }
}

// Types for era info summaries
export interface EraInfo {
  title: string;
  period: string;
  range: string;
  summary: string;
  characteristics: string[];
}

export function getEraInfo(id: string): EraInfo {
  switch (id) {
    case "hindu-krishna":
      return {
        title: "The Heroic Spiritual Journey (Dwapar Yuga)",
        period: "Dwapar Yuga Legends",
        range: "c. 3102 BCE",
        summary: "Focuses on narrative and deeply expressive representations of celestial play (Leela) and the epic battle dynamics that framed the teaching of the Bhagavad Gita.",
        characteristics: [
          "Vivid, anthropomorphic depiction of cosmic forms (Vishwarupa)",
          "Artistic focus on the intimate, playful relationship between humanity and the divine",
          "Lush backgrounds representing the sacred and natural forests of Vrindavan"
        ]
      };
    case "hindu-yajna":
      return {
        title: "Vedic Fire Rigveda & Elemental Devotion",
        period: "Vedic Fire Rigveda",
        range: "c. 1500 BCE",
        summary: "Early Rigvedic art centers on the geometric complexity of fire-sacrifice structures (Shulba Sutras) and descriptions of natural elements acting as divine agents.",
        characteristics: [
          "Precise geometry representing the divine design of sacrificial brick altars",
          "Formless (Arupa) and highly abstract focus on primary elemental energies",
          "Emphasis on natural and planetary rhythms representing Cosmic Order (Rta)"
        ]
      };
    case "hindu-om":
      return {
        title: "Upanishadic Core & Formless Reality",
        period: "Upanishadic Core",
        range: "c. 1000 BCE",
        summary: "Marks a transition from outward yajna rituals toward standard internal contemplation of the self (Atman) and the ultimate, formless reality (Brahman).",
        characteristics: [
          "Graphic prominence of 'OM' as both a vocal vibration and absolute visual guide",
          "Schemes representing the inner lotus chambers of the human heart (Daharakasha)",
          "Aesthetic understatement to foster meditation, relying on silence and visual void"
        ]
      };
    case "judaism-western-wall":
      return {
        title: "Second Temple Era & Radiant Aniconism",
        period: "Second Temple Era",
        range: "c. 516 BCE",
        summary: "A period defining absolute, strict rejection of physical images of god. Reverence is expressed through temple architecture, scriptural scrolls, and liturgical symbols.",
        characteristics: [
          "Colossal, precision-cut ashlar limestone masonry reflecting stability and divine covenant",
          "Complete absence of animal or human sculpture in sacred areas to prevent idolatry",
          "Use of specific temple items (the golden menorah, olive branches, and trumpets) as visual anchors"
        ]
      };
    case "classical-parthenon":
      return {
        title: "Classical Greek Golden Age Symmetry",
        period: "Classical Athenian",
        range: "c. 450 BCE",
        summary: "Art of Athens that aimed to realize ideal form, combining flawless mathematical ratios with perfect human anatomy to express cosmic balance and civic justice.",
        characteristics: [
          "Optical geometry adjustments (entasis) to make gigantic structures appear perfectly straight",
          "Universal application of the Golden Ratio (phi) in building portals and friezes",
          "Sculptures capturing poised dignity and a sense of calm, rational order"
        ]
      };
    case "buddhism-buddha":
      return {
        title: "Sarnath Maurya & Aniconic Teaching Symbols",
        period: "Sarnath Maurya",
        range: "c. 250 BCE",
        summary: "Early Buddhist art under Mauryan patronage representing Gautama Buddha solely through signs—his footprints, empty seats of enlightenment, or the royal teaching wheel.",
        characteristics: [
          "Mirror-like stone polishing technique reflecting absolute self-purity",
          "Quadruple lions standing back-to-back pointing to the universal reach of the Dharma",
          "The Wheel of Dharma (Dharmachakra) as a perfect geometric wheel of truth"
        ]
      };
    case "christian-cross":
      return {
        title: "Apostolic Horizon & Cryptic Catacomb Signs",
        period: "Apostolic Horizon",
        range: "c. 33 CE",
        summary: "Due to Roman persecution, early christian congregations created hidden, shorthand codes in dark burial catacombs to express salvation, belief, and mutual recognition safely.",
        characteristics: [
          "The disguised Anchor representing the cross, stability, and secure hope",
          "The famous Fish (Ichthys) monogram whose letters spell 'Jesus Christ, Son of God, Savior'",
          "Simple paintings of dividing bread loaves signifying celestial sharing"
        ]
      };
    case "hindu-temple":
      return {
        title: "Early Shaiva Rock-cut Asceticism",
        period: "Early Shaiva",
        range: "c. 200 CE",
        summary: "Characterized by the establishment of the Shiva Lingam as a visual axis. Early temples and carvings emphasize monolithic scale, absolute solidity, and deep ascetic power.",
        characteristics: [
          "Focus on the Lingam as an infinite pillar of spiritual light (Jyotirlinga)",
          "Severe rock-cut architecture carved directly into the mountain side",
          "Depictions highlighting meditative poise, third-eye focus, and sensory control"
        ]
      };
    case "christian-jesus":
      return {
        title: "Early Patristic Era Icons & Halo Divinity",
        period: "Early Patristic",
        range: "c. 300 CE",
        summary: "Following imperial legitimization, Christian art emerged from underground into grand basilicas, developing flat, highly-stylized iconographies that privilege theological messages over natural physics.",
        characteristics: [
          "Brilliant golden leaf backgrounds denoting the divine, timeless space of heaven",
          "Intense, wide-open eyes gazing outward to create an interactive connection with the viewer",
          "Highly standardized gestures of blessing and hand positions holding holy codices"
        ]
      };
    case "islam-mecca":
      return {
        title: "Islamic Foundation & Radiant Arabesques",
        period: "Islamic Foundation",
        range: "c. 610 CE",
        summary: "Art of the pristine Islamic revelation centered entirely on absolute divine oneness. Complex geometries and vegetal flows (arabesques) represent God's endless, living reality without physical shapes.",
        characteristics: [
          "Intricate arabesques of repeating leaf and vine curves suggesting organic infinity",
          "Sacred Kufic calligraphy presenting the exact Quranic text as the supreme visual art form",
          "Sophisticated geometric grids which remind the viewer of divine mathematical order"
        ]
      };
    case "islam-medina":
      return {
        title: "Medina Sanctuary & Structural Humility",
        period: "Medina Sanctuary",
        range: "c. 622 CE",
        summary: "Reflects the earliest, most humble phase of mosque space modeled on the Prophet's house in Medina, prioritizing horizontal community equality and absolute focus on prayer.",
        characteristics: [
          "Use of simple, local mud-brick walls and palm branches for shade",
          "Lack of monumental towers, domes, or excessive wealth to ensure complete humility in prayer",
          "An expansive courtyard facilitating open, non-hierarchical community gathering"
        ]
      };
    case "christian-cathedral":
      return {
        title: "High Gothic Era Cathedrals & Ethereal Light",
        period: "High Gothic Era",
        range: "1163 CE",
        summary: "Medieval craftsmen aimed to manifest the Heavenly Jerusalem on earth. They engineered soaring stone vaults and tall stained glass windows to turn sunlight into divine color.",
        characteristics: [
          "Stained-glass panels acting as 'Lux Nova' (New Holy Light) that bathes visitors in color",
          "Ribbed vaults and flying buttress skeletons that divert weight, keeping walls thin and open",
          "Slender, smiling jamb statues with human expressions displaying spiritual joy"
        ]
      };
    case "jainism-temple":
      return {
        title: "Medieval Mount Abu Marble Carving Elegance",
        period: "Medieval Mount Abu",
        range: "c. 1200 CE",
        summary: "Legendary Jain shrine art sculpted from high-purity white marble. The work turns solid stone into lace-like filigree, guiding the eye into deep concentric sacred circles.",
        characteristics: [
          "Unmatched, paper-thin marble carving quality that appears nearly transparent",
          "Ceiling layouts of concentric bands containing dancing figures and celestial guides",
          "Sculptured Tirthankaras sitting in perfect yogic posture on lotus platforms"
        ]
      };
    case "sikhism-golden-temple":
      return {
        title: "Harmandir Sahib Founder & Spiritual Synthesis",
        period: "Harmandir Sahib Founder",
        range: "1589 CE",
        summary: "Architecture of the central Sikh shrine, engineered to sit inside a massive pool of nectar. Fuses diverse styles into a clean, inviting statement of universal spiritual hospitality.",
        characteristics: [
          "Four open entry doors representing equal access for people coming from any direction",
          "Brilliant golden plates reflecting solar rays, floating above are quiet sacred waters",
          "Intricate floral inlays and fresco art panels framing continuous scripture recitation"
        ]
      };
    case "islam-blue-mosque":
      return {
        title: "Ottoman Golden Age & Monumental Domes",
        period: "Ottoman Golden Age",
        range: "1616 CE",
        summary: "The apex of grand imperial mosques, achieving supreme balance by placing a huge central dome on top of cascading half-domes, framing majestic open spaces inside.",
        characteristics: [
          "Over 20,000 blue-hued Iznik ceramic tiles detailing carnations, lilies, and trees",
          "Elegant cascades of domes and semi-domes creating an immense, shadow-free inner hall",
          "A forest of high windows that keep the majestic space flooded with natural light"
        ]
      };
    case "theme-holy-books":
      return {
        title: "Scriptural Illumination & Scroll Calligraphy",
        period: "Holy Books Dimension",
        range: "Timeless",
        summary: "Common to many faiths, this art form treats written scriptures as sacred relics. It decorates lines of divine revelation with genuine gold leaf and intricate margin scrollwork.",
        characteristics: [
          "Pure gold-leaf coatings designed to glow and reflect candle-light during holy ceremonies",
          "Elaborate illuminated opening borders featuring complex geometric or floral scrollwork",
          "Remarkable calligraphy where each stroke conforms to strict, ancient design guidelines"
        ]
      };
    case "theme-spiritual-stories":
      return {
        title: "Sacred Narrative & Parable Illustration",
        period: "Stories Dimension",
        range: "Timeless",
        summary: "Uses dynamic figures and stylized, flat landscapes to visually narrate complex trials of faith, ethical dilemmas, and the triumphs of prophets or saints.",
        characteristics: [
          "Empathetic characters making expressive hand gestures (Mudras) to communicate emotions",
          "Symbolic choices of colors where dark indicates spiritual confusion and white is enlightenment",
          "Clever multi-scene layouts where different points of a story are visible in a single frame"
        ]
      };
    case "theme-sacred-prayers":
      return {
        title: "Devotional Chant Syllabics & Light Geometry",
        period: "Prayers Dimension",
        range: "Timeless",
        summary: "Visualizing the repetitive, rhythmic nature of deep, vocalized prayer. This art relies on geometric symmetry, central points (bindus), and mandalas to capture spiritual alignment.",
        characteristics: [
          "A radiant central point of concentration representing the absolute, unmanifest source",
          "Expanding geometric rings indicating ripples of prayer expanding into the universe",
          "Aesthetic symmetry that mirrors the calming, organized pulse of repetitive chanting"
        ]
      };
    default:
      if (id.startsWith("dynamic-")) {
        return {
          title: "User-Prompted Interactive Fusion Art",
          period: "Custom Real-time Context",
          range: "Active Study",
          summary: "Dynamic masterpieces co-created through artificial intelligence, combining historical sacred styles with specific user queries and symbols.",
          characteristics: [
            "Seamless blending of multi-epoch styles according to your exact prompts",
            "Responsive geometry adapted to modern high-resolution screens and interactive interfaces",
            "High-contrast symbol highlights mapping directly to the active decoder"
          ]
        };
      }
      return {
        title: "Legacy Masterpiece & Grounded Wisdom",
        period: "Grounded Wisdom",
        range: "Ancient Era",
        summary: "Timeless spiritual art carrying legacy wisdom across generations, maintaining a bridge to the sacred origins of human devotion.",
        characteristics: [
          "Classic compositional structure emphasizing balanced, harmonic centers",
          "Hand-made textures reminding the seeker of direct physical craft",
          "Universal religious and philosophical symbols conveying transcendent truths"
        ]
      };
  }
}

// Types for sacred art items
export interface SacredArtItem {
  id: string;
  title: string;
  tradition: "hinduism" | "christianity" | "islam" | "buddhism_jainism" | "judaism" | "sikhism" | "classical_myths";
  traditionLabel: string;
  url: string;
  location?: string;
  creator?: string;
  era?: string;
  shortCaption: string;
  description: string;
  symbolismElements: {
    symbol: string;
    meaning: string;
  }[];
  contemplationPrompt: string;
}

// Our curated premium gallery database of world religion art
export const SACRED_ART_GALLERY: SacredArtItem[] = [
  // SPECIAL INTERFAITH AESTHETIC MASTERPIECE DIMENSIONS
  {
    id: "theme-holy-books",
    title: "The Architecture of the Divine Word",
    tradition: "classical_myths",
    traditionLabel: "Holy Books Dimension",
    url: "https://images.unsplash.com/photo-1544764200-d834fd210a23?auto=format&fit=crop&w=800&q=80",
    location: "Sovereign Scriptorium Archives",
    era: "Timeless Wisdom",
    shortCaption: "An open sacred book reflecting detailed religious calligraphy, illuminated by clean beams of ancient amber sunlight.",
    description: "Representing the eternal structure of holy scriptures. The physical leather binding and golden leaf lines symbolize the geometric precision of cosmic law, preserved through ages to guide human devotion.",
    symbolismElements: [
      {
        symbol: "Open Sacred Book",
        meaning: "Represents revealed truth, divine guidance, and active study of spiritual principles."
      },
      {
        symbol: "Amber Sunlight Beams",
        meaning: "The rays of spiritual enlightenment cutting through darkness of raw ignorance."
      },
      {
        symbol: "Gilded Text Elements",
        meaning: "The valuable, unyielding nature of divine words transcribed by ancestral sages."
      }
    ],
    contemplationPrompt: "Visualize the book you are holding not just as words on paper, but as an energetic golden cathedral of consciousness built of sacred truth. Walk inside and rest."
  },
  {
    id: "theme-spiritual-stories",
    title: "The Celestial Pilgrim's Trail",
    tradition: "classical_myths",
    traditionLabel: "Sacred Stories Dimension",
    url: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=800&q=80",
    location: "Path of Infinite Horizons",
    era: "The Heroic Spiritual Journey",
    shortCaption: "A majestic wanderer looking out from a high mountain pass over sunrise, representing historical spiritual searchers and pilgrims.",
    description: "Representing the epic journeys recorded in sacred stories (e.g., Ramayana, Journey to the West, Odyssey). The traveler is a symbol of the individual soul (Jivatman) migrating towards ultimate realization.",
    symbolismElements: [
      {
        symbol: "The Pilgrim Silhouette",
        meaning: "The human soul navigating the dualities of life (trials and triumphs) in quest of home."
      },
      {
        symbol: "High Mountain Pass",
        meaning: "The rigorous upward climb of self-discipline and moral fortitude."
      },
      {
        symbol: "Golden Sunrise Horizon",
        meaning: "The ultimate dawning of spiritual awakening and liberation from earthly bonds."
      }
    ],
    contemplationPrompt: "Think of your life as a sacred classic epic. Every obstacle is a chapter, every teacher is an ally. Breathe in courage, breathe out fatigue; continue your ascent."
  },
  {
    id: "theme-sacred-prayers",
    title: "Vibrations of the Silent Voice",
    tradition: "classical_myths",
    traditionLabel: "Holy Prayers & Chants",
    url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80",
    location: "The Chamber of Heartfelt Silence",
    era: "Primal Devotion",
    shortCaption: "Polished wooden rosary beads resting gently alongside a flickering candle, representing deep interfaith devotional chants and quiet prayer focus.",
    description: "Representing the invisible sound-waves, mantras, and heart-felt whispers of sacred prayers. As outer sound sinks into inner quietude, our breath organizes itself like clean water ripples, radiating absolute compassion to all corners of creation.",
    symbolismElements: [
      {
        symbol: "Flickering Altar Candle",
        meaning: "The unblemished spiritual heart that burns constantly under the warm guidance of prayer."
      },
      {
        symbol: "Rosary Beads (Mala)",
        meaning: "The counting of continuous prayers, creating rhythmic frequencies of peace and mindfulness."
      },
      {
        symbol: "Warm Wooden Surface",
        meaning: "Grounded humility and natural simplicity, connecting baseline human life to divine elements."
      }
    ],
    contemplationPrompt: "Sit in complete silence for three breaths. Let your mind become like perfectly still water. Sound a silent prayer of gratitude, and feel its warm ripples expand outward into the universe."
  },
  // HINDUISM
  {
    id: "hindu-om",
    title: "The Supreme OM (Aum) Resonance",
    tradition: "hinduism",
    traditionLabel: "Hindu Tradition",
    url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=800&q=80",
    location: "Primordial Sound Chamber",
    era: "Ethereal Vedic Origins",
    shortCaption: "The sacred OM (Aum) symbol and carvings from ancient temple structures, representing the source of cosmic vibration and Brahman.",
    description: "The Om or Aum is the most sacred monosyllable in Sanatana Dharma, representing the ultimate Brahman of the Upanishads, evoking the vibrations that call the individual waking, dreaming, and deep-sleep states back into the transcendent, non-dual Self (Turiya).",
    symbolismElements: [
      {
        symbol: "The OM Letter Outline",
        meaning: "Represents the absolute transcendent state (Turiya), ultimate liberation, and cosmic oneness."
      },
      {
        symbol: "The Three Curves",
        meaning: "The waking (Jagrat), dreaming (Swapna), and deep-sleep (Sushupti) realms expanding outwards."
      },
      {
        symbol: "The Crescent & Dot (Bindu)",
        meaning: "The dot represents the absolute spirit, while the semi-circle defines the barrier of Maya (illusion)."
      }
    ],
    contemplationPrompt: "Close your eyes and sound the syllable 'A-U-M' slowly. Feel the physical vibration rise from your abdomen, through your chest, and fade into silence at your crown."
  },
  {
    id: "hindu-krishna",
    title: "The Flute of Silent Gopis",
    tradition: "hinduism",
    traditionLabel: "Hindu Tradition",
    url: "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=800&q=80",
    location: "Vrindavan Forest of Hearts",
    era: "Dwapar Yuga Legends",
    shortCaption: "A majestic peacock feather and golden flute representation of Lord Krishna, representing supreme love (Bhakti).",
    description: "In Sanatana Dharma, Lord Krishna's flute-playing is a profound spiritual technology. It represents a human heart fully emptied of ego, letting the supreme divine breath sound the sweet melody of unconditioned, ecstatic peace.",
    symbolismElements: [
      {
        symbol: "Sovereign Silhouette of Krishna",
        meaning: "The divine teacher who calls every searching soul back to its native spiritual beauty."
      },
      {
        symbol: "Hollow Golden Flute",
        meaning: "The human heart which must be emptied of personal pride so the Divine can play music through it."
      },
      {
        symbol: "The Flute Sounds",
        meaning: "Divine sparks of wisdom and unconditional love (Bhakti) radiating across the material world."
      }
    ],
    contemplationPrompt: "Visualize yourself as a hollow flute. Allow the divine breath to empty you of thoughts, anger, and worries, replacing them with a sweet melody of peace."
  },
  {
    id: "hindu-yajna",
    title: "The Golden Fire of Agni",
    tradition: "hinduism",
    traditionLabel: "Hindu Tradition",
    url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    location: "Sacred Hearth of Chants",
    era: "Ancient Rigvedic Dawn",
    shortCaption: "The pristine fire of Agni rising with prayers from a traditional Vedic ghee lamp representation, purifying minds.",
    description: "Agni is the high priest and divine messenger in the Rigveda. The ascending fire represents the spiritual heat (Tapas) that consumes material desires, transmuting our ego into pure environmental and mental purification.",
    symbolismElements: [
      {
        symbol: "Ascending Sacred Fire",
        meaning: "The sacred fire of Agni burning away ancient karma, limitations, and intellectual dust."
      },
      {
        symbol: "The Havan Altar (Kund)",
        meaning: "The geometric, structured grid represents the orderly cosmic laws (Rita) governing nature."
      },
      {
        symbol: "Rising Pure Smoke",
        meaning: "The soothing smoke of sacred herbs and ghee purifying the surrounding air and atmosphere, carrying mantras."
      }
    ],
    contemplationPrompt: "Mentally offer your fears, jealousies, and doubts into the sacred fire of Agni. Watch them burn to ashes, leaving your consciousness clean and bright."
  },
  {
    id: "hindu-temple",
    title: "The Summit Trishula of Kailash",
    tradition: "hinduism",
    traditionLabel: "Hindu Tradition",
    url: "https://images.unsplash.com/photo-1609137144813-94c632616238?auto=format&fit=crop&w=800&q=80",
    location: "Mount Kailash Summit Peaks",
    era: "Timeless Shaiva Meditation",
    shortCaption: "The majestic snowy ridges of Himalayan peaks matching Mount Kailash, representing the non-dual heights of Shaiva contemplation.",
    description: "Vedic architecture models the temple as a cosmic mountain (Mount Meru) bridging earth and sky. The majestic stone tower directs the wandering eye upward to the transcendent center, reminding us of the ultimate summit.",
    symbolismElements: [
      {
        symbol: "Intricately Carved Spire (Gopuram)",
        meaning: "Mount Meru, the cosmic axis, encouraging the human mind to rise above transient material struggles."
      },
      {
        symbol: "Stone Carving Layers",
        meaning: "The progressive stages of life, history, and spiritual growth stacked in unified cosmic order."
      },
      {
        symbol: "Pristine Sky Background",
        meaning: "Representing the unmanifest space of Brahman, surrounding all material architecture."
      }
    ],
    contemplationPrompt: "Imagine walking barefoot into a cool, stone inner-sanctum lit only by oil lamps, leaving behind the chaotic heat and noise of the outer world."
  },
  // CHRISTIANITY
  {
    id: "christian-cross",
    title: "Shafts of Infinite Redemption",
    tradition: "christianity",
    traditionLabel: "Christian Tradition",
    url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
    location: "Mount of the Cosmic Cross",
    era: "Ancient Apostolic Era",
    shortCaption: "The pristine Christian Cross silhouette against gold and amber skies, representing divine grace and absolute sacrifice.",
    description: "The Cross is transformed from an ancient Roman tool of execution into the supreme sign of universal reconciliation. It shows how divine grace pierces the depths of human sorrow and reconciles all fractures of humanity.",
    symbolismElements: [
      {
        symbol: "The Vertical Beam",
        meaning: "The descent of divine grace (Logos) from high heaven directly into the material world."
      },
      {
        symbol: "The Horizontal Beam",
        meaning: "The reach of unconditional love, embracing and reconciling all fractures of humanity."
      },
      {
        symbol: "The Intersection Center",
        meaning: "The point where the temporal meets the eternal, and human struggle meets deep forgiveness."
      }
    ],
    contemplationPrompt: "Contemplate the symbol of the Cross as a spiritual intersection. Where in your life can you find a point where human struggle meets deep, unmerited forgiveness?"
  },
  {
    id: "christian-jesus",
    title: "Light of the Mystical Shepherd",
    tradition: "christianity",
    traditionLabel: "Christian Tradition",
    url: "https://images.unsplash.com/photo-1548625361-155deee22337?auto=format&fit=crop&w=800&q=80",
    location: "The Cathedral of the Inner Shepherd",
    era: "Early Christian Roots",
    shortCaption: "An elegant gothic church fresco depicting sacred celestial guides with a holy golden aura, representing transcendental truth.",
    description: "Jesus Christ represents the Word (Logos) made flesh. This traditional icon portrays the Prince of Peace who walks through the valleys of trials to restore the individual soul back to safety with infinite mercy and love.",
    symbolismElements: [
      {
        symbol: "Luminous Halo (Aura)",
        meaning: "The absolute holiness and uncreated light of Christ that shines in the dark of trials."
      },
      {
        symbol: "The Book of Gospels",
        meaning: "The revealed word, guidelines of love, beatitudes, and peaceful guidance for life."
      },
      {
        symbol: "Two Fingers Raised in Blessing",
        meaning: "Depicts the dual divine and human natures of Christ unified in absolute empathy."
      }
    ],
    contemplationPrompt: "Reflect on Christ's invitation to 'love your enemies and pray for those who persecute you.' Allow your heart to release all grievances into unconditional love."
  },
  {
    id: "christian-cathedral",
    title: "Sovereign Stained-Glass Cathedral",
    tradition: "christianity",
    traditionLabel: "Christian Tradition",
    url: "https://images.unsplash.com/photo-1515224526905-51c7d77c7bb8?auto=format&fit=crop&w=800&q=80",
    location: "Notre Dame Cathedral Nave",
    era: "High Gothic Era",
    shortCaption: "Brilliant jewel-like stained-glass windows filter heavenly afternoon sunlight, casting divine red and blue patterns over the stone columns.",
    description: "Cathedral stained-glass windows were designed to act as 'sculptures of light'. As pilgrims entered the cavernous stone layouts, these luminous narrative screens spoke to the eye, mimicking the celestial New Jerusalem.",
    symbolismElements: [
      {
        symbol: "Deep Rose Window Design",
        meaning: "Represents the theological eye of God and the cyclical wheel of creation rotating around Christ."
      },
      {
        symbol: "Sapphire Blue Glass Panels",
        meaning: "Symbolizes the heavenly sky, supreme truth, and divine peace."
      },
      {
        symbol: "Ruby Red Glass Panels",
        meaning: "Symbolizes sacrificial love, vital spirit, fire of the Holy Spirit, and blood of martyrdom."
      }
    ],
    contemplationPrompt: "Watch the movement of sunlight through a tinted window. Think about how raw light must pass through varied colors and stories to display its full, hidden spectrum."
  },
  // ISLAM
  {
    id: "islam-mecca",
    title: "Orbits of the Monotheistic Core",
    tradition: "islam",
    traditionLabel: "Islamic Tradition",
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    location: "Sovereign Desert Horizon",
    era: "Primordial Abrahamic Foundation",
    shortCaption: "Starlit Islamic arches and holy minarets rising into the desert sky, representing community and universal devotion.",
    description: "The Kaaba in Mecca is Bayt Allah, the physical focus (Qibla) of Islamic prayers. Spreads of gold and black evoke the majestic focus of Tawaf—thousands of equal souls circling in unison, symbolizing the loss of ego in the ocean of divine monotheism.",
    symbolismElements: [
      {
        symbol: "The Sacred Kaaba",
        meaning: "Serving as the stationary focal point (Qibla) of monotheistic prayer across the globe."
      },
      {
        symbol: "The Circular Tawaf Orbits",
        meaning: "The circular paths of pilgrims, reflecting celestial nebula rotations around a singular core."
      },
      {
        symbol: "The Kiswah (Black and Gold Silk)",
        meaning: "A beautiful, solemn canopy embroidered with holy Quranic verses, signifying divine majesty."
      }
    ],
    contemplationPrompt: "Visualize yourself standing as one of millions of equal human beings, dressed in simple white cloth, where status, race, and language dissolve in unity."
  },
  {
    id: "islam-blue-mosque",
    title: "Centering the Domes of Peace",
    tradition: "islam",
    traditionLabel: "Islamic Tradition",
    url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
    location: "Tranquil Garden of Istanbul",
    era: "17th Century Ottoman Golden Age",
    shortCaption: "The beautiful vaulted domes of the Sultan Ahmed Mosque illuminated at twilight, showing symmetry and geometric peace.",
    description: "Mosque design is a physical reflection of cosmic balance (Mizan). Symmetrical arches and layered domes represent the vaulted dome of heaven, expanding the observer's mind to hear the beautiful, quiet echo of the Divine.",
    symbolismElements: [
      {
        symbol: "Symmetrical Domes",
        meaning: "The central and semidomes of the mosque, representing the vaulted dome of heaven and divine protection."
      },
      {
        symbol: "Cascading Archways",
        meaning: "The balanced layout representing the divine cosmic order and precision (Mizan)."
      },
      {
        symbol: "Illuminated Minarets",
        meaning: "Rising straight toward the heavens, echoing the Call to Prayer (Adhan) declaring monotheistic peace."
      }
    ],
    contemplationPrompt: "Let your mind settle into the symmetrical rhythm of the domes. Breathe out all inner dispersion, centering your attention on the silent vault of pure consciousness."
  },
  {
    id: "islam-medina",
    title: "The Prophet's Sanctuary (Medina Celestial Spire)",
    tradition: "islam",
    traditionLabel: "Islamic Tradition",
    url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80",
    location: "Al-Masjid an-Nabawi, Medina",
    era: "Early Islamic Migration Era",
    shortCaption: "Stately lit minarets and standard arches of Al-Masjid an-Nabawi in Medina rising into the night, symbolizing community and mercy.",
    description: "Al-Masjid an-Nabawi contains the resting place of Prophet Muhammad. Its architecture has evolved into a global symbol of refined Islamic design, blending starry illumination with mathematical lattices, white marble, and geometric perfection.",
    symbolismElements: [
      {
        symbol: "Tall Symmetrical Minarets",
        meaning: "Represent hands or spires pointed skyward, continually sounding the call to prayer (Adhan) towards heavenly truth."
      },
      {
        symbol: "The Green Dome",
        meaning: "The central crown marking the historic home and final resting place of the Prophet, invoking mercy and cosmic peace."
      },
      {
        symbol: "Sober White Marble Floors",
        meaning: "Symbolize cleanliness, clarity, and cool pathways for reflection under hot desert climates."
      }
    ],
    contemplationPrompt: "Reflect on Medina's legacy as a sanctuary that historically offered safety and brotherhood to the marginalized. How can you provide a safe space of listening for others?"
  },
  // BUDDHISM & JAINISM
  {
    id: "buddhism-buddha",
    title: "The Mandala of Nirvana",
    tradition: "buddhism_jainism",
    traditionLabel: "Buddhist Tradition",
    url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80",
    location: "Silent Grove of Bodhi",
    era: "Ancient Sarnath Core",
    shortCaption: "A beautiful golden Buddha sculpture in deep state of Nirvana, radiating absolute calm, self-restraint and mindfulness.",
    description: "Mindfulness and Nirvana represent the cessation of outer craving. The eight-spoked wheel symbolizes the Noble Eightfold Path, rolling through history to illuminate self-realization and universal compassion.",
    symbolismElements: [
      {
        symbol: "The Hub",
        meaning: "Represents moral discipline (Sila), which stabilizes and focuses the wandering mind."
      },
      {
        symbol: "The Eight Spoke Ribs",
        meaning: "The Noble Eightfold Path (Right View, Resolve, Speech, Action, Livelihood, Effort, Mindfulness, Concentration)."
      },
      {
        symbol: "The Perfect Outer Rim",
        meaning: "Mindful concentration (Samadhi) which binds the entire spiritual life into a unified whole."
      }
    ],
    contemplationPrompt: "Sit straight, lower your eyelids slightly, and rest your hands gently on your lap. Exhale all tension, finding the gold of quiet awareness within you."
  },
  {
    id: "jainism-temple",
    title: "Sanctuary of the Spotless Soul",
    tradition: "buddhism_jainism",
    traditionLabel: "Jain Tradition",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    location: "Peak of Absolute Ahimsa",
    era: "Medieval Mount Abu",
    shortCaption: "The beautifully lit corridors of carvings representing the ethical structure of pure non-violence (Ahimsa) and detached conductors.",
    description: "The core Jain principle of Ahimsa (non-violence) requires keeping the soul free from heavy dark karma. Clean grey and marble-white structures represent the beauty of ethical discipline, constructed with utter respect for every tiny living creature.",
    symbolismElements: [
      {
        symbol: "Pristine White Marble",
        meaning: "The pure, unbound living soul (Jiva) stripped of its sticky material karma."
      },
      {
        symbol: "Detailed Symmetrical Pillars",
        meaning: "The structures of Right Faith, Right Knowledge, and Right Conduct holding up the spiritual life."
      },
      {
        symbol: "Infinite Ceiling Geometries",
        meaning: "The multidimensionality of viewpoints (Anekantavada) combined into a singular architectural harmony."
      }
    ],
    contemplationPrompt: "Contemplate the principle of Ahimsa (non-injury) not just as physical refraining, but as a mental choice to harbor zero angry thoughts toward any creature today."
  },
  // JUDAISM
  {
    id: "judaism-western-wall",
    title: "Stone Courses of the Covenant",
    tradition: "judaism",
    traditionLabel: "Jewish Tradition",
    url: "https://images.unsplash.com/photo-1512588150405-bc3e6b530121?auto=format&fit=crop&w=800&q=80",
    location: "Second Temple Mount Base",
    era: "Second Temple Foundations",
    shortCaption: "Jerusalem limestone courses and perspective dome silhouettes, representing covenants, heritage and prayer.",
    description: "The Western Wall stands as the enduring retaining wall of the Jerusalem Temple. The giant ashlar blocks are stacked with gold-leaf seams, demonstrating hope, memory, and the enduring covenant connecting generations.",
    symbolismElements: [
      {
        symbol: "Massive Ashlar Limestone",
        meaning: "The heavy foundation blocks, standing as silent physical witnesses of ancient covenants."
      },
      {
        symbol: "Tucked Paper Petitions",
        meaning: "Thousands of handwritten hopes packed securely into cracks, going straight to the Shekhinah."
      },
      {
        symbol: "Weathered Surfaces",
        meaning: "The tears, survival, and persistent hope of seekers down through centuries of history."
      }
    ],
    contemplationPrompt: "If you could write down one deep hope or prayer of release on a tiny slip of paper to leave in an ancient wall, what would it be?"
  },
  // SIKHISM
  {
    id: "sikhism-golden-temple",
    title: "Nectar Reflection of the Pool",
    tradition: "sikhism",
    traditionLabel: "Sikh Tradition",
    url: "https://images.unsplash.com/photo-1597176116047-876a3239eef8?auto=format&fit=crop&w=800&q=80",
    location: "Sri Harmandir Sahib Amritsar",
    era: "16th Century Founder Era",
    shortCaption: "The absolute gold radiance of Sri Harmandir Sahib reflecting perfectly over the holy waters during golden hour.",
    description: "The Golden Temple is designed as a sanctuary of universal welcome, open on all four sides to declare that all classes, races, and creeds are equal. It symbolizes the divine name (Naam) echoing in the quiet heart.",
    symbolismElements: [
      {
        symbol: "Golden Shrine of Amritsar",
        meaning: "The sovereign light and majesty of the Formless Creator (Akal Purakh)."
      },
      {
        symbol: "Amrit Sarovar (Nectar Pool)",
        meaning: "Vast quiet blue waters, signifying complete inner purification of mind and body through truth."
      },
      {
        symbol: "Four Open Entrances",
        meaning: "The explicit rejection of caste divisions, welcoming all humanity to sit side-by-side."
      }
    ],
    contemplationPrompt: "Reflect on Harmandir Sahib's daily kitchen (Langar), serving free, delicious vegetarian hot meals to over 100,000 visitors daily, where kings and beggars sit cross-legged on the floor side-by-side."
  },
  // CLASSICAL MYTHS
  {
    id: "classical-parthenon",
    title: "Columns of Symmetrical Reason",
    tradition: "classical_myths",
    traditionLabel: "Classical Mythology",
    url: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=800&q=80",
    location: "High Citadel of Athens",
    era: "Classical Greek Golden Age",
    shortCaption: "The mathematical symmetry of pristine geometric white Doric columns of the Athenian Acropolis under clear blue sky.",
    description: "The Parthenon in Athens was dedicated to Athena, the goddess of critical reason, strategy, and mathematics, representing the ancient love for 'logos'—the belief that the universe is organized in beautiful harmony.",
    symbolismElements: [
      {
        symbol: "Doric Columns",
        meaning: "Expressing mathematical symmetry, golden ratios, and the foundation of civic justice."
      },
      {
        symbol: "The Acropolis Elevation",
        meaning: "Lifting human minds out of the mundane mud to stand in the fresh, clean atmosphere of high principles."
      },
      {
        symbol: "Mathematical Symmetry",
        meaning: "The alignment of critical logic and nature, showing our cosmic journey has built-in balance."
      }
    ],
    contemplationPrompt: "Contemplate classical Greece's love for beauty and mathematical proportionality. How can we bring balance, order, and critical reasoning to our emotional spiritual journeys?"
  }
];

export function getSymbolismElementsForReligion(religion: string): { symbol: string; meaning: string }[] {
  const rel = religion.toLowerCase();
  switch (rel) {
    case "hinduism":
      return [
        {
          symbol: "Garbhagriha (Sanctum)",
          meaning: "The silent, dark inner cave representing the deep, divine spark residing within every human soul."
        },
        {
          symbol: "The Ascending Spire (Shikhara)",
          meaning: "The vertical design reaching for the heavens, representing the cosmic axis and elevation of human thoughts."
        },
        {
          symbol: "Sanskrit Chant Sound Waves",
          meaning: "Sonic currents believed to cleanse the psychological atmosphere of doubt, emotional debris, and clutter."
        }
      ];
    case "islam":
      return [
        {
          symbol: "Sacred Geometrical Balance",
          meaning: "Perfect, infinitely repeating ceramic tile meshes showing the divine order (Mizan) inherent in all creation."
        },
        {
          symbol: "The Graceful Minaret Column",
          meaning: "A majestic vertical pointer channeling human prayers up to the formless One (Allah) while stating monotheism."
        },
        {
          symbol: "Arabesque Calligraphy Screen",
          meaning: "Beautiful, hand-drawn Quranic words transforming stone facades into luminous channels of verbal revelation."
        }
      ];
    case "christianity":
      return [
        {
          symbol: "Cathedral Stained-Glass",
          meaning: "Celestial and outer sunlight filtered into rich ruby and sapphire hues, conveying stories of grace."
        },
        {
          symbol: "The Cross Intersection",
          meaning: "The meeting of the vertical coordinate (divine reconciliation) and the horizontal coordinate (universal brotherly love)."
        },
        {
          symbol: "Sacred Altar of Fellowship",
          meaning: "The structural table signifying communion, sacrifice, and the intimate gathering of searchers surrounding grace."
        }
      ];
    case "judaism":
      return [
        {
          symbol: "Monumental Ashlar Blocks",
          meaning: "Deep, persistent limestone courses standing through empires, symbolizing enduring covenant and tribal memories."
        },
        {
          symbol: "Handwritten Paper Notes",
          meaning: "Whispered hopes packed tightly into stone fissures, signifying unmediated personal relation with God."
        },
        {
          symbol: "The Ner Tamid (Eternal Light)",
          meaning: "A soft, tireless flame lighting sacred spaces, representing the eternal path of Torah guidance."
        }
      ];
    case "buddhism":
    case "buddhism_jainism":
      return [
        {
          symbol: "Pure Lotus Seat (Asana)",
          meaning: "Blossoming in spotless purity above sticky, murky waters, representing rising above worldly attachments."
        },
        {
          symbol: "The Half-Closed Gaze",
          meaning: "A balanced middle sight looking inward to silence the mind while remaining actively compassionate to the world."
        },
        {
          symbol: "Eight-Spoked Dharma Wheel",
          meaning: "Signifying the turning wheel of spiritual rules, aligning action and thought with cosmic truth."
        }
      ];
    case "jainism":
      return [
        {
          symbol: "Crystalline Marble Pillars",
          meaning: "Reflecting absolute non-injury (Ahimsa) and cleanliness of the soul from heavy karma particles."
        },
        {
          symbol: "Motionless Tirthankara Stature",
          meaning: "The silent posturing of spiritual conquerors, completely free from emotional tides and sensory drives."
        },
        {
          symbol: "Symmetrical Ceiling Labyrinths",
          meaning: "The beautiful multiplicity of viewpoints (Anekantavada) combined into a singular architectural harmony."
        }
      ];
    case "sikhism":
      return [
        {
          symbol: "Four Open Cardinal Doors",
          meaning: "An explicit welcome to all four corners of humanity, abolishing religious class and tribal divisions."
        },
        {
          symbol: "The Amrit Sarovar (Pool of Nectar)",
          meaning: "Vast quiet blue waters, signifying purification of the mind through complete immersion in the divine name (Naam)."
        },
        {
          symbol: "The Sovereign Golden Crown",
          meaning: "Sovereign spiritual light and golden radiance, reminding seekers of the absolute majesty of Akal Purakh."
        }
      ];
    default:
      return [
        {
          symbol: "Symmetric Column Rows",
          meaning: "The balance of logic, critical reason, and artistic rhythm holding up our spiritual exploration."
        },
        {
          symbol: "Elevated Stone Citadel",
          meaning: "Lifting our minds out of mud and mundane worries to stand in the fresh, clean atmosphere of high principles."
        },
        {
          symbol: "Geometric Proportion",
          meaning: "The alignment of mathematics and nature, proving that our cosmic journey has built-in balance."
        }
      ];
  }
}

export function getSpiritualImageForBook(bookKey: string, religion: string): { url: string; caption: string } {
  const key = bookKey.toLowerCase();
  const rel = religion.toLowerCase();
  
  if (key === "bhagavad_gita" || key.includes("gita") || key.includes("krishna") || key === "bhagavata_purana") {
    return {
      url: "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=800&q=80",
      caption: "Vibrant visual representation of Lord Krishna playing his divine flute, representing supreme love (Bhakti) and cosmic play (Lila)."
    };
  }
  if (key === "shiva_purana" || key === "linga_purana" || key.includes("shiva") || key.includes("kailash")) {
    return {
      url: "https://images.unsplash.com/photo-1609137144813-94c632616238?auto=format&fit=crop&w=800&q=80",
      caption: "Sovereign illustration of supreme Lord Shiva meditating in absolute quietude, representing transcendence and yoga."
    };
  }
  if (key === "ramayana" || key.includes("rama") || key.includes("sundara") || key === "skanda_purana") {
    return {
      url: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80",
      caption: "Gilded visualization of Lord Rama, representing the path of righteousness (Dharma) defeating pride."
    };
  }
  if (key.includes("rigveda") || key.includes("veda") || key === "agni_purana" || key === "markandeya_purana" || key === "devi_bhagavata_purana" || key === "kalika_purana") {
    return {
      url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
      caption: "The sacred fire of Agni rising with prayers from a traditional Vedic fire sacrifice representation."
    };
  }
  if (key === "brahmanda_purana") {
    return {
      url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=800&q=80",
      caption: "The Supreme OM (Aum) Resonance on cosmic background, representing the origin of the Brahmanda."
    };
  }
  if (key === "bhavishya_purana") {
    return {
      url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=800&q=80",
      caption: "Glowing OM symbol integrated with galactic nebulae, representing cyclic future evolution."
    };
  }
  if (key === "upanishads") {
    return {
      url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=800&q=80",
      caption: "Sacred OM symbol, representing traditional Indian sages seeking non-dual Upanishadic truth."
    };
  }
  if (rel === "hinduism") {
    return {
      url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=800&q=80",
      caption: "The Supreme OM (Aum) Resonance, representing the core essence of Sanatana Dharma."
    };
  }

  // ISLAM
  if (key === "quran" || key.includes("quran") || key.includes("surah") || rel === "islam") {
    if (key.includes("medina")) {
      return {
        url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80",
        caption: "The exquisite illuminated minarets of Medina celestial shrine."
      };
    }
    if (key.includes("mecca") || key.includes("hadith")) {
      return {
        url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
        caption: "Starlit Islamic arches and minarets in deep evening sky, invoking inner peace."
      };
    }
    return {
      url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
      caption: "The historic Sultan Ahmed Mosque illuminated at dusk, symbolizing ceasefire peace."
    };
  }

  // CHRISTIANITY
  if (key.includes("gospel") || key.includes("jesus") || key.includes("bible") || key.includes("testament") || rel === "christianity") {
    if (key.includes("cross") || key.includes("revelation")) {
      return {
        url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
        caption: "The sacred Christian Cross silhouette against gold/amber skies, representing eternal grace and reconciliation."
      };
    }
    return {
      url: "https://images.unsplash.com/photo-1515224526905-51c7d77c7bb8?auto=format&fit=crop&w=800&q=80",
      caption: "Vibrant stained glass reflecting the serene radiance of Christ."
    };
  }

  // JUDAISM
  if (key.includes("torah") || key.includes("tanakh") || key.includes("hebrew") || key.includes("talmud") || rel === "judaism") {
    return {
      url: "https://images.unsplash.com/photo-1512588150405-bc3e6b530121?auto=format&fit=crop&w=800&q=80",
      caption: "Ancient limestone courses and perspectives of Jerusalem."
    };
  }

  // BUDDHISM / JAINISM
  if (key.includes("dhammapada") || key.includes("buddha") || key.includes("sutta") || rel === "buddhism") {
    return {
      url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80",
      caption: "A magnificent golden Buddha sitting in serene meditation, representing the Path to cease suffering."
    };
  }
  if (key.includes("sutra") || key.includes("jain") || rel === "jainism") {
    return {
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      caption: "Exquisite warm-lit corridors of historical stone pillars, celebrating pure non-violence."
    };
  }

  // SIKHISM
  if (key.includes("guru") || key.includes("granth") || rel === "sikhism") {
    return {
      url: "https://images.unsplash.com/photo-1597176116047-876a3239eef8?auto=format&fit=crop&w=800&q=80",
      caption: "The elegant Golden Temple reflecting in the Amrit Sarovar Pool of Nectar."
    };
  }

  // PRAYERS
  if (rel === "prayers") {
    return {
      url: "https://images.unsplash.com/photo-1514907283155-ea5f4094c70c?auto=format&fit=crop&w=800&q=80",
      caption: "Vibrations of the Silent Voice: Dozens of beautiful warm prayer candles burning in absolute quietness."
    };
  }

  // STORIES (HISTORY & MYTHOLOGY)
  if (rel === "history" || rel === "mythology") {
    return {
      url: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=800&q=80",
      caption: "The Celestial Pilgrim's Trail: A silhouette pilgrim navigating high passes, representing moral epics of sacred narratives."
    };
  }

  // FALLBACK
  return {
    url: "https://images.unsplash.com/photo-1504052434569-70ad58ebd47a?auto=format&fit=crop&w=800&q=80",
    caption: "The Architecture of the Divine Word: Gold-line details on vintage scriptures, representing cosmic order."
  };
}

export interface InteractiveArtGalleryProps {
  currentBook?: ScriptureBook | null;
  notes?: any[];
  onSaveNoteToJournal?: (note: { religion: any; bookKey: string; bookTitle: string; reference: string; noteText: string }) => Promise<{ success: boolean; limitReached?: boolean }>;
  onSetReaderBackground?: (url: string) => void;
  isAdmin?: boolean;
  galleryLocked?: boolean;
}

export function InteractiveArtGallery({ 
  currentBook,
  notes,
  onSaveNoteToJournal,
  onSetReaderBackground,
  isAdmin = false,
  galleryLocked = false
}: InteractiveArtGalleryProps = {}) {
  if (galleryLocked && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 max-w-lg mx-auto animate-fade-in text-slate-100" id="gallery-locked-message">
        <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-pulse">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold font-sans text-white tracking-tight">Interactive Art Gallery is Locked</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            The application administrator has temporarily suspended access to the Sacred Interactive Art section and custom background controllers to protect the quiet atmosphere of contemplation and maintain canonical icons.
          </p>
        </div>
        <div className="pt-2 text-xs text-slate-500 font-mono">
          Security Policy Status: LOCKED BY ADMINISTRATOR
        </div>
      </div>
    );
  }

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArt, setSelectedArt] = useState<SacredArtItem | null>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("scripture_liked_art");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Custom user artworks uploader state and fields
  const [customArtworks, setCustomArtworks] = useState<SacredArtItem[]>(() => {
    try {
      const saved = localStorage.getItem("scripture_custom_artworks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [customTradition, setCustomTradition] = useState<"hinduism" | "christianity" | "islam" | "buddhism_jainism" | "judaism" | "sikhism" | "classical_myths">("hinduism");
  const [customLocation, setCustomLocation] = useState<string>("");
  const [customEra, setCustomEra] = useState<string>("");
  const [customShortCaption, setCustomShortCaption] = useState<string>("");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");

  // Symbols list builder within uploader
  const [symbolsDraft, setSymbolsDraft] = useState<{ symbol: string; meaning: string }[]>([]);
  const [symbolName, setSymbolName] = useState<string>("");
  const [symbolMeaning, setSymbolMeaning] = useState<string>("");

  const handleAddSymbolToDraft = () => {
    if (symbolName.trim() && symbolMeaning.trim()) {
      setSymbolsDraft([...symbolsDraft, { symbol: symbolName.trim(), meaning: symbolMeaning.trim() }]);
      setSymbolName("");
      setSymbolMeaning("");
    }
  };

  const handleRemoveSymbolFromDraft = (index: number) => {
    setSymbolsDraft(symbolsDraft.filter((_, i) => i !== index));
  };

  const handleSubmitCustomArt = () => {
    if (!customTitle.trim() || !customUrl.trim() || !customDescription.trim()) {
      setToastMessage("⚠️ Title, Image URL, and Description are required to create custom artwork!");
      return;
    }

    const newArt: SacredArtItem = {
      id: `user-art-${Date.now()}`,
      title: customTitle.trim(),
      tradition: customTradition,
      traditionLabel: customTradition === "hinduism" ? "Hindu Divine Theme" :
                      customTradition === "christianity" ? "Christian Holy Representation" :
                      customTradition === "islam" ? "Islamic Sacred Geometry Motif" :
                      customTradition === "buddhism_jainism" ? "Buddhist & Jain Contemplative Image" :
                      customTradition === "judaism" ? "Jewish Theological Sacred Artifact" :
                      customTradition === "sikhism" ? "Sikh Devotional Representation" : "Classical Mythological Motif",
      url: customUrl.trim(),
      location: customLocation.trim() || "Devotionally Inspired",
      creator: "User Inspired Portfolio",
      era: customEra.trim() || "Contemporary Era",
      shortCaption: customShortCaption.trim() || `An exquisite sacred artwork created dynamically to elevate scriptural study.`,
      description: customDescription.trim(),
      symbolismElements: symbolsDraft.length > 0 ? symbolsDraft : [
        { symbol: "Dynamic Motif", meaning: "A symbol of customized, interactive spiritual exploration." }
      ],
      contemplationPrompt: customPrompt.trim() || "Inhale peace, exhale noise. Observe this custom symbol and allow its holy symmetry to still your thoughts."
    };

    const updatedList = [newArt, ...customArtworks];
    setCustomArtworks(updatedList);
    try {
      localStorage.setItem("scripture_custom_artworks", JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }

    // Reset fields
    setCustomTitle("");
    setCustomUrl("");
    setCustomLocation("");
    setCustomEra("");
    setCustomShortCaption("");
    setCustomDescription("");
    setCustomPrompt("");
    setSymbolsDraft([]);
    setShowUploader(false);

    setToastMessage(`✨ "${newArt.title}" successfully added to your Sacred Art Portfolio!`);
  };

  // Interactive Quiz State inside the selected Art panel
  const [answeredSymbols, setAnsweredSymbols] = useState<Record<string, boolean>>({});
  const [showElementIndex, setShowElementIndex] = useState<number | null>(null);

  // Highlighted timeline segment state, timer reference and scrolling action
  const [highlightedTimelineId, setHighlightedTimelineId] = useState<string | null>(null);
  const timelineHighlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timelineHighlightTimerRef.current) {
        clearTimeout(timelineHighlightTimerRef.current);
      }
    };
  }, []);

  const handleViewInTimeline = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (timelineHighlightTimerRef.current) {
      clearTimeout(timelineHighlightTimerRef.current);
    }

    // Set timeline filter to All so we guarantee the target node is rendered
    setTimelineEra(0);
    setHighlightedTimelineId(itemId);

    // Scroll main window/view down/up to the timeline section smoothly
    const timelineSection = document.getElementById("interactive-timeline-section");
    if (timelineSection) {
      timelineSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Wait short delay to let layout re-calculate/render if timelineEra was updated
    setTimeout(() => {
      const targetNode = document.getElementById(`timeline-node-${itemId}`);
      if (targetNode && timelineScrollRef.current) {
        const container = timelineScrollRef.current;
        const containerWidth = container.clientWidth;
        const nodeOffsetLeft = targetNode.offsetLeft;
        const nodeWidth = targetNode.clientWidth;
        
        const scrollPosition = nodeOffsetLeft - (containerWidth / 2) + (nodeWidth / 2);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth"
        });
      }
    }, 180);

    // Clear the glowing pulsing highlight animation after 5 seconds
    timelineHighlightTimerRef.current = setTimeout(() => {
      setHighlightedTimelineId(null);
    }, 5000);
  };

  // Timeline zoom/density (1: Compact, 2: Standard, 3: Spacious) and historical era focus states
  const [timelineZoom, setTimelineZoom] = useState<number>(2);
  const [timelineEra, setTimelineEra] = useState<number>(0); // 0: All, 1: BCE Era, 2: 1st Millennium, 3: 2nd Millennium, 4: Modern & Timeless
  const [galleryEraFilter, setGalleryEraFilter] = useState<string>("all");

  // Dialogue overlay for specific era religious art characteristics
  const [activeEraInfoId, setActiveEraInfoId] = useState<string | null>(null);

  // Prompt Generator Generator State for customized religious art concepts
  const [conceptPrompt, setConceptPrompt] = useState<string>("");
  const [generatedArtOutput, setGeneratedArtOutput] = useState<{
    title: string;
    unplashSubstituteUrl: string;
    description: string;
    synergyAttributes: string[];
    meditationAesthetic: string;
  } | null>(null);
  const [isGeneratingConcept, setIsGeneratingConcept] = useState<boolean>(false);

  // Journal pin support state and toast message
  const [journalSavedIds, setJournalSavedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-expire toast messages
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Synchronize saved entries from the journal
  useEffect(() => {
    if (notes && notes.length > 0) {
      const savedTitles = notes
        .filter((n: any) => n.bookKey === "art-gallery")
        .map((n: any) => n.bookTitle);
      
      const savedIds = SACRED_ART_GALLERY
        .filter(item => savedTitles.includes(item.title))
        .map(item => item.id);
        
      if (currentBook && savedTitles.includes(`The Divine Resonance of ${currentBook.title}`)) {
        savedIds.push(`dynamic-${currentBook.key}`);
      }
      setJournalSavedIds(savedIds);
    } else {
      try {
        const savedNotesStr = localStorage.getItem("scripture_notes");
        if (savedNotesStr) {
          const localNotes = JSON.parse(savedNotesStr);
          const savedTitles = localNotes
            .filter((n: any) => n.bookKey === "art-gallery")
            .map((n: any) => n.bookTitle);
            
          const savedIds = SACRED_ART_GALLERY
            .filter(item => savedTitles.includes(item.title))
            .map(item => item.id);
            
          if (currentBook && savedTitles.includes(`The Divine Resonance of ${currentBook.title}`)) {
            savedIds.push(`dynamic-${currentBook.key}`);
          }
          setJournalSavedIds(savedIds);
        }
      } catch (err) {
        console.error("Failed to parse local notes in gallery sync:", err);
      }
    }
  }, [notes, currentBook]);

  // Handle saving an artwork to the personal journal
  const handleSaveToJournal = async (item: SacredArtItem) => {
    if (journalSavedIds.includes(item.id)) return;

    // Map traditions to match standard ReligionType
    let mappedReligion = "other";
    if (item.tradition === "hinduism") mappedReligion = "hinduism";
    else if (item.tradition === "christianity") mappedReligion = "christianity";
    else if (item.tradition === "islam") mappedReligion = "islam";
    else if (item.tradition === "judaism") mappedReligion = "judaism";
    else if (item.tradition === "buddhism_jainism") mappedReligion = "buddhism"; // Default to Buddhism for category mapping
    else if (item.tradition === "classical_myths") mappedReligion = "mythology";

    const noteText = `A visual study of the sacred artwork titled "${item.title}" from the historical period of ${item.era || "Ancient times"}.

Location: ${item.location || "Canonical Historic Site"}
Tradition: ${item.traditionLabel}

Artistic Description:
${item.shortCaption}

Contemplation Guidance:
${item.contemplationPrompt}`;

    const notePayload = {
      religion: mappedReligion as any,
      bookKey: "art-gallery",
      bookTitle: item.title,
      reference: item.era || "Ancient Era",
      noteText: noteText
    };

    if (onSaveNoteToJournal) {
      const res = await onSaveNoteToJournal(notePayload);
      if (res && res.success) {
        setJournalSavedIds(prev => [...prev, item.id]);
        setToastMessage(`"${item.title}" successfully pinned to your reflection journal!`);
      }
    } else {
      try {
        const savedNotesStr = localStorage.getItem("scripture_notes");
        let localNotes = savedNotesStr ? JSON.parse(savedNotesStr) : [];
        
        // Check free limit of 5 entries
        const isUserSupporter = localStorage.getItem("scripture_is_supporter") === "true";
        if (!isUserSupporter && localNotes.length >= 5) {
          setToastMessage("Capacity limit reached (5 Entries). Please unlock unlimited journal space in the home tab!");
          return;
        }

        const newNote = {
          id: `note-${Date.now()}`,
          religion: mappedReligion,
          bookKey: "art-gallery",
          bookTitle: item.title,
          reference: item.era || "Ancient Era",
          noteText: noteText,
          createdTime: Date.now()
        };

        localNotes = [newNote, ...localNotes];
        localStorage.setItem("scripture_notes", JSON.stringify(localNotes));
        setJournalSavedIds(prev => [...prev, item.id]);
        setToastMessage(`"${item.title}" successfully pinned to your reflection journal!`);
      } catch (err) {
        console.error("Local save to journal failed:", err);
        setToastMessage("Could not save to local study journal.");
      }
    }
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes: string[];
    if (likedIds.includes(id)) {
      newLikes = likedIds.filter(item => item !== id);
    } else {
      newLikes = [...likedIds, id];
    }
    setLikedIds(newLikes);
    localStorage.setItem("scripture_liked_art", JSON.stringify(newLikes));
  };

  const handleGenerateConceptArt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptPrompt.trim()) return;

    setIsGeneratingConcept(true);
    setImageErrors(prev => {
      const copy = { ...prev };
      delete copy["synthesized"];
      return copy;
    });
    fetch("/api/art/synthesize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: conceptPrompt })
    })
    .then(res => {
      if (!res.ok) throw new Error("Synthesis failed");
      return res.json();
    })
    .then(data => {
      setGeneratedArtOutput({
        title: data.title,
        unplashSubstituteUrl: data.unplashSubstituteUrl,
        description: data.description,
        synergyAttributes: data.synergyAttributes,
        meditationAesthetic: data.meditationAesthetic
      });
      setIsGeneratingConcept(false);
    })
    .catch(err => {
      console.error("Art synthesis fetch failed, applying client backup:", err);
      // Client-side quick backup if endpoint has issues
      const query = conceptPrompt.toLowerCase();
      let themeUrl = "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=80";
      let themeTitle = "Glow of Divine Guidance";
      let themeAttr = ["Sacred Light", "Inner Contemplation", "Auspicious Vibe"];
      let themeMed = "Focus on the breathing rhythm of a flickering sacred lamp.";

      if (query.includes("cross") || query.includes("crucifix") || query.includes("redemption")) {
        themeUrl = "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80";
        themeTitle = "The Redemptive Cross in Mystic Dawn";
        themeAttr = ["Resurrection Grace", "Celestial Dawn", "Unconditional Compassion"];
        themeMed = "Visualize gold and ruby shards of stained glass resolving into unified white light.";
      } else if (query.includes("jesus") || query.includes("christ") || query.includes("church") || query.includes("christian") || query.includes("bible") || query.includes("shepherd")) {
        themeUrl = "https://images.unsplash.com/photo-1548625361-155deee22337?auto=format&fit=crop&w=800&q=80";
        themeTitle = "Light of the Mystical Shepherd";
        themeAttr = ["Divine Presence", "Golden Aura", "Merciful Guidance"];
        themeMed = "Reflect on Christ's invitation to let your heart release all grievances into unconditional love.";
      } else if (query.includes("shiva") || query.includes("kailash") || query.includes("yoga")) {
        themeUrl = "https://images.unsplash.com/photo-1609137144813-94c632616238?auto=format&fit=crop&w=800&q=80";
        themeTitle = "Silent Peak of Cosmic Asceticism";
        themeAttr = ["Mount Kailash Glow", "Quiet Void", "Consciousness Fire"];
        themeMed = "Imagine your thoughts settling like snow on the motionless peaks of Kailash.";
      } else if (query.includes("mosque") || query.includes("mecca") || query.includes("islam") || query.includes("medina")) {
        themeUrl = "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80";
        themeTitle = "Minaret Silhouette under Galactic Skies";
        themeAttr = ["Monotheistic Symmetry", "Starlit Devotion", "Sacred Geometric Peace"];
        themeMed = "Trace the infinite repeating lines of Islamic geometric star screens in your breath.";
      } else if (query.includes("buddha") || query.includes("zen") || query.includes("dharma")) {
        themeUrl = "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80";
        themeTitle = "The Transcendental Lotus Void";
        themeAttr = ["Nirvana Radiance", "Impermanency Glow", "Heart-Mind Emptiness"];
        themeMed = "Visualize a golden lotus blossom opening inside the quiet space of your chest.";
      } else if (query.includes("krishna") || query.includes("gita") || query.includes("gopi")) {
        themeUrl = "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=800&q=80";
        themeTitle = "The Sovereign Peacock & Sacred Flute";
        themeAttr = ["Vrindavan Vibe", "Bhakti Resonance", "Divine Playfulness"];
        themeMed = "Focus on the sweet silent song of the flute rising from the inner core of your consciousness.";
      } else if (query.includes("temple") || query.includes("shrine") || query.includes("rama")) {
        themeUrl = "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80";
        themeTitle = "The Sanctuary of Dharma’s Dawn";
        themeAttr = ["Auspicious Devotional Path", "Cosmic Truth Spark", "Sacred Symmetries"];
        themeMed = "Contemplate your mind as a pristine, silent temple interior lit only by quiet devotion.";
      } else if (query.includes("viking") || query.includes("norse") || query.includes("odin") || query.includes("thor")) {
        themeUrl = "https://images.unsplash.com/photo-1608988220025-a74ef43d463e?auto=format&fit=crop&w=800&q=80";
        themeTitle = "Ancestral Runestone of Mystic Fire";
        themeAttr = ["Odinic Sacrificial Wisdom", "Aurora Spark", "Yggdrasil Deep Roots"];
        themeMed = "Contemplate your spine as the World Tree, channeling skyward light deep into baseline ground roots.";
      }

      setGeneratedArtOutput({
        title: `Mystical Concept: ${themeTitle}`,
        unplashSubstituteUrl: themeUrl,
        description: `We synthesized a detailed symbolic visual profile based on your trigger "${conceptPrompt}". This prompt conjures an immersive, reverent interactive artwork utilizing ancient theological colors, accurate sacred symbols, and high-contrast ambient shadows.`,
        synergyAttributes: themeAttr,
        meditationAesthetic: themeMed
      });
      setIsGeneratingConcept(false);
    });
  };

  // Synchronize category selection on active scripture context switch
  useEffect(() => {
    if (currentBook) {
      const religionMap: Record<string, string> = {
        hinduism: "hinduism",
        islam: "islam",
        christianity: "christianity",
        judaism: "judaism",
        buddhism: "buddhism_jainism",
        jainism: "buddhism_jainism",
        sikhism: "sikhism",
        mythology: "classical_myths",
        history: "classical_myths",
        space: "classical_myths",
        prayers: "classical_myths",
        other: "sikhism"
      };
      const cat = religionMap[currentBook.religion] || "classical_myths";
      setSelectedCategory(cat);
    }
  }, [currentBook]);

  // Generate dynamic interactive sacred art item for active study context
  let dynamicItem: SacredArtItem | null = null;
  if (currentBook) {
    const defaultImg = getSpiritualImageForBook(currentBook.key, currentBook.religion);
    
    // Map religion field to gallery category field safely and robustly
    const mappedTradition: "hinduism" | "christianity" | "islam" | "buddhism_jainism" | "judaism" | "sikhism" | "classical_myths" = 
      currentBook.religion === "buddhism" || currentBook.religion === "jainism"
        ? "buddhism_jainism"
        : currentBook.religion === "mythology" || currentBook.religion === "history" || currentBook.religion === "space" || currentBook.religion === "prayers"
          ? "classical_myths"
          : currentBook.religion === "other"
            ? "sikhism"
            : (["hinduism", "christianity", "islam", "judaism", "sikhism"].includes(currentBook.religion)
                ? currentBook.religion as any
                : "classical_myths");

    dynamicItem = {
      id: `dynamic-${currentBook.key}`,
      title: `The Divine Resonance of ${currentBook.title}`,
      tradition: mappedTradition,
      traditionLabel: `🎯 Active Study Masterpiece`,
      url: currentBook.religion === "hinduism" ? getSpiritualImageForBook(currentBook.key, currentBook.religion).url : (currentBook.imageUrl || defaultImg.url),
      location: currentBook.title,
      era: "Present Study Journey",
      shortCaption: currentBook.imageCaption || `Custom rendered sacred representation designed to illuminate the inner meaning of ${currentBook.title}.`,
      description: currentBook.description,
      symbolismElements: getSymbolismElementsForReligion(currentBook.religion),
      contemplationPrompt: `Take a deep, conscious breath. Reflect on the verses of ${currentBook.title} that you are currently studying. Allow its light to enter your mind.`
    };
  }

  const activeGalleryList = [
    ...(dynamicItem ? [dynamicItem] : []),
    ...customArtworks,
    ...SACRED_ART_GALLERY
  ];

  const filteredArt = activeGalleryList.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.tradition === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.traditionLabel.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if item matches Era filter dropdown
    const meta = getTimelineMeta(item.id);
    let matchesEra = true;
    if (galleryEraFilter === "bce") {
      matchesEra = meta.year < 0;
    } else if (galleryEraFilter === "classical") {
      matchesEra = meta.year >= 0 && meta.year <= 1000;
    } else if (galleryEraFilter === "medieval") {
      matchesEra = meta.year > 1000 && meta.year <= 1900;
    } else if (galleryEraFilter === "modern") {
      matchesEra = meta.year > 1900;
    }

    return matchesCategory && matchesSearch && matchesEra;
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-br from-[#121218] via-amber-950/20 to-slate-900/40 border border-amber-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-2xl -z-10"></div>
        
        <div className="space-y-4 max-w-4xl relative">
          <div className="flex items-center space-x-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3,5 py-1 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase w-fit">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-amber-500" />
            <span>Exclusive Sacred Art Portfolio & Contemplation Desk</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-sans tracking-tight font-black text-white">
            Religious Art, Symbols & Holy Sites
          </h2>
          
          <p className="text-xs sm:text-base text-slate-300 font-serif leading-relaxed max-w-3xl">
            Explore centuries of divine art as spiritual technology. Click on any canonical visual to enter the <span className="text-amber-400 font-semibold">Symbolism Decoder & Meditation Desk</span>, exploring sacred geometry, traditional sites, and pure religious signs like the OM sign, Holy Cross, Kaaba minarets, and divine temple pillars.
          </p>
        </div>
      </div>

      {currentBook && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <span>🎯 Matched Study Context: {currentBook.title}</span>
              </h4>
              <p className="text-xs text-slate-300 font-serif leading-relaxed mt-0.5">
                The gallery has loaded specific spiritual iconography representing <strong className="text-amber-400">{currentBook.title}</strong> instead of generic placeholders. Select the dynamic masterpiece below to decode its deep sacred elements.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedCategory("all")}
            className="text-[10px] sm:text-xs font-mono font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg px-3 py-1.5 transition-all shrink-0 cursor-pointer"
          >
            Show All Traditions
          </button>
        </div>
      )}

       {/* SACRED ART CHRONOLOGY AND HISTORICAL EVOLUTION TIMELINE WITH INTEGRATED SLIDERS */}
      <div id="interactive-timeline-section" className="bg-[#0b0b0e] border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide">
                Sacred Art Epochs & Evolution
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-serif">
              Navigate the theological, historical, and aesthetic timelines of world religious masterpieces sequentially.
            </p>
          </div>
          
          {/* Scroll Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                if (timelineScrollRef.current) {
                  const scrollAmount = timelineZoom === 1 ? 240 : timelineZoom === 2 ? 320 : 400;
                  timelineScrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                }
              }}
              className="bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 p-2 rounded-xl transition-all border border-white/10 hover:border-amber-500/30 cursor-pointer"
              title="Scroll Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2 select-none">
              Swipe or Click Arrows
            </span>
            <button
              onClick={() => {
                if (timelineScrollRef.current) {
                  const scrollAmount = timelineZoom === 1 ? 240 : timelineZoom === 2 ? 320 : 400;
                  timelineScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
                }
              }}
              className="bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 p-2 rounded-xl transition-all border border-white/10 hover:border-amber-500/30 cursor-pointer"
              title="Scroll Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTROLS PANEL: ERA FOCUS SLIDER & VISUAL DENSITY ZOOM SLIDER */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
          
          {/* Slider 1: Specific Historical Period Zoom Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-sans font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Historical Era Zoom:
              </span>
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {timelineEra === 0 && "Full Spectrum (All Eras)"}
                {timelineEra === 1 && "Ancient Foundations (BCE)"}
                {timelineEra === 2 && "Apostolic & Classical (0-1000 CE)"}
                {timelineEra === 3 && "Medieval & Gothic (1001-1900 CE)"}
                {timelineEra === 4 && "Modern & Timeless (1900+ CE)"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              value={timelineEra}
              onChange={(e) => setTimelineEra(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer hover:accent-amber-400 transition-colors"
            />
            {/* Tick annotations */}
            <div className="flex justify-between text-[9px] font-mono text-slate-500 px-1 select-none">
              <span className={`${timelineEra === 0 ? "text-amber-400 font-bold" : ""}`}>All</span>
              <span className={`${timelineEra === 1 ? "text-amber-400 font-bold" : ""}`}>BCE Era</span>
              <span className={`${timelineEra === 2 ? "text-amber-400 font-bold" : ""}`}>0-1000 CE</span>
              <span className={`${timelineEra === 3 ? "text-amber-400 font-bold" : ""}`}>1001-1900</span>
              <span className={`${timelineEra === 4 ? "text-amber-400 font-bold" : ""}`}>Timeless</span>
            </div>
          </div>

          {/* Slider 2: Display Density Zoom level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-sans font-bold text-slate-300 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                Display Density Zoom:
              </span>
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {timelineZoom === 1 && "High (Compact Nodes)"}
                {timelineZoom === 2 && "Balanced (Standard View)"}
                {timelineZoom === 3 && "Detailed (Spacious Canvas)"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={timelineZoom}
              onChange={(e) => setTimelineZoom(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer hover:accent-amber-400 transition-colors"
            />
            {/* Tick annotations */}
            <div className="flex justify-between text-[9px] font-mono text-slate-500 px-1 select-none">
              <span className={`${timelineZoom === 1 ? "text-amber-400 font-bold" : ""}`}>Compact</span>
              <span className={`${timelineZoom === 2 ? "text-amber-400 font-bold" : ""}`}>Standard</span>
              <span className={`${timelineZoom === 3 ? "text-amber-400 font-bold" : ""}`}>Spacious</span>
            </div>
          </div>

        </div>

        {/* Timeline Slider Track Container */}
        {(() => {
          // Perform filtering on chronological items
          const filteredTimelineList = [...activeGalleryList]
            .filter((item) => {
              if (timelineEra === 0) return true;
              const meta = getTimelineMeta(item.id);
              if (timelineEra === 1) { // BCE Era
                return meta.year < 0;
              }
              if (timelineEra === 2) { // 0 - 1000 CE
                return meta.year >= 0 && meta.year <= 1000;
              }
              if (timelineEra === 3) { // 1001 - 1900 CE
                return meta.year > 1000 && meta.year <= 1900;
              }
              if (timelineEra === 4) { // Modern & Timeless (> 1900 CE)
                return meta.year > 1900;
              }
              return true;
            })
            .sort((a, b) => getTimelineMeta(a.id).year - getTimelineMeta(b.id).year);

          if (filteredTimelineList.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl space-y-3 min-h-[200px]">
                <Sparkles className="w-8 h-8 text-amber-500/30 animate-pulse" />
                <div className="space-y-1">
                  <h5 className="text-sm font-sans font-bold text-slate-300">No Historical Matches</h5>
                  <p className="text-xs text-slate-500 font-serif max-w-sm">
                    No masterpiece art pieces match this specific era focus. Slider filter narrows historical timelines to highlight period density. Slide back or select another tier to explore.
                  </p>
                </div>
              </div>
            );
          }

          // Dynamic layout metrics depending on the visual zoom selected
          const trackTopStyle = 
            timelineZoom === 1 ? "top-[54px]" : 
            timelineZoom === 2 ? "top-[80px]" : "top-[104px]";

          return (
            <div 
              ref={timelineScrollRef}
              className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-amber-500/20 pb-4 select-none relative"
              style={{ scrollBehavior: "smooth" }}
            >
              {/* Horizontal Track Line (perfect centering based on node height) */}
              <div 
                className={`absolute left-8 right-8 h-0.5 bg-gradient-to-r from-amber-500/10 via-amber-500/40 to-amber-500/10 -z-0`}
                style={{ top: timelineZoom === 1 ? "54px" : timelineZoom === 2 ? "80px" : "104px" }}
              ></div>

              <div className="flex gap-6 pl-4 pr-12 min-w-max relative z-10 pt-2 pb-2">
                {filteredTimelineList.map((item, index, arr) => {
                  const meta = getTimelineMeta(item.id);
                  const isDynamic = item.id.startsWith("dynamic-");
                  
                  // Zoom configurations
                  const cardWidthClass = 
                    timelineZoom === 1 ? "w-48" : 
                    timelineZoom === 2 ? "w-72" : "w-105 max-w-sm";

                  const verticalLineHeight = 
                    timelineZoom === 1 ? "h-6" : 
                    timelineZoom === 2 ? "h-10" : "h-14";

                  const imageSizeClass = 
                    timelineZoom === 1 ? "w-12 h-12" : 
                    timelineZoom === 2 ? "w-20 h-20" : "w-28 h-28";

                  const badgeClass = 
                    timelineZoom === 1 ? "px-2 py-0.5 text-[9px]" : 
                    timelineZoom === 2 ? "px-3 py-1 text-[10px] sm:text-xs" : "px-4 py-1.5 text-xs sm:text-sm font-bold";

                  const lineClampClass = 
                    timelineZoom === 1 ? "line-clamp-1 text-[10px] leading-snug" : 
                    timelineZoom === 2 ? "line-clamp-2 text-[11px] leading-relaxed" : "line-clamp-6 text-xs sm:text-sm leading-relaxed";

                  const titleFontSizeClass = 
                    timelineZoom === 1 ? "text-[10px] font-bold line-clamp-1" : 
                    timelineZoom === 2 ? "text-xs sm:text-sm font-bold line-clamp-1" : "text-sm sm:text-base font-extrabold line-clamp-2";

                  const isNodeHighlighted = highlightedTimelineId === item.id;

                  return (
                    <div 
                      key={item.id}
                      id={`timeline-node-${item.id}`}
                      className={`${cardWidthClass} shrink-0 flex flex-col items-center text-center space-y-4 group transition-all relative ${
                        isNodeHighlighted 
                          ? "bg-amber-500/5 ring-2 ring-amber-500/40 rounded-2xl p-2 -my-2" 
                          : ""
                      }`}
                    >
                      {/* Highlighting Beacon Badge */}
                      {isNodeHighlighted && (
                        <div className="absolute -top-6 bg-amber-500 text-black font-mono font-bold text-[9px] px-2 py-0.5 rounded-full shadow-lg z-25 flex items-center gap-1 animate-bounce uppercase tracking-wider">
                          <Sparkles className="w-2.5 h-2.5 shrink-0" /> Selected Era
                        </div>
                      )}

                      {/* Year Badge Header */}
                      <div className={`bg-black/95 rounded-full border border-amber-500/20 text-amber-400 font-mono tracking-tight shadow-md group-hover:border-amber-400/50 transition-all z-10 hover:scale-105 duration-200 flex items-center gap-1 my-0.5 select-none ${badgeClass} ${
                        isNodeHighlighted ? "border-amber-400 text-amber-300 ring-2 ring-amber-400/30" : ""
                      }`}>
                        <span>{meta.label}</span>
                        <button
                          id={`era-info-badge-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveEraInfoId(item.id);
                          }}
                          className="hover:text-amber-300 p-0.5 rounded transition-colors cursor-pointer text-amber-500/80 hover:scale-110 duration-150 relative"
                          title="Click to view full Era Art characteristics"
                        >
                          <Info className="w-3 h-3 shrink-0" />
                        </button>
                      </div>

                      {/* Connecting Vertical line to center circle */}
                      <div className={`w-0.5 ${verticalLineHeight} ${
                        isNodeHighlighted 
                          ? "bg-gradient-to-b from-amber-400 to-amber-500" 
                          : "bg-gradient-to-b from-amber-500/20 to-amber-500/60 group-hover:to-amber-400"
                      } transition-all`}></div>

                      {/* Timeline Node Point (Circular Preview) */}
                      <div 
                        onClick={() => {
                          setSelectedArt(item);
                          setAnsweredSymbols({});
                          setShowElementIndex(null);
                        }}
                        className={`rounded-full overflow-hidden border-2 cursor-pointer shadow-lg transform transition-all duration-300 relative shrink-0 ${imageSizeClass} ${
                          isNodeHighlighted
                            ? "border-amber-400 ring-4 ring-amber-400 shadow-amber-500/50 scale-110 animate-pulse"
                            : isDynamic 
                              ? "border-amber-400 ring-4 ring-amber-500/25 shadow-amber-500/35 scale-100 group-hover:scale-110" 
                              : "border-amber-500/30 group-hover:border-amber-400 group-hover:shadow-amber-500/20 scale-100 group-hover:scale-110"
                        }`}
                      >
                        {imageErrors[item.id] ? (
                          <div className="w-full h-full bg-gradient-to-br from-amber-950 to-slate-900 flex items-center justify-center text-amber-400 font-bold select-none">
                            <Sparkles className="w-5 h-5 opacity-70 animate-pulse" />
                          </div>
                        ) : (
                          <img 
                            src={item.url} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            onError={() => handleImageError(item.id)}
                          />
                        )}
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-4 h-4 text-amber-300 drop-shadow" />
                        </div>
                      </div>

                      {/* Timeline Content */}
                      <div className="space-y-1.5 px-3">
                        <div className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center justify-center gap-1.5">
                          <span className="truncate max-w-[150px]">{meta.period}</span>
                          <button
                            id={`era-info-btn-${item.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveEraInfoId(item.id);
                            }}
                            className="text-amber-500/80 hover:text-amber-300 p-0.5 rounded hover:bg-white/5 transition-all cursor-pointer hover:scale-110 active:scale-90"
                            title="Era Characteristics Info"
                          >
                            <Info className="w-2.5 h-2.5" />
                          </button>
                          {isDynamic && (
                            <span className="bg-amber-500/20 text-amber-300 text-[8px] px-1 py-0.5 rounded border border-amber-500/30 ml-1">
                              Active Context
                            </span>
                          )}
                        </div>
                        
                        <h4 
                          onClick={() => {
                            setSelectedArt(item);
                            setAnsweredSymbols({});
                            setShowElementIndex(null);
                          }}
                          className={`text-white font-sans group-hover:text-amber-300 transition-colors cursor-pointer leading-tight ${titleFontSizeClass}`}
                        >
                          {item.title}
                        </h4>

                        <p className={`text-slate-400 font-serif px-1 ${lineClampClass}`}>
                          {item.shortCaption}
                        </p>
                      </div>

                      {/* Progress Connecting line element (except last) */}
                      {index < arr.length - 1 && (
                        <div 
                          className="absolute -right-3 w-8 h-[2px] bg-amber-500/10 group-hover:bg-amber-400/20 z-0 hidden lg:block"
                          style={{ top: timelineZoom === 1 ? "54px" : timelineZoom === 2 ? "80px" : "104px" }}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ERA CHARACTERISTICS LIGHTBOX DIALOG OVERLAY */}
      {activeEraInfoId && (() => {
        const info = getEraInfo(activeEraInfoId);
        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
            <div 
              id="era-info-modal"
              className="bg-[#0c0c10] border border-amber-500/30 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Epoch Color Top Strip */}
              <div className="h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>
              
              {/* Close Button */}
              <button
                id="close-era-info-btn"
                onClick={() => setActiveEraInfoId(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all cursor-pointer border border-white/5 hover:border-white/10"
                title="Close"
              >
                <Maximize2 className="w-4 h-4 rotate-45" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Header Title Column */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#dfc384] font-bold">
                      {info.range} • {info.period}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-wide leading-snug">
                    {info.title}
                  </h3>
                </div>

                {/* Substantive Summary Block */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Artistic Overview & Purpose
                  </h4>
                  <p className="text-xs sm:text-sm font-serif text-slate-300 leading-relaxed">
                    {info.summary}
                  </p>
                </div>

                {/* Bulleted Characteristics Panel */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#dfc384] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Core Aesthetic Attributes & Symbols
                  </h4>
                  
                  <ul className="space-y-2.5">
                    {info.characteristics.map((feat, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-300">
                        <span className="text-amber-500 font-mono font-bold mt-0.5 shrink-0">
                          {idx + 1}.
                        </span>
                        <span className="font-sans leading-relaxed text-slate-200">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    id="confirm-era-info-btn"
                    onClick={() => setActiveEraInfoId(null)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-sans font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95"
                  >
                    Return to Chronology
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Grid Layout containing Interactive Art and Custom Prompt Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Gallery List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Controls Bar: Filter Tabs, Search, & Era Dropdown */}
          <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            
            {/* Search Input & Era Dropdown side-by-side */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1">
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  id="search-art-input"
                  type="text"
                  placeholder="Search sacred motifs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition-all font-sans"
                />
              </div>

              {/* Era Filter Dropdown */}
              <div className="relative flex-1 sm:max-w-[200px]">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-amber-500/80 shrink-0" />
                <select
                  id="gallery-era-dropdown"
                  value={galleryEraFilter}
                  onChange={(e) => setGalleryEraFilter(e.target.value)}
                  className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-200 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition-all font-sans cursor-pointer appearance-none"
                >
                  <option value="all" className="bg-[#0c0c10] text-[#e2e8f0]">All Eras</option>
                  <option value="bce" className="bg-[#0c0c10] text-[#e2e8f0]">Ancient Foundations (BCE)</option>
                  <option value="classical" className="bg-[#0c0c10] text-[#e2e8f0]">Apostolic & Classical</option>
                  <option value="medieval" className="bg-[#0c0c10] text-[#e2e8f0]">Medieval & Gothic</option>
                  <option value="modern" className="bg-[#0c0c10] text-[#e2e8f0]">Modern & Timeless</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <ChevronRight className="w-3.5 h-3.5 transform rotate-90" />
                </div>
              </div>

            </div>

            {/* Filter Pill List */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0 scrollbar-none justify-start shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
              {[
                { key: "all", label: "All" },
                { key: "hinduism", label: "Hindu" },
                { key: "christianity", label: "Christian" },
                { key: "islam", label: "Islamic" },
                { key: "buddhism_jainism", label: "Buddhist & Jain" },
                { key: "judaism", label: "Jewish" },
                { key: "sikhism", label: "Sikh" },
                { key: "classical_myths", label: "Classical" }
              ].map(opt => (
                <button
                  id={`filter-art-tab-${opt.key}`}
                  key={opt.key}
                  onClick={() => setSelectedCategory(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    selectedCategory === opt.key
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold"
                      : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Custom Artwork Creator Desk */}
          {isAdmin && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.01] border border-white/5 p-4 rounded-2xl gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-mono font-bold text-slate-300">Custom Sacred Masterpieces</h4>
                  <p className="text-[10px] text-slate-500 font-serif">Link your custom visuals by URL, map interactive symbolism hotspots, and project them inside your Scripture Reader!</p>
                </div>
                <button
                  id="toggle-custom-uploader-btn"
                  onClick={() => setShowUploader(!showUploader)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 text-amber-300 hover:text-white rounded-xl border border-amber-500/30 hover:border-amber-400/50 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showUploader ? "Close Art Creator" : "Custom Artwork Creator"}</span>
                </button>
              </div>

              {/* COLLAPSIBLE UPLOADER FORM */}
              {showUploader && (
                <div className="bg-[#0b0c10] border border-amber-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl animate-fade-in text-xs">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-sm font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Interactive Sacred Artwork Creator</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-serif mt-1">
                      Upload custom sacred representations, geometric mandalas, temple architecture, or classical religious iconography dynamically. Once created, you can instantly set any piece as a high-fidelity ambient background inside the scripture reading desk!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Side fields */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono font-semibold block">Artwork Title *</label>
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder="e.g., Mount Kailash Meditation"
                          className="w-full bg-[#070709] border border-white/10 p-2.5 rounded-lg focus:outline-none focus:border-amber-500/50 text-slate-200"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono font-semibold block">Image Link / Direct URL *</label>
                        <input
                          type="text"
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          placeholder="Paste any custom https:// images link here..."
                          className="w-full bg-[#070709] border border-white/10 p-2.5 rounded-lg focus:outline-none focus:border-amber-500/50 text-slate-200 font-mono"
                        />
                      </div>

                      {/* Curated Background presets for quick uploader fills */}
                      <div className="space-y-1 bg-white/[0.01] p-2 border border-white/5 rounded-lg">
                        <span className="text-[10px] text-slate-400 font-mono font-semibold block mb-1">Click a spiritual Unsplash wallpaper preset:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { name: "Sacred Lotus", url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80" },
                            { name: "Atmospheric Forest", url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80" },
                            { name: "Cathedral Windows", url: "https://images.unsplash.com/photo-1507608637739-2a965040d3a8?auto=format&fit=crop&w=1200&q=80" },
                            { name: "Sacred Fire Sparks", url: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1200&q=80" }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCustomUrl(preset.url);
                            if (!customTitle) setCustomTitle(preset.name);
                          }}
                          className="px-2 py-1 text-[9px] font-mono rounded bg-white/5 border border-white/5 hover:border-amber-500/25 text-slate-300 text-left truncate cursor-pointer hover:bg-white/10 transition-colors"
                          title={preset.name}
                        >
                          🌐 {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono font-semibold block">Tradition *</label>
                      <select
                        value={customTradition}
                        onChange={(e) => setCustomTradition(e.target.value as any)}
                        className="w-full bg-[#070709] border border-white/10 p-2 text-slate-200 rounded-lg outline-none focus:border-amber-500/50 cursor-pointer text-xs"
                      >
                        <option value="hinduism">Hindu Tradition</option>
                        <option value="christianity">Christian Tradition</option>
                        <option value="islam">Islamic Tradition</option>
                        <option value="buddhism_jainism">Buddhist & Jainism</option>
                        <option value="judaism">Jewish Tradition</option>
                        <option value="sikhism">Sikh Tradition</option>
                        <option value="classical_myths">Classical & Myths</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono font-semibold block">Historical Era</label>
                      <input
                        type="text"
                        value={customEra}
                        onChange={(e) => setCustomEra(e.target.value)}
                        placeholder="e.g., c. 1100 CE"
                        className="w-full bg-[#070709] border border-white/10 p-2 text-slate-200 rounded-lg focus:outline-none focus:border-amber-500/50 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side fields */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono font-semibold block">Origin / Visual Location</label>
                      <input
                        type="text"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        placeholder="e.g., Holy Mount temple sanctuary or Varanasi"
                        className="w-full bg-[#070709] border border-white/10 p-2 rounded-lg focus:outline-none focus:border-amber-500/50 text-slate-200 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono font-semibold block">Aesthetic Short Caption *</label>
                      <input
                        type="text"
                        value={customShortCaption}
                        onChange={(e) => setCustomShortCaption(e.target.value)}
                        placeholder="e.g., A minimalist geometric visualization representing infinite..."
                        className="w-full bg-[#070709] border border-white/10 p-2 rounded-lg focus:outline-none focus:border-amber-500/50 text-slate-200 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono font-semibold block">Detailed Description *</label>
                      <textarea
                        rows={2}
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="Relate the spiritual story, theological context, and inner aesthetics of this masterpiece..."
                        className="w-full bg-[#070709] border border-white/10 p-2 rounded-lg focus:outline-none focus:border-amber-500/50 text-slate-200 resize-none text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono font-semibold block">Contemplation Meditation Prompt</label>
                      <input
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g., Focus on the central point of the mandala..."
                        className="w-full bg-[#070709] border border-white/10 p-2 rounded-lg focus:outline-none focus:border-amber-500/50 text-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Interactive Symbolism Decoder additions */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 mt-2">
                    <span className="text-[10px] uppercase font-mono font-extrabold text-amber-400 tracking-wider flex items-center gap-1">
                      ✨ Tag Interactive Symbolism Elements (Decoder)
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Symbol (e.g. Lotus)"
                        value={symbolName}
                        onChange={(e) => setSymbolName(e.target.value)}
                        className="w-1/3 bg-[#070709] border border-white/10 p-1.5 rounded text-[11px] focus:outline-none focus:border-amber-500/50"
                      />
                      <input
                        type="text"
                        placeholder="Meaning (e.g. purity and rebirth)"
                        value={symbolMeaning}
                        onChange={(e) => setSymbolMeaning(e.target.value)}
                        className="flex-1 bg-[#070709] border border-white/10 p-1.5 rounded text-[11px] focus:outline-none focus:border-amber-500/50"
                      />
                      <button
                        type="button"
                        onClick={handleAddSymbolToDraft}
                        className="bg-amber-500 text-black font-semibold text-[11px] px-2.5 rounded cursor-pointer hover:bg-amber-400 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Display draft symbols lists */}
                    {symbolsDraft.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 max-h-[70px] overflow-y-auto">
                        {symbolsDraft.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px] font-mono">
                            <span className="text-amber-300 font-semibold">{item.symbol}:</span>
                            <span className="text-slate-400 truncate max-w-[120px]">{item.meaning}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSymbolFromDraft(idx)}
                              className="text-rose-400 hover:text-rose-200 cursor-pointer pl-1 font-bold text-[11px]"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Preview area if image set */}
              {customUrl && (
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-4">
                  <img
                    src={customUrl}
                    alt="Artwork Preview"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-lg border border-white/15 shadow shrink-0"
                    onError={(e) => {
                      (e.target as any).src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=120&q=80";
                    }}
                  />
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">Visual Artwork Direct Link Connected</span>
                    <span className="text-xs font-semibold text-slate-300 block truncate">{customTitle || "Untitled Draft"}</span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">✔ Referrer Policy & Cross-Origin Safe</span>
                  </div>
                </div>
              )}

              {/* Submit panel buttons */}
              <div className="pt-3 border-t border-white/5 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setCustomTitle("");
                    setCustomUrl("");
                    setCustomEra("");
                    setCustomLocation("");
                    setCustomShortCaption("");
                    setCustomDescription("");
                    setCustomPrompt("");
                    setSymbolsDraft([]);
                    setShowUploader(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 bg-white/5 hover:bg-white/10 hover:text-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Clear & Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitCustomArt}
                  className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-950/20 active:scale-95"
                >
                  Confirm & Save to Portfolio
                </button>
              </div>
            </div>
          )}
        </>
      )}

          {/* Grid display of Artwork Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredArt.map(item => {
              const isLiked = likedIds.includes(item.id);
              
              // Calculate if the art matches the currently selected timeline era slider
              const meta = getTimelineMeta(item.id);
              let isInActiveEra = true;
              if (timelineEra === 1) { // BCE Era
                isInActiveEra = meta.year < 0;
              } else if (timelineEra === 2) { // 0 - 1000 CE
                isInActiveEra = meta.year >= 0 && meta.year <= 1000;
              } else if (timelineEra === 3) { // 1001 - 1900 CE
                isInActiveEra = meta.year > 1000 && meta.year <= 1900;
              } else if (timelineEra === 4) { // Modern & Timeless (> 1900 CE)
                isInActiveEra = meta.year > 1900;
              }
              const isHighlightActive = timelineEra !== 0;

              return (
                <div
                  id={`art-card-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setSelectedArt(item);
                    setAnsweredSymbols({});
                    setShowElementIndex(null);
                  }}
                  className={`art-gallery-card group bg-[#0d0d12] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 flex flex-col hover:shadow-2xl ${
                    isHighlightActive
                      ? isInActiveEra
                        ? "border-2 border-amber-500 shadow-lg shadow-amber-500/[0.08] ring-2 ring-amber-500/20 -translate-y-1 scale-102"
                        : "border border-white/5 opacity-40 hover:opacity-100 scale-98"
                      : "border border-white/5 hover:border-amber-500/40 hover:shadow-amber-500/[0.02]"
                  }`}
                >
                  
                  {/* Art Image Frame with hover details */}
                  <div className="relative h-56 w-full overflow-hidden shrink-0">
                    {imageErrors[item.id] ? (
                      <div className="w-full h-full bg-gradient-to-br from-amber-950 to-slate-900 flex flex-col items-center justify-center text-amber-400 font-bold text-xs select-none p-4 text-center">
                        <Sparkles className="w-8 h-8 opacity-70 animate-pulse mb-1" />
                        <span className="text-[10px] text-slate-400 font-serif leading-tight">Masterpiece: {item.title}</span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(item.id)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/30 to-transparent"></div>
                    
                    {/* Floating Icons */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%] z-20">
                      <span className="bg-black/95 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest text-[#dfc384] uppercase border border-white/15">
                        {item.traditionLabel}
                      </span>
                      {isHighlightActive && isInActiveEra && (
                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-2 py-0.5 rounded text-[9px] font-mono font-extrabold tracking-wider flex items-center gap-1 shadow-lg animate-pulse border border-amber-400/30">
                          <Sparkles className="w-2.5 h-2.5" /> Epoch Focus
                        </span>
                      )}
                    </div>

                    <button
                      id={`like-art-btn-${item.id}`}
                      onClick={(e) => handleToggleLike(item.id, e)}
                      className="absolute top-3 right-3 bg-black/80 hover:bg-black p-2 rounded-full border border-white/10 transition-colors shadow-md z-10 text-slate-300 hover:text-amber-400"
                      title={isLiked ? "Saved to your Heart Study Portfolio" : "Save this artwork"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-amber-400 text-amber-400" : ""}`} />
                    </button>

                    <div className="absolute bottom-3 right-3 flex items-center space-x-1.5">
                      <span className="bg-black/95 px-2.5 py-1 rounded-lg text-[9px] text-amber-400 font-mono border border-white/10 flex items-center gap-1 shadow-lg transform group-hover:translate-x-0 transition-transform">
                        <Eye className="w-3 h-3 text-amber-400" />
                        <span>Decode Symbols</span>
                      </span>
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-1.5">
                      {/* Highlighted text styling if matches period focus */}
                      <h3 className={`text-base sm:text-lg font-sans font-bold tracking-tight transition-colors ${
                        isHighlightActive && isInActiveEra ? "text-amber-300" : "text-white group-hover:text-amber-300"
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {item.location || "Canonical Historic Site"}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed line-clamp-2">
                        {item.shortCaption}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className={isHighlightActive && isInActiveEra ? "text-amber-400 font-semibold" : ""}>
                          Era: {item.era || "Ancient"}
                        </span>
                        <span className="text-amber-500 group-hover:underline flex items-center gap-0.5">
                          Open Decoder <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>

                      {/* Card Action Buttons: View in Timeline & Save to Journal */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id={`view-in-timeline-btn-${item.id}`}
                          onClick={(e) => handleViewInTimeline(item.id, e)}
                          className="py-2.5 px-1.5 rounded-xl text-[10.5px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 hover:text-amber-300 hover:border-amber-500/45 flex items-center justify-center gap-1 transition-all duration-300 cursor-pointer"
                          title="Scroll the interactive timeline to this artwork's historical era"
                        >
                          <History className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                          <span>View in Timeline</span>
                        </button>

                        <button
                          id={`save-to-journal-btn-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveToJournal(item);
                          }}
                          className={`py-2.5 px-1.5 rounded-xl text-[10.5px] font-mono font-bold flex items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${
                            journalSavedIds.includes(item.id)
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                              : "bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10 hover:text-white"
                          }`}
                          title="Pin this sacred artwork study to your Reflection Journal"
                          disabled={journalSavedIds.includes(item.id)}
                        >
                          {journalSavedIds.includes(item.id) ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Pinned</span>
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Save Journal</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

            {filteredArt.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
                <Info className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-mono text-slate-400">No spiritual art matches your current filters.</p>
                <button
                  onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                  className="text-xs text-amber-400 underline font-mono cursor-pointer"
                >
                  Reset parameters
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Spiritual Prompt Synthesizer or Quick Contemplation */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section: Spiritual Art Concept Synthesizer */}
          <div className="bg-[#0e0e14] border border-white/10 rounded-2xl p-5 space-y-5 shadow-lg relative">
            <div className="absolute -top-3 right-4 bg-amber-500 text-black text-[9px] font-bold font-mono tracking-widest px-2 py-0.5 rounded border border-amber-600 uppercase shadow">
              Interactive
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-sm font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Faith Art Synthesizer
              </h3>
              <p className="text-xs text-slate-400 font-serif leading-relaxed">
                Input your sacred concepts (e.g. "Shiva temple peaks", "Christian stained glass cross", "Medina minaret crescent") below. Our logic triggers symbolic attributes for your aesthetic meditation.
              </p>
            </div>

            <form onSubmit={handleGenerateConceptArt} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-bold">
                  Write Sacred Motif Word(s)
                </label>
                <input
                  id="art-concept-input"
                  type="text"
                  placeholder="e.g. Jesus on Cross, Aum sign, Golden Temple..."
                  value={conceptPrompt}
                  onChange={(e) => setConceptPrompt(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-amber-500/40"
                />
              </div>

              <button
                id="art-synthesize-submit-btn"
                type="submit"
                disabled={isGeneratingConcept || !conceptPrompt.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black text-xs font-mono font-bold tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {isGeneratingConcept ? "Aligning Spiritual Motifs..." : "Synthesize Sacred Artwork"}
              </button>
            </form>

            {/* Simulated Art output */}
            {generatedArtOutput && (
              <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden p-3.5 space-y-3.5 animate-fade-in text-xs">
                
                {/* Simulated Thumbnail */}
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-white/10 shadow-inner group">
                  {imageErrors["synthesized"] ? (
                    <div className="w-full h-full bg-gradient-to-br from-amber-950 to-slate-900 flex flex-col items-center justify-center text-amber-400 font-bold text-xs select-none p-4 text-center">
                      <Sparkles className="w-8 h-8 opacity-70 animate-pulse mb-1" />
                      <span className="text-[10px] text-slate-400 font-serif leading-tight">Synthesized sacred representation ready.</span>
                    </div>
                  ) : (
                    <img
                      src={generatedArtOutput.unplashSubstituteUrl}
                      alt={generatedArtOutput.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError("synthesized")}
                    />
                  )}
                  {/* Subtle top-right floating badge */}
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-amber-300 border border-amber-500/20 font-bold uppercase tracking-wider">
                    Interactive Vision
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-sans font-bold text-white text-sm">{generatedArtOutput.title}</h4>
                  <p className="font-serif text-slate-300 leading-normal text-[11px] italic">
                    "{generatedArtOutput.description}"
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono text-amber-400 font-bold block">Artistic Attributes:</span>
                  <div className="flex flex-wrap gap-1">
                    {generatedArtOutput.synergyAttributes.map((attr, idx) => (
                      <span key={idx} className="bg-amber-500/10 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-lg p-2.5 space-y-1">
                  <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> Meditation Focal Tip:
                  </span>
                  <p className="font-serif text-[11px] text-amber-200/90 leading-tight">
                    {generatedArtOutput.meditationAesthetic}
                  </p>
                </div>

              </div>
            )}
          </div>

          {/* Quick Contemplation tips box */}
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" /> Sacred Signs Contemplation
            </h3>
            <p className="text-xs text-slate-400 font-serif leading-relaxed">
              In scriptures, visual symbolism often serves as a doorway when theological text becomes dense or abstract. The human form, the geometric arch, ancient stone carvings, and the glowing flame evoke timeless realities of cosmic order and pure spiritual joy.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 pt-1.5 border-t border-white/5">
              <span>Saved Hearts: {likedIds.length}</span>
              <span>8 Traditions Represented</span>
            </div>
          </div>

        </div>

      </div>

      {/* SYMBOLISM DECODER & MODAL SCREEN */}
      {selectedArt && (
        <div 
          onClick={() => setSelectedArt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b0b0e] border border-amber-500/30 max-w-4xl w-full rounded-2xl overflow-y-auto md:overflow-hidden relative shadow-2xl flex flex-col md:flex-row my-4 md:my-8 max-h-[95vh] md:max-h-[85vh] md:h-[650px]"
          >
            
            {/* Lft Side: Image with interactives */}
            <div className="relative md:w-1/2 min-h-[250px] md:h-full bg-black shrink-0 overflow-hidden flex flex-col justify-end">
              {imageErrors[selectedArt.id] ? (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-950 to-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
                  <div className="space-y-1">
                    <span className="font-sans font-bold text-slate-200 block text-sm">Artwork Symbol</span>
                    <span className="font-serif text-slate-400 block text-xs max-w-xs leading-normal">
                      Connecting to standard sacred representation of {selectedArt.title}...
                    </span>
                  </div>
                </div>
              ) : (
                <img
                  src={selectedArt.url}
                  alt={selectedArt.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(selectedArt.id)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-[#0b0b0e]/10 to-transparent"></div>
              
              {/* Overlay elements details triggers */}
              <div className="absolute top-4 left-4 bg-black/85 border border-white/10 text-amber-300 font-mono text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                {selectedArt.traditionLabel}
              </div>

              {/* Close in top-right */}
              <button
                onClick={() => setSelectedArt(null)}
                className="absolute top-4 right-4 md:hidden bg-black/80 text-white p-2 rounded-full border border-white/10 z-30"
              >
                &times;
              </button>
            </div>

            {/* Right Side: Tabular descriptions, Decoder, and Contemplation trigger */}
            <div className="md:w-1/2 p-6 sm:p-8 space-y-5 md:overflow-y-auto flex flex-col justify-between md:h-full">
              
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#9d9da4] block uppercase font-bold">
                      {selectedArt.era} &bull; {selectedArt.location}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-sans tracking-tight font-black text-white">
                      {selectedArt.title}
                    </h3>
                  </div>
                  <button
                    id="close-artwork-decoder-btn"
                    onClick={() => setSelectedArt(null)}
                    className="hidden md:flex bg-white/5 hover:bg-white/10 text-slate-300 p-1 px-2.5 rounded-lg border border-white/10 text-xs font-mono cursor-pointer transition-colors"
                  >
                    Close &times;
                  </button>
                </div>

                {/* Main description */}
                <p className="text-xs sm:text-sm font-serif text-slate-300 leading-relaxed">
                  {selectedArt.description}
                </p>

                {/* INTERACTIVE COMPONENT: Decoder Hotspots list */}
                <div className="space-y-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Interactive Symbol Decoder
                    </span>
                    <span className="text-[9px] text-[#8e8e95] font-mono">
                      Click to unlock meaning
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {selectedArt.symbolismElements.map((el, idx) => {
                      const isUnlocked = answeredSymbols[el.symbol];
                      const isCurrentOpen = showElementIndex === idx;
                      return (
                        <div
                          id={`unlocked-symbol-${idx}`}
                          key={idx}
                          onClick={() => {
                            setAnsweredSymbols(prev => ({ ...prev, [el.symbol]: true }));
                            setShowElementIndex(prev => prev === idx ? null : idx);
                          }}
                          className={`p-2 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            isUnlocked 
                              ? "bg-amber-500/10 border-amber-500/30 text-slate-200"
                              : "bg-black/30 border-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="font-semibold flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${isUnlocked ? "bg-amber-400" : "bg-slate-600"}`}></span>
                              {el.symbol}
                            </span>
                            <span className="text-[9px] opacity-80 font-normal">
                              {isUnlocked ? "Decoded" : "Locked"}
                            </span>
                          </div>
                          
                          {isUnlocked && isCurrentOpen && (
                            <p className="font-serif text-[11px] sm:text-xs text-amber-200/90 mt-1 pl-3 leading-normal border-l border-amber-500/30 animate-fade-in">
                              {el.meaning}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Meditation prompts section */}
                <div className="bg-amber-500/[0.03] border border-amber-500/10 rounded-xl p-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-500" /> Contemplative Breath Focus
                  </span>
                  <p className="text-xs sm:text-sm font-serif italic text-amber-100/90 leading-relaxed">
                    &ldquo;{selectedArt.contemplationPrompt}&rdquo;
                  </p>
                </div>

              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  id={`toggle-like-detail-btn-${selectedArt.id}`}
                  onClick={(e) => handleToggleLike(selectedArt.id, e)}
                  className="bg-white/5 hover:bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/10 flex items-center gap-1.5 cursor-pointer font-mono text-slate-300 transition-colors"
                >
                  <Heart className={`w-3.5 h-3.5 ${likedIds.includes(selectedArt.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                  <span>{likedIds.includes(selectedArt.id) ? "Liked" : "Like"}</span>
                </button>

                {onSetReaderBackground && (
                  <button
                    id="project-artwork-reader-btn"
                    onClick={() => {
                      onSetReaderBackground(selectedArt.url);
                      setToastMessage(`✨ Added as Reader Background! Check out the Scripture Reader tab.`);
                    }}
                    className="bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/35 hover:to-indigo-500/35 text-amber-300 hover:text-white px-3.5 py-2.5 rounded-xl border border-amber-500/35 hover:border-amber-400/55 flex items-center gap-1.5 cursor-pointer font-mono transition-all"
                    title="Set this image as an immersive background inside the Scripture Reader workspace"
                  >
                    <Image className="w-3.5 h-3.5 text-amber-400" />
                    <span>Project/Apply Background</span>
                  </button>
                )}

                <button
                  id="dismiss-decoder-panel-btn"
                  onClick={() => setSelectedArt(null)}
                  className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2.5 rounded-xl font-mono font-bold transition-colors cursor-pointer"
                >
                  Close Panel
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-[#0c0c10] border border-emerald-500/35 text-emerald-400 text-xs font-mono px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
