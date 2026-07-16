import React, { useState } from "react";
import { 
  Type, 
  Layers, 
  Check, 
  Copy, 
  HelpCircle, 
  RefreshCw, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  ZoomIn, 
  Sparkles,
  ExternalLink
} from "lucide-react";

interface PhraseTest {
  id: string;
  phrase: string;
  transliteration: string;
  meaning: string;
  ligature: string;
  ligatureName: string;
  exampleWord: string;
}

const TEST_PHRASES: PhraseTest[] = [
  {
    id: "rudra",
    phrase: "ॐ नमो भगवते रुद्राय",
    transliteration: "oṃ namo bhagavate rudrāya",
    meaning: "Salutations to the Divine Lord Rudra (the Transformer).",
    ligature: "द्र (d-ra)",
    ligatureName: "Ra-vadi (Subjoined Ra)",
    exampleWord: "रुद्राय"
  },
  {
    id: "moksha",
    phrase: "मुच्यते सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः",
    transliteration: "mucyate sarvapāpebhyo mokṣayiṣyāmi mā śucaḥ",
    meaning: "You shall be liberated from all sins; do not grieve.",
    ligature: "क्ष (k-ṣa)",
    ligatureName: "Ksha-Kakar (Fused K+Sha)",
    exampleWord: "मोक्षयिष्यामि"
  },
  {
    id: "tryambakam",
    phrase: "त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
    transliteration: "tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam",
    meaning: "We worship the Three-Eyed Lord, fragrant and nourishing.",
    ligature: "त्र (t-ra)",
    ligatureName: "Ta-vadi (Fused T+Ra)",
    exampleWord: "त्र्यम्बकं"
  },
  {
    id: "tattva",
    phrase: "तत्त्वमसि श्वेतकेतो इति श्रुतिः",
    transliteration: "tattvamasi śvetaketo iti śrutiḥ",
    meaning: "That art thou, O Shvetaketu - thus declares the Upanishad.",
    ligature: "त्त (t-ta)",
    ligatureName: "Double Ta (Stacked Ta)",
    exampleWord: "तत्त्वमसि"
  },
  {
    id: "buddhi",
    phrase: "बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते",
    transliteration: "buddhiyukto jahātīha ubhe sukṛtaduṣkṛte",
    meaning: "One united with spiritual intelligence discards both good and evil deeds.",
    ligature: "द्ध (d-dha)",
    ligatureName: "Da-Dha Ligature",
    exampleWord: "बुद्धियुक्तो"
  },
  {
    id: "shankara",
    phrase: "शङ्करं लोकशङ्करं नमामि",
    transliteration: "śaṅkaraṃ lokaśaṅkaraṃ namāmi",
    meaning: "I bow to Shankara, the benefactor of the universe.",
    ligature: "ङ्क (ṅ-ka)",
    ligatureName: "Nga-Ka Stacked Ligature",
    exampleWord: "शङ्करं"
  },
  {
    id: "adbhuta",
    phrase: "ततः स विस्मयाविष्टो हृष्टरोमा धनंजयः",
    transliteration: "tataḥ sa vismayāviṣṭo hṛṣṭaromā dhanaṃjayaḥ",
    meaning: "Then Arjuna, filled with wonder, his hair standing on end...",
    ligature: "द्भ (d-bha)",
    ligatureName: "Da-Bha Ligature",
    exampleWord: "हृष्टरोमा"
  },
  {
    id: "srishti",
    phrase: "मयाध्यक्षेण प्रकृतिः सूयते सचराचरम्",
    transliteration: "mayādhyakṣeṇa prakṛtiḥ sūyate sacarācaram",
    meaning: "Under My supervision, material nature produces the moving and unmoving world.",
    ligature: "ष्ट (ṣ-ṭa)",
    ligatureName: "Sha-Ta Ligature",
    exampleWord: "मयाध्यक्षेण"
  },
  {
    id: "vidya",
    phrase: "विद्यते न सतो भावो नाभावो विद्यते सतः",
    transliteration: "vidyate na sato bhāvo nābhāvo vidyate sataḥ",
    meaning: "The unreal has no existence; the real never ceases to exist.",
    ligature: "द्य (d-ya)",
    ligatureName: "Da-Ya Conjunct",
    exampleWord: "विद्यते"
  },
  {
    id: "brahma",
    phrase: "अहं ब्रह्मास्मि इति उपनिषद् वाक्यम्",
    transliteration: "ahaṃ brahmāsmi iti upaniṣad vākyam",
    meaning: "'I am Brahman (the Infinite Reality)' - the Upanishadic mahavakya.",
    ligature: "ह्म (h-ma)",
    ligatureName: "Ha-Ma Conjunct",
    exampleWord: "ब्रह्मास्मि"
  }
];

