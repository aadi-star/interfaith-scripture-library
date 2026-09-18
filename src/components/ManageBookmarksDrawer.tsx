import React, { useState } from "react";
import { X, Trash2, Edit2, Check, Bookmark, BookOpen } from "lucide-react";
import { ScriptureBook } from "../types";
import { FirestoreFavorite } from "../firebase";
import { SCRIPTURE_BOOKS } from "../scripturesRegistry";
import { getBookImage } from "./ScriptureBrowser";

interface ManageBookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FirestoreFavorite[];
  onRenameFavorite: (fav: FirestoreFavorite, newTitle: string) => Promise<void>;
  onDeleteFavorite: (fav: FirestoreFavorite) => Promise<void>;
  onNavigateToBook?: (bookKey: string) => void;
}

export const ManageBookmarksDrawer: React.FC<ManageBookmarksDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRenameFavorite,
  onDeleteFavorite,
  onNavigateToBook,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const startEditing = (fav: FirestoreFavorite) => {
    // Unique identifier can be fav.id (Firestore) or fav.itemKey (guest)
    const identifier = fav.id || fav.itemKey;
    setEditingId(identifier);
    setEditTitle(fav.title);
  };

  const handleSave = async (fav: FirestoreFavorite) => {
    const identifier = fav.id || fav.itemKey;
    if (!editTitle.trim()) return;
    setSavingId(identifier);
    try {
      await onRenameFavorite(fav, editTitle.trim());
      setEditingId(null);
    } catch (err) {
      console.error("Error renaming bookmark:", err);
    } finally {
      setSavingId(null);
    }
  };

  const getReligionBadgeColor = (religion?: string) => {
    switch (religion?.toLowerCase()) {
      case "hinduism": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "islam": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "christianity": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "judaism": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "buddhism": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "jainism": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div id="manage-bookmarks-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        id="manage-bookmarks-drawer-backdrop"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm cursor-pointer transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Sliding sheet */}
        <div
          id="manage-bookmarks-drawer-content"
          className="w-screen max-w-md bg-[#0f0f13] border-l border-white/10 text-slate-200 flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#141419]">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500/20" />
              <h2 className="text-base font-bold font-serif text-white tracking-wide">
                Manage Pinned Bookmarks
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader info */}
          <div className="px-6 py-3 border-b border-white/5 bg-[#17171e] flex items-center justify-between text-xs text-slate-400">
            <span>Customize and organize your Bookmarks shelf</span>
            <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {favorites.length} {favorites.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          {/* Bookmarks List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favorites.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-500">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-slate-300 font-semibold text-sm">
                    No bookmarks pinned
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                    Click the star icon on any scripture cover or reader title to pin books to your quick-access shelf.
                  </p>
                </div>
              </div>
            ) : (
              favorites.map((fav, index) => {
                const identifier = fav.id ? fav.id : `${fav.itemKey}_${index}`;
                const isEditing = editingId === identifier;
                const isSaving = savingId === identifier;

                // Attempt to find the scripture book metadata for imagery or fallback info
                const bookMeta = SCRIPTURE_BOOKS.find((b) => b.key === fav.itemKey);

                return (
                  <div
                    id={`bookmark-manage-item-${fav.itemKey}-${index}`}
                    key={identifier}
                    className="p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200 flex flex-col gap-3 group relative shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      {/* Optional book artwork placeholder */}
                      <div className="w-12 h-14 rounded-md bg-white/5 shrink-0 overflow-hidden border border-white/15 flex items-center justify-center">
                        {bookMeta ? (
                          <img
                            src={getBookImage(bookMeta).url}
                            alt={bookMeta.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                        ) : (
                          <BookOpen className="w-5 h-5 text-slate-600" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${getReligionBadgeColor(fav.religion || bookMeta?.religion)}`}>
                            {fav.religion || bookMeta?.religion || "Other"}
                          </span>
                          {bookMeta && bookMeta.title !== fav.title && (
                            <span className="text-[9px] font-mono text-slate-500 italic truncate" title={`Original title: ${bookMeta.title}`}>
                              Original: {bookMeta.title}
                            </span>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="bg-black/45 border border-amber-500/40 focus:border-amber-500 rounded-lg px-2.5 py-1 text-xs text-white outline-none w-full font-sans transition-colors"
                              placeholder="Rename bookmark title..."
                              disabled={isSaving}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave(fav);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => handleSave(fav)}
                              disabled={isSaving}
                              className="p-1.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black rounded-lg transition-colors cursor-pointer border border-emerald-500/20"
                              title="Save Title"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              disabled={isSaving}
                              className="p-1.5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group/title pr-16">
                            <h4 className="text-xs font-bold text-slate-100 font-sans tracking-wide leading-snug">
                              {fav.title}
                            </h4>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick navigation and controls row */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                      {onNavigateToBook ? (
                        <button
                          onClick={() => {
                            onNavigateToBook(fav.itemKey);
                            onClose();
                          }}
                          className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Go to Book</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      <div className="flex items-center gap-1">
                        {!isEditing && (
                          <button
                            onClick={() => startEditing(fav)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5"
                            title="Rename Pinned Title"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteFavorite(fav)}
                          className="p-1.5 rounded bg-rose-500/5 hover:bg-rose-500 hover:text-black text-rose-400 border border-rose-500/10 hover:border-transparent transition-all cursor-pointer"
                          title="Delete / Unpin Book"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
