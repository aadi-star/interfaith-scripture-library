import React, { useState } from "react";
import { X, Folder, Plus, FolderPlus, Check, Loader2, BookOpen } from "lucide-react";
import { VerseCollection, ReligionType } from "../types";

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: VerseCollection[];
  onCreateCollection: (name: string, description?: string) => Promise<string | null>;
  onToggleVerseInCollection: (collectionId: string, shouldAdd: boolean) => Promise<void>;
  alreadySavedCollectionIds: string[];
  verseDetail: {
    number: string | number;
    translation: string;
    originalText?: string;
    bookTitle: string;
    bookKey: string;
    religion: ReligionType;
    divisionNum: number;
    divisionName: string;
  };
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  isOpen,
  onClose,
  collections,
  onCreateCollection,
  onToggleVerseInCollection,
  alreadySavedCollectionIds,
  verseDetail,
}) => {
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      setIsCreating(true);
      const newId = await onCreateCollection(newFolderName.trim(), newFolderDesc.trim());
      if (newId) {
        // Automatically add to the newly created folder
        await onToggleVerseInCollection(newId, true);
        setNewFolderName("");
        setNewFolderDesc("");
        setShowCreateForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleFolderClick = async (collectionId: string) => {
    const isSaved = alreadySavedCollectionIds.includes(collectionId);
    try {
      setIsProcessingId(collectionId);
      await onToggleVerseInCollection(collectionId, !isSaved);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingId(null);
    }
  };

  const getReligionBadgeColor = (religion: ReligionType) => {
    switch (religion) {
      case "hinduism": return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      case "islam": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "christianity": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";
      case "judaism": return "bg-blue-500/10 text-blue-400 border-blue-500/25";
      case "buddhism": return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/25";
    }
  };

  return (
    <div id="add-to-collection-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        id="add-to-collection-container"
        className="relative w-full max-w-md bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl text-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141419] border-b border-white/5">
          <div className="flex items-center space-x-2.5">
            <Folder className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-white">Save Verse to Collections</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Active Verse Details preview */}
          <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${getReligionBadgeColor(verseDetail.religion)}`}>
                {verseDetail.religion}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {verseDetail.bookTitle} {verseDetail.divisionName} {verseDetail.divisionNum}:{verseDetail.number}
              </span>
            </div>
            {(() => {
              const isTranslHindi = /[\u0900-\u097F]/.test(verseDetail.translation || "");
              return (
                <p className={`text-xs text-slate-300 line-clamp-2 ${
                  isTranslHindi 
                    ? "font-hindi !leading-[1.8] !tracking-normal py-1" 
                    : "font-serif italic leading-relaxed"
                }`}>
                  &ldquo;{verseDetail.translation}&rdquo;
                </p>
              );
            })()}
          </div>

          {/* List of custom folders */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-1 border-b border-white/5">
              <span>My Folders</span>
              <span>Saved?</span>
            </div>

            {collections.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 font-serif">
                You haven't created any custom thematic collections yet.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {collections.map((col) => {
                  const isSaved = alreadySavedCollectionIds.includes(col.id);
                  const isProcessing = isProcessingId === col.id;
                  
                  return (
                    <button
                      key={col.id}
                      onClick={() => handleFolderClick(col.id)}
                      disabled={isCreating || isProcessingId !== null}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSaved 
                          ? "bg-amber-500/10 border-amber-500/30 text-white" 
                          : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03] text-slate-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <Folder className={`w-4 h-4 shrink-0 ${isSaved ? "text-amber-500" : "text-slate-400"}`} />
                        <div className="truncate">
                          <p className="text-xs font-semibold truncate leading-none">{col.name}</p>
                          {col.description && (
                            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-serif">{col.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="shrink-0 ml-2">
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                        ) : isSaved ? (
                          <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-black stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 hover:border-slate-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Create new collection trigger */}
          <div className="pt-2">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-dashed border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 text-xs text-slate-400 hover:text-amber-400 transition-all font-mono uppercase cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Create Custom Folder</span>
              </button>
            ) : (
              <form onSubmit={handleCreate} className="p-4 bg-[#141419] border border-white/10 rounded-xl space-y-3.5 animate-slide-up">
                <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">New Folder Details</span>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)} 
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-slate-400 font-mono">Folder Name (e.g., 'Verses on Hope') *</label>
                  <input
                    type="text"
                    required
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder title..."
                    className="w-full bg-[#0d0d12] border border-white/5 p-2 rounded-lg focus:border-amber-500 focus:outline-none text-slate-200"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-slate-400 font-mono">Description / Theme (Optional)</label>
                  <input
                    type="text"
                    value={newFolderDesc}
                    onChange={(e) => setNewFolderDesc(e.target.value)}
                    placeholder="e.g. Guidance during mornings, strength logs..."
                    className="w-full bg-[#0d0d12] border border-white/5 p-2 rounded-lg focus:border-amber-500 focus:outline-none text-slate-200"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newFolderName.trim()}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    {isCreating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>Create & Save</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
