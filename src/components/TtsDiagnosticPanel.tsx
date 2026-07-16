import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Square, 
  RefreshCw, 
  Info,
  Terminal,
  VolumeX,
  Sparkles
} from "lucide-react";
import { getSafeSpeechSynthesis } from "../App";
import { selectBestVoice, SUPPORTED_LOCALES } from "../LocaleManager";

export function TtsDiagnosticPanel() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [germanVoices, setGermanVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [testText, setTestText] = useState<string>("Im Anfang war das Wort, und das Wort war bei Gott, und das Wort war Gott.");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [activeUtterance, setActiveUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Helper to add timestamped logs
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDiagnosticLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 24)]);
  };

  const loadVoices = () => {
    const synth = getSafeSpeechSynthesis();
    if (!synth) {
      setSupported(false);
      addLog("SpeechSynthesis is NOT supported or blocked by sandbox/iframe policies in this browser.");
      return;
    }

    synthRef.current = synth;
    setSupported(true);

    const allVoices = synth.getVoices() || [];
    setVoices(allVoices);

    // Filter German voices
    const deVoices = allVoices.filter(v => {
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return lang.startsWith("de") || lang.includes("german") || name.includes("deutsch") || name.includes("german");
    });
    setGermanVoices(deVoices);

    // Identify the best voice
    const bestDe = selectBestVoice("de-DE", allVoices);
    setSelectedVoice(bestDe);

    addLog(`System voices loaded successfully. Total voices found: ${allVoices.length}`);
    if (deVoices.length > 0) {
      addLog(`Found ${deVoices.length} German-compatible voice(s) in browser voice pool.`);
      if (bestDe) {
        const isPremium = bestDe.name.toLowerCase().includes("google") || 
                           bestDe.name.toLowerCase().includes("natural") || 
                           bestDe.name.toLowerCase().includes("premium") ||
                           bestDe.name.toLowerCase().includes("yannick");
        addLog(`Selected best voice: "${bestDe.name}" (${bestDe.lang}) ${isPremium ? "[Premium Mode Enabled]" : "[Standard Mode]"}`);
      }
    } else {
      addLog("No German-compatible voices found in the browser's speechSynthesis voice list. Application will default to high-fidelity server-side translation proxy TTS.");
    }
  };

  useEffect(() => {
    loadVoices();

    const synth = getSafeSpeechSynthesis();
    if (synth && typeof window !== "undefined") {
      // Event listener for asynchronous voice loading
      const handleVoicesChanged = () => {
        addLog("Browser fired 'onvoiceschanged' event. Refreshing voice pool...");
        loadVoices();
      };
      
      synth.onvoiceschanged = handleVoicesChanged;
      return () => {
        if (synth) {
          synth.onvoiceschanged = null;
        }
      };
    }
  }, []);

  const handleRefresh = () => {
    addLog("Manual voice refresh triggered.");
    loadVoices();
  };

  const handlePlayTest = () => {
    const synth = synthRef.current;
    if (!synth) {
      addLog("Cannot speak: SpeechSynthesis not available.");
      return;
    }

    // Cancel any active speech first
    synth.cancel();
    setIsSpeaking(false);

    if (!testText.trim()) {
      addLog("Warning: Test text is empty. Enter some text to synthesize.");
      return;
    }

    addLog(`Initiating local SpeechSynthesis test...`);
    const utterance = new SpeechSynthesisUtterance(testText);
    
    // Assign best German voice if found
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
      addLog(`Configured voice: "${selectedVoice.name}" with tag "${selectedVoice.lang}"`);
    } else {
      utterance.lang = "de-DE";
      addLog(`No specific German voice found. Emitting standard browser voice with language tag 'de-DE' as fallback.`);
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      addLog("Audio playback started successfully.");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveUtterance(null);
      addLog("Audio playback completed.");
    };

    utterance.onerror = (e) => {
      setIsSpeaking(false);
      setActiveUtterance(null);
      addLog(`Playback error encountered: ${e.error || "Unknown Error"}`);
    };

    setActiveUtterance(utterance);
    synth.speak(utterance);
  };

  const handleStopTest = () => {
    const synth = synthRef.current;
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
      setActiveUtterance(null);
      addLog("Playback interrupted by user.");
    }
  };

  // Determine the overall status badge of German TTS
  const getGermanStatus = () => {
    if (germanVoices.length === 0) {
      return {
        label: "Online Proxy Fallback Active",
        desc: "No local German voice found. The application will leverage our seamless high-fidelity Google Translate proxy for flawless German audio translation.",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
      };
    }

    const hasPremium = germanVoices.some(v => {
      const n = v.name.toLowerCase();
      return n.includes("google") || n.includes("natural") || n.includes("premium") || n.includes("yannick");
    });

    if (hasPremium) {
      return {
        label: "Optimal (High-Quality Voices Found)",
        desc: "Premium, natural, or Google high-fidelity German speech engines are active. Experience stunning local native voice synthesis.",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        icon: <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
      };
    }

    return {
      label: "Standard Quality (Native Voices Available)",
      desc: "Standard local German speech synthesis is fully active. Sound quality depends on browser configuration.",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      icon: <CheckCircle2 className="w-5 h-5 text-blue-400" />
    };
  };

  const status = getGermanStatus();

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-5 font-sans text-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h4 className="font-mono text-white text-sm font-bold uppercase tracking-wider">
              Speech Synthesis (TTS) & German Voice Diagnostics
            </h4>
            <p className="text-[10px] text-slate-400">
              Assists in testing and verification of high-quality local German audio rendering
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all text-[11px] font-mono cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-spin' : ''}`} />
          <span>Refresh Voices</span>
        </button>
      </div>

      {/* API Support Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#121217] border border-white/5 p-3 rounded-lg flex items-center space-x-3">
          {supported === true ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : supported === false ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <div>
            <span className="block font-mono font-bold text-[10px] text-slate-400 uppercase">Browser Speech API</span>
            <span className="font-sans text-white text-xs">
              {supported === true ? "SpeechSynthesis Supported" : supported === false ? "Access Blocked / Unsupported" : "Evaluating Access..."}
            </span>
          </div>
        </div>

        <div className="bg-[#121217] border border-white/5 p-3 rounded-lg flex items-center space-x-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <span className="block font-mono font-bold text-[10px] text-slate-400 uppercase">Available System Voices</span>
            <span className="font-sans text-white text-xs">
              {voices.length > 0 ? `${voices.length} system voices detected` : "0 voices loaded yet"}
            </span>
          </div>
        </div>
      </div>

      {/* German Status Card */}
      <div className={`p-3 border rounded-lg ${status.color} space-y-1.5`}>
        <div className="flex items-center space-x-2">
          {status.icon}
          <span className="font-mono font-bold uppercase tracking-wide text-xs">
            German (de-DE) Support: {status.label}
          </span>
        </div>
        <p className="font-serif text-[11px] leading-relaxed text-slate-300">
          {status.desc}
        </p>
      </div>

      {/* Primary voice details */}
      {selectedVoice && (
        <div className="bg-[#121217] border border-white/5 p-3 rounded-lg space-y-2">
          <span className="block font-mono font-bold text-[10px] text-amber-400 uppercase tracking-wide">
            Selected Best German Voice Configuration:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500">Name:</span> <span className="text-white font-bold">{selectedVoice.name}</span>
            </div>
            <div>
              <span className="text-slate-500">IETF Tag:</span> <span className="text-white">{selectedVoice.lang}</span>
            </div>
            <div>
              <span className="text-slate-500">Service:</span> <span className="text-white">{selectedVoice.localService ? "Local/Native" : "Remote Network"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Testing Section */}
      <div className="space-y-2 pt-1">
        <span className="block font-mono font-bold text-[10px] text-slate-400 uppercase tracking-wide">
          Interactive Voice Playback Test (German):
        </span>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="flex-1 bg-[#121217] border border-white/10 hover:border-white/20 focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-white font-sans text-xs focus:outline-none transition-colors"
            placeholder="Geben Sie einen deutschen Satz ein..."
          />
          <div className="flex space-x-1.5 shrink-0">
            {!isSpeaking ? (
              <button
                onClick={handlePlayTest}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono rounded-lg transition-colors cursor-pointer text-[11px]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </button>
            ) : (
              <button
                onClick={handleStopTest}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-4 py-1.5 bg-rose-500 hover:bg-rose-400 text-white font-bold font-mono rounded-lg transition-colors cursor-pointer text-[11px]"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Logger Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Diagnostics Event Console</span>
        </div>
        <div className="bg-[#0b0b0f] border border-white/5 rounded-lg p-3 font-mono text-[10px] text-slate-400 space-y-1 h-28 overflow-y-auto custom-scrollbar">
          {diagnosticLogs.length === 0 ? (
            <span className="text-slate-600 italic">No events recorded. Perform diagnostics or refresh voices...</span>
          ) : (
            diagnosticLogs.map((log, index) => (
              <div key={index} className="leading-relaxed border-b border-white/[0.02] last:border-0 pb-1">
                {log.includes("[SUCCESS]") || log.includes("successfully") ? (
                  <span className="text-emerald-400">{log}</span>
                ) : log.includes("Warning:") || log.includes("No German-compatible") ? (
                  <span className="text-amber-400">{log}</span>
                ) : log.includes("NOT supported") || log.includes("error") ? (
                  <span className="text-rose-400">{log}</span>
                ) : (
                  <span>{log}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
