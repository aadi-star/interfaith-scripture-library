import React, { useState } from "react";
import { Folder, Trash2, BookOpen, ExternalLink, Plus, Loader2, FolderPlus, FileText, ArrowRight, BookMarked, Search } from "lucide-react";
import { VerseCollection, CollectionVerseItem, ReligionType } from "../types";

interface ThematicCollectionsProps {
  collections: VerseCollection[];
  collectionVerses: CollectionVerseItem[];
  onCreateCollection: (name: string, description?: string) => Promise<string | null>;
  onDeleteCollection: (collectionId: string) => Promise<void>;
  onRemoveVerse: (itemId: string) => Promise<void>;
  onNavigateToVerse: (bookKey: string, chapter: number, verseNum: string | number) => void;
  isLoading?: boolean;
}

export const ThematicCollections: React.FC<ThematicCollectionsProps> = ({
  collections,
  collectionVerses,
  onCreateCollection,
  onDeleteCollection,
  onRemoveVerse,
  onNavigateToVerse,
  isLoading = false,
}) => {
  const [selectedColId, setSelectedColId] = useState<string | null>(null);
  const [newColName, setNewColName] = useState("");
  const [newColDesc, setNewColDesc] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    try {
      setIsCreating(true);
      const newId = await onCreateCollection(newColName.trim(), newColDesc.trim());
      if (newId) {
        setNewColName("");
        setNewColDesc("");
        setShowCreateForm(false);
        setSelectedColId(newId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const selectedCol = collections.find((c) => c.id === selectedColId);
  const displayedVerses = collectionVerses.filter(
    (v) => v.collectionId === selectedColId
  );

  const getReligionBadgeColor = (religion: ReligionType) => {
    switch (religion) {
      case "hinduism": return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      case "islam": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "christianity": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";
      case "judaism": return "bg-blue-500/10 text-blue-400 border-blue-500/25";
      case "buddhism": return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      case "jainism": return "bg-orange-500/10 text-orange-400 border-orange-500/25";
      case "mythology": return "bg-violet-500/10 text-violet-400 border-violet-500/25";
      case "history": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/25";
      case "space": return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/25";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/25";
    }
  };

  const filteredCollections = collections.filter(col => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      col.name.toLowerCase().includes(q) ||
      (col.description && col.description.toLowerCase().includes(q))
    );
  });

  return (
    <div id="thematic-collections-dashboard" className="space-y-6">
      {/* Upper Navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-serif text-white flex items-center space-x-2">
            <BookMarked className="w-5 h-5 text-amber-400" />
            <span>Thematic Collections & Study Folders</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl font-serif mt-0.5">
            Group scripture passages across different spiritual traditions into cohesive folders for customized thematic study.
          </p>
        </div>

        {/* Quick create button / bar */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-bold tracking-wide transition-all duration-150 transform hover:scale-[1.02] cursor-pointer shadow-md shadow-amber-500/10 font-mono uppercase"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Study Folder</span>
          </button>
        )}
      </div>

      {/* Manual Folder Creation Form */}
      {showCreateForm && (
        <form onSubmit={handleCreate} className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 animate-slide-up">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">Configure New Folder Theme</h4>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400 font-mono">Folder Name (e.g. 'Verses on Hope', 'Moral Guidance') *</label>
              <input
                type="text"
                required
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="Give the folder a concise title..."
                className="w-full bg-[#0d0d12] border border-white/15 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none text-slate-200"
              />
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400 font-mono">Therapy / Study Description (Optional)</label>
              <input
                type="text"
                value={newColDesc}
                onChange={(e) => setNewColDesc(e.target.value)}
                placeholder="Briefly state why you are grouping these passages..."
                className="w-full bg-[#0d0d12] border border-white/15 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isCreating || !newColName.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {isCreating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Create Collection</span>
            </button>
          </div>
        </form>
      )}

      {/* Two Column Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Folders Menu */}
        <div className="lg:col-span-4 p-4 bg-white/[0.01] border border-white/10 rounded-2xl space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search custom folders..."
              className="w-full bg-[#08080c] border border-white/10 rounded-xl py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-amber-500/50 text-slate-200 placeholder-slate-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[450px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                <span>Loading your scripture library...</span>
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 font-serif">
                {searchQuery ? "No matching folders found." : "Create your first thematic folder to begin grouping scriptures."}
              </div>
            ) : (
              filteredCollections.map((col) => {
                const isSelected = selectedColId === col.id;
                const verseCount = collectionVerses.filter(
                  (v) => v.collectionId === col.id
                ).length;

                return (
                  <div
                    key={col.id}
                    className={`group w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/30 text-white"
                        : "bg-[#0b0c10] border-white/5 hover:border-white/10 text-slate-300 hover:bg-white/[0.02]"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedColId(col.id)}
                      className="flex-1 flex items-center space-x-3 pr-2 truncate cursor-pointer h-full"
                    >
                      <Folder
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? "text-amber-500 scale-105" : "text-slate-400 group-hover:scale-105"
                        }`}
                      />
                      <div className="truncate py-0.5">
                        <div className="text-xs font-bold truncate leading-none flex items-center gap-1.5">
                          <span>{col.name}</span>
                          <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-white/5 border border-white/5 text-slate-400 select-none shrink-0">
                            {verseCount} {verseCount === 1 ? "verse" : "verses"}
                          </span>
                        </div>
                        {col.description && (
                          <div className="text-[10px] text-slate-500 truncate font-serif mt-1 italic">
                            {col.description}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Delete folder button */}
                    <button
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete the folder "${col.name}"? This will untag all verses in it.`)) {
                          await onDeleteCollection(col.id);
                          if (selectedColId === col.id) setSelectedColId(null);
                        }
                      }}
                      className="p-1 px-1.5 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded transition-all cursor-pointer select-none shrink-0"
                      title={`Delete Folder: ${col.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Verses under Active Folder */}
        <div id="selected-collection-workspace" className="lg:col-span-8 p-5 bg-white/[0.01] border border-white/10 rounded-2xl min-h-[430px] flex flex-col justify-between">
          {!selectedColId ? (
            <div className="m-auto text-center space-y-3.5 py-12 max-w-md">
              <Folder className="w-12 h-12 text-slate-600 mx-auto opacity-30 animate-pulse" />
              <div>
                <h4 className="text-sm font-semibold text-slate-300 font-serif">No Folder Selected</h4>
                <p className="text-xs text-slate-500 font-serif mt-1">
                  Choose an existing thematic folder from the column on the left, or create a brand-new folder to browse your curated collections of interfaith scriptures.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              {/* Active Folder Header */}
              <div className="border-b border-white/5 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-white font-serif flex items-center space-x-2">
                      <Folder className="w-4 h-4 text-amber-400" />
                      <span>{selectedCol?.name}</span>
                    </h4>
                    {selectedCol?.description && (
                      <p className="text-xs text-slate-400 font-serif italic mt-0.5 max-w-xl">
                        &ldquo;{selectedCol.description}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center space-x-1.5 sm:text-right">
                    <span>Active Theme Category</span>
                    <span>•</span>
                    <span>{displayedVerses.length} Saved Passages</span>
                  </div>
                </div>
              </div>

              {/* Verses List */}
              <div className="space-y-4 flex-1">
                {displayedVerses.length === 0 ? (
                  <div className="py-16 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl max-w-md mx-auto my-6 space-y-3">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto opacity-45" />
                    <div>
                      <h5 className="text-xs font-bold uppercase font-mono text-slate-400">This Folder is Empty</h5>
                      <p className="text-xs text-slate-500 font-serif mt-1">
                        Open the **Scripture Viewer** tab, select any holy text, choose a chapter, and click the **Folder icon** on a verse to save it to this collection.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {displayedVerses.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className="p-5 bg-black/30 border border-white/5 hover:border-white/10 rounded-xl space-y-2.5 transition-all relative group/item"
                        >
                          {/* Top Meta info */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${getReligionBadgeColor(item.religion)}`}>
                                {item.religion}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400 font-mono">
                                {item.bookTitle} {item.divisionName} {item.divisionNum}:{item.verseNumber}
                              </span>
                            </div>

                            {/* Actions on item */}
                            <div className="flex items-center space-x-1">
                              {/* Open in Reader button */}
                              <button
                                onClick={() =>
                                  onNavigateToVerse(
                                    item.bookKey,
                                    item.divisionNum,
                                    item.verseNumber
                                  )
                                }
                                className="p-1 text-slate-400 hover:text-amber-400 hover:bg-white/5 rounded text-[10px] font-mono uppercase flex items-center space-x-0.5 cursor-pointer"
                                title={`Navigate to ${item.bookTitle} Chapter ${item.divisionNum}`}
                              >
                                <span>Reader</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>

                              {/* Remove button */}
                              <button
                                onClick={async () => {
                                  if (confirm("Remove this verse from this collection?")) {
                                    await onRemoveVerse(item.id);
                                  }
                                }}
                                className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded transition-all cursor-pointer"
                                title="Remove verse from folder"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Verse Verse Translation Content */}
                          <div className="space-y-1.5">
                            {(() => {
                              const isTranslHindi = /[\u0900-\u097F]/.test(item.translation || "");
                              return (
                                <p className={`text-xs sm:text-sm text-slate-200 border-l-2 border-amber-500/20 pl-3 ${
                                  isTranslHindi 
                                    ? "font-hindi !leading-[1.8] !tracking-normal py-1" 
                                    : "font-serif italic leading-relaxed"
                                }`}>
                                  &ldquo;{item.translation}&rdquo;
                                </p>
                              );
                            })()}
                            {item.originalText && (
                              (() => {
                                const isHindi = /[\u0900-\u097F]/.test(item.originalText);
                                return (
                                  <p className={`text-[11px] text-slate-400 pl-3 font-medium opacity-65 ${
                                    isHindi 
                                      ? "font-hindi leading-[1.8] tracking-normal py-0.5" 
                                      : "font-serif leading-relaxed"
                                  }`}>
                                    {item.originalText}
                                  </p>
                                );
                              })()
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
