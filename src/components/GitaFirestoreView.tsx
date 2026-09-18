/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db, safeGetDocs, safeGetDoc, checkIsQuotaExhausted } from "../firebase";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, ChevronLeft, Loader2, Sparkles, AlertCircle, Book, Calendar, Languages } from "lucide-react";
import { YajurvedaDropdownSelector } from "./YajurvedaDropdownSelector";
import { UPANISHADS_108 } from "../data/upanishads";

interface ChapterData {
  id: string;
  chapter_number: number;
  chapter_title: string;
  docRef: any; // Firestore DocumentReference
}

interface SargaData {
  id: string;
  sarga_number: number;
  sarga_title?: string;
  display_number: string;
  reference: string;
  docRef: any; // Firestore DocumentReference
}

interface VerseData {
  id: string;
  verse_number: number;
  reference: string;
  text: string;
  itx?: string;
}

function formatChapterTitle(rawTitle: string): string {
  if (!rawTitle) return "";
  const openParenIndex = rawTitle.indexOf("(");
  const closeParenIndex = rawTitle.indexOf(")");
  if (openParenIndex !== -1 && closeParenIndex !== -1 && closeParenIndex > openParenIndex) {
    const devanagari = rawTitle.substring(0, openParenIndex).trim();
    const english = rawTitle.substring(openParenIndex + 1, closeParenIndex).trim();
    if (english && devanagari) {
      return `${english} (${devanagari})`;
    }
  }
  return rawTitle;
}

function extractVerseText(d: any): string {
  if (!d) return "";
  const val = d.text ?? d.text_content ?? d.cleanText ?? d.text_clean ?? d.text_with_svara ?? d.text_svara ?? 
    d.originalText ?? d.original_text ?? d.sanskrit ?? d.sanskrit_text ?? d.sanskritText ?? d.sloka ?? d.shloka ?? 
    d.sloka_text ?? d.shloka_text ?? d.slokaText ?? d.shlokaText ?? d.devanagari ?? d.devanagari_text ?? d.devanagariText ?? 
    d.mantra ?? d.mantra_text ?? d.mantraText ?? d.samhita ?? d.samhita_text ?? d.richa ?? d.rc ?? d.rik ?? 
    d.padapatha ?? d.pada ?? d.sukta_text ?? d.verse_text ?? d.verseText ?? d.verse_sanskrit ?? d.verse_devanagari ?? 
    d.verse ?? d.content ?? d.verse_content ?? d.body ?? d.lines ?? d.translation ?? d.english ?? d.hindi ?? 
    d.meaning ?? d.description ?? d.original ?? d.raw ?? d.verse_english ?? d.verse_translation ?? d.anvaya ?? d.commentary ?? "";
  
  if (typeof val === "string") return val.trim();
  if (Array.isArray(val)) {
    return val.map((item: any) => typeof item === "string" ? item : (item?.text || item?.devanagari || item?.sanskrit || item?.originalText || item?.sloka || item?.shloka || item?.translation || JSON.stringify(item))).join("\n");
  }
  if (typeof val === "object") {
    return val.text || val.devanagari || val.sanskrit || val.originalText || val.cleanText || val.sloka || val.shloka || val.mantra || val.translation || val.content || JSON.stringify(val);
  }
  return String(val);
}

function extractTransliteration(d: any): string {
  if (!d) return "";
  const val = d.itx ?? d.transliteration ?? d.translit ?? d.phonetic ?? d.roman ?? d.iast ?? d.iast_text ?? d.english_transliteration ?? "";
  if (typeof val === "string") return val.trim();
  if (Array.isArray(val)) return val.join("\n");
  return String(val);
}

export type ScriptureBookSelection = "bhagavad_gita" | "rigveda" | "ramayana" | "mahabharata" | "yajurveda" | "samaveda" | "atharvaveda" | "mahapuranas" | "upapuranas" | "upanishads";

interface GitaFirestoreViewProps {
  selectedBook?: ScriptureBookSelection;
  onSelectBook?: (book: ScriptureBookSelection) => void;
  onReadInDesk?: (bookKey: string, divisionNumber: number) => void;
}

