export interface LocaleConfig {
  key: string;
  label: string;
  code: string;
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  { key: "English", label: "English", code: "en-US" },
  { key: "Sanskrit", label: "Sanskrit", code: "sa-IN" },
  { key: "Arabic", label: "العربية (Arabic)", code: "ar-SA" },
  { key: "Tamil", label: "தமிழ் (Tamil)", code: "ta-IN" },
  { key: "Telugu", label: "తెలుగు (Telugu)", code: "te-IN" },
  { key: "Marathi", label: "मराठी (Marathi)", code: "mr-IN" },
  { key: "Hindi", label: "हिन्दी (Hindi)", code: "hi-IN" },
  { key: "Spanish", label: "Español (Spanish)", code: "es-ES" },
  { key: "French", label: "Français (French)", code: "fr-FR" },
  { key: "German", label: "Deutsch (German)", code: "de-DE" },
  { key: "Punjabi", label: "ਪੰਜਾਬี (Punjabi)", code: "pa-IN" },
  { key: "Tibetan", label: "བོད་སྐད་ (Tibetan)", code: "bo-CN" },
  { key: "Hebrew", label: "עברית (Hebrew)", code: "he-IL" },
  { key: "Chinese", label: "中文 (Chinese)", code: "zh-CN" },
  { key: "Japanese", label: "日本語 (Japanese)", code: "ja-JP" },
  { key: "Russian", label: "Русский (Russian)", code: "ru-RU" },
  { key: "Portuguese", label: "Português (Portuguese)", code: "pt-BR" }
];

/**
 * Gets the standard BCP-47 language code for a language key, defaulting to en-US.
 */
export function getLanguageCode(languageKey: string): string {
  if (!languageKey) return "en-US";
  const normalized = languageKey.trim().toLowerCase();
  
  if (normalized === "german" || normalized === "de" || normalized === "de-de") {
    return "de-DE";
  }
  
  const found = SUPPORTED_LOCALES.find(l => l.key.toLowerCase() === normalized || l.code.toLowerCase() === normalized);
  return found ? found.code : "en-US";
}

/**
 * Gets the language name / key from a BCP-47 code or code prefix.
 */
export function getLanguageKeyFromCode(bcpCode: string): string {
  if (!bcpCode) return "English";
  const prefix = bcpCode.toLowerCase().split("-")[0];
  if (prefix === "de") return "German";
  
  const found = SUPPORTED_LOCALES.find(l => {
    const codeLower = l.code.toLowerCase();
    return codeLower === bcpCode.toLowerCase() || codeLower.startsWith(prefix);
  });
  return found ? found.key : "English";
}

/**
 * Prioritizes and selects the best SpeechSynthesisVoice for a given BCP-47 language code.
 * Implements a high-quality selection strategy, especially for German (de-DE) and others.
 */
export function selectBestVoice(bcpCode: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const codeLower = bcpCode.toLowerCase();
  const langPrefix = codeLower.split("-")[0];

  // Filter voices that match the language prefix or keyword
  const candidateVoices = voices.filter(v => {
    const vLang = v.lang.toLowerCase().replace("_", "-");
    const vName = v.name.toLowerCase();
    
    // Exact or prefix language match
    if (vLang === langPrefix || vLang.startsWith(langPrefix + "-")) {
      return true;
    }
    
    // Keyword fallback mapping (e.g. "german", "deutsch" for German)
    if (langPrefix === "de" && (vLang.includes("german") || vName.includes("german") || vName.includes("deutsch"))) {
      return true;
    }
    if (langPrefix === "en" && (vLang.includes("english") || vName.includes("english"))) {
      return true;
    }
    return false;
  });

  if (candidateVoices.length === 0) {
    return null;
  }

  // German specific voice prioritization to ensure high-quality voice selection
  if (langPrefix === "de") {
    return candidateVoices.sort((a, b) => {
      const aLang = a.lang.toLowerCase().replace("_", "-");
      const bLang = b.lang.toLowerCase().replace("_", "-");
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      // Check for Google / premium quality labels
      const aIsPremium = aName.includes("google") || aName.includes("natural") || aName.includes("premium") || aName.includes("yannick");
      const bIsPremium = bName.includes("google") || bName.includes("natural") || bName.includes("premium") || bName.includes("yannick");
      if (aIsPremium && !bIsPremium) return -1;
      if (!aIsPremium && bIsPremium) return 1;

      // Exact de-DE (Germany) priority
      const aIsDeDE = aLang === "de-de";
      const bIsDeDE = bLang === "de-de";
      if (aIsDeDE && !bIsDeDE) return -1;
      if (!aIsDeDE && bIsDeDE) return 1;

      // LocalService priority
      const aLocal = a.localService ? 1 : 0;
      const bLocal = b.localService ? 1 : 0;
      if (aLocal !== bLocal) {
        return bLocal - aLocal;
      }

      return 0;
    })[0];
  }

  // General prioritization for other languages
  return candidateVoices.sort((a, b) => {
    const aLang = a.lang.toLowerCase().replace("_", "-");
    const bLang = b.lang.toLowerCase().replace("_", "-");
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // Premium/Google check
    const aIsPremium = aName.includes("google") || aName.includes("natural") || aName.includes("premium");
    const bIsPremium = bName.includes("google") || bName.includes("natural") || bName.includes("premium");
    if (aIsPremium && !bIsPremium) return -1;
    if (!aIsPremium && bIsPremium) return 1;

    // Exact code match (e.g. de-DE, es-ES, hi-IN)
    const aExact = aLang === codeLower;
    const bExact = bLang === codeLower;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    // LocalService check
    const aLocal = a.localService ? 1 : 0;
    const bLocal = b.localService ? 1 : 0;
    return bLocal - aLocal;
  })[0];
}
