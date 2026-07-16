/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Minimize2, 
  Loader2, 
  Compass, 
  ChevronRight, 
  Play, 
  Square,
  Sparkle
} from "lucide-react";

interface VoiceAssistantProps {
  // Current active scripture context from parent
  activeBookTitle?: string;
  activeBookKey?: string;
  activeChapterNum?: number | string;
  activeIntroduction?: string;
  activeVersesArray?: { number: number | string; translation: string }[];
  
  // Current active character story context
  activeCharacterName?: string;
  activeCharacterStory?: string;
  activeCharacterEthos?: string;

  // AI & Voice parameters
  useAIVoice: boolean;
  setUseAIVoice: (val: boolean) => void;
  selectedAIVoice: string;
  setSelectedAIVoice: (name: string) => void;
  highThinking: boolean;

  // External audio speaker dispatchers
  onSpeak: (text: string, label: string) => Promise<void>;
  onStop: () => void;
  isSpeaking: boolean;
  audioLoading: boolean;
  audioVolume: number;
  setAudioVolume: (val: number) => void;
}

export default function VoiceAssistant({
  activeBookTitle = "",
  activeBookKey = "",
  activeChapterNum = "1",
  activeIntroduction = "",
  activeVersesArray = [],
  activeCharacterName = "",
  activeCharacterStory = "",
  activeCharacterEthos = "",
  useAIVoice,
  setUseAIVoice,
  selectedAIVoice,
  setSelectedAIVoice,
  highThinking,
  onSpeak,
  onStop,
  isSpeaking,
  audioLoading,
  audioVolume,
  setAudioVolume
}: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [activeSpeechType, setActiveSpeechType] = useState<string>("none"); // 'scripture', 'story', 'custom'

  // Curated classic mystical comparative poetry/quotes for quick narration trials
  const CURATED_POETIC_VERSES = [
    {
      title: "The Tao Te Ching - Verse 1",
      tradition: "Taoism",
      text: "The Tao that can be spoken of is not the eternal Tao. The name that can be named is not the eternal name. The nameless is the origin of Heaven and Earth; the named is the mother of myriad things."
    },
    {
      title: "Bhagavad Gita - Immutable Soul Scroll",
      tradition: "Hinduism",
      text: "Never the spirit was born; the spirit shall cease to be never; Never was time it was not; End and Beginning are dreams! Birthless and deathless and changeless remaineth the spirit forever; Death hath not touched it at all, dead though the house of it seems!"
    },
    {
      title: "The Dhammapada - Mind Preamble",
      tradition: "Buddhism",
      text: "Mind precedes all mental states. Mind is their chief, they are all mind-wrought. If with an impure mind a person speaks or acts, suffering follows him like the wheel that follows the foot of the ox."
    },
    {
      title: "Quran - Ayat Al-Kursi (Verse of the Throne)",
      tradition: "Islam",
      text: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth."
    }
  ];

  const handleReadScripture = () => {
    if (!activeIntroduction && activeVersesArray.length === 0) {
      alert("No active scripture is loaded in the viewer. Please click a book from the list to load it first.");
      return;
    }

    let fullPassage = `Now reading from the ${activeBookTitle}. `;
    if (activeIntroduction) {
      fullPassage += `The scholarly summary introduces this chapter: ${activeIntroduction}. `;
    }
    if (activeVersesArray.length > 0) {
      fullPassage += "Begin canonical reading: ";
      fullPassage += activeVersesArray.map((v) => `Verse ${v.number}: ${v.translation}`).join(" ");
    }

    setActiveSpeechType("scripture");
    onSpeak(fullPassage, "Scripture Reader");
  };

  const handleReadStory = () => {
    if (!activeCharacterStory) {
      alert("No active character story is currently loaded. Click on the 'Sacred Legends' tab to select a character story first.");
      return;
    }

    const narrationText = `Tale of ${activeCharacterName}, who is ${activeCharacterEthos}. ${activeCharacterStory}`;
    setActiveSpeechType("story");
    onSpeak(narrationText, `${activeCharacterName} Tale`);
  };

  const handleReadCustom = () => {
    if (!customText.trim()) return;
    setActiveSpeechType("custom");
    onSpeak(customText, "Custom Read");
  };

  const handleTriggerPoem = (text: string) => {
    setCustomText(text);
    setActiveSpeechType("custom");
    onSpeak(text, "Poetic Verse");
  };

  return (
    <>
      {/* FLOATING COLLAPSED ORB ACTIVATOR */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 select-none cursor-pointer outline-none ${
            isSpeaking 
              ? "bg-amber-500 text-black animate-pulse shadow-amber-500/25 border border-white/20" 
              : "bg-[#111116] text-[#d97706] border border-amber-500/30 hover:border-amber-400"
          }`}
          title="Open AI Scholar Voice Narrator Assistant"
        >
          {isSpeaking ? (
            <div className="flex items-center space-x-1">
              {/* Simple audio bar animations */}
              <span className="w-1 h-3 bg-black rounded-full animate-[bounce_0.8s_infinite_100ms]"></span>
              <span className="w-1 h-4.5 bg-black rounded-full animate-[bounce_0.8s_infinite_300ms]"></span>
              <span className="w-1 h-3 bg-black rounded-full animate-[bounce_0.8s_infinite_200ms]"></span>
              <span className="hidden sm:inline-block text-xs font-bold leading-none font-sans ml-1.5 uppercase tracking-wide">
                AI Speaking...
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 stroke-[2] animate-pulse" />
              <span className="hidden sm:inline-block text-xs font-extrabold uppercase font-mono tracking-wider">
                AI Narrator
              </span>
            </div>
          )}
        </button>
      </div>

      {/* FLOAT PANELS DRAWER ROW */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[75vh] md:max-h-[80vh]">
          
          {/* Header Panel */}
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <div className="bg-amber-500/10 border border-amber-500/25 p-1 rounded">
                <Music className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-mono tracking-widest text-amber-400 font-extrabold block">
                  AI Scholar Narrator
                </h3>
                <span className="text-[9px] text-slate-400 font-sans block">
                  Verbal translation and deep speech synthesis
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded transition-all cursor-pointer border border-transparent outline-none"
              title="Collapse Panel"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Visual Voice Wave indicator when speaking */}
          {isSpeaking && (
            <div className="bg-amber-500/10 px-4 py-2 border-b border-amber-500/10 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[10px] text-amber-300 font-serif italic">
                Active synthesis narrative wave...
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5, 4, 3, 2, 4, 6, 2, 1, 3, 4].map((h, i) => (
                  <span 
                    key={i} 
                    style={{ height: `${h * 2.5}px` }} 
                    className="w-[2px] bg-amber-400 rounded-full animate-[pulse_1s_infinite]"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Scrollable Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Setting: Switch Voice and Model Option */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Speech Synthesis</span>
                
                {/* On-Off Option */}
                <button
                  onClick={() => setUseAIVoice(!useAIVoice)}
                  className={`text-[9px] font-mono rounded px-1.5 py-0.5 border ${
                    useAIVoice 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                  }`}
                >
                  {useAIVoice ? "HD AI Audio Voice" : "Browser Default Vocalist"}
                </button>
              </div>

              {useAIVoice && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Select Speaker</label>
                  <select
                    value={selectedAIVoice}
                    onChange={(e) => setSelectedAIVoice(e.target.value)}
                    className="w-full bg-[#111116] border border-white/10 text-xs text-slate-300 rounded p-1.5 cursor-pointer outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="Kore">Kore (Clear / Scholar)</option>
                    <option value="Zephyr">Zephyr (Soft / Contemplative)</option>
                    <option value="Puck">Puck (Cheerful / Fluid)</option>
                    <option value="Charon">Charon (Declamatory)</option>
                    <option value="Fenrir">Fenrir (Academic)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Playback Volume Slider Component */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase font-bold">
                  {audioVolume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span>Playback Volume</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  {Math.round(audioVolume * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAudioVolume(audioVolume > 0 ? 0 : 0.85)}
                  className="p-1.5 rounded bg-[#111116] border border-white/10 hover:border-amber-500/20 text-slate-400 hover:text-white transition-all cursor-pointer select-none"
                  title={audioVolume > 0 ? "Mute Output" : "Unmute Output"}
                >
                  {audioVolume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-amber-500" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-amber-500 bg-stone-900 border-none h-1 rounded-lg cursor-pointer appearance-none outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Quick Narration buttons for pages */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Narrate App Pages
              </span>

              {/* Read Active Scripture Option */}
              <div className="border border-white/5 bg-[#0e0e13] rounded-xl p-3 flex flex-col justify-between gap-3 text-left">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Active Course</span>
                  <p className="text-xs font-serif text-white truncate max-w-[280px]">
                    {activeBookTitle ? `📖 ${activeBookTitle} (Chapter ${activeChapterNum})` : "No Scripture Loaded"}
                  </p>
                </div>
                <button
                  onClick={handleReadScripture}
                  disabled={audioLoading || !activeBookTitle}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {audioLoading && activeSpeechType === "scripture" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 text-current fill-current" />
                  )}
                  <span>Read Scripture Chapter</span>
                </button>
              </div>

              {/* Read Character Story Option */}
              <div className="border border-white/5 bg-[#0e0e13] rounded-xl p-3 flex flex-col justify-between gap-3 text-left">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Legendary Tale Context</span>
                  <p className="text-xs font-serif text-white truncate max-w-[280px]">
                    {activeCharacterName ? `🎭 Chronicle of ${activeCharacterName}` : "No Character Story Loaded"}
                  </p>
                </div>
                <button
                  onClick={handleReadStory}
                  disabled={audioLoading || !activeCharacterStory}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {audioLoading && activeSpeechType === "story" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 text-current fill-current" />
                  )}
                  <span>Narrate Selected Story</span>
                </button>
              </div>

            </div>

            {/* Custom Narrate Clipboard Section */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Narrate Custom Poetry & Verses
              </span>
              <textarea
                placeholder="Paste or type any poem, scripture, or notes here for the AI Scholar voice to read aloud to you..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full h-16 bg-[#08080a] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-serif resize-none"
              />
              <button
                onClick={handleReadCustom}
                disabled={audioLoading || !customText.trim()}
                className="w-full bg-[#16161c] hover:bg-white/5 text-slate-300 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
              >
                {audioLoading && activeSpeechType === "custom" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3" />
                )}
                <span>Play Custom Text</span>
              </button>
            </div>

            {/* Poetic index recommendations */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-500 font-bold block">
                Narrator Preloaded Audios
              </span>
              <div className="space-y-1.5">
                {CURATED_POETIC_VERSES.map((poem, i) => (
                  <button
                    key={i}
                    onClick={() => handleTriggerPoem(poem.text)}
                    className="w-full text-left p-2 rounded bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-amber-500/25 transition-all text-[11px] font-sans text-slate-300 flex justify-between items-center gap-2 cursor-pointer"
                  >
                    <div className="truncate">
                      <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1 py-0.2 rounded font-mono mr-1">
                        {poem.tradition}
                      </span>
                      <strong className="text-white font-serif">{poem.title}</strong>
                    </div>
                    <ChevronRight className="w-3 h-3 text-amber-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Player controls */}
          <div className="bg-[#0b0b0e] border-t border-white/10 p-3.5 flex items-center justify-between shrink-0">
            {isSpeaking ? (
              <button
                onClick={onStop}
                className="bg-red-500 hover:bg-red-400 text-white rounded-lg p-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer outline-none uppercase tracking-wider"
              >
                <Square className="w-3 h-3 text-current fill-current" />
                <span>Stop Vocal</span>
              </button>
            ) : (
              <span className="text-[10px] text-slate-500 font-serif italic">
                Ready to play narration
              </span>
            )}

            <span className="text-[9px] font-mono text-slate-500">
              HD Audio Beta
            </span>
          </div>

        </div>
      )}
    </>
  );
}