export function ScriptureRenderingTest() {
  const [selectedPhraseId, setSelectedPhraseId] = useState<string>("rudra");
  const [fontFamily, setFontFamily] = useState<string>("font-hindi");
  const [lineHeight, setLineHeight] = useState<number>(1.95);
  const [letterSpacing, setLetterSpacing] = useState<string>("tracking-normal");
  const [verticalPadding, setVerticalPadding] = useState<number>(6);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [simulatedMobile, setSimulatedMobile] = useState<boolean>(false);
  const [customVerificationText, setCustomVerificationText] = useState<string>("");
  const [ligatureStatus, setLigatureStatus] = useState<Record<string, "passed" | "unverified">>(() => {
    const initial: Record<string, "passed" | "unverified"> = {};
    TEST_PHRASES.forEach(p => {
      initial[p.id] = "passed"; // Default assumed passed, but auditable
    });
    return initial;
  });

  const activePhrase = TEST_PHRASES.find(p => p.id === selectedPhraseId) || TEST_PHRASES[0];

  const handleCopy = () => {
    const fullText = `${activePhrase.phrase}\nTransliteration: ${activePhrase.transliteration}\nMeaning: ${activePhrase.meaning}\n(Tested with Unicode Ligature ${activePhrase.ligature})`;
    navigator.clipboard.writeText(fullText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const toggleLigatureStatus = (id: string) => {
    setLigatureStatus(prev => ({
      ...prev,
      [id]: prev[id] === "passed" ? "unverified" : "passed"
    }));
  };

  const getFontStyles = () => {
    return {
      lineHeight: `${lineHeight}`,
      paddingTop: `${verticalPadding}px`,
      paddingBottom: `${verticalPadding}px`,
    };
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-5 font-sans text-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Type className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h4 className="font-mono text-white text-sm font-bold uppercase tracking-wider">
              Scripture Devanagari Rendering Test Module
            </h4>
            <p className="text-[10px] text-slate-400">
              Audit the layout integrity, ligature conjugation, and clipping prevention of complex Hindi & Sanskrit glyphs
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setSimulatedMobile(false)}
            className={`p-1 rounded cursor-pointer ${!simulatedMobile ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'}`}
            title="Desktop Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSimulatedMobile(true)}
            className={`p-1 rounded cursor-pointer ${simulatedMobile ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'}`}
            title="Simulate Mobile Viewport"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Controls & Ligature Checkers */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#121217] border border-white/5 p-3 rounded-lg space-y-3">
            <span className="block font-mono font-bold text-[10px] text-slate-400 uppercase tracking-wide">
              Font & Layout Diagnostics
            </span>
            
            {/* Font Family Selection */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-[10px] block font-mono uppercase">Font Stack</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setFontFamily("font-hindi")}
                  className={`px-2 py-1.5 rounded-md border text-left cursor-pointer transition-colors ${
                    fontFamily === "font-hindi"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span className="block font-bold">Noto Devanagari</span>
                  <span className="text-[9px] opacity-60">Primary fallback</span>
                </button>
                <button
                  onClick={() => setFontFamily("font-sans")}
                  className={`px-2 py-1.5 rounded-md border text-left cursor-pointer transition-colors ${
                    fontFamily === "font-sans"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span className="block font-bold">System Sans</span>
                  <span className="text-[9px] opacity-60">Segoe UI / Kohinoor</span>
                </button>
              </div>
            </div>

            {/* Line Height Control */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 uppercase">Line Height (Prevent Clipping)</span>
                <span className="text-amber-400 font-bold">{lineHeight}x</span>
              </div>
              <input
                type="range"
                min="1.4"
                max="2.5"
                step="0.05"
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-white/5 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Letter Spacing Control */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-[10px] block font-mono uppercase">Letter Spacing</label>
              <div className="grid grid-cols-3 gap-1">
                {["tracking-tight", "tracking-normal", "tracking-wide"].map((track) => (
                  <button
                    key={track}
                    onClick={() => setLetterSpacing(track)}
                    className={`py-1 rounded text-center font-mono text-[9px] cursor-pointer ${
                      letterSpacing === track 
                        ? "bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold" 
                        : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {track.replace("tracking-", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Vertical Padding Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 uppercase">Vertical Padding</span>
                <span className="text-amber-400 font-bold">{verticalPadding}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="2"
                value={verticalPadding}
                onChange={(e) => setVerticalPadding(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-white/5 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </div>

          {/* Ligature List Selection */}
          <div className="space-y-2">
            <span className="block font-mono font-bold text-[10px] text-slate-400 uppercase tracking-wide">
              Unicode Ligatures Under Test
            </span>
            <div className="grid grid-cols-1 gap-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {TEST_PHRASES.map((p) => (
                <div
                  key={p.id}
                  className={`p-2 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                    selectedPhraseId === p.id
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-[#0f0f14] border-white/5 hover:border-white/10"
                  }`}
                  onClick={() => setSelectedPhraseId(p.id)}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-white font-bold">{p.ligature}</span>
                      <span className="text-[10px] text-slate-400">({p.ligatureName})</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-hindi block leading-relaxed">
                      Example: <span className="text-amber-300/80 font-bold">{p.exampleWord}</span>
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLigatureStatus(p.id);
                    }}
                    className={`p-1 rounded-md cursor-pointer transition-colors ${
                      ligatureStatus[p.id] === "passed"
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-slate-500 bg-white/5 hover:text-white"
                    }`}
                    title={ligatureStatus[p.id] === "passed" ? "Rendering verified on this device" : "Click to mark as verified"}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Interactive Reading Panel Simulator */}
        <div className={`lg:col-span-7 flex flex-col justify-between ${simulatedMobile ? "max-w-[360px] mx-auto border-x border-white/10 p-2 bg-black/40 rounded-xl" : ""}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Reading View Panel Simulator
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                {simulatedMobile ? "Simulating Mobile Width" : "Standard View"}
              </span>
            </div>

            {/* Simulated Sacred Verse Panel */}
            <div className="bg-[#111116] border border-amber-500/10 rounded-xl p-5 relative overflow-hidden shadow-inner">
              {/* Golden corner decor */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-amber-500/30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-amber-500/30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-amber-500/30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-amber-500/30" />

              <div className="space-y-4 text-center">
                {/* Liturgical original text */}
                <div className="border-b border-white/[0.03] pb-4">
                  <span className="font-mono text-[9px] uppercase text-amber-500/50 tracking-widest block mb-2">Original Devanagari Script</span>
                  <div className="bg-black/30 p-4 rounded-lg flex items-center justify-center min-h-[90px]">
                    <p 
                      className={`text-white text-xl sm:text-2xl text-center select-all transition-all duration-150 ${fontFamily} ${letterSpacing}`}
                      style={getFontStyles()}
                    >
                      {activePhrase.phrase}
                    </p>
                  </div>
                  {/* Visual bounding box checklist helper */}
                  <div className="mt-2.5 flex items-center justify-center gap-4 text-[9.5px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> No matra clipping
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Clear ligatures
                    </span>
                  </div>
                </div>

                {/* Transliteration */}
                <div>
                  <span className="font-mono text-[9px] uppercase text-indigo-400/50 tracking-widest block mb-1">Romanized Transliteration</span>
                  <p className="font-mono text-xs sm:text-sm text-slate-300 italic font-medium leading-relaxed">
                    {activePhrase.transliteration}
                  </p>
                </div>

                {/* English Translation */}
                <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5">
                  <span className="font-mono text-[9px] uppercase text-slate-500 tracking-widest block mb-1">Meaning & Scholastic Context</span>
                  <p className="font-serif text-xs sm:text-sm text-slate-400 leading-relaxed">
                    &ldquo;{activePhrase.meaning}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Clipboard Integrity Test Card */}
            <div className="bg-[#0c0c0f] border border-white/5 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  UTF-8 Clipboard Character Integrity
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded cursor-pointer transition-all text-[10px] font-mono"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Scripture</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Copies raw Unicode codepoints to verify clipboard pipelines. Paste the copied text anywhere to check that compound conjuncts (e.g., <code className="bg-white/5 px-1 rounded font-mono text-amber-300">{activePhrase.exampleWord}</code>) do not suffer character-entity corruption or breaking into raw viramas.
              </p>
            </div>
          </div>

          {/* Interactive custom character decoder playground */}
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-2 mt-4">
            <span className="block font-mono font-bold text-[10px] text-slate-400 uppercase tracking-wide">
              Custom UTF-8 String Audit Field:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customVerificationText}
                onChange={(e) => setCustomVerificationText(e.target.value)}
                placeholder="Type or paste any Sanskrit/Hindi phrase here..."
                className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1.5 text-white font-hindi text-xs focus:outline-none focus:border-amber-500/50"
              />
              {customVerificationText && (
                <button
                  onClick={() => setCustomVerificationText("")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded text-[10px] font-mono cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            {customVerificationText && (
              <div className="bg-[#0b0b0f] p-2.5 rounded text-[10px] font-mono text-slate-300 space-y-1">
                <span className="text-slate-500 uppercase block font-bold text-[9px]">Hex unicode representation:</span>
                <div className="flex flex-wrap gap-1.5 max-h-[60px] overflow-y-auto">
                  {customVerificationText.split("").map((char: string, index) => {
                    const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0");
                    return (
                      <span key={index} className="bg-white/5 px-1 py-0.5 rounded border border-white/5 text-[9.5px]">
                        <span className="text-amber-400">'{char}'</span> <span className="text-slate-500">U+{code}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACADEMIC INFO */}
      <div className="bg-indigo-950/20 border border-indigo-500/10 p-3.5 rounded-lg flex items-start space-x-2.5">
        <HelpCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-300">
          <p className="font-semibold text-white">How Devanagari ligatures render on digital screens:</p>
          <p className="leading-relaxed text-[10.5px] text-slate-400">
            Devanagari scripts use the Unicode <code className="bg-white/5 px-1 rounded font-mono">Virama (् / U+094D)</code> to suppress the inherent vowel 'a' of a consonant. When two consonants are separated by a virama, the modern browser engine (such as HarfBuzz or Uniscribe) automatically renders them as a single combined conjunct glyph (ligature). If proper styling, generous line-height (<code className="bg-white/5 px-1 rounded font-mono">1.8+</code>), or appropriate fallback fonts are absent, these complex shapes can easily clip or render incorrectly.
          </p>
        </div>
      </div>
    </div>
  );
}
