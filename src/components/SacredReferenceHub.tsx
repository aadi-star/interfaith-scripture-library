/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Book, 
  Globe, 
  Layers, 
  Search, 
  ExternalLink, 
  Scroll, 
  Sparkles, 
  CheckCircle,
  FileText,
  Compass,
  Filter,
  Tag,
  ChevronDown,
  ChevronUp,
  BookOpen
} from "lucide-react";
import { motion } from "motion/react";
import { UPANISHADS_108, Upanishad } from "../data/upanishads";

interface ReferenceSection {
  id: string;
  name: string;
  originalName: string;
  icon: React.ComponentType<any>;
  coreTexts: string[];
  structureVolume: string;
  onlineAccess: { label: string; url: string; description: string }[];
  highlight: string;
}

export const SACRED_REFERENCE_SECTIONS: ReferenceSection[] = [
  {
    id: "hinduism",
    name: "Hinduism",
    originalName: "सनातन धर्म (Sanatana Dharma)",
    icon: Sparkles,
    coreTexts: [
      "Four Vedas (Rigveda, Yajurveda, Samaveda, Atharvaveda) containing the primordial Mantras, Brahmana commentaries, and Aranyakas.",
      "Principal Upanishads (108 collections, focusing on 10 principal ones like Isha, Katha, Mundaka) outlining non-dual metaphysics.",
      "The Bhagavad Gita (700-verse dialogue between Lord Krishna and Arjuna from the Mahabharata Bhishma Parva).",
      "Epics (Itihasas): Srimad Ramayana of Valmiki and Mahabharata of Vedavyasa.",
      "Mahapuranas (18 primary texts like Bhagavata Purana, Vishnu Purana, and Shiva Purana).",
      "Dharmashastras (Sacred law codes and conduct manuals compiled by Manu, Yajnavalkya, and Parashara).",
      "The Sutras (Aphoristic collections including Patanjali's Yoga Sutras and Badarayana's Brahma Sutras).",
      "The Six Darshans (Orthodox philosophical schools: Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, and Vedanta)."
    ],
    structureVolume: "The Vedic Samhitas contain over 20,000 sacred mantras. The Mahabharata stands as the longest epic poem in human history, consisting of 100,000 Shlokas (couplets) across 18 Parvas (books). The Upanishads traditionally number 108, which represent the apex of classical Indian contemplative philosophy.",
    onlineAccess: [
      {
        label: "Vedabase Database",
        url: "https://vedabase.io/",
        description: "An extensive, searchable multi-lingual database of the Bhagavad Gita, Srimad Bhagavatam, and Caitanya Caritamrta."
      },
      {
        label: "Sanskrit Documents",
        url: "https://sanskritdocuments.org/",
        description: "A vast depository of Sanskrit scriptures, stotras, and major Upanishads in Devanagari and transliteration."
      },
      {
        label: "Vedanta Spiritual Library",
        url: "https://www.celextel.org/",
        description: "An exhaustive digital library focusing on Vedanta translations and all 108 Upanishads of the Muktika canon."
      },
      {
        label: "Vedapath Sacred Texts",
        url: "https://vedapath.app/en/sacred-texts",
        description: "An interactive mobile-friendly web application for studying sacred Vedic texts and translations."
      },
      {
        label: "Hinduwebsite",
        url: "https://www.hinduwebsite.com/",
        description: "Rich online resource cataloging Hindu scriptures, upanishadic wisdom, and religious history."
      },
      {
        label: "Gita Press (E-books)",
        url: "https://gitapress.org/ebook/free",
        description: "Free digital library for authentic publications of the Gita, Upanishads, and other spiritual scripts."
      },
      {
        label: "Gita Society",
        url: "https://www.gita-society.com/bhagavad-scriptures/",
        description: "Dedicated translations and guides of Bhagavad Gita and general Hindu scriptures for international readers."
      },
      {
        label: "Mahakavya Sanskrit Lore",
        url: "https://www.mahakavya.com/",
        description: "Exquisite translations of classical Sanskrit epic poems, Upanishads, and spiritual treatises."
      }
    ],
    highlight: "Conceiving ultimate reality as both transcendent (Brahman) and innermost (Atman), accessed through self-knowledge (Jnana), devotion (Bhakti), and selfless duty (Karma)."
  },
  {
    id: "islam",
    name: "Islam",
    originalName: "الإسلام (Al-Islam)",
    icon: Scroll,
    coreTexts: [
      "The Holy Quran: The direct, unedited revelation of God (Allah) sent down to the Prophet Muhammad through Angel Gabriel.",
      "Sunni Hadith (Al-Kutub al-Sittah): Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawood, Jami' al-Tirmidhi, Sunan al-Nasa'i, and Sunan ibn Majah.",
      "Shia Hadith (The Four Books and core collections): Kitab al-Kafi (by Al-Kulayni), Man La Yahduruhu al-Faqih, Tahdhib al-Ahkam, Al-Istibsar, Nahj al-Balagha (Peak of Eloquence), and Al-Sahifa al-Sajjadiyya (Psalms of Islam)."
    ],
    structureVolume: "The Holy Quran contains 114 Surahs (chapters) comprising 6,236 Ayahs (verses) structured meticulously into 30 Juz. The Sunni Hadith canon features over 10,000 highly authenticated chains of narration, while Shia Hadith volumes preserve profound sermons and supplications from the Prophet and the Twelve Imams.",
    onlineAccess: [
      {
        label: "Quran.com",
        url: "https://quran.com/",
        description: "Excellent, highly functional interactive portal offering beautiful recitation, multi-lingual translations, and word-by-word analysis."
      },
      {
        label: "Sunnah.com",
        url: "https://sunnah.com/",
        description: "The premier digital portal for the entire Six Books of Sunni Hadith, offering parallel Arabic-English lookup."
      },
      {
        label: "Al-Islam.org",
        url: "https://www.al-islam.org/",
        description: "The most exhaustive online repository for Shia Islamic scholarship, theology, Hadith books, and historical commentaries."
      }
    ],
    highlight: "Centering on absolute monotheism (Tawhid), daily remembrance, and dynamic moral responsibility across physical and spiritual spheres."
  },
  {
    id: "christianity",
    name: "Christianity",
    originalName: "Christianitas",
    icon: Book,
    coreTexts: [
      "The Holy Bible, consisting of the Old Testament (Hebrew Scriptures detailing the covenant, prophets, and wisdom books) and the New Testament.",
      "The Four Gospels (Matthew, Mark, Luke, John) documenting the life, ministry, crucifixion, and resurrection of Jesus Christ.",
      "The Acts of the Apostles (early church history) and the Epistles (letters of Paul, Peter, John, etc.).",
      "The Book of Revelation (apocalyptic prophecy)."
    ],
    structureVolume: "Standard Protestant Bibles contain 66 books, Roman Catholic canons contain 73 books (including Deuterocanonical works), and Eastern Orthodox canons feature up to 81 books. The Bible spans approximately 31,102 verses and over 750,000 words, uniting historical narrative with theological teaching.",
    onlineAccess: [
      {
        label: "Bible Gateway",
        url: "https://www.biblegateway.com/",
        description: "A highly searchable digital bible containing hundreds of versions and translations in over 70 languages."
      },
      {
        label: "Blue Letter Bible",
        url: "https://www.blueletterbible.org/",
        description: "In-depth research tool with powerful Hebrew-Greek lexicons, interlinear tools, and classic academic commentaries."
      },
      {
        label: "The Vatican Archive",
        url: "https://www.vatican.va/archive/",
        description: "The official holy see library offering access to the full Vulgate, catechisms, and historical encyclicals."
      }
    ],
    highlight: "The incarnation of divine love in Jesus Christ, salvation through grace, and the supreme ethical imperative to 'love your neighbor as yourself.'"
  },
  {
    id: "judaism",
    name: "Judaism",
    originalName: "יהדות (Yahadut)",
    icon: Layers,
    coreTexts: [
      "The Tanakh (Hebrew Bible): Torah (Five Books of Moses), Nevi'im (Prophets), and Ketuvim (Writings).",
      "The Mishnah: The foundational codification of oral legal traditions compiled by Rabbi Judah the Prince.",
      "The Talmud: The monumental collection of rabbinic debates and legal discussions consisting of the Mishnah and the Gemara (existing in Babylonian and Jerusalem editions).",
      "The Siddur: The sacred traditional prayer book governing daily morning declarations, Shabbat, and major festivals."
    ],
    structureVolume: "The Tanakh consists of 24 canonical books. The Babylonian Talmud covers 63 tractates across 2,711 double-sided folios (pages), representing a massive, highly detailed web of dialectical legal debate and moral philosophy.",
    onlineAccess: [
      {
        label: "Sefaria Living Library",
        url: "https://www.sefaria.org/",
        description: "A free, incredible, open-source digital library of Jewish texts (Torah, Talmud, Midrash, Kabbalah) in bilingual Hebrew-English."
      },
      {
        label: "Mechon Mamre",
        url: "https://www.mechon-mamre.org/",
        description: "A highly scholarly, precise digital presentation of the Hebrew Bible (Tanakh) in Hebrew, English, and French, following the authoritative Aleppo Codex."
      },
      {
        label: "Chabad.org (The Bible with Rashi)",
        url: "https://www.chabad.org/library/bible_cdo/aid/63255/jewish/The-Bible-with-Rashi.htm",
        description: "A premium digital portal offering the complete Hebrew scriptures accompanied by classical commentary by Rashi (Rabbi Shlomo Yitzchaki)."
      },
      {
        label: "HebrewBooks.org Classical Library",
        url: "https://hebrewbooks.org/",
        description: "A massive digital library dedicated to preserving all classical Hebrew religious literature, books, and rabbinic commentaries."
      }
    ],
    highlight: "An eternal covenant with the Creator, expressed through study, physical-spiritual sanctification of time, and Repairing the World (Tikkun Olam)."
  },
  {
    id: "buddhism",
    name: "Buddhism",
    originalName: "बौद्ध धर्म (Bauddha Dharma)",
    icon: Sparkles,
    coreTexts: [
      "The Tripitaka (Pali Canon): Vinaya Pitaka (monastic discipline), Sutta Pitaka (discourses of the Buddha including the Dhammapada, Digha Nikaya, and Majjhima Nikaya), and Abhidhamma Pitaka (advanced scholastic philosophy).",
      "Mahayana Sutras: Heart Sutra, Lotus Sutra, Lalitavistara, Diamond Sutra, and Lankavatara Sutra.",
      "Tibetan Buddhist Canon: Kangyur (translated words of Buddha) and Tengyur (translated commentaries)."
    ],
    structureVolume: "The Pali Canon is estimated to span over 40 print volumes, containing several million words. The Dhammapada compiles 423 highly elegant and memorable verses categorized into 26 thematic chapters. Mahayana and Tibetan canons encompass thousands of additional philosophical treatises.",
    onlineAccess: [
      {
        label: "SuttaCentral Early Texts",
        url: "https://suttacentral.net/",
        description: "A world-class academic repository providing early Buddhist scriptures in dozens of modern translations with side-by-side Pali."
      },
      {
        label: "Access to Insight",
        url: "https://www.accesstoinsight.org/",
        description: "A cherished offline-first library focusing on Theravada Buddhism, containing hundreds of translated Suttas and essays."
      },
      {
        label: "84000: Translating the Words of the Buddha",
        url: "https://84000.co/",
        description: "A global non-profit initiative dedicated to translating the entire Tibetan Buddhist Canon into English, free to download."
      }
    ],
    highlight: "Extinguishing the fire of suffering (Dukkha) by realizing impermanence (Anicca), non-self (Anatta), and cultivating the Noble Eightfold Path."
  },
  {
    id: "jainism",
    name: "Jainism",
    originalName: "जैन धर्म (Jaina Dharma)",
    icon: Scroll,
    coreTexts: [
      "The Jain Agamas: The primary sacred texts of Svetambara Jainism, containing sermons and rules of conduct directly preached by Lord Mahavira.",
      "The Tattvartha Sutra: The 'Book of Reality' composed by Acharya Umaswami, serving as the philosophical bedrock for both Digambara and Svetambara sects.",
      "The Bhagavati Sutra: The largest Agama, structured as an exhaustive series of questions and answers on science, history, and karma."
    ],
    structureVolume: "The Svetambara canon consists of 12 Angas (with the 12th considered lost). The Tattvartha Sutra consists of 10 concise chapters containing 357 highly packed aphorisms. The Bhagavati Sutra spans 41 chapters filled with profound cosmological dialogues.",
    onlineAccess: [
      {
        label: "Jain eLibrary",
        url: "https://www.jainelibrary.org/",
        description: "A massive, non-profit digital database containing thousands of books, scriptures, research papers, and audio files on Jainism."
      },
      {
        label: "Jainworld Portal",
        url: "https://jainworld.com/",
        description: "One of the oldest websites dedicated to providing global resources, sutras, recipes, and news about Jain philosophy."
      },
      {
        label: "HereNow4U Journal",
        url: "https://www.herenow4u.net/",
        description: "A rich archive of articles, translations of Agamas, and scholarly papers exploring Jain non-violence in the modern world."
      }
    ],
    highlight: "Achieving ultimate soul liberation through absolute non-injury (Ahimsa), many-sidedness of truth (Anekantavada), and non-possessiveness (Aparigraha)."
  },
  {
    id: "sikhism",
    name: "Sikhism",
    originalName: "ਸਿੱਖੀ (Sikhi)",
    icon: Book,
    coreTexts: [
      "Sri Guru Granth Sahib: The primary and eternal living Guru of Sikhism, comprising sacred musical hymns (Shabads) of high spiritual ecstasy.",
      "The Dasam Granth: Sacred writings of the tenth Guru, Guru Gobind Singh, embodying divine names (Jaap Sahib) and heroic poetry (Chandi di Var).",
      "Varan Bhai Gurdas: Forty ballads written by Bhai Gurdas, highly revered as the key interpretive companion to the Guru Granth Sahib.",
      "The Nitnem: The collection of daily morning and evening prayers (Japji Sahib, Jaap Sahib, Tav-Prasad Saviye, Chaupai Sahib, Anand Sahib, Rehras, Kirtan Sohila, and Ardas)."
    ],
    structureVolume: "Sri Guru Granth Sahib consists of exactly 1,430 Angs (pages) containing 5,894 sacred hymns. These are structured mathematically according to 31 classical musical measures (Ragas) and the compositions of 36 distinct writers (including 6 Sikh Gurus, 15 Hindu Bhagats, and 11 Sufi/bhat poets).",
    onlineAccess: [
      {
        label: "SriGranth Online",
        url: "http://www.srigranth.org/",
        description: "A dedicated academic search engine for the Guru Granth Sahib with English and Punjabi translations, transliterations, and dictionaries."
      },
      {
        label: "SikhiToTheMAX",
        url: "https://www.sikhitothemax.org/",
        description: "The world's premier Gurbani search and display engine used globally, offering extensive indices and dynamic translations."
      },
      {
        label: "SearchGurbani Library",
        url: "https://www.searchgurbani.com/",
        description: "An excellent repository of Nitnem prayers, Shabads, and reference materials for Gurbani research."
      }
    ],
    highlight: "Sincere devotion to the One Creator (Ik Onkar), selfless community service (Seva), and living truthfully as a saint-soldier (Sant-Sipahi)."
  },
  {
    id: "norse",
    name: "Norse Mythology",
    originalName: "Norræn Goðafræði",
    icon: Scroll,
    coreTexts: [
      "The Poetic Edda: The foundational manuscript of Old Norse mythological poetry, including the Völuspá and the wisdom-rich Hávamál.",
      "The Prose Edda: Compiled by Snorri Sturluson, detailing the creation of the cosmos, Norse poetics, and stories of Thor, Odin, and Loki.",
      "Heimskringla: Sagas of the Norwegian kings and historical-mythological origins compiled by Snorri Sturluson.",
      "Gesta Danorum: A monumental 12th-century work by Saxo Grammaticus containing Danish-Norse heroic sagas and legends."
    ],
    structureVolume: "The Poetic Edda spans around 31 major lays. The Prose Edda contains 4 main books (Prologus, Gylfaginning, Skáldskaparmál, Háttatal). Heimskringla is a collection of 16 comprehensive sagas about royal battles, voyages, and divine intervention.",
    onlineAccess: [
      {
        label: "Internet Sacred Texts: Norse",
        url: "https://www.sacred-texts.com/neu/ice/index.htm",
        description: "An exhaustive public archive of translations of both the Poetic and Prose Eddas, sagas, and Icelandic folklore."
      },
      {
        label: "Germanic Mythology Resource",
        url: "http://www.germanicmythology.com/",
        description: "A scholarly archive gathering multiple translations, ancient illustrations, maps, and comparative analyses of Norse literature."
      },
      {
        label: "The Norse Sagas Project",
        url: "https://www.snerpa.is/net/snorri/snorri.htm",
        description: "An Icelandic database preserving the complete original Old Norse texts of the major sagas and kings' chronicles."
      }
    ],
    highlight: "Accepting fate with unyielding courage, cultivating loyalty, and striving to leave an honorable legacy that outlives the destruction of Ragnarok."
  },
  {
    id: "greek",
    name: "Greek Mythology",
    originalName: "Ἑλληνική Μυθολογία",
    icon: Globe,
    coreTexts: [
      "Homer's Epic Poems: The Iliad (detailing the Trojan War, wrath of Achilles, and divine meddling) and The Odyssey (epic return of Odysseus).",
      "Hesiod's works: Theogony (the creation of the universe and genealogy of the Olympian gods) and Works and Days (wisdom advice).",
      "The Homeric Hymns: A collection of thirty-three ancient anonymous hymns celebrating specific Olympian gods.",
      "Classical Greek Tragedies: Monumental theatrical plays on destiny and divine justice composed by Sophocles, Aeschylus, and Euripides."
    ],
    structureVolume: "The Iliad spans 24 books with 15,693 lines of dactylic hexameter. The Odyssey has 24 books with 12,110 lines. The Homeric Hymns range from short 4-line greetings to long narrative pieces of over 500 lines.",
    onlineAccess: [
      {
        label: "Perseus Digital Library",
        url: "https://www.perseus.tufts.edu/hopper/",
        description: "The world's premier digital library for classical studies, offering interlinear Greek text, commentaries, and morphology tools."
      },
      {
        label: "Theoi Project",
        url: "https://www.theoi.com/",
        description: "An exhaustive academic portal indexing every figure of Greek mythology, matching them to classical scripture excerpts and artwork."
      },
      {
        label: "Internet Sacred Texts: Classics",
        url: "https://www.sacred-texts.com/cla/index.htm",
        description: "Public domain texts of Homer, Hesiod, Apollodorus, and classical dramatists in complete English translation."
      }
    ],
    highlight: "Human strive against destiny, maintaining hospitality (Xenia), avoiding excessive pride (Hubris), and navigating the divine cosmic order."
  }
];

