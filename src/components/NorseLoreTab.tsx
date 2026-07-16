import React, { useState, useMemo } from "react";
import { 
  BookOpen, 
  HelpCircle, 
  Loader2, 
  Sparkles, 
  Shield, 
  Flame, 
  ChevronRight, 
  Search, 
  BookMarked, 
  Compass, 
  Award, 
  Eye, 
  Skull, 
  Heart, 
  CloudRain, 
  Scroll, 
  Copy, 
  Check, 
  Volume2, 
  ExternalLink 
} from "lucide-react";

interface Story {
  id: string;
  title: string;
  deity: string;
  summary: string;
  content: string;
  analysis: string;
  runicSymbol: string;
  themeColor: string;
}

interface NorseBook {
  id: string;
  title: string;
  era: string;
  authorship: string;
  importance: string;
  summary: string;
  recommendationReason: string;
  keyChapters: { title: string; desc: string }[];
}

interface Prayer {
  id: string;
  title: string;
  deity: string;
  origin: string;
  text: string;
  englishTranslation: string;
  academicContext: string;
}

const NORSE_STORIES: Story[] = [
  {
    id: "creation",
    title: "The Creation of the Cosmos",
    deity: "Odin, Vili, and Ve",
    runicSymbol: "ᛉ (Yr/Elhaz - Protection & Birth)",
    themeColor: "from-blue-600 to-indigo-900",
    summary: "Before there was the green earth, there was only a vast silent void named Ginnungagap, flanked by Muspelheim (fire) and Niflheim (ice), out of which the first giant Ymir arose.",
    content: "At the beginning of all things, there was only Ginnungagap, a primordial abyss of silent darkness. To the south lay Muspelheim, a realm of intense heat, fire, and glowing embers. To the north lay Niflheim, a freezing waste of mist, rime, and glaciers.\n\nOver waves of time, the warm breezes from Muspelheim met the cold rime of Niflheim in the heart of Ginnungagap. Out of this thawing ice, the first giant, Ymir, was born. Alongside Ymir came Audhumla, a primeval cow whose milk nourished the giant. As Audhumla licked the salty ice blocks for sustenance, she uncovered Buri, the first of the Norse gods.\n\nBuri begot Bor, who married Bestla. Together they birthed Odin, Vili, and Ve. Growing to realize Ymir and the multiplying jötnar (giants) were chaotic, the three brother-gods slew Ymir. His titanic body fell into the Ginnungagap, and from his remains, the gods crafted the material universe.\n\nHis blood became the vast oceans, rivers, and lakes, encircling the lands. His flesh became the earth, his bones the mountains, his hair the forests, and his teeth the gravel and stone. Inside his skull, the gods created the sky, supported at the four cardinal points by the dwarves Nordri, Sudri, Austri, and Vestri. Finally, from Ymir's brains they hurled the cold, dark clouds into the atmosphere.",
    analysis: "This creation myth, or cosmogony, showcases the classic Indo-European theme of the 'cosmic sacrifice' where the universe is created from the dismembered parts of a primeval giant. It reflects a dualistic philosophy of nature—a constant, tense balancing act between the thermal energy of Muspelheim and the sub-zero ice of Niflheim, representing order and chaos, creation and decay."
  },
  {
    id: "odins-eye",
    title: "How Odin Lost His Eye",
    deity: "Odin & Mimir",
    runicSymbol: "ᚨ (Ansuz - Divine Wisdom)",
    themeColor: "from-amber-600 to-amber-950",
    summary: "To gain ultimate cosmic vision and understand the secrets of the nine realms, Odin sacrificed his physical eye to Mimir's Well at the roots of Yggdrasil.",
    content: "Odin, the Allfather, was never satisfied with mere superficial sight. He desired 'inner sight'—the absolute wisdom to understand the past, direct the present, and anticipate the doom of Ragnarok. \n\nJourneying to Jotunheim, one of the three colossal roots of the world-tree Yggdrasil, Odin approached the Well of Mimir. Its water sparkled with deep cosmic memories, holding all wisdom and knowledge. This precious well was guarded by Mimir, a mysterious being renowned for his counsel.\n\nOdin sought a single draft from this well. However, Mimir knew the value of his waters and demanded a high and devastating price: Odin's right eye. Without a moment of hesitation, the Allfather gouged out his own eye and plunged it into the crystal pool, where it remains to this day, staring up through the magical waters, seeing all secrets.\n\nMimir filled the Gjallarhorn with the well-water, and Odin drank deeply. In that instant, his mind was flooded with cosmic light. He understood the runes, the cycles of life and death, and the ultimate doom that awaited the gods at Ragnarok.",
    analysis: "According to Dan McCoy's writings on norse-mythology.org, Odin's self-sacrifice demonstrates that true sacred knowledge is never free. Physical sight must be surrendered to cultivate spiritual, cosmic vision. It frames Odin not as an omnipotent dictator, but as an ecstatic seeker who continually sacrifices himself to himself to govern the realms with profound wisdom."
  },
  {
    id: "death-baldur",
    title: "The Death of Baldur",
    deity: "Baldur, Frigg, & Loki",
    runicSymbol: "ᛒ (Berkanan - Rebirth & Sanctuary)",
    themeColor: "from-red-600 to-rose-950",
    summary: "The beautiful and beloved god of light, Baldur, is struck down when the trickster Loki exploits Frigg's oversight of the humble mistletoe.",
    content: "Baldur was the most beloved of all Norse gods. He was beautiful, wise, and gentle, and his presence brought light and peace to Asgard. However, Baldur began to have dark, prophetic nightmares of his own death, shaking the gods' peace.\n\nDetermined to protect her son, the goddess Frigg traveled to every corner of the nine realms, eliciting oaths from fire, water, iron, stone, beasts, trees, and disease never to harm her son. Confident in his invulnerability, the gods played a game where they hurled spears, stones, and axes at Baldur, watching them bounce off harmlessly.\n\nLoki, the craft-deity of chaos, grew jealous of Baldur's glory. Disguising himself, Loki tricked Frigg into admitting she had exempted the young, humble mistletoe from the pledge, deeming it too small and weak to ever cause harm.\n\nLoki harvested the mistletoe and carved a spear-tip from its wood. He returned to Asgard, where the blind god Hodr stood on the periphery of the game. Loki placed the mistletoe spear in Hodr's hands and guided his aim. The spear flew and pierced Baldur's heart. He collapsed dead, sending Asgard into deep, dark mourning and setting the gears of Ragnarok in motion.",
    analysis: "Baldur's death is the primary tragic pivot of Norse cosmology. Underneath the betrayal lies a deep mythological structure: the inevitable passing of light and Innocence to make way for the cycle of destruction (Ragnarok) and subsequent rebirth. The mistletoe, representing the parasitic outsider, demonstrates that the universe cannot be perfectly secured."
  },
  {
    id: "binding-fenrir",
    title: "The Binding of Fenrir",
    deity: "Tyr & Fenrir",
    runicSymbol: "ᛏ (Tiwaz - Honor & Sacrifice)",
    themeColor: "from-emerald-700 to-teal-950",
    summary: "As the monstrous wolf Fenrir grows to terrify the gods, Tyr courageously sacrifices his hand so the magical ribbon Gleipnir can bind the beast.",
    content: "Among the monstrous offspring of Loki and Angrboda stood the giant wolf, Fenrir. Initially raised in Asgard, the wolf grew at an alarming rate, developing monstrous jaws and a terrifying, vicious nature. Only Tyr, the god of law and honor, was brave enough to feed and care for him.\n\nRealizing Fenrir would eventually devour the realms, the gods attempted to bind him. They presented massive iron chains (Leyding and Dromi) as tests of his strength, but Fenrir shattered them with a single kick. \n\nThe gods then turned to the dark elves of Svartalfheim, who crafted Gleipnir—a ribbon as soft, smooth, and thin as silk, but made of six secret ingredients: the sound of a cat's footfall, the beard of a woman, the roots of a mountain, the sinews of a bear, the breath of a fish, and the spittle of a bird.\n\nWhen the gods invited Fenrir to the island of Lyngvi to try his strength against this silk-like ribbon, the wolf sensed a trick. He agreed to be bound only if one of the gods placed their hand in his jaws as a pledge of good faith. While the other gods recoiled and looked away, the brave Tyr stepped forward and put his right hand between the wolf's fangs.\n\nFenrir was bound. The more he struggled against Gleipnir, the tighter it became. Realizing he was trapped, his jaws clamped down, severing Tyr's hand. The gods cheered, but Tyr smiled through his pain, knowing a great, necessary sacrifice had secured the cosmos.",
    analysis: "The story of Fenrir explores the essential concept of cosmic justice, law, and the price of safety. Tyr, representing contracts, law, and binding oaths, must lose his hand because the gods used deceit to bind the great wolf. It shows that maintaining order in an untamed universe require sacrifices of physical integrity and personal honor."
  },
  {
    id: "ragnarok",
    title: "Ragnarok: The Doom of the Gods",
    deity: "All Gods & Giants",
    runicSymbol: "ᚺ (Hagalaz - Hail & Destructive Forces)",
    themeColor: "from-purple-800 to-black",
    summary: "A cataclysmic series of battles and natural disasters that will burn the nine worlds, ending the reign of the Aesir and initiating a pristine new era.",
    content: "The end begins with Fimbulwinter: three consecutive freezing winters without any summers, fracturing society into chaos and warfare. The wolves Skoll and Hati will catch and devour the sun and the moon, throwing the realms into absolute darkness.\n\nYggdrasil will tremble, and the boundaries of the cosmos will collapse. The Midgard Serpent, Jormungandr, will writhe out of the ocean, flooding the lands. The great wolf Fenrir, his lower jaw on the earth and upper jaw in the sky, will run wild. Loki will break his chains to lead the forces of Hel, and Surtr, the giant of Muspelheim, will march across Vigrid with a sword of fire.\n\nIn the final clash on the plains of Vigrid, the great gods meet their destined ends: Odin is swallowed by Fenrir, only to be avenged by his son Vidarr. Thor slays Jormungandr but collapses after nine steps from the beast's thick venom. Tyr dies battling the hound Garmr, and Loki and Heimdall slay each other.\n\nSurtr then flings fire in all directions, burning all nine worlds. The scorched earth sinks into the sea, extinguishing the apocalyptic flames. Yet, this is not the absolute end. Out of the clean waters, a fresh, green, and beautiful earth arises. A handful of surviving gods, led by Odin's sons Vidarr and Vali, and Balder who returns from Hel, gather on the sacred plain of Idavoll. Two humans, Lif and Lifthrasir, emerge from the world-tree to repopulate the world with peaceful hearts.",
    analysis: "Ragnarok is highly unique among global end-times mythologies because it is a cycle, not a final termination. It is a purgative system where the old, compromised world must be violently dissolved to wash away accumulated cosmic taboos, paving the way for a pure, peaceful, and harmonious golden age."
  }
];

