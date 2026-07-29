/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, ChevronLeft, Loader2, Sparkles, AlertCircle, Book, Calendar } from "lucide-react";
import { YajurvedaDropdownSelector } from "./YajurvedaDropdownSelector";

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

export type ScriptureBookSelection = "bhagavad_gita" | "rigveda" | "ramayana" | "mahabharata" | "yajurveda" | "mahapuranas";

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
          const shuklaSnap = await getDoc(shuklaRef);
          let sLabel = "Shukla (White)";
          if (shuklaSnap.exists() && shuklaSnap.data()?.branch_name) {
            sLabel = String(shuklaSnap.data().branch_name);
          }

          const krishnaRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna");
          const krishnaSnap = await getDoc(krishnaRef);
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
    if (book === "yajurveda") {
      return yajurvedaBranch === "shukla" ? (capitalized ? "Chapter" : "chapter") : (capitalized ? "Kanda" : "kanda");
    }
    if (book === "mahapuranas") return capitalized ? "Purana" : "purana";
    return capitalized ? "Kanda" : "kanda";
  };

  const getDivisionNamePlural = (book: ScriptureBookSelection) => {
    if (book === "bhagavad_gita") return "Chapters";
    if (book === "rigveda") return "Mandalas";
    if (book === "mahabharata") return "Parvas";
    if (book === "yajurveda") {
      return yajurvedaBranch === "shukla" ? "Chapters" : "Kandas";
    }
    if (book === "mahapuranas") return "Mahapuranas";
    return "Kandas";
  };

  const getSubdivisionName = (book: ScriptureBookSelection, capitalized = false) => {
    if (book === "mahabharata") return capitalized ? "Adhyaya" : "adhyaya";
    if (book === "yajurveda") return capitalized ? "Prashna" : "prashna";
    if (book === "mahapuranas") {
      if (selectedDivision?.id?.toLowerCase().includes("shiva") || selectedDivision?.chapter_title?.toLowerCase().includes("shiva")) {
        return capitalized ? "Samhita" : "samhita";
      }
      return capitalized ? "Chapter" : "chapter";
    }
    return capitalized ? "Sarga" : "sarga";
  };

  const getSubdivisionNamePlural = (book: ScriptureBookSelection) => {
    if (book === "mahabharata") return "Adhyayas";
    if (book === "yajurveda") return "Prashnas";
    if (book === "mahapuranas") {
      if (selectedDivision?.id?.toLowerCase().includes("shiva") || selectedDivision?.chapter_title?.toLowerCase().includes("shiva")) {
        return "Samhitas";
      }
      return "Chapters";
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
              snap = await getDocs(q);
            } catch (queryErr) {
              console.warn("[Gita Firestore] Failed reading chapter list with orderBy, trying unordered fallback:", queryErr);
              snap = await getDocs(directColRef);
            }
            
            if (snap.empty) {
              console.log("[Gita Firestore] Subcollection 'Bhagavad Gita' empty, trying fallback 'Bhagavad Gita (श्रीमद्भगवद्गीता)'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Bhagavad Gita (श्रीमद्भगवद्गीता)");
              try {
                const q = query(directColRef, orderBy("chapter_number", "asc"));
                snap = await getDocs(q);
              } catch (queryErr) {
                console.warn("[Gita Firestore] Failed fallback with orderBy, trying unordered:", queryErr);
                snap = await getDocs(directColRef);
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
                  const snap = await getDocs(colRef);
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
            const snap = await getDocs(rootColRef);
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
            const snap = await getDocs(fallbackColRef);
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
              snap = await getDocs(q);
            } catch (queryErr) {
              console.warn("[Gita Firestore] Failed reading Rigveda mandals with orderBy, trying unordered:", queryErr);
              snap = await getDocs(directColRef);
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Rigveda (ऋग्वेद)' empty, trying fallback 'Rigveda'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Rigveda");
              try {
                const q = query(directColRef, orderBy("mandal_number", "asc"));
                snap = await getDocs(q);
              } catch (queryErr) {
                snap = await getDocs(directColRef);
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
              snap = await getDocs(q);
            } catch (queryErr) {
              try {
                const q = query(directColRef, orderBy("chapter_number", "asc"));
                snap = await getDocs(q);
              } catch (queryErr2) {
                console.warn("[Gita Firestore] Failed reading Mahabharata parvas with orderBy, trying unordered:", queryErr2);
                snap = await getDocs(directColRef);
              }
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Mahabharata (महाभारतम्)' empty, trying fallback 'Mahabharata'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Mahabharata");
              try {
                const q = query(directColRef, orderBy("parva_number", "asc"));
                snap = await getDocs(q);
              } catch (queryErr) {
                snap = await getDocs(directColRef);
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
                chapSnap = await getDocs(query(chaptersColRef, orderBy("chapter_number", "asc")));
              } catch (e) {
                chapSnap = await getDocs(chaptersColRef);
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
                  kandaSnap = await getDocs(query(kandasColRef, orderBy("kanda_number", "asc")));
                } catch (e) {
                  try {
                    kandaSnap = await getDocs(kandasColRef);
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
              snap = await getDocs(q);
            } catch (queryErr) {
              console.warn("[Gita Firestore] Failed reading Ramayana (रामायणम्) kandas with orderBy kanda_number, trying unordered:", queryErr);
              snap = await getDocs(directColRef);
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Ramayana (रामायणम्)' empty, trying fallback 'Ramayana (रामायण)'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Ramayana (रामायण)");
              try {
                const q = query(directColRef, orderBy("kanda_number", "asc"));
                snap = await getDocs(q);
              } catch (queryErr) {
                snap = await getDocs(directColRef);
              }
            }

            if (snap.empty) {
              console.log("[Gita Firestore] 'Ramayana (रामायण)' empty, trying fallback 'Ramayana'...");
              directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Ramayana");
              try {
                const q = query(directColRef, orderBy("kanda_number", "asc"));
                snap = await getDocs(q);
              } catch (queryErr) {
                snap = await getDocs(directColRef);
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
        } else if (selectedBook === "mahapuranas") {
          // --- NEW MAHAPURANAS MAPPING ---
          try {
            const candidatePaths = [
              collection(db, "Holy Scripture Books", "Hinduism", "Mahapuranas (महापुराणाणि)"),
              collection(db, "Holy Scripture Books", "Hinduism", "Mahapuranas"),
              collection(db, "Holy Scripture Books", "Hinduism", "Puranas"),
              collection(db, "Holy Scripture Books", "Hinduism", "Puranas (पुराणानी)"),
              collection(db, "Mahapuranas (महापुराणाणि)"),
              collection(db, "Mahapuranas")
            ];

            let snap = null;
            for (const colRef of candidatePaths) {
              try {
                let testSnap;
                try {
                  testSnap = await getDocs(query(colRef, orderBy("purana_number", "asc")));
                } catch {
                  try {
                    testSnap = await getDocs(query(colRef, orderBy("number", "asc")));
                  } catch {
                    testSnap = await getDocs(colRef);
                  }
                }
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
                const pTitle = formatChapterTitle(String(d.purana_title ?? d.purana_name ?? d.title ?? d.name ?? d.book_title ?? docSnap.id));
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
        }
      } catch (err: any) {
        console.error("[Gita Firestore] Error loading divisions:", err);
        setError(err.message || "Failed to load scripture from Firestore.");
      } finally {
        setLoading(false);
      }
    };

    fetchDivisions();
  }, [selectedBook, yajurvedaBranch]);

  // Load sargas, adhyayas, or prashnas when a Kanda/Parva/Branch/Purana is selected
  useEffect(() => {
    if (!selectedDivision || (selectedBook !== "ramayana" && selectedBook !== "mahabharata" && selectedBook !== "mahapuranas" && !(selectedBook === "yajurveda" && yajurvedaBranch === "krishna"))) {
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
        if (selectedBook === "mahabharata") subcolNames = ["adhyayas"];
        else if (selectedBook === "ramayana") subcolNames = ["sargas"];
        else if (selectedBook === "yajurveda") subcolNames = ["prashanas", "prashnas", "adhyayas", "sargas", "chapters"];
        else if (selectedBook === "mahapuranas") {
          const isShiva = selectedDivision?.id?.toLowerCase().includes("shiva") || selectedDivision?.chapter_title?.toLowerCase().includes("shiva");
          subcolNames = isShiva 
            ? ["samhitas", "Samhitas", "chapters", "Chapters", "skandas", "khandas"]
            : ["chapters", "Chapters", "samhitas", "Samhitas", "skandas", "khandas"];
        }

        let snap = null;
        let matchedSubcol = "";

        for (const subcolName of subcolNames) {
          const sargasColRef = collection(selectedDivision.docRef, subcolName);
          try {
            const orderField = selectedBook === "mahabharata"
              ? "adhyaya_number"
              : selectedBook === "yajurveda"
              ? (subcolName === "prashanas" ? "prashana_number" : "prashna_number")
              : "sarga_number";
            const q = query(sargasColRef, orderBy(orderField, "asc"));
            const testSnap = await getDocs(q);
            if (!testSnap.empty) {
              snap = testSnap;
              matchedSubcol = subcolName;
              break;
            }
          } catch (err) {
            try {
              const testSnap = await getDocs(sargasColRef);
              if (!testSnap.empty) {
                snap = testSnap;
                matchedSubcol = subcolName;
                break;
              }
            } catch (err2) {}
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
            (d.samhita_number ?? d.samhitaNumber ?? d.prashana_number ?? d.prashanaNumber ?? d.prashna_number ?? d.prashnaNumber ?? d.adhyaya_number ?? d.sarga_number ?? d.chapter_number ?? d.number ?? docSnap.id.replace(/[^0-9]/g, "")) || (idx + 1)
          );
          const sTitle = String(d.samhita_name ?? d.samhitaName ?? d.samhita_title ?? d.title ?? d.name ?? d.sarga_title ?? d.chapter_title ?? "");
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
        }

        if (sargasFound.length === 0) {
          setSargasError(`No ${getSubdivisionNamePlural(selectedBook)} were found under this ${getDivisionName(selectedBook, true)}.`);
        }
      } catch (err: any) {
        console.error(`[Gita Firestore] Error loading sub-divisions:`, err);
        setSargasError(err.message || `Failed to load sub-divisions from Firestore.`);
      } finally {
        setLoadingSargas(false);
      }
    };

    fetchSargas();
  }, [selectedDivision, selectedBook, yajurvedaBranch]);

  // Load verses when chapter/mandal, sarga/adhyaya, or prashna is selected
  useEffect(() => {
    if (!selectedDivision) {
      setVerses([]);
      return;
    }

    const is3Tier = selectedBook === "ramayana" || selectedBook === "mahabharata" || selectedBook === "mahapuranas" || (selectedBook === "yajurveda" && yajurvedaBranch === "krishna");

    // If waiting for Prashanas/Sargas to load in a 3-tier structure, don't query verses prematurely
    if (is3Tier && loadingSargas) {
      setLoadingVerses(true);
      return;
    }

    if (is3Tier && !selectedSarga && sargas.length > 0) {
      setVerses([]);
      setLoadingVerses(false);
      return;
    }

    if ((selectedBook === "ramayana" || selectedBook === "mahabharata") && !selectedSarga) {
      setVerses([]);
      setLoadingVerses(false);
      return;
    }

    const fetchVerses = async () => {
      setLoadingVerses(true);
      setVersesError(null);
      try {
        const parentDocRef = selectedSarga ? selectedSarga.docRef : selectedDivision.docRef;
        const versesColRef = collection(parentDocRef, "verses");
        
        let snap;
        try {
          const q = query(versesColRef, orderBy("verse_number", "asc"));
          snap = await getDocs(q);
        } catch (queryErr) {
          console.warn("[Gita Firestore] Failed fetching verses with orderBy, trying unordered:", queryErr);
          snap = await getDocs(versesColRef);
        }
        
        let versesFound: VerseData[] = [];

        if (snap && !snap.empty) {
          versesFound = snap.docs.map((docSnap, idx) => {
            const d = docSnap.data();
            const vNum = Number((d.verse_number ?? d.verseNumber ?? d.verse_num ?? d.number ?? docSnap.id.replace(/[^0-9]/g, "")) || (idx + 1));
            
            // Display reference field as the verse label
            const refVal = d.reference ? String(d.reference) : 
              selectedSarga
                ? `${selectedDivision.chapter_number}.${selectedSarga.sarga_number}.${vNum}`
                : `${selectedDivision.chapter_number}.${vNum}`;
            
            return {
              id: docSnap.id,
              verse_number: vNum,
              reference: refVal,
              text: String(d.text ?? d.text_content ?? d.originalText ?? d.original_text ?? d.translation ?? ""),
              itx: d.itx || d.transliteration || ""
            };
          }).filter(v => v.verse_number > 0 || v.text !== "");
        } else {
          // If no direct 'verses' subcollection, check if parentDocRef has subcollection 'chapters' (e.g. Shiva Purana: samhita -> chapters -> verses)
          const chapColRef = collection(parentDocRef, "chapters");
          let chapSnap;
          try {
            const q = query(chapColRef, orderBy("chapter_number", "asc"));
            chapSnap = await getDocs(q);
          } catch {
            chapSnap = await getDocs(chapColRef);
          }

          if (chapSnap && !chapSnap.empty) {
            const nestedVersesPromises = chapSnap.docs.map(async (chapDoc, cIdx) => {
              const cData = chapDoc.data();
              const chNum = Number(cData.chapter_number ?? cData.chapterNumber ?? cData.number ?? (chapDoc.id.replace(/[^0-9]/g, "") || (cIdx + 1)));
              const versesSubcol = collection(chapDoc.ref, "verses");
              let vSnap;
              try {
                const q = query(versesSubcol, orderBy("verse_number", "asc"));
                vSnap = await getDocs(q);
              } catch {
                vSnap = await getDocs(versesSubcol);
              }

              return vSnap.docs.map((docSnap, vIdx) => {
                const d = docSnap.data();
                const vNum = Number((d.verse_number ?? d.verseNumber ?? d.verse_num ?? d.number ?? docSnap.id.replace(/[^0-9]/g, "")) || (vIdx + 1));
                const refVal = d.reference ? String(d.reference) : `Chapter ${chNum}, Verse ${vNum}`;
                return {
                  id: docSnap.id,
                  verse_number: chNum * 1000 + vNum,
                  reference: refVal,
                  text: String(d.text ?? d.text_content ?? d.originalText ?? d.original_text ?? d.translation ?? ""),
                  itx: d.itx || d.transliteration || ""
                };
              });
            });

            const nestedVerses = await Promise.all(nestedVersesPromises);
            versesFound = nestedVerses.flat();
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
  }, [selectedDivision, selectedSarga, selectedBook, yajurvedaBranch, loadingSargas, sargas.length]);

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
            <span className="p-1 px-2.5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[9px] tracking-widest uppercase border border-amber-500/20 font-bold inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>LIVE FIRESTORE DATABASE CONNECTED</span>
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
              if ((selectedBook === "ramayana" || selectedBook === "mahabharata" || (selectedBook === "yajurveda" && yajurvedaBranch === "krishna")) && selectedSarga) {
                setSelectedSarga(null);
              } else {
                setSelectedDivision(null);
              }
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-amber-400 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{(selectedBook === "ramayana" || selectedBook === "mahabharata" || (selectedBook === "yajurveda" && yajurvedaBranch === "krishna")) && selectedSarga ? `Back to ${getSubdivisionNamePlural(selectedBook)}` : `Back to ${getDivisionNamePlural(selectedBook)}`}</span>
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
      ) : (selectedBook === "ramayana" || selectedBook === "mahabharata" || selectedBook === "mahapuranas" || (selectedBook === "yajurveda" && yajurvedaBranch === "krishna")) && !selectedSarga && sargas.length > 0 ? (
        // Sargas or Adhyayas selection view
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
              {(selectedBook === "ramayana" || selectedBook === "mahabharata" || (selectedBook === "yajurveda" && yajurvedaBranch === "krishna"))
                ? `${getDivisionName(selectedBook, true)} ${selectedDivision.chapter_number}: ${selectedDivision.chapter_title}${selectedSarga ? ` - ${getSubdivisionName(selectedBook, true)} ${selectedSarga.display_number}` : ''}`
                : `${getDivisionName(selectedBook, true)} ${selectedDivision.chapter_number}: ${selectedDivision.chapter_title}`
              }
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
              {/* Transliteration hidden as requested */}
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
              {verses.map((verse) => (
                <div
                  id={`verse-card-${verse.verse_number}`}
                  key={verse.id}
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

                    {/* Phonetic transliteration hidden as requested */}
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