export function GitaFirestoreView({ selectedBook: externalSelectedBook, onSelectBook: externalOnSelectBook, onReadInDesk }: GitaFirestoreViewProps = {}) {
  const [internalSelectedBook, setInternalSelectedBook] = useState<ScriptureBookSelection>("bhagavad_gita");

  const selectedBook = externalSelectedBook !== undefined ? externalSelectedBook : internalSelectedBook;
  const setSelectedBook = (book: ScriptureBookSelection) => {
    if (externalOnSelectBook) {
      externalOnSelectBook(book);
    } else {
      setInternalSelectedBook(book);
    }
  };

const [dataVersion, setDataVersion] = useState<number>(0);

useEffect(() => {
  const ref = doc(db, "system_settings", "data_version");
  const unsubscribe = onSnapshot(ref, () => {
    setDataVersion(v => v + 1); // bump a counter whenever the marker changes
  });
  return () => unsubscribe();
}, []);

  const [yajurvedaBranch, setYajurvedaBranch] = useState<"shukla" | "krishna">("shukla");
  const [branchLabels, setBranchLabels] = useState<{ shukla: string; krishna: string }>({
    shukla: "Shukla (White)",
    krishna: "Krishna (Black)"
  });

  useEffect(() => {
    if (selectedBook === "yajurveda") {
      const fetchBranchLabels = async () => {
        try {
          const shuklaRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "shukla");
          const shuklaSnap = await safeGetDoc(shuklaRef);
          let sLabel = "Shukla (White)";
          if (shuklaSnap.exists() && shuklaSnap.data()?.branch_name) {
            sLabel = String(shuklaSnap.data().branch_name);
          }

          const krishnaRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna");
          const krishnaSnap = await safeGetDoc(krishnaRef);
          let kLabel = "Krishna (Black)";
          if (krishnaSnap.exists() && krishnaSnap.data()?.branch_name) {
            kLabel = String(krishnaSnap.data().branch_name);
          }

          setBranchLabels({ shukla: sLabel, krishna: kLabel });
        } catch (err) {
          console.warn("[Gita Firestore] Error reading branch names:", err);
        }
      };
      fetchBranchLabels();
    }
  }, [selectedBook]);

  const getDivisionName = (book: ScriptureBookSelection, capitalized = false) => {
    if (book === "bhagavad_gita") return capitalized ? "Chapter" : "chapter";
    if (book === "rigveda") return capitalized ? "Mandala" : "mandala";
    if (book === "mahabharata") return capitalized ? "Parva" : "parva";
    if (book === "samaveda" || book === "atharvaveda") return capitalized ? "Chapter" : "chapter";
    if (book === "yajurveda") {
      return yajurvedaBranch === "shukla" ? (capitalized ? "Chapter" : "chapter") : (capitalized ? "Kanda" : "kanda");
    }
    if (book === "mahapuranas" || book === "upapuranas") return capitalized ? "Purana" : "purana";
    if (book === "upanishads") return capitalized ? "Upanishad" : "upanishad";
    return capitalized ? "Kanda" : "kanda";
  };

  const getDivisionNamePlural = (book: ScriptureBookSelection) => {
    if (book === "bhagavad_gita") return "Chapters";
    if (book === "rigveda") return "Mandalas";
    if (book === "mahabharata") return "Parvas";
    if (book === "samaveda" || book === "atharvaveda") return "Chapters";
    if (book === "yajurveda") {
      return yajurvedaBranch === "shukla" ? "Chapters" : "Kandas";
    }
    if (book === "mahapuranas") return "Mahapuranas";
    if (book === "upapuranas") return "Upapuranas";
    if (book === "upanishads") return "Upanishads";
    return "Kandas";
  };

  const getSubdivisionName = (book: ScriptureBookSelection, capitalized = false) => {
    if (book === "mahabharata") return capitalized ? "Adhyaya" : "adhyaya";
    if (book === "yajurveda") {
      return yajurvedaBranch === "krishna" ? (capitalized ? "Prashna" : "prashna") : (capitalized ? "Anuvaka" : "anuvaka");
    }
    if (book === "rigveda") return capitalized ? "Sukta" : "sukta";
    if (book === "samaveda") return capitalized ? "Sukta / Pada" : "sukta / pada";
    if (book === "atharvaveda") return capitalized ? "Sukta / Hymn" : "sukta / hymn";
    if (book === "bhagavad_gita") return capitalized ? "Section" : "section";
    if (book === "upanishads") return capitalized ? "Chapter" : "chapter";
    if (book === "mahapuranas" || book === "upapuranas") {
      const titleLower = (selectedDivision?.chapter_title || selectedDivision?.id || "").toLowerCase();
      if (titleLower.includes("shiva") || titleLower.includes("शिव")) {
        return capitalized ? "Samhita" : "samhita";
      }
      if (titleLower.includes("bhagavata") || titleLower.includes("भागवत")) {
        return capitalized ? "Skandha" : "skandha";
      }
      return capitalized ? "Sub-division" : "sub-division";
    }
    return capitalized ? "Sarga" : "sarga";
  };

  const getSubdivisionNamePlural = (book: ScriptureBookSelection) => {
    if (book === "mahabharata") return "Adhyayas";
    if (book === "yajurveda") {
      return yajurvedaBranch === "krishna" ? "Prashnas" : "Anuvakas";
    }
    if (book === "rigveda") return "Suktas";
    if (book === "samaveda") return "Suktas / Padas";
    if (book === "atharvaveda") return "Suktas / Hymns";
    if (book === "bhagavad_gita") return "Sections";
    if (book === "upanishads") return "Chapters";
    if (book === "mahapuranas" || book === "upapuranas") {
      const titleLower = (selectedDivision?.chapter_title || selectedDivision?.id || "").toLowerCase();
      if (titleLower.includes("shiva") || titleLower.includes("शिव")) {
        return "Samhitas";
      }
      if (titleLower.includes("bhagavata") || titleLower.includes("भागवत")) {
        return "Skandhas";
      }
      return "Sub-divisions";
    }
    return "Sargas";
  };

  const [divisions, setDivisions] = useState<ChapterData[]>([]); // Generalized for Chapters/Mandalas/Kandas
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<ChapterData | null>(null);
  const [sargas, setSargas] = useState<SargaData[]>([]);
  const [loadingSargas, setLoadingSargas] = useState<boolean>(false);
  const [sargasError, setSargasError] = useState<string | null>(null);
  const [selectedSarga, setSelectedSarga] = useState<SargaData | null>(null);
  const [pendingSubLevel, setPendingSubLevel] = useState<number | null>(null);
  const [verses, setVerses] = useState<VerseData[]>([]);
  const [loadingVerses, setLoadingVerses] = useState<boolean>(false);
  const [versesError, setVersesError] = useState<string | null>(null);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(false);

  // Load divisions (chapters or mandalas) when selectedBook changes
  useEffect(() => {
    const fetchDivisions = async () => {
      setLoading(true);
      setError(null);
      setSelectedDivision(null);
      setSargas([]);
      setSelectedSarga(null);
      setVerses([]);
      let divisionsFound: ChapterData[] = [];

      try {
        if (selectedBook === "bhagavad_gita") {
          // --- EXISTING BHAGAVAD GITA MAPPING ---
          try {
            let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Bhagavad Gita");
            let snap;
            try {
              const q = query(directColRef, orderBy("chapter_number", "asc"));
              snap = await safeGetDocs(q);
            } catch (queryErr) {
              console.warn("[Gita Firestore] Failed reading chapter list with orderBy, trying unordered fallback:", queryErr);
              snap = await safeGetDocs(directColRef);
            }
            
            if (snap.empty) {
              console.log("[Gita Firestore] Subcollection 'Bhagavad Gita' empty, trying fallback 'Bhagavad Gita (श्रीमद्भगवद्गीता)'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Bhagavad Gita (श्रीमद्भगवद्गीता)");
              try {
                const q = query(directColRef, orderBy("chapter_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr) {
                console.warn("[Gita Firestore] Failed fallback with orderBy, trying unordered:", queryErr);
                snap = await safeGetDocs(directColRef);
              }
            }

            if (!snap.empty) {
              divisionsFound = snap.docs.map(docSnap => {
                const d = docSnap.data();
                return {
                  id: docSnap.id,
                  chapter_number: Number(d.chapter_number ?? d.chapterNumber ?? d.chapter ?? d.number ?? 0),
                  chapter_title: formatChapterTitle(String(d.chapter_title ?? d.chapterTitle ?? d.title ?? docSnap.id)),
                  docRef: docSnap.ref
                };
              }).filter(ch => ch.chapter_number > 0);
            }
          } catch (err) {
            console.warn("[Gita Firestore] Failed reading main path:", err);
          }

          // Fallback strategy 2
          if (divisionsFound.length === 0) {
            const bookDocId = "Bhagavad Gita";
            const candidateBookIds = [bookDocId, "Bhagavad Gita (श्रीमद्भगवद्गीता)", "bhagavad_gita"];
            const subcolNames = ["chapters", "Chapters", "divisions", "Divisions", "verses"];

            for (const bookId of candidateBookIds) {
              for (const subcol of subcolNames) {
                try {
                  const colRef = collection(db, "Holy Scripture Books", bookId, subcol);
                  const snap = await safeGetDocs(colRef);
                  if (!snap.empty) {
                    const tempChapters = snap.docs.map(docSnap => {
                      const d = docSnap.data();
                      return {
                        id: docSnap.id,
                        chapter_number: Number(d.chapter_number ?? d.chapterNumber ?? d.chapter ?? d.number ?? 0),
                        chapter_title: formatChapterTitle(String(d.chapter_title ?? d.chapterTitle ?? d.title ?? docSnap.id)),
                        docRef: docSnap.ref
                      };
                    }).filter(ch => ch.chapter_number > 0);

                    if (tempChapters.length > 0) {
                      divisionsFound = tempChapters;
                      break;
                    }
                  }
                } catch (err) {
                  // try next
                }
              }
              if (divisionsFound.length > 0) break;
            }
          }

          // Fallback strategy 3
          if (divisionsFound.length === 0) {
            const rootColRef = collection(db, "Holy Scripture Books");
            const snap = await safeGetDocs(rootColRef);
            if (!snap.empty) {
              const tempChapters = snap.docs.map(docSnap => {
                const d = docSnap.data();
                return {
                  id: docSnap.id,
                  chapter_number: Number(d.chapter_number ?? d.chapterNumber ?? d.chapter ?? d.number ?? 0),
                  chapter_title: formatChapterTitle(String(d.chapter_title ?? d.chapterTitle ?? d.title ?? docSnap.id)),
                  docRef: docSnap.ref
                };
              }).filter(ch => ch.chapter_number > 0);

              if (tempChapters.length > 0) {
                divisionsFound = tempChapters;
              }
            }
          }

          // Fallback strategy 4
          if (divisionsFound.length === 0) {
            const fallbackColRef = collection(db, "scriptures", "bhagavad_gita", "chapters");
            const snap = await safeGetDocs(fallbackColRef);
            if (!snap.empty) {
              divisionsFound = snap.docs.map(docSnap => {
                const d = docSnap.data();
                return {
                  id: docSnap.id,
                  chapter_number: Number(d.chapter_number ?? d.chapterNumber ?? d.chapter ?? d.number ?? 0),
                  chapter_title: formatChapterTitle(String(d.chapter_title ?? d.chapterTitle ?? d.title ?? docSnap.id)),
                  docRef: docSnap.ref
                };
              }).filter(ch => ch.chapter_number > 0);
            }
          }

          if (divisionsFound.length === 0) {
            setError("No Bhagavad Gita chapters were found in your Firestore database yet. Please ensure your collection is structured as 'Holy Scripture Books' -> document 'Hinduism' -> subcollection 'Bhagavad Gita'.");
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        } else if (selectedBook === "rigveda") {
          // --- NEW RIGVEDA MAPPING ---
          try {
            let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Rigveda (ऋग्वेद)");
            let snap;
            try {
              // ordered ascending by mandal_number
              const q = query(directColRef, orderBy("mandal_number", "asc"));
              snap = await safeGetDocs(q);
            } catch (queryErr) {
              console.warn("[Gita Firestore] Failed reading Rigveda mandals with orderBy, trying unordered:", queryErr);
              snap = await safeGetDocs(directColRef);
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Rigveda (ऋग्वेद)' empty, trying fallback 'Rigveda'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Rigveda");
              try {
                const q = query(directColRef, orderBy("mandal_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr) {
                snap = await safeGetDocs(directColRef);
              }
            }

            if (!snap.empty) {
              divisionsFound = snap.docs.map(docSnap => {
                const d = docSnap.data();
                return {
                  id: docSnap.id,
                  chapter_number: Number(d.mandal_number ?? d.mandalNumber ?? d.mandal ?? 0),
                  chapter_title: String(d.mandal_title ?? d.title ?? `Mandala ${d.mandal_number ?? docSnap.id}`),
                  docRef: docSnap.ref
                };
              }).filter(m => m.chapter_number > 0);
            }
          } catch (err) {
            console.warn("[Gita Firestore] Failed reading Rigveda path:", err);
          }

          if (divisionsFound.length === 0) {
            setError("No Rigveda mandals were found in your Firestore database yet. Please ensure your collection is structured as 'Holy Scripture Books' -> document 'Hinduism' -> subcollection 'Rigveda (ऋग्वेद)'.");
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        } else if (selectedBook === "mahabharata") {
          // --- NEW MAHABHARATA MAPPING ---
          try {
            let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Mahabharata (महाभारतम्)");
            let snap;
            try {
              const q = query(directColRef, orderBy("parva_number", "asc"));
              snap = await safeGetDocs(q);
            } catch (queryErr) {
              try {
                const q = query(directColRef, orderBy("chapter_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr2) {
                console.warn("[Gita Firestore] Failed reading Mahabharata parvas with orderBy, trying unordered:", queryErr2);
                snap = await safeGetDocs(directColRef);
              }
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Mahabharata (महाभारतम्)' empty, trying fallback 'Mahabharata'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Mahabharata");
              try {
                const q = query(directColRef, orderBy("parva_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr) {
                snap = await safeGetDocs(directColRef);
              }
            }

            if (!snap.empty) {
              divisionsFound = snap.docs.map(docSnap => {
                const d = docSnap.data();
                return {
                  id: docSnap.id,
                  chapter_number: Number(d.parva_number ?? d.parvaNumber ?? d.parva ?? d.chapter_number ?? d.number ?? docSnap.id.replace(/[^0-9]/g, "") ?? 0),
                  chapter_title: String(d.parva_name ?? d.parva_title ?? d.title ?? d.chapter_title ?? `Parva ${docSnap.id}`),
                  docRef: docSnap.ref
                };
              }).filter(p => p.chapter_number > 0);
            }
          } catch (err) {
            console.warn("[Gita Firestore] Failed reading Mahabharata path:", err);
          }

          if (divisionsFound.length === 0) {
            setError("No Mahabharata parvas were found in your Firestore database yet. Please ensure your collection is structured as 'Holy Scripture Books' -> document 'Hinduism' -> subcollection 'Mahabharata (महाभारतम्)' or 'Mahabharata'.");
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        } else if (selectedBook === "yajurveda") {
          // --- YAJURVEDA BRANCH MAPPING ---
          try {
            if (yajurvedaBranch === "shukla") {
              const shuklaDocRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "shukla");
              const chaptersColRef = collection(shuklaDocRef, "chapters");
              let chapSnap;
              try {
                chapSnap = await safeGetDocs(query(chaptersColRef, orderBy("chapter_number", "asc")));
              } catch (e) {
                chapSnap = await safeGetDocs(chaptersColRef);
              }

              if (!chapSnap.empty) {
                divisionsFound = chapSnap.docs.map(docSnap => {
                  const d = docSnap.data();
                  const cNum = Number(d.chapter_number ?? d.chapterNumber ?? d.chapter ?? d.number ?? docSnap.id.replace(/[^0-9]/g, "") ?? 0);
                  const cTitle = formatChapterTitle(String(d.chapter_title ?? d.title ?? d.name ?? `Chapter ${cNum}`));
                  return {
                    id: docSnap.id,
                    chapter_number: cNum,
                    chapter_title: cTitle,
                    docRef: docSnap.ref
                  };
                }).filter(d => d.chapter_number > 0);
              }
            } else {
              const krishnaCandidates = [
                doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna"),
                doc(db, "books", "Yajurveda_Krishna")
              ];

              for (const krishnaDocRef of krishnaCandidates) {
                const kandasColRef = collection(krishnaDocRef, "kandas");
                let kandaSnap;
                try {
                  kandaSnap = await safeGetDocs(query(kandasColRef, orderBy("kanda_number", "asc")));
                } catch (e) {
                  try {
                    kandaSnap = await safeGetDocs(kandasColRef);
                  } catch (e2) {}
                }

                if (kandaSnap && !kandaSnap.empty) {
                  divisionsFound = kandaSnap.docs.map(docSnap => {
                    const d = docSnap.data();
                    const kNum = Number(d.kanda_number ?? d.kandaNumber ?? d.kanda ?? d.number ?? docSnap.id.replace(/[^0-9]/g, "") ?? 0);
                    const kTitle = String(d.kanda_title ?? d.title ?? d.name ?? `Kanda ${kNum}`);
                    return {
                      id: docSnap.id,
                      chapter_number: kNum,
                      chapter_title: kTitle,
                      docRef: docSnap.ref
                    };
                  }).filter(d => d.chapter_number > 0);
                  if (divisionsFound.length > 0) break;
                }
              }
            }
          } catch (err) {
            console.warn("[Gita Firestore] Failed reading Yajurveda branch path:", err);
          }

          if (divisionsFound.length === 0) {
            setError(`No ${yajurvedaBranch === "shukla" ? "chapters" : "kandas"} were found under ${yajurvedaBranch === "shukla" ? branchLabels.shukla : branchLabels.krishna} branch in Firestore.`);
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        } else if (selectedBook === "ramayana") {
          // --- NEW RAMAYANA MAPPING ---
          try {
            let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Ramayana (रामायणम्)");
            let snap;
            try {
              // ordered ascending by kanda_number
              const q = query(directColRef, orderBy("kanda_number", "asc"));
              snap = await safeGetDocs(q);
            } catch (queryErr) {
              console.warn("[Gita Firestore] Failed reading Ramayana (रामायणम्) kandas with orderBy kanda_number, trying unordered:", queryErr);
              snap = await safeGetDocs(directColRef);
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Ramayana (रामायणम्)' empty, trying fallback 'Ramayana (रामायण)'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Ramayana (रामायण)");
              try {
                const q = query(directColRef, orderBy("kanda_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr) {
                snap = await safeGetDocs(directColRef);
              }
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Ramayana (रामायण)' empty, trying fallback 'Ramayana'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Ramayana");
              try {
                const q = query(directColRef, orderBy("kanda_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr) {
                snap = await safeGetDocs(directColRef);
              }
            }

            if (!snap.empty) {
              divisionsFound = snap.docs.map(docSnap => {
                const d = docSnap.data();
                return {
                  id: docSnap.id,
                  chapter_number: Number(d.kanda_number ?? d.mandal_number ?? d.chapter_number ?? d.number ?? 0),
                  chapter_title: String(d.kanda_name ?? d.kanda_title ?? d.title ?? d.mandal_title ?? d.chapter_title ?? `Kanda ${docSnap.id}`),
                  docRef: docSnap.ref
                };
              }).filter(k => k.chapter_number > 0);
            }
          } catch (err) {
            console.warn("[Gita Firestore] Failed reading Ramayana path:", err);
          }

          if (divisionsFound.length === 0) {
            setError("No Ramayana kandas were found in your Firestore database yet. Please ensure your collection is structured as 'Holy Scripture Books' -> document 'Hinduism' -> subcollection 'Ramayana (रामायणम्)' or 'Ramayana (रामायण)'.");
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        } else if (selectedBook === "samaveda") {
          // --- SAMAVEDA MAPPING ---
          try {
            let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Samaveda (सामवेद)");
            let snap;
            try {
              const q = query(directColRef, orderBy("chapter_number", "asc"));
              snap = await safeGetDocs(q);
            } catch (queryErr) {
              try {
                const q = query(directColRef, orderBy("part_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr2) {
                snap = await safeGetDocs(directColRef);
              }
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Samaveda (सामवेद)' empty, trying fallback 'Samaveda'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Samaveda");
              try {
                const q = query(directColRef, orderBy("chapter_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr) {
                snap = await safeGetDocs(directColRef);
              }
            }

            if (!snap.empty) {
              divisionsFound = snap.docs.map(docSnap => {
                const d = docSnap.data();
                const num = Number(d.chapter_number ?? d.chapterNumber ?? d.chapter ?? d.part_number ?? d.partNumber ?? d.part ?? d.number ?? (docSnap.id.replace(/[^0-9]/g, "") || "0"));
                const title = String(d.chapter_title ?? d.title ?? d.part_title ?? `Chapter ${num || docSnap.id}`);
                return {
                  id: docSnap.id,
                  chapter_number: num,
                  chapter_title: title,
                  docRef: docSnap.ref
                };
              }).filter(m => m.chapter_number > 0);
            }
          } catch (err) {
            console.warn("[Gita Firestore] Failed reading Samaveda path:", err);
          }

          if (divisionsFound.length === 0) {
            setError("No Samaveda chapters were found in your Firestore database yet. Please ensure your collection is structured as 'Holy Scripture Books' -> document 'Hinduism' -> subcollection 'Samaveda (सामवेद)' or 'Samaveda'.");
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        } else if (selectedBook === "atharvaveda") {
          // --- ATHARVAVEDA MAPPING ---
          try {
            let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Atharvaveda (अथर्ववेद)");
            let snap;
            try {
              const q = query(directColRef, orderBy("chapter_number", "asc"));
              snap = await safeGetDocs(q);
            } catch (queryErr) {
              try {
                const q = query(directColRef, orderBy("kanda_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr2) {
                snap = await safeGetDocs(directColRef);
              }
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Atharvaveda (अथर्ववेद)' empty, trying fallback 'Atharvaveda'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Atharvaveda");
              try {
                const q = query(directColRef, orderBy("chapter_number", "asc"));
                snap = await safeGetDocs(q);
              } catch (queryErr) {
                snap = await safeGetDocs(directColRef);
              }
            }

            if (!snap.empty) {
              divisionsFound = snap.docs.map(docSnap => {
                const d = docSnap.data();
                const num = Number(d.chapter_number ?? d.chapterNumber ?? d.chapter ?? d.kanda_number ?? d.kandaNumber ?? d.kanda ?? d.number ?? (docSnap.id.replace(/[^0-9]/g, "") || "0"));
                const title = String(d.chapter_title ?? d.title ?? d.kanda_title ?? `Chapter ${num || docSnap.id}`);
                return {
                  id: docSnap.id,
                  chapter_number: num,
                  chapter_title: title,
                  docRef: docSnap.ref
                };
              }).filter(m => m.chapter_number > 0);
            }
          } catch (err) {
            console.warn("[Gita Firestore] Failed reading Atharvaveda path:", err);
          }

          if (divisionsFound.length === 0) {
            setError("No Atharvaveda chapters were found in your Firestore database yet. Please ensure your collection is structured as 'Holy Scripture Books' -> document 'Hinduism' -> subcollection 'Atharvaveda (अथर्ववेद)' or 'Atharvaveda'.");
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        } else if (selectedBook === "mahapuranas") {
          // --- NEW MAHAPURANAS MAPPING ---
          try {
            const candidatePaths = [
              collection(db, "Holy Scripture Books", "Hinduism", "Mahapuranas (महापुराणाणि)"),
              collection(db, "Holy Scripture Books", "Hinduism", "Mahapuranas"),
              collection(db, "Holy Scripture Books", "Hinduism", "Puranas (पुराणानी)"),
              collection(db, "Holy Scripture Books", "Hinduism", "Puranas"),
              collection(db, "Holy Scripture Books", "hinduism", "Mahapuranas (महापुराणाणि)"),
              collection(db, "Holy Scripture Books", "hinduism", "Mahapuranas"),
              collection(db, "Mahapuranas (महापुराणाणि)"),
              collection(db, "Mahapuranas")
            ];

            let snap = null;
            for (const colRef of candidatePaths) {
              try {
                const testSnap = await safeGetDocs(colRef);
                if (testSnap && !testSnap.empty) {
                  snap = testSnap;
                  console.log(`[Gita Firestore] Successfully loaded Mahapuranas from path: ${colRef.path}, found ${testSnap.size} documents.`);
                  break;
                }
              } catch (e) {
                console.warn(`[Gita Firestore] Error reading candidate path ${colRef.path}:`, e);
              }
            }

            if (snap && !snap.empty) {
              divisionsFound = snap.docs.map((docSnap, idx) => {
                const d = docSnap.data();
                const pNum = Number(d.purana_number ?? d.puranaNumber ?? d.number ?? d.chapter_number ?? d.chapterNumber ?? (idx + 1));
                const pTitle = formatChapterTitle(String(d.book_title ?? d.purana_title ?? d.purana_name ?? d.title ?? d.name ?? docSnap.id));
                return {
                  id: docSnap.id,
                  chapter_number: pNum,
                  chapter_title: pTitle,
                  docRef: docSnap.ref
                };
              });
            }
          } catch (err) {
            console.warn("[Gita Firestore] Failed reading Mahapuranas path:", err);
          }

          if (divisionsFound.length === 0) {
            setError("No Mahapuranas were found in your Firestore database yet. Please ensure your collection is structured as 'Holy Scripture Books' -> document 'Hinduism' -> subcollection 'Mahapuranas (महापुराणाणि)'.");
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        } else if (selectedBook === "upapuranas") {
          // --- UPAPURANAS MAPPING ---
          try {
            const candidatePaths = [
              collection(db, "Holy Scripture Books", "Hinduism", "Upapuranas (उपपुराण)"),
              collection(db, "Holy Scripture Books", "Hinduism", "Upapuranas (उपपुराणानि)"),
              collection(db, "Holy Scripture Books", "Hinduism", "Upapuranas"),
              collection(db, "Holy Scripture Books", "hinduism", "Upapuranas (उपपुराण)"),
              collection(db, "Holy Scripture Books", "hinduism", "Upapuranas"),
              collection(db, "Upapuranas (उपपुराण)"),
              collection(db, "Upapuranas")
            ];

            let snap = null;
            for (const colRef of candidatePaths) {
              try {
                const testSnap = await safeGetDocs(colRef);
                if (testSnap && !testSnap.empty) {
                  snap = testSnap;
                  console.log(`[Gita Firestore] Successfully loaded Upapuranas from path: ${colRef.path}, found ${testSnap.size} documents.`);
                  break;
                }
              } catch (e) {
                console.warn(`[Gita Firestore] Error reading candidate path ${colRef.path}:`, e);
              }
            }

            if (snap && !snap.empty) {
              divisionsFound = snap.docs.map((docSnap, idx) => {
                const d = docSnap.data();
                const pNum = Number(d.purana_number ?? d.puranaNumber ?? d.number ?? d.chapter_number ?? d.chapterNumber ?? (idx + 1));
                const pTitle = formatChapterTitle(String(d.book_title ?? d.purana_title ?? d.purana_name ?? d.title ?? d.name ?? docSnap.id));
                return {
                  id: docSnap.id,
                  chapter_number: pNum,
                  chapter_title: pTitle,
                  docRef: docSnap.ref
                };
              });
            }
          } catch (err) {
            console.warn("[Gita Firestore] Failed reading Upapuranas path:", err);
          }

          if (divisionsFound.length === 0) {
            setError("No Upapuranas were found in your Firestore database yet. Please ensure your collection is structured as 'Holy Scripture Books' -> document 'Hinduism' -> subcollection 'Upapuranas (उपपुराण)'.");
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        } else if (selectedBook === "upanishads") {
          const candidatePaths = [
            collection(db, "Holy Scripture Books", "Hinduism", " Principal Upanishads (उपनिषद्)"),
            collection(db, "Holy Scripture Books", "Hinduism", "Principal Upanishads (उपनिषद्)"),
            collection(db, "Holy Scripture Books", "Hinduism", " Principal Upanishads"),
            collection(db, "Holy Scripture Books", "Hinduism", "Principal Upanishads"),
            collection(db, "Holy Scripture Books", "Hinduism", " Upanishads (उपनिषद्)"),
            collection(db, "Holy Scripture Books", "Hinduism", "Upanishads (उपनिषद्)"),
            collection(db, "Holy Scripture Books", "Hinduism", "Upanishads"),
            collection(db, "Holy Scripture Books", "hinduism", " Principal Upanishads (उपनिषद्)"),
            collection(db, "Holy Scripture Books", "hinduism", "Principal Upanishads (उपनिषद्)"),
            collection(db, "Holy Scripture Books", "hinduism", "Principal Upanishads"),
            collection(db, " Principal Upanishads (उपनिषद्)"),
            collection(db, "Principal Upanishads (उपनिषद्)"),
            collection(db, "Principal Upanishads")
          ];

          let snap = null;
          for (const pCol of candidatePaths) {
            try {
              let testSnap: any = null;
              for (const ordField of ["upanishad_number", "number", "chapter_number"]) {
                try {
                  const q = query(pCol, orderBy(ordField, "asc"));
                  testSnap = await safeGetDocs(q);
                  if (testSnap && !testSnap.empty) break;
                } catch (e) {}
              }
              if (!testSnap || testSnap.empty) {
                testSnap = await safeGetDocs(pCol);
              }
              if (testSnap && !testSnap.empty) {
                snap = testSnap;
                break;
              }
            } catch (e) {}
          }

          if (snap && !snap.empty) {
            divisionsFound = snap.docs.map((docSnap: any, idx: number) => {
              const d = docSnap.data();
              const uTitle = formatChapterTitle(String(d.book_title ?? d.upanishad_title ?? d.upanishad_name ?? d.title ?? d.name ?? docSnap.id));

              let uNum = Number(d.upanishad_number ?? d.upanishadNumber ?? d.number ?? d.chapter_number ?? d.chapterNumber);
              if (!uNum || isNaN(uNum)) {
                const norm = docSnap.id.toLowerCase().replace(/upanishad|upnishad/g, "").replace(/[^a-z]/g, "").trim();
                const matched = UPANISHADS_108.find(u => {
                  const uClean = u.name.toLowerCase().replace(/[^a-z]/g, "");
                  return uClean === norm || norm.startsWith(uClean) || uClean.startsWith(norm);
                });
                if (matched) {
                  uNum = matched.number;
                } else {
                  const parsedId = Number(docSnap.id.replace(/[^0-9]/g, ""));
                  uNum = (!isNaN(parsedId) && parsedId > 0) ? parsedId : (idx + 1);
                }
              }

              return {
                id: docSnap.id,
                chapter_number: uNum,
                chapter_title: uTitle,
                docRef: docSnap.ref
              };
            });
          }

          if (divisionsFound.length === 0) {
            setError("No Upanishads were found in your Firestore database yet. Please ensure your collection is structured as 'Holy Scripture Books' -> document 'Hinduism' -> subcollection 'Principal Upanishads (उपनिषद्)'.");
          } else {
            divisionsFound.sort((a, b) => a.chapter_number - b.chapter_number);
            setDivisions(divisionsFound);
          }
        }
      } catch (err: any) {
        console.error("[Gita Firestore] Error loading divisions:", err);
        setError(err.message || "Failed to load scripture from Firestore.");
      } finally {
        setLoading(false);
      }
    };

    fetchDivisions();
  }, [selectedBook, yajurvedaBranch, dataVersion]);

  // Load sargas, adhyayas, suktas, or prashnas when a Division is selected
  useEffect(() => {
    if (!selectedDivision) {
      setSargas([]);
      setSelectedSarga(null);
      return;
    }

    const fetchSargas = async () => {
      setLoadingSargas(true);
      setSargasError(null);
      setSelectedSarga(null);
      try {
        let subcolNames: string[] = [];
        if ((selectedBook as string) === "mahabharata") {
          subcolNames = ["adhyayas", "Adhyayas", "chapters", "Chapters", "parvas", "Parvas", "sargas", "Sargas"];
        } else if ((selectedBook as string) === "ramayana") {
          subcolNames = ["sargas", "Sargas", "chapters", "Chapters", "adhyayas", "Adhyayas", "kandas", "Kandas"];
        } else if ((selectedBook as string) === "rigveda") {
          subcolNames = ["suktas", "Suktas", "hymns", "Hymns", "anuvakas", "Anuvakas", "adhyayas", "Adhyayas", "vargas", "Vargas", "chapters", "Chapters"];
        } else if ((selectedBook as string) === "samaveda") {
          subcolNames = ["chapters", "Chapters", "suktas", "Suktas", "padas", "Padas", "anuvakas", "Anuvakas", "archikas", "parts"];
        } else if ((selectedBook as string) === "atharvaveda") {
          subcolNames = ["suktas", "Suktas", "hymns", "Hymns", "anuvakas", "Anuvakas", "prapāṭhakas", "chapters", "Chapters", "kandas"];
        } else if ((selectedBook as string) === "yajurveda") {
          subcolNames = yajurvedaBranch === "krishna"
            ? ["prashanas", "Prashanas", "prashnas", "Prashnas", "anuvakas", "Anuvakas", "adhyayas", "Adhyayas", "chapters", "Chapters"]
            : ["anuvakas", "Anuvakas", "adhyayas", "Adhyayas", "chapters", "Chapters", "sections", "Sections"];
        } else if ((selectedBook as string) === "mahapuranas" || (selectedBook as string) === "upapuranas") {
          subcolNames = [
            "skandhas", "Skandhas",
            "samhitas", "Samhitas",
            "chapters", "Chapters",
            "cantos", "Cantos",
            "skandas", "Skandas",
            "khandas", "Khandas",
            "sections", "Sections"
          ];
        } else if ((selectedBook as string) === "upanishads") {
          subcolNames = [
            "chapters", "Chapters",
            "khandas", "Khandas",
            "adhyayas", "Adhyayas",
            "vallis", "Vallis", "valli",
            "sections", "Sections",
            "brahmanas", "Brahmanas",
            "anuvakas", "Anuvakas",
            "parts", "Parts"
          ];
        }

        if (subcolNames.length === 0) {
          setSargas([]);
          setLoadingSargas(false);
          return;
        }

        // Map each candidate subcollection name to the field its docs actually use for ordering
        const orderFieldMap: Record<string, string> = {
          skandhas: "skandha_number",
          Skandhas: "skandha_number",
          skandas: "skandha_number",
          Skandas: "skandha_number",
          samhitas: "samhita_number",
          Samhitas: "samhita_number",
          chapters: "chapter_number",
          Chapters: "chapter_number",
          cantos: "canto_number",
          Cantos: "canto_number",
          khandas: "khanda_number",
          Khandas: "khanda_number",
          vallis: "valli_number",
          Vallis: "valli_number",
          valli: "valli_number",
          brahmanas: "brahmana_number",
          Brahmanas: "brahmana_number",
          sections: "section_number",
          Sections: "section_number",
          suktas: "sukta_number",
          Suktas: "sukta_number",
          hymns: "hymn_number",
          Hymns: "hymn_number",
          adhyayas: "adhyaya_number",
          Adhyayas: "adhyaya_number",
          sargas: "sarga_number",
          Sargas: "sarga_number",
          prashanas: "prashana_number",
          Prashanas: "prashana_number",
          prashnas: "prashna_number",
          Prashnas: "prashna_number",
          anuvakas: "anuvaka_number",
          Anuvakas: "anuvaka_number",
          padas: "pada_number",
          Padas: "pada_number"
        };

        let snap = null;
        let matchedSubcol = "";

        for (const subcolName of subcolNames) {
          const sargasColRef = collection(selectedDivision.docRef, subcolName);
          const orderField = orderFieldMap[subcolName] || (
            selectedBook === "mahabharata"
              ? "adhyaya_number"
              : selectedBook === "yajurveda"
              ? (subcolName === "prashanas" ? "prashana_number" : "prashna_number")
              : (selectedBook === "rigveda" || selectedBook === "atharvaveda" || selectedBook === "samaveda")
              ? "sukta_number"
              : selectedBook === "upanishads"
              ? "chapter_number"
              : "sarga_number"
          );

          let testSnap: any = null;

          try {
            const q = query(sargasColRef, orderBy(orderField, "asc"));
            testSnap = await safeGetDocs(q);
          } catch (err) {
            testSnap = null;
          }

          if (!testSnap || testSnap.empty) {
            try {
              testSnap = await safeGetDocs(sargasColRef);
            } catch (err2) {
              testSnap = null;
            }
          }

          if (testSnap && !testSnap.empty) {
            snap = testSnap;
            matchedSubcol = subcolName;
            break;
          }
        }

        if (!snap || snap.empty) {
          setSargas([]);
          setLoadingSargas(false);
          return;
        }

        const sargasFound: SargaData[] = snap.docs.map((docSnap, idx) => {
          const d = docSnap.data();
          const sNum = Number(
            (d.sukta_number ?? d.suktaNumber ?? d.sukta ?? d.hymn_number ?? d.hymn ?? d.pada_number ?? d.anuvaka_number ?? d.samhita_number ?? d.samhitaNumber ?? d.skandha_number ?? d.skandhaNumber ?? d.canto_number ?? d.cantoNumber ?? d.prashana_number ?? d.prashanaNumber ?? d.prashna_number ?? d.prashnaNumber ?? d.adhyaya_number ?? d.sarga_number ?? d.chapter_number ?? d.number ?? docSnap.id.replace(/[^0-9]/g, "")) || (idx + 1)
          );
          const sTitle = String(
            d.sukta_title ?? d.sukta_name ?? d.hymn_title ?? d.hymn_name ?? d.samhita_name ?? d.samhitaName ?? d.samhita_title ?? d.skandha_name ?? d.skandhaName ?? d.skandha_title ?? d.canto_title ?? d.canto_name ?? d.title ?? d.name ?? d.sarga_title ?? d.chapter_title ?? `${getSubdivisionName(selectedBook, true)} ${sNum}`
          );
          const refVal = d.reference ? String(d.reference) : `${getSubdivisionName(selectedBook, true)} ${sNum}`;
          return {
            id: docSnap.id,
            sarga_number: sNum,
            sarga_title: sTitle,
            display_number: `${selectedDivision.chapter_number}.${sNum}`,
            reference: refVal,
            docRef: docSnap.ref
          };
        }).filter(s => s.sarga_number > 0);

        sargasFound.sort((a, b) => a.sarga_number - b.sarga_number);

        setSargas(sargasFound);
        if (pendingSubLevel) {
          const matchedS = sargasFound.find(s => s.sarga_number === pendingSubLevel);
          if (matchedS) {
            setSelectedSarga(matchedS);
          } else if (sargasFound.length > 0) {
            setSelectedSarga(sargasFound[0]);
          }
          setPendingSubLevel(null);
        } else if (selectedBook === "upanishads" && sargasFound.length === 1) {
          setSelectedSarga(sargasFound[0]);
        }
      } catch (err: any) {
        console.error(`[Gita Firestore] Error loading sub-divisions:`, err);
        setSargasError(err.message || `Failed to load sub-divisions from Firestore.`);
      } finally {
        setLoadingSargas(false);
      }
    };

    fetchSargas();
  }, [selectedDivision, selectedBook, yajurvedaBranch, dataVersion]);

  // Load verses whenever selected division / sarga changes
  useEffect(() => {
    if (!selectedDivision) {
      setVerses([]);
      return;
    }

    // If waiting for Prashanas/Sargas/Suktas to load, don't query verses prematurely
    if (loadingSargas) {
      setLoadingVerses(true);
      return;
    }

    // Only wait for sub-division selection if sub-divisions were actually found
    if (sargas.length > 0 && !selectedSarga) {
      setVerses([]);
      setLoadingVerses(false);
      return;
    }

    const fetchVerses = async () => {
      setLoadingVerses(true);
      setVersesError(null);
      try {
        const parentDocRef = selectedSarga ? selectedSarga.docRef : selectedDivision.docRef;
        
        let snap: any = null;
        const verseSubcolCandidates = [
          "verses", "Verses", "verse", "Verse",
          "slokas", "Shlokas", "shlokas", "Shloka",
          "mantras", "Mantras", "mantra", "Mantra",
          "richas", "Richas", "suktas", "Suktas",
          "padas", "Padas", "anuvakas", "Anuvakas",
          "lines", "Lines", "text", "shlok"
        ];

        // 1. Check direct verse subcollections on parentDocRef
        for (const vSubcol of verseSubcolCandidates) {
          const versesColRef = collection(parentDocRef, vSubcol);
          for (const orderFieldName of ["verse_number", "number", "verse_num", "verse_no", "verseNo", "verse", "mantra_number", "sloka_number", "shloka_number", "richa_number"]) {
            try {
              const q = query(versesColRef, orderBy(orderFieldName, "asc"));
              const testSnap = await safeGetDocs(q);
              if (testSnap && !testSnap.empty) {
                snap = testSnap;
                break;
              }
            } catch (queryErr) {
              // try next order field
            }
          }
          if (snap && !snap.empty) break;

          try {
            const testSnap = await safeGetDocs(versesColRef);
            if (testSnap && !testSnap.empty) {
              snap = testSnap;
              break;
            }
          } catch (err2) {
            // try next subcol
          }
        }
        
        let versesFound: VerseData[] = [];

        if (snap && !snap.empty) {
          versesFound = snap.docs.map((docSnap: any, idx: number) => {
            const d = docSnap.data();
            const rawNum = d.verse_number ?? d.verseNumber ?? d.verse_num ?? d.verse_no ?? d.verseNo ?? d.number ?? d.verse ?? d.mantra_number ?? d.sloka_number ?? d.shloka_number ?? (docSnap.id.replace(/[^0-9]/g, "") || "0");
            const vNum = Number(rawNum) || (idx + 1);
            
            // Display reference field as the verse label
            const refVal = d.reference ? String(d.reference) : 
              selectedBook === "upanishads" && selectedSarga
                ? `${selectedSarga.sarga_number}.${vNum}`
                : selectedSarga
                ? `${selectedDivision.chapter_number}.${selectedSarga.sarga_number}.${vNum}`
                : `${selectedDivision.chapter_number}.${vNum}`;
            
            const verseText = extractVerseText(d);
            const itxText = extractTransliteration(d);

            return {
              id: `${docSnap.id}_${idx}`,
              verse_number: vNum,
              reference: refVal,
              text: verseText,
              itx: itxText
            };
          }).filter((v: VerseData) => v.verse_number > 0 || v.text !== "");
        } else {
          // 2. Multi-tier probe: check nested subcollections (e.g. Shiva Purana: samhita -> khandas/chapters -> verses, Bhagavata/Devi Bhagavata: skandha -> chapters -> verses, Ramayana: kanda -> sargas -> verses, Rigveda: mandala -> suktas -> verses)
          const nestedSubcolNames = [
            "chapters", "Chapters", "khandas", "Khandas", "skandhas", "Skandhas", "samhitas", "Samhitas",
            "cantos", "Cantos", "sections", "Sections", "adhyayas", "Adhyayas", "sargas", "Sargas",
            "suktas", "Suktas", "hymns", "Hymns", "anuvakas", "Anuvakas", "vargas", "Vargas",
            "prashanas", "prashnas", "padas", "Padas"
          ];

          for (const nestedSubcol of nestedSubcolNames) {
            const subColRef = collection(parentDocRef, nestedSubcol);
            let subSnap: any = null;
            
            for (const orderField of ["chapter_number", "sarga_number", "adhyaya_number", "sukta_number", "khanda_number", "skandha_number", "number"]) {
              try {
                const testSnap = await safeGetDocs(query(subColRef, orderBy(orderField, "asc")));
                if (testSnap && !testSnap.empty) {
                  subSnap = testSnap;
                  break;
                }
              } catch (e) {}
            }

            if (!subSnap || subSnap.empty) {
              try {
                const testSnap = await safeGetDocs(subColRef);
                if (testSnap && !testSnap.empty) {
                  subSnap = testSnap;
                }
              } catch (e) {}
            }

            if (subSnap && !subSnap.empty) {
              const nestedVersesPromises = subSnap.docs.map(async (subDoc: any, sIdx: number) => {
                const sData = subDoc.data();
                const sNum = Number(sData.chapter_number ?? sData.chapterNumber ?? sData.sarga_number ?? sData.adhyaya_number ?? sData.sukta_number ?? sData.khanda_number ?? sData.skandha_number ?? sData.number ?? (subDoc.id.replace(/[^0-9]/g, "") || (sIdx + 1)));
                
                // Try direct verses under subDoc
                for (const vSubcol of ["verses", "Verses", "verse", "Verse", "slokas", "Shlokas", "shlokas", "mantras", "Mantras", "richas", "Richas", "padas", "lines"]) {
                  const versesSubcol = collection(subDoc.ref, vSubcol);
                  let vSnap: any = null;
                  
                  for (const vOrder of ["verse_number", "number", "verse_num", "verse_no", "sloka_number", "mantra_number"]) {
                    try {
                      const testVSnap = await safeGetDocs(query(versesSubcol, orderBy(vOrder, "asc")));
                      if (testVSnap && !testVSnap.empty) {
                        vSnap = testVSnap;
                        break;
                      }
                    } catch (e) {}
                  }

                  if (!vSnap || vSnap.empty) {
                    try {
                      const testVSnap = await safeGetDocs(versesSubcol);
                      if (testVSnap && !testVSnap.empty) {
                        vSnap = testVSnap;
                      }
                    } catch (e) {}
                  }

                  if (vSnap && !vSnap.empty) {
                    return vSnap.docs.map((docSnap: any, vIdx: number) => {
                      const d = docSnap.data();
                      const vNum = Number((d.verse_number ?? d.verseNumber ?? d.verse_num ?? d.number ?? docSnap.id.replace(/[^0-9]/g, "")) || (vIdx + 1));
                      const refVal = d.reference ? String(d.reference) : `${selectedDivision.chapter_number}.${sNum}.${vNum}`;
                      return {
                        id: `${subDoc.id}_${docSnap.id}_${vIdx}`,
                        verse_number: sNum * 1000 + vNum,
                        reference: refVal,
                        text: extractVerseText(d),
                        itx: extractTransliteration(d)
                      };
                    });
                  }
                }

                // If subDoc is an intermediate container (e.g. Khanda in Shiva Purana Rudra Samhita, or Chapter with nested verses)
                for (const tier3Subcol of ["chapters", "Chapters", "adhyayas", "Adhyayas", "sections", "Sections", "suktas", "verses"]) {
                  const tier3Col = collection(subDoc.ref, tier3Subcol);
                  let tier3Snap: any = null;
                  try {
                    const testSnap = await safeGetDocs(tier3Col);
                    if (testSnap && !testSnap.empty) tier3Snap = testSnap;
                  } catch (e) {}

                  if (tier3Snap && !tier3Snap.empty) {
                    const tier3Promises = tier3Snap.docs.map(async (t3Doc: any, t3Idx: number) => {
                      const t3Data = t3Doc.data();
                      const t3Num = Number(t3Data.chapter_number ?? t3Data.adhyaya_number ?? t3Data.number ?? (t3Doc.id.replace(/[^0-9]/g, "") || (t3Idx + 1)));
                      
                      // Check if t3Doc is a verse itself
                      const t3Text = extractVerseText(t3Data);
                      if (t3Text) {
                        return [{
                          id: `${subDoc.id}_${t3Doc.id}_${t3Idx}`,
                          verse_number: sNum * 10000 + t3Num,
                          reference: `${selectedDivision.chapter_number}.${sNum}.${t3Num}`,
                          text: t3Text,
                          itx: extractTransliteration(t3Data)
                        }];
                      }

                      // Check verses under t3Doc
                      for (const vSub of ["verses", "Verses", "verse", "slokas", "shlokas", "mantras"]) {
                        const vCol3 = collection(t3Doc.ref, vSub);
                        let vSnap3: any = null;
                        try {
                          vSnap3 = await safeGetDocs(vCol3);
                        } catch (e) {}

                        if (vSnap3 && !vSnap3.empty) {
                          return vSnap3.docs.map((docSnap: any, vIdx: number) => {
                            const d = docSnap.data();
                            const vNum = Number((d.verse_number ?? d.verseNumber ?? d.number ?? docSnap.id.replace(/[^0-9]/g, "")) || (vIdx + 1));
                            return {
                              id: `${subDoc.id}_${t3Doc.id}_${docSnap.id}_${vIdx}`,
                              verse_number: sNum * 10000 + t3Num * 100 + vNum,
                              reference: `${selectedDivision.chapter_number}.${sNum}.${t3Num}.${vNum}`,
                              text: extractVerseText(d),
                              itx: extractTransliteration(d)
                            };
                          });
                        }
                      }
                      return [];
                    });

                    const tier3Resolved = await Promise.all(tier3Promises);
                    const tier3Flat = tier3Resolved.flat();
                    if (tier3Flat.length > 0) return tier3Flat;
                  }
                }

                return [];
              });

              const nestedVerses = await Promise.all(nestedVersesPromises);
              const flattened = nestedVerses.flat();
              if (flattened.length > 0) {
                versesFound = flattened;
                break;
              }
            }
          }

          // 3. If still empty, check if parentDocRef document itself contains a verses / shlokas / mantras array
          if (versesFound.length === 0) {
            try {
              const pSnap = await safeGetDoc(parentDocRef);
              if (pSnap && pSnap.exists()) {
                const pData = pSnap.data();
                const arr = pData.verses || pData.shlokas || pData.mantras || pData.lines || pData.content;
                if (Array.isArray(arr) && arr.length > 0) {
                  versesFound = arr.map((item: any, idx: number) => {
                    if (typeof item === "string") {
                      return {
                        id: `item_${idx}`,
                        verse_number: idx + 1,
                        reference: `${selectedDivision.chapter_number}.${idx + 1}`,
                        text: item,
                        itx: ""
                      };
                    }
                    const vNum = Number(item.verse_number ?? item.number ?? (idx + 1));
                    return {
                      id: `item_${idx}`,
                      verse_number: vNum,
                      reference: item.reference || `${selectedDivision.chapter_number}.${vNum}`,
                      text: extractVerseText(item),
                      itx: extractTransliteration(item)
                    };
                  });
                }
              }
            } catch (errDoc) {
              // ignore
            }
          }
        }

        // Sort ascending by verse_number
        versesFound.sort((a, b) => a.verse_number - b.verse_number);

        setVerses(versesFound);
        if (versesFound.length === 0) {
          setVersesError("No verses were found under this document.");
        }
      } catch (err: any) {
        console.error("[Gita Firestore] Error loading verses:", err);
        setVersesError(err.message || "Failed to load verses from Firestore.");
      } finally {
        setLoadingVerses(false);
      }
    };

    fetchVerses();
  }, [selectedDivision, dataVersion, selectedSarga, selectedBook, yajurvedaBranch, loadingSargas, sargas.length]);

  const handleYajurvedaDropdownSelect = (levelId: number, subLevelId?: number) => {
    if (selectedBook !== "yajurveda") return;

    let targetDiv = divisions.find(d => d.chapter_number === levelId);
    if (!targetDiv) {
      targetDiv = {
        id: `${yajurvedaBranch === "shukla" ? "chapter" : "kanda"}_${levelId}`,
        chapter_number: levelId,
        chapter_title: yajurvedaBranch === "shukla" ? `Chapter ${levelId}` : `Kanda ${levelId}`,
        docRef: doc(
          db,
          "Holy Scripture Books",
          "Hinduism",
          "Yajurveda (यजुर्वेदः)",
          yajurvedaBranch,
          yajurvedaBranch === "shukla" ? "chapters" : "kandas",
          yajurvedaBranch === "shukla" ? `chapter_${levelId}` : `kanda_${levelId}`
        )
      };
    }

    setSelectedDivision(targetDiv);

    if (yajurvedaBranch === "krishna" && subLevelId) {
      setPendingSubLevel(subLevelId);
    } else {
      setSelectedSarga(null);
      setPendingSubLevel(null);
    }
  };

  return (
    <div 
      id="gita-view-container" 
      className="bg-gradient-to-b from-stone-900/80 to-[#0e0e15] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative Golden Ray */}
      <div className="absolute top-0 left-1/4 w-96 h-24 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center space-x-2">
            <span className={`p-1 px-2.5 rounded-full ${checkIsQuotaExhausted() ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-amber-500/10 text-amber-400 border-amber-500/20"} font-mono text-[9px] tracking-widest uppercase border font-bold inline-flex items-center gap-1`}>
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>{checkIsQuotaExhausted() ? "FIRESTORE PAUSED (QUOTA REACHED - LOCAL MODE)" : "LIVE FIRESTORE DATABASE CONNECTED"}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 
              id="gita-title-header"
              className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3 leading-[1.85]"
            >
              <Book className="w-6 h-6 text-amber-400" />
              <span className="leading-[1.85]">
                {selectedBook === "bhagavad_gita" 
                  ? "Bhagavad Gita" 
                  : selectedBook === "rigveda" 
                  ? "Rigveda (ऋग्वेद)" 
                  : selectedBook === "ramayana" 
                  ? "Ramayana (रामायणम्)" 
                  : selectedBook === "mahabharata"
                  ? "Mahabharata (महाभारतम्)"
                  : selectedBook === "yajurveda"
                  ? "Yajurveda (यजुर्वेदः)"
                  : selectedBook === "samaveda"
                  ? "Samaveda (सामवेद)"
                  : selectedBook === "atharvaveda"
                  ? "Atharvaveda (अथर्ववेद)"
                  : selectedBook === "upanishads"
                  ? "Principal Upanishads (उपनिषद्)"
                  : selectedBook === "upapuranas"
                  ? "Upapuranas (उपपुराण)"
                  : "Mahapuranas (महापुराणाणि)"}
              </span>
            </h2>

            {/* Custom Tab Switcher */}
            <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
              <button
                id="select-gita-btn"
                onClick={() => setSelectedBook("bhagavad_gita")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedBook === "bhagavad_gita"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Bhagavad Gita
              </button>
              <button
                id="select-rigveda-btn"
                onClick={() => setSelectedBook("rigveda")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer leading-[1.85] ${
                  selectedBook === "rigveda"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Rigveda (ऋग्वेद)
              </button>
              <button
                id="select-ramayana-btn"
                onClick={() => setSelectedBook("ramayana")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer leading-[1.85] ${
                  selectedBook === "ramayana"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Ramayana (रामायणम्)
              </button>
              <button
                id="select-mahabharata-btn"
                onClick={() => setSelectedBook("mahabharata")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer leading-[1.85] ${
                  selectedBook === "mahabharata"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mahabharata (महाभारतम्)
              </button>
              <button
                id="select-yajurveda-btn"
                onClick={() => setSelectedBook("yajurveda")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer leading-[1.85] ${
                  selectedBook === "yajurveda"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Yajurveda (यजुर्वेदः)
              </button>
              <button
                id="select-samaveda-btn"
                onClick={() => setSelectedBook("samaveda")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer leading-[1.85] ${
                  selectedBook === "samaveda"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Samaveda (सामवेद)
              </button>
              <button
                id="select-atharvaveda-btn"
                onClick={() => setSelectedBook("atharvaveda")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer leading-[1.85] ${
                  selectedBook === "atharvaveda"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Atharvaveda (अथर्ववेद)
              </button>
              <button
                id="select-mahapuranas-btn"
                onClick={() => setSelectedBook("mahapuranas")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer leading-[1.85] ${
                  selectedBook === "mahapuranas"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mahapuranas (महापुराणाणि)
              </button>
              <button
                id="select-upapuranas-btn"
                onClick={() => setSelectedBook("upapuranas")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer leading-[1.85] ${
                  selectedBook === "upapuranas"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Upapuranas (उपपुराण)
              </button>
              <button
                id="select-upanishads-btn"
                onClick={() => setSelectedBook("upanishads")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer leading-[1.85] ${
                  selectedBook === "upanishads"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Principal Upanishads (उपनिषद्)
              </button>
            </div>
          </div>

          {/* Yajurveda Branch & Dropdown Selector */}
          {selectedBook === "yajurveda" && (
            <YajurvedaDropdownSelector
              branch={yajurvedaBranch}
              onBranchChange={(newBranch) => {
                setYajurvedaBranch(newBranch);
                setSelectedDivision(null);
                setSelectedSarga(null);
              }}
              selectedLevelId={selectedDivision?.chapter_number || null}
              selectedSubLevelId={selectedSarga?.sarga_number || null}
              onSelectOption={handleYajurvedaDropdownSelect}
              loading={loading || loadingSargas || loadingVerses}
            />
          )}
          <p className="text-xs text-slate-400 max-w-xl">
            Sourced live from your Firestore <code className="bg-white/5 px-1 rounded">Holy Scripture Books</code> collection. 
            Select any {getDivisionName(selectedBook)} to read its timeless verses.
          </p>
        </div>

        {selectedDivision && (
          <button
            id="back-to-chapters-btn"
            onClick={() => {
              if (selectedSarga && sargas.length > 1) {
                setSelectedSarga(null);
              } else {
                setSelectedSarga(null);
                setSelectedDivision(null);
              }
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-amber-400 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{selectedSarga && sargas.length > 1 ? `Back to ${getSubdivisionNamePlural(selectedBook)}` : `Back to ${getDivisionNamePlural(selectedBook)}`}</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Querying Holy Scripture Books collection...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">Unable to fetch Holy Scripture Books</p>
            <p className="text-xs text-slate-400">{error}</p>
          </div>
        </div>
      ) : !selectedDivision ? (
        // Divisions Grid
        <div className="space-y-4">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
            Select a {getDivisionName(selectedBook, true)} ({divisions.length} available)
          </h3>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
          >
            {divisions.map((div) => (
              <motion.div
                id={`division-card-${div.chapter_number}`}
                key={div.id}
                whileHover={{ scale: 1.015, y: -2 }}
                onClick={() => setSelectedDivision(div)}
                className="bg-white/[0.02] border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.04] p-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm"
              >
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-amber-500/80 uppercase tracking-widest block">
                    {getDivisionName(selectedBook, true)} {div.chapter_number}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                    {div.chapter_title}
                  </h4>
                </div>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/10 transition-colors">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : !selectedSarga && sargas.length > 0 ? (
        // Sargas, Suktas, or Adhyayas selection view
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                Viewing {getDivisionName(selectedBook, true)} {selectedDivision.chapter_number}
              </span>
              <h3 className="text-lg font-serif font-bold text-slate-100">
                {selectedDivision.chapter_title}
              </h3>
            </div>
            <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold">
              {loadingSargas ? "Loading..." : `${sargas.length} ${getSubdivisionNamePlural(selectedBook)}`}
            </span>
          </div>

          {loadingSargas ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-7 h-7 text-amber-500 animate-spin" />
              <p className="text-xs font-mono text-slate-400">Loading {getSubdivisionNamePlural(selectedBook).toLowerCase()} for {selectedDivision.chapter_title}...</p>
            </div>
          ) : sargasError ? (
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center text-slate-400 text-xs">
              {sargasError}
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                Select {getSubdivisionName(selectedBook, true)} ({sargas.length} available)
              </h3>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
              >
                {sargas.map((sarga) => (
                  <motion.button
                    id={`sarga-card-${sarga.sarga_number}`}
                    key={sarga.id}
                    whileHover={{ scale: 1.02, y: -1 }}
                    onClick={() => setSelectedSarga(sarga)}
                    className="bg-white/[0.02] border border-white/5 hover:border-amber-500/40 hover:bg-white/[0.04] p-3.5 rounded-xl transition-all duration-200 cursor-pointer text-left group font-medium flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-500/80 group-hover:text-amber-400 block mb-0.5">
                        {getSubdivisionName(selectedBook, true)} {sarga.sarga_number}
                      </span>
                      <span className="text-sm font-serif font-bold text-slate-100 group-hover:text-white block line-clamp-2">
                        {sarga.sarga_title || `${getSubdivisionName(selectedBook, true)} ${sarga.sarga_number}`}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      ) : (
        // Verses View (Bhagavad Gita, Rigveda, or selected Sarga/Adhyaya of Ramayana/Mahabharata)
        <div className="space-y-5 animate-fade-in">
          {/* Division Metadata Ribbon */}
          <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                Viewing Verses
              </span>
              <h3 className="text-lg font-serif font-bold text-slate-100">
                {`${getDivisionName(selectedBook, true)} ${selectedDivision.chapter_number}: ${selectedDivision.chapter_title}${selectedSarga && (sargas.length > 1 || selectedBook !== "upanishads") ? ` - ${getSubdivisionName(selectedBook, true)} ${selectedSarga.sarga_number}` : ''}`}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-center">
              {onReadInDesk && (
                <button
                  id="open-in-desk-btn"
                  onClick={() => onReadInDesk(selectedBook, selectedDivision.chapter_number)}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105"
                  title="Open this section in the Interactive Reading Desk with commentaries, parallels, and audio tools"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open in Reading Desk</span>
                </button>
              )}
              {verses.some(v => Boolean(v.itx)) && (
                <button
                  id="toggle-transliteration-btn"
                  onClick={() => setShowTransliteration(prev => !prev)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                    showTransliteration
                      ? "bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm"
                      : "bg-white/5 text-slate-300 hover:text-white border-white/10"
                  }`}
                  title="Toggle ITRANS (ITX) transliteration"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{showTransliteration ? "Hide ITX" : "Show ITX"}</span>
                </button>
              )}
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold">
                {loadingVerses ? "Loading..." : `${verses.length} Verses`}
              </span>
            </div>
          </div>

          {loadingVerses ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-7 h-7 text-amber-500 animate-spin" />
              <p className="text-xs font-mono text-slate-400">Loading verses...</p>
            </div>
          ) : versesError ? (
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center text-slate-400 text-xs">
              {versesError}
            </div>
          ) : verses.length === 0 ? (
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl text-center text-slate-400 text-xs sm:text-sm">
              No verses were found under this selection.
            </div>
          ) : (
            // Verses List
            <div className="space-y-3">
              {verses.map((verse, vIdx) => (
                <div
                  id={`verse-card-${verse.verse_number}`}
                  key={`${verse.id}_${vIdx}`}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-4 sm:p-5 flex gap-4 transition-all hover:bg-white/[0.03] hover:border-white/10"
                >
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center px-2.5 h-8 min-w-[2.5rem] rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-400">
                      {verse.reference}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    {/* Hindi Text formatting support */}
                    <p className={`text-slate-100 font-medium leading-relaxed ${
                      /[\u0900-\u097F]/.test(verse.text) ? "font-hindi text-base sm:text-lg text-amber-100/90 whitespace-pre-line leading-loose" : "text-sm sm:text-base whitespace-pre-line"
                    }`}>
                      {verse.text}
                    </p>

                    {showTransliteration && verse.itx && (
                      <p className="text-xs sm:text-sm font-mono text-amber-300/90 leading-relaxed pt-1.5 border-t border-white/5 whitespace-pre-line">
                        {verse.itx}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