const NORSE_BOOKS: NorseBook[] = [
  {
    id: "poetic-edda",
    title: "The Poetic Edda",
    era: "c. 10th - 13th Century (Icelandic Manuscript)",
    authorship: "Anonymous collection of traditional poems",
    importance: "The ultimate primary source for Norse mythology, containing the core narratives of creation, the gods' deeds, and Ragnarok.",
    summary: "A collection of Old Norse poems preserved in the 13th-century Icelandic manuscript 'Codex Regius'. Divided into mythological poems exploring the cosmos and heroic poems highlighting human legends, it represents a direct preservation of ancient pre-Christian oral tradition.",
    recommendationReason: "Recommended on norse-mythology.org as the absolute starting point for anyone wanting to read the direct, raw, and authentic words of the Norse pagan skalds without subsequent medieval christianized prose frames.",
    keyChapters: [
      { title: "Völuspá (Prophecy of the Seeress)", desc: "A sweeping cosmic history delivered by an resurrected Volva, outlining creation, the golden age, the rise of conflict, and the cataclysmic events of Ragnarok." },
      { title: "Hávamál (Words of the High One)", desc: "A fascinating collection of ethical counsel, social decorum, survival maxims, and deep runs-lore attributed directly to Odin." },
      { title: "Vafþrúðnismál (The Lay of Vafthrudnir)", desc: "A deadly battle of wits between Odin and the wise giant Vafthrudnir, resolving questions of cosmic origins and boundaries." },
      { title: "Lokasenna (The Flyting of Loki)", desc: "A dark comedy where Loki crashes a divine banquet, insulting each god and goddess with scandals, cowardice, and infidelity." }
    ]
  },
  {
    id: "prose-edda",
    title: "The Prose Edda",
    era: "c. 1220 AD",
    authorship: "Written / Compiled by Snorri Sturluson",
    importance: "A brilliant, structured narrative handbook detailing Norse mythology, designed to preserve skaldic poetic techniques.",
    summary: "Written in prose by the legendary Icelandic scholar, politician, and historian Snorri Sturluson. It serves to catalog and explain the complex narratives of Norse mythos, making it highly structured and easier to comprehend than the complex verse of the Poetic Edda.",
    recommendationReason: "Highly regarded on norse-mythology.org for its comprehensive story formatting, though scholars must carefully parse Snorri's occasional Christian biases and classical allegories.",
    keyChapters: [
      { title: "Gylfaginning (The Beguiling of Gylfi)", desc: "A structured story where King Gylfi questions three high leaders about the origins, gods, exploits, and end of the world." },
      { title: "Skáldskaparmál (The Language of Poetry)", desc: "A dialog detailing the nature, kening metaphors, and mythological origins of poetry (describing the Mead of Poetry)." },
      { title: "Háttatal (List of Meters)", desc: "A technical catalog showcasing the highly structured and complex verse-types used by Norse court poets." }
    ]
  },
  {
    id: "volsunga-saga",
    title: "The Saga of the Volsungs",
    era: "c. Late 13th Century",
    authorship: "Anonymous Icelandic prose saga",
    importance: "Sheds deep light on Germanic heroic ethics, oath-making, and the tragic intersections of fate, monsters, and gold.",
    summary: "One of the most famous legendary sagas, it describes the golden age, struggles, and ultimate demise of the Volsung clan. It centers on Sigurd the dragon-slayer (who slays Fafnir), his tragic romance with the Valkyrie Brynhild, and the cursed ring of Andvari.",
    recommendationReason: "Illustrates the heroic ethos and psychological mindset of early Germanic shield-warriors. Used heavily by J.R.R. Tolkien to construct 'The Lord of the Rings'.",
    keyChapters: [
      { title: "Sigurd & Fafnir", desc: "Sigurd slays the dragon Fafnir, eats its heart to understand the language of birds, and secures the hoard of cursed gold." },
      { title: "The Curse of the Ring", desc: "Traces how the gold seized from the dwarf Andvari brings tragedy and betrayal down on everyone who claims it." }
    ]
  },
  {
    id: "gesta-danorum",
    title: "Gesta Danorum (Deeds of the Danes)",
    era: "c. Early 13th Century",
    authorship: "Saxo Grammaticus",
    importance: "Provides a fascinating alternative, euhemerized look at Norse gods depicted as ancient historical human kings.",
    summary: "A nine-volume patriotic history of the Danish people written in fluid medieval Latin. It describes Norse myths under the lens of 'euhemerism' (interpreting gods as ancient humans memory), showcasing unique variants of stories like the death of Baldur.",
    recommendationReason: "Crucial for comparison. It reveals how non-Icelandic (specifically Danish and Southern Scandinavian) oral traditions characterized Odin, Thor, and the local sagas.",
    keyChapters: [
      { title: "Book III: Balderus & Høtherus", desc: "A highly distinct variation where Balderus and Høtherus are human rivals competing for the hand of Nanna, featuring wood-demons." }
    ]
  }
];