export default function SacredReferenceHub() {
  const [selectedRel, setSelectedRel] = useState<string>("hinduism");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Upanishads interactive portal states
  const [upanishadSearch, setUpanishadSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedVeda, setSelectedVeda] = useState<string>("All");
  const [expandedUpanishad, setExpandedUpanishad] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Helper styles for categories
  const getCategoryBadgeStyle = (cat: string) => {
    switch(cat) {
      case "Mukhya": return "bg-amber-500/10 text-amber-300 border border-amber-500/20";
      case "Samanya": return "bg-blue-500/10 text-blue-300 border border-blue-500/20";
      case "Sannyasa": return "bg-purple-500/10 text-purple-300 border border-purple-500/20";
      case "Yoga": return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
      case "Shaiva": return "bg-red-500/10 text-red-300 border border-red-500/20";
      case "Vaishnava": return "bg-sky-500/10 text-sky-300 border border-sky-500/20";
      case "Shakta": return "bg-pink-500/10 text-pink-300 border border-pink-500/20";
      default: return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
    }
  };

  // Filter sections if search is present
  const currentSection = SACRED_REFERENCE_SECTIONS.find(s => s.id === selectedRel) || SACRED_REFERENCE_SECTIONS[0];

  const filteredSections = searchQuery === "" 
    ? SACRED_REFERENCE_SECTIONS 
    : SACRED_REFERENCE_SECTIONS.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.coreTexts.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.structureVolume.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.highlight.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-amber-400">Sacred Digital Access & References</h2>
          <p className="text-xs text-slate-400 font-mono">Academic overview of Core Texts, Structural Volumes, and authorized Online Access URLs.</p>
        </div>
        <div className="relative w-full sm:w-64 font-sans">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reference library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        {/* Navigation Rail */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block font-bold px-1">
            Browse Traditions
          </span>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedRel(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all shrink-0 cursor-pointer ${
                    selectedRel === sec.id
                      ? "bg-amber-400/10 text-amber-300 border border-amber-400/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <div className="text-left">
                      <div className="font-bold">{sec.name}</div>
                      <div className="text-[9px] text-slate-500 font-serif leading-none mt-0.5">{sec.originalName.split(" (")[0]}</div>
                    </div>
                  </div>
                  <CheckCircle className={`w-3.5 h-3.5 text-emerald-400 shrink-0 transition-opacity ${selectedRel === sec.id ? "opacity-100" : "opacity-0"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-white/10 pb-3 flex justify-between items-start gap-4 flex-col sm:flex-row">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-extrabold uppercase">
                {currentSection.originalName}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white font-bold mt-1">
                {currentSection.name} Literature
              </h3>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg text-center shrink-0 w-full sm:w-auto">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">Academic Focus</span>
              <p className="text-[11px] text-amber-400 font-bold font-mono mt-0.5">Primary Preservation</p>
            </div>
          </div>

          {/* Highlight Callout */}
          <div className="bg-indigo-950/20 border border-indigo-500/10 p-3 sm:p-4 rounded-xl flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Spiritual & Philosophical Core</span>
              <p className="text-xs sm:text-sm text-slate-300 font-serif italic">"{currentSection.highlight}"</p>
            </div>
          </div>

          {/* Core Texts */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Core Texts & Literature
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
              {currentSection.coreTexts.map((text, i) => (
                <li key={i} className="text-xs text-slate-300 font-serif leading-relaxed flex items-start gap-2 bg-black/25 p-2.5 rounded-xl border border-white/5">
                  <span className="text-amber-500 font-mono font-bold shrink-0 mt-0.5">{i+1}.</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Structure & Volume */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Structure & Volume
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed bg-[#0b0c10]/40 p-3 rounded-xl border border-white/5 pl-4 border-l-2 border-l-emerald-500">
              {currentSection.structureVolume}
            </p>
          </div>

          {/* Online Access */}
          <div className="space-y-3.5">
            <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              Online Access & Authorized Directories
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentSection.onlineAccess.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-amber-400/30 rounded-xl p-3.5 flex flex-col justify-between transition-all group cursor-pointer h-full"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 transition-colors leading-tight">
                        {item.label}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 shrink-0 transition-colors" />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-serif">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-[8px] font-mono text-amber-500/60 uppercase block mt-3 select-none">
                    Visit Site &rarr;
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Interactive 108 Upanishads Explorer (Exclusive to Hinduism) */}
          {selectedRel === "hinduism" && (
            <div className="border-t border-white/10 pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-serif font-bold text-amber-400 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    Interactive 108 Upanishads Explorer (Muktika Canon)
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Browse and explore all 108 Upanishads by their canonical number, philosophical category, associated Veda source, and primary non-dual spiritual insight.
                  </p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-center shrink-0">
                  <span className="text-[10px] font-mono text-amber-300 font-bold">108 Upanishads Loaded</span>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                {/* Search */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Search Upanishad</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search name, translation..."
                      value={upanishadSearch}
                      onChange={(e) => {
                        setUpanishadSearch(e.target.value);
                        setCurrentPage(1);
                        setExpandedUpanishad(null);
                      }}
                      className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-amber-500 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Filter Category</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                        setExpandedUpanishad(null);
                      }}
                      className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-amber-500 rounded-lg py-1.5 px-3 text-xs text-white outline-none appearance-none transition-all cursor-pointer"
                    >
                      <option value="All">All Categories ({UPANISHADS_108.length})</option>
                      <option value="Mukhya">Mukhya / Major (10)</option>
                      <option value="Samanya">Samanya / General (21)</option>
                      <option value="Sannyasa">Sannyasa / Renunciation (17)</option>
                      <option value="Yoga">Yoga / Meditation (20)</option>
                      <option value="Shaiva">Shaiva / Shiva devotion (14)</option>
                      <option value="Vaishnava">Vaishnava / Vishnu devotion (14)</option>
                      <option value="Shakta">Shakta / Goddess devotion (8)</option>
                    </select>
                    <Filter className="w-3 h-3 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Veda Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Filter Veda Origin</label>
                  <div className="relative">
                    <select
                      value={selectedVeda}
                      onChange={(e) => {
                        setSelectedVeda(e.target.value);
                        setCurrentPage(1);
                        setExpandedUpanishad(null);
                      }}
                      className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-amber-500 rounded-lg py-1.5 px-3 text-xs text-white outline-none appearance-none transition-all cursor-pointer"
                    >
                      <option value="All">All Vedas</option>
                      <option value="Rigveda">Rigveda origin</option>
                      <option value="Samaveda">Samaveda origin</option>
                      <option value="Shukla Yajurveda">Shukla Yajurveda origin</option>
                      <option value="Krishna Yajurveda">Krishna Yajurveda origin</option>
                      <option value="Atharvaveda">Atharvaveda origin</option>
                    </select>
                    <Filter className="w-3 h-3 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Upanishads Grid */}
              {(() => {
                const filtered = UPANISHADS_108.filter(up => {
                  const matchesSearch = up.name.toLowerCase().includes(upanishadSearch.toLowerCase()) || 
                                        up.translation.toLowerCase().includes(upanishadSearch.toLowerCase()) ||
                                        up.keyInsight.toLowerCase().includes(upanishadSearch.toLowerCase());
                  const matchesCategory = selectedCategory === "All" || up.category === selectedCategory;
                  const matchesVeda = selectedVeda === "All" || up.veda === selectedVeda;
                  return matchesSearch && matchesCategory && matchesVeda;
                });

                const itemsPerPage = 12;
                const totalPages = Math.ceil(filtered.length / itemsPerPage);
                const safePage = Math.min(currentPage, Math.max(1, totalPages));
                const paginated = filtered.slice(
                  (safePage - 1) * itemsPerPage,
                  safePage * itemsPerPage
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 bg-slate-950/20 border border-white/5 rounded-xl">
                      <p className="text-xs text-slate-400">No Upanishads found matching your search or filter options.</p>
                      <button
                        onClick={() => {
                          setUpanishadSearch("");
                          setSelectedCategory("All");
                          setSelectedVeda("All");
                          setCurrentPage(1);
                        }}
                        className="mt-2 text-[10px] text-amber-400 font-mono underline hover:text-amber-300"
                      >
                        Reset filters
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Showing {filtered.length === 1 ? "1 Upanishad" : `${filtered.length} Upanishads`} matching criteria
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {paginated.map((up) => {
                        const isExpanded = expandedUpanishad === up.number;
                        return (
                          <div
                            key={up.number}
                            onClick={() => setExpandedUpanishad(isExpanded ? null : up.number)}
                            className={`bg-slate-950/40 hover:bg-slate-950/80 border ${isExpanded ? "border-amber-500/40" : "border-white/5"} hover:border-amber-500/20 rounded-xl p-3.5 transition-all cursor-pointer relative flex flex-col justify-between group`}
                          >
                            <div className="space-y-2">
                              {/* Top row */}
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <span className="text-[9px] font-mono text-amber-500/80 font-bold uppercase block tracking-wider">
                                    #{up.number} Upanishad
                                  </span>
                                  <h5 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5">
                                    {up.name}
                                  </h5>
                                </div>
                                <div className="text-[9px] font-mono text-slate-400 bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md">
                                  {up.veda.split(" ")[0]}
                                </div>
                              </div>

                              {/* Badges */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider ${getCategoryBadgeStyle(up.category)}`}>
                                  {up.category}
                                </span>
                              </div>

                              {/* Excerpt translation preview */}
                              {!isExpanded && (
                                <p className="text-[11px] text-slate-400 leading-relaxed font-serif line-clamp-2">
                                  "{up.translation}"
                                </p>
                              )}

                              {/* Fully Expanded detailed view */}
                              {isExpanded && (
                                <div className="space-y-3 pt-2.5 border-t border-white/5 text-xs text-slate-300 font-serif leading-relaxed animate-fade-in">
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-mono uppercase text-amber-500/80 tracking-widest font-extrabold block">Literal Translation</span>
                                    <p className="italic text-slate-200 bg-black/20 p-2 rounded-lg border border-white/5">
                                      "{up.translation}"
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-mono uppercase text-emerald-400 tracking-widest font-extrabold block">Non-Dual Realization & Insight</span>
                                    <p className="text-slate-300 bg-emerald-950/10 p-2 rounded-lg border border-emerald-500/5">
                                      "{up.keyInsight}"
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Trigger icon */}
                            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500 group-hover:text-amber-400 transition-colors">
                              <span>{isExpanded ? "Click to collapse" : "Click to view wisdom"}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3 shrink-0 text-amber-400" />
                              ) : (
                                <ChevronDown className="w-3 h-3 shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center pt-3 border-t border-white/5 font-mono text-[10px]">
                        <button
                          disabled={safePage === 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPage(p => Math.max(1, p - 1));
                          }}
                          className="bg-slate-900 border border-white/10 hover:border-amber-500/40 hover:text-amber-300 disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-slate-500 px-3 py-1.5 rounded-lg transition-all"
                        >
                          &larr; Previous
                        </button>
                        <span className="text-slate-400 font-bold">
                          Page {safePage} of {totalPages}
                        </span>
                        <button
                          disabled={safePage === totalPages}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                          }}
                          className="bg-slate-900 border border-white/10 hover:border-amber-500/40 hover:text-amber-300 disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-slate-500 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Next &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
