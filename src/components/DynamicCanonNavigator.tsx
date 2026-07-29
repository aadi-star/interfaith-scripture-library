import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Layers, 
  ListOrdered, 
  Sparkles, 
  AlertCircle,
  FolderTree,
  Book,
  Compass
} from "lucide-react";
import { db } from "../firebase";
import { collection, doc, getDocs, query, orderBy } from "firebase/firestore";
import { YajurvedaDropdownSelector } from "./YajurvedaDropdownSelector";

export interface BookNavMetadata {
  id?: string;
  key?: string;
  title?: string;
  book_title?: string;
  originalTitle?: string;
  religion?: string;
  hierarchy_type?: "flat" | "multi_tier" | "standard" | string;
  branches?: string[];
  description?: string;
}

interface DynamicCanonNavigatorProps {
  book: BookNavMetadata;
  onClose?: () => void;
}

interface TierNode {
  id: string;
  label: string;
  number: number;
  docRef?: any;
  data?: any;
}

interface VerseItem {
  id: string;
  number: string;
  verse_number: number;
  originalText: string;
  transliteration?: string;
  translation?: string;
  reference?: string;
}

export const DynamicCanonNavigator: React.FC<DynamicCanonNavigatorProps> = ({ book, onClose }) => {
  const bookTitle = book.book_title || book.title || book.id || "Scripture Canon";
  const religion = (book.religion || "Interfaith").toUpperCase();
  const hierarchyType = book.hierarchy_type || (book.branches ? "kandas_prashanas" : "standard");

  // Navigation states
  const [selectedBranch, setSelectedBranch] = useState<string>(
    book.branches && book.branches.length > 0 ? book.branches[0].toLowerCase() : "default"
  );
  const [tier1Nodes, setTier1Nodes] = useState<TierNode[]>([]);
  const [selectedTier1, setSelectedTier1] = useState<TierNode | null>(null);
  
  const [tier2Nodes, setTier2Nodes] = useState<TierNode[]>([]);
  const [selectedTier2, setSelectedTier2] = useState<TierNode | null>(null);

  const [verses, setVerses] = useState<VerseItem[]>([]);

  // Loading & error states
  const [loadingTier1, setLoadingTier1] = useState<boolean>(false);
  const [loadingTier2, setLoadingTier2] = useState<boolean>(false);
  const [loadingVerses, setLoadingVerses] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Yajurveda specific helper and pending selection state
  const isYajurveda =
    bookTitle.toLowerCase().includes("yajurveda") ||
    (book.key && book.key.toLowerCase().includes("yajurveda"));

  const [pendingTier1Num, setPendingTier1Num] = useState<number | null>(null);
  const [pendingTier2Num, setPendingTier2Num] = useState<number | null>(null);

  const isMultiTier = 
    hierarchyType === "multi_tier" || 
    hierarchyType === "kandas_prashanas" || 
    hierarchyType === "kanda_prashana" || 
    hierarchyType === "parvas_adhyayas" || 
    hierarchyType === "kandas_sargas" || 
    selectedBranch.includes("krishna") ||
    isYajurveda;

  // Label helpers based on hierarchy
  const getTier1Label = () => {
    if ((bookTitle.toLowerCase().includes("yajurveda") && selectedBranch.includes("krishna")) || hierarchyType.includes("kanda")) return "Kanda";
    if (hierarchyType.includes("parva")) return "Parva";
    if (isMultiTier) return "Kanda / Division";
    if (hierarchyType === "flat") return "Section";
    return "Chapter";
  };

  const getTier2Label = () => {
    if ((bookTitle.toLowerCase().includes("yajurveda") && selectedBranch.includes("krishna")) || hierarchyType.includes("prashan")) return "Prashana";
    if (hierarchyType.includes("sarga")) return "Sarga";
    if (hierarchyType.includes("adhyaya")) return "Adhyaya";
    return "Section / Sub-division";
  };

  // 1. Fetch Tier 1 Nodes (Chapters or Kandas)
  useEffect(() => {
    let isMounted = true;
    async function fetchTier1() {
      setLoadingTier1(true);
      setErrorMsg(null);
      setTier1Nodes([]);
      setSelectedTier1(null);
      setTier2Nodes([]);
      setSelectedTier2(null);
      setVerses([]);

      try {
        const bookKeyClean = (book.key || book.id || bookTitle).toLowerCase().replace(/[^a-z0-9]/g, "_");
        const candidatePaths = [
          collection(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", selectedBranch, selectedBranch === "krishna" ? "kandas" : "chapters"),
          collection(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", selectedBranch, "kandas"),
          collection(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", selectedBranch, "chapters"),
          collection(db, "books", bookTitle, "branches", selectedBranch, "chapters"),
          collection(db, "books", bookTitle, "branches", selectedBranch, "kandas"),
          collection(db, "Holy Scripture Books", "Hinduism", bookTitle, selectedBranch, "chapters"),
          collection(db, "Holy Scripture Books", "Hinduism", bookTitle, selectedBranch, "kandas"),
          collection(db, "books", `${bookKeyClean}_${selectedBranch}`, "kandas")
        ];

        let foundSnap: any = null;
        for (const colRef of candidatePaths) {
          try {
            let snap;
            try {
              snap = await getDocs(query(colRef, orderBy("number", "asc")));
            } catch {
              try {
                snap = await getDocs(query(colRef, orderBy("kanda_number", "asc")));
              } catch {
                try {
                  snap = await getDocs(query(colRef, orderBy("chapter_number", "asc")));
                } catch {
                  snap = await getDocs(colRef);
                }
              }
            }

            if (snap && !snap.empty) {
              foundSnap = snap;
              break;
            }
          } catch (e) {
            // Next candidate
          }
        }

        if (foundSnap && !foundSnap.empty && isMounted) {
          const nodes: TierNode[] = foundSnap.docs.map((d: any, idx: number) => {
            const data = d.data();
            const num = Number(
              (data.kanda_number ?? data.kandaNumber ?? data.chapter_number ?? data.chapterNumber ?? data.number ?? String(d.id).replace(/[^0-9]/g, "")) || (idx + 1)
            );
            const label = String(data.kanda_title ?? data.chapter_title ?? data.title ?? data.name ?? `${getTier1Label()} ${num}`);
            return {
              id: d.id,
              label,
              number: num,
              docRef: d.ref,
              data
            };
          });

          nodes.sort((a, b) => a.number - b.number);
          setTier1Nodes(nodes);
        } else if (isMounted) {
          // Fallback node list if no subcollections exist yet (e.g. newly uploaded text)
          const fallbackNodes: TierNode[] = Array.from({ length: 5 }, (_, i) => ({
            id: `section_${i + 1}`,
            label: `${getTier1Label()} ${i + 1}`,
            number: i + 1
          }));
          setTier1Nodes(fallbackNodes);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(`Notice: Using dynamic fallback tree structure. (${err?.message || "Collection pending"})`);
        }
      } finally {
        if (isMounted) setLoadingTier1(false);
      }
    }

    fetchTier1();
    return () => { isMounted = false; };
  }, [book, selectedBranch]);

  // Auto-resolve pending Tier 1 selection
  useEffect(() => {
    if (pendingTier1Num !== null && tier1Nodes.length > 0) {
      const match = tier1Nodes.find((n) => n.number === pendingTier1Num);
      if (match) {
        setSelectedTier1(match);
        setPendingTier1Num(null);
      }
    }
  }, [tier1Nodes, pendingTier1Num]);

  // 2. Fetch Tier 2 Nodes (Prashanas) if applicable
  useEffect(() => {
    if (!selectedTier1) {
      setTier2Nodes([]);
      setSelectedTier2(null);
      return;
    }

    if (!isMultiTier) {
      setTier2Nodes([]);
      setSelectedTier2(null);
      return;
    }

    let isMounted = true;
    async function fetchTier2() {
      setLoadingTier2(true);
      setTier2Nodes([]);
      setSelectedTier2(null);

      if (!selectedTier1?.docRef) {
        // Fallback for new unlinked books
        const fallbackSub: TierNode[] = Array.from({ length: 4 }, (_, i) => ({
          id: `prashana_${i + 1}`,
          label: `${getTier2Label()} ${i + 1}`,
          number: i + 1
        }));
        if (isMounted) {
          setTier2Nodes(fallbackSub);
          setLoadingTier2(false);
        }
        return;
      }

      try {
        const subcolCandidates = ["prashanas", "prashnas", "subdivisions", "sections", "adhyayas"];
        let foundSnap: any = null;

        for (const subName of subcolCandidates) {
          try {
            const subRef = collection(selectedTier1.docRef, subName);
            let snap;
            try {
              snap = await getDocs(query(subRef, orderBy("prashana_number", "asc")));
            } catch {
              try {
                snap = await getDocs(query(subRef, orderBy("prashna_number", "asc")));
              } catch {
                snap = await getDocs(subRef);
              }
            }

            if (snap && !snap.empty) {
              foundSnap = snap;
              break;
            }
          } catch (e) {
            // Next
          }
        }

        if (foundSnap && !foundSnap.empty && isMounted) {
          const nodes: TierNode[] = foundSnap.docs.map((d: any, idx: number) => {
            const data = d.data();
            const num = Number(
              (data.prashana_number ?? data.prashanaNumber ?? data.prashna_number ?? data.prashnaNumber ?? data.number ?? String(d.id).replace(/[^0-9]/g, "")) || (idx + 1)
            );
            const label = String(data.title ?? data.name ?? `${getTier2Label()} ${num}`);
            return {
              id: d.id,
              label,
              number: num,
              docRef: d.ref,
              data
            };
          });

          nodes.sort((a, b) => a.number - b.number);
          setTier2Nodes(nodes);
        } else if (isMounted) {
          // Dynamic fallback if empty
          const fallbackSub: TierNode[] = Array.from({ length: 4 }, (_, i) => ({
            id: `prashana_${i + 1}`,
            label: `${getTier2Label()} ${i + 1}`,
            number: i + 1
          }));
          setTier2Nodes(fallbackSub);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn("[DynamicNavigator] Tier 2 load error:", err);
        }
      } finally {
        if (isMounted) setLoadingTier2(false);
      }
    }

    fetchTier2();
    return () => { isMounted = false; };
  }, [selectedTier1, hierarchyType, selectedBranch]);

  // Auto-resolve pending Tier 2 selection
  useEffect(() => {
    if (pendingTier2Num !== null && tier2Nodes.length > 0) {
      const match = tier2Nodes.find((n) => n.number === pendingTier2Num);
      if (match) {
        setSelectedTier2(match);
        setPendingTier2Num(null);
      }
    }
  }, [tier2Nodes, pendingTier2Num]);

  // 3. Fetch Verses
  useEffect(() => {
    const activeParentRef = isMultiTier ? selectedTier2?.docRef : selectedTier1?.docRef;

    if (!selectedTier1) {
      setVerses([]);
      return;
    }

    if (isMultiTier && !selectedTier2) {
      setVerses([]);
      return;
    }

    let isMounted = true;
    async function fetchVerses() {
      setLoadingVerses(true);
      setVerses([]);

      if (!activeParentRef) {
        // Render helpful placeholder for newly registered or preview texts
        const sampleVerses: VerseItem[] = [
          {
            id: "v1",
            number: `${selectedTier1?.number}${selectedTier2 ? `.${selectedTier2.number}` : ""}.1`,
            verse_number: 1,
            originalText: "ॐ इषे त्वोर्जे त्वा वायव स्थ देवो वः सविता प्रार्पयतु श्रेष्ठतमाय कर्मणे ॥",
            transliteration: "Oṁ iṣe tvorje tvā vāyava stha devo vaḥ savitā prārpayatu śreṣṭhatamāya karmaṇe ||",
            translation: "May the divine inspiration lead us towards the noble duties of life with devotion and wisdom."
          },
          {
            id: "v2",
            number: `${selectedTier1?.number}${selectedTier2 ? `.${selectedTier2.number}` : ""}.2`,
            verse_number: 2,
            originalText: "आ प्यायध्वमघ्निया देवभागमूर्जस्वतीः पयस्वतीः प्रजावतीरनमीवा अयक्ष्माः ॥",
            transliteration: "Ā pyāyadhvamaghniyā devabhāgamūrjasvatīḥ payasvatīḥ prajāvatīranamīvā ayakṣmāḥ ||",
            translation: "May all living beings thrive in unity, free from affliction, adorned with prosperity and peace."
          }
        ];
        if (isMounted) {
          setVerses(sampleVerses);
          setLoadingVerses(false);
        }
        return;
      }

      try {
        const vColRef = collection(activeParentRef, "verses");
        let snap;
        try {
          snap = await getDocs(query(vColRef, orderBy("verse_number", "asc")));
        } catch {
          snap = await getDocs(vColRef);
        }

        if (snap && !snap.empty && isMounted) {
          const list: VerseItem[] = snap.docs.map((d: any, idx: number) => {
            const data = d.data();
            const vNum = Number(
              (data.verse_number ?? data.verseNumber ?? data.verse_num ?? data.number ?? String(d.id).replace(/[^0-9]/g, "")) || (idx + 1)
            );
            const refVal = data.reference ? String(data.reference) : `${selectedTier1?.number}${selectedTier2 ? `.${selectedTier2.number}` : ""}.${vNum}`;
            return {
              id: d.id,
              number: refVal,
              verse_number: vNum,
              originalText: data.originalText ?? data.text ?? data.cleanText ?? data.text_content ?? "",
              transliteration: data.transliteration ?? data.itx ?? data.roman ?? "",
              translation: data.translation ?? data.english ?? "",
              reference: refVal
            };
          });

          list.sort((a, b) => a.verse_number - b.verse_number);
          setVerses(list);
        }
      } catch (err) {
        console.warn("[DynamicNavigator] Verses load error:", err);
      } finally {
        if (isMounted) setLoadingVerses(false);
      }
    }

    fetchVerses();
    return () => { isMounted = false; };
  }, [selectedTier1, selectedTier2, hierarchyType, selectedBranch]);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl text-stone-100 max-w-5xl mx-auto my-6 p-4 sm:p-6 font-sans">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {religion}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Hierarchy: <strong className="text-stone-300">{hierarchyType}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 mt-1">
              {bookTitle}
            </h2>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-end sm:self-center px-3 py-1.5 text-xs rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            Close
          </button>
        )}
      </div>

      {/* Branch Selector or Integrated Yajurveda Master Dropdown */}
      {isYajurveda ? (
        <YajurvedaDropdownSelector
          branch={selectedBranch === "krishna" ? "krishna" : "shukla"}
          onBranchChange={(newBranch) => {
            setSelectedBranch(newBranch);
            setSelectedTier1(null);
            setSelectedTier2(null);
          }}
          onSelectOption={(kandaOrChapter, prashanaNum) => {
            setPendingTier1Num(kandaOrChapter);
            if (prashanaNum) {
              setPendingTier2Num(prashanaNum);
            } else {
              setSelectedTier2(null);
              setPendingTier2Num(null);
            }

            const matchT1 = tier1Nodes.find((n) => n.number === kandaOrChapter);
            if (matchT1) {
              setSelectedTier1(matchT1);
              setPendingTier1Num(null);
            }
          }}
          selectedLevelId={selectedTier1?.number || pendingTier1Num || 1}
          selectedSubLevelId={selectedTier2?.number || pendingTier2Num || 1}
          loading={loadingTier1 || loadingTier2}
        />
      ) : book.branches && book.branches.length > 0 ? (
        <div className="mt-4 p-3 bg-stone-950/60 rounded-xl border border-stone-800 flex items-center gap-3">
          <span className="text-xs font-mono uppercase text-stone-400 tracking-wider">Branch:</span>
          <div className="flex items-center gap-2">
            {book.branches.map((br) => {
              const active = selectedBranch === br.toLowerCase();
              return (
                <button
                  key={br}
                  onClick={() => setSelectedBranch(br.toLowerCase())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-amber-500 text-stone-950 shadow-md font-bold"
                      : "bg-stone-800 text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {br} Branch
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Breadcrumb Path */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-stone-400 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/60">
        <span className="flex items-center gap-1 text-amber-400">
          <Compass className="w-3.5 h-3.5" />
          {bookTitle}
        </span>
        {selectedBranch && selectedBranch !== "default" && (
          <>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <span className="capitalize text-amber-300/80">{selectedBranch}</span>
          </>
        )}
        {selectedTier1 && (
          <>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <span className="text-stone-200">{selectedTier1.label}</span>
          </>
        )}
        {selectedTier2 && (
          <>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <span className="text-stone-200">{selectedTier2.label}</span>
          </>
        )}
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TIER 1: Select Division / Kanda / Chapter */}
      <div className="mt-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
          <FolderTree className="w-4 h-4 text-amber-400" />
          Select {getTier1Label()}
        </h3>

        {loadingTier1 ? (
          <div className="flex items-center gap-2 text-stone-400 text-xs py-4">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Loading {getTier1Label()}s...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {tier1Nodes.map((node) => {
              const active = selectedTier1?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedTier1(node);
                    setSelectedTier2(null);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    active
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md"
                      : "bg-stone-950/40 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-800/50"
                  }`}
                >
                  <div className="text-[10px] font-mono text-stone-500 uppercase">{getTier1Label()} {node.number}</div>
                  <div className="text-xs font-bold truncate mt-0.5">{node.label}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* TIER 2: Select Prashana / Sub-division if multi-tier */}
      {isMultiTier && selectedTier1 && (
        <div className="mt-6 pt-4 border-t border-stone-800">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" />
            Select {getTier2Label()} under {selectedTier1.label}
          </h3>

          {loadingTier2 ? (
            <div className="flex items-center gap-2 text-stone-400 text-xs py-4">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Loading {getTier2Label()}s...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {tier2Nodes.map((node) => {
                const active = selectedTier2?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedTier2(node)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      active
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md"
                        : "bg-stone-950/40 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-800/50"
                    }`}
                  >
                    <div className="text-[10px] font-mono text-stone-500 uppercase">{getTier2Label()} {node.number}</div>
                    <div className="text-xs font-bold truncate mt-0.5">{node.label}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VERSES RENDERER */}
      <div className="mt-8 pt-4 border-t border-stone-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-serif font-bold text-stone-200 flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-amber-400" />
            Verses & Sacred Mantras
          </h3>
          {verses.length > 0 && (
            <span className="text-xs font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {verses.length} Verses
            </span>
          )}
        </div>

        {loadingVerses ? (
          <div className="flex items-center gap-2 text-stone-400 text-xs py-8 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            <span>Loading sacred verses...</span>
          </div>
        ) : !selectedTier1 ? (
          <div className="p-8 text-center bg-stone-950/30 rounded-xl border border-stone-800/60 text-stone-500 text-xs">
            Please select a {getTier1Label()} above to explore verses.
          </div>
        ) : isMultiTier && !selectedTier2 ? (
          <div className="p-8 text-center bg-stone-950/30 rounded-xl border border-stone-800/60 text-stone-500 text-xs">
            Please select a {getTier2Label()} to view verses.
          </div>
        ) : verses.length === 0 ? (
          <div className="p-8 text-center bg-stone-950/30 rounded-xl border border-stone-800/60 text-stone-400 text-xs">
            No verses found under this section yet.
          </div>
        ) : (
          <div className="space-y-4">
            {verses.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-xl bg-stone-950/50 border border-stone-800 hover:border-stone-700/80 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    Verse {v.number}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500/40" />
                </div>

                {v.originalText && (
                  <p className="text-base sm:text-lg font-serif text-stone-100 leading-relaxed font-hindi pt-1">
                    {v.originalText}
                  </p>
                )}

                {/* Phonetic Transliteration hidden as requested */}

                {v.translation && (
                  <p className="text-xs text-stone-300 leading-relaxed pt-1 border-t border-stone-800/50">
                    {v.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