const NORSE_PRAYERS: Prayer[] = [
  {
    id: "sigrdrifa",
    title: "The Sigrdrífa's Prayer (Sigrdrífumál)",
    deity: "The Day, Night, Aesir, and Earth",
    origin: "Poetic Edda, stanza 3-4",
    text: "Heill dagr!\nHeilir dags synir!\nHeil nótt ok nift!\nÓreiðum augum\nlítið okkr þessig\nok gefið sitjöndum sigr!\n\nHeilir æsir!\nHeilar ásynjur!\nHeil sjá in fjölnýta fold!\nMál ok mannvits\ngefið okkr mærum tveim\nok læknishendr meðan lifum!",
    englishTranslation: "Hail to the Day! \nHail to the sons of Day!\nHail to Night and her daughters!\nLook upon us with friendly eyes,\nand give us who sit here victory!\n\nHail to the Aesir!\nHail to the Asynjur (Goddesses)!\nHail to the bountiful, life-giving Earth!\nSpeech and sacred wisdom grant to us,\nand healing hands as long as we live!",
    academicContext: "Recorded in the Sigrdrífumál scroll poem, this is the single most authentic, direct pagan prayer to survive from the Old Norse era. It is an opening invocation spoken by the Valkyrie Sigrdrífa upon being awakened from an enchanted sleep by the hero Sigurd. It addresses the cosmos in absolute reverence, invoking healing, cosmic balance, and mental clarity rather than destructive violence."
  },
  {
    id: "odin-invocation",
    title: "Odin's Invocation for Deep Wisdom",
    deity: "Odin (The Allfather, Lord of Runes)",
    origin: "Reconstructed Modern Heathen Liturgy",
    text: "Oðinn, Allfadir, geð-mælir,\nSkelfir vinda, rún-dróttinn.\nHeyr bæn mína í dagsins ljósi.\nGef mér sýn í skugganna djúp,\nSkilning rúnanna ok raddanna.\nLáttu visku þína streyma sem miður.",
    englishTranslation: "Odin, Allfather, ruler of the mind,\nShaker of winds, Lord of the Runes.\nHear my invocation in the light of day.\nGrant me sight in the depths of shadows,\nAn understanding of the runes and voices.\nLet your wisdom flow like the ancient mead of poetry.",
    academicContext: "Designed for scholars and seekers of wisdom. This prayer invokes Odin in his peaceful, priestly aspect as the finder of runes, seeker of counsel, and patron of academic work. It asks for intellectual endurance, clarity of research, and 'inner sight' corresponding to his sacrifice at Mimir's Well."
  },
  {
    id: "thor-ward",
    title: "Thor's Ward: Shielding of Midgard",
    deity: "Thor (The Thunderer, Protector of Mankind)",
    origin: "Reconstructed with ancient runestone formulas",
    text: "Þórr vigi þik!\nHeilagr lopt-konungr, hamar-dróttinn.\nHald þér yfir oss við jötna,\nSkeyti þótt ríði þruma þín sky.\nStyrk hug minn ok hvern lim,\nSveipa burtu hvern vofveiflegan vá.",
    englishTranslation: "May Thor hallow you!\nHoly King of the sky, Lord of the Hammer.\nHold your guard over us against the giants,\nEven as your thunder rides the clouds.\nStrengthen my mind and every limb,\nAnd sweep away all sudden dangers.",
    academicContext: "Historically, Norse people wore Mjölnir (Thor's hammer) pendants around their necks, and runestone inscriptions frequently said 'Þórr vigi' (May Thor hallow/protect this monument). This prayer focuses on the traditional psychological aspect of Thor as the steadfast friend of the common people, embodying vital physical strength, mental resilience, and absolute sanctuary."
  },
  {
    id: "freyja-abundance",
    title: "Freyja's Song of Cosmic Alignment",
    deity: "Freyja (The Golden One, Lady of Valr)",
    origin: "Ancient Vanir Cult reconstruction",
    text: "Mær ok rík, Freyja in gullna,\nVanadís, drottning ástar ok vala.\nHalltu friði yfir fold ok fólk,\nLáttu tár þín vaxa sem jörðin.\nGef mér fegurð hugans, heitasta blóðs\nOk friðsæla heill í allri vinnu.",
    englishTranslation: "Maiden and ruler, golden Freyja,\nLady of the Vanir, Queen of love and prophecy.\nHold peace over the earth and community,\nLet your amber tears nourish the soils.\nGrant to me beauty of mind, warmth of blood,\nAnd peaceful fortune in all my deeds.",
    academicContext: "Dedicated to the primary goddess of the Norse pantheon, this prayer touches on both her Vanir origin (as a goddess of fertility, high summer, and natural wealth) and her mystical nature as the mistress of Seidr magic (prophetic transition). Seeking her guidance cultivates natural beauty, harmony with ecological forces, and clarity of intuition."
  }
];

export default function NorseLoreTab() {
  const [activeSubTab, setActiveSubTab] = useState<"stories" | "books" | "prayers">("stories");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal / Detail state
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedBook, setSelectedBook] = useState<NorseBook | null>(null);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);

  // Copy-To-Clipboard handler
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Daily Rune Oracle / Study Aid Mini-Widget
  const [runeOfTheDay, setRuneOfTheDay] = useState<{ rune: string; name: string; meaning: string; conseil: string } | null>(null);
  const runicAlphabet = useMemo(() => [
    { rune: "ᚠ", name: "Fehu", meaning: "Wealth, Abundance, Vital Energy", conseil: "Focus on cultivating your talents and sharing your intellectual wealth with others." },
    { rune: "ᚢ", name: "Uruz", meaning: "Physical Strength, Untamed Potential", conseil: "Nourish your physical vessel today. Push past perceived mental limits with stamina." },
    { rune: "ᚦ", name: "Thurisaz", meaning: "Gateway, Thorn, Active Defense", conseil: "A crossroad is near. Step cautiously, clear obstacles with logical strategy." },
    { rune: "ᚨ", name: "Ansuz", meaning: "Communication, Odin's Breath, Inspiration", conseil: "A perfect day for writing, translation, and discussing theological mysteries. Listen closely." },
    { rune: "ᚱ", name: "Raido", meaning: "Journey, Rhythm, Cosmic Order", conseil: "Life is a structured cycle. Trust the pacing of your current studies and journeys." },
    { rune: "ᚲ", name: "Kenaz", meaning: "Beacon, Hearthfire, Clarity", conseil: "Let the light of careful study dispel dark academic doubts. Pursue creative outlets." },
    { rune: "ᚷ", name: "Gebo", meaning: "Gift, Reciprocity, Balance", conseil: "A fair exchange blesses both. Help a fellow student, and remain open to humble lessons." },
    { rune: "ᚹ", name: "Wunjo", meaning: "Joy, Harmony, Fellowship", conseil: "Celebrate small victories. Joy is found when personal ambition is balanced with community harmony." },
    { rune: "ᚺ", name: "Hagalaz", meaning: "Hail, Uncontrolled Crisis", conseil: "Sudden changes might happen. Treat disruptions as useful, natural cleansing cycles." }
  ], []);

  const drawRune = () => {
    const randomIndex = Math.floor(Math.random() * runicAlphabet.length);
    setRuneOfTheDay(runicAlphabet[randomIndex]);
  };

  // Filter systems
  const filteredStories = useMemo(() => {
    return NORSE_STORIES.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredBooks = useMemo(() => {
    return NORSE_BOOKS.filter(b => 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.importance.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredPrayers = useMemo(() => {
    return NORSE_PRAYERS.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div id="norse-lore-tab-container" className="flex-1 flex flex-col gap-6 font-sans animation-fade-in text-slate-200">
      
      {/* Decorative Norse Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-zinc-900 to-indigo-950 border border-white/10 rounded-3xl p-6 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 p-8 text-[120px] font-bold text-white/[0.02] font-mono select-none pointer-events-none leading-none">
          ᛟᛞᛁᚾ
        </div>
        
        <div className="space-y-2 text-center md:text-left z-10 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-[10px] md:text-xs font-mono text-indigo-400 font-extrabold uppercase tracking-widest">
            <span>⚔️ Ancient Germanic Religions</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
            Norse Holy Lore & Eddas
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Explored through primary text analysis, epic sagas, and recovered ritual invocations. Inspired by McCoy&apos;s scholarship on <span className="text-amber-400 font-semibold underline decoration-amber-400/40">norse-mythology.org</span>, bridging historical paganism and academic study.
          </p>
        </div>

        {/* Mini Daily Rune Interactive */}
        <div className="w-full md:w-auto min-w-[240px] shrink-0 bg-black/60 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 z-10 text-center relative shadow-inner">
          {runeOfTheDay ? (
            <div className="space-y-1.5 animate-fade-in">
              <div className="text-3xl font-black text-amber-500 font-mono bounce-subtle">
                {runeOfTheDay.rune}
              </div>
              <div className="text-xs font-bold text-white font-mono">
                Rune: {runeOfTheDay.name} ({runeOfTheDay.meaning})
              </div>
              <p className="text-[10px] text-slate-300 italic max-w-[220px] leading-snug">
                &ldquo;{runeOfTheDay.conseil}&rdquo;
              </p>
              <button 
                onClick={drawRune}
                className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 underline cursor-pointer mt-1"
              >
                Draw Another Rune Helper
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-2xl">🔮</div>
              <div className="text-xs font-bold text-slate-300">Runic Study Counsel</div>
              <p className="text-[10px] text-slate-400 max-w-[190px] leading-snug">
                Cast the historical Elder Futhark runes for a daily study affirmation.
              </p>
              <button 
                onClick={drawRune}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition shadow-lg cursor-pointer font-mono"
              >
                Cast Rune
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Tab Selector & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex bg-white/5 border border-white/15 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => { setActiveSubTab("stories"); setSearchQuery(""); }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === "stories"
                ? "bg-amber-500 text-black shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Mythological Stories</span>
          </button>
          <button
            onClick={() => { setActiveSubTab("books"); setSearchQuery(""); }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === "books"
                ? "bg-amber-500 text-black shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Best Source Books</span>
          </button>
          <button
            onClick={() => { setActiveSubTab("prayers"); setSearchQuery(""); }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === "prayers"
                ? "bg-amber-500 text-black shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>Sacred Invocations</span>
          </button>
        </div>

        {/* Search Engine Input */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101014] border border-white/10 rounded-2xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1">

        {/* Stories Panel */}
        {activeSubTab === "stories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredStories.map((story) => (
              <div 
                key={story.id} 
                className="bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] p-5 rounded-3xl flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group group-hover:translate-y-[-2px]"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-amber-500 tracking-wider">
                      {story.deity}
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/15">
                      {story.runicSymbol.split(" ")[0]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {story.summary}
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedStory(story)}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-indigo-900/40 hover:bg-indigo-900/70 text-indigo-200 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <span>Explore Myth & Scholar Analysis</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
            {filteredStories.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                No stories found matching your keyword.
              </div>
            )}
          </div>
        )}

        {/* Books Panel */}
        {activeSubTab === "books" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBooks.map((book) => (
                <div 
                  key={book.id} 
                  className="bg-gradient-to-br from-zinc-950/70 to-slate-900/80 border border-white/10 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider bg-amber-400/5 border border-amber-400/10 px-2 py-0.5 rounded-lg self-start">
                        {book.era}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Authorship: {book.authorship}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-white">{book.title}</h3>
                    
                    <p className="text-xs text-slate-300 leading-relaxed font-sans border-l-2 border-amber-500/40 pl-3">
                      {book.summary}
                    </p>

                    <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl space-y-1.5 text-xs text-slate-300">
                      <div className="font-bold text-white flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-emerald-400">
                        <Award className="w-3.5 h-3.5" />
                        <span>Core Significance</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        {book.importance}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBook(book)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>View Key Sagas & Chapters</span>
                  </button>
                </div>
              ))}
            </div>
            {filteredBooks.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No recommended books found matching your keyword.
              </div>
            )}
          </div>
        )}

        {/* Prayers Panel */}
        {activeSubTab === "prayers" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {filteredPrayers.map((prayer) => (
              <div 
                key={prayer.id} 
                className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="space-y-0.5 text-left">
                      <h3 className="text-lg font-bold text-white font-display">{prayer.title}</h3>
                      <p className="text-[10px] text-slate-400 uppercase font-mono">
                        Target Deity: <span className="text-amber-400 font-bold">{prayer.deity}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/15">
                      {prayer.origin}
                    </span>
                  </div>

                  {/* Dual Language Column View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="bg-black/30 border border-white/5 p-3 rounded-2xl space-y-1.5">
                      <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-slate-400">
                        Old Norse / Traditional Invocation
                      </span>
                      <pre className="text-xs text-indigo-300 font-mono italic leading-relaxed whitespace-pre-wrap">
                        {prayer.text}
                      </pre>
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl space-y-1.5">
                      <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-slate-400">
                        English Scholarly Translation
                      </span>
                      <pre className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {prayer.englishTranslation}
                      </pre>
                    </div>
                  </div>

                  {/* Academic Use Context */}
                  <div className="bg-amber-500/[0.03] border border-amber-500/10 p-3.5 rounded-2xl space-y-1.5 text-xs text-slate-300">
                    <span className="font-bold text-amber-400 text-[10px] uppercase tracking-wider font-mono">
                      Scholarly / Historiated Context
                    </span>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      {prayer.academicContext}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleCopy(prayer.id, prayer.englishTranslation)}
                    className="flex-1 py-2 bg-indigo-600/10 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-white/20 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    {copiedId === prayer.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied Translation!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Translation</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedPrayer(prayer)}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Examine Invocation Rules</span>
                  </button>
                </div>
              </div>
            ))}
            {filteredPrayers.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                No prayers found matching your keyword.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-[#060608]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#0b0b0f] border border-white/10 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="bg-indigo-500/15 p-2 rounded-xl border border-indigo-500/25">
                  <Scroll className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">{selectedStory.title}</h3>
                  <p className="text-xs text-indigo-400 font-mono uppercase font-bold tracking-wider">
                    Lore Chapter &bull; {selectedStory.deity}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStory(null)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition text-sm"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed text-left">
              
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl italic text-slate-100 relative">
                <span className="absolute top-2 right-4 text-xs font-mono text-amber-500/60 font-semibold uppercase">
                  Cosmic Symbol: {selectedStory.runicSymbol}
                </span>
                <p>&ldquo;{selectedStory.summary}&rdquo;</p>
              </div>

              <div className="whitespace-pre-line leading-relaxed text-slate-300 bg-black/20 p-4 rounded-2xl border border-white/5">
                {selectedStory.content}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <h4 className="text-xs font-mono text-amber-400 font-extrabold uppercase tracking-widest flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Scholarly Reading & Commentary</span>
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {selectedStory.analysis}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedStory(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Close Myth Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-[#060608]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#0b0b0f] border border-white/10 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="bg-amber-500/15 p-2 rounded-xl border border-amber-500/25 animate-pulse">
                  <BookMarked className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">{selectedBook.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Historical Compilation: {selectedBook.era}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBook(null)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition text-sm"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-left">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 space-y-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    Context & Purpose
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedBook.summary}
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-amber-400 uppercase font-mono tracking-wider font-extrabold">
                    Why McCoy Recommends This
                  </span>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{selectedBook.recommendationReason}&rdquo;
                  </p>
                </div>
              </div>

              {/* Chapter Layout Breakdowns */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono text-slate-400 font-bold tracking-widest pl-1">
                  Key Chapters / Sagas & Content Breakdowns
                </h4>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedBook.keyChapters.map((ch, idx) => (
                    <div 
                      key={idx}
                      className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-3 rounded-2xl flex items-start space-x-3 transition-colors text-left"
                    >
                      <div className="bg-white/5 text-bold text-amber-400 text-xs h-6 w-6 font-mono rounded-full flex items-center justify-center grow-0 shrink-0 select-none mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold font-display text-white">{ch.title}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{ch.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <a 
                href="https://norse-mythology.org" 
                target="_blank" 
                rel="noreferrer referrer" 
                className="text-[11px] font-mono text-amber-400 hover:underline flex items-center space-x-1"
              >
                <span>Read entire analysis on norse-mythology.org</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setSelectedBook(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Close Book Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Detail Modal */}
      {selectedPrayer && (
        <div className="fixed inset-0 bg-[#060608]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in font-mono">
          <div className="bg-[#0b0b0f] border border-white/10 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="bg-emerald-500/15 p-2 rounded-xl border border-emerald-500/25">
                  <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">{selectedPrayer.title}</h3>
                  <p className="text-xs text-slate-400">
                    Sacred Heathen Invocation Rules
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPrayer(null)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition text-sm"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed text-left font-sans">
              
              <div className="bg-indigo-500/10 border border-indigo-500/15 p-4 rounded-2xl space-y-2">
                <div className="text-[11px] font-mono text-indigo-400 font-extrabold uppercase tracking-wider flex items-center space-x-1">
                  <span>📜 Historical Theology Rules</span>
                </div>
                <p className="text-slate-200">
                  Unlike modern monotheistic religions with rigid dogma, Norse pre-Christian prayers focused on <strong>Gipt</strong> (reciprocal exchange, friendship) rather than absolute submission. Offering honey, mead, ale, or handmade baked goods represents an act of gifting to establish cosmic hospitality.
                </p>
              </div>

              <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Traditional Liturgy Layout:
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li><strong>Hallowing the Space</strong>: Creating a supportive, clean surrounding area free of visual noise.</li>
                  <li><strong>Calling the Deity</strong>: Invoking their mythological names, lineage, or achievements (e.g. &apos;Thor, protector of Midgard, son of Odin, wielder of Mjölnir&apos;).</li>
                  <li><strong>Establishing Reciprocity</strong>: Recalling previous gifts or pledging to cultivate the values they represent (courage, study, kindness).</li>
                  <li><strong>Expressing the Need</strong>: Petitioning for intellectual insight, health, or protection, and closing with a peaceful salute.</li>
                </ol>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  Deity Associations
                </div>
                <ul className="grid grid-cols-2 gap-2 text-[11px] font-mono leading-relaxed pt-1 text-slate-300">
                  <li>Odin: Mead, incense, coffee, books</li>
                  <li>Thor: Local ales, stone bread, heavy iron</li>
                  <li>Freyja: Sweet honey, amber, wild flowers</li>
                  <li>Njord: Seashells, salt water, ship models</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedPrayer(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Understand Invocation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
